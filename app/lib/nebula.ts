interface NebulaBlob {
  x: number;
  y: number;
  radius: number;
  color: string;
  drift: number;
  phase: number;
  speed: number;
}

// Subtle nebula tones that suggest interstellar gas clouds without
// overwhelming the galaxy or planet rendering.
const NEBULA_COLORS = [
  "rgba(80, 40, 140, 0.1)",
  "rgba(40, 80, 160, 0.08)",
  "rgba(140, 50, 100, 0.07)",
  "rgba(50, 120, 160, 0.06)",
  "rgba(120, 80, 180, 0.08)",
  "rgba(30, 60, 120, 0.07)",
  "rgba(100, 40, 80, 0.06)",
];

export class Nebula {
  private blobs: NebulaBlob[] = [];
  private frame = 0;
  private width: number;
  private height: number;

  constructor(width: number, height: number, count = 8) {
    this.width = width;
    this.height = height;
    for (let i = 0; i < count; i++) {
      this.blobs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 320 + 200,
        color: NEBULA_COLORS[i % NEBULA_COLORS.length],
        drift: Math.random() * Math.PI * 2,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.0006 + 0.0003,
      });
    }
  }

  draw(ctx: CanvasRenderingContext2D, alpha: number): void {
    if (alpha <= 0) return;
    this.frame++;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    for (const b of this.blobs) {
      const t = this.frame * b.speed + b.phase;
      const x = b.x + Math.cos(t) * 50;
      const y = b.y + Math.sin(t * 0.7) * 35;
      const pulse = 0.9 + Math.sin(t * 1.1) * 0.1;
      const r = b.radius * pulse;

      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, b.color);
      g.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.globalAlpha = alpha;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
    ctx.globalAlpha = 1;
  }
}