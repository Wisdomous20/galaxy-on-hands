interface GalaxyParticle {
  angle: number;
  distance: number;
  height: number;
  speed: number;
  radius: number;
  color: string;
  opacity: number;
  arm: number;
  isDust: boolean;
}

// Color palette shifts from warm gold at center to cool blue at edges,
// mimicking how real galaxies have older red/yellow stars near the core
// and younger blue stars in the spiral arms.
const CORE_COLORS = [
  "#fff8e7", "#ffe8c0", "#ffd699", "#fff0d0",
  "#ffe0a0", "#fff5dd", "#ffedcc",
];

const MID_COLORS = [
  "#e8d8ff", "#d0c0ff", "#c8d8ff", "#ffe0c8",
  "#f0e0ff", "#d8e8ff", "#ffffff",
];

const OUTER_COLORS = [
  "#88b4ff", "#6090ff", "#78a0ff", "#90c0ff",
  "#a0b0ff", "#70a8ff", "#b0c8ff",
];

const DUST_COLORS = [
  "rgba(40, 20, 10, 0.6)",
  "rgba(30, 15, 8, 0.5)",
  "rgba(50, 25, 15, 0.4)",
  "rgba(35, 18, 10, 0.5)",
];

const ARM_COUNT = 4;
const TILT_X = 1.05;
const YAW_SPEED = 0.0006;
const SPIN_SPEED = 0.002;

// Logarithmic spiral winding factor. Higher = tighter arms.
const WIND_FACTOR = 2.6;

function pickColor(distance: number): string {
  if (distance < 0.2) {
    return CORE_COLORS[Math.floor(Math.random() * CORE_COLORS.length)];
  }
  if (distance < 0.55) {
    return MID_COLORS[Math.floor(Math.random() * MID_COLORS.length)];
  }
  return OUTER_COLORS[Math.floor(Math.random() * OUTER_COLORS.length)];
}

export class Galaxy {
  private particles: GalaxyParticle[] = [];
  private rotation = 0;
  private yaw = 0;

  constructor(count = 2200) {
    for (let i = 0; i < count; i++) {
      const arm = Math.floor(Math.random() * ARM_COUNT);
      const armAngle = (arm / ARM_COUNT) * Math.PI * 2;

      // Bias distance so more stars pack near the core
      const r = Math.pow(Math.random(), 0.6);

      // Stars scatter away from arm center more at greater distances
      const scatter = (1 - r * 0.4) * 0.45 + 0.03;

      // Disk height: thick bulge near center, thin disk at edges
      const bulgeHeight = r < 0.15
        ? (Math.random() - 0.5) * 0.25
        : (Math.random() - 0.5) * (0.02 + (1 - r) * 0.08);

      this.particles.push({
        angle: armAngle + (Math.random() - 0.5) * scatter,
        distance: r,
        height: bulgeHeight,
        speed: 0.001 + (1 - r) * 0.003,
        radius: r < 0.15
          ? Math.random() * 2.2 + 0.6
          : Math.random() * 1.6 + 0.3,
        color: pickColor(r),
        opacity: r < 0.15
          ? Math.random() * 0.4 + 0.55
          : Math.random() * 0.5 + 0.35,
        arm,
        isDust: false,
      });
    }

    // Dark dust lane particles sit between bright arms for contrast
    const dustCount = Math.floor(count * 0.15);
    for (let i = 0; i < dustCount; i++) {
      const arm = Math.floor(Math.random() * ARM_COUNT);
      const armAngle = (arm / ARM_COUNT) * Math.PI * 2;
      const r = 0.15 + Math.random() * 0.65;

      // Offset dust so it trails slightly behind the bright arm
      const dustOffset = 0.25 + Math.random() * 0.15;

      this.particles.push({
        angle: armAngle + dustOffset,
        distance: r,
        height: (Math.random() - 0.5) * 0.03,
        speed: 0.001 + (1 - r) * 0.003,
        radius: Math.random() * 4 + 2,
        color: DUST_COLORS[Math.floor(Math.random() * DUST_COLORS.length)],
        opacity: Math.random() * 0.3 + 0.2,
        arm,
        isDust: true,
      });
    }
  }

