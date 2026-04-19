"use client";

import { useRef, useCallback } from "react";
import { FINGER_CONNECTIONS } from "../lib/handConnections";
import { Starfield, type InteractPoint } from "../lib/starfield";
import { getAverageOpenness, allFists } from "../lib/handGestures";
import type { HandTrackingResult } from "../types/hand";

const GALAXY_COLORS = [
  "rgba(180, 160, 255,",
  "rgba(120, 200, 255,",
  "rgba(200, 180, 255,",
  "rgba(255, 200, 150,",
];

// Open hand enters galaxy; sustained fist (all fingers curled) exits.
const OPEN_THRESHOLD = 0.35;
const CLOSE_FRAMES_REQUIRED = 18;

export function useCanvasDrawing(width: number, height: number) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const starfieldRef = useRef<Starfield | null>(null);
  const isGalaxyRef = useRef(false);
  const transitionRef = useRef(0); // 0 = video, 1 = galaxy
  const closeFramesRef = useRef(0);

  const getTrailCanvas = useCallback(() => {
    if (!trailCanvasRef.current) {
      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      trailCanvasRef.current = offscreen;
    }
    return trailCanvasRef.current;
  }, [width, height]);

  const getStarfield = useCallback(() => {
    if (!starfieldRef.current) {
      starfieldRef.current = new Starfield(width, height);
    }
    return starfieldRef.current;
  }, [width, height]);

  const draw = useCallback(
    (result: HandTrackingResult) => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;

      const trail = getTrailCanvas();
      const trailCtx = trail.getContext("2d");
      if (!trailCtx) return;

      const starfield = getStarfield();

      // --- Binary gesture detection ---
      const openness = getAverageOpenness(result.hands);

      if (result.hands.length > 0) {
        if (openness > OPEN_THRESHOLD) {
          isGalaxyRef.current = true;
          closeFramesRef.current = 0;
        } else if (allFists(result.hands)) {
          closeFramesRef.current += 1;
          if (closeFramesRef.current >= CLOSE_FRAMES_REQUIRED) {
            isGalaxyRef.current = false;
          }
        } else {
          // Pointing, partial, moving — doesn't count as closed.
          closeFramesRef.current = 0;
        }
      } else {
        closeFramesRef.current = 0;
      }

      // Smooth transition toward target (0 = video, 1 = galaxy)
      const target = isGalaxyRef.current ? 1 : 0;
      transitionRef.current += (target - transitionRef.current) * 0.08;
      const t = transitionRef.current;
      // Ease for visual weight
      const eased = t * t * (3 - 2 * t);

      // --- Trail layer ---
      trailCtx.globalCompositeOperation = "destination-in";
      trailCtx.fillStyle = "rgba(0, 0, 0, 0.85)";
      trailCtx.fillRect(0, 0, width, height);
      trailCtx.globalCompositeOperation = "source-over";

      result.hands.forEach((hand, handIndex) => {
        const colorBase = GALAXY_COLORS[handIndex % GALAXY_COLORS.length];

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

      // --- Main canvas ---

      // Always start with pure black
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Video layer (fades out as we enter galaxy mode)
      if (eased < 0.99) {
        ctx.save();
        ctx.globalAlpha = 1 - eased;
        ctx.scale(-1, 1);
        ctx.drawImage(result.image, -width, 0, width, height);
        ctx.restore();
      }

      // Build interaction points from hand landmarks (only when in galaxy)
      const interactPoints: InteractPoint[] = [];
      if (eased > 0.05) {
        for (const hand of result.hands) {
          for (const p of hand) {
            interactPoints.push({
              x: (1 - p.x) * width,
              y: p.y * height,
            });
          }
        }
      }

      // Starfield always advances (so it's always moving); alpha fades in
      starfield.draw(ctx, eased, interactPoints);

      // Hand lines always on top
      ctx.drawImage(trail, 0, 0);
    },
    [width, height, getTrailCanvas, getStarfield]

  );

  return { canvasRef, draw };
}