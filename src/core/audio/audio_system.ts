/**
 * The engine's audio manager: a {@link SubSystem} that turns a JSON audio
 * project into playable game sound — built purely on Web APIs
 * (`AudioContext`, `fetch`, `decodeAudioData`).
 *
 * Register it like any subsystem:
 *
 * ```ts
 * const audio = await AudioSystem.fromUrl("audio.project.json");
 * engine.use(audio);
 * ```
 *
 * ---
 *
 * ### Ambient music (one persistent slot)
 *
 * {@link AudioSystem.playAmbient} starts a looping bed that plays until
 * stopped or replaced — entering a room, leaving it, whatever the game
 * says. Replacing crossfades by default, so room-to-room transitions are
 * smooth:
 *
 * ```ts
 * audio.playAmbient("music_forest", { fadeIn: 1.5 }); // entering the forest
 * audio.playAmbient("music_cave", { fadeIn: 1.5 });    // forest fades out as the cave fades in
 * audio.stopAmbient({ fadeOut: 2 });                   // boss cutscene: everything fades
 * ```
 *
 * ### One-shot effects
 *
 * {@link AudioSystem.playSound} fires a sound and forgets it — footsteps,
 * attacks, damage grunts, screams. Looping sounds return a
 * {@link SoundHandle} for later stopping.
 *
 * ### Distance-based volume
 *
 * Give a sound a `distance` range in the JSON and pass `at` (static
 * position, sampled once) or `follow` (live position, sampled every
 * frame). Far away is near-silent; right next to it is 100%. The listener
 * is usually the player:
 *
 * ```ts
 * audio.setListener(player);
 * audio.playSound("sfx_scream", { at: enemy });        // short one-shot
 * audio.playSound("amb_torch", { follow: torch });     // looping emitter
 * ```
 *
 * ### Sequences (footsteps & friends)
 *
 * {@link AudioSystem.playSequenceStep} hands out the next sound of a JSON
 * sequence every time it is called, tracking the cursor internally:
 *
 * ```ts
 * // on every completed step of movement:
 * audio.playSequenceStep("seq_footsteps");
 * ```
 *
 * Independent cursors per entity come free via `tracker`; rewind any time
 * with {@link AudioSystem.resetSequence}.
 *
 * ### Lazy loading
 *
 * Sounds decode on **first play** by default — nothing is fetched for
 * audio the game never hears. Flag `preload: true` in the JSON (or call
 * {@link AudioSystem.preload}) to decode eagerly at load time instead.
 *
 * @category Audio
 * @since 0.5.0
 *
 * @see {@link AudioProject} — the JSON schema
 * @see {@link SoundHandle} — per-playback control
 */

import type { SubSystem } from '../../subsystems/types';
import type { Vector2 } from '../../generic_types';
import { AudioLibrary } from './audio_library';
import { AudioVoice } from './audio_voice';
import type { VoiceSpawnOptions } from './audio_voice';
import { distanceFactor, resolvePosition } from './spatial';
import { SoundHandle } from './sound_handle';
import { SoundSequence } from './sound_sequence';
import type {
  AmbientPlayOptions,
  AudioContextLike,
  AudioDecoder,
  AudioLoadOptions,
  AudioProject,
  AudioSystemOptions,
  DistanceConfig,
  FadeStopOptions,
  PlaySoundOptions,
  PositionTarget,
  SequenceStepOptions,
  SoundDefinition,
  SoundResolver,
} from './types';

/**
 * Default cap on simultaneous voices (playing + still decoding). Keeps a
 * stampede of one-shots from exhausting the browser's audio threads.
 */
const DEFAULT_MAX_VOICES = 32;

/**
 * Internal: ambient spawn parameters — a forced-loop voice fading in.
 *
 * @internal
 * @since 0.5.0
 */
interface AmbientSpawn {
  fadeIn: number;
}

/**
 * @category Audio
 * @since 0.5.0
 */
export class AudioSystem implements SubSystem {
  readonly id = 'audio';
  /**
   * Fades and live distance gains tick early; audio has no render hooks.
   */
  readonly order = 60;
  enabled = true;

