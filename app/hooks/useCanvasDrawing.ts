"use client";

import { useRef, useCallback } from "react";
import { FINGER_CONNECTIONS } from "../lib/handConnections";
import type { HandTrackingResult } from "../types/hand";

const GALAXY_COLORS = [
  "rgba(180, 160, 255,",
  "rgba(120, 200, 255,",
  "rgba(200, 180, 255,",
  "rgba(255, 200, 150,",
];

export function useCanvasDrawing(width: number, height: number) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Lazy-create an offscreen canvas for the trail effect
  const getTrailCanvas = useCallback(() => {
    if (!trailCanvasRef.current) {
      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      trailCanvasRef.current = offscreen;
    }
    return trailCanvasRef.current;
  }, [width, height]);

  const draw = useCallback(
    (result: HandTrackingResult) => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;

      const trail = getTrailCanvas();
      const trailCtx = trail.getContext("2d");
      if (!trailCtx) return;

      // --- Trail layer ---
      // Fade the previous frame slightly instead of clearing it
trailCtx.globalCompositeOperation = "destination-in";
trailCtx.fillStyle = "rgba(0, 0, 0, 0.85)";
trailCtx.fillRect(0, 0, width, height);
trailCtx.globalCompositeOperation = "source-over";

      // Draw connections onto the trail canvas
      result.hands.forEach((hand, handIndex) => {
        const colorBase = GALAXY_COLORS[handIndex % GALAXY_COLORS.length];

        // Glow effect via shadow
        trailCtx.shadowColor = `${colorBase} 0.5)`;
        trailCtx.shadowBlur = 12;

        for (const [from, to] of FINGER_CONNECTIONS) {
          const a = hand[from];
          const b = hand[to];

          const ax = (1 - a.x) * width;
          const ay = a.y * height;
          const bx = (1 - b.x) * width;
          const by = b.y * height;

          trailCtx.beginPath();
          trailCtx.moveTo(ax, ay);
          trailCtx.lineTo(bx, by);
          trailCtx.strokeStyle = `${colorBase} 0.6)`;
          trailCtx.lineWidth = 1.5;
          trailCtx.stroke();
        }

        // Joint dots with stronger glow
        trailCtx.shadowBlur = 8;
        for (const point of hand) {
          const x = (1 - point.x) * width;
          const y = point.y * height;

          trailCtx.beginPath();
          trailCtx.arc(x, y, 2, 0, Math.PI * 2);
          trailCtx.fillStyle = `${colorBase} 0.9)`;
          trailCtx.fill();
        }

        trailCtx.shadowBlur = 0;
      });

      // --- Main canvas compositing ---
      ctx.clearRect(0, 0, width, height);

      // Dimmed video background
      ctx.save();
      ctx.scale(-1, 1);
      ctx.globalAlpha = 0.6;
      ctx.drawImage(result.image, -width, 0, width, height);
      ctx.globalAlpha = 1;
      ctx.restore();

      // Overlay the trail canvas
      ctx.drawImage(trail, 0, 0);
    },
    [width, height, getTrailCanvas]
  );

  return { canvasRef, draw };
}