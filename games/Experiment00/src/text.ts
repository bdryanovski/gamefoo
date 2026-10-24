/**
 * Draws a line of text with the shared pixel font, falling back to the
 * canvas font API when the sheet failed to load.
 */

import type { FontSheet, RenderContext } from '../../../src';

// oxlint-disable-next-line max-params
export const drawText = (
  ctx: RenderContext,
  font: FontSheet | undefined,
  text: string,
  x: number,
  y: number,
  color: string,
  scale = 2,
): void => {
  if (font) {
    font.render(ctx, text, x, y, color, scale);
    return;
  }
  ctx.drawText(text, x, y, color);
};
