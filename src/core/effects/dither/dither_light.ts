/**
 * A single dither-fog light source: a position (fixed or following a target)
 * with two radii and a dither pattern. Lights only ever **remove** fog —
 * `coverageAt` returns the remaining fog opacity at a point, from
 * `1 - strength` (fully cleared) inside `innerRadius`, easing back to `1`
 * (ambient fog) at `ditherRadius`.
 *
 * @category Effects
 * @since 0.5.0
 */

/** Named patterns registered in {@link DitherPatterns}. */
export type DitherPatternName = 'bayer2' | 'bayer4' | 'bayer8' | 'dots4' | 'dots8' | 'noise8';

export interface DitherLightOptions {
  /** Initial X position (world/fog-space pixels). */
  x?: number;
  /** Initial Y position (world/fog-space pixels). */
  y?: number;

  /**
   * Distance within which fog is fully cleared (to `1 - strength`).
   * @defaultValue 40
   */
  innerRadius?: number;

  /**
   * Distance beyond which this light no longer affects fog (fully back to
   * ambient). Must be `>= innerRadius`.
   * @defaultValue 140
   */
  ditherRadius?: number;

  /**
   * Easing exponent applied before the smoothstep: `> 1` pushes the gradient
   * outward, `< 1` pulls it inward.
   * @defaultValue 1
   */
  softness?: number;

  /**
   * Threshold pattern: a registered name or a custom square 2-D matrix of
   * `0..1` thresholds. The **closest** (dominant) light's pattern decides
   * which cells dissolve.
   * @defaultValue 'bayer4'
   */
  pattern?: DitherPatternName | number[][];

  /**
   * `0..1`, how much this light can clear the fog (`1` fully clears to
   * see-through at `innerRadius`).
   * @defaultValue 1
   */
  strength?: number;

  /**
   * Optional CSS colour tinting the revealed area (drawn as a soft additive
   * glow beneath the fog).
   * @defaultValue null
   */
  color?: string | null;

  /** `0..1` opacity of the additive glow. */
  glowAlpha?: number;

  /** Whether the light currently affects the fog. */
  enabled?: boolean;

  /**
   * An object with live `.x`/`.y` (a map object, the player entity, …) this
   * light tracks every frame.
   */
  followTarget?: { x: number; y: number } | null;

  /** X offset from the follow target (e.g. half a sprite, to centre on it). */
  offsetX?: number;
  /** Y offset from the follow target. */
  offsetY?: number;

  /**
   * `0..1`, how much the light's radius wobbles over time — a candle/fiery
   * unsteadiness. `0` = steady.
   * @defaultValue 0
   */
  flickerAmount?: number;

  /**
   * Wobbles per second of the flicker.
   * @defaultValue 2
   */
  flickerSpeed?: number;
}

/** Two-pi, named for readability in the flicker phase math. */
const TAU = Math.PI * 2;

export class DitherLight {
  x: number;
  y: number;

  /** Distance within which fog is fully cleared (to `1 - strength`). */
  innerRadius: number;
  /** Distance beyond which this light no longer affects fog. */
  ditherRadius: number;

  /** Easing exponent applied before the smoothstep. */
  softness: number;

  /** Threshold pattern name or custom square 2-D matrix. */
  pattern: DitherPatternName | number[][];

  /** `0..1`, how much this light can clear the fog. */
  strength: number;

  /** CSS colour for the additive glow, or `null` for none. */
  color: string | null;
  /** `0..1` opacity of the additive glow. */
  glowAlpha: number;

  /** Whether the light currently affects the fog. */
  enabled: boolean;

  /** Live `.x`/`.y` source tracked every frame, or `null` for a fixed light. */
  followTarget: { x: number; y: number } | null;

  /** X offset from the follow target. */
  offsetX: number;
  /** Y offset from the follow target. */
  offsetY: number;

  /** `0..1` radius wobble amount (`0` = steady). */
  flickerAmount: number;
  /** Wobbles per second of the flicker. */
  flickerSpeed: number;

  /** Flicker multiplier of the radii — `1` steady, dipping while flickering. */
  private radiusScale = 1;
  /** Accumulated seconds driving the flicker wobble. */
  private flickerTime = 0;
  /** Random per-light phase so several flames never wobble in lockstep. */
  private readonly flickerPhase = Math.random() * TAU;

  constructor(options: DitherLightOptions = {}) {
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
    this.flickerAmount = options.flickerAmount ?? 0;
    this.flickerSpeed = options.flickerSpeed ?? 2;
  }

  /** The flicker-scaled `innerRadius` actually in effect this frame. */
  get effInnerRadius(): number {
    return this.innerRadius * this.radiusScale;
  }

  /** The flicker-scaled `ditherRadius` actually in effect this frame. */
  get effDitherRadius(): number {
    return this.ditherRadius * this.radiusScale;
  }

  /** Moves to the follow target (plus offsets) when one is set. */
  updatePosition(): void {
    if (this.followTarget) {
      this.x = this.followTarget.x + this.offsetX;
      this.y = this.followTarget.y + this.offsetY;
    }
  }

  /**
   * Advances the flicker wobble. Call once per frame (the owning
   * {@link DitherFog} does this for every light).
   */
  update(deltaTime: number): void {
    if (this.flickerAmount <= 0) {
      this.radiusScale = 1;
      return;
    }
    this.flickerTime += deltaTime;
    const t = this.flickerTime * this.flickerSpeed;
    const wobble =
      0.65 * Math.sin(t * TAU + this.flickerPhase) +
      0.35 * Math.sin(t * 2.71 * TAU + this.flickerPhase * 1.7);
    // Two detuned sines in -1..1 → a scale that always stays within
    // [1 - amount, 1] and rarely sits still.
    this.radiusScale = 1 - this.flickerAmount * (0.5 + 0.45 * wobble);
  }

  /**
   * Remaining fog opacity (`0..1`) this light leaves at a point:
   * `1 - strength` inside `innerRadius`, easing (softness + smoothstep) back
   * to `1` at `ditherRadius`. Honours the flicker-scaled radii. Disabled
   * lights leave the fog untouched (`1`).
   */
  coverageAt(px: number, py: number): number {
    if (!this.enabled) {
      return 1;
    }

    const dx = px - this.x;
    const dy = py - this.y;
    return this.coverageAtDistance(Math.sqrt(dx * dx + dy * dy));
  }

  /** {@link coverageAt} for a precomputed distance from the light centre. */
  coverageAtDistance(d: number): number {
    if (!this.enabled) {
      return 1;
    }
    return DitherLight.coverageFrom(
      d,
      this.effInnerRadius,
      this.effDitherRadius,
      this.strength,
      this.softness,
    );
  }

  /**
   * The reveal curve for arbitrary radii — `1 - strength` inside `inner`,
   * eased (softness + smoothstep) back to `1` (ambient) at `outer`. Shared
   * by the per-cell pipeline and the per-light distance LUT.
   */
  static coverageFrom(
    d: number,
    inner: number,
    outer: number,
    strength: number,
    softness: number,
  ): number {
    const floor = 1 - strength;
    if (d <= inner) {
      return floor;
    }
    if (d >= outer || outer <= inner) {
      return 1;
    }
    let t = (d - inner) / (outer - inner);
    t = t ** softness;
    t = t * t * (3 - 2 * t);
    return floor + t * strength;
  }
}
