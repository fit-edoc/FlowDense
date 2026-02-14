// Video Gradient App Type Definitions

export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5' | '4:3';

export interface VideoSize {
  width: number;
  height: number;
  label: string;
  aspectRatio: AspectRatio;
}

export interface GradientColor {
  color: string;
  position: number; // 0-100
}

export interface GradientPreset {
  id: string;
  name: string;
  colors: GradientColor[];
  angle: number;
  type: 'linear' | 'radial' | 'conic';
}

export interface AnimationConfig {
  enabled: boolean;
  duration: number; // in seconds
  type: 'shift' | 'rotate' | 'pulse' | 'wave';
  easing: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

export interface GradientState {
  colors: GradientColor[];
  angle: number;
  type: 'linear' | 'radial' | 'conic';
  animation: AnimationConfig;
}

export interface ExportSettings {
  format: 'mp4' | 'webm';
  quality: 'low' | 'medium' | 'high' | 'ultra';
  fps: 24 | 30 | 60;
  duration: number; // in seconds
  size: VideoSize;
}

export interface CanvasState {
  size: VideoSize;
  gradient: GradientState;
  content: ContentConfig;
}

export interface ContentConfig {
  enabled: boolean;
  type: 'text' | 'image' | 'video';
  src?: string;
  text?: string;
  style?: ContentStyle;
}

export interface ContentStyle {
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  padding?: number;
  borderRadius?: number;
  backgroundColor?: string;
}

export interface RecorderState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  progress: number;
}
