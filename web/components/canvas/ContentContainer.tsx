'use client';

import React from 'react';
import { ContentConfig } from '@/types';
import { cn } from '@/lib/utils';

interface ContentContainerProps {
    config: ContentConfig;
    className?: string;
    children?: React.ReactNode;
}

export function ContentContainer({ config, className, children }: ContentContainerProps) {
    if (!config.enabled) return null;

    const containerStyle: React.CSSProperties = {
        fontSize: config.style?.fontSize ? `${config.style.fontSize}px` : '24px',
        fontFamily: config.style?.fontFamily || 'inherit',
        color: config.style?.color || '#ffffff',
        padding: config.style?.padding ? `${config.style.padding}px` : '20px',
        borderRadius: config.style?.borderRadius ? `${config.style.borderRadius}px` : '12px',
        backgroundColor: config.style?.backgroundColor || 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
    };

    return (
        <div
            className={cn(
                'absolute inset-0 flex items-center justify-center z-10',
                className
            )}
        >
            <div
                className="max-w-[80%] max-h-[80%] overflow-hidden shadow-2xl"
                style={containerStyle}
            >
                {config.type === 'text' && config.text && (
                    <p className="text-center whitespace-pre-wrap">{config.text}</p>
                )}

                {config.type === 'image' && config.src && (
                    <img
                        src={config.src}
                        alt="Content"
                        className="max-w-full max-h-full object-contain rounded-lg"
                    />
                )}

                {config.type === 'video' && config.src && (
                    <video
                        src={config.src}
                        className="max-w-full max-h-full object-contain rounded-lg"
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                )}

                {children}
            </div>
        </div>
    );
}
