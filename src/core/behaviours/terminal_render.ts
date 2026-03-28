import type Entity from '../../entities/entity';
import { Behaviour } from '../behaviour';
import type { RenderContext } from '../renderer/type';

/**
 * Describes the visual appearance of an entity in terminal mode.
 *
 * @since 0.4.0
 *
 * @example
 * ```ts
 * const playerGlyph: TerminalGlyph = {
 *   char: "@",
 *   fg:   "#00ff00",
 *   bg:   "#000000",
 * };
 * ```
 */
export interface TerminalGlyph {
  /**
   * The Unicode character used to represent the entity.
   *
   * Single characters work well: `"@"` (player), `"E"` (enemy),
   * `"#"` (wall). Block characters like `"█"` give solid appearance.
   */
  char: string;

  /**
   * Foreground colour as a CSS hex string (e.g. `"#00ff00"`).
   *
   * Rendered as an ANSI truecolour foreground escape on terminal backends.
   */
  fg: string;

  /**
   * Background colour as a CSS hex string.
   *
   * Defaults to `"#000000"` when not specified.
   */
  bg?: string;
}

/**
 * Terminal visual renderer behaviour.
 *
 * Attach `TerminalRender` to any entity so it has a character-based
 * visual representation in terminal mode (via {@link TerminalRenderContext}).
 * The behaviour calls `ctx.drawChar(...)` each frame at the entity's
 * `(x, y)` position.
 *
 * For canvas games the same call renders a single character at pixel
 * coordinates — typically invisible or used for debug labels.
 *
 * ---
 *
 * ### Dual-mode entities
 *
 * Entities that support **both** canvas and terminal rendering typically
 * attach both a {@link SpriteRender} (for canvas) and a `TerminalRender`
 * (for the terminal). `SpriteRender.render` calls `ctx.drawSprite?(...)`,
 * which is a no-op on terminal renderers, so only `TerminalRender`
 * produces visible output in terminal mode.
 *
 * ```ts
 * player.attachBehaviour(new SpriteRender(player, sheet));       // canvas
 * player.attachBehaviour(new TerminalRender(player, { char: "@", fg: "#0f0" })); // terminal
 * ```
 *
 * ### Unicode block characters
 *
 * For denser visuals, Unicode block elements give sub-character resolution:
 *
 * | Character | Coverage         |
 * |-----------|------------------|
 * | `█`       | Full block       |
 * | `▓`       | Dark shade       |
 * | `▒`       | Medium shade     |
 * | `░`       | Light shade      |
 * | `▀` / `▄` | Upper/lower half |
 * | `▌` / `▐` | Left/right half  |
 *
 * @category Behaviours
 * @since 0.4.0
 *
 * @example Attaching to a player entity
 * ```ts
 * import { Player, TerminalRender } from "gamefoo";
 *
 * const player = new Player("hero", 40, 12, 8, 8);
 * player.attachBehaviour(
 *   new TerminalRender(player, { char: "@", fg: "#00ff00" }),
 * );
 * ```
 *
 * @example Changing glyph at runtime (e.g. status effect)
 * ```ts
 * const tr = new TerminalRender(player, { char: "@", fg: "#00ff00" });
 * player.attachBehaviour(tr);
 *
 * // Later, when the player is poisoned:
 * tr.setGlyph({ char: "@", fg: "#88ff00", bg: "#004400" });
 * ```
 *
 * @see {@link TerminalRenderContext} — the renderer that processes `drawChar`
 * @see {@link TerminalGlyph}        — glyph definition
 * @see {@link SpriteRender}         — canvas-mode counterpart
 */
export class TerminalRender extends Behaviour<Entity> {
  /** @inheritDoc */
  readonly type = 'terminal_render';

  /**
   * Execution priority. Lower values run first in the behaviour pipeline.
   *
   * Defaults to `10` (after physics-related behaviours).
   *
   * @since 0.4.0
   */
  override priority = 10;

  /** The current glyph definition. */
  private glyph: TerminalGlyph;

  /**
   * Creates a new `TerminalRender` behaviour.
   *
   * @param entity - The owning entity whose position determines where the
   *   glyph is drawn.
   * @param glyph  - The character and colours to render.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const tr = new TerminalRender(enemy, { char: "E", fg: "#ff4444" });
   * enemy.attachBehaviour(tr);
   * ```
   */
  constructor(entity: Entity, glyph: TerminalGlyph) {
    super(entity);
    this.glyph = glyph;
  }

  /**
   * Replaces the current glyph definition.
   *
   * The new glyph takes effect on the next rendered frame.
   *
   * @param glyph - The new glyph to use.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * // Flash red when hit:
   * tr.setGlyph({ char: "!", fg: "#ff0000" });
   * setTimeout(() => tr.setGlyph({ char: "@", fg: "#00ff00" }), 200);
   * ```
   */
  setGlyph(glyph: TerminalGlyph): void {
    this.glyph = glyph;
  }

  /**
   * Returns the current glyph definition.
   *
   * @since 0.4.0
   */
  getGlyph(): TerminalGlyph {
    return this.glyph;
  }

  /**
   * No-op — `TerminalRender` has no per-frame logic.
   *
   * @param _dt - Unused delta time.
   *
   * @since 0.4.0
   */
  override update(_dt: number): void {}

  /**
   * Draws the glyph at the entity's current `(x, y)` position.
   *
   * On {@link TerminalRenderContext}, this writes the character into the
   * cell buffer. On {@link WebRenderer}, it renders one canvas character
   * (typically invisible in pixel-art games unless a font is set).
   *
   * @param ctx - The active {@link RenderContext}.
   *
   * @since 0.4.0
   */
  override render(ctx: RenderContext): void {
    ctx.drawChar(
      this.glyph.char,
      this.owner.x,
      this.owner.y,
      this.glyph.fg,
      this.glyph.bg ?? '#000000',
    );
  }
}
