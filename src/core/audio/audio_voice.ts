/**
 * One live Web Audio playback instance: a `BufferSourceNode` feeding a
 * `GainNode` feeding the master gain.
 *
 * A voice owns everything that makes a single playback distinct — its
 * volume product, an optional distance range, an optional live position to
 * follow, and an optional linear fade. {@link AudioSystem} drives voices
 * from its `update` hook; this class never touches the frame loop itself.
 *
 * The gain each frame is the product:
 *
 * ```text
 * definition.volume × play volume × handle volume × distance factor
 * ```
 *
 * @category Audio
 * @internal
 * @since 0.5.0
 */

import type { Vector2 } from '../../generic_types';
import { distanceFactor, resolvePosition } from './spatial';
import type { AudioContextLike, DistanceConfig, PositionTarget } from './types';

/**
 * Linear fade state — interpolates from `from` toward the voice's *current*
 * computed target so a fade stays correct even when the target moves
 * mid-fade (player walking while music fades in).
 *
 * @internal
 * @since 0.5.0
 */
interface FadeState {
  from: number;
  elapsed: number;
  duration: number;
}

/**
 * Everything {@link AudioVoice} needs to spawn.
 *
 * @internal
 * @since 0.5.0
 */
export interface VoiceSpawnOptions {
  soundId: string;
  buffer: AudioBuffer;
  loop: boolean;
  /**
   * Fixed part of the volume product: definition volume × play volume ×
   * (for static positions) the once-off distance factor.
   */
  baseVolume: number;
  rate: number;
  /**
   * Gain applied the instant the source starts — `0` when the caller
   * fades in from silence.
   */
  initialGain: number;
  /**
   * Distance falloff, only when a `follow` target was given.
   */
  distance?: DistanceConfig;
  /**
   * Live position re-read every frame.
   */
  follow?: PositionTarget;
  /**
   * Fired once when the voice ends — natural end, stop, or fade-out —
   * routed through {@link SoundHandle} so callers can react to completion.
   */
  onEnded?: () => void;
}

/**
 * @internal
 * @since 0.5.0
 */
export class AudioVoice {
  private readonly source: AudioBufferSourceNode;
  private readonly gainNode: GainNode;
  private readonly baseVolume: number;
  /**
   * Per-instance multiplier, driven through {@link SoundHandle.setVolume}
   * and the ambient channel volume.
   */
  private instanceVolume: number = 1;
  private readonly distance: DistanceConfig | undefined;
  private readonly follow: PositionTarget | undefined;
  private fade: FadeState | null = null;
  /**
   * Set when the voice is dying — forces the fade target to silence and
   * stops the source once it gets there.
   */
  private stopping: boolean = false;
  private finished: boolean = false;
  /**
   * Sound id this voice plays (debug / handle bookkeeping).
   */
  readonly soundId: string;
  private readonly onEnded: (() => void) | undefined;

  /**
   * Wires the Web Audio graph (`source → gain → destination`), applies the
   * initial gain, and starts the source immediately.
   */
  constructor(context: AudioContextLike, destination: AudioNode, spawn: VoiceSpawnOptions) {
    this.soundId = spawn.soundId;
    this.baseVolume = spawn.baseVolume;
    this.distance = spawn.distance;
    this.follow = spawn.follow;
    this.onEnded = spawn.onEnded;
    this.source = context.createBufferSource();
    this.gainNode = context.createGain();
    this.source.buffer = spawn.buffer;
    this.source.loop = spawn.loop;
    this.source.playbackRate.value = spawn.rate;
    this.source.onended = (): void => {
      this.dispose();
    };
    this.gainNode.gain.value = spawn.initialGain;
    this.source.connect(this.gainNode);
    this.gainNode.connect(destination);
    this.source.start();
  }

  /**
   * `false` once the voice has ended — naturally, stopped, or faded out.
   */
  get active(): boolean {
    return !this.finished;
  }

  /**
   * Adjusts this voice's per-instance volume, optionally as a linear fade.
   * The new level lands on the next `update` tick (immediately when no
   * fade is requested and none is running).
   */
  setVolume(volume: number, fadeSeconds: number): void {
    if (this.stopping || this.finished) {
      return;
    }
    this.instanceVolume = Math.min(1, Math.max(0, volume));
    if (fadeSeconds > 0) {
      this.fade = { from: this.gainNode.gain.value, elapsed: 0, duration: fadeSeconds };
      return;
    }
    this.fade = null;
  }

  /**
   * Stops the voice — immediately, or after fading to silence over
   * `fadeOut` seconds (the fade completes inside `update`).
   */
  stop(fadeOut: number): void {
    if (this.finished) {
      return;
    }
    if (fadeOut > 0) {
      this.stopping = true;
      this.fade = { from: this.gainNode.gain.value, elapsed: 0, duration: fadeOut };
      return;
    }
    this.halt();
  }

  /**
   * Advances fades and live distance attenuation by one frame.
   *
   * @returns Whether the voice is still alive (sweep it when not).
   */
  update(deltaTime: number, listener: Vector2 | null): boolean {
    if (this.finished) {
      return false;
    }
    const target = this.computeTargetGain(listener);
    if (this.fade === null) {
      // No fade — write the fresh target (distance / volume changes).
      this.gainNode.gain.value = target;
      return true;
    }
    this.fade.elapsed += deltaTime;
    if (this.fade.elapsed >= this.fade.duration) {
      this.fade = null;
      this.gainNode.gain.value = target;
      if (this.stopping) {
        this.halt();
        return false;
      }
      return true;
    }
    const progress = this.fade.elapsed / this.fade.duration;
    this.gainNode.gain.value = this.fade.from + (target - this.fade.from) * progress;
    return true;
  }

  /**
   * The gain this voice should sit at right now.
   */
  private computeTargetGain(listener: Vector2 | null): number {
    if (this.stopping) {
      return 0;
    }
    let factor = 1;
    if (this.distance !== undefined && this.follow !== undefined && listener !== null) {
      // A far-away follower sits at gain 0 but keeps playing, so it swells
      // back when the listener approaches again.
      factor = distanceFactor(listener, resolvePosition(this.follow), this.distance);
    }
    return this.baseVolume * this.instanceVolume * factor;
  }

  /**
   * Stops the source node and tears down the graph.
   */
  private halt(): void {
    if (this.finished) {
      return;
    }
    this.source.stop();
    this.dispose();
  }

  /**
   * Marks the voice finished and disconnects its nodes. Idempotent — the
   * `onended` handler and manual `stop` can both reach it.
   */
  private dispose(): void {
    if (this.finished) {
      return;
    }
    this.finished = true;
    this.source.onended = null;
    this.source.disconnect();
    this.gainNode.disconnect();
    this.onEnded?.();
  }
}
