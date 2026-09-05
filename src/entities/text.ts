import FontBitmap, { type InternalBitmapFontName } from '../core/fonts/font_bitmap';
import type { RenderContext } from '../core/renderer/type';
import Entity from './entity';

/**
 * Abstract base class for Text and Label alike objects
 *
 * `Text` extends {@link Entity} and could also get all behaviors attach to it but
 * most likely there will be no need for that. Its primary design use case is to
 * keep track of text objects and interact with them
 *
 * @category Entities
 * @since 0.2.0
 *
 * @see {@link Entity} - parent class
 */
export default abstract class Text extends Entity {
  /**
   * Bitmap font name to load internally
   */
  protected fontName: string;

  /**
   * BitmapFont instance used to manipulate the font
   */
  protected font: FontBitmap;

  /**
   * Internal state of the text needed to be update
   */
  protected text: string = '';

  /**
   * Text color (optional)
   *
   * @since 0.4.0
   */
  protected color?: string = '#FFFFFF';

  /**
   * Create new Text object that could be placed and render on the screen
   *
   * @param fontName - the FontBitmap valid name to load
   * @param color - text color (optional)
   *
   * @example
   * ```ts
   * const Label = new Text('CustomLabel', '5x5');
   * ```
   */
  constructor(id: string, fontName: InternalBitmapFontName, color?: string) {
    super(id, 0, 0);

    this.fontName = fontName;

    this.font = new FontBitmap(fontName);

    if (color) {
      this.color = color;
    }
  }

  /**
   * Set internal state value
   *
   * @param text - any content that should be render
   *
   * @return void
   */
  public setText(text: string) {
    this.text = text;

    this.setSize(this.font.width * this.text.length, this.font.height);
  }

  /**
   * Get the internal state of the object
   *
   * @return string
   */
  public getText(): string {
    return this.text;
  }

  /**
   * Render the text using the BitmapFont instance.
   * On canvas: uses Path2D glyph rendering.
   */
  public override render(ctx: RenderContext): void {
    // Set fill colour for canvas path rendering
    const raw = ctx.getCanvas?.();
    if (this.color && raw) {
      raw.fillStyle = this.color;
    }
    this.font.renderText(this.getText(), this.x, this.y, ctx);
  }
}
