import type { RenderContext, SubSystem } from '../../../../src';
import type { GameContext } from '../context';
import { drawText } from '../text';

export class SplashSystem implements SubSystem {
  readonly id = 'splash';
  readonly order = 89; // renders above dialog(85)/lock(87), below monitor(90)

  private image?: HTMLImageElement;
  private ready = false;
  private started = false;
  private elapsed = 0;

  /**
   * @param onStarted Runs once, on the press that dismisses the card —
   *   wired to the ambient-bed crossfade until Phase 4's AudioDirectorSystem
   *   takes that over by itself.
   */
  constructor(
    private readonly context: GameContext,
    private readonly onStarted?: () => void,
  ) {}

  /** True once the player dismissed the splash and the world is live. */
  get isStarted(): boolean {
    return this.started;
  }

  init(): void {
    // The world is frozen from the very first frame — until this pops itself.
    this.context.flow?.push('splash');
  }

  /** Installs the title card (non-fatal when it failed to load). */
  useImage(image?: HTMLImageElement): void {
    this.image = image;
  }

  /** Boot signals "everything loaded" — the prompt becomes "Press E to start". */
  markReady(): void {
    this.ready = true;
  }

  update(dt: number): void {
    if (this.started) return;
    this.elapsed += dt;
    const input = this.context.input;
    if (
      this.ready &&
      (input.isKeyPressed('e') || input.isKeyPressed(' ') || input.isKeyPressed('enter'))
    ) {
      this.started = true;
      this.context.flow?.pop('splash');
      this.onStarted?.();
    }
  }

  render(ctx: RenderContext): void {
    if (this.started) return;
    const w = ctx.width;
    const h = ctx.height;
    const image = this.image;
    if (image && ctx.drawSprite) {
      const iw = image.naturalWidth || image.width;
      const ih = image.naturalHeight || image.height;
      const cover = Math.max(w / iw, h / ih);
      const dw = iw * cover;
      const dh = ih * cover;
      ctx.drawSprite(image, 0, 0, iw, ih, (w - dw) / 2, (h - dh) / 2, dw, dh);
    } else {
      ctx.fillRect(0, 0, w, h, '#0b0b12');
    }
    // Dim the image a touch so the prompt stays legible over bright areas.
    ctx.fillRect(0, 0, w, h, 'rgba(6, 6, 12, 0.35)');

    const label = this.ready ? 'Press E to start' : 'Loading...';
    const pulse = 0.55 + 0.45 * Math.sin(this.elapsed * 3);
    const scale = 3;
    const textW = this.context.font ? this.context.font.measure(label, scale) : label.length * 12;
    const x = Math.round((w - textW) / 2);
    const y = h - 48;
    const raw = ctx.getCanvas?.();
    if (raw) {
      raw.save();
      raw.globalAlpha = this.ready ? pulse : 0.7;
      drawText(ctx, this.context.font, label, x, y, '#f5efe0', scale);
      raw.restore();
    }
  }
}
