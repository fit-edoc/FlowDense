'use client';

import React from 'react';
import { VideoSize } from '@/types';
import { usePresetSizes } from '@/hooks/usePresetSizes';
import { cn } from '@/lib/utils';

interface SizeSelectorProps {
    selectedSize: VideoSize;
    onChange: (size: VideoSize) => void;
    className?: string;
}

export function SizeSelector({ selectedSize, onChange, className }: SizeSelectorProps) {
    const { sizes } = usePresetSizes();

    const getAspectIcon = (ratio: string) => {
        switch (ratio) {
            case '16:9':
                return (
                    <div className="w-8 h-[18px] border-2 border-current rounded-sm" />
                );
            case '9:16':
                return (
                    <div className="w-[18px] h-8 border-2 border-current rounded-sm" />
                );
            case '1:1':
                return (
                    <div className="w-6 h-6 border-2 border-current rounded-sm" />
                );
            case '4:5':
                return (
                    <div className="w-5 h-[25px] border-2 border-current rounded-sm" />
                );
            case '4:3':
                return (
                    <div className="w-8 h-6 border-2 border-current rounded-sm" />
                );
            default:
                return (
                    <div className="w-6 h-6 border-2 border-current rounded-sm" />
                );
        }
    };

    return (
        <div className={cn('space-y-3', className)}>
            <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wide">
                Video Size
            </h3>
            <div className="grid grid-cols-2 gap-2">
                {sizes.map((size) => (
                    <button
                        key={`${size.width}x${size.height}`}
                        onClick={() => onChange(size)}
                        className={cn(
                            'flex items-center gap-3 p-3 rounded-lg transition-all duration-200',
                            selectedSize.width === size.width && selectedSize.height === size.height
                                ? 'bg-white text-black'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                        )}
                    >
                        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10">
                            {getAspectIcon(size.aspectRatio)}
                        </div>
                        <div className="text-left">
                            <div className="text-sm font-medium">{size.aspectRatio}</div>
                            <div className="text-xs opacity-60">
                                {size.width}×{size.height}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