  /**
   * Sound/sequence catalog + lazy buffer cache for the loaded project.
   */
  private library: AudioLibrary;
  /**
   * Lazily built Web Audio graph: context + master gain. `null` until the
   * first sound needs it (or an injected context forces it at setup).
   */
  private graph: { context: AudioContextLike; masterGain: GainNode } | null = null;
  /**
   * Context supplied by the caller — never created or closed by us.
   */
  private readonly injectedContext: AudioContextLike | undefined;
  /**
   * Whether `destroy()` may close the context (only one we created).
   */
  private ownsContext: boolean = false;
  private readonly maxVoices: number;
  private destroyed: boolean = false;
  private masterVolumeValue: number = 1;
  private masterFade: { from: number; elapsed: number; duration: number } | null = null;
  /**
   * Live voices — a fixed, capped pool swept in place every update.
   */
  private voices: AudioVoice[] = [];
  /**
   * Handles whose lazy load is still in flight (counted against the cap).
   */
  private readonly pendingPlays = new Set<SoundHandle>();
  private ambientHandle: SoundHandle | null = null;
  private ambientVoice: AudioVoice | null = null;
  private ambientSoundId: string | null = null;
  private ambientVolumeValue: number = 1;
  /**
   * The ears of the game — usually the player entity.
   */
  private listenerTarget: PositionTarget | null = null;
  /**
   * Sequence cursors: sequence id → tracker key → cursor.
   */
  private readonly sequenceCursors = new Map<string, Map<string, SoundSequence>>();

  /**
   * @param options - Injected context and/or voice cap.
   *
   * @example
   * ```ts
   * const audio = new AudioSystem();
   * await audio.load(project);
   * engine.use(audio);
   * ```
   */
  constructor(options: AudioSystemOptions = {}) {
    this.maxVoices = options.maxVoices ?? DEFAULT_MAX_VOICES;
    this.injectedContext = options.context;
    this.library = new AudioLibrary((url) => this.decodeUrl(url));
    if (options.context !== undefined) {
      // Bind the graph eagerly so the injected context is wired from tick 0.
      this.ensureGraph();
    }
  }

