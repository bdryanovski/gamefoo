/**
 * Contract: AudioSystem public API + behaviour
 *
 * Covers JSON loading, lazy/preload decoding, one-shots, ambient
 * crossfades, sequences, distance falloff, master volume, and the
 * subsystem lifecycle — all against a fake Web Audio context (tests run
 * in Node, where `AudioContext` does not exist).
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { AudioSystem } from '../src/core/audio/audio_system';
import { SoundSequence } from '../src/core/audio/sound_sequence';
import { distanceFactor, resolvePosition } from '../src/core/audio/spatial';
import type { AudioContextLike } from '../src/core/audio/types';
import type { AudioProject } from '../src/core/audio/types';

// ── Fakes ─────────────────────────────────────────────────────────────

class FakeAudioParam {
  value = 1;
}

class FakeGainNode {
  readonly gain = new FakeAudioParam();
  connect = vi.fn(() => {});
  disconnect = vi.fn(() => {});
}

class FakeBufferSource {
  buffer: unknown = null;
  loop = false;
  readonly playbackRate = new FakeAudioParam();
  onended: (() => void) | null = null;
  connect = vi.fn(() => {});
  disconnect = vi.fn(() => {});
  start = vi.fn(() => {});
  stop = vi.fn(() => {
    this.onended?.();
  });
}

class FakeAudioContext {
  state = 'running';
  readonly destination = { connect: vi.fn(), disconnect: vi.fn() };
  readonly gains: FakeGainNode[] = [];
  readonly sources: FakeBufferSource[] = [];
  resume = vi.fn(async () => {});
  close = vi.fn(async () => {});

  createGain(): FakeGainNode {
    const gain = new FakeGainNode();
    this.gains.push(gain);
    return gain;
  }

  createBufferSource(): FakeBufferSource {
    const source = new FakeBufferSource();
    this.sources.push(source);
    return source;
  }
}

// ── Fixtures ──────────────────────────────────────────────────────────

function makeProject(): AudioProject {
  return {
    baseUrl: 'audio/',
    sounds: [
      { id: 'sfx_step_1', file: 'sfx/step_1.mp3', volume: 0.8 },
      { id: 'sfx_step_2', file: 'sfx/step_2.mp3' },
      { id: 'sfx_step_3', file: 'sfx/step_3.mp3' },
      { id: 'sfx_scream', file: 'sfx/scream.mp3', volume: 0.9, distance: { min: 0, max: 100 } },
      {
        id: 'amb_torch',
        file: 'sfx/torch.wav',
        volume: 0.5,
        loop: true,
        distance: { min: 0, max: 200 },
      },
      { id: 'music_forest', file: 'music/forest.mp3', volume: 0.7, loop: true, preload: true },
      { id: 'music_cave', file: 'music/cave.mp3', volume: 0.7, loop: true },
    ],
    sequences: [
      { id: 'seq_footsteps', steps: ['sfx_step_1', 'sfx_step_2', 'sfx_step_3'], loop: true },
      { id: 'seq_growl', steps: ['sfx_step_1', 'sfx_step_2'], loop: false },
    ],
  };
}

async function setup(options: { maxVoices?: number; preloadAll?: boolean } = {}) {
  const context = new FakeAudioContext();
  const decoder = vi.fn(async (url: string) => ({ url }) as AudioBuffer);
  const system = new AudioSystem({
    context: context as unknown as AudioContextLike,
    maxVoices: options.maxVoices,
  });
  await system.load(makeProject(), { decoder, preload: options.preloadAll });
  return { context, decoder, system };
}

/** Lets pending lazy decodes resolve and voices spawn. */
async function flush(): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

function spyWarnings() {
  return vi.spyOn(console, 'warn').mockImplementation(() => {});
}

afterEach(() => {
  vi.restoreAllMocks();
});

// ── Spatial helpers ───────────────────────────────────────────────────

