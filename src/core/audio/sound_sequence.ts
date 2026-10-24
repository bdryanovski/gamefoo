/**
 * Cursor over a {@link SoundSequenceDefinition}'s steps.
 *
 * {@link AudioSystem} owns one cursor per (sequence, tracker) pair and asks
 * it for the next sound id every time gameplay triggers a step — footsteps,
 * reloading clicks, gossip lines. The cursor is the single source of truth
 * for "where we are and what comes next".
 *
 * @category Audio
 * @since 0.5.0
 *
 * @see {@link AudioSystem.playSequenceStep}
 * @see {@link AudioSystem.resetSequence}
 */

import type { SoundSequenceDefinition } from './types';

/**
 * @category Audio
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const steps = new SoundSequence({
 *   id: "seq_footsteps",
 *   steps: ["sfx_step_1", "sfx_step_2", "sfx_step_3"],
 *   loop: true,
 * });
 *
 * steps.next(); // "sfx_step_1"
 * steps.next(); // "sfx_step_2"
 * steps.reset();
 * steps.next(); // "sfx_step_1" again
 * ```
 */
export class SoundSequence {
  /**
   * Index of the step that the next `next()` call hands out.
   */
  private cursor: number = 0;

  /**
   * @param definition - Authored steps and loop behaviour.
   */
  constructor(readonly definition: SoundSequenceDefinition) {}

  /**
   * How many steps have been handed out since the last reset.
   */
  get index(): number {
    return this.cursor;
  }

  /**
   * Whether a non-looping sequence has run out of steps (looping
   * sequences are never done).
   */
  get done(): boolean {
    const loops = this.definition.loop ?? true;
    return !loops && this.cursor >= this.definition.steps.length;
  }

  /**
   * The sound id `next()` would return, without advancing the cursor.
   * `undefined` when the sequence is empty or exhausted.
   */
  peek(): string | undefined {
    const steps = this.definition.steps;
    if (steps.length === 0) {
      return undefined;
    }
    let cursor = this.cursor;
    if (cursor >= steps.length) {
      if (!(this.definition.loop ?? true)) {
        return undefined;
      }
      cursor = 0;
    }
    return steps[cursor];
  }

  /**
   * Hands out the current step's sound id and advances the cursor.
   *
   * Looping sequences wrap back to the first step after the last one;
   * non-looping sequences return `undefined` once exhausted (until
   * {@link SoundSequence.reset}).
   */
  next(): string | undefined {
    const steps = this.definition.steps;
    if (steps.length === 0) {
      return undefined;
    }
    if (this.cursor >= steps.length) {
      if (!(this.definition.loop ?? true)) {
        return undefined;
      }
      this.cursor = 0;
    }
    const step = steps[this.cursor];
    this.cursor += 1;
    return step;
  }

  /**
   * Rewinds the cursor to the first step.
   */
  reset(): void {
    this.cursor = 0;
  }
}
