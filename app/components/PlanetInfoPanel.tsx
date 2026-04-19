"use client";

import type { PlanetInfo } from "../lib/planets";

interface Props {
  info: PlanetInfo | null;
  onClose: () => void;
}

function fmtKm(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)} B km`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} M km`;
  if (n >= 1_000) return `${n.toLocaleString()} km`;
  return `${n} km`;
}

function fmtDays(n: number): string {
  if (n < 365) return `${n.toFixed(n < 10 ? 1 : 0)} days`;
  const years = n / 365.25;
  return `${years.toFixed(years < 10 ? 2 : 0)} yr (${n.toLocaleString()} d)`;
}

function fmtHours(n: number): string {
  if (n < 48) return `${n.toFixed(1)} h`;
  return `${(n / 24).toFixed(1)} Earth days`;
}

export function PlanetInfoPanel({ info, onClose }: Props) {
  if (!info) return null;

  const rows: [string, string][] = [
    ["Type", info.type],
    ["Diameter", fmtKm(info.diameterKm)],
    ["Distance from Sun", fmtKm(info.distanceFromSunKm)],
    ["Orbital period", fmtDays(info.orbitalPeriodDays)],
    ["Day length", fmtHours(info.dayLengthHours)],
    ["Moons", info.moons.toString()],
    ["Surface temp (°C)", info.surfaceTempC],
  ];

  return (
    <div className="fixed top-1/2 right-8 -translate-y-1/2 z-30 pointer-events-auto">
      <div
        className="w-[340px] bg-black/70 backdrop-blur-md border border-white/15
                   p-5 font-mono text-white/80 shadow-2xl"
      >
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-lg tracking-[0.15em] uppercase text-white">
            {info.name}
          </h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/80 text-lg leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <p className="text-[12px] leading-relaxed text-white/60 mb-4">
          {info.description}
        </p>

        <dl className="grid grid-cols-[140px_1fr] gap-y-1.5 text-[11px]">
          {rows.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-white/35 uppercase tracking-widest">{k}</dt>
              <dd className="text-white/85">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
