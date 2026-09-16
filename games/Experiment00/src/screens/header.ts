import type { RenderContext } from '../../../../src/index';
import { RoomScreen } from './room';

/**
 * ASCII pixel-art banner, one string per row. `▓` is a lit cell; any other
 * character (space) is empty. Leading spaces are significant — they keep the
 * glyphs aligned — so the art is stored verbatim and rendered cell-for-cell.
 */
const ART: readonly string[] = [
  '▓▓▓▓▓▓▓▓    ▓▓      ▓▓  ▓▓      ▓▓    ▓▓▓▓▓▓    ▓▓▓▓▓▓▓▓▓▓    ▓▓▓▓▓▓    ▓▓      ▓▓  ',
  '▓▓▓▓▓▓▓▓    ▓▓      ▓▓  ▓▓      ▓▓    ▓▓▓▓▓▓    ▓▓▓▓▓▓▓▓▓▓    ▓▓▓▓▓▓    ▓▓      ▓▓  ',
  '▓▓      ▓▓  ▓▓      ▓▓  ▓▓▓▓    ▓▓  ▓▓          ▓▓          ▓▓      ▓▓  ▓▓▓▓    ▓▓  ',
  '▓▓      ▓▓  ▓▓      ▓▓  ▓▓▓▓    ▓▓  ▓▓          ▓▓          ▓▓      ▓▓  ▓▓▓▓    ▓▓  ',
  '▓▓      ▓▓  ▓▓      ▓▓  ▓▓  ▓▓  ▓▓  ▓▓    ▓▓▓▓  ▓▓▓▓▓▓▓▓    ▓▓      ▓▓  ▓▓  ▓▓  ▓▓  ',
  '▓▓      ▓▓  ▓▓      ▓▓  ▓▓  ▓▓  ▓▓  ▓▓    ▓▓▓▓  ▓▓▓▓▓▓▓▓    ▓▓      ▓▓  ▓▓  ▓▓  ▓▓  ',
  '▓▓      ▓▓  ▓▓      ▓▓  ▓▓    ▓▓▓▓  ▓▓      ▓▓  ▓▓          ▓▓      ▓▓  ▓▓    ▓▓▓▓  ',
  '▓▓      ▓▓  ▓▓      ▓▓  ▓▓    ▓▓▓▓  ▓▓      ▓▓  ▓▓          ▓▓      ▓▓  ▓▓    ▓▓▓▓  ',
  '▓▓▓▓▓▓▓▓      ▓▓▓▓▓▓    ▓▓      ▓▓    ▓▓▓▓▓▓    ▓▓▓▓▓▓▓▓▓▓    ▓▓▓▓▓▓    ▓▓      ▓▓  ',
  '▓▓▓▓▓▓▓▓      ▓▓▓▓▓▓    ▓▓      ▓▓    ▓▓▓▓▓▓    ▓▓▓▓▓▓▓▓▓▓    ▓▓▓▓▓▓    ▓▓      ▓▓  ',
];

/** Character that marks a lit cell in {@link ART}. */
const LIT = '▓';

/**
 * The `(0, 0)` screen with a pixel-art banner drawn on top of the room.
 *
 * Bind it with `screens.register(0, 0, HeaderScreen)`. The banner is painted in
 * {@link Screen.onRender} — after the room's layers — as a grid of filled cells,
 * so it reads as crisp pixel art rather than a font glyph.
 *
 * Position and appearance are plain public fields, mutable at runtime: grab the
 * live screen and set {@link HeaderScreen.headerX}/{@link HeaderScreen.headerY}
 * to move it, or {@link HeaderScreen.cellWidth}/{@link HeaderScreen.cellHeight}
 * and {@link HeaderScreen.color} to restyle it.
 *
 * @example Nudge the banner down at runtime
 * ```ts
 * const header = map.screenAt(0, 0) as HeaderScreen;
 * header.headerY = 24;
 * ```
 */
export class HeaderScreen extends RoomScreen {
  /** Left edge of the banner, in screen pixels. */
  headerX = 40;
  /** Top edge of the banner, in screen pixels. */
  headerY = 30;
  /** Width of one art cell, in screen pixels. */
  cellWidth = 3;
  /** Height of one art cell, in screen pixels. */
  cellHeight = 5;
  /** Fill colour of the lit cells. */
  color = '#ffd75f';

  protected override onRender(ctx: RenderContext): void {
    super.onRender(ctx);
    for (let row = 0; row < ART.length; row += 1) {
      const line = ART[row];
      const y = this.headerY + row * this.cellHeight;
      for (let col = 0; col < line.length; col += 1) {
        if (line[col] !== LIT) {
          continue;
        }
        const x = this.headerX + col * this.cellWidth;
        ctx.fillRect(x, y, this.cellWidth, this.cellHeight, this.color);
      }
    }
  }
}
