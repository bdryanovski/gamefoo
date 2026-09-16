/**
 * Catalog + decoded-buffer cache for an {@link AudioProject}.
 *
 * Sounds are **lazy by default**: `buffer()` decodes a file on first play
 * and caches it, so nothing is fetched the game never hears. Definitions
 * flagged `preload` (or an explicit `preload()` call) decode eagerly at
 * load time instead. In-flight loads are deduplicated so a burst of
 * footsteps racing the decoder still results in exactly one fetch.
 *
 * {@link AudioSystem} owns one library per loaded project.
 *
 * @category Audio
 * @since 0.5.0
 *
 * @see {@link AudioSystem}
 */

import type {
  AudioDecoder,
  AudioProject,
  SoundDefinition,
  SoundResolver,
  SoundSequenceDefinition,
} from './types';

/**
 * @category Audio
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const library = new AudioLibrary(decoder, (def) => `audio/${def.file}`);
 * library.register(project);
 * const buffer = await library.buffer("sfx_step_1"); // decoded on demand
 * ```
 */
export class AudioLibrary {
  /**
   * Sound definitions by `SoundDefinition.id`.
   */
  private readonly definitionsById = new Map<string, SoundDefinition>();
  /**
   * Sequence definitions by `SoundSequenceDefinition.id`.
   */
  private readonly sequencesById = new Map<string, SoundSequenceDefinition>();
  /**
   * Decoded buffers by sound id — filled lazily by `buffer()`.
   */
  private readonly buffersById = new Map<string, AudioBuffer>();
  /**
   * In-flight loads by sound id, so concurrent `buffer()` calls for the
   * same sound share one decode.
   */
  private readonly pendingById = new Map<string, Promise<AudioBuffer>>();
  /**
   * Turns a resolved URL into a playable buffer (Web APIs by default).
   */
  private readonly decoder: AudioDecoder;
  /**
   * Maps a definition to the URL to fetch.
   */
  private readonly resolve: SoundResolver;

  /**
   * @param decoder - Fetch + decode pipeline (injectable for tests).
   * @param resolve - Definition → URL mapping. Defaults to the raw
   *   `file` field.
   */
  constructor(
    decoder: AudioDecoder,
    resolve: SoundResolver = (definition): string => definition.file,
  ) {
    this.decoder = decoder;
    this.resolve = resolve;
  }

  /**
   * Fills the catalog from a parsed project document. Duplicate sound ids
   * warn and let the last entry win.
   */
  register(project: AudioProject): void {
    for (const definition of project.sounds) {
      if (this.definitionsById.has(definition.id)) {
        console.warn(`[AudioLibrary] Duplicate sound id: ${definition.id} (last one wins)`);
      }
      this.definitionsById.set(definition.id, definition);
    }
    for (const sequence of project.sequences ?? []) {
      this.sequencesById.set(sequence.id, sequence);
    }
  }

  /**
   * Sound definition for an id, or `undefined` if unknown.
   */
  definition(id: string): SoundDefinition | undefined {
    return this.definitionsById.get(id);
  }

  /**
   * Sequence definition for an id, or `undefined` if unknown.
   */
  sequence(id: string): SoundSequenceDefinition | undefined {
    return this.sequencesById.get(id);
  }

  /**
   * Decoded buffer for a sound id — from cache if available, otherwise
   * fetched and decoded now. Concurrent calls for the same id share one
   * in-flight load.
   *
   * @throws {Error} For unknown ids, or whatever the decoder throws for
   *   missing/broken files.
   */
  async buffer(id: string): Promise<AudioBuffer> {
    const cached = this.buffersById.get(id);
    if (cached !== undefined) {
      return cached;
    }
    const pending = this.pendingById.get(id);
    if (pending !== undefined) {
      return pending;
    }
    const definition = this.definitionsById.get(id);
    if (definition === undefined) {
      throw new Error(`Unknown sound id: ${id}`);
    }
    const loading = this.decoder(this.resolve(definition))
      .then((buffer: AudioBuffer) => {
        this.buffersById.set(id, buffer);
        this.pendingById.delete(id);
        return buffer;
      })
      .catch((error: unknown) => {
        this.pendingById.delete(id);
        throw error;
      });
    this.pendingById.set(id, loading);
    return loading;
  }

  /**
   * Ids of every decoded-and-cached sound (debug / tests).
   */
  get loadedIds(): string[] {
    return [...this.buffersById.keys()];
  }

  /**
   * Eagerly decodes the given sounds (regardless of their `preload`
   * flags). With no ids, decodes every definition flagged `preload: true`.
   *
   * @throws {Error} When any listed sound fails to load — preload is a
   *   setup-time operation, so failures are loud.
   */
  async preload(ids?: string[]): Promise<void> {
    const targets = ids ?? this.preloadFlaggedIds();
    await Promise.all(
      targets.map((id) => {
        return this.buffer(id);
      }),
    );
  }

  /**
   * Eagerly decodes **every** registered sound.
   *
   * @throws {Error} When any sound fails to load.
   */
  async preloadAll(): Promise<void> {
    const ids = [...this.definitionsById.keys()];
    await Promise.all(
      ids.map((id) => {
        return this.buffer(id);
      }),
    );
  }

  /**
   * Drops the cached buffer for one sound (or all of them) to free
   * memory. The next play re-decodes lazily.
   */
  release(id?: string): void {
    if (id === undefined) {
      this.buffersById.clear();
      return;
    }
    this.buffersById.delete(id);
  }

  /**
   * Ids of definitions flagged `preload: true`.
   */
  private preloadFlaggedIds(): string[] {
    const ids: string[] = [];
    for (const definition of this.definitionsById.values()) {
      if (definition.preload === true) {
        ids.push(definition.id);
      }
    }
    return ids;
  }
}