describe('spatial helpers', () => {
  test('resolvePosition — copies plain objects (no aliasing)', () => {
    const entity = { x: 10, y: 20 };
    const position = resolvePosition(entity);
    expect(position).toEqual({ x: 10, y: 20 });
    expect(position).not.toBe(entity);
  });

  test('resolvePosition — calls function targets', () => {
    const position = resolvePosition(() => ({ x: 1, y: 2 }));
    expect(position).toEqual({ x: 1, y: 2 });
  });

  test('distanceFactor — full volume inside min', () => {
    expect(distanceFactor({ x: 0, y: 0 }, { x: 20, y: 0 }, { min: 32, max: 220 })).toBe(1);
  });

  test('distanceFactor — linear falloff between min and max', () => {
    expect(distanceFactor({ x: 0, y: 0 }, { x: 50, y: 0 }, { min: 0, max: 100 })).toBe(0.5);
    expect(distanceFactor({ x: 0, y: 0 }, { x: 100, y: 0 }, { min: 32, max: 220 })).toBeCloseTo(
      120 / 188,
    );
  });

  test('distanceFactor — silent at or beyond max', () => {
    expect(distanceFactor({ x: 0, y: 0 }, { x: 100, y: 0 }, { min: 0, max: 100 })).toBe(0);
    expect(distanceFactor({ x: 0, y: 0 }, { x: 500, y: 0 }, { min: 0, max: 100 })).toBe(0);
  });

  test('distanceFactor — degenerate ranges are non-spatial / step', () => {
    expect(distanceFactor({ x: 0, y: 0 }, { x: 50, y: 0 }, { min: 0, max: 0 })).toBe(1);
    expect(distanceFactor({ x: 0, y: 0 }, { x: 50, y: 0 }, { min: 100, max: 100 })).toBe(1);
    expect(distanceFactor({ x: 0, y: 0 }, { x: 150, y: 0 }, { min: 100, max: 100 })).toBe(0);
  });

  test('distanceFactor — negative min clamps to zero', () => {
    expect(distanceFactor({ x: 0, y: 0 }, { x: 0, y: 0 }, { min: -50, max: 100 })).toBe(1);
    expect(distanceFactor({ x: 0, y: 0 }, { x: 50, y: 0 }, { min: -50, max: 100 })).toBe(0.5);
  });
});

// ── Sequence cursor ───────────────────────────────────────────────────

describe('SoundSequence', () => {
  test('next() — hands out steps in order and wraps', () => {
    const sequence = new SoundSequence({
      id: 'seq',
      steps: ['a', 'b', 'c'],
      loop: true,
    });
    expect(sequence.next()).toBe('a');
    expect(sequence.next()).toBe('b');
    expect(sequence.next()).toBe('c');
    expect(sequence.next()).toBe('a');
    expect(sequence.index).toBe(1);
  });

  test('next() — non-looping stays exhausted until reset', () => {
    const sequence = new SoundSequence({
      id: 'seq',
      steps: ['a', 'b'],
      loop: false,
    });
    expect(sequence.next()).toBe('a');
    expect(sequence.next()).toBe('b');
    expect(sequence.next()).toBeUndefined();
    expect(sequence.done).toBe(true);
    sequence.reset();
    expect(sequence.next()).toBe('a');
    expect(sequence.done).toBe(false);
  });

  test('peek() — looks ahead without advancing', () => {
    const sequence = new SoundSequence({
      id: 'seq',
      steps: ['a', 'b'],
      loop: true,
    });
    expect(sequence.peek()).toBe('a');
    expect(sequence.index).toBe(0);
    sequence.next();
    expect(sequence.peek()).toBe('b');
  });

  test('empty sequence — always undefined', () => {
    const sequence = new SoundSequence({ id: 'seq', steps: [], loop: true });
    expect(sequence.next()).toBeUndefined();
    expect(sequence.peek()).toBeUndefined();
  });
});

// ── Loading & lazy decoding ───────────────────────────────────────────

