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

const STAR_COLORS = [
  "#ffffff",
  "#b4a0ff",
  "#78c8ff",
  "#ffc896",
  "#c8b4ff",
];

export class Starfield {
  private stars: Star[] = [];
  private frame = 0;
  private width: number;
  private height: number;

  constructor(width: number, height: number, count = 400) {
    this.width = width;
    this.height = height;
    for (let i = 0; i < count; i++) {
      const depth = Math.random();
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.05 + depth * 0.45) * 0.6;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      this.stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.3 + depth * 1.8,
        opacity: 0.3 + depth * 0.6,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
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
    const drift = Math.sin(this.frame * 0.002) * 0.3;
    const r2 = INTERACT_RADIUS * INTERACT_RADIUS;

    for (const star of this.stars) {
      // Repulsion from hand points
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

      // Damp back toward base drift velocity
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

      if (star.radius > 1.2) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.opacity * twinkle * alpha * 0.1;
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
  }
}