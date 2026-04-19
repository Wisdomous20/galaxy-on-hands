"use client";

import { forwardRef } from "react";

interface HandCanvasProps {
  width: number;
  height: number;
  visible: boolean;
}

export const HandCanvas = forwardRef<HTMLCanvasElement, HandCanvasProps>(
  function HandCanvas({ width, height, visible }, ref) {
    return (
      <canvas
        ref={ref}
        width={width}
        height={height}
        className={`rounded-lg border border-white/10 ${visible ? "block" : "hidden"}`}
      />
    );
  }
);