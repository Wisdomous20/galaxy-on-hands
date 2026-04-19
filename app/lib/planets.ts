export interface PlanetInteractPoint {
  x: number;
  y: number;
}

export interface PlanetInfo {
  name: string;
  type: string;
  diameterKm: number;
  distanceFromSunKm: number;
  orbitalPeriodDays: number;
  dayLengthHours: number;
  moons: number;
  surfaceTempC: string;
  description: string;
}

interface SolarPlanet {
  name: string;
  radius: number;
  orbitRadius: number;     // on-screen orbit radius
  orbitSpeed: number;      // angular velocity per frame (relative to Earth)
  phase: number;

  baseColors: string[];
  atmosphereColor: string;
  atmosphereSize: number;
  shadowAngle: number;

  hasRings: boolean;
  ringColors: string[];
  ringWidth: number;
  hasBands: boolean;
  bandColors: string[];

  info: PlanetInfo;

  // Runtime state (push offset)
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  lastX: number;
  lastY: number;
}

// Shared orbit projection constants
const ORBIT_X_SCALE = 0.85;
const ORBIT_Y_SCALE = 0.3;

function createSolarSystem(width: number, height: number): SolarPlanet[] {
  const cx = width / 2;
  const cy = height / 2;

  return [
    {
      name: "Mercury",
      radius: 6,
      orbitRadius: 75,
      orbitSpeed: 0.0042,
      phase: Math.random() * Math.PI * 2,
      baseColors: ["#b0a090", "#8a7e72", "#6e635a"],
      atmosphereColor: "rgba(180, 170, 155, 0.1)",
      atmosphereSize: 1.2,
      shadowAngle: -0.8,
      hasRings: false, ringColors: [], ringWidth: 0,
      hasBands: false, bandColors: [],
      info: {
        name: "Mercury",
        type: "Terrestrial",
        diameterKm: 4_879,
        distanceFromSunKm: 57_900_000,
        orbitalPeriodDays: 88,
        dayLengthHours: 4222.6,
        moons: 0,
        surfaceTempC: "-173 to 427",
        description:
          "The smallest planet and closest to the Sun. Mercury has no atmosphere to retain heat, so it swings between extremely hot days and freezing nights.",
      },
      ox: 0, oy: 0, vx: 0, vy: 0, lastX: cx, lastY: cy,
    },
    {
      name: "Venus",
      radius: 11,
      orbitRadius: 120,
      orbitSpeed: 0.00164,
      phase: Math.random() * Math.PI * 2,
      baseColors: ["#e8c88a", "#d4a050", "#c89040"],
      atmosphereColor: "rgba(240, 220, 160, 0.35)",
      atmosphereSize: 1.5,
      shadowAngle: -0.6,
      hasRings: false, ringColors: [], ringWidth: 0,
      hasBands: false, bandColors: [],
      info: {
        name: "Venus",
        type: "Terrestrial",
        diameterKm: 12_104,
        distanceFromSunKm: 108_200_000,
        orbitalPeriodDays: 225,
        dayLengthHours: 2802,
        moons: 0,
        surfaceTempC: "464 (avg)",
        description:
          "Venus is the hottest planet thanks to a runaway greenhouse effect in its thick CO₂ atmosphere. It rotates backwards, so the Sun rises in the west.",
      },
      ox: 0, oy: 0, vx: 0, vy: 0, lastX: cx, lastY: cy,
    },
    {
      name: "Earth",
      radius: 12,
      orbitRadius: 170,
      orbitSpeed: 0.001,
      phase: Math.random() * Math.PI * 2,
      baseColors: ["#4488cc", "#336699", "#2a5580"],
      atmosphereColor: "rgba(100, 180, 255, 0.3)",
      atmosphereSize: 1.6,
      shadowAngle: -0.5,
      hasRings: false, ringColors: [], ringWidth: 0,
      hasBands: false, bandColors: [],
      info: {
        name: "Earth",
        type: "Terrestrial",
        diameterKm: 12_742,
        distanceFromSunKm: 149_600_000,
        orbitalPeriodDays: 365.25,
        dayLengthHours: 24,
        moons: 1,
        surfaceTempC: "15 (avg)",
        description:
          "The only world known to host life. 71% of its surface is liquid water and its magnetic field shields the surface from most solar radiation.",
      },
      ox: 0, oy: 0, vx: 0, vy: 0, lastX: cx, lastY: cy,
    },
    {
      name: "Mars",
      radius: 9,
      orbitRadius: 225,
      orbitSpeed: 0.000532,
      phase: Math.random() * Math.PI * 2,
      baseColors: ["#c45030", "#a83820", "#8e2e18"],
      atmosphereColor: "rgba(200, 120, 80, 0.2)",
      atmosphereSize: 1.3,
      shadowAngle: -0.4,
      hasRings: false, ringColors: [], ringWidth: 0,
      hasBands: false, bandColors: [],
      info: {
        name: "Mars",
        type: "Terrestrial",
        diameterKm: 6_779,
        distanceFromSunKm: 227_900_000,
        orbitalPeriodDays: 687,
        dayLengthHours: 24.6,
        moons: 2,
        surfaceTempC: "-63 (avg)",
        description:
          "The Red Planet, colored by iron-oxide dust. It has the tallest volcano (Olympus Mons) and the deepest canyon (Valles Marineris) in the Solar System.",
      },
      ox: 0, oy: 0, vx: 0, vy: 0, lastX: cx, lastY: cy,
    },
    {
      name: "Jupiter",
      radius: 28,
      orbitRadius: 310,
      orbitSpeed: 0.0000843,
      phase: Math.random() * Math.PI * 2,
      baseColors: ["#d4a868", "#c89050", "#b87838"],
      atmosphereColor: "rgba(210, 180, 130, 0.25)",
      atmosphereSize: 1.4,
      shadowAngle: -0.3,
      hasRings: false, ringColors: [], ringWidth: 0,
      hasBands: true,
      bandColors: [
        "#c89858", "#e0b878", "#b88040",
        "#d8a868", "#a07030", "#ddb870",
      ],
      info: {
        name: "Jupiter",
        type: "Gas giant",
        diameterKm: 139_820,
        distanceFromSunKm: 778_500_000,
        orbitalPeriodDays: 4_333,
        dayLengthHours: 9.9,
        moons: 95,
        surfaceTempC: "-145 (cloud top)",
        description:
          "The largest planet — more massive than all others combined. Its Great Red Spot is a storm that has been raging for at least 350 years.",
      },
      ox: 0, oy: 0, vx: 0, vy: 0, lastX: cx, lastY: cy,
    },
    {
      name: "Saturn",
      radius: 23,
      orbitRadius: 400,
      orbitSpeed: 0.0000339,
      phase: Math.random() * Math.PI * 2,
      baseColors: ["#e8d098", "#d4b878", "#c0a060"],
      atmosphereColor: "rgba(230, 210, 160, 0.2)",
      atmosphereSize: 1.3,
      shadowAngle: -0.3,
      hasRings: true,
      ringColors: [
        "rgba(210, 190, 150, 0.7)",
        "rgba(180, 160, 120, 0.5)",
        "rgba(200, 185, 145, 0.6)",
        "rgba(160, 140, 100, 0.3)",
      ],
      ringWidth: 3,
      hasBands: true,
      bandColors: ["#d8c088", "#c8b070", "#e0c898"],
      info: {
        name: "Saturn",
        type: "Gas giant",
        diameterKm: 116_460,
        distanceFromSunKm: 1_434_000_000,
        orbitalPeriodDays: 10_759,
        dayLengthHours: 10.7,
        moons: 146,
        surfaceTempC: "-178 (cloud top)",
        description:
          "Famous for its spectacular ring system — billions of ice and rock particles only ~10 m thick on average. Saturn is less dense than water.",
      },
      ox: 0, oy: 0, vx: 0, vy: 0, lastX: cx, lastY: cy,
    },
    {
      name: "Uranus",
      radius: 16,
      orbitRadius: 480,
      orbitSpeed: 0.0000119,
      phase: Math.random() * Math.PI * 2,
      baseColors: ["#80c8d8", "#60b0c8", "#50a0b8"],
      atmosphereColor: "rgba(120, 200, 220, 0.3)",
      atmosphereSize: 1.5,
      shadowAngle: -0.2,
      hasRings: true,
      ringColors: [
        "rgba(140, 200, 210, 0.35)",
        "rgba(100, 170, 190, 0.2)",
      ],
      ringWidth: 1.5,
      hasBands: false, bandColors: [],
      info: {
        name: "Uranus",
        type: "Ice giant",
        diameterKm: 50_724,
        distanceFromSunKm: 2_871_000_000,
        orbitalPeriodDays: 30_687,
        dayLengthHours: 17.2,
        moons: 27,
        surfaceTempC: "-224 (avg)",
        description:
          "An ice giant tilted 98°, essentially rolling around the Sun on its side. Methane in its atmosphere gives it that pale cyan color.",
      },
      ox: 0, oy: 0, vx: 0, vy: 0, lastX: cx, lastY: cy,
    },
    {
      name: "Neptune",
      radius: 15,
      orbitRadius: 555,
      orbitSpeed: 0.00000606,
      phase: Math.random() * Math.PI * 2,
      baseColors: ["#4060e0", "#3050c0", "#2840a0"],
      atmosphereColor: "rgba(80, 120, 240, 0.3)",
      atmosphereSize: 1.5,
      shadowAngle: -0.2,
      hasRings: false, ringColors: [], ringWidth: 0,
      hasBands: false, bandColors: [],
      info: {
        name: "Neptune",
        type: "Ice giant",
        diameterKm: 49_244,
        distanceFromSunKm: 4_495_000_000,
        orbitalPeriodDays: 60_190,
        dayLengthHours: 16.1,
        moons: 14,
        surfaceTempC: "-214 (avg)",
        description:
          "The windiest planet: supersonic winds reach 2,100 km/h. Discovered by mathematical prediction before it was ever observed.",
      },
      ox: 0, oy: 0, vx: 0, vy: 0, lastX: cx, lastY: cy,
    },
  ];
}

