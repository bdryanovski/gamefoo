export interface DitherLightOptions {
  x: number;
  y: number;

  /** distance within which fog is fully cleared (0 = fog opacity floor set by `strength`) */
  innerRadius: number;

  /** distance beyond which this light no longer affects fog (fully back to ambient) */
  ditherRadius: number;

  /** easing exponent applied before the smoothstep, >1 pushes the gradient outward, <1 pulls it inward */
  softness: number;

  /** pattern name ('bayer2'|'bayer4'|'bayer8'|'dots4'|'dots8'|'noise8') or a custom 2D matrix array */
  pattern: 'bayer2' | 'bayer4' | 'bayer8' | 'dots4' | 'dots8' | 'noise8';

  /** 0..1, how much this light can clear the fog (1 = fully clears to see-through at innerRadius) */
  strength: number;

  /** optional CSS color to tint the revealed area (drawn as a soft additive glow beneath the fog) */
  color: string | null;

  glowAlpha: number;

  enabled: boolean;

  /** an object with live .x/.y (e.g. the player entity) this light should track every frame */
  followTarget: { x: number; y: number } | null;

  offsetX: number;
  offsetY: number;
}

export class DitherLight {
  x: number;
  y: number;

  /** distance within which fog is fully cleared (0 = fog opacity floor set by `strength`) */
  innerRadius: number;

  /** distance beyond which this light no longer affects fog (fully back to ambient) */
  ditherRadius: number;

  /** easing exponent applied before the smoothstep, >1 pushes the gradient outward, <1 pulls it inward */
  softness: number;

  /** pattern name ('bayer2'|'bayer4'|'bayer8'|'dots4'|'dots8'|'noise8') or a custom 2D matrix array */
  pattern: 'bayer2' | 'bayer4' | 'bayer8' | 'dots4' | 'dots8' | 'noise8';

  /** 0..1, how much this light can clear the fog (1 = fully clears to see-through at innerRadius) */
  strength: number;

  color: string | null;

  glowAlpha: number;

  enabled: boolean;

  /** an object with live .x/.y (e.g. the player entity) this light should track every frame */
  followTarget: { x: number; y: number } | null;

  /**
   * Offset from X
   * @default 0
   */
  offsetX: number;
  /**
   * Offset from Y
   * @default 0
   */
  offsetY: number;

  constructor(options: DitherLightOptions) {
    this.x = options.x ?? 0;
    this.y = options.y ?? 0;
    this.innerRadius = options.innerRadius ?? 40;
    this.ditherRadius = options.ditherRadius ?? 140;
    this.softness = options.softness ?? 1;
    this.pattern = options.pattern ?? 'bayer4';
    this.strength = options.strength ?? 1;
    this.color = options.color ?? null;
    this.glowAlpha = options.glowAlpha ?? 0.25;
    this.enabled = options.enabled ?? true;
    this.followTarget = options.followTarget ?? null;
    this.offsetX = options.offsetX ?? 0;
    this.offsetY = options.offsetY ?? 0;
  }

  updatePosition(): void {
    if (this.followTarget) {
      this.x = this.followTarget.x + this.offsetX;
      this.y = this.followTarget.y + this.offsetY;
    }
  }

  coverageAt(px: number, py: number): number {
    if (!this.enabled) {
      return 1;
    }

    const d = Math.hypot(px - this.x, py - this.y);
    const floor = 1 - this.strength;
    if (d <= this.innerRadius) {
      return floor;
    }

    if (d >= this.ditherRadius) {
      return 1;
    }
    let t = (d - this.innerRadius) / (this.ditherRadius - this.innerRadius);
    t = Math.pow(t, this.softness);
    t = t * t * (3 - 2 * t);
    return floor + t * this.strength;
  }
}
