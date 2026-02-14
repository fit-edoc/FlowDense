'use client';

import React, { useState, useRef } from 'react';
import { VideoCanvas, VideoCanvasRef } from '@/components/canvas/VideoCanvas';
import { GradientControls } from '@/components/controls/GradientControls';
import { SizeSelector } from '@/components/controls/SizeSelector';
import { ExportPanel } from '@/components/controls/ExportPanel';
import { useCanvasRecorder } from '@/hooks/useCanvasRecorder';
import { CanvasState, GradientState, VideoSize, ExportSettings } from '@/types';
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

const defaultSize: VideoSize = {
  width: 1920,
  height: 1080,
  label: 'Full HD (1920×1080)',
  aspectRatio: '16:9',
};

const defaultExportSettings: ExportSettings = {
  format: 'webm',
  quality: 'high',
  fps: 30,
  duration: 10,
  size: defaultSize,
};

export default function EditorPage() {
  const canvasRef = useRef<VideoCanvasRef>(null);
  const { state: recorderState, startRecording, stopRecording } = useCanvasRecorder();

  const [canvasState, setCanvasState] = useState<CanvasState>({
    size: defaultSize,
    gradient: defaultGradient,
    content: { enabled: false, type: 'text' },
  });

  const [exportSettings, setExportSettings] = useState<ExportSettings>(defaultExportSettings);
  const [activeTab, setActiveTab] = useState<'gradient' | 'size' | 'export'>('gradient');

  const handleGradientChange = (gradient: GradientState) => {
    setCanvasState((prev) => ({ ...prev, gradient }));
  };

  const handleSizeChange = (size: VideoSize) => {
    setCanvasState((prev) => ({ ...prev, size }));
    setExportSettings((prev) => ({ ...prev, size }));
  };

  const handleStartRecording = () => {
    const canvas = canvasRef.current?.getCanvas();
    if (canvas) {
      startRecording(canvas, { ...exportSettings, size: canvasState.size });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-black/40 ">
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <span className="text-xl"><img src="/logo.png" alt="" /></span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">FlowDense</h1>
              <p className="text-xs text-white/50">Create stunning animated backgrounds</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/preview"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white transition-colors"
            >
              Full Preview
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Canvas Area */}
          <div className="flex-1 flex items-center justify-center">
            <VideoCanvas
              ref={canvasRef}
              state={canvasState}
              className="w-full max-w-4xl"
              isRecording={recorderState.isRecording}
            />
          </div>

          {/* Controls Sidebar */}
          <aside className="w-[380px] flex-shrink-0">
            <div className="bg-white/5 py-2.5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-white/10">
                {(['gradient', 'size', 'export'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-sm font-medium capitalize transition-colors ${activeTab === tab
                      ? 'text-white bg-white/10'
                      : 'text-white/50 hover:text-white/70'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6 max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
                {activeTab === 'gradient' && (
                  <GradientControls
                    gradientState={canvasState.gradient}
                    onChange={handleGradientChange}
                  />
                )}

                {activeTab === 'size' && (
                  <SizeSelector
                    selectedSize={canvasState.size}
                    onChange={handleSizeChange}
                  />
                )}

                {activeTab === 'export' && (
                  <ExportPanel
                    settings={exportSettings}
                    recorderState={recorderState}
                    onSettingsChange={setExportSettings}
                    onStartRecording={handleStartRecording}
                    onStopRecording={stopRecording}
                  />
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Recording Indicator */}
      {recorderState.isRecording && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-500/90 backdrop-blur-lg px-12  py-3 rounded-full flex items-center gap-3 shadow-2xl shadow-red-500/30 animate-pulse">
          <span className="w-3 h-3 bg-white rounded-full animate-ping" />
          <span className="text-white font-medium">Exporting in progress...</span>
        </div>
      )}
    </div>
  );
}
