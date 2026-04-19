interface NebulaBlob {
  x: number;
  y: number;
  radius: number;
  color: string;
  drift: number;
  phase: number;
  speed: number;
}

const NEBULA_COLORS = [
  "rgba(120, 60, 200, 0.18)",
  "rgba(60, 120, 220, 0.16)",
  "rgba(200, 80, 160, 0.14)",
  "rgba(80, 180, 220, 0.12)",
  "rgba(180, 120, 240, 0.16)",
];

export class Nebula {
  private blobs: NebulaBlob[] = [];
  private frame = 0;
  private width: number;
  private height: number;

  constructor(width: number, height: number, count = 7) {
    this.width = width;
    this.height = height;
    for (let i = 0; i < count; i++) {
      this.blobs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 280 + 220,
        color: NEBULA_COLORS[i % NEBULA_COLORS.length],
        drift: Math.random() * Math.PI * 2,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.0008 + 0.0004,
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
      const x = b.x + Math.cos(t) * 40;
      const y = b.y + Math.sin(t * 0.8) * 30;
      const pulse = 0.85 + Math.sin(t * 1.3) * 0.15;
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
