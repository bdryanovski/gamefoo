import type { SoundHandle, SubSystem } from '../../../../src/index';
import { AUDIO } from '../config/audio';
import { Campfire } from '../objects/campfire';
import type { LightSource } from '../behaviors/light_source';
import type { GameContext } from '../context';

/**
 * The game's audio direction: the ambient bed per screen (crossfaded on
 * navigation — and self-starting on the first live frame after the splash,
 * which replaces the old startGame()→updateBackground() wiring), the
 * footstep sequence while walking, and the looping, distance-attenuated
 * campfire emitters reconciled with the lit fires on-screen.
 */
export class AudioDirectorSystem implements SubSystem {
  readonly id = 'audio-director';
  readonly order = 65; // with the engine AudioSystem (60), after the world (20)

  /** `undefined` = "never played yet" — the first live frame starts the beds. */
  private lastScreen: string | undefined;
  /** Seconds since the last footfall; starts "ready" so walking steps at once. */
  private stepTimer: number = AUDIO.stepInterval;
  /** Looping campfire emitter per lit fire on the active screen. */
  private readonly fireVoices = new Map<LightSource, SoundHandle>();

  constructor(private readonly ctx: GameContext) {}

  update(dt: number): void {
    if (!this.ctx.flow?.worldActive) return;
    this.refreshAmbients();
    this.updateFootsteps(dt);
    this.syncCampfires();
  }

  /** Crossfades to the ambient beds configured for the current screen. */
  private refreshAmbients(): void {
    const key = this.ctx.world?.screenKey();
    if (key === undefined || key === this.lastScreen) return;
    this.lastScreen = key;
    const id = AUDIO.backgroundByScreen[key];
    this.ctx.audio?.playAmbient(AUDIO.defaultBackground, {
      channel: 'cave',
      fadeIn: AUDIO.ambientFade,
      fadeOut: AUDIO.ambientFade,
      volume: 0.2,
    });
    if (id) {
      this.ctx.audio?.playAmbient(id, {
        channel: 'music',
        fadeIn: AUDIO.ambientFade,
        fadeOut: AUDIO.ambientFade,
        volume: 0.7,
      });
    }
  }

  /**
   * Footsteps: cycle the configured sequence one step per interval while
   * the player walks; reset the timer when idle so the next stride steps at
   * once. Slight random rate so footsteps don't sound mechanical.
   */
  private updateFootsteps(dt: number): void {
    const player = this.ctx.player;
    if (!player) return;
    if (player.isWalking()) {
      this.stepTimer += dt;
      if (this.stepTimer >= AUDIO.stepInterval) {
        this.ctx.audio?.playSequenceStep(AUDIO.footstepSequence, {
          tracker: 'player',
          volume: AUDIO.stepVolume,
          rate: 0.94 + Math.random() * 0.12,
        });
        this.stepTimer = 0;
      }
    } else {
      this.stepTimer = AUDIO.stepInterval;
    }
  }

  /**
   * Reconciles the looping campfire emitters with the lit fires on-screen:
   * starts a distance-attenuated, fire-following voice for each newly lit
   * campfire and fades out any that went cold or left with the screen.
   */
  private syncCampfires(): void {
    const audio = this.ctx.audio;
    if (!audio) return;
    const lit = new Set(this.litFires());
    for (const [light, handle] of this.fireVoices) {
      if (lit.has(light)) continue;
      handle.stop({ fadeOut: 0.3 });
      this.fireVoices.delete(light);
    }
    for (const light of lit) {
      if (this.fireVoices.has(light)) continue;
      const handle = audio.playSound(AUDIO.campfireSound, {
        volume: AUDIO.campfireVolume,
        follow: () => {
          const b = light.collisionBox;
          return { x: b.x + b.w / 2, y: b.y + b.h / 2 };
        },
      });
      if (handle) this.fireVoices.set(light, handle);
    }
  }

  /** The {@link LightSource} behavior of every lit campfire on the screen. */
  private litFires(): LightSource[] {
    const fires = this.ctx.world?.current()?.objectsByType(Campfire) ?? [];
    const out: LightSource[] = [];
    for (const fire of fires) {
      const light = fire.getBehaviour<LightSource>('light-source');
      if (light?.lit) out.push(light);
    }
    return out;
  }
}
