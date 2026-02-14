'use client';

import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { CanvasState } from '@/types';
import { GradientBackground } from './GradientBackground';
import { ContentContainer } from './ContentContainer';
import { cn } from '@/lib/utils';

interface VideoCanvasProps {
    state: CanvasState;
    className?: string;
    showBorder?: boolean;
    isRecording?: boolean;
}

export interface VideoCanvasRef {
    getCanvas: () => HTMLCanvasElement | null;
    captureFrame: () => string | null;
}

export const VideoCanvas = forwardRef<VideoCanvasRef, VideoCanvasProps>(
    ({ state, className, showBorder = true, isRecording = false }, ref) => {
        const containerRef = useRef<HTMLDivElement>(null);
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const gradientRef = useRef<HTMLDivElement>(null);

        useImperativeHandle(ref, () => ({
            getCanvas: () => canvasRef.current,
            captureFrame: () => {
                if (!canvasRef.current) return null;
                return canvasRef.current.toDataURL('image/png');
            },
        }));

        // Sync the visual container to the hidden canvas for recording
        useEffect(() => {
            // Only run the expensive canvas sync loop during active recording
            if (!isRecording) return;

            const syncToCanvas = () => {
                if (!containerRef.current || !canvasRef.current) return;

                const ctx = canvasRef.current.getContext('2d');
                if (!ctx) return;

                // Draw the container content to canvas using html2canvas or direct drawing
                // For now, we'll use a simplified approach with computed styles
                const { width, height } = state.size;
                canvasRef.current.width = width;
                canvasRef.current.height = height;

                if (gradientRef.current) {
                    const now = Date.now();

                    // Save context for transforms/filters
                    ctx.save();

                    // Handle Animations
                    if (state.gradient.animation.enabled) {
                        const { type, duration, easing } = state.gradient.animation;
                        const durationMs = duration * 1000;
                        const t = (now % durationMs) / durationMs;

                        // Basic ease-in-out function
                        const easeInOut = (x: number) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

                        // Triangular wave for ping-pong animations (0 -> 1 -> 0)
                        const getPingPong = (t: number) => {
                            const phase = t < 0.5 ? t * 2 : 2 - (t * 2);
                            return easing === 'linear' ? phase : easeInOut(phase);
                        };

                        if (type === 'shift') {
                            const progress = getPingPong(t);
                            // Shift moves background-position from 0% 50% to 100% 50%
                            // And background-size is 200% 200%

                            // 1. Translate based on progress (0 -> -width)
                            // We shift X by -width * progress to move from left (0) to right (100% of container which is 50% of image)
                            // Note: background-position: 100% means right edge of image hits right edge of container.
                            // Image width is 2W. Container W.
                            // Right edge of image is at 2W. Right edge of container is W.
                            // So image is shifted by -W.
                            ctx.translate(-progress * width, -0.5 * height);

                            // 2. Scale up (200% size)
                            ctx.scale(2, 2);

                        } else if (type === 'rotate') {
                            // Hue rotate 0 -> 360deg
                            const angle = t * 360;
                            ctx.filter = `hue-rotate(${angle}deg)`;

                        } else if (type === 'pulse') {
                            const progress = getPingPong(t);
                            // Scale 1 -> 1.02, Opacity 1 -> 0.8
                            const scale = 1 + (progress * 0.02);
                            const opacity = 1 - (progress * 0.2);

                            // Center scale
                            ctx.translate(width / 2, height / 2);
                            ctx.scale(scale, scale);
                            ctx.translate(-width / 2, -height / 2);

                            ctx.globalAlpha = opacity;

                        } else if (type === 'wave') {
                            const progress = getPingPong(t);
                            // Size 100% -> 200%
                            const scale = 1 + progress;

                            // Top-left anchor (default background-position)
                            ctx.scale(scale, scale);
                        }
                    }

                    // Parse and recreate gradient on canvas
                    // Fill with first color as base
                    ctx.fillStyle = state.gradient.colors[0]?.color || '#000';
                    ctx.fillRect(0, 0, width, height);

                    // Create gradient object
                    const { colors, angle, type } = state.gradient;
                    let gradientFill: CanvasGradient | string | null = null;

                    if (type === 'linear') {
                        const angleRad = (angle * Math.PI) / 180;
                        const x1 = width / 2 - Math.cos(angleRad) * width;
                        const y1 = height / 2 - Math.sin(angleRad) * height;
                        const x2 = width / 2 + Math.cos(angleRad) * width;
                        const y2 = height / 2 + Math.sin(angleRad) * height;

                        gradientFill = ctx.createLinearGradient(x1, y1, x2, y2);
                    } else if (type === 'radial') {
                        gradientFill = ctx.createRadialGradient(
                            width / 2, height / 2, 0,
                            width / 2, height / 2, Math.max(width, height) / 2
                        );
                    }

                    if (gradientFill) {
                        // Apply color stops
                        colors.forEach((c) => {
                            gradientFill.addColorStop(c.position / 100, c.color);
                        });
                        ctx.fillStyle = gradientFill;

                        // Fill rectangle covering the area.
                        // When ctx.scale(2,2) is used (e.g. for shift/wave), fillRect(0,0,width,height) 
                        // effectively draws a 2W x 2H rectangle in screen space, and the gradient coordinates 
                        // are similarly scaled, ensuring the gradient covers the expanded area as intended.
                        ctx.fillRect(0, 0, width, height);
                    }

                    ctx.restore();
                }
            };

            const animationId = requestAnimationFrame(function loop() {
                syncToCanvas();
                requestAnimationFrame(loop);
            });

            return () => cancelAnimationFrame(animationId);
        }, [state, isRecording]);


        return (
            <div className={cn('relative', className)}>
                {/* Visual display container */}
                <div
                    ref={containerRef}
                    className={cn(
                        'relative overflow-hidden bg-black',
                        showBorder && 'ring-2 ring-white/10 rounded-lg shadow-2xl'
                    )}
                    style={{
                        aspectRatio: `${state.size.width} / ${state.size.height}`,
                        maxWidth: '100%',
                        maxHeight: '70vh',
                    }}
                >
                    <GradientBackground
                        ref={gradientRef}
                        gradientState={state.gradient}
                    />
                    <ContentContainer config={state.content} />
                </div>

                {/* Hidden canvas for recording */}
                <canvas
                    ref={canvasRef}
                    className="hidden"
                    width={state.size.width}
                    height={state.size.height}
                />

                {/* Size indicator */}
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white/70 text-xs px-2 py-1 rounded-md">
                    {state.size.width} × {state.size.height}
                </div>
            </div>
        );
    }
);

VideoCanvas.displayName = 'VideoCanvas';
