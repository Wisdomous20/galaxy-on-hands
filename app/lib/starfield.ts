interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  color: string;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  depth: number;
}

export interface InteractPoint {
  x: number;
  y: number;
}

const INTERACT_RADIUS = 90;
const INTERACT_FORCE = 2.2;

// Realistic star color distribution: most are white/blue-white, 
// some are yellow, a few are orange/red giants.
const STAR_COLORS_WEIGHTED: { color: string; weight: number }[] = [
  { color: "#ffffff", weight: 30 },
  { color: "#f0f0ff", weight: 20 },
  { color: "#d0d8ff", weight: 15 },
  { color: "#a0b8ff", weight: 10 },
  { color: "#78a0ff", weight: 5 },
  { color: "#fff8e0", weight: 8 },
  { color: "#ffe8b0", weight: 5 },
  { color: "#ffd080", weight: 3 },
  { color: "#ffb060", weight: 2 },
  { color: "#ff8848", weight: 1 },
  { color: "#ff6030", weight: 1 },
];

function pickStarColor(): string {
  const totalWeight = STAR_COLORS_WEIGHTED.reduce((s, c) => s + c.weight, 0);
  let r = Math.random() * totalWeight;
  for (const entry of STAR_COLORS_WEIGHTED) {
    r -= entry.weight;
    if (r <= 0) return entry.color;
  }
  return "#ffffff";
}

export class Starfield {
  private stars: Star[] = [];
  private frame = 0;
  private width: number;
  private height: number;

  constructor(width: number, height: number, count = 600) {
    this.width = width;
    this.height = height;
    for (let i = 0; i < count; i++) {
      const depth = Math.random();
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.03 + depth * 0.35) * 0.5;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      // Most stars are tiny points; a few are brighter/larger
      const isBright = Math.random() < 0.05;

      this.stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: isBright
          ? 1.2 + Math.random() * 1.5
          : 0.2 + depth * 1.2,
        opacity: isBright
          ? 0.7 + Math.random() * 0.3
          : 0.15 + depth * 0.55,
        twinkleSpeed: Math.random() * 0.03 + 0.008,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: pickStarColor(),
        vx,
        vy,
        baseVx: vx,
        baseVy: vy,
        depth,
      });
    }
  }

  draw(
    ctx: CanvasRenderingContext2D,
    alpha: number,
    interactPoints: InteractPoint[] = []
  ): void {
    if (alpha <= 0) return;

    this.frame++;
    const drift = Math.sin(this.frame * 0.0015) * 0.2;
    const r2 = INTERACT_RADIUS * INTERACT_RADIUS;

    for (const star of this.stars) {
      for (const p of interactPoints) {
        const dx = star.x - p.x;
        const dy = star.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < r2 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const falloff = 1 - d / INTERACT_RADIUS;
          const force = INTERACT_FORCE * falloff * falloff;
          star.vx += (dx / d) * force;
          star.vy += (dy / d) * force;
        }
      }

      star.vx += (star.baseVx - star.vx) * 0.06;
      star.vy += (star.baseVy - star.vy) * 0.06;

      star.x += star.vx + drift * star.depth;
      star.y += star.vy;

      if (star.x < -5) star.x = this.width + 5;
      else if (star.x > this.width + 5) star.x = -5;
      if (star.y < -5) star.y = this.height + 5;
      else if (star.y > this.height + 5) star.y = -5;

      const twinkle =
        Math.sin(this.frame * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = star.opacity * twinkle * alpha;
      ctx.fill();

      // Soft glow halo on brighter stars
      if (star.radius > 1.2) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.opacity * twinkle * alpha * 0.08;
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
  }
}