// Scale orbital speeds so the viewer sees motion in seconds instead of years.
// Multiplier turns real relative speeds into visible animation rates.
const TIME_SCALE = 12;

export class Planets {
  private planets: SolarPlanet[];
  private frame = 0;
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.planets = createSolarSystem(width, height);
  }

  private getCenter(): { cx: number; cy: number } {
    return { cx: this.width / 2, cy: this.height * 0.55 };
  }

  /** Hit-test canvas coords against the drawn planet positions. */
  hitTest(x: number, y: number): PlanetInfo | null {
    let best: { info: PlanetInfo; d2: number } | null = null;
    for (const p of this.planets) {
      const dx = p.lastX - x;
      const dy = p.lastY - y;
      const d2 = dx * dx + dy * dy;
      const grab = (p.radius + 6) * (p.radius + 6);
      if (d2 <= grab && (!best || d2 < best.d2)) {
        best = { info: p.info, d2 };
      }
    }
    return best?.info ?? null;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    alpha: number,
    interactPoints: PlanetInteractPoint[] = []
  ): void {
    if (alpha <= 0) return;
    this.frame++;

    const { cx, cy } = this.getCenter();

    // --- Orbit paths (faint elliptical rings) ---
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    ctx.globalAlpha = alpha * 0.85;
    for (const p of this.planets) {
      ctx.beginPath();
      ctx.ellipse(
        cx, cy,
        p.orbitRadius * ORBIT_X_SCALE,
        p.orbitRadius * ORBIT_Y_SCALE,
        0, 0, Math.PI * 2
      );
      ctx.stroke();
    }
    ctx.restore();

    // --- Sun at center ---
    this.drawSun(ctx, cx, cy, alpha);

    for (const p of this.planets) {
      const t = this.frame * p.orbitSpeed * TIME_SCALE + p.phase;

      const orbitX = cx + Math.cos(t) * p.orbitRadius * ORBIT_X_SCALE;
      const orbitY = cy + Math.sin(t) * p.orbitRadius * ORBIT_Y_SCALE;

      // Hand repulsion
      const pushRadius = p.radius * 3;
      const pushR2 = pushRadius * pushRadius;
      for (const hp of interactPoints) {
        const dx = p.lastX - hp.x;
        const dy = p.lastY - hp.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < pushR2 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const falloff = 1 - d / pushRadius;
          const force = 3.5 * falloff * falloff;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
        }
      }

      p.vx *= 0.88;
      p.vy *= 0.88;
      p.ox += p.vx;
      p.oy += p.vy;
      p.ox *= 0.98;
      p.oy *= 0.98;

      const x = orbitX + p.ox;
      const y = orbitY + p.oy;
      p.lastX = x;
      p.lastY = y;

      if (p.hasRings) this.drawRings(ctx, x, y, p, alpha, Math.PI, Math.PI * 2);

      // Planet body
      const lightX = x + Math.cos(p.shadowAngle) * p.radius * 0.4;
      const lightY = y + Math.sin(p.shadowAngle) * p.radius * 0.4;
      const bodyGrad = ctx.createRadialGradient(
        lightX, lightY, p.radius * 0.05,
        x, y, p.radius
      );
      bodyGrad.addColorStop(0, p.baseColors[0]);
      bodyGrad.addColorStop(0.5, p.baseColors[1]);
      bodyGrad.addColorStop(1, p.baseColors[2]);

      ctx.globalAlpha = alpha;
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.arc(x, y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      if (p.hasBands) this.drawBands(ctx, x, y, p, alpha);
      if (p.name === "Earth") this.drawEarthDetails(ctx, x, y, p, alpha);
      if (p.name === "Mars") this.drawMarsCaps(ctx, x, y, p, alpha);
      if (p.name === "Jupiter") this.drawRedSpot(ctx, x, y, p, alpha);

      // Terminator shadow
      const shadowGrad = ctx.createRadialGradient(
        x - Math.cos(p.shadowAngle) * p.radius * 0.6,
        y - Math.sin(p.shadowAngle) * p.radius * 0.6,
        p.radius * 0.2,
        x, y, p.radius
      );
      shadowGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
      shadowGrad.addColorStop(0.5, "rgba(0, 0, 0, 0.15)");
      shadowGrad.addColorStop(1, "rgba(0, 0, 0, 0.6)");
      ctx.globalAlpha = alpha;
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.arc(x, y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Atmosphere
      const atmosGrad = ctx.createRadialGradient(
        x, y, p.radius * 0.9,
        x, y, p.radius * p.atmosphereSize
      );
      atmosGrad.addColorStop(0, p.atmosphereColor);
      atmosGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.globalAlpha = alpha * 0.8;
      ctx.fillStyle = atmosGrad;
      ctx.beginPath();
      ctx.arc(x, y, p.radius * p.atmosphereSize, 0, Math.PI * 2);
      ctx.fill();

      if (p.hasRings) this.drawRings(ctx, x, y, p, alpha, 0, Math.PI);
    }

    ctx.globalAlpha = 1;
  }

  private drawSun(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    alpha: number
  ): void {
    const coronaR = 70;
    const corona = ctx.createRadialGradient(cx, cy, 0, cx, cy, coronaR);
    corona.addColorStop(0, "rgba(255, 240, 180, 0.9)");
    corona.addColorStop(0.2, "rgba(255, 200, 100, 0.55)");
    corona.addColorStop(0.6, "rgba(255, 140, 60, 0.15)");
    corona.addColorStop(1, "rgba(255, 100, 40, 0)");

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = alpha;
    ctx.fillStyle = corona;
    ctx.beginPath();
    ctx.arc(cx, cy, coronaR, 0, Math.PI * 2);
    ctx.fill();

    // Bright core
    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 22);
    core.addColorStop(0, "#ffffff");
    core.addColorStop(0.4, "#ffe8a0");
    core.addColorStop(1, "rgba(255, 180, 80, 0)");
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private drawBands(
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    p: SolarPlanet,
    alpha: number
  ): void {
    ctx.save();
    ctx.globalAlpha = alpha * 0.35;
    ctx.globalCompositeOperation = "source-atop";
    ctx.beginPath();
    ctx.arc(x, y, p.radius, 0, Math.PI * 2);
    ctx.clip();

    const bandCount = p.bandColors.length;
    const bandHeight = (p.radius * 2) / bandCount;
    for (let i = 0; i < bandCount; i++) {
      ctx.fillStyle = p.bandColors[i];
      ctx.fillRect(
        x - p.radius,
        y - p.radius + i * bandHeight,
        p.radius * 2,
        bandHeight
      );
    }
    ctx.restore();
  }

  private drawEarthDetails(
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    p: SolarPlanet,
    alpha: number
  ): void {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, p.radius, 0, Math.PI * 2);
    ctx.clip();

    ctx.globalAlpha = alpha * 0.3;
    ctx.fillStyle = "#3a8040";
    const continents = [
      { cx: -0.3, cy: -0.2, rx: 0.35, ry: 0.25 },
      { cx: 0.25, cy: 0.0, rx: 0.2, ry: 0.35 },
      { cx: -0.1, cy: 0.35, rx: 0.25, ry: 0.15 },
      { cx: 0.35, cy: -0.3, rx: 0.18, ry: 0.2 },
    ];
    for (const c of continents) {
      ctx.beginPath();
      ctx.ellipse(
        x + c.cx * p.radius, y + c.cy * p.radius,
        c.rx * p.radius, c.ry * p.radius,
        0.3, 0, Math.PI * 2
      );
      ctx.fill();
    }

    ctx.globalAlpha = alpha * 0.25;
    ctx.fillStyle = "#ffffff";
    const clouds = [
      { cx: 0.1, cy: -0.15, rx: 0.5, ry: 0.08 },
      { cx: -0.2, cy: 0.2, rx: 0.4, ry: 0.06 },
      { cx: 0.3, cy: 0.3, rx: 0.3, ry: 0.07 },
    ];
    for (const c of clouds) {
      ctx.beginPath();
      ctx.ellipse(
        x + c.cx * p.radius, y + c.cy * p.radius,
        c.rx * p.radius, c.ry * p.radius,
        -0.2, 0, Math.PI * 2
      );
      ctx.fill();
    }
    ctx.restore();
  }

  private drawMarsCaps(
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    p: SolarPlanet,
    alpha: number
  ): void {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, p.radius, 0, Math.PI * 2);
    ctx.clip();

    ctx.globalAlpha = alpha * 0.5;
    ctx.fillStyle = "#e8e0d8";
    ctx.beginPath();
    ctx.ellipse(x, y - p.radius * 0.8, p.radius * 0.35, p.radius * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x, y + p.radius * 0.85, p.radius * 0.25, p.radius * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private drawRedSpot(
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    p: SolarPlanet,
    alpha: number
  ): void {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, p.radius, 0, Math.PI * 2);
    ctx.clip();

    const spotX = x + p.radius * 0.25;
    const spotY = y + p.radius * 0.3;
    const spotGrad = ctx.createRadialGradient(
      spotX, spotY, 0,
      spotX, spotY, p.radius * 0.18
    );
    spotGrad.addColorStop(0, "rgba(180, 60, 30, 0.6)");
    spotGrad.addColorStop(0.6, "rgba(160, 50, 25, 0.3)");
    spotGrad.addColorStop(1, "rgba(140, 40, 20, 0)");
    ctx.globalAlpha = alpha;
    ctx.fillStyle = spotGrad;
    ctx.beginPath();
    ctx.ellipse(spotX, spotY, p.radius * 0.18, p.radius * 0.12, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private drawRings(
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    p: SolarPlanet,
    alpha: number,
    startAngle: number,
    endAngle: number
  ): void {
    ctx.save();
    ctx.translate(x, y);
    const tilt = 0.3;
    for (let i = 0; i < p.ringColors.length; i++) {
      const ringScale = 1.6 + i * 0.25;
      const vertScale = 0.45 + i * 0.05;
      ctx.globalAlpha = alpha * 0.85;
      ctx.strokeStyle = p.ringColors[i];
      ctx.lineWidth = p.ringWidth;
      ctx.beginPath();
      ctx.ellipse(
        0, 0,
        p.radius * ringScale, p.radius * vertScale,
        tilt,
        startAngle, endAngle
      );
      ctx.stroke();
    }
    ctx.restore();
  }
}
