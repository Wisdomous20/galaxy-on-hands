"use client";

import { useState } from "react";
import { useHandTracking } from "../hooks/useHandTracking";
import { useCanvasDrawing } from "../hooks/useCanvasDrawing";
import { getAverageOpenness } from "../lib/handGestures";
import { HandCanvas } from "./HandCanvas";
import { UiOverlay } from "./UI-Overlay";
import { PlanetInfoPanel } from "./PlanetInfoPanel";
import type { PlanetInfo } from "../lib/planets";

const WIDTH = 1280;
const HEIGHT = 720;

export function GalaxyHands() {
  const [handsDetected, setHandsDetected] = useState(0);
  const [openness, setOpenness] = useState(0);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetInfo | null>(null);
  const { canvasRef, draw, hitTestPlanet } = useCanvasDrawing(WIDTH, HEIGHT, {
    onPlanetTouch: (info) => setSelectedPlanet(info),
  });

  const { videoRef, active, error, scriptLoaded, start } = useHandTracking(
    (result) => {
      setHandsDetected(result.hands.length);
      setOpenness(getAverageOpenness(result.hands));
      draw(result);
    }
  );

  return (
    <main className="relative w-screen h-screen bg-[#0a0a0f] overflow-hidden">
      {!active && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <h1 className="font-mono text-sm tracking-[0.2em] uppercase text-white/40 mb-6">
            Galaxy Hands
          </h1>
          <button
            onClick={start}
            disabled={!scriptLoaded}
            className="px-8 py-3 border border-white/10 text-white/50 
                       font-mono text-xs tracking-widest uppercase
                       hover:bg-white/5 hover:border-white/20 transition-all
                       disabled:opacity-30 disabled:cursor-wait"
          >
            {scriptLoaded ? "Enable Camera" : "Loading ML Model..."}
          </button>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <p className="text-red-400 font-mono text-sm">{error}</p>
        </div>
      )}

      <video ref={videoRef} autoPlay playsInline className="hidden" />
      <HandCanvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        visible={active}
        onClick={(e) => {
          const hit = hitTestPlanet(e.clientX, e.clientY);
          setSelectedPlanet(hit);
        }}
      />
      <UiOverlay active={active} handsDetected={handsDetected} openness={openness} />
      <PlanetInfoPanel info={selectedPlanet} onClose={() => setSelectedPlanet(null)} />
    </main>
  );
}