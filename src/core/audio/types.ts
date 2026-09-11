/**
 * Runtime audio schema + option types consumed by {@link AudioSystem} and
 * {@link AudioLibrary}.
 *
 * The *Definition* interfaces mirror the JSON emitted by the gamefoo audio
 * editor (`*.audio.project.json`). Everything is cross-referenced by **id**
 * (`sfx_…`, `amb_…`, `seq_…`): sequences refer to sound ids, and game code
 * only ever deals with ids — file paths, volumes, looping and distance
 * falloff all live in the JSON document.
 *
 * Only Web APIs are used to reproduce the files: `fetch` streams the bytes
 * and `AudioContext.decodeAudioData` turns them into playable buffers
 * (mp3, wav, ogg — whatever the host browser decodes).
 *
 * @category Audio
 * @since 0.5.0
 */

import type { Vector2 } from '../../generic_types';

/**
 * Linear distance falloff range for a spatialised sound.
 *
 * A sound plays at full volume while the listener is within `min` pixels,
 * then falls off linearly to silence at `max` pixels.
 *
 * @category Audio
 * @since 0.5.0
 *
 * @example
 * ```json
 * { "min": 32, "max": 220 }
 * ```
 */
export interface DistanceConfig {
  /**
   * Distance in pixels within which the sound plays at full volume.
   */
  min: number;
  /**
   * Distance in pixels at (and beyond) which the sound is silent.
   */
  max: number;
}

/**
 * One sound file entry in an {@link AudioProject}.
 *
 * @category Audio
 * @since 0.5.0
 *
 * @example One-shot effect with distance falloff
 * ```json
 * {
 *   "id": "sfx_scream",
 *   "name": "Enemy scream",
 *   "file": "sfx/scream.mp3",
 *   "volume": 0.9,
 *   "distance": { "min": 0, "max": 480 }
 * }
 * ```
 *
 * @example Looping, preloaded ambient bed
 * ```json
 * {
 *   "id": "music_forest",
 *   "file": "music/forest.mp3",
 *   "volume": 0.7,
 *   "loop": true,
 *   "preload": true
 * }
 * ```
 */
export interface SoundDefinition {
  id: string;
  /**
   * Human-readable label (editor metadata only — game code uses `id`).
   */
  name?: string;
  /**
   * Path of the file, relative to the project's `baseUrl` (or absolute).
   */
  file: string;
  /**
   * Base loudness `0..1`.
   *
   * @defaultValue `1`
   */
  volume?: number;
  /**
   * Whether `playSound` keeps the sound playing until it is stopped.
   *
   * @defaultValue `false`
   */
  loop?: boolean;
  /**
   * Decode eagerly during {@link AudioSystem.load} instead of lazily on
   * first play.
   *
   * @defaultValue `false`
   */
  preload?: boolean;
  /**
   * Distance falloff applied when a play passes `at`/`follow` positions.
   * Absent (or `max <= 0`) — the sound plays at full volume everywhere.
   */
  distance?: DistanceConfig;
}

/**
 * An ordered cycle of sound ids, e.g. five footsteps played one per step.
 *
 * @category Audio
 * @since 0.5.0
 *
 * @example
 * ```json
 * {
 *   "id": "seq_footsteps",
 *   "name": "Footsteps",
 *   "steps": ["sfx_step_1", "sfx_step_2", "sfx_step_3", "sfx_step_4", "sfx_step_5"],
 *   "loop": true
 * }
 * ```
 */
export interface SoundSequenceDefinition {
  id: string;
  /**
   * Human-readable label (editor metadata only).
   */
  name?: string;
  /**
   * Ordered sound ids handed out one per `playSequenceStep` call. Any
   * length — five steps or five hundred.
   */
  steps: string[];
  /**
   * Whether the cursor wraps back to the first step after the last one.
   * When `false`, the sequence stays exhausted until `resetSequence`.
   *
   * @defaultValue `true`
   */
  loop?: boolean;
}

/**
 * Root of an audio project JSON document.
 *
 * @category Audio
 * @since 0.5.0
 *
 * @example
 * ```json
 * {
 *   "baseUrl": "audio/",
 *   "sounds": [
 *     { "id": "sfx_step_1", "file": "sfx/step_1.mp3", "volume": 0.8 },
 *     { "id": "sfx_scream", "file": "sfx/scream.mp3", "distance": { "min": 0, "max": 480 } },
 *     { "id": "amb_torch", "file": "sfx/torch.wav", "loop": true, "distance": { "min": 32, "max": 220 } },
 *     { "id": "music_forest", "file": "music/forest.mp3", "volume": 0.7, "loop": true, "preload": true }
 *   ],
 *   "sequences": [
 *     {
 *       "id": "seq_footsteps",
 *       "steps": ["sfx_step_1", "sfx_step_2", "sfx_step_3", "sfx_step_4", "sfx_step_5"],
 *       "loop": true
 *     }
 *   ]
 * }
 * ```
 */
export interface AudioProject {
  /**
   * Prefixed to every sound's `file` path (include the trailing slash).
   *
   * @defaultValue `""`
   */
  baseUrl?: string;
  sounds: SoundDefinition[];
  sequences?: SoundSequenceDefinition[];
}

/**
 * Anything that can locate a sound in the world:
 *
 * - a live object with `x`/`y` (every {@link Entity}), or
 * - a callback returning a fresh {@link Vector2}.
 *
 * @category Audio
 * @since 0.5.0
 *
 * @example
 * ```ts
 * audio.setListener(player);              // entity with x / y
 * audio.playSound("amb_torch", {
 *   follow: torch,                        // re-read every frame
 * });
 * ```
 */
