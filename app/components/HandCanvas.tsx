"use client";

import { forwardRef } from "react";

interface HandCanvasProps {
  width: number;
  height: number;
  visible: boolean;
  onClick?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}

export const HandCanvas = forwardRef<HTMLCanvasElement, HandCanvasProps>(
  function HandCanvas({ width, height, visible, onClick }, ref) {
    return (
      <canvas
        ref={ref}
        width={width}
        height={height}
        onClick={onClick}
        className={`w-full h-full object-cover cursor-pointer ${
          visible ? "block" : "hidden"
        }`}
      />
    );
  }
);