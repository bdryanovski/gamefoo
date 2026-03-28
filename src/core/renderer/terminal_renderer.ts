import type { RenderContext } from './type';
import * as ansi from './utils/ansi';

/**
 * Configuration for {@link TerminalRenderContext}.
 *
 * @since 0.4.0
 */
export interface TerminalRenderConfig {
  /**
   * Number of character columns (terminal width).
   *
   * Read from `process.stdout.columns` or specify explicitly.
   *
   * @since 0.4.0
   */
  cols: number;

  /**
   * Number of character rows (terminal height).
   *
   * Read from `process.stdout.rows` or specify explicitly.
   *
   * @since 0.4.0
   */
  rows: number;

  /**
   * Number of game-world pixels per character column.
   *
   * Used to map floating-point game coordinates to integer cell
   * indices: `col = floor(worldX / cellWidth)`.
   *
   * @defaultValue `8`
   * @since 0.4.0
   */
  cellWidth?: number;

  /**
   * Number of game-world pixels per character row.
   *
   * Terminal characters are typically about 2× taller than wide, so set
   * `cellHeight = cellWidth * 2` to preserve visual aspect ratio.
   *
   * @defaultValue `8`
   * @since 0.4.0
   */
  cellHeight?: number;

  /**
   * Default background colour for blank cells (hex string).
   *
   * @defaultValue `"#000000"`
   * @since 0.4.0
   */
  defaultBg?: string;

  /**
   * Default foreground colour for text (hex string).
   *
   * @defaultValue `"#ffffff"`
   * @since 0.4.0
   */
  defaultFg?: string;
}

/** @internal */
interface Cell {
  char: string;
  fg: string;
  bg: string;
}

/**
 * ANSI / TTY terminal {@link RenderContext} implementation for Bun / Node.
 *
 * `TerminalRenderContext` writes ANSI truecolour escape codes to
 * `process.stdout`, turning the terminal into a character-cell game
 * display. It uses **double buffering** and a **dirty-cell diff** so that
 * only cells that changed since the last frame are written to stdout,
 * minimising flicker and write volume.
 *
 * ---
 *
 * ### Coordinate mapping
 *
 * Game-world coordinates (floating-point pixels) are mapped to integer
 * character cells via:
 *
 * ```
 * col = floor((worldX + offsetX) / cellWidth)
 * row = floor((worldY + offsetY) / cellHeight)
 * ```
 *
 * Typical values for an 80×24 terminal with `cellWidth = 8`:
 * - Logical width: `80 × 8 = 640` game pixels
 * - Logical height: `24 × 16 = 384` game pixels (with `cellHeight = 16`)
 *
 * ### Sprite rendering
 *
 * `drawSprite` is a **no-op** — sprites cannot be rendered in a character
 * cell terminal. Use the {@link TerminalRender} behaviour instead to give
 * entities a character-based visual representation.
 *
 * ### Screen lifecycle
 *
 * On construction the renderer switches to the **alternate screen buffer**
 * (`ESC[?1049h`) and hides the cursor. Call {@link TerminalRenderContext.destroy}
 * on exit to restore the normal screen and cursor.
 *
 * @since 0.4.0
 *
 * @example Basic terminal game setup
 * ```ts
 * import { Engine, IntervalLoopDriver, TerminalRenderContext } from "gamefoo";
 *
 * const renderer = new TerminalRenderContext({
 *   cols: process.stdout.columns ?? 80,
 *   rows: process.stdout.rows    ?? 24,
 *   cellWidth:  8,
 *   cellHeight: 16,
 * });
 *
 * const engine = new Engine(renderer, {
 *   backgroundColor: "#000000",
 *   loopDriver: new IntervalLoopDriver(30),
 * });
 *
 * engine.setup();
 *
 * // Restore terminal on exit:
 * process.on("exit", () => renderer.destroy());
 * ```
 *
 * @example Reacting to terminal resize
 * ```ts
 * process.stdout.on("resize", () => {
 *   const cols = process.stdout.columns ?? 80;
 *   const rows = process.stdout.rows    ?? 24;
 *   renderer.resize(cols, rows);
 *   engine.resize(renderer.width, renderer.height);
 * });
 * ```
 *
 * @see {@link RenderContext}   — the interface this class implements
 * @see {@link WebRenderer}     — canvas alternative for browsers
 * @see {@link TerminalRender}  — behaviour for character-based entity visuals
 */
