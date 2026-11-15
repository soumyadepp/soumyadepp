export type ReelMode =
  | "none"
  | "pull"
  | "flow"
  | "broker"
  | "spiral"
  | "hole"
  | "signal"
  | "ripples"
  | "contours"
  | "orbits"
  | "waves";

export type ReelOptions = {
  mode: ReelMode;
  grade: string;
  focusX?: number;
  focusY?: number;
  badges?: string;
};

type Particle = {
  x: number;
  y: number;
  px: number;
  py: number;
  life: number;
  lane: number;
};

type Arc = {
  radius: number;
  angle: number;
  length: number;
  alpha: number;
  width: number;
};

type Star = { x: number; y: number; size: number };

type Pulse = { t: number; speed: number; lane: number; outbound: boolean };

type Echo = { mine: boolean; age: number };

const STAGE = "5,6,7";
const TAU = Math.PI * 2;
const LANES = 5;
const DISK_TILT = 0.13;
const ORBIT_TILT = 0.5;
const POINTER_REACH = 170;
const POINTER_PUSH = 3.2;
const HOLE_FOLLOW = 0.06;
const CONTOUR_CELL = 18;
const CONTOUR_LEVELS = [
  -2.75, -2.5, -2.25, -2, -1.75, -1.5, -1.25, -1, -0.75, -0.5, -0.25, 0, 0.25,
  0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75,
];
const CONTOUR_EDGES: number[][][] = [
  [],
  [[3, 0]],
  [[0, 1]],
  [[3, 1]],
  [[1, 2]],
  [
    [3, 0],
    [1, 2],
  ],
  [[0, 2]],
  [[3, 2]],
  [[2, 3]],
  [[0, 2]],
  [
    [0, 1],
    [2, 3],
  ],
  [[1, 2]],
  [[3, 1]],
  [[0, 1]],
  [[3, 0]],
  [],
];
const ORBIT_SQUASH = 0.36;
const ORBIT_LEAN = -0.2;
const SIGNAL_LANES = [0.22, 0.34, 0.46];
const SIGNAL_TAIL = 0.14;
const ECHO_LIFE = 80;

/**
 * Draws the live frames used across the site onto a 2D canvas.
 *
 * Each mode renders light trails that describe a system: lanes for roles,
 * a broker for pub/sub, a spiral for talks, waves for writing, two points
 * trading signals for the contact chapter, and a black hole for the page
 * that does not exist.
 */
export class Reel {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private options: ReelOptions;
  private width = 0;
  private height = 0;
  private time = 0;
  private frame = 0;
  private running = false;
  private particles: Particle[] = [];
  private stars: Star[] = [];
  private disk: Arc[] = [];
  private halo: Arc[] = [];
  private pointer: { x: number; y: number } | null = null;
  private badges: { image: HTMLImageElement; weight: number }[] = [];
  private rings: number[] = [];
  private driftX = 0;
  private driftY = 0;
  private pulses: Pulse[] = [];
  private echoes: Echo[] = [];
  private speaker = true;
  private pause = 40;

