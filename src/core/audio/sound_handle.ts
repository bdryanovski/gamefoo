/**
 * Caller-facing control over one playback started by
 * {@link AudioSystem.playSound} / {@link AudioSystem.playSequenceStep}.
 *
 * A handle exists the instant play is requested — even while the sound's
 * buffer is still being decoded (lazy loading). `stop` on a pending handle
 * cancels the spawn so nothing is ever heard.
 *
 * Handles are cheap throwaways: forgetting one is fine for one-shots; keep
 * it only when the sound loops and must be stopped later.
 *
 * @category Audio
 * @since 0.5.0
 *
 * @example Looping emitter under manual control
 * ```ts
 * const torch = audio.playSound("amb_torch", { follow: torchEntity });
 * // ... the torch is doused:
 * torch.stop({ fadeOut: 0.6 });
 * ```
 */

import type { AudioVoice } from './audio_voice';
import type { FadeStopOptions } from './types';

/**
 * @category Audio
 * @since 0.5.0
 */
export class SoundHandle {
  private voice: AudioVoice | null = null;
  private _cancelled: boolean = false;

  /**
   * @param soundId - The id that was requested (kept even if decoding
   *   fails, so callers can always report what they asked for).
   */
  constructor(readonly soundId: string) {}

  /**
   * Whether the handle was stopped/cancelled — the system checks this
   * when a lazy decode resolves.
   *
   * @internal
   */
  get cancelled(): boolean {
    return this._cancelled;
  }

  /**
   * Whether the sound is currently audible (or, for a pending lazy load,
   * about to become audible).
   */
  get playing(): boolean {
    return this.voice?.active ?? false;
  }

  /**
   * Stops the sound — immediately, or after fading to silence over
   * `fadeOut` seconds. Also cancels a still-decoding lazy load.
   */
  stop(options: FadeStopOptions = {}): void {
    this._cancelled = true;
    this.voice?.stop(options.fadeOut ?? 0);
  }

  /**
   * Adjusts this playback's volume, optionally as a linear fade.
   */
  setVolume(volume: number, fadeSeconds = 0): void {
    this.voice?.setVolume(volume, fadeSeconds);
  }

  /**
   * Binds the voice once its buffer is decoded and started.
   *
   * @internal
   */
  bind(voice: AudioVoice): void {
    this.voice = voice;
  }

  /**
   * Cancels a still-pending lazy spawn.
   *
   * @internal
   */
  cancel(): void {
    this._cancelled = true;
    this.voice = null;
  }
}