describe('AudioSystem — load & lazy loading', () => {
  test('load — registers sounds and sequences in the catalog', async () => {
    const { system } = await setup();
    expect(system.catalog.definition('sfx_step_1')?.file).toBe('sfx/step_1.mp3');
    expect(system.catalog.definition('missing')).toBeUndefined();
    expect(system.catalog.sequence('seq_footsteps')?.steps).toHaveLength(3);
  });

  test('load — decodes only preload-flagged sounds, with baseUrl prefix', async () => {
    const { decoder } = await setup();
    expect(decoder).toHaveBeenCalledTimes(1);
    expect(decoder).toHaveBeenCalledWith('audio/music/forest.mp3');
  });

  test('load — preload: true decodes everything', async () => {
    const { decoder } = await setup({ preloadAll: true });
    expect(decoder).toHaveBeenCalledTimes(7);
  });

  test('play — decodes lazily on first play, then caches', async () => {
    const { system, decoder } = await setup();
    expect(decoder).toHaveBeenCalledTimes(1); // only the flagged music

    system.playSound('sfx_step_2');
    await flush();
    expect(decoder).toHaveBeenCalledWith('audio/sfx/step_2.mp3');
    expect(decoder).toHaveBeenCalledTimes(2);

    system.playSound('sfx_step_2');
    await flush();
    expect(decoder).toHaveBeenCalledTimes(2); // served from cache
  });

  test('preload() — decodes explicit ids on demand', async () => {
    const { system, decoder } = await setup();
    await system.preload(['sfx_step_3']);
    expect(decoder).toHaveBeenCalledWith('audio/sfx/step_3.mp3');
  });

  test('load — duplicate ids warn and last one wins', async () => {
    const warn = spyWarnings();
    const context = new FakeAudioContext();
    const decoder = vi.fn(async (url: string) => ({ url }) as AudioBuffer);
    const system = new AudioSystem({ context: context as unknown as AudioContextLike });
    const project = makeProject();
    project.sounds.push({ id: 'sfx_step_1', file: 'sfx/step_1_other.mp3' });
    await system.load(project, { decoder });
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Duplicate sound id'));
    expect(system.catalog.definition('sfx_step_1')?.file).toBe('sfx/step_1_other.mp3');
  });
});

// ── One-shots ─────────────────────────────────────────────────────────

describe('AudioSystem — one-shot playback', () => {
  test('playSound — spawns a voice with definition volume', async () => {
    const { system, context } = await setup();
    const handle = system.playSound('sfx_step_1');
    await flush();

    expect(handle).not.toBeNull();
    expect(handle!.playing).toBe(true);
    expect(handle!.soundId).toBe('sfx_step_1');
    expect(context.sources).toHaveLength(1);

    const source = context.sources[0]!;
    expect(source.loop).toBe(false);
    expect(source.buffer).toEqual({ url: 'audio/sfx/step_1.mp3' });
    // Master gain is gains[0]; the voice gain is gains[1].
    expect(context.gains[1]!.gain.value).toBeCloseTo(0.8);
  });

  test('playSound — option volume multiplies, clamped to 1', async () => {
    const { system, context } = await setup();
    system.playSound('sfx_step_1', { volume: 0.5 });
    await flush();
    expect(context.gains[1]!.gain.value).toBeCloseTo(0.4);

    system.playSound('sfx_step_1', { volume: 5 });
    await flush();
    expect(context.gains[2]!.gain.value).toBeCloseTo(0.8);
  });

  test('playSound — rate option reaches the source node', async () => {
    const { system, context } = await setup();
    system.playSound('sfx_step_1', { rate: 2 });
    await flush();
    expect(context.sources[0]!.playbackRate.value).toBe(2);
  });

  test('playSound — looping definition keeps playing until stopped', async () => {
    const { system, context } = await setup();
    const handle = system.playSound('amb_torch');
    await flush();
    expect(context.sources[0]!.loop).toBe(true);

    handle!.stop();
    expect(context.sources[0]!.stop).toHaveBeenCalled();
    expect(handle!.playing).toBe(false);
  });

  test('playSound — unknown id warns and returns null', async () => {
    const warn = spyWarnings();
    const { system } = await setup();
    expect(system.playSound('nope')).toBeNull();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Unknown sound id'));
  });

  test('handle.setVolume — adjusts the live voice', async () => {
    const { system, context } = await setup();
    const handle = system.playSound('sfx_step_1');
    await flush();
    handle!.setVolume(0.5);
    system.update(1 / 60);
    expect(context.gains[1]!.gain.value).toBeCloseTo(0.4);
  });

  test('playSound — failed lazy load warns and never spawns', async () => {
    const warn = spyWarnings();
    const context = new FakeAudioContext();
    const decoder = vi.fn(async (url: string) => {
      if (url === 'audio/sfx/step_1.mp3') {
        throw new Error('404');
      }
      return { url } as AudioBuffer;
    });
    const system = new AudioSystem({ context: context as unknown as AudioContextLike });
    await system.load(makeProject(), { decoder });

    const handle = system.playSound('sfx_step_1');
    await flush();

    expect(handle!.playing).toBe(false);
    expect(context.sources).toHaveLength(0);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Failed to play'), expect.anything());
  });
});

