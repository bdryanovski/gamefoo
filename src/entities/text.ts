import FontBitmap from "../core/fonts/font_bitmap";
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
  protected f: FontBitmap;

  /** Internal state of the text needed to be update */
  protected text: string = "";

  /**
   * Create new Text object that could be placed and render on the screen
   *
   * @param fontName - the FontBitmap valid name to load
   * @param x - initial vertical position
   * @param y - initial horizontal position
   *
   * @example
   * ```ts
   * const Label = new Text('5x5', 20, 20);
   * ```
   */
  constructor(fontName: any, x: number, y: number) {
    super("TEXT", x, y);

    this.fontName = fontName;

    this.f = new FontBitmap(fontName);
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
  }

  /**
   * Get the internal state of the object
   *
   * @return string
   */
  getText(): string {
    return this.text;
  }

  override render(ctx: CanvasRenderingContext2D): void {
    const { x, y } = this.getPosition();
    this.f.renderText(this.getText(), x, y, ctx);
  }
}
