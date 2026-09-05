import type { RenderContext } from '../renderer/type';
import type { DialogRunner } from './dialog_runner';

/**
 * Colours for a {@link DialogBox}. All optional — omitted entries fall back to
 * the retro default palette.
 */
export interface DialogBoxTheme {
  /** Panel fill. */
  panel?: string;
  /** Panel border. */
  border?: string;
  /** Body (typewriter) text. */
  text?: string;
  /** Title / metadata caption. */
  title?: string;
  /** Idle option label. */
  option?: string;
  /** Highlighted option label. */
  optionActive?: string;
  /** Prompt hint text. */
  hint?: string;
}

/**
 * Sizing/behaviour for a {@link DialogBox}.
 */
export interface DialogBoxConfig {
  theme?: DialogBoxTheme;
  /** Text height in logical pixels. @defaultValue `16` */
  fontSize?: number;
  /**
   * Minimum panel height as a fraction of the surface height — the panel is
   * never shorter than this. @defaultValue `0.24`
   */
  minHeightRatio?: number;
  /**
   * Maximum panel height as a fraction of the surface height — the panel
   * grows to fit its content up to this cap. @defaultValue `0.7`
   */
  maxHeightRatio?: number;
  /** Slide-in/out speed (fraction per second). @defaultValue `6` */
  slideSpeed?: number;
}

const DEFAULT_THEME: Required<DialogBoxTheme> = {
  panel: '#12121c',
  border: '#e8e8f0',
  text: '#e8e8f0',
  title: '#8a8ab0',
  option: '#c8c8d8',
  optionActive: '#ffe066',
  hint: '#8a8ab0',
};

const easeOut = (t: number): number => 1 - (1 - t) * (1 - t);

/**
 * A retro dialog box that slides up from the bottom of the surface, renders a
 * {@link DialogRunner}'s current segment with a typewriter caret, and lists
 * the selectable options. Pure view: it reads runner state and draws — the
 * game owns input and timing.
 *
 * Draw it last (in screen space, after the world) so it sits on top:
 * ```ts
 * dialogBox.update(dt, runner.active);
 * dialogBox.render(ctx, runner);
 * ```
 *
 * @category Dialog
 * @since 0.5.0
 */
export class DialogBox {
  private readonly theme: Required<DialogBoxTheme>;
  private readonly fontSize: number;
  private readonly minHeightRatio: number;
  private readonly maxHeightRatio: number;
  private readonly slideSpeed: number;

  /** 0 = fully hidden, 1 = fully shown. Eased for the slide animation. */
  private reveal = 0;
  /** Blink phase for the "continue" caret. */
  private blink = 0;

  constructor(config: DialogBoxConfig = {}) {
    this.theme = { ...DEFAULT_THEME, ...config.theme };
    this.fontSize = config.fontSize ?? 16;
    this.minHeightRatio = config.minHeightRatio ?? 0.24;
    this.maxHeightRatio = config.maxHeightRatio ?? 0.7;
    this.slideSpeed = config.slideSpeed ?? 6;
  }

  /** Advance the slide animation toward shown/hidden and the caret blink. */
  update(dt: number, active: boolean): void {
    const target = active ? 1 : 0;
    const step = this.slideSpeed * dt;
    if (this.reveal < target) this.reveal = Math.min(target, this.reveal + step);
    else if (this.reveal > target) this.reveal = Math.max(target, this.reveal - step);
    this.blink = (this.blink + dt) % 1;
  }

  /** Draws nothing while fully hidden and the runner is closed. */
  render(ctx: RenderContext, runner: DialogRunner): void {
    if (this.reveal <= 0.001 && !runner.active) return;

    const surfaceW = ctx.width;
    const surfaceH = ctx.height;
    const margin = Math.round(surfaceW * 0.04);
    const panelW = surfaceW - margin * 2;
    const x = margin;

    const raw = ctx.getCanvas?.();
    if (raw) {
      raw.save();
      raw.font = `${this.fontSize}px monospace`;
      raw.textBaseline = 'top';
    }
    const measure = (s: string): number =>
      raw ? raw.measureText(s).width : s.length * this.fontSize * 0.6;

    const pad = Math.round(this.fontSize * 0.75);
    const innerX = x + pad;
    const innerW = panelW - pad * 2;
    const lineH = Math.round(this.fontSize * 1.25);
    const captionH = Math.round(this.fontSize * 1.35);
    const gap = Math.round(this.fontSize * 0.5);

    // Measure content from the FULL text (stable height while the typewriter
    // runs) so the panel grows to fit body + every option and never clips.
    const caption = this.caption(runner);
    const wrapped = runner.fullText ? wrapText(runner.fullText, innerW, measure) : '';
    const bodyLineCount = wrapped ? wrapped.split('\n').length : 0;
    const choosing = runner.phase === 'choosing';
    const footerLineCount = choosing ? runner.choices.length : 1;

    const bodyH = bodyLineCount * lineH;
    const contentH =
      (caption ? captionH : 0) + bodyH + (bodyH > 0 ? gap : 0) + footerLineCount * lineH;
    const minH = Math.round(surfaceH * this.minHeightRatio);
    const maxH = Math.min(surfaceH - margin * 2, Math.round(surfaceH * this.maxHeightRatio));
    const panelH = Math.max(minH, Math.min(maxH, contentH + pad * 2));

    const shownY = surfaceH - panelH - margin;
    const y = Math.round(surfaceH - (surfaceH - shownY) * easeOut(this.reveal));

    // Panel + border.
    ctx.fillRect(x, y, panelW, panelH, this.theme.panel);
    ctx.strokeRect(x, y, panelW, panelH, this.theme.border);

    // Caption + typewriter body, flowing from the top.
    let cursorY = y + pad;
    if (caption) {
      ctx.drawText(caption, innerX, cursorY, this.theme.title);
      cursorY += captionH;
    }
    if (runner.fullText) {
      const shownChars = Math.min(runner.revealedCount, wrapped.length);
      for (const line of wrapped.slice(0, shownChars).split('\n')) {
        ctx.drawText(line, innerX, cursorY, this.theme.text);
        cursorY += lineH;
      }
    }

    // Footer anchored to the bottom: options while choosing, else a caret.
    const footerTop = y + panelH - pad - footerLineCount * lineH;
    if (choosing) {
      const choices = runner.choices;
      for (let i = 0; i < choices.length; i++) {
        const selected = i === runner.selectedIndex;
        const label = `${selected ? '\u25B6 ' : '  '}${choices[i]!.label}`;
        ctx.drawText(
          label,
          innerX,
          footerTop + i * lineH,
          selected ? this.theme.optionActive : this.theme.option,
        );
      }
    } else if (this.blink < 0.6) {
      const hint = runner.phase === 'typing' ? '\u25B6 skip (E)' : '\u25BC more (E)';
      ctx.drawText(hint, x + panelW - pad - measure(hint), footerTop, this.theme.hint);
    }

    if (raw) raw.restore();
  }

  private caption(runner: DialogRunner): string {
    const portrait = runner.meta.portrait;
    if (portrait) return runner.title ? `${portrait} — ${runner.title}` : portrait;
    return runner.title;
  }
}

/**
 * Greedy word-wrap: returns the text with the space at each break replaced by
 * a newline, so `slice`-based typewriter reveal never reflows. Character count
 * is preserved (one space → one newline).
 */
function wrapText(text: string, maxWidth: number, measure: (s: string) => number): string {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const trial = line ? `${line} ${word}` : word;
    if (line && measure(trial) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = trial;
    }
  }
  if (line) lines.push(line);
  return lines.join('\n');
}