// ── Ambient channel ───────────────────────────────────────────────────

describe('AudioSystem — ambient channel', () => {
  test('playAmbient — loops, fades in from silence, stays until told', async () => {
    const { system, context } = await setup();
    system.playAmbient('music_forest', { fadeIn: 1 });
    await flush();

    expect(system.ambientId).toBe('music_forest');
    const source = context.sources[0]!;
    expect(source.loop).toBe(true);
    expect(context.gains[1]!.gain.value).toBe(0); // silent at spawn

    system.update(0.5);
    expect(context.gains[1]!.gain.value).toBeCloseTo(0.35); // half of 0.7
    system.update(0.5);
    expect(context.gains[1]!.gain.value).toBeCloseTo(0.7);
  });

  test('playAmbient — without fadeIn starts at full volume', async () => {
    const { system, context } = await setup();
    system.playAmbient('music_forest');
    await flush();
    expect(context.gains[1]!.gain.value).toBeCloseTo(0.7);
  });

  test('playAmbient — same id retargets volume without a new voice', async () => {
    const { system, context } = await setup();
    system.playAmbient('music_forest', { fadeIn: 1 });
    await flush();
    system.update(1);
    expect(context.gains[1]!.gain.value).toBeCloseTo(0.7);

    system.playAmbient('music_forest', { volume: 0.4 });
    await flush();
    expect(context.sources).toHaveLength(1); // no second source
    system.update(1 / 60);
    expect(context.gains[1]!.gain.value).toBeCloseTo(0.28); // 0.7 × 0.4
  });

  test('playAmbient — replacing crossfades old out, new in', async () => {
    const { system, context } = await setup();
    system.playAmbient('music_forest', { fadeIn: 1 });
    await flush();
    system.update(1); // forest at full 0.7

    system.playAmbient('music_cave', { fadeIn: 1, fadeOut: 1 });
    await flush();

    expect(system.ambientId).toBe('music_cave');
    expect(context.sources).toHaveLength(2);

    const forestSource = context.sources[0]!;
    const forestGain = context.gains[1]!;
    const caveGain = context.gains[2]!;

    system.update(0.5);
    expect(forestGain.gain.value).toBeCloseTo(0.35); // dying away
    expect(caveGain.gain.value).toBeCloseTo(0.35); // swelling in

    system.update(0.5);
    expect(forestGain.gain.value).toBe(0);
    expect(forestSource.stop).toHaveBeenCalled(); // old bed is gone
    expect(caveGain.gain.value).toBeCloseTo(0.7); // new bed at full
    expect(system.ambientId).toBe('music_cave');
  });

  test('stopAmbient — fades out and empties the slot immediately', async () => {
    const { system, context } = await setup();
    system.playAmbient('music_forest', { fadeIn: 1 });
    await flush();
    system.update(1);

    system.stopAmbient({ fadeOut: 0.5 });
    expect(system.ambientId).toBeNull();

    system.update(0.25);
    expect(context.gains[1]!.gain.value).toBeCloseTo(0.35);
    system.update(0.25);
    expect(context.sources[0]!.stop).toHaveBeenCalled();
    expect(context.gains[1]!.gain.value).toBe(0);
  });

  test('setAmbientVolume — fades the channel volume', async () => {
    const { system, context } = await setup();
    system.playAmbient('music_forest');
    await flush();
    expect(context.gains[1]!.gain.value).toBeCloseTo(0.7);

    system.setAmbientVolume(0.5, 1);
    system.update(0.5);
    expect(context.gains[1]!.gain.value).toBeCloseTo(0.525); // 0.7 → 0.35, halfway
    system.update(0.5);
    expect(context.gains[1]!.gain.value).toBeCloseTo(0.35);
    expect(system.ambientVolume).toBe(0.5);
  });

  test('playAmbient — unknown id warns', async () => {
    const warn = spyWarnings();
    const { system } = await setup();
    system.playAmbient('nope');
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Unknown ambient sound id'));
  });
});

