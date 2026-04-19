export interface MediaPipeHandsOptions {
  locateFile?: (file: string) => string;
}

export interface HandsSetOptions {
  maxNumHands: number;
  modelComplexity: 0 | 1;
  minDetectionConfidence: number;
  minTrackingConfidence: number;
}

export interface MediaPipeResults {
  multiHandLandmarks?: Array<Array<{ x: number; y: number; z: number }>>;
  image: CanvasImageSource;
}

export interface MediaPipeHands {
  setOptions(options: HandsSetOptions): void;
  onResults(callback: (results: MediaPipeResults) => void): void;
  send(input: { image: HTMLVideoElement }): Promise<void>;
  close(): void;
}

export interface MediaPipeHandsConstructor {
  new (options: MediaPipeHandsOptions): MediaPipeHands;
}

declare global {
  interface Window {
    Hands?: MediaPipeHandsConstructor;
  }
}