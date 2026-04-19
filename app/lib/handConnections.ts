// Each pair is [fromIndex, toIndex] based on MediaPipe's 21 landmarks
// Fingers: each finger is a chain from base to tip
// Palm: connects the bases of each finger

export const FINGER_CONNECTIONS: [number, number][] = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle
  [0, 9], [9, 10], [10, 11], [11, 12],
  // Ring
  [0, 13], [13, 14], [14, 15], [15, 16],
  // Pinky
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Palm cross-connections
  [5, 9], [9, 13], [13, 17],
];