  /**
   * Fetches an audio project JSON, builds the catalog, and preloads the
   * sounds flagged `preload`.
   *
   * @param url     - URL of the `*.audio.project.json` document.
   * @param options - Decoder / resolver overrides, `preload: true` to
   *   decode everything up front, plus the {@link AudioSystemOptions}.
   *
   * @throws {Error} When the document or any preloaded file fails to load.
   */
  static async fromUrl(
    url: string,
    options: AudioLoadOptions & AudioSystemOptions = {},
  ): Promise<AudioSystem> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load audio project: ${url} (${response.status})`);
    }
    const project = (await response.json()) as AudioProject;
    const system = new AudioSystem({ context: options.context, maxVoices: options.maxVoices });
    await system.load(project, options);
    return system;
  }

  /**
   * Builds the catalog from an already-parsed project document, then
   * decodes flagged sounds (all sounds when `options.preload` is `true`).
   *
   * Everything else stays lazy and decodes on first play.
   *
   * @throws {Error} When any eagerly preloaded file fails to load.
   */
  async load(project: AudioProject, options: AudioLoadOptions = {}): Promise<void> {
    const baseUrl = project.baseUrl ?? '';
    const decoder: AudioDecoder = options.decoder ?? ((url) => this.decodeUrl(url));
    const resolve: SoundResolver = options.resolve ?? ((definition) => baseUrl + definition.file);
    this.library = new AudioLibrary(decoder, resolve);
    this.library.register(project);
    if (options.preload === true) {
      await this.library.preloadAll();
      return;
    }
    await this.library.preload();
  }

  /**
   * The loaded sound/sequence catalog (definitions + buffer cache).
   */
  get catalog(): AudioLibrary {
    return this.library;
  }

  /**
   * Decodes the given sounds now, regardless of their `preload` flags.
   * With no ids, decodes every `preload: true` sound.
   */
  async preload(ids?: string[]): Promise<void> {
    await this.library.preload(ids);
  }

  /**
   * Global output volume `0..1` — every voice and the ambient channel are
   * multiplied by it. Instant; use {@link AudioSystem.setMasterVolume}
   * for a smooth fade.
   */
  get masterVolume(): number {
    return this.masterVolumeValue;
  }

  set masterVolume(volume: number) {
    this.setMasterVolume(volume, 0);
  }

  /**
   * Fades the global output volume to `volume` over `fadeSeconds`.
   *
   * @example Ducking music under a dialogue
   * ```ts
   * dialogRunner.onOpen(() => audio.setMasterVolume(0.3, 0.4));
   * dialogRunner.onClose(() => audio.setMasterVolume(1, 0.8));
   * ```
   */
  setMasterVolume(volume: number, fadeSeconds = 0): void {
    this.masterVolumeValue = Math.min(1, Math.max(0, volume));
    const masterGain = this.graph?.masterGain;
    if (masterGain === undefined) {
      return; // No graph yet — the value applies when one is built.
    }
    if (fadeSeconds > 0) {
      this.masterFade = { from: masterGain.gain.value, elapsed: 0, duration: fadeSeconds };
      return;
    }
    this.masterFade = null;
    masterGain.gain.value = this.masterVolumeValue;
  }

  /**
   * Where spatialised sound is heard from — usually the player. Pass any
   * `x`/`y` object (every entity qualifies) or a `() => Vector2` callback.
   * `null` disables distance attenuation until a listener is set again.
   */
  setListener(target: PositionTarget | null): void {
    this.listenerTarget = target;
  }

  /**
   * The ambient sound currently filling the slot, or `null`.
   */
  get ambientId(): string | null {
    return this.ambientSoundId;
  }

  /**
   * The ambient channel volume `0..1`.
   */
  get ambientVolume(): number {
    return this.ambientVolumeValue;
  }

  /**
   * Starts (or retargets) the ambient bed. The sound loops regardless of
   * its JSON `loop` flag — background music must persist. Replacing a
   * running ambient crossfades: the old bed fades out (default: over the
   * same duration as the new one's fade-in) while the new one swells in.
   *
   * Playing the id that is already running just retargets its volume.
   */
  playAmbient(id: string, options: AmbientPlayOptions = {}): void {
    if (this.destroyed) {
      return;
    }
    const definition = this.library.definition(id);
    if (definition === undefined) {
      console.warn(`[AudioSystem] Unknown ambient sound id: ${id}`);
      return;
    }
    const alreadyRunning = this.ambientSoundId === id && (this.ambientVoice?.active ?? false);
    if (alreadyRunning) {
      this.setAmbientVolume(options.volume ?? this.ambientVolumeValue, options.fadeIn ?? 0);
      return;
    }
    const fadeIn = options.fadeIn ?? 0;
    const fadeOut = options.fadeOut ?? fadeIn;
    this.ambientHandle?.stop({ fadeOut });
    this.ambientSoundId = id;
    this.ambientVolumeValue = Math.min(1, Math.max(0, options.volume ?? 1));
    const handle = new SoundHandle(id);
    void this.spawnVoice(handle, definition, {}, { fadeIn });
  }

  /**
   * Fades/stops the ambient bed and empties the slot.
   */
  stopAmbient(options: FadeStopOptions = {}): void {
    this.ambientHandle?.stop({ fadeOut: options.fadeOut ?? 0 });
    this.clearAmbient();
  }

  /**
   * Fades the ambient channel volume to `volume` over `fadeSeconds`.
   */
  setAmbientVolume(volume: number, fadeSeconds = 0): void {
    this.ambientVolumeValue = Math.min(1, Math.max(0, volume));
    this.ambientHandle?.setVolume(this.ambientVolumeValue, fadeSeconds);
  }

  /**
   * Fires a sound once and forgets it — footsteps, hits, screams. When
   * the definition is flagged `loop`, the returned {@link SoundHandle} is
   * the only way to stop it.
   *
   * Returns `null` (with a warning) for unknown ids or when the voice cap
   * is reached; a failed lazy load warns and is dropped, never thrown.
   *
   * @example Enemy scream that fades with distance
   * ```ts
   * audio.playSound("sfx_scream", { at: enemy, volume: 0.9 });
   * ```
   */
  playSound(id: string, options: PlaySoundOptions = {}): SoundHandle | null {
    if (this.destroyed) {
      return null;
    }
    const definition = this.library.definition(id);
    if (definition === undefined) {
      console.warn(`[AudioSystem] Unknown sound id: ${id}`);
      return null;
    }
    if (this.voices.length + this.pendingPlays.size >= this.maxVoices) {
      console.warn(`[AudioSystem] Voice limit reached (${this.maxVoices}); dropping "${id}"`);
      return null;
    }
    const handle = new SoundHandle(id);
    void this.spawnVoice(handle, definition, options, null);
    return handle;
  }

  /**
   * Hands out the next sound of a sequence and plays it as a one-shot.
   * The cursor advances once per call; looping sequences wrap, spent
   * non-looping ones return `null` until reset.
   *
   * Each `tracker` key advances its own cursor over the same sequence —
   * one per enemy, one for the player, or the shared default.
   *
   * @example Per-enemy footsteps
   * ```ts
   * // called whenever this enemy completes a step:
   * audio.playSequenceStep("seq_footsteps", { tracker: enemy.id, at: enemy });
   * ```
   */
  playSequenceStep(sequenceId: string, options: SequenceStepOptions = {}): SoundHandle | null {
    const sequence = this.cursorFor(sequenceId, options.tracker ?? sequenceId);
    if (sequence === null) {
      return null;
    }
    const soundId = sequence.next();
    if (soundId === undefined) {
      console.warn(
        `[AudioSystem] Sequence "${sequenceId}" is exhausted — call resetSequence("${sequenceId}")`,
      );
      return null;
    }
    return this.playSound(soundId, options);
  }

  /**
   * Rewinds a sequence cursor to its first step.
   */
  resetSequence(sequenceId: string, tracker?: string): void {
    this.cursorFor(sequenceId, tracker ?? sequenceId)?.reset();
  }

  /**
   * The sound id the sequence's next `playSequenceStep` would play,
   * without advancing the cursor. `undefined` for unknown or exhausted
   * sequences.
   */
  nextSequenceStep(sequenceId: string, tracker?: string): string | undefined {
    return this.cursorFor(sequenceId, tracker ?? sequenceId)?.peek();
  }

  /**
   * How many steps the sequence cursor has handed out since its last
   * reset. `undefined` for unknown sequences.
   */
  sequenceIndex(sequenceId: string, tracker?: string): number | undefined {
    return this.cursorFor(sequenceId, tracker ?? sequenceId)?.index;
  }

  /**
   * Resumes the Web Audio context. Browsers start it suspended until a
   * user gesture, so call this from your first click/keydown handler.
   * Every play also attempts it quietly.
   */
  async unlock(): Promise<void> {
    const { context } = this.ensureGraph();
    if (context.state !== 'running') {
      await context.resume();
    }
  }

  /**
   * Advances all fades and live distance attenuation by one frame and
   * sweeps finished voices. Driven by the engine's frame loop.
   */
  update(deltaTime: number): void {
    if (this.destroyed) {
      return;
    }
    this.updateMasterFade(deltaTime);
    this.updateVoices(deltaTime);
  }

  /**
   * Stops every sound (ambient included), cancels pending lazy loads,
   * clears sequence cursors, and closes the Web Audio context — unless
   * the context was injected, in which case the caller keeps ownership.
   */
  destroy(): void {
    if (this.destroyed) {
      return;
    }
    this.destroyed = true;
    this.stopAmbient();
    for (const voice of this.voices) {
      voice.stop(0);
    }
    this.voices.length = 0;
    for (const handle of this.pendingPlays) {
      handle.cancel();
    }
    this.pendingPlays.clear();
    this.sequenceCursors.clear();
    if (this.graph !== null && this.ownsContext) {
      void this.graph.context.close();
    }
    this.graph = null;
  }

  /**
   * Builds (once) the context + master gain pair every voice connects to.
   */
  private ensureGraph(): { context: AudioContextLike; masterGain: GainNode } {
    if (this.graph !== null) {
      return this.graph;
    }
    const context = this.injectedContext ?? new AudioContext();
    const masterGain = context.createGain();
    masterGain.gain.value = this.masterVolumeValue;
    masterGain.connect(context.destination);
    this.ownsContext = this.injectedContext === undefined;
    this.graph = { context, masterGain };
    return this.graph;
  }

  /**
   * Default decoder: Web API `fetch` + `decodeAudioData` (mp3, wav, …).
   */
  private async decodeUrl(url: string): Promise<AudioBuffer> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load audio: ${url} (${response.status})`);
    }
    const audioData = await response.arrayBuffer();
    return this.ensureGraph().context.decodeAudioData(audioData);
  }

  /**
   * Resolves a handle's buffer (lazily, deduplicated) and starts it as a
   * one-shot or as the new ambient bed. Warns and drops on failure.
   */
  private async spawnVoice(
    handle: SoundHandle,
    definition: SoundDefinition,
    options: PlaySoundOptions,
    ambient: AmbientSpawn | null,
  ): Promise<void> {
    this.pendingPlays.add(handle);
    try {
      const buffer = await this.library.buffer(definition.id);
      if (handle.cancelled) {
        return;
      }
      if (ambient !== null) {
        this.startAmbientVoice(handle, definition, buffer, ambient.fadeIn);
      } else {
        this.startOneShot(handle, definition, buffer, options);
      }
    } catch (error) {
      console.warn(`[AudioSystem] Failed to play "${definition.id}"`, error);
      if (ambient !== null && this.ambientSoundId === definition.id) {
        this.clearAmbient();
      }
    } finally {
      this.pendingPlays.delete(handle);
    }
  }

  /**
   * Starts a one-shot/loop voice with distance sampled for `at` once and
   * kept live for `follow`.
   */
  private startOneShot(
    handle: SoundHandle,
    definition: SoundDefinition,
    buffer: AudioBuffer,
    options: PlaySoundOptions,
  ): void {
    const { context, masterGain } = this.ensureGraph();
    this.unlockQuietly();
    const factor = this.spawnDistanceFactor(definition, options);
    const baseVolume = Math.min(1, Math.max(0, definition.volume ?? 1));
    const playVolume = Math.min(1, Math.max(0, options.volume ?? 1));
    const follow = options.follow;
    const distance = follow !== undefined ? this.liveDistance(definition) : undefined;
    const coreVolume = baseVolume * playVolume;
    const spawn: VoiceSpawnOptions = {
      soundId: definition.id,
      buffer,
      loop: definition.loop ?? false,
      // `at` bakes its one-off distance sample into the voice base; `follow`
      // leaves it out so the voice's per-frame resample is the only factor.
      baseVolume: follow !== undefined ? coreVolume : coreVolume * factor,
      rate: options.rate ?? 1,
      initialGain: coreVolume * factor,
      distance,
      follow,
    };
    const voice = new AudioVoice(context, masterGain, spawn);
    handle.bind(voice);
    this.voices.push(voice);
  }

  /**
   * Starts the ambient bed — always looping, fading in from silence when
   * requested, with the ambient channel volume as its instance volume.
   */
  private startAmbientVoice(
    handle: SoundHandle,
    definition: SoundDefinition,
    buffer: AudioBuffer,
    fadeIn: number,
  ): void {
    const { context, masterGain } = this.ensureGraph();
    this.unlockQuietly();
    const definitionVolume = Math.min(1, Math.max(0, definition.volume ?? 1));
    const ambientVolume = this.ambientVolumeValue;
    const spawn: VoiceSpawnOptions = {
      soundId: definition.id,
      buffer,
      loop: true,
      baseVolume: definitionVolume,
      rate: 1,
      initialGain: fadeIn > 0 ? 0 : definitionVolume * ambientVolume,
      distance: undefined,
      follow: undefined,
    };
    const voice = new AudioVoice(context, masterGain, spawn);
    handle.bind(voice);
    this.voices.push(voice);
    this.ambientVoice = voice;
    this.ambientHandle = handle;
    if (fadeIn > 0) {
      voice.setVolume(ambientVolume, fadeIn);
    }
  }

  /**
   * Distance factor for a fresh play: full volume for non-spatial sounds,
   * missing listeners, or plays without a position; otherwise the
   * listener-to-position factor, sampled once.
   */
  private spawnDistanceFactor(definition: SoundDefinition, options: PlaySoundOptions): number {
    const distance = this.liveDistance(definition);
    if (distance === undefined) {
      return 1;
    }
    const position = options.follow ?? options.at;
    if (position === undefined || this.listenerTarget === null) {
      return 1;
    }
    const listener = resolvePosition(this.listenerTarget);
    return distanceFactor(listener, resolvePosition(position), distance);
  }

  /**
   * The definition's distance range when it is a usable falloff range.
   */
  private liveDistance(definition: SoundDefinition): DistanceConfig | undefined {
    const distance = definition.distance;
    if (distance === undefined || distance.max <= 0) {
      return undefined;
    }
    return distance;
  }

  /**
   * Cursor for a (sequence, tracker) pair — created on first use.
   * `null` (with a warning) for unknown sequence ids.
   */
  private cursorFor(sequenceId: string, tracker: string): SoundSequence | null {
    const definition = this.library.sequence(sequenceId);
    if (definition === undefined) {
      console.warn(`[AudioSystem] Unknown sequence id: ${sequenceId}`);
      return null;
    }
    let cursors = this.sequenceCursors.get(sequenceId);
    if (cursors === undefined) {
      cursors = new Map<string, SoundSequence>();
      this.sequenceCursors.set(sequenceId, cursors);
    }
    let sequence = cursors.get(tracker);
    if (sequence === undefined) {
      sequence = new SoundSequence(definition);
      cursors.set(tracker, sequence);
    }
    return sequence;
  }

  /**
   * Advances the master volume fade, if one is running.
   */
  private updateMasterFade(deltaTime: number): void {
    const fade = this.masterFade;
    const masterGain = this.graph?.masterGain;
    if (fade === null || masterGain === undefined) {
      return;
    }
    fade.elapsed += deltaTime;
    if (fade.elapsed >= fade.duration) {
      this.masterFade = null;
      masterGain.gain.value = this.masterVolumeValue;
      return;
    }
    const progress = fade.elapsed / fade.duration;
    masterGain.gain.value = fade.from + (this.masterVolumeValue - fade.from) * progress;
  }

  /**
   * Ticks every voice and sweeps the finished ones in place (no array
   * churn per frame).
   */
  private updateVoices(deltaTime: number): void {
    if (this.voices.length === 0) {
      return;
    }
    const listener: Vector2 | null =
      this.listenerTarget !== null ? resolvePosition(this.listenerTarget) : null;
    let writeIndex = 0;
    for (let readIndex = 0; readIndex < this.voices.length; readIndex += 1) {
      const voice = this.voices[readIndex];
      if (voice === undefined) {
        continue;
      }
      const alive = voice.update(deltaTime, listener);
      if (alive) {
        this.voices[writeIndex] = voice;
        writeIndex += 1;
      } else if (voice === this.ambientVoice) {
        this.clearAmbient();
      }
    }
    this.voices.length = writeIndex;
  }

  /**
   * Empties the ambient slot (ids, handle, voice pointer).
   */
  private clearAmbient(): void {
    this.ambientHandle = null;
    this.ambientVoice = null;
    this.ambientSoundId = null;
  }

  /**
   * Fire-and-forget unlock — an autoplay-policy rejection before the
   * first user gesture is expected and harmless.
   */
  private unlockQuietly(): void {
    void this.unlock().catch(() => {});
  }
}