export class TerminalRenderContext implements RenderContext {
  /**
   * Logical width in game-world units (`cols × cellWidth`).
   *
   * @since 0.4.0
   */
  readonly width: number;

  /**
   * Logical height in game-world units (`rows × cellHeight`).
   *
   * @since 0.4.0
   */
  readonly height: number;

  private cols: number;
  private rows: number;
  private cellWidth: number;
  private cellHeight: number;
  private defaultBg: string;
  private defaultFg: string;

  /** The back buffer — drawn into each frame. */
  private buffer: Cell[][];

  /** The front buffer — reflects what was last written to stdout. */
  private prevBuffer: Cell[][];

  // Transform stack (translate only — scale is not supported in terminal mode)
  private transformStack: Array<{ tx: number; ty: number }> = [];
  private tx = 0;
  private ty = 0;

  /**
   * Creates a new `TerminalRenderContext` and initialises the TTY.
   *
   * Side effects on construction:
   * - Switches to the alternate screen buffer (`ESC[?1049h`).
   * - Hides the cursor.
   * - Clears the screen.
   *
   * @param config - Terminal dimensions and coordinate-mapping options.
   *
   * @since 0.4.0
   */
  constructor(config: TerminalRenderConfig) {
    this.cols = config.cols;
    this.rows = config.rows;
    this.cellWidth = config.cellWidth ?? 8;
    this.cellHeight = config.cellHeight ?? 8;
    this.defaultBg = config.defaultBg ?? '#000000';
    this.defaultFg = config.defaultFg ?? '#ffffff';
    this.width = this.cols * this.cellWidth;
    this.height = this.rows * this.cellHeight;

    const defaultBg = this.defaultBg;
    const defaultFg = this.defaultFg;
    const empty = (): Cell => ({ char: ' ', fg: defaultFg, bg: defaultBg });

    this.buffer = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, empty),
    );
    this.prevBuffer = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, empty),
    );

    // Switch to alternate screen, hide cursor, clear.
    process.stdout.write(`${ansi.ESC}[?1049h`);
    process.stdout.write(ansi.hideCursor());
    process.stdout.write(ansi.clearScreen());
  }

  // ── Transform Stack ──────────────────────────────────────────────────────

  /**
   * Pushes the current translation onto the transform stack.
   *
   * @since 0.4.0
   */
  save() {
    this.transformStack.push({ tx: this.tx, ty: this.ty });
  }

  /**
   * Pops and restores the most recently saved translation.
   *
   * @since 0.4.0
   */
  restore() {
    const t = this.transformStack.pop();
    if (t) {
      this.tx = t.tx;
      this.ty = t.ty;
    }
  }

  /**
   * Adds `(x, y)` to the current translation offset.
   *
   * All subsequent world coordinates are shifted by this offset before
   * being converted to cell indices.
   *
   * @param x - Horizontal offset in game-world units.
   * @param y - Vertical offset in game-world units.
   *
   * @since 0.4.0
   */
  translate(x: number, y: number) {
    this.tx += x;
    this.ty += y;
  }

  /**
   * No-op in terminal mode — character cells cannot scale arbitrarily.
   *
   * @since 0.4.0
   */
  scale(_x: number, _y: number) {
    // Terminal cells cannot scale; future versions may map zoom to cell density.
  }

  // ── Buffer Operations ────────────────────────────────────────────────────

  /**
   * Converts game-world coordinates to terminal cell indices, applying
   * the current translation offset.
   *
   * @param x - World X.
   * @param y - World Y.
   * @returns `[col, row]` integer cell indices.
   *
   * @internal
   */
  private worldToCell(x: number, y: number): [col: number, row: number] {
    const col = Math.floor((x + this.tx) / this.cellWidth);
    const row = Math.floor((y + this.ty) / this.cellHeight);
    return [col, row];
  }

  /**
   * Writes a character to the back buffer at `(col, row)`.
   *
   * Out-of-bounds writes are silently discarded.
   *
   * @internal
   */
  private setCell(
    col: number,
    row: number,
    char: string,
    fg: string,
    bg: string,
  ) {
    if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) return;
    const cell = this.buffer[row]?.[col];
    if (!cell) return;
    cell.char = char;
    cell.fg = fg;
    cell.bg = bg;
  }

  // ── RenderContext API ─────────────────────────────────────────────────────

  /**
   * Fills the entire back buffer with blank cells using `color` as the
   * background.
   *
   * The actual TTY is not written until {@link TerminalRenderContext.flush}.
   *
   * @param color - Background colour (hex string). Defaults to `defaultBg`.
   *
   * @since 0.4.0
   */
  clear(color = this.defaultBg) {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.buffer[r]?.[c];
        if (cell) {
          cell.char = ' ';
          cell.fg = this.defaultFg;
          cell.bg = color;
        }
      }
    }
  }

  /**
   * Fills a rectangular region of cells with `color`.
   *
   * The region is defined in game-world coordinates and converted to
   * cell indices automatically.
   *
   * @param x     - Left edge in game-world units.
   * @param y     - Top edge in game-world units.
   * @param w     - Width in game-world units.
   * @param h     - Height in game-world units.
   * @param color - Fill colour (hex string).
   *
   * @since 0.4.0
   */
  fillRect(x: number, y: number, w: number, h: number, color: string) {
    const [col0, row0] = this.worldToCell(x, y);
    const [col1, row1] = this.worldToCell(x + w, y + h);
    for (let r = row0; r <= row1; r++) {
      for (let c = col0; c <= col1; c++) {
        this.setCell(c, r, ' ', color, color);
      }
    }
  }

  /**
   * Draws a box outline using Unicode box-drawing characters
   * (`─`, `│`, `┌`, `┐`, `└`, `┘`).
   *
   * @param x     - Left edge in game-world units.
   * @param y     - Top edge in game-world units.
   * @param w     - Width in game-world units.
   * @param h     - Height in game-world units.
   * @param color - Foreground colour for the border characters.
   *
   * @since 0.4.0
   */
  strokeRect(x: number, y: number, w: number, h: number, color: string) {
    const [col0, row0] = this.worldToCell(x, y);
    const [col1, row1] = this.worldToCell(x + w, y + h);
    for (let c = col0; c <= col1; c++) {
      this.setCell(c, row0, '─', color, this.defaultBg);
      this.setCell(c, row1, '─', color, this.defaultBg);
    }
    for (let r = row0; r <= row1; r++) {
      this.setCell(col0, r, '│', color, this.defaultBg);
      this.setCell(col1, r, '│', color, this.defaultBg);
    }
    this.setCell(col0, row0, '┌', color, this.defaultBg);
    this.setCell(col1, row0, '┐', color, this.defaultBg);
    this.setCell(col0, row1, '└', color, this.defaultBg);
    this.setCell(col1, row1, '┘', color, this.defaultBg);
  }

  /**
   * Writes a text string into the cell buffer starting at `(x, y)`.
   *
   * Each character occupies one cell. Characters that overflow the buffer
   * bounds are silently discarded.
   *
   * @param text    - The string to write.
   * @param x       - Left edge in game-world units.
   * @param y       - Top edge in game-world units.
   * @param color   - Foreground colour. Defaults to `defaultFg`.
   * @param bgColor - Background colour. Defaults to `defaultBg`.
   *
   * @since 0.4.0
   */
  drawText(
    text: string,
    x: number,
    y: number,
    color = this.defaultFg,
    bgColor = this.defaultBg,
  ) {
    const [col0, row0] = this.worldToCell(x, y);
    for (let i = 0; i < text.length; i++) {
      this.setCell(col0 + i, row0, text[i] ?? ' ', color, bgColor);
    }
  }

  /**
   * Writes a single character into the cell buffer at `(x, y)`.
   *
   * If `char` is longer than one character, only the first is used.
   *
   * @param char    - A single character (e.g. `"@"`, `"█"`).
   * @param x       - Left edge in game-world units.
   * @param y       - Top edge in game-world units.
   * @param color   - Foreground colour. Defaults to `defaultFg`.
   * @param bgColor - Background colour. Defaults to `defaultBg`.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * ctx.drawChar("@", player.x, player.y, "#00ff00");
   * ```
   */
  drawChar(
    char: string,
    x: number,
    y: number,
    color = this.defaultFg,
    bgColor = this.defaultBg,
  ) {
    const [col, row] = this.worldToCell(x, y);
    this.setCell(col, row, char[0] ?? ' ', color, bgColor);
  }

  /**
   * No-op — sprites cannot be rendered in terminal mode.
   *
   * Attach a {@link TerminalRender} behaviour to entities for
   * character-based visual representations in terminal mode.
   *
   * @since 0.4.0
   */
  drawSprite() {
    // No-op. Use TerminalRender behaviour for terminal visuals.
  }

  /**
   * Draws a line between two world positions using Bresenham's line
   * algorithm.
   *
   * Cells along the line are filled with `"─"` (horizontal), `"│"`
   * (vertical), or `"·"` (diagonal) characters.
   *
   * @param x1    - Start X in game-world units.
   * @param y1    - Start Y in game-world units.
   * @param x2    - End X in game-world units.
   * @param y2    - End Y in game-world units.
   * @param color - Character foreground colour.
   *
   * @since 0.4.0
   */
  drawLine(x1: number, y1: number, x2: number, y2: number, color: string) {
    let [c1, r1] = this.worldToCell(x1, y1);
    const [c2, r2] = this.worldToCell(x2, y2);

    const dc = Math.abs(c2 - c1);
    const dr = Math.abs(r2 - r1);
    const sc = c1 < c2 ? 1 : -1;
    const sr = r1 < r2 ? 1 : -1;
    let err = dc - dr;

    while (true) {
      const char = dc > dr ? '─' : dr > dc ? '│' : '·';
      this.setCell(c1, r1, char, color, this.defaultBg);

      if (c1 === c2 && r1 === r2) break;
      const e2 = 2 * err;
      if (e2 > -dr) {
        err -= dr;
        c1 += sc;
      }
      if (e2 < dc) {
        err += dc;
        r1 += sr;
      }
    }
  }

  /**
   * Draws a circle outline using the midpoint circle algorithm.
   *
   * Cells on the circle are filled with `"o"` characters.
   *
   * @param x       - Centre X in game-world units.
   * @param y       - Centre Y in game-world units.
   * @param radius  - Radius in game-world units (converted to cell radius).
   * @param color   - Character foreground colour.
   * @param _fill   - Ignored in terminal mode (fill not implemented).
   *
   * @since 0.4.0
   */
  drawCircle(
    x: number,
    y: number,
    radius: number,
    color: string,
    _fill = false,
  ) {
    const [cx, cy] = this.worldToCell(x, y);
    const cr = Math.round(radius / this.cellWidth);

    let px = 0;
    let py = cr;
    let d = 1 - cr;

    const plot8 = (px: number, py: number) => {
      this.setCell(cx + px, cy + py, 'o', color, this.defaultBg);
      this.setCell(cx - px, cy + py, 'o', color, this.defaultBg);
      this.setCell(cx + px, cy - py, 'o', color, this.defaultBg);
      this.setCell(cx - px, cy - py, 'o', color, this.defaultBg);
      this.setCell(cx + py, cy + px, 'o', color, this.defaultBg);
      this.setCell(cx - py, cy + px, 'o', color, this.defaultBg);
      this.setCell(cx + py, cy - px, 'o', color, this.defaultBg);
      this.setCell(cx - py, cy - px, 'o', color, this.defaultBg);
    };

    plot8(px, py);
    while (px < py) {
      px++;
      if (d < 0) {
        d += 2 * px + 1;
      } else {
        py--;
        d += 2 * (px - py) + 1;
      }
      plot8(px, py);
    }
  }

  // ── Flush ────────────────────────────────────────────────────────────────

  /**
   * Flushes changed cells to `process.stdout`.
   *
   * Compares the back buffer against the front buffer (previous frame)
   * and writes only cells whose `char`, `fg`, or `bg` changed. This
   * **dirty-cell diff** avoids rewriting unchanged cells each frame,
   * dramatically reducing flicker and stdout write volume.
   *
   * Called automatically by the {@link Engine} at the end of every tick.
   *
   * @since 0.4.0
   */
  flush() {
    const out: string[] = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const curr = this.buffer[r]?.[c];
        const prev = this.prevBuffer[r]?.[c];
        if (!curr || !prev) continue;

        if (
          curr.char === prev.char
          && curr.fg === prev.fg
          && curr.bg === prev.bg
        )
          continue;

        const [fr, fg_c, fb] = ansi.hexToRGB(curr.fg);
        const [br, bg_g, bb] = ansi.hexToRGB(curr.bg);
        out.push(
          ansi.moveTo(r + 1, c + 1),
          ansi.bgRGB(br, bg_g, bb),
          ansi.fgRGB(fr, fg_c, fb),
          curr.char,
          ansi.reset(),
        );
        this.prevBuffer[r]![c] = { ...curr };
      }
    }
    if (out.length > 0) {
      process.stdout.write(out.join(''));
    }
  }

  // ── Resize ───────────────────────────────────────────────────────────────

  /**
   * Reallocates the cell buffers for a new terminal size and forces a
   * full-screen redraw on the next {@link TerminalRenderContext.flush}.
   *
   * Call this in response to `process.stdout.on("resize", ...)`, then
   * also call `engine.resize(renderer.width, renderer.height)` to keep
   * the engine's logical dimensions in sync.
   *
   * @param cols - New column count.
   * @param rows - New row count.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * process.stdout.on("resize", () => {
   *   const cols = process.stdout.columns ?? 80;
   *   const rows = process.stdout.rows    ?? 24;
   *   renderer.resize(cols, rows);
   *   engine.resize(renderer.width, renderer.height);
   * });
   * ```
   */
  resize(cols: number, rows: number): void {
    this.cols = cols;
    this.rows = rows;
    (this as { width: number }).width = cols * this.cellWidth;
    (this as { height: number }).height = rows * this.cellHeight;

    const defaultBg = this.defaultBg;
    const defaultFg = this.defaultFg;
    const empty = (): Cell => ({ char: ' ', fg: defaultFg, bg: defaultBg });

    this.buffer = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, empty),
    );
    this.prevBuffer = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, empty),
    );

    // Force full redraw.
    process.stdout.write(ansi.clearScreen());
  }

  // ── Cleanup ───────────────────────────────────────────────────────────────

  /**
   * Restores the terminal to its normal state.
   *
   * - Shows the cursor.
   * - Exits the alternate screen buffer.
   *
   * Always call this on process exit:
   *
   * ```ts
   * process.on("exit", () => renderer.destroy());
   * process.on("SIGINT", () => { renderer.destroy(); process.exit(); });
   * ```
   *
   * @since 0.4.0
   */
  destroy() {
    process.stdout.write(ansi.showCursor());
    process.stdout.write(`${ansi.ESC}[?1049l`); // restore normal screen
  }
}
