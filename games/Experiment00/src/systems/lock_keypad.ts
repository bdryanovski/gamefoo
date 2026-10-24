import type { Frame, RenderContext, SubSystem } from '../../../../src';
import type { DeltaTime } from '../../../../src/generic_types';
import type { GameContext } from '../context';
import { GAME_ACTION } from '../config/controls';
import type { Portal } from '../objects/portal';
import { drawText } from '../text';

interface LockUI {
  portal: Portal;
  digits: number[];
  cursor: number;
}

export class LockKeypadSystem implements SubSystem {
  readonly id = 'lock';
  readonly order = 87;

  private ui?: LockUI;
  private numberFrames: Array<Frame | undefined> = [];

  constructor(private readonly context: GameContext) {}

  get open(): boolean {
    return this.ui !== undefined;
  }

  useNumberFrames(frames: Array<Frame | undefined>): void {
    this.numberFrames = frames;
  }

  openFor(portal: Portal): void {
    this.context.input.consume(GAME_ACTION.interact);
    this.ui = { portal, digits: [0, 0, 0, 0], cursor: 0 };
    this.context.flow?.push('lock');
    this.context.telemetry.keypadOpen(portal.id);
  }

  close(): void {
    if (!this.ui) {
      return;
    }
    this.ui = undefined;
    this.context.flow?.pop('lock');
  }

  update(_dt: DeltaTime): void {
    if (!this.ui) {
      return;
    }

    const input = this.context.input;
    if (input.isActionPressed(GAME_ACTION.up)) {
      this.spin(1);
    } else if (input.isActionPressed(GAME_ACTION.down)) {
      this.spin(-1);
    } else if (input.isActionPressed(GAME_ACTION.left)) {
      this.moveCursor(-1);
    } else if (input.isActionPressed(GAME_ACTION.right)) {
      this.moveCursor(1);
    } else if (
      input.isActionPressed(GAME_ACTION.inventory) ||
      input.isActionPressed(GAME_ACTION.interact)
    ) {
      this.context.telemetry.keypadDismissed(this.ui.portal.id);
      this.close();
    }
  }

  private moveCursor(delta: number): void {
    if (!this.ui) {
      return;
    }

    this.ui.cursor = (this.ui.cursor + delta + 4) % 4;
  }

  private spin(delta: number): void {
    if (!this.ui) return;
    this.ui.digits[this.ui.cursor] = (this.ui.digits[this.ui.cursor]! + delta + 10) % 10;
    if (this.ui.portal.matches(this.ui.digits.join(''))) {
      this.ui.portal.unlock();
      this.context.telemetry.keypadUnlocked(this.ui.portal.id);
      this.context.audio?.playSound('chest_open', { volume: 0.6 });
      this.context.hud?.show('Unlocked', 1.4);
      this.close();
    }
  }

  render(ctx: RenderContext): void {
    const ui = this.ui;
    if (!ui) return;
    const w = ctx.width;
    const h = ctx.height;
    ctx.fillRect(0, 0, w, h, 'rgba(6, 6, 12, 0.72)');
    const box = Math.round(h * 0.16);
    const gap = Math.round(box * 0.3);
    const totalW = 4 * box + 3 * gap;
    const startX = Math.round((w - totalW) / 2);
    const y = Math.round((h - box) / 2);
    drawText(ctx, this.context.font, 'ENTER CODE', startX, y - Math.round(box * 0.5), '#e8e8ff');
    for (let i = 0; i < 4; i++) {
      const x = startX + i * (box + gap);
      const active = i === ui.cursor;
      ctx.fillRect(x, y, box, box, active ? '#22243a' : '#14141f');
      ctx.strokeRect(x, y, box, box, active ? '#ffd66e' : '#3a3a55');
      const frame = this.numberFrames[ui.digits[i]!];
      if (frame && ctx.drawSprite) {
        const s = Math.round(box * 0.7);
        const dx = x + Math.round((box - s) / 2);
        const dy = y + Math.round((box - s) / 2);
        ctx.drawSprite(frame.image, frame.sx, frame.sy, frame.sw, frame.sh, dx, dy, s, s);
      }
      if (active) {
        drawText(ctx, this.context.font, '\u25B2', x + Math.round(box / 2) - 6, y - 20, '#ffd66e');
        drawText(
          ctx,
          this.context.font,
          '\u25BC',
          x + Math.round(box / 2) - 6,
          y + box + 4,
          '#ffd66e',
        );
      }
    }
    drawText(
      ctx,
      this.context.font,
      '\u25B2\u25BC change   \u25C4\u25BA move   E / Esc close',
      startX,
      y + box + Math.round(box * 0.55),
      '#9a9ac0',
    );
  }
}
