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
 * Panel geometry for one frame, measured before anything is drawn.
 *
 * Body height is measured from the FULL text (not the typewriter-revealed
 * prefix) so the panel keeps a stable height while the text types in and never
 * clips the body or the options.
 */
interface DialogLayout {
  /** Raw canvas, or `null` when rendering without one. */
  raw: CanvasRenderingContext2D | null;
  /** Panel left edge. */
  x: number;
  /** Panel top edge, eased by the slide-in animation. */
  y: number;
  /** Panel width. */
  panelW: number;
  /** Panel height. */
  panelH: number;
  /** Left edge of the content column, inside the panel padding. */
  innerX: number;
  /** Panel padding. */
  pad: number;
  /** Height of one text line. */
  lineH: number;
  /** Height of the caption line. */
  captionH: number;
  /** Caption text, or `''` when the segment has none. */
  caption: string;
  /** Body text, pre-wrapped to the content width. */
  wrapped: string;
  /** Whether the runner is waiting on an option choice. */
  choosing: boolean;
  /** Number of footer lines to reserve (options, or a single caret). */
  footerLineCount: number;
}

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
    if (this.reveal < target) {
      this.reveal = Math.min(target, this.reveal + step);
    } else if (this.reveal > target) {
      this.reveal = Math.max(target, this.reveal - step);
    }
    this.blink = (this.blink + dt) % 1;
  }

  /** Draws nothing while fully hidden and the runner is closed. */
  render(ctx: RenderContext, runner: DialogRunner): void {
    if (this.reveal <= 0.001 && !runner.active) {
      return;
    }

    const raw = ctx.getCanvas?.() ?? null;
    if (raw) {
      raw.save();
      raw.font = `${this.fontSize}px monospace`;
      raw.textBaseline = 'top';
    }
    // Laid out after the font is set, so `measureText` measures in the panel's
    // own font and the wrap width matches what is drawn.
    const layout = this.layout(ctx, runner, raw);

    this.drawPanel(ctx, layout);
    this.drawBody(ctx, layout, runner);
    this.drawFooter(ctx, layout, runner);

    if (raw) {
      raw.restore();
    }
  }

  /** Font-derived spacing, shared by the layout and the drawing passes. */
  private metrics(): { pad: number; lineH: number; captionH: number; gap: number } {
    return {
      pad: Math.round(this.fontSize * 0.75),
      lineH: Math.round(this.fontSize * 1.25),
      captionH: Math.round(this.fontSize * 1.35),
      gap: Math.round(this.fontSize * 0.5),
    };
  }

  /** Width of `s` in the panel font, estimated when there is no canvas. */
  private measureText(raw: CanvasRenderingContext2D | null, s: string): number {
    return raw ? raw.measureText(s).width : s.length * this.fontSize * 0.6;
  }

  /** Panel height for `contentWithPadding`, clamped to the configured ratios. */
  private panelHeight(surfaceH: number, margin: number, contentWithPadding: number): number {
    const minH = Math.round(surfaceH * this.minHeightRatio);
    const maxH = Math.min(surfaceH - margin * 2, Math.round(surfaceH * this.maxHeightRatio));
    return Math.max(minH, Math.min(maxH, contentWithPadding));
  }

  /** Measures the panel for this frame. Pure — draws nothing. */
  private layout(
    ctx: RenderContext,
    runner: DialogRunner,
    raw: CanvasRenderingContext2D | null,
  ): DialogLayout {
    const { pad, lineH, captionH, gap } = this.metrics();
    const measure = (s: string): number => this.measureText(raw, s);
    const surfaceH = ctx.height;
    const margin = Math.round(ctx.width * 0.04);
    const panelW = ctx.width - margin * 2;
    const x = margin;
    const innerX = x + pad;
    const innerW = panelW - pad * 2;

    const caption = this.caption(runner);
    const wrapped = runner.fullText ? wrapText(runner.fullText, innerW, measure) : '';
    // Measured from the full text, so the panel height stays stable while the
    // typewriter reveals it.
    const bodyH = (wrapped ? wrapped.split('\n').length : 0) * lineH;
    const choosing = runner.phase === 'choosing';
    const footerLineCount = choosing ? runner.choices.length : 1;
    const contentH =
      (caption ? captionH : 0) + bodyH + (bodyH > 0 ? gap : 0) + footerLineCount * lineH;
    const panelH = this.panelHeight(surfaceH, margin, contentH + pad * 2);
    const shownY = surfaceH - panelH - margin;
    const y = Math.round(surfaceH - (surfaceH - shownY) * easeOut(this.reveal));

    return {
      raw,
      x,
      y,
      panelW,
      panelH,
      innerX,
      pad,
      lineH,
      captionH,
      caption,
      wrapped,
      choosing,
      footerLineCount,
    };
  }

  /** Fills the panel and strokes its border. */
  private drawPanel(ctx: RenderContext, l: DialogLayout): void {
    ctx.fillRect(l.x, l.y, l.panelW, l.panelH, this.theme.panel);
    ctx.strokeRect(l.x, l.y, l.panelW, l.panelH, this.theme.border);
  }

  /** Draws the caption and typewriter body, flowing from the top. */
  private drawBody(ctx: RenderContext, l: DialogLayout, runner: DialogRunner): void {
    let cursorY = l.y + l.pad;
    if (l.caption) {
      ctx.drawText(l.caption, l.innerX, cursorY, this.theme.title);
      cursorY += l.captionH;
    }
    if (runner.fullText) {
      const shownChars = Math.min(runner.revealedCount, l.wrapped.length);
      for (const line of l.wrapped.slice(0, shownChars).split('\n')) {
        ctx.drawText(line, l.innerX, cursorY, this.theme.text);
        cursorY += l.lineH;
      }
    }
  }

  /** Footer anchored to the panel bottom: the options, or a blinking hint. */
  private drawFooter(ctx: RenderContext, l: DialogLayout, runner: DialogRunner): void {
    const footerTop = l.y + l.panelH - l.pad - l.footerLineCount * l.lineH;
    if (!l.choosing) {
      if (this.blink >= 0.6) {
        return;
      }
      const hint = runner.phase === 'typing' ? '\u25B6 skip (E)' : '\u25BC more (E)';
      ctx.drawText(
        hint,
        l.x + l.panelW - l.pad - this.measureText(l.raw, hint),
        footerTop,
        this.theme.hint,
      );
      return;
    }
    const choices = runner.choices;
    for (let i = 0; i < choices.length; i++) {
      const selected = i === runner.selectedIndex;
      const label = `${selected ? '\u25B6 ' : '  '}${choices[i]!.label}`;
      ctx.drawText(
        label,
        l.innerX,
        footerTop + i * l.lineH,
        selected ? this.theme.optionActive : this.theme.option,
      );
    }
  }

  private caption(runner: DialogRunner): string {
    const portrait = runner.meta.portrait;
    if (portrait) {
      return runner.title ? `${portrait} — ${runner.title}` : portrait;
    }
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
  if (line) {
    lines.push(line);
  }
  return lines.join('\n');
}
