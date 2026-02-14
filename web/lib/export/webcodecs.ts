import { ExportSettings } from '@/types';

// WebCodecs-based encoder for advanced video encoding
// Note: WebCodecs is still experimental and may not be available in all browsers

export interface WebCodecsEncoderOptions {
    canvas: HTMLCanvasElement;
    settings: ExportSettings;
    onProgress?: (progress: number) => void;
    onComplete?: (blob: Blob) => void;
    onError?: (error: Error) => void;
}

export function isWebCodecsSupported(): boolean {
    return typeof VideoEncoder !== 'undefined' && typeof VideoFrame !== 'undefined';
}

export async function createWebCodecsEncoder(options: WebCodecsEncoderOptions): Promise<{
    start: () => Promise<void>;
    stop: () => void;
}> {
    const { canvas, settings, onProgress, onComplete, onError } = options;

    if (!isWebCodecsSupported()) {
        throw new Error('WebCodecs is not supported in this browser');
    }

    const chunks: Uint8Array[] = [];
    let frameCount = 0;
    const totalFrames = settings.fps * settings.duration;
    let isRecording = false;

    const encoder = new VideoEncoder({
        output: (chunk) => {
            const data = new Uint8Array(chunk.byteLength);
            chunk.copyTo(data);
            chunks.push(data);
        },
        error: (error) => {
            onError?.(error);
        },
    });

    const codecConfig = {
        codec: settings.format === 'webm' ? 'vp09.00.10.08' : 'avc1.42001E',
        width: settings.size.width,
        height: settings.size.height,
        bitrate: getBitrate(settings.quality),
        framerate: settings.fps,
    };

    function getBitrate(quality: ExportSettings['quality']): number {
        const bitrates = {
            low: 1000000,
            medium: 2500000,
            high: 5000000,
            ultra: 10000000,
        };
        return bitrates[quality];
    }

    return {
        start: async () => {
            try {
                await encoder.configure(codecConfig);
                isRecording = true;

                const captureFrame = async () => {
                    if (!isRecording || frameCount >= totalFrames) {
                        await encoder.flush();

                        // Combine chunks into a blob
                        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
                        const combined = new Uint8Array(totalLength);
                        let offset = 0;
                        for (const chunk of chunks) {
                            combined.set(chunk, offset);
                            offset += chunk.length;
                        }

                        const blob = new Blob([combined], {
                            type: settings.format === 'webm' ? 'video/webm' : 'video/mp4'
                        });
                        onComplete?.(blob);
                        return;
                    }

                    const frame = new VideoFrame(canvas, {
                        timestamp: (frameCount / settings.fps) * 1000000, // microseconds
                    });

                    encoder.encode(frame, { keyFrame: frameCount % 30 === 0 });
                    frame.close();

                    frameCount++;
                    onProgress?.(frameCount / totalFrames);

                    // Schedule next frame
                    setTimeout(captureFrame, 1000 / settings.fps);
                };

                captureFrame();
            } catch (error) {
                onError?.(error as Error);
            }
        },
        stop: () => {
            isRecording = false;
            encoder.close();
        },
    };
}
