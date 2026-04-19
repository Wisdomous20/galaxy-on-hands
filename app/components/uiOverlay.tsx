"use client";

interface UiOverlayProps {
  active: boolean;
  handsDetected: number;
}

export function UiOverlay({ active, handsDetected }: UiOverlayProps) {
  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Top bar */}
      <div className="flex justify-between items-start px-8 pt-6">
        <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/30">
          Galaxy Hands
        </span>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end">
        <div className="flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              handsDetected > 0
                ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]"
                : "bg-white/20"
            }`}
          />
          <span className="font-mono text-[11px] text-white/30">
            {handsDetected > 0
              ? `${handsDetected} hand${handsDetected > 1 ? "s" : ""} tracked`
              : "no hands detected"}
          </span>
        </div>

        <span className="font-mono text-[11px] text-white/15">
          move hands to create constellations
        </span>
      </div>
    </div>
  );
}