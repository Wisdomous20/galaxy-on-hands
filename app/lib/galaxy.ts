interface GalaxyParticle {
  angle: number;
  distance: number;     // 0..1 distance from core in disk plane
  height: number;       // disk thickness offset (in disk-local z)
  speed: number;        // angular speed (inner faster)
  radius: number;
  color: string;
  opacity: number;
  arm: number;
}

const GALAXY_COLORS = [
  "#ffe8c8",
  "#b4a0ff",
  "#78c8ff",
  "#ffffff",
  "#ffc896",
  "#c8b4ff",
  "#a0d0ff",
];

const ARM_COUNT = 4;
const TILT_X = 1.1;            // radians; how much the disk tips toward viewer
const YAW_SPEED = 0.0008;      // slow camera yaw for life
const SPIN_SPEED = 0.0025;     // galaxy self-rotation

export class Galaxy {
  private particles: GalaxyParticle[] = [];
  private rotation = 0;
  private yaw = 0;

  constructor(count = 1400) {
    for (let i = 0; i < count; i++) {
      const arm = Math.floor(Math.random() * ARM_COUNT);
      const armAngle = (arm / ARM_COUNT) * Math.PI * 2;

      // Bias toward mid-disk, with some bulge in the center
      const r = Math.pow(Math.random(), 0.7);
      const spread = (1 - r) * 0.7 + 0.05;

      this.particles.push({
        angle: armAngle + (Math.random() - 0.5) * spread,
        distance: r,
        // Disk thicker near core (bulge), thinner at edges
        height: (Math.random() - 0.5) * (0.05 + (1 - r) * 0.15),
        speed: 0.002 + (1 - r) * 0.004,
        radius: Math.random() * 1.8 + 0.4,
        color: GALAXY_COLORS[Math.floor(Math.random() * GALAXY_COLORS.length)],
        opacity: Math.random() * 0.5 + 0.4,
        arm,
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

    // Camera / perspective
    const focal = size * 1.2;
    const camZ = size * 2.4;

    // Precompute projected points so we can depth-sort
    type Proj = {
      sx: number;
      sy: number;
      scale: number;
      p: GalaxyParticle;
      spiralAngle: number;
      depth: number; // larger = further from camera
    };
    const proj: Proj[] = [];

    for (const p of this.particles) {
      // Spiral: outer particles get swept further around
      const spiralAngle = p.angle + this.rotation + p.distance * 2.8;

      // Disk-local position
      const lx = Math.cos(spiralAngle) * p.distance;
      const ly = Math.sin(spiralAngle) * p.distance;
      const lz = p.height;

      // Yaw rotation around vertical axis (in disk plane)
      const yx = lx * cosY - ly * sinY;
      const yy = lx * sinY + ly * cosY;

      // Tilt around X axis (tip the disk toward camera)
      const tx = yx;
      const ty = yy * cosT - lz * sinT;
      const tz = yy * sinT + lz * cosT;

      // World-scale
      const wx = tx * size;
      const wy = ty * size;
      const wz = tz * size;

      // Perspective projection
      const denom = camZ - wz;
      if (denom <= 1) continue;
      const f = focal / denom;
      const sx = centerX + wx * f;
      const sy = centerY + wy * f;
      const scale = f * (camZ / focal);

      proj.push({ sx, sy, scale, p, spiralAngle, depth: denom });
    }

    // Far-first draw so near particles sit on top
    proj.sort((a, b) => b.depth - a.depth);

    // --- Core bulge glow (drawn behind particles in projected center) ---
    {
      const coreR = size * 0.35;
      const g = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, coreR
      );
      g.addColorStop(0, "rgba(255, 236, 200, 0.55)");
      g.addColorStop(0.25, "rgba(230, 190, 255, 0.28)");
      g.addColorStop(0.6, "rgba(120, 150, 255, 0.08)");
      g.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.globalAlpha = alpha;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, coreR, coreR * Math.cos(TILT_X) + coreR * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // --- Particles with depth fog ---
    ctx.globalCompositeOperation = "lighter";
    for (const { sx, sy, scale, p, depth } of proj) {
      // Depth fog: nearer = brighter, very far = dim
      const fog = Math.max(0.25, Math.min(1.2, (camZ * 1.5) / depth));
      const r = Math.max(0.3, p.radius * scale);
      const a = p.opacity * fog * alpha;

      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();

      if (r > 1.2) {
        ctx.globalAlpha = a * 0.18;
        ctx.beginPath();
        ctx.arc(sx, sy, r * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
  }
}
