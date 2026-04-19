import type { HandLandmark } from "../types/hand";

export interface Point {
  x: number;
  y: number;
}

// Palm center is the average of wrist(0) and middle finger base(9)
export function getPalmCenter(hand: HandLandmark[], width: number, height: number): Point {
  const wrist = hand[0];
  const middleBase = hand[9];

  return {
    x: (1 - (wrist.x + middleBase.x) / 2) * width,
    y: ((wrist.y + middleBase.y) / 2) * height,
  };
}

export function getMidpoint(a: Point, b: Point): Point {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}

export function getDistance(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}