'use client';

import React, { forwardRef } from 'react';
import { GradientState } from '@/types';
import { useGradientAnimation } from '@/hooks/useGradientAnimation';
import { cn } from '@/lib/utils';

interface GradientBackgroundProps {
    gradientState: GradientState;
    className?: string;
}

export const GradientBackground = forwardRef<HTMLDivElement, GradientBackgroundProps>(
    ({ gradientState, className }, ref) => {
        const { gradientStyle, animationStyle, isAnimating } = useGradientAnimation(gradientState);

        return (
            <div
                ref={ref}
                className={cn(
                    'absolute inset-0 w-full h-full',
                    className
                )}
                style={{
                    ...gradientStyle,
                    ...animationStyle,
                    willChange: isAnimating ? 'background-position, filter, transform' : 'auto',
                }}
            />
        );
    }
);

GradientBackground.displayName = 'GradientBackground';
