import { GradientPreset } from '@/types';

export const gradientPresets: GradientPreset[] = [
    {
        id: 'sunset-vibes',
        name: 'Sunset Vibes',
        colors: [
            { color: '#FF6B6B', position: 0 },
            { color: '#FEC89A', position: 50 },
            { color: '#FFD93D', position: 100 },
        ],
        angle: 135,
        type: 'linear',
    },
    {
        id: 'ocean-breeze',
        name: 'Ocean Breeze',
        colors: [
            { color: '#667EEA', position: 0 },
            { color: '#64B5F6', position: 50 },
            { color: '#4DD0E1', position: 100 },
        ],
        angle: 180,
        type: 'linear',
    },
    {
        id: 'aurora-borealis',
        name: 'Aurora Borealis',
        colors: [
            { color: '#00C9FF', position: 0 },
            { color: '#92FE9D', position: 50 },
            { color: '#00C9FF', position: 100 },
        ],
        angle: 45,
        type: 'linear',
    },
    {
        id: 'purple-haze',
        name: 'Purple Haze',
        colors: [
            { color: '#7C3AED', position: 0 },
            { color: '#A855F7', position: 50 },
            { color: '#EC4899', position: 100 },
        ],
        angle: 135,
        type: 'linear',
    },
    {
        id: 'midnight-city',
        name: 'Midnight City',
        colors: [
            { color: '#0F0F23', position: 0 },
            { color: '#1E1E3F', position: 50 },
            { color: '#2D2D5A', position: 100 },
        ],
        angle: 180,
        type: 'linear',
    },
    {
        id: 'tropical-paradise',
        name: 'Tropical Paradise',
        colors: [
            { color: '#11998E', position: 0 },
            { color: '#38EF7D', position: 100 },
        ],
        angle: 135,
        type: 'linear',
    },
    {
        id: 'cotton-candy',
        name: 'Cotton Candy',
        colors: [
            { color: '#FFB6C1', position: 0 },
            { color: '#E6E6FA', position: 50 },
            { color: '#87CEEB', position: 100 },
        ],
        angle: 90,
        type: 'linear',
    },
    {
        id: 'fire-storm',
        name: 'Fire Storm',
        colors: [
            { color: '#FF4E50', position: 0 },
            { color: '#F9D423', position: 100 },
        ],
        angle: 45,
        type: 'linear',
    },
    {
        id: 'royal-blue',
        name: 'Royal Blue',
        colors: [
            { color: '#141E30', position: 0 },
            { color: '#243B55', position: 100 },
        ],
        angle: 180,
        type: 'linear',
    },
    {
        id: 'neon-lights',
        name: 'Neon Lights',
        colors: [
            { color: '#FF00FF', position: 0 },
            { color: '#00FFFF', position: 50 },
            { color: '#FF00FF', position: 100 },
        ],
        angle: 90,
        type: 'linear',
    },
    {
        id: 'forest-glow',
        name: 'Forest Glow',
        colors: [
            { color: '#134E5E', position: 0 },
            { color: '#71B280', position: 100 },
        ],
        angle: 135,
        type: 'linear',
    },
    {
        id: 'cosmic-fusion',
        name: 'Cosmic Fusion',
        colors: [
            { color: '#FF0099', position: 0 },
            { color: '#493240', position: 50 },
            { color: '#0066FF', position: 100 },
        ],
        angle: 45,
        type: 'linear',
    },
];

export function getPresetById(id: string): GradientPreset | undefined {
    return gradientPresets.find((preset) => preset.id === id);
}

export function generateGradientCSS(preset: GradientPreset): string {
    const colorStops = preset.colors
        .map((c) => `${c.color} ${c.position}%`)
        .join(', ');

    switch (preset.type) {
        case 'radial':
            return `radial-gradient(circle, ${colorStops})`;
        case 'conic':
            return `conic-gradient(from ${preset.angle}deg, ${colorStops})`;
        default:
            return `linear-gradient(${preset.angle}deg, ${colorStops})`;
    }
}
