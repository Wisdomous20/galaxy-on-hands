interface Planet {
  // Orbit around a drift center
  cx: number;
  cy: number;
  orbitRx: number;
  orbitRy: number;
  phase: number;
  orbitSpeed: number;
  // Appearance
  radius: number;
  baseColor: string;
  highlightColor: string;
  shadowColor: string;
  lightAngle: number; // radians; direction of light source in screen space
  hasRing: boolean;
  ringColor: string;
  ringTilt: number;
  // Motion tweaks
  bobPhase: number;
  bobSpeed: number;
  bobAmp: number;
  // Interactive offset from hand pushes
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  // Last frame screen position (for draw + interaction math)
  lastX: number;
  lastY: number;
}

export interface PlanetInteractPoint {
  x: number;
  y: number;
}

type PlanetSpec = {
  base: string;
  highlight: string;
  shadow: string;
  ring?: { color: string; tilt: number };
};

const PLANET_SPECS: PlanetSpec[] = [
  {
    base: "#d9a066",
    highlight: "#ffe0b0",
    shadow: "#6b3a1c",
  },
  {
    base: "#6ea8ff",
    highlight: "#cfe4ff",
    shadow: "#1b2f66",
  },
  {
    base: "#c77dff",
    highlight: "#f0cfff",
    shadow: "#3a1160",
    ring: { color: "rgba(230, 200, 255, 0.55)", tilt: 0.35 },
  },
  {
    base: "#ff8e7a",
    highlight: "#ffd0c2",
    shadow: "#6e1f17",
  },
  {
    base: "#8ee6b3",
    highlight: "#d0ffe6",
    shadow: "#1d5a3a",
    ring: { color: "rgba(180, 255, 220, 0.45)", tilt: -0.45 },
  },
];

export class Planets {
  private planets: Planet[] = [];
  private frame = 0;

  constructor(width: number, height: number, count = 5) {
    for (let i = 0; i < count; i++) {
      const spec = PLANET_SPECS[i % PLANET_SPECS.length];
      const cx = width * (0.15 + Math.random() * 0.7);
      const cy = height * (0.2 + Math.random() * 0.6);
      const orbitRx = 60 + Math.random() * 140;
      const orbitRy = 20 + Math.random() * 60;
      this.planets.push({
        cx,
        cy,
        orbitRx,
        orbitRy,
        phase: Math.random() * Math.PI * 2,
        orbitSpeed: (Math.random() * 0.0008 + 0.0004) * (Math.random() < 0.5 ? 1 : -1),
        radius: 14 + Math.random() * 28,
        baseColor: spec.base,
        highlightColor: spec.highlight,
        shadowColor: spec.shadow,
        lightAngle: Math.random() * Math.PI * 2,
        hasRing: !!spec.ring,
        ringColor: spec.ring?.color ?? "rgba(255,255,255,0.3)",
        ringTilt: spec.ring?.tilt ?? 0,
        bobPhase: Math.random() * Math.PI * 2,
        bobSpeed: Math.random() * 0.004 + 0.002,
        bobAmp: 4 + Math.random() * 10,
        ox: 0,
        oy: 0,
        vx: 0,
        vy: 0,
        lastX: cx,
        lastY: cy,
      });
    }
  }

  draw(
    ctx: CanvasRenderingContext2D,
    alpha: number,
    interactPoints: PlanetInteractPoint[] = []
  ): void {
    if (alpha <= 0) return;
    this.frame++;

    for (const p of this.planets) {
      const t = this.frame * p.orbitSpeed + p.phase;
      const orbitX = p.cx + Math.cos(t) * p.orbitRx;
      const orbitY =
        p.cy +
        Math.sin(t) * p.orbitRy +
        Math.sin(this.frame * p.bobSpeed + p.bobPhase) * p.bobAmp;

      // Hand interaction: repulsion when a hand point is within push radius
      const pushRadius = p.radius * 2.8;
      const pushR2 = pushRadius * pushRadius;
      for (const hp of interactPoints) {
        const dx = p.lastX - hp.x;
        const dy = p.lastY - hp.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < pushR2 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const falloff = 1 - d / pushRadius;
          const force = 3.2 * falloff * falloff;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
        }
      }

      // Integrate offset, damp velocity, spring offset back toward 0
      p.vx *= 0.9;
      p.vy *= 0.9;
      p.ox += p.vx;
      p.oy += p.vy;
      p.ox *= 0.985;
      p.oy *= 0.985;

      const x = orbitX + p.ox;
      const y = orbitY + p.oy;
      p.lastX = x;
      p.lastY = y;

      // Back half of ring (behind the planet)
      if (p.hasRing) {
        this.drawRingArc(ctx, x, y, p, alpha, Math.PI, Math.PI * 2);
      }

      // Planet body (radial gradient offset toward light)
      const lx = x + Math.cos(p.lightAngle) * p.radius * 0.5;
      const ly = y + Math.sin(p.lightAngle) * p.radius * 0.5;
      const g = ctx.createRadialGradient(lx, ly, p.radius * 0.1, x, y, p.radius);
      g.addColorStop(0, p.highlightColor);
      g.addColorStop(0.4, p.baseColor);
      g.addColorStop(1, p.shadowColor);

      ctx.globalAlpha = alpha;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Soft outer glow
      const glow = ctx.createRadialGradient(x, y, p.radius, x, y, p.radius * 2.4);
      glow.addColorStop(0, p.baseColor + "55");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalAlpha = alpha * 0.5;
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, p.radius * 2.4, 0, Math.PI * 2);
      ctx.fill();

      // Front half of ring (in front of the planet)
      if (p.hasRing) {
        this.drawRingArc(ctx, x, y, p, alpha, 0, Math.PI);
      }
    }

    ctx.globalAlpha = 1;
  }

  private drawRingArc(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    p: Planet,
    alpha: number,
    start: number,
    end: number
  ): void {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(p.ringTilt);
    ctx.globalAlpha = alpha * 0.9;
    ctx.strokeStyle = p.ringColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.radius * 1.9, p.radius * 0.55, 0, start, end);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.globalAlpha = alpha * 0.45;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.radius * 2.25, p.radius * 0.7, 0, start, end);
    ctx.stroke();
    ctx.restore();
  }
}
