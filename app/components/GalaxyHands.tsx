"use client";

import { useState } from "react";
import { useHandTracking } from "../hooks/useHandTracking";
import { useCanvasDrawing } from "../hooks/useCanvasDrawing";
import { HandCanvas } from "./HandCanvas";

const WIDTH = 640;
const HEIGHT = 480;

export function GalaxyHands() {
  const [handsDetected, setHandsDetected] = useState(0);
  const { canvasRef, draw } = useCanvasDrawing(WIDTH, HEIGHT);

  const { videoRef, active, error, scriptLoaded, start } = useHandTracking(
    (result) => {
      setHandsDetected(result.hands.length);
      draw(result);
    }
  );

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-[#0a0a0f]">
      {!active && !error && (
        <button
          onClick={start}
          disabled={!scriptLoaded}
          className="px-8 py-3 border border-white/10 text-white/50 
                     font-mono text-sm tracking-widest uppercase
                     hover:bg-white/5 hover:border-white/20 transition-all
                     disabled:opacity-30 disabled:cursor-wait"
        >
          {scriptLoaded ? "Enable Camera" : "Loading ML Model..."}
        </button>
      )}

      {error && <p className="text-red-400 font-mono text-sm">{error}</p>}

      <video ref={videoRef} autoPlay playsInline className="hidden" />
      <HandCanvas ref={canvasRef} width={WIDTH} height={HEIGHT} visible={active} />

      {active && (
        <p className="mt-4 font-mono text-xs text-white/30">
          hands: {handsDetected}
        </p>
      )}
    </main>
  );
}