'use client';

import { useState, useCallback, useRef } from 'react';
import { ExportSettings, RecorderState } from '@/types';
import { CanvasRecorder, downloadBlob } from '@/lib/export/recorder';

interface UseCanvasRecorderReturn {
    state: RecorderState;
    startRecording: (canvas: HTMLCanvasElement, settings: ExportSettings) => void;
    stopRecording: () => void;
    pauseRecording: () => void;
    resumeRecording: () => void;
}

export function useCanvasRecorder(): UseCanvasRecorderReturn {
    const [state, setState] = useState<RecorderState>({
        isRecording: false,
        isPaused: false,
        duration: 0,
        progress: 0,
    });

    const recorderRef = useRef<CanvasRecorder | null>(null);
    const startTimeRef = useRef<number>(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startRecording = useCallback(
        (canvas: HTMLCanvasElement, settings: ExportSettings) => {
            recorderRef.current = new CanvasRecorder({
                canvas,
                settings,
                onProgress: (progress) => {
                    setState((prev) => ({ ...prev, progress }));
                },
                onComplete: (blob) => {
                    setState({
                        isRecording: false,
                        isPaused: false,
                        duration: 0,
                        progress: 0,
                    });

                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                    const filename = `gradient-video-${timestamp}.${settings.format}`;
                    downloadBlob(blob, filename);
                },
                onError: (error) => {
                    console.error('Recording error:', error);
                    setState({
                        isRecording: false,
                        isPaused: false,
                        duration: 0,
                        progress: 0,
                    });
                },
            });

            startTimeRef.current = Date.now();
            recorderRef.current.start();

            setState({
                isRecording: true,
                isPaused: false,
                duration: 0,
                progress: 0,
            });

            // Update duration every 100ms
            intervalRef.current = setInterval(() => {
                setState((prev) => ({
                    ...prev,
                    duration: (Date.now() - startTimeRef.current) / 1000,
                }));
            }, 100);
        },
        []
    );

    const stopRecording = useCallback(() => {
        if (recorderRef.current) {
            recorderRef.current.stop();
            recorderRef.current = null;
        }

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        setState({
            isRecording: false,
            isPaused: false,
            duration: 0,
            progress: 0,
        });
    }, []);

    const pauseRecording = useCallback(() => {
        if (recorderRef.current) {
            recorderRef.current.pause();
            setState((prev) => ({ ...prev, isPaused: true }));
        }
    }, []);

    const resumeRecording = useCallback(() => {
        if (recorderRef.current) {
            recorderRef.current.resume();
            setState((prev) => ({ ...prev, isPaused: false }));
        }
    }, []);

    return {
        state,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
    };
}
