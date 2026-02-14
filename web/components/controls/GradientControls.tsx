'use client';

import React from 'react';
import { GradientState, GradientColor } from '@/types';
import { gradientPresets, generateGradientCSS } from '@/lib/gradients/presets';
import { cn } from '@/lib/utils';

interface GradientControlsProps {
    gradientState: GradientState;
    onChange: (state: GradientState) => void;
    className?: string;
}

export function GradientControls({
    gradientState,
    onChange,
    className,
}: GradientControlsProps) {
    const handleColorChange = (index: number, color: string) => {
        const newColors = [...gradientState.colors];
        newColors[index] = { ...newColors[index], color };
        onChange({ ...gradientState, colors: newColors });
    };

    const handlePositionChange = (index: number, position: number) => {
        const newColors = [...gradientState.colors];
        newColors[index] = { ...newColors[index], position };
        onChange({ ...gradientState, colors: newColors });
    };

    const handleAngleChange = (angle: number) => {
        onChange({ ...gradientState, angle });
    };

    const handleTypeChange = (type: 'linear' | 'radial' | 'conic') => {
        onChange({ ...gradientState, type });
    };

    const handleAnimationToggle = () => {
        onChange({
            ...gradientState,
            animation: {
                ...gradientState.animation,
                enabled: !gradientState.animation.enabled,
            },
        });
    };

    const handleAnimationTypeChange = (type: 'shift' | 'rotate' | 'pulse' | 'wave') => {
        onChange({
            ...gradientState,
            animation: { ...gradientState.animation, type },
        });
    };

    const handleAnimationDurationChange = (duration: number) => {
        onChange({
            ...gradientState,
            animation: { ...gradientState.animation, duration },
        });
    };

    const handlePresetSelect = (presetId: string) => {
        const preset = gradientPresets.find((p) => p.id === presetId);
        if (preset) {
            onChange({
                ...gradientState,
                colors: preset.colors,
                angle: preset.angle,
                type: preset.type,
            });
        }
    };

    const addColor = () => {
        if (gradientState.colors.length >= 5) return;
        const lastPosition = gradientState.colors[gradientState.colors.length - 1]?.position || 0;
        const newPosition = Math.min(lastPosition + 25, 100);
        onChange({
            ...gradientState,
            colors: [...gradientState.colors, { color: '#ffffff', position: newPosition }],
        });
    };

    const removeColor = (index: number) => {
        if (gradientState.colors.length <= 2) return;
        const newColors = gradientState.colors.filter((_, i) => i !== index);
        onChange({ ...gradientState, colors: newColors });
    };

    return (
        <div className={cn('space-y-6 min-h-0', className)}>
            {/* Presets */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wide">
                    Presets
                </h3>
                <div className="grid grid-cols-4 gap-4">
                    {gradientPresets.slice(0, 8).map((preset) => (
                        <button
                            key={preset.id}
                            onClick={() => handlePresetSelect(preset.id)}
                            className="aspect-square rounded-lg overflow-hidden ring-2 ring-transparent hover:ring-white/50 transition-all duration-200 hover:scale-105"
                            style={{ background: generateGradientCSS(preset) }}
                            title={preset.name}
                        />
                    ))}
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {gradientPresets.slice(8).map((preset) => (
                        <button
                            key={preset.id}
                            onClick={() => handlePresetSelect(preset.id)}
                            className="aspect-square rounded-lg overflow-hidden ring-2 ring-transparent hover:ring-white/50 transition-all duration-200 hover:scale-105"
                            style={{ background: generateGradientCSS(preset) }}
                            title={preset.name}
                        />
                    ))}
                </div>
            </div>

            {/* Gradient Type */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wide">
                    Gradient Type
                </h3>
                <div className="flex gap-2">
                    {(['linear', 'radial', 'conic'] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => handleTypeChange(type)}
                            className={cn(
                                'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200',
                                gradientState.type === type
                                    ? 'bg-white text-black'
                                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                            )}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Colors */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wide">
                        Colors
                    </h3>
                    <button
                        onClick={addColor}
                        disabled={gradientState.colors.length >= 5}
                        className="text-xs bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1 rounded-md transition-colors"
                    >
                        + Add
                    </button>
                </div>
                <div className="space-y-3">
                    {gradientState.colors.map((color, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className="relative">
                                <input
                                    type="color"
                                    value={color.color}
                                    onChange={(e) => handleColorChange(index, e.target.value)}
                                    className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                                />
                            </div>
                            <input
                                type="text"
                                value={color.color}
                                onChange={(e) => handleColorChange(index, e.target.value)}
                                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white font-mono"
                            />
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={color.position}
                                onChange={(e) => handlePositionChange(index, parseInt(e.target.value))}
                                className="w-20 accent-white"
                            />
                            <span className="w-8 text-xs text-white/60">{color.position}%</span>
                            {gradientState.colors.length > 2 && (
                                <button
                                    onClick={() => removeColor(index)}
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Angle */}
            {gradientState.type !== 'radial' && (
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wide">
                        Angle: {gradientState.angle}°
                    </h3>
                    <input
                        type="range"
                        min="0"
                        max="360"
                        value={gradientState.angle}
                        onChange={(e) => handleAngleChange(parseInt(e.target.value))}
                        className="w-full accent-white"
                    />
                </div>
            )}

            {/* Animation */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wide">
                        Animation
                    </h3>
                    <button
                        onClick={handleAnimationToggle}
                        className={cn(
                            'w-12 h-6 rounded-full transition-colors duration-200 relative',
                            gradientState.animation.enabled ? 'bg-green-400' : 'bg-white/20'
                        )}
                    >
                        <span
                            className={cn(
                                'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200',
                                gradientState.animation.enabled ? 'translate-x-1' : '-translate-x-5'
                            )}
                        />
                    </button>
                </div>

                {gradientState.animation.enabled && (
                    <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-2">
                            {(['shift', 'rotate', 'pulse', 'wave'] as const).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleAnimationTypeChange(type)}
                                    className={cn(
                                        'py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200',
                                        gradientState.animation.type === type
                                            ? 'bg-white text-black'
                                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                                    )}
                                >
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-white/60">
                                Duration: {gradientState.animation.duration}s
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                step="0.5"
                                value={gradientState.animation.duration}
                                onChange={(e) => handleAnimationDurationChange(parseFloat(e.target.value))}
                                className="w-full accent-white"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