export type PositionTarget = Vector2 | (() => Vector2);

/**
 * Maps a {@link SoundDefinition} to the URL to fetch, like the map
 * system's `ImageResolver`. Defaults to `baseUrl + file`.
 *
 * @since 0.5.0
 */
export type SoundResolver = (definition: SoundDefinition) => string;

/**
 * Turns a URL into a decoded, playable `AudioBuffer`.
 *
 * The default implementation uses the Web APIs `fetch` +
 * `AudioContext.decodeAudioData`; tests inject fakes.
 *
 * @since 0.5.0
 */
export type AudioDecoder = (url: string) => Promise<AudioBuffer>;

/**
 * Structural slice of the Web Audio `AudioContext` that {@link AudioSystem}
 * needs. The real browser class satisfies it; tests inject fakes.
 *
 * @since 0.5.0
 */
export interface AudioContextLike {
  readonly destination: AudioNode;
  readonly state: string;
  resume(): Promise<void>;
  close(): Promise<void>;
  createGain(): GainNode;
  createBufferSource(): AudioBufferSourceNode;
  decodeAudioData(audioData: ArrayBuffer): Promise<AudioBuffer>;
}

/**
 * Options for {@link AudioSystem.load} / {@link AudioSystem.fromUrl}.
 *
 * @category Audio
 * @since 0.5.0
 */
export interface AudioLoadOptions {
  /**
   * Maps each `SoundDefinition` to the URL to fetch. Defaults to
   * `baseUrl + file`. Use it to redirect editor paths to where the game
   * actually serves its audio.
   */
  resolve?: SoundResolver;
  /**
   * Custom decoder (tests / offline tooling). Defaults to the Web APIs
   * `fetch` + `decodeAudioData` pipeline.
   */
  decoder?: AudioDecoder;
  /**
   * Force-decode **every** sound during load, overriding per-sound lazy
   * loading (`preload` flags still apply on top).
   *
   * @defaultValue `false`
   */
  preload?: boolean;
}

/**
 * Options for the {@link AudioSystem} constructor.
 *
 * @category Audio
 * @since 0.5.0
 */
export interface AudioSystemOptions {
  /**
   * Injected Web Audio context. When omitted, one is created lazily on
   * first use and closed again by `destroy()`. Injected contexts are
   * never closed — the caller owns their lifecycle.
   */
  context?: AudioContextLike;
  /**
   * Upper bound on simultaneous voices (playing + still decoding).
   *
   * @defaultValue `32`
   */
  maxVoices?: number;
}

/**
 * Options for {@link AudioSystem.playSound}.
 *
 * @category Audio
 * @since 0.5.0
 *
 * @example Spatialised scream
 * ```ts
 * audio.setListener(player);
 * audio.playSound("sfx_scream", { at: enemy, volume: 0.9 });
 * ```
 */
export interface PlaySoundOptions {
  /**
   * Extra `0..1` multiplier on top of the definition's `volume`.
   *
   * @defaultValue `1`
   */
  volume?: number;
  /**
   * Playback rate — `0.5` half speed, `2` double speed. A cheap way to
   * make repeated one-shots sound less identical.
   *
   * @defaultValue `1`
   */
  rate?: number;
  /**
   * Static position — distance to the listener is sampled **once**, at
   * play time. Right for short one-shots (footsteps, hits, screams).
   */
  at?: PositionTarget;
  /**
   * Live position — distance to the listener is re-sampled **every
   * frame**. Right for looping emitters (torches, machines, idle
   * noises) that should swell as the player approaches.
   */
  follow?: PositionTarget;
}

/**
 * Options for {@link AudioSystem.playSequenceStep}.
 *
 * @category Audio
 * @since 0.5.0
 */
export interface SequenceStepOptions extends PlaySoundOptions {
  /**
   * Key for this cursor's playback position. Different trackers advance
   * the same sequence independently — one per enemy, for example.
   * Defaults to the sequence id (one shared cursor).
   */
  tracker?: string;
}

/**
 * Options for {@link AudioSystem.playAmbient}.
 *
 * @category Audio
 * @since 0.5.0
 *
 * @example Smooth room transition
 * ```ts
 * // leaving the forest, entering the cave:
 * audio.playAmbient("music_cave", { fadeIn: 1.5, fadeOut: 1.5 });
 * ```
 */
export interface AmbientPlayOptions {
  /**
   * Ambient channel volume `0..1`.
   *
   * @defaultValue `1`
   */
  volume?: number;
  /**
   * Seconds the new ambient takes to swell in from silence — the
   * "slowly start when entering a room" knob.
   *
   * @defaultValue `0` (starts immediately)
   */
  fadeIn?: number;
  /**
   * Seconds the **replaced** ambient takes to die away. Defaults to
   * `fadeIn` so room changes crossfade by default.
   *
   * @defaultValue the `fadeIn` value
   */
  fadeOut?: number;
}

/**
 * Options for stop calls ({@link SoundHandle.stop},
 * {@link AudioSystem.stopAmbient}).
 *
 * @category Audio
 * @since 0.5.0
 */
export interface FadeStopOptions {
  /**
   * Seconds the sound takes to reach silence before stopping.
   *
   * @defaultValue `0` (stops immediately)
   */
  fadeOut?: number;
}
