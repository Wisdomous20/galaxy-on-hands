"use client";

import { useRef, useCallback } from "react";
import type { HandTrackingResult } from "../types/hand";

export function useCanvasDrawing(width: number, height: number) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(
    (result: HandTrackingResult) => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);

      // Draw mirrored video
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(result.image, -width, 0, width, height);
      ctx.restore();

      // Draw landmarks
      for (const hand of result.hands) {
        for (const point of hand) {
          const x = (1 - point.x) * width;
          const y = point.y * height;

          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(127, 239, 189, 0.8)";
          ctx.fill();
        }
      }
    },
    [width, height]
  );

  return { canvasRef, draw };
}