// ── Sequences ─────────────────────────────────────────────────────────

describe('AudioSystem — sequences', () => {
  test('playSequenceStep — advances the shared cursor and wraps', async () => {
    const { system } = await setup();
    expect(system.playSequenceStep('seq_footsteps')?.soundId).toBe('sfx_step_1');
    expect(system.playSequenceStep('seq_footsteps')?.soundId).toBe('sfx_step_2');
    expect(system.playSequenceStep('seq_footsteps')?.soundId).toBe('sfx_step_3');
    expect(system.playSequenceStep('seq_footsteps')?.soundId).toBe('sfx_step_1'); // wrapped
  });

  test('resetSequence — rewinds to the first step', async () => {
    const { system } = await setup();
    system.playSequenceStep('seq_footsteps');
    system.playSequenceStep('seq_footsteps');
    expect(system.sequenceIndex('seq_footsteps')).toBe(2);

    system.resetSequence('seq_footsteps');
    expect(system.sequenceIndex('seq_footsteps')).toBe(0);
    expect(system.playSequenceStep('seq_footsteps')?.soundId).toBe('sfx_step_1');
  });

  test('non-looping sequence — exhausts, warns, resets', async () => {
    const warn = spyWarnings();
    const { system } = await setup();
    expect(system.playSequenceStep('seq_growl')?.soundId).toBe('sfx_step_1');
    expect(system.playSequenceStep('seq_growl')?.soundId).toBe('sfx_step_2');
    expect(system.playSequenceStep('seq_growl')).toBeNull();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('exhausted'));

    system.resetSequence('seq_growl');
    expect(system.playSequenceStep('seq_growl')?.soundId).toBe('sfx_step_1');
  });

  test('trackers — independent cursors over one sequence', async () => {
    const { system } = await setup();
    system.playSequenceStep('seq_footsteps'); // shared: step 1
    system.playSequenceStep('seq_footsteps', { tracker: 'enemy_a' }); // enemy: step 1
    system.playSequenceStep('seq_footsteps', { tracker: 'enemy_a' }); // enemy: step 2

    expect(system.sequenceIndex('seq_footsteps')).toBe(1);
    expect(system.sequenceIndex('seq_footsteps', 'enemy_a')).toBe(2);
    expect(system.playSequenceStep('seq_footsteps')?.soundId).toBe('sfx_step_2'); // shared continues
    expect(system.playSequenceStep('seq_footsteps', { tracker: 'enemy_a' })?.soundId).toBe('sfx_step_3');
  });

  test('nextSequenceStep — peeks without advancing', async () => {
    const { system } = await setup();
    expect(system.nextSequenceStep('seq_footsteps')).toBe('sfx_step_1');
    system.playSequenceStep('seq_footsteps');
    expect(system.nextSequenceStep('seq_footsteps')).toBe('sfx_step_2');
    expect(system.sequenceIndex('seq_footsteps')).toBe(1); // peek did not advance
  });

  test('unknown sequence — warns and returns null', async () => {
    const warn = spyWarnings();
    const { system } = await setup();
    expect(system.playSequenceStep('nope')).toBeNull();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Unknown sequence id'));
  });
});

// ── Spatial playback ──────────────────────────────────────────────────

