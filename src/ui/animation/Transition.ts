/**
 * Basic transition/animation support for UI widgets.
 *
 * @category UI
 * @module ui/animation/Transition
 * @since 0.5.0
 */

import type UIWidget from '../core/UIWidget';

/**
 * Easing function type.
 *
 * @since 0.5.0
 */
export type EasingFunction = (t: number) => number;

/**
 * Built-in easing functions.
 *
 * @since 0.5.0
 */
export const Easing = {
  /** Linear interpolation */
  linear: (t: number) => t,

  /** Ease in (quadratic) */
  easeIn: (t: number) => t * t,

  /** Ease out (quadratic) */
  easeOut: (t: number) => t * (2 - t),

  /** Ease in-out (quadratic) */
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

  /** Ease out cubic */
  easeOutCubic: (t: number) => 1 - (1 - t) ** 3,

  /** Ease in cubic */
  easeInCubic: (t: number) => t * t * t,
} as const;

/**
 * Transition state.
 *
 * @since 0.5.0
 */
export type TransitionState = 'idle' | 'running' | 'completed';

/**
 * Transition configuration.
 *
 * @since 0.5.0
 */
export interface TransitionConfig {
  /** Duration in seconds */
  duration: number;
  /** Easing function */
  easing?: EasingFunction;
  /** Delay before starting in seconds */
  delay?: number;
  /** Callback when complete */
  onComplete?: () => void;
}

/**
 * Property transition for animating widget properties.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // Fade in a widget
 * const fadeIn = new Transition({
 *   duration: 0.3,
 *   easing: Easing.easeOut,
 * });
 *
 * fadeIn.animate(widget, 'opacity', 0, 1);
 * ```
 */
export default class Transition {
  /** Configuration */
  private _config: Required<TransitionConfig>;

  /** Current state */
  private _state: TransitionState = 'idle';

  /** Elapsed time */
  private _elapsed: number = 0;

  /** Target widget */
  private _target: UIWidget | null = null;

  /** Property being animated */
  private _property: string = '';

  /** Start value */
  private _startValue: number = 0;

  /** End value */
  private _endValue: number = 0;

  /**
   * Creates a new Transition.
   *
   * @param config - Transition configuration
   *
   * @since 0.5.0
   */
  constructor(config: TransitionConfig) {
    this._config = {
      duration: config.duration,
      easing: config.easing ?? Easing.linear,
      delay: config.delay ?? 0,
      onComplete: config.onComplete ?? (() => {}),
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Properties
  // ═══════════════════════════════════════════════════════════════════════════

  /** Current state */
  get state(): TransitionState {
    return this._state;
  }

  /** Progress (0 to 1) */
  get progress(): number {
    if (this._state === 'idle') return 0;
    if (this._state === 'completed') return 1;

    const effectiveElapsed = Math.max(0, this._elapsed - this._config.delay);
    return Math.min(1, effectiveElapsed / this._config.duration);
  }

  /** Whether transition is active */
  get isRunning(): boolean {
    return this._state === 'running';
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Animation Control
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Starts animating a property.
   *
   * @param target - Target widget
   * @param property - Property name to animate
   * @param startValue - Starting value
   * @param endValue - Ending value
   *
   * @since 0.5.0
   */
  animate(
    target: UIWidget,
    property: string,
    startValue: number,
    endValue: number,
  ): this {
    this._target = target;
    this._property = property;
    this._startValue = startValue;
    this._endValue = endValue;
    this._elapsed = 0;
    this._state = 'running';

    // Apply start value immediately
    this.applyValue(startValue);

    return this;
  }

  /**
   * Updates the transition.
   *
   * @param deltaTime - Time since last frame in seconds
   *
   * @since 0.5.0
   */
  update(deltaTime: number): void {
    if (this._state !== 'running') return;

    this._elapsed += deltaTime;

    // Check delay
    if (this._elapsed < this._config.delay) return;

    const effectiveElapsed = this._elapsed - this._config.delay;
    const t = Math.min(1, effectiveElapsed / this._config.duration);
    const easedT = this._config.easing(t);

    // Interpolate value
    const value =
      this._startValue + (this._endValue - this._startValue) * easedT;
    this.applyValue(value);

    // Check completion
    if (t >= 1) {
      this._state = 'completed';
      this._config.onComplete();
    }
  }

  /**
   * Applies the current value to the target.
   *
   * @internal
   */
  private applyValue(value: number): void {
    if (!this._target) return;

    // Use type assertion to set property
    (this._target as any)[this._property] = value;
  }

  /**
   * Stops the transition.
   *
   * @param complete - Whether to jump to end value
   *
   * @since 0.5.0
   */
  stop(complete: boolean = false): void {
    if (complete && this._target) {
      this.applyValue(this._endValue);
    }
    this._state = 'completed';
  }

  /**
   * Resets the transition to start from the beginning.
   *
   * @since 0.5.0
   */
  reset(): void {
    this._elapsed = 0;
    this._state = 'idle';
  }
}

/**
 * Creates a fade transition.
 *
 * @param duration - Duration in seconds
 * @param fadeIn - True for fade in, false for fade out
 * @returns Configured transition
 *
 * @since 0.5.0
 */
export function createFadeTransition(
  duration: number = 0.2,
  fadeIn: boolean = true,
): Transition {
  return new Transition({
    duration,
    easing: fadeIn ? Easing.easeOut : Easing.easeIn,
  });
}

/**
 * Creates a slide transition.
 *
 * @param duration - Duration in seconds
 * @returns Configured transition
 *
 * @since 0.5.0
 */
export function createSlideTransition(duration: number = 0.3): Transition {
  return new Transition({
    duration,
    easing: Easing.easeOutCubic,
  });
}
