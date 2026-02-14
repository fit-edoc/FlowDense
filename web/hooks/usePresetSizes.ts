'use client';

import { useMemo } from 'react';
import { VideoSize, AspectRatio } from '@/types';

interface UsePresetSizesReturn {
    sizes: VideoSize[];
    getSizeByAspectRatio: (ratio: AspectRatio) => VideoSize;
    getCustomSize: (width: number, height: number, label?: string) => VideoSize;
}

export function usePresetSizes(): UsePresetSizesReturn {
    const sizes = useMemo<VideoSize[]>(
        () => [
            {
                width: 1920,
                height: 1080,
                label: 'Full HD (1920×1080)',
                aspectRatio: '16:9',
            },
            {
                width: 1080,
                height: 1920,
                label: 'Vertical HD (1080×1920)',
                aspectRatio: '9:16',
            },
            {
                width: 1080,
                height: 1080,
                label: 'Square (1080×1080)',
                aspectRatio: '1:1',
            },
            {
                width: 1080,
                height: 1350,
                label: 'Portrait (1080×1350)',
                aspectRatio: '4:5',
            },
            {
                width: 1440,
                height: 1080,
                label: 'Standard (1440×1080)',
                aspectRatio: '4:3',
            },
            {
                width: 3840,
                height: 2160,
                label: '4K UHD (3840×2160)',
                aspectRatio: '16:9',
            },
            {
                width: 2160,
                height: 3840,
                label: '4K Vertical (2160×3840)',
                aspectRatio: '9:16',
            },
            {
                width: 1280,
                height: 720,
                label: 'HD Ready (1280×720)',
                aspectRatio: '16:9',
            },
        ],
        []
    );

    const getSizeByAspectRatio = useMemo(
        () => (ratio: AspectRatio): VideoSize => {
            const found = sizes.find((s) => s.aspectRatio === ratio);
            return found || sizes[0];
        },
        [sizes]
    );

    const getCustomSize = useMemo(
        () =>
            (width: number, height: number, label?: string): VideoSize => {
                const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
                const divisor = gcd(width, height);
                const ratioW = width / divisor;
                const ratioH = height / divisor;

                // Map to closest standard aspect ratio
                const ratioMap: Record<string, AspectRatio> = {
                    '16:9': '16:9',
                    '9:16': '9:16',
                    '1:1': '1:1',
                    '4:5': '4:5',
                    '4:3': '4:3',
                };

                const ratioKey = `${ratioW}:${ratioH}`;
                const aspectRatio = ratioMap[ratioKey] || '16:9';

                return {
                    width,
                    height,
                    label: label || `Custom (${width}×${height})`,
                    aspectRatio,
                };
            },
        []
    );

    return {
        sizes,
        getSizeByAspectRatio,
        getCustomSize,
    };
}