describe('AudioSystem — distance-based volume', () => {
  test('at — samples distance once at play time', async () => {
    const { system, context } = await setup();
    system.setListener({ x: 0, y: 0 });
    system.playSound('sfx_scream', { at: { x: 50, y: 0 } });
    await flush();
    expect(context.gains[1]!.gain.value).toBeCloseTo(0.45); // 0.9 × 0.5

    system.update(1);
    expect(context.gains[1]!.gain.value).toBeCloseTo(0.45); // static — never resampled
  });

  test('at — without a listener plays at full volume', async () => {
    const { system, context } = await setup();
    system.playSound('sfx_scream', { at: { x: 500, y: 0 } });
    await flush();
    expect(context.gains[1]!.gain.value).toBeCloseTo(0.9);
  });

  test('follow — resamples every frame as the emitter moves', async () => {
    const { system, context } = await setup();
    const torch = { x: 100, y: 0 };
    system.setListener({ x: 0, y: 0 });
    const handle = system.playSound('amb_torch', { follow: torch });
    await flush();
    system.update(1 / 60);
    expect(context.gains[1]!.gain.value).toBeCloseTo(0.25); // 0.5 × 0.5

    torch.x = 300; // beyond max
    system.update(1 / 60);
    expect(context.gains[1]!.gain.value).toBe(0);
    expect(handle!.playing).toBe(true); // silent but alive — swells back

    torch.x = 0; // right next to it → 100%
    system.update(1 / 60);
    expect(context.gains[1]!.gain.value).toBeCloseTo(0.5);
  });

  test('follow — works with function targets (live entity positions)', async () => {
    const { system, context } = await setup();
    let x = 100;
    system.setListener(() => ({ x: 0, y: 0 }));
    system.playSound('amb_torch', { follow: () => ({ x, y: 0 }) });
    await flush();
    system.update(1 / 60);
    expect(context.gains[1]!.gain.value).toBeCloseTo(0.25);

    x = 0;
    system.update(1 / 60);
    expect(context.gains[1]!.gain.value).toBeCloseTo(0.5);
  });

  test('non-spatial sound — ignores positions entirely', async () => {
    const { system, context } = await setup();
    system.setListener({ x: 0, y: 0 });
    system.playSound('sfx_step_1', { at: { x: 9999, y: 9999 } });
    await flush();
    expect(context.gains[1]!.gain.value).toBeCloseTo(0.8);
  });
});

// ── Master volume & lifecycle ─────────────────────────────────────────

describe('AudioSystem — master volume & lifecycle', () => {
  test('masterVolume — instant set reaches the master gain', async () => {
    const { system, context } = await setup();
    expect(system.masterVolume).toBe(1);
    system.masterVolume = 0.5;
    expect(context.gains[0]!.gain.value).toBe(0.5);
  });

  test('setMasterVolume — fades smoothly', async () => {
    const { system, context } = await setup();
    system.setMasterVolume(0.2, 1);
    system.update(0.5);
    expect(context.gains[0]!.gain.value).toBeCloseTo(0.6);
    system.update(0.5);
    expect(context.gains[0]!.gain.value).toBeCloseTo(0.2);
  });

  test('unlock — resumes a suspended context', async () => {
    const { system, context } = await setup();
    context.state = 'suspended';
    await system.unlock();
    expect(context.resume).toHaveBeenCalled();
  });

  test('play — quietly resumes a suspended context', async () => {
    const { system, context } = await setup();
    context.state = 'suspended';
    system.playSound('sfx_step_1');
    await flush();
    expect(context.resume).toHaveBeenCalled();
  });

  test('voice cap — overflow drops plays with a warning', async () => {
    const warn = spyWarnings();
    const { system } = await setup({ maxVoices: 2 });
    const first = system.playSound('amb_torch');
    const second = system.playSound('amb_torch');
    await flush(); // both lazy loads resolve and spawn
    const third = system.playSound('amb_torch');
    expect(first).not.toBeNull();
    expect(second).not.toBeNull();
    expect(third).toBeNull();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Voice limit reached'));

    first!.stop();
    system.update(1 / 60); // sweeps the finished voice
    expect(system.playSound('amb_torch')).not.toBeNull();
  });

  test('destroy — stops everything, closes nothing it does not own', async () => {
    const { system, context } = await setup();
    system.playAmbient('music_forest');
    system.playSound('amb_torch', { follow: { x: 0, y: 0 } });
    await flush();
    expect(context.sources.length).toBe(2);

    system.destroy();
    for (const source of context.sources) {
      expect(source.stop).toHaveBeenCalled();
    }
    expect(system.ambientId).toBeNull();
    expect(context.close).not.toHaveBeenCalled(); // injected context: caller owns it
    expect(system.playSound('sfx_step_1')).toBeNull(); // dead system refuses
  });

  test('destroy — cancels lazy loads still in flight', async () => {
    const { system, context } = await setup();
    system.playSound('sfx_step_2'); // never flushed — still decoding
    system.destroy();
    await flush();
    expect(context.sources).toHaveLength(0); // spawn was cancelled
  });
});