  draw(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    size: number,
    alpha: number = 1
  ): void {
    if (alpha <= 0) return;

    this.rotation += SPIN_SPEED;
    this.yaw += YAW_SPEED;

    const cosT = Math.cos(TILT_X);
    const sinT = Math.sin(TILT_X);
    const cosY = Math.cos(this.yaw);
    const sinY = Math.sin(this.yaw);

    const focal = size * 1.2;
    const camZ = size * 2.4;

    type Proj = {
      sx: number;
      sy: number;
      scale: number;
      p: GalaxyParticle;
      depth: number;
    };
    const proj: Proj[] = [];

    for (const p of this.particles) {
      const spiralAngle = p.angle + this.rotation + p.distance * WIND_FACTOR;

      const lx = Math.cos(spiralAngle) * p.distance;
      const ly = Math.sin(spiralAngle) * p.distance;
      const lz = p.height;

      const yx = lx * cosY - ly * sinY;
      const yy = lx * sinY + ly * cosY;

      const tx = yx;
      const ty = yy * cosT - lz * sinT;
      const tz = yy * sinT + lz * cosT;

      const wx = tx * size;
      const wy = ty * size;
      const wz = tz * size;

      const denom = camZ - wz;
      if (denom <= 1) continue;
      const f = focal / denom;
      const sx = centerX + wx * f;
      const sy = centerY + wy * f;
      const scale = f * (camZ / focal);

      proj.push({ sx, sy, scale, p, depth: denom });
    }

    proj.sort((a, b) => b.depth - a.depth);

    // Galactic core: layered radial gradients for a rich luminous center
    {
      const coreR = size * 0.38;
      const outerGlow = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, coreR
      );
      outerGlow.addColorStop(0, "rgba(255, 245, 220, 0.65)");
      outerGlow.addColorStop(0.1, "rgba(255, 230, 180, 0.45)");
      outerGlow.addColorStop(0.3, "rgba(220, 180, 255, 0.2)");
      outerGlow.addColorStop(0.6, "rgba(100, 130, 255, 0.06)");
      outerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.globalAlpha = alpha;
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.ellipse(
        centerX, centerY,
        coreR, coreR * Math.cos(TILT_X) + coreR * 0.15,
        0, 0, Math.PI * 2
      );
      ctx.fill();

      // Inner bright nucleus
      const innerR = size * 0.1;
      const innerGlow = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, innerR
      );
      innerGlow.addColorStop(0, "rgba(255, 255, 240, 0.9)");
      innerGlow.addColorStop(0.4, "rgba(255, 240, 200, 0.5)");
      innerGlow.addColorStop(1, "rgba(255, 220, 180, 0)");

      ctx.fillStyle = innerGlow;
      ctx.beginPath();
      ctx.ellipse(
        centerX, centerY,
        innerR, innerR * Math.cos(TILT_X) + innerR * 0.15,
        0, 0, Math.PI * 2
      );
      ctx.fill();
    }

    // Particles: dust uses "multiply" for darkening, stars use "lighter" for bloom
    for (const { sx, sy, scale, p, depth } of proj) {
      const fog = Math.max(0.2, Math.min(1.3, (camZ * 1.5) / depth));
      const r = Math.max(0.3, p.radius * scale);
      const a = p.opacity * fog * alpha;

      if (p.isDust) {
        ctx.globalCompositeOperation = "multiply";
        ctx.globalAlpha = a * 0.7;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = a;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();

        // Bloom halo on brighter stars
        if (r > 1.0) {
          ctx.globalAlpha = a * 0.12;
          ctx.beginPath();
          ctx.arc(sx, sy, r * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
  }
}