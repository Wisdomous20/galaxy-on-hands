import type { HandLandmark } from "../types/hand";

function distance(a: HandLandmark, b: HandLandmark): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function getOpenness(hand: HandLandmark[]): number {
  const wrist = hand[0];
  const middleBase = hand[9];

  const palmSize = distance(wrist, middleBase);
  if (palmSize === 0) return 0;

  const tips = [8, 12, 16, 20];

  const avgExtension =
    tips.reduce((sum, tip) => sum + distance(wrist, hand[tip]), 0) / tips.length;

  const openness = avgExtension / palmSize;
  const normalized = (openness - 1.2) / 1.3;
  return Math.max(0, Math.min(1, normalized));
}

export function getAverageOpenness(hands: HandLandmark[][]): number {
  if (hands.length === 0) return 0;
  const total = hands.reduce((sum, hand) => sum + getOpenness(hand), 0);
  return total / hands.length;
}

// Finger tip/pip pairs (index, middle, ring, pinky)
const FINGERS: Array<{ tip: number; pip: number }> = [
  { tip: 8, pip: 5 },   // index
  { tip: 12, pip: 9 },  // middle
  { tip: 16, pip: 13 }, // ring
  { tip: 20, pip: 17 }, // pinky
];

function isFingerExtended(hand: HandLandmark[], tip: number, pip: number): boolean {
  const wrist = hand[0];
  return distance(wrist, hand[tip]) > distance(wrist, hand[pip]) * 1.4;
}

export function isMiddleFingerGesture(hand: HandLandmark[]): boolean {
  const [index, middle, ring, pinky] = FINGERS.map((f) =>
    isFingerExtended(hand, f.tip, f.pip)
  );
  return middle && !index && !ring && !pinky;
}

export function anyMiddleFingerGesture(hands: HandLandmark[][]): boolean {
  return hands.some(isMiddleFingerGesture);
}

// True fist: every non-thumb finger curled (tip not meaningfully past its MCP).
export function isFist(hand: HandLandmark[]): boolean {
  return FINGERS.every((f) => !isFingerExtended(hand, f.tip, f.pip));
}

export function allFists(hands: HandLandmark[][]): boolean {
  if (hands.length === 0) return false;
  return hands.every(isFist);
}