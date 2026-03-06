import FontBitmap, { type InternalBitmapFontName } from "../core/fonts/font_bitmap";
import Entity from "./entity";

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
  /** Bitmap font name to load internally */
  protected fontName: string;

  /** BitmapFont instance used to manipulate the font */
  protected font: FontBitmap;

  /** Internal state of the text needed to be update */
  protected text: string = "";

  /**
   * Create new Text object that could be placed and render on the screen
   *
   * @param fontName - the FontBitmap valid name to load
   *
   * @example
   * ```ts
   * const Label = new Text('CustomLabel', '5x5');
   * ```
   */
  constructor(id: string, fontName: InternalBitmapFontName) {
    super(id, 0, 0);

    this.fontName = fontName;

    this.font = new FontBitmap(fontName);
  }

  /**
   * Set internal state value
   *
   * @param text - any content that should be render
   *
   * @return void
   */
  setText(text: string) {
    this.text = text;

    this.setSize(this.font.width * this.text.length, this.font.height);
  }

  /**
   * Get the internal state of the object
   *
   * @return string
   */
  getText(): string {
    return this.text;
  }

  /**
   * Render the text to the canvas using the BitmapFont instance
   */
  override render(ctx: CanvasRenderingContext2D): void {
    this.font.renderText(this.getText(), this.x, this.y, ctx);
  }
}
