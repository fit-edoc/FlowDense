'use client';

import React, { useState, useEffect } from 'react';
import { GradientBackground } from '@/components/canvas/GradientBackground';
import { GradientState } from '@/types';
import { gradientPresets } from '@/lib/gradients/presets';
import Link from 'next/link';

const defaultGradient: GradientState = {
    colors: gradientPresets[0].colors,
    angle: gradientPresets[0].angle,
    type: gradientPresets[0].type,
    animation: {
        enabled: true,
        duration: 4,
        type: 'shift',
        easing: 'ease-in-out',
    },
};

export default function PreviewPage() {
    const [gradientState, setGradientState] = useState<GradientState>(defaultGradient);
    const [isControlsVisible, setIsControlsVisible] = useState(true);

    // Load state from localStorage if available
    useEffect(() => {
        const saved = localStorage.getItem('gradientState');
        if (saved) {
            try {
                setGradientState(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load saved gradient state');
            }
        }
    }, []);

    // Hide controls after 3 seconds of inactivity
    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const handleMouseMove = () => {
            setIsControlsVisible(true);
            clearTimeout(timeout);
            timeout = setTimeout(() => setIsControlsVisible(false), 3000);
        };

        window.addEventListener('mousemove', handleMouseMove);
        handleMouseMove(); // Start the timeout

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearTimeout(timeout);
        };
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                window.history.back();
            }
            if (e.key === ' ') {
                e.preventDefault();
                setGradientState((prev) => ({
                    ...prev,
                    animation: {
                        ...prev.animation,
                        enabled: !prev.animation.enabled,
                    },
                }));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="fixed inset-0 bg-black">
            {/* Full-screen gradient */}
            <GradientBackground gradientState={gradientState} />

            {/* Controls Overlay */}
            <div
                className={`fixed inset-x-0 top-0 z-10 transition-opacity duration-300 ${isControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            >
                <div className="p-6 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-lg transition-colors"
                    >
                        <span>←</span>
                        <span className="text-sm font-medium">Back to Editor</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() =>
                                setGradientState((prev) => ({
                                    ...prev,
                                    animation: {
                                        ...prev.animation,
                                        enabled: !prev.animation.enabled,
                                    },
                                }))
                            }
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-lg text-sm font-medium transition-colors"
                        >
                            {gradientState.animation.enabled ? '⏸ Pause' : '▶ Play'}
                        </button>

                        <div className="text-xs text-white/50 bg-white/10 backdrop-blur-lg px-3 py-2 rounded-lg">
                            Press <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-white">ESC</kbd> to exit
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Info */}
            <div
                className={`fixed inset-x-0 bottom-0 z-10 transition-opacity duration-300 ${isControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            >
                <div className="p-6 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-sm text-white/60">
                        Full-screen preview mode • Press <kbd className="px-1 py-0.5 bg-white/20 rounded">Space</kbd> to toggle animation
                    </p>
                </div>
            </div>
        </div>
    );
}
