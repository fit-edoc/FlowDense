import { ExportSettings } from '@/types';

export interface RecorderOptions {
    canvas: HTMLCanvasElement;
    settings: ExportSettings;
    onProgress?: (progress: number) => void;
    onComplete?: (blob: Blob) => void;
    onError?: (error: Error) => void;
}

export class CanvasRecorder {
    private mediaRecorder: MediaRecorder | null = null;
    private chunks: Blob[] = [];
    private canvas: HTMLCanvasElement;
    private settings: ExportSettings;
    private onProgress?: (progress: number) => void;
    private onComplete?: (blob: Blob) => void;
    private onError?: (error: Error) => void;
    private startTime: number = 0;
    private animationFrameId: number | null = null;

    constructor(options: RecorderOptions) {
        this.canvas = options.canvas;
        this.settings = options.settings;
        this.onProgress = options.onProgress;
        this.onComplete = options.onComplete;
        this.onError = options.onError;
    }

    private getMimeType(): string {
        const mimeTypes = {
            webm: 'video/webm;codecs=vp9',
            mp4: 'video/mp4',
        };
        return mimeTypes[this.settings.format] || 'video/webm';
    }

    private getVideoBitsPerSecond(): number {
        const bitrates = {
            low: 1000000,
            medium: 2500000,
            high: 5000000,
            ultra: 10000000,
        };
        return bitrates[this.settings.quality];
    }

    start(): void {
        try {
            const stream = this.canvas.captureStream(this.settings.fps);

            this.mediaRecorder = new MediaRecorder(stream, {
                mimeType: this.getMimeType(),
                videoBitsPerSecond: this.getVideoBitsPerSecond(),
            });

            this.chunks = [];
            this.startTime = Date.now();

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.chunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.chunks, { type: this.getMimeType() });
                this.onComplete?.(blob);
            };

            this.mediaRecorder.onerror = (event) => {
                this.onError?.(new Error('Recording failed'));
            };

            this.mediaRecorder.start(100); // Collect data every 100ms
            this.trackProgress();
        } catch (error) {
            this.onError?.(error as Error);
        }
    }

    private trackProgress(): void {
        const checkProgress = () => {
            const elapsed = (Date.now() - this.startTime) / 1000;
            const progress = Math.min(elapsed / this.settings.duration, 1);
            this.onProgress?.(progress);

            if (progress >= 1) {
                this.stop();
            } else {
                this.animationFrameId = requestAnimationFrame(checkProgress);
            }
        };

        this.animationFrameId = requestAnimationFrame(checkProgress);
    }

    stop(): void {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }
    }

    pause(): void {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.pause();
        }
    }

    resume(): void {
        if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
            this.mediaRecorder.resume();
        }
    }
}

export function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