  constructor(canvas: HTMLCanvasElement, options: ReelOptions) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2D canvas is not available");
    this.canvas = canvas;
    this.ctx = ctx;
    this.options = options;
    this.loadBadges();
    this.resize();
  }

  /**
   * Switches the frame to another mode or grade and re-seeds its particles.
   *
   * Args:
   *   options: The mode, grade and focus point to render from now on.
   */
  update(options: ReelOptions): void {
    const changed =
      options.mode !== this.options.mode ||
      options.focusX !== this.options.focusX ||
      options.focusY !== this.options.focusY;
    const rebadge = options.badges !== this.options.badges;
    this.options = options;
    if (rebadge) this.loadBadges();
    if (changed) {
      this.particles = [];
      this.disk = [];
      this.halo = [];
      this.rings = [];
      this.pulses = [];
      this.echoes = [];
      this.clear();
    }
  }

  /**
   * Tells the frame where the pointer is, so the light can react to it.
   *
   * Args:
   *   point: The pointer position in canvas coordinates, or null when the
   *     pointer is outside the frame.
   */
  setPointer(point: { x: number; y: number } | null): void {
    this.pointer = point;
  }

  private loadBadges(): void {
    const entries = this.options.badges ? this.options.badges.split(",") : [];
    this.badges = entries.map((entry) => {
      const [source, weight] = entry.split("@");
      const image = new Image();
      image.src = source;
      return { image, weight: Number(weight) || 1 };
    });
  }

  /** Matches the drawing buffer to the canvas element's current size. */
  resize(): void {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    if (width === 0 || height === 0) return;
    if (width === this.width && height === this.height) return;
    this.width = width;
    this.height = height;
    this.canvas.width = Math.round(width * ratio);
    this.canvas.height = Math.round(height * ratio);
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.particles = [];
    this.stars = [];
    this.disk = [];
    this.halo = [];
    this.rings = [];
    this.pulses = [];
    this.echoes = [];
    this.clear();
  }

  /** Starts the animation loop. */
  start(): void {
    if (this.running) return;
    this.running = true;
    const loop = () => {
      if (!this.running) return;
      this.step();
      this.frame = requestAnimationFrame(loop);
    };
    this.frame = requestAnimationFrame(loop);
  }

  /** Stops the animation loop and keeps the last frame on screen. */
  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.frame);
  }

  /**
   * Renders a finished still, for visitors who prefer reduced motion.
   *
   * Args:
   *   steps: How many simulation steps to run before stopping.
   */
  still(steps = 240): void {
    this.clear();
    for (let i = 0; i < steps; i += 1) this.step();
  }

  private clear(): void {
    const { ctx } = this;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = this.overPhoto() ? "#000000" : `rgb(${STAGE})`;
    ctx.fillRect(0, 0, this.width, this.height);
  }

  private overPhoto(): boolean {
    return this.options.mode === "pull";
  }

  private step(): void {
    if (this.width === 0) return;
    this.time += 0.016;
    if (this.options.mode === "none") {
      this.clear();
      return;
    }
    if (this.options.mode === "hole") {
      this.stepHole();
      return;
    }
    if (this.options.mode === "signal") {
      this.stepSignal();
      return;
    }
    if (this.options.mode === "ripples") {
      this.stepRipples();
      return;
    }
    if (this.options.mode === "orbits") {
      this.stepOrbits();
      return;
    }
    if (this.options.mode === "waves") {
      this.stepWaves();
      return;
    }
    if (this.options.mode === "contours") {
      this.stepContours();
      return;
    }
    this.stepTrails();
  }

  private seedStars(): void {
    if (this.stars.length > 0) return;
    const count = Math.round((this.width * this.height) / 7600);
    for (let i = 0; i < count; i += 1) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() < 0.2 ? 2 : 1,
      });
    }
  }

  private drawStars(alpha: number): void {
    const { ctx } = this;
    this.seedStars();
    ctx.fillStyle = `rgba(238,240,242,${alpha})`;
    for (const star of this.stars) {
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }
  }

  private drawWell(): void {
    const { ctx, width, height } = this;
    const x = width * (this.options.focusX ?? 0.5);
    const y = height * (this.options.focusY ?? 0.5);
    const reach = width * 0.32;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, ORBIT_TILT);
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, reach);
    glow.addColorStop(0, "rgba(255,176,96,0.006)");
    glow.addColorStop(0.5, "rgba(255,160,80,0.002)");
    glow.addColorStop(1, "rgba(255,150,70,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, reach, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  private spawn(particle: Particle): void {
    const { mode } = this.options;
    const { width, height } = this;
    particle.life = 120 + Math.random() * 260;
    particle.lane = Math.floor(Math.random() * LANES);
    if (mode === "pull") {
      const angle = Math.random() * TAU;
      const radius = (0.3 + Math.random() * 0.65) * width;
      particle.life = 500 + Math.random() * 700;
      particle.x =
        width * (this.options.focusX ?? 0.5) + Math.cos(angle) * radius;
      particle.y =
        height * (this.options.focusY ?? 0.5) +
        Math.sin(angle) * radius * ORBIT_TILT;
    } else if (mode === "broker") {
      particle.x = -20 - Math.random() * 200;
      particle.y = Math.random() * height;
    } else if (mode === "spiral") {
      const angle = Math.random() * TAU;
      const radius = 10 + Math.random() * 60;
      particle.x = width / 2 + Math.cos(angle) * radius;
      particle.y = height * 0.46 + Math.sin(angle) * radius;
    } else {
      particle.x = Math.random() * width;
      particle.y = Math.random() * height;
    }
    particle.px = particle.x;
    particle.py = particle.y;
  }

  private move(particle: Particle): void {
    const { mode } = this.options;
    const { width, height } = this;
    const centerX = width / 2;
    const centerY = height * 0.46;
    const laneY = height * (0.16 + particle.lane * 0.15);
    let vx = 0;
    let vy = 0;
    let arrived = false;
    if (mode === "pull") {
      const dx = width * (this.options.focusX ?? 0.5) - particle.x;
      const dy =
        (height * (this.options.focusY ?? 0.5) - particle.y) / ORBIT_TILT;
      const distance = Math.max(Math.hypot(dx, dy), 1);
      const speed = Math.min(2.4, 26 / Math.sqrt(distance) + 0.4);
      vx = ((dx / distance) * 0.34 - (dy / distance) * 0.94) * speed;
      vy =
        ((dy / distance) * 0.34 + (dx / distance) * 0.94) * speed * ORBIT_TILT;
      arrived = distance < width * 0.025;
    } else if (mode === "flow") {
      const angle =
        Math.sin(particle.x * 0.004 + this.time * 0.2) +
        Math.cos(particle.y * 0.006 - this.time * 0.15);
      vx = Math.cos(angle * 1.6) * 1.4 + 0.7;
      vy = Math.sin(angle * 1.6) * 1.1;
    } else if (mode === "broker") {
      vx = 2.4;
      vy =
        particle.x < centerX
          ? ((centerY - particle.y) * 0.05 * Math.max(particle.x, 0)) / centerX
          : (laneY - particle.y) * 0.014 +
            Math.sin(particle.x * 0.011 + particle.lane * 1.3) * 0.7;
    } else {
      const dx = particle.x - centerX;
      const dy = particle.y - centerY;
      const distance = Math.max(Math.hypot(dx, dy), 1);
      vx = (-dy / distance) * 1.1 + (dx / distance) * 0.9;
      vy = (dx / distance) * 1.1 + (dy / distance) * 0.9;
    }
    if (this.pointer) {
      const awayX = particle.x - this.pointer.x;
      const awayY = particle.y - this.pointer.y;
      const reach = Math.hypot(awayX, awayY);
      if (reach < POINTER_REACH && reach > 1) {
        const push = (1 - reach / POINTER_REACH) * POINTER_PUSH;
        vx += (awayX / reach) * push;
        vy += (awayY / reach) * push;
      }
    }
    particle.px = particle.x;
    particle.py = particle.y;
    particle.x += vx;
    particle.y += vy;
    particle.life -= 1;
    const outside =
      particle.x > width + 30 ||
      particle.x < -260 ||
      particle.y > height + 30 ||
      particle.y < -30;
    const gone = particle.life <= 0 || arrived || (mode !== "pull" && outside);
    if (gone) this.spawn(particle);
  }

  private stepTrails(): void {
    const { ctx, width, height } = this;
    const overPhoto = this.overPhoto();
    const full = Math.max(
      220,
      Math.min(560, Math.round((width * height) / 2800)),
    );
    const target = overPhoto ? 150 : full;
    while (this.particles.length < target) {
      const particle: Particle = { x: 0, y: 0, px: 0, py: 0, life: 0, lane: 0 };
      this.spawn(particle);
      if (!this.overPhoto()) {
        particle.x = Math.random() * width;
        particle.px = particle.x;
      }
      this.particles.push(particle);
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = overPhoto ? "rgba(0,0,0,0.022)" : `rgba(${STAGE},0.05)`;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";
    if (overPhoto) this.drawWell();
    else this.drawStars(0.045);
    this.drawNodes();
    ctx.lineWidth = overPhoto ? 1 : 1.5;
    ctx.strokeStyle = `rgba(${this.options.grade},${overPhoto ? 0.3 : 0.62})`;
    ctx.beginPath();
    for (const particle of this.particles) {
      this.move(particle);
      const small =
        Math.abs(particle.x - particle.px) < 40 &&
        Math.abs(particle.y - particle.py) < 40;
      if (small) {
        ctx.moveTo(particle.px, particle.py);
        ctx.lineTo(particle.x, particle.y);
      }
    }
    ctx.stroke();
  }

  private drawNodes(): void {
    const { ctx, width, height } = this;
    if (this.options.mode !== "broker") return;
    const x = width / 2;
    const y = height * 0.46;
    const glow = ctx.createRadialGradient(x, y, 0, x, y, 30);
    glow.addColorStop(0, `rgba(${this.options.grade},0.03)`);
    glow.addColorStop(1, `rgba(${this.options.grade},0)`);
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "rgba(255,244,230,0.12)";
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, TAU);
    ctx.fill();
  }

  private stepRipples(): void {
    const { ctx, width, height } = this;
    const reach = Math.hypot(width, height) * 0.62;
    const homeX = width * (this.options.focusX ?? 0.5);
    const homeY = height * (this.options.focusY ?? 0.46);
    const pullX = this.pointer ? (this.pointer.x - homeX) * 0.12 : 0;
    const pullY = this.pointer ? (this.pointer.y - homeY) * 0.12 : 0;
    this.driftX += (pullX - this.driftX) * 0.05;
    this.driftY += (pullY - this.driftY) * 0.05;
    const x = homeX + this.driftX;
    const y = homeY + this.driftY;

    if (this.rings.length === 0) {
      for (let radius = 0; radius < reach; radius += 54)
        this.rings.push(radius);
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = `rgb(${STAGE})`;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";
    this.drawStars(0.35);
    for (let i = 0; i < this.rings.length; i += 1) {
      this.rings[i] += 0.45;
      if (this.rings[i] > reach) this.rings[i] -= reach;
      const radius = this.rings[i];
      const strength = 1 - radius / reach;
      const wobble = 1 + 0.05 * Math.sin(this.time * 0.8 + radius * 0.02);
      ctx.strokeStyle = `rgba(${this.options.grade},${(0.7 * strength * strength).toFixed(3)})`;
      ctx.lineWidth = 0.8 + 2.2 * strength;
      ctx.beginPath();
      ctx.ellipse(x, y, radius * wobble, radius * 0.55, 0, 0, TAU);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(255,250,240,0.9)";
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, TAU);
    ctx.fill();
  }

  private stepOrbits(): void {
    const { ctx, width, height } = this;
    const homeX = width * (this.options.focusX ?? 0.6);
    const narrow = width < 640;
    const homeY = height * (narrow ? 0.32 : (this.options.focusY ?? 0.42));
    const pullX = this.pointer ? (this.pointer.x - homeX) * 0.08 : 0;
    const pullY = this.pointer ? (this.pointer.y - homeY) * 0.08 : 0;
    this.driftX += (pullX - this.driftX) * 0.05;
    this.driftY += (pullY - this.driftY) * 0.05;
    const x = narrow ? width / 2 + this.driftX : homeX + this.driftX;
    const y = homeY + this.driftY;
    const base = Math.min(
      Math.max(width * 0.1, 58),
      height * 0.23,
      width * 0.115,
    );
    const rings = 6;
    if (this.disk.length === 0) {
      for (let ring = 0; ring < rings; ring += 1) {
        const count = 2 + ring;
        for (let i = 0; i < count; i += 1) {
          this.disk.push({
            radius: base * (0.7 + ring * 0.62),
            angle: Math.random() * TAU,
            length: 0.35 + Math.random() * 0.9,
            alpha: 0.35 + Math.random() * 0.4,
            width: 1 + Math.random() * 1.4,
          });
        }
      }
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = `rgb(${STAGE})`;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";
    this.drawStars(0.35);
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgba(${this.options.grade},0.13)`;
    for (let ring = 0; ring < rings; ring += 1) {
      const radius = base * (0.7 + ring * 0.62);
      ctx.beginPath();
      ctx.ellipse(x, y, radius, radius * ORBIT_SQUASH, ORBIT_LEAN, 0, TAU);
      ctx.stroke();
    }
    for (const arc of this.disk) {
      arc.angle += 0.0105 / Math.sqrt(arc.radius / base);
      if (arc.angle > TAU) arc.angle -= TAU;
      ctx.strokeStyle = `rgba(${this.options.grade},${arc.alpha.toFixed(3)})`;
      ctx.lineWidth = arc.width;
      ctx.beginPath();
      ctx.ellipse(
        x,
        y,
        arc.radius,
        arc.radius * ORBIT_SQUASH,
        ORBIT_LEAN,
        arc.angle - arc.length,
        arc.angle,
      );
      ctx.stroke();
      const headX = arc.radius * Math.cos(arc.angle);
      const headY = arc.radius * ORBIT_SQUASH * Math.sin(arc.angle);
      ctx.fillStyle = "rgba(255,246,232,0.9)";
      ctx.beginPath();
      ctx.arc(
        x + headX * Math.cos(ORBIT_LEAN) - headY * Math.sin(ORBIT_LEAN),
        y + headX * Math.sin(ORBIT_LEAN) + headY * Math.cos(ORBIT_LEAN),
        1.8,
        0,
        TAU,
      );
      ctx.fill();
    }
    ctx.fillStyle = "rgba(255,246,232,0.95)";
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, TAU);
    ctx.fill();

    ctx.globalCompositeOperation = "source-over";
    const heaviest = Math.max(1, ...this.badges.map((badge) => badge.weight));
    this.badges.forEach((badge, index) => {
      const { image } = badge;
      if (!image.complete || image.naturalWidth === 0) return;
      const share = Math.sqrt(badge.weight / heaviest);
      const size = Math.min(base * 0.3, 20 + 18 * share);
      const radius = base * (0.7 + (index + 1) * 0.62);
      const angle =
        this.time * (0.22 / Math.sqrt(radius / base)) + index * 1.9 + 0.6;
      const flatX = radius * Math.cos(angle);
      const flatY = radius * ORBIT_SQUASH * Math.sin(angle);
      const badgeX =
        x + flatX * Math.cos(ORBIT_LEAN) - flatY * Math.sin(ORBIT_LEAN);
      const badgeY =
        y + flatX * Math.sin(ORBIT_LEAN) + flatY * Math.cos(ORBIT_LEAN);
      ctx.save();
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, size, 0, TAU);
      ctx.clip();
      ctx.drawImage(image, badgeX - size, badgeY - size, size * 2, size * 2);
      ctx.restore();
      ctx.strokeStyle = "rgba(238,240,242,0.85)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, size, 0, TAU);
      ctx.stroke();
    });
  }

  private stepWaves(): void {
    const { ctx, width, height, time } = this;
    const count = Math.max(6, Math.round(height / 46));
    const gap = height / (count + 1);
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = `rgb(${STAGE})`;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";
    this.drawStars(0.3);
    for (let line = 0; line < count; line += 1) {
      const baseY = gap * (line + 1);
      const middle = 1 - Math.abs(line - (count - 1) / 2) / count;
      ctx.strokeStyle = `rgba(${this.options.grade},${(0.18 + 0.4 * middle).toFixed(3)})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let x = -10; x <= width + 10; x += 8) {
        const swell = Math.sin(x * 0.0021 + time * 0.3 + line * 0.9);
        let amplitude = gap * 0.55 * (0.25 + 0.75 * swell * swell);
        if (this.pointer) {
          const distance = Math.hypot(
            x - this.pointer.x,
            baseY - this.pointer.y,
          );
          amplitude +=
            gap * 1.1 * Math.exp(-(distance * distance) / (2 * 130 * 130));
        }
        const y =
          baseY +
          amplitude *
            Math.sin(
              x * (0.011 + line * 0.0013) +
                time * (0.9 + line * 0.07) +
                line * 1.7,
            );
        if (x === -10) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  private field(x: number, y: number): number {
    const { width, height, time } = this;
    let value =
      Math.sin(x * 0.0068 + time * 0.2) +
      Math.sin(y * 0.0094 - time * 0.16) +
      Math.sin((x + y) * 0.0047 + time * 0.12) +
      0.7 *
        Math.sin(
          Math.hypot(x - width * 0.62, y - height * 0.4) * 0.0075 - time * 0.26,
        );
    if (this.pointer) {
      const distance = Math.hypot(x - this.pointer.x, y - this.pointer.y);
      value += 1.9 * Math.exp(-(distance * distance) / (2 * 150 * 150));
    }
    return value;
  }

  private stepContours(): void {
    const { ctx, width, height } = this;
    const columns = Math.ceil(width / CONTOUR_CELL) + 1;
    const rows = Math.ceil(height / CONTOUR_CELL) + 1;
    const values = new Float32Array(columns * rows);
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        values[row * columns + column] = this.field(
          column * CONTOUR_CELL,
          row * CONTOUR_CELL,
        );
      }
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = `rgb(${STAGE})`;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";
    ctx.lineWidth = 1;
    CONTOUR_LEVELS.forEach((level, index) => {
      const major = index % 4 === 3;
      ctx.strokeStyle = `rgba(${this.options.grade},${major ? 0.55 : 0.2})`;
      ctx.beginPath();
      for (let row = 0; row < rows - 1; row += 1) {
        for (let column = 0; column < columns - 1; column += 1) {
          const corner = [
            values[row * columns + column],
            values[row * columns + column + 1],
            values[(row + 1) * columns + column + 1],
            values[(row + 1) * columns + column],
          ];
          const kind =
            (corner[0] > level ? 1 : 0) |
            (corner[1] > level ? 2 : 0) |
            (corner[2] > level ? 4 : 0) |
            (corner[3] > level ? 8 : 0);
          const edges = CONTOUR_EDGES[kind];
          if (edges.length === 0) continue;
          const x = column * CONTOUR_CELL;
          const y = row * CONTOUR_CELL;
          const cut = (a: number, b: number) =>
            (level - corner[a]) / (corner[b] - corner[a] || 1e-6);
          const point = (edge: number): [number, number] => {
            if (edge === 0) return [x + cut(0, 1) * CONTOUR_CELL, y];
            if (edge === 1)
              return [x + CONTOUR_CELL, y + cut(1, 2) * CONTOUR_CELL];
            if (edge === 2)
              return [x + cut(3, 2) * CONTOUR_CELL, y + CONTOUR_CELL];
            return [x, y + cut(0, 3) * CONTOUR_CELL];
          };
          for (const [from, to] of edges) {
            const start = point(from);
            const end = point(to);
            ctx.moveTo(start[0], start[1]);
            ctx.lineTo(end[0], end[1]);
          }
        }
      }
      ctx.stroke();
    });
  }

  private seedHole(radius: number): void {
    if (this.disk.length > 0) return;
    for (let i = 0; i < 300; i += 1) {
      this.disk.push({
        radius: radius * (1.45 + Math.random() ** 1.7 * 2.5),
        angle: Math.random() * TAU,
        length: 0.25 + Math.random() * 0.8,
        alpha: 0.03 + Math.random() * 0.09,
        width: 0.6 + Math.random() * 1.8,
      });
    }
    for (let i = 0; i < 70; i += 1) {
      this.halo.push({
        radius: radius * (1.1 + Math.random() * 0.42),
        angle: Math.random() * TAU,
        length: 0.4 + Math.random() * 1.1,
        alpha: 0.02 + Math.random() * 0.06,
        width: 0.8 + Math.random() * 1.6,
      });
    }
  }

  private drawDisk(arcs: Arc[], x: number, y: number, radius: number): void {
    const { ctx } = this;
    for (const arc of arcs) {
      const side = Math.cos(arc.angle - arc.length * 0.5);
      const doppler = 0.5 + 0.5 * (0.5 - 0.5 * side);
      const heat = (arc.radius / radius - 1.45) / 2.5;
      const green = Math.round(228 - 85 * heat);
      const blue = Math.round(196 - 135 * heat);
      const alpha = (arc.alpha * doppler).toFixed(3);
      ctx.strokeStyle = `rgba(255,${green},${blue},${alpha})`;
      ctx.lineWidth = arc.width;
      ctx.beginPath();
      ctx.ellipse(
        x,
        y,
        arc.radius,
        arc.radius * DISK_TILT,
        0,
        arc.angle - arc.length,
        arc.angle,
      );
      ctx.stroke();
    }
  }

  private stepHole(): void {
    const { ctx, width, height } = this;
    const homeX = width * (this.options.focusX ?? 0.7);
    const homeY = height * (this.options.focusY ?? 0.4);
    const pullX = this.pointer ? (this.pointer.x - homeX) * HOLE_FOLLOW : 0;
    const pullY = this.pointer ? (this.pointer.y - homeY) * HOLE_FOLLOW : 0;
    this.driftX += (pullX - this.driftX) * 0.05;
    this.driftY += (pullY - this.driftY) * 0.05;
    const x = homeX + this.driftX;
    const y = homeY + this.driftY;
    const radius = Math.min(Math.max(width * 0.085, 62), height * 0.14, 130);
    this.seedHole(radius);

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = `rgba(${STAGE},0.3)`;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";
    this.drawStars(0.2);

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, 0.34);
    const glow = ctx.createRadialGradient(
      0,
      0,
      radius * 0.9,
      0,
      0,
      radius * 4.2,
    );
    glow.addColorStop(0, "rgba(255,170,90,0.085)");
    glow.addColorStop(0.55, "rgba(255,150,70,0.025)");
    glow.addColorStop(1, "rgba(255,150,70,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 4.2, 0, TAU);
    ctx.fill();
    ctx.restore();

    const back: Arc[] = [];
    const front: Arc[] = [];
    for (const arc of this.disk) {
      arc.angle += 0.007 / Math.sqrt(arc.radius / radius);
      if (arc.angle > TAU) arc.angle -= TAU;
      if (Math.sin(arc.angle - arc.length * 0.5) < 0) back.push(arc);
      else front.push(arc);
    }
    this.drawDisk(back, x, y, radius);

    for (const arc of this.halo) {
      arc.angle += 0.012;
      if (arc.angle > TAU) arc.angle -= TAU;
      const above = Math.sin(arc.angle - arc.length * 0.5) < 0;
      const alpha = (arc.alpha * (above ? 1 : 0.45)).toFixed(3);
      ctx.strokeStyle = `rgba(255,214,170,${alpha})`;
      ctx.lineWidth = arc.width;
      ctx.beginPath();
      ctx.ellipse(
        x,
        y,
        arc.radius,
        arc.radius * 0.96,
        0,
        arc.angle - arc.length,
        arc.angle,
      );
      ctx.stroke();
    }

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = `rgb(${STAGE})`;
    ctx.beginPath();
    ctx.arc(x, y, radius * 1.06, 0, TAU);
    ctx.fill();

    ctx.globalCompositeOperation = "lighter";
    ctx.shadowColor = "rgba(255,190,120,0.9)";
    ctx.shadowBlur = 16;
    ctx.strokeStyle = "rgba(255,236,214,0.5)";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(x, y, radius * 1.07, 0, TAU);
    ctx.stroke();
    ctx.shadowBlur = 0;

    this.drawDisk(front, x, y, radius);
  }

  private sendMessage(): void {
    const count = 2 + Math.floor(Math.random() * 4);
    const lane = Math.floor(Math.random() * SIGNAL_LANES.length);
    const speed = 0.0075 + Math.random() * 0.0025;
    for (let i = 0; i < count; i += 1) {
      this.pulses.push({
        t: -i * (0.05 + Math.random() * 0.05),
        speed,
        lane: Math.random() < 0.7 ? lane : (lane + 1) % SIGNAL_LANES.length,
        outbound: this.speaker,
      });
    }
    this.speaker = !this.speaker;
    this.pause = 50 + Math.random() * 70;
  }

  private drawNode(x: number, y: number, mine: boolean): void {
    const { ctx } = this;
    const glow = ctx.createRadialGradient(x, y, 0, x, y, 46);
    const tone = mine ? this.options.grade : "238,240,242";
    glow.addColorStop(0, `rgba(${tone},0.16)`);
    glow.addColorStop(1, `rgba(${tone},0)`);
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, 46, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = `rgba(${tone},0.28)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, 11, 0, TAU);
    ctx.stroke();
    ctx.fillStyle = mine ? "rgba(255,246,232,0.95)" : "rgba(238,240,242,0.9)";
    ctx.beginPath();
    ctx.arc(x, y, mine ? 4 : 3.5, 0, TAU);
    ctx.fill();
  }

  private stepSignal(): void {
    const { ctx, width, height, time } = this;
    const narrow = width < 640;
    const midX = width * (this.options.focusX ?? 0.6);
    const midY = height * (this.options.focusY ?? 0.42);
    const span = Math.min(width * (narrow ? 0.58 : 0.3), 480);
    const homeX = midX - span / 2;
    const homeY = midY + span * 0.1;
    const pullX = this.pointer
      ? (this.pointer.x - homeX) * 0.35
      : Math.sin(time * 0.35) * 10;
    const pullY = this.pointer
      ? (this.pointer.y - homeY) * 0.35
      : Math.cos(time * 0.45) * 8;
    this.driftX += (pullX - this.driftX) * 0.05;
    this.driftY += (pullY - this.driftY) * 0.05;
    const youX = homeX + this.driftX;
    const youY = homeY + this.driftY;
    const meX = midX + span / 2 + Math.sin(time * 0.4) * 4;
    const meY = midY - span * 0.1 + Math.cos(time * 0.5) * 4;
    const crestX = (meX + youX) / 2;
    const crestY = Math.min(meY, youY);
    const along = (lane: number, outbound: boolean, t: number) => {
      const controlY = crestY - SIGNAL_LANES[lane] * span;
      const fromX = outbound ? meX : youX;
      const fromY = outbound ? meY : youY;
      const toX = outbound ? youX : meX;
      const toY = outbound ? youY : meY;
      const rest = 1 - t;
      return [
        rest * rest * fromX + 2 * rest * t * crestX + t * t * toX,
        rest * rest * fromY + 2 * rest * t * controlY + t * t * toY,
      ];
    };

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = `rgb(${STAGE})`;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";
    this.drawStars(0.3);

    ctx.lineWidth = 1;
    SIGNAL_LANES.forEach((lift, lane) => {
      ctx.strokeStyle = `rgba(${this.options.grade},${(0.16 - lane * 0.03).toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(meX, meY);
      ctx.quadraticCurveTo(crestX, crestY - lift * span, youX, youY);
      ctx.stroke();
    });

    if (this.pulses.length === 0) {
      this.pause -= 1;
      if (this.pause <= 0) this.sendMessage();
    }
    const flying: Pulse[] = [];
    for (const pulse of this.pulses) {
      pulse.t += pulse.speed;
      if (pulse.t >= 1) {
        this.echoes.push({ mine: !pulse.outbound, age: 0 });
        continue;
      }
      flying.push(pulse);
      if (pulse.t <= 0) continue;
      const tail = Math.max(0, pulse.t - SIGNAL_TAIL);
      const steps = 10;
      ctx.lineWidth = 1.6;
      let [lastX, lastY] = along(pulse.lane, pulse.outbound, tail);
      for (let k = 1; k <= steps; k += 1) {
        const [x, y] = along(
          pulse.lane,
          pulse.outbound,
          tail + ((pulse.t - tail) * k) / steps,
        );
        ctx.strokeStyle = `rgba(${this.options.grade},${((0.75 * k) / steps).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        lastX = x;
        lastY = y;
      }
      ctx.fillStyle = "rgba(255,246,232,0.95)";
      ctx.beginPath();
      ctx.arc(lastX, lastY, 2, 0, TAU);
      ctx.fill();
    }
    this.pulses = flying;

    this.echoes = this.echoes.filter((echo) => {
      echo.age += 1;
      if (echo.age > ECHO_LIFE) return false;
      const fade = 1 - echo.age / ECHO_LIFE;
      ctx.strokeStyle = `rgba(${this.options.grade},${(0.5 * fade * fade).toFixed(3)})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(
        echo.mine ? meX : youX,
        echo.mine ? meY : youY,
        11 + echo.age * 0.7,
        0,
        TAU,
      );
      ctx.stroke();
      return true;
    });

    this.drawNode(youX, youY, false);
    this.drawNode(meX, meY, true);
  }
}
