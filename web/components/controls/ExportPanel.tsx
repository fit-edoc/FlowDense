'use client';

import React from 'react';
import { ExportSettings, RecorderState } from '@/types';
import { formatDuration, cn } from '@/lib/utils';

interface ExportPanelProps {
    settings: ExportSettings;
    recorderState: RecorderState;
    onSettingsChange: (settings: ExportSettings) => void;
    onStartRecording: () => void;
    onStopRecording: () => void;
    className?: string;
}

export function ExportPanel({
    settings,
    recorderState,
    onSettingsChange,
    onStartRecording,
    onStopRecording,
    className,
}: ExportPanelProps) {
    const handleFormatChange = (format: 'mp4' | 'webm') => {
        onSettingsChange({ ...settings, format });
    };

    const handleQualityChange = (quality: 'low' | 'medium' | 'high' | 'ultra') => {
        onSettingsChange({ ...settings, quality });
    };

    const handleFpsChange = (fps: 24 | 30 | 60) => {
        onSettingsChange({ ...settings, fps });
    };

    const handleDurationChange = (duration: number) => {
        onSettingsChange({ ...settings, duration });
    };

    return (
        <div className={cn('space-y-6', className)}>
            <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wide">
                Export Settings
            </h3>

            {/* Format */}
            <div className="space-y-2">
                <label className="text-xs text-white/60">Format</label>
                <div className="flex gap-2">
                    {(['webm', 'mp4'] as const).map((format) => (
                        <button
                            key={format}
                            onClick={() => handleFormatChange(format)}
                            disabled={recorderState.isRecording}
                            className={cn(
                                'flex-1 py-2 px-3 rounded-lg text-sm font-medium uppercase transition-all duration-200',
                                settings.format === format
                                    ? 'bg-white text-black'
                                    : 'bg-white/10 text-white/70 hover:bg-white/20',
                                recorderState.isRecording && 'opacity-50 cursor-not-allowed'
                            )}
                        >
                            {format}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quality */}
            <div className="space-y-2">
                <label className="text-xs text-white/60">Quality</label>
                <div className="grid grid-cols-4 gap-2">
                    {(['low', 'medium', 'high', 'ultra'] as const).map((quality) => (
                        <button
                            key={quality}
                            onClick={() => handleQualityChange(quality)}
                            disabled={recorderState.isRecording}
                            className={cn(
                                'py-2 px-2 rounded-lg text-xs font-medium capitalize transition-all duration-200',
                                settings.quality === quality
                                    ? 'bg-white text-black'
                                    : 'bg-white/10 text-white/70 hover:bg-white/20',
                                recorderState.isRecording && 'opacity-50 cursor-not-allowed'
                            )}
                        >
                            {quality}
                        </button>
                    ))}
                </div>
            </div>

            {/* FPS */}
            <div className="space-y-2">
                <label className="text-xs text-white/60">Frame Rate</label>
                <div className="flex gap-2">
                    {([24, 30, 60] as const).map((fps) => (
                        <button
                            key={fps}
                            onClick={() => handleFpsChange(fps)}
                            disabled={recorderState.isRecording}
                            className={cn(
                                'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200',
                                settings.fps === fps
                                    ? 'bg-white text-black'
                                    : 'bg-white/10 text-white/70 hover:bg-white/20',
                                recorderState.isRecording && 'opacity-50 cursor-not-allowed'
                            )}
                        >
                            {fps} FPS
                        </button>
                    ))}
                </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
                <label className="text-xs text-white/60">
                    Duration: {settings.duration}s
                </label>
                <input
                    type="range"
                    min="1"
                    max="60"
                    value={settings.duration}
                    onChange={(e) => handleDurationChange(parseInt(e.target.value))}
                    disabled={recorderState.isRecording}
                    className="w-full accent-white disabled:opacity-50"
                />
                <div className="flex justify-between text-xs text-white/40">
                    <span>1s</span>
                    <span>30s</span>
                    <span>60s</span>
                </div>
            </div>

            {/* Recording Progress */}
            {recorderState.isRecording && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-white/80">Exporting...</span>
                        <span className="text-sm text-white/60 font-mono">
                            {formatDuration(recorderState.duration)}
                        </span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-red-500 transition-all duration-100"
                            style={{ width: `${recorderState.progress * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Record Button */}
            <button
                onClick={recorderState.isRecording ? onStopRecording : onStartRecording}
                className={cn(
                    'w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3',
                    recorderState.isRecording
                        ? 'bg-black/70 hover:bg-red-600 text-white'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/25'
                )}
            >
                {recorderState.isRecording ? (
                    <>
                        <span className="w-4 h-4 bg-white rounded-sm" />
                        Stop Exporting
                    </>
                ) : (
                    <>
                        <span className="w-4 h-4 bg-white rounded-full" />
                        Start Exporting
                    </>
                )}
            </button>

            {/* Info */}
            <p className="text-xs text-white/40 text-center">
                Video will be automatically downloaded when exporting completes
            </p>
        </div>
    );
}
