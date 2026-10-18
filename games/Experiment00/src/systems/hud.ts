import type { RenderContext, SubSystem, TextFont } from '../../../../src/index';
import type { GameContext } from '../context';
import { drawText } from '../text';

/** A transient on-screen message with a countdown. */
interface Toast {
  text: string;
  remaining: number;
}

/**
 * The HUD: a small toast queue plus the top-left status line. Any system,
 * screen, or behavior can surface story/UI text by calling
 * {@link HudSystem.show} — reached through the shared `GameContext` (`ctx.hud`)
 * instead of the old module-level `hud.ts` singleton.
 *
 * Toasts advance only while the world is live (`flow.worldActive`), so a
 * message raised just before a modal opens freezes with it and resumes after.
 * The newest un-expired toast is what renders.
 */
export class HudSystem implements SubSystem {
  readonly id = 'hud';
  readonly order = 80; // splash(89)/dialog(85)/lock(87) cover it

  private readonly toasts: Toast[] = [];
  private font: TextFont | null = null;
  private fontScale = 1;

  constructor(
    private readonly ctx: GameContext,
    private readonly label?: () => string,
  ) {}

  /** Installs the bitmap font every toast is drawn with. */
  useFont(font: TextFont, scale = 1): void {
    this.font = font;
    this.fontScale = scale;
  }

  /** Queues a message shown for `seconds`. */
  show(text: string, seconds = 2): void {
    this.toasts.push({ text, remaining: seconds });
  }

  /** Drops every queued message. */
  clear(): void {
    this.toasts.length = 0;
  }

  update(deltaTime: number): void {
    if (!this.ctx.flow?.worldActive) return;
    for (const toast of this.toasts) {
      toast.remaining -= deltaTime;
    }
    while (this.toasts.length > 0 && (this.toasts[0]?.remaining ?? 0) <= 0) {
      this.toasts.shift();
    }
  }

  render(ctx: RenderContext): void {
    if (this.ctx.flow?.has('splash')) return; // the title card covers everything
    if (this.label) {
      drawText(ctx, this.ctx.font, this.label(), 8, 20, '#ffffff');
    }
    const toast = this.toasts[this.toasts.length - 1];
    if (!toast) {
      return;
    }
    if (this.font) {
      this.font.render(ctx, toast.text, 8, 40, '#ffe9a8', this.fontScale);
      return;
    }
    ctx.drawText(toast.text, 8, 40, '#ffe9a8');
  }
}
