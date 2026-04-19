export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

export type HandLandmarks = HandLandmark[];

export interface HandTrackingResult {
  hands: HandLandmarks[];
  image: CanvasImageSource;
}