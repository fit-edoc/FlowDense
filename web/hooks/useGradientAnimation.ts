'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GradientState, AnimationConfig } from '@/types';
import { injectAnimationKeyframes, getAnimationStyle, AnimationType } from '@/lib/gradients/animations';

interface UseGradientAnimationReturn {
    gradientStyle: React.CSSProperties;
    animationStyle: React.CSSProperties;
    isAnimating: boolean;
    startAnimation: () => void;
    stopAnimation: () => void;
    toggleAnimation: () => void;
}

export function useGradientAnimation(
    gradientState: GradientState
): UseGradientAnimationReturn {
    const [isAnimating, setIsAnimating] = useState(gradientState.animation.enabled);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        injectAnimationKeyframes();
    }, []);

    useEffect(() => {
        setIsAnimating(gradientState.animation.enabled);
    }, [gradientState.animation.enabled]);

    const generateGradientCSS = useCallback(() => {
        const { colors, angle, type } = gradientState;
        const colorStops = colors
            .map((c) => `${c.color} ${c.position}%`)
            .join(', ');

        switch (type) {
            case 'radial':
                return `radial-gradient(circle, ${colorStops})`;
            case 'conic':
                return `conic-gradient(from ${angle}deg, ${colorStops})`;
            default:
                return `linear-gradient(${angle}deg, ${colorStops})`;
        }
    }, [gradientState]);

    const gradientStyle: React.CSSProperties = {
        background: generateGradientCSS(),
        backgroundSize: isAnimating && gradientState.animation.type === 'shift' ? '200% 200%' : '100% 100%',
    };

    const animationStyle: React.CSSProperties = isAnimating
        ? getAnimationStyle(
            gradientState.animation.type as AnimationType,
            gradientState.animation.duration,
            gradientState.animation.easing
        )
        : {};

    const startAnimation = useCallback(() => {
        setIsAnimating(true);
    }, []);

    const stopAnimation = useCallback(() => {
        setIsAnimating(false);
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
    }, []);

    const toggleAnimation = useCallback(() => {
        setIsAnimating((prev) => !prev);
    }, []);

    useEffect(() => {
        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    return {
        gradientStyle,
        animationStyle,
        isAnimating,
        startAnimation,
        stopAnimation,
        toggleAnimation,
    };
}
