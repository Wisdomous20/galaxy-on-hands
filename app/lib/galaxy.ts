interface GalaxyParticle {
  angle: number;
  distance: number;
  speed: number;
  radius: number;
  color: string;
  opacity: number;
  arm: number;
}

const GALAXY_COLORS = [
  "#b4a0ff",
  "#78c8ff",
  "#ffffff",
  "#ffc896",
  "#c8b4ff",
  "#a0d0ff",
];

const ARM_COUNT = 4;

export class Galaxy {
  private particles: GalaxyParticle[] = [];
  private rotation = 0;

  constructor(count = 400) {
    for (let i = 0; i < count; i++) {
      const arm = Math.floor(Math.random() * ARM_COUNT);
      const armAngle = (arm / ARM_COUNT) * Math.PI * 2;

      this.particles.push({
        angle: armAngle + (Math.random() - 0.5) * 0.8,
        distance: Math.random() * 0.9 + 0.05,
        speed: Math.random() * 0.005 + 0.002,
        radius: Math.random() * 2 + 0.5,
        color: GALAXY_COLORS[Math.floor(Math.random() * GALAXY_COLORS.length)],
        opacity: Math.random() * 0.6 + 0.2,
        arm,
      });
    }
  }

  draw(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    size: number
  ): void {
    this.rotation += 0.01;

    // Core glow
    const coreGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, size * 0.3
    );
    coreGradient.addColorStop(0, "rgba(200, 180, 255, 0.3)");
    coreGradient.addColorStop(0.5, "rgba(120, 160, 255, 0.1)");
    coreGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, size * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = coreGradient;
    ctx.fill();

    // Draw spiral particles
    for (const p of this.particles) {
      p.angle += p.speed;

      // Spiral: particles further out get more angle offset
      const spiralAngle = p.angle + this.rotation + p.distance * 2.5;
      const x = centerX + Math.cos(spiralAngle) * p.distance * size;
      const y = centerY + Math.sin(spiralAngle) * p.distance * size;

      // Fade out particles near the edge
      const edgeFade = 1 - Math.pow(p.distance, 2);

      ctx.beginPath();
      ctx.arc(x, y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity * edgeFade;
      ctx.fill();

      // Glow on bigger particles
      if (p.radius > 1.5) {
        ctx.beginPath();
        ctx.arc(x, y, p.radius * 2.5, 0, Math.PI * 2);
        ctx.globalAlpha = p.opacity * edgeFade * 0.15;
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
  }
}