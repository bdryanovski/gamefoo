import { MapObject, type Rect, type RenderContext } from '../../../../src/index';

/**
 * Custom class bound to the "portal" object — the only way to travel between
 * screens in this demo. A portal is a placed object that carries, per
 * placement, two things authored in the map editor:
 *
 * - **state** — its state machine spawns in a state whose name marks it open
 *   or closed (`top-open`/`top-close`, `portal-open`/`portal-close`, …). Only
 *   an *open* portal transports the player; a closed one is inert.
 * - **`targetScreen` property** — the destination screen coordinate as
 *   `"x,y"` (e.g. `"1,3"`). Set it on the placement (or the object default)
 *   in the editor's placement panel.
 *
 * The portal defines its reach with an `activation` collider on its current
 * state (authored in the object editor; its footprint is used when none is).
 * Pressing **E** next to a portal {@link Portal.open | opens} it and the game
 * navigates to `targetScreen`.
 *
 * The class owns its state (open/closed) and reports target/overlap;
 * {@link MapGame} performs the actual screen navigation.
 */
export class Portal extends MapObject {
  static override readonly type = 'portal';

  /** Current state's authored NAME (e.g. `top-open`), not its id. */
  private get stateName(): string | undefined {
    return this.machine.states.find((s) => s.id === this.state)?.name;
  }

  /**
   * Open when the current state's name marks it open. Matched by convention
   * (name contains `open`) so it works regardless of the exact scheme —
   * `top-open`, `portal-open`, `open`, … — while `*-close` stays shut.
   */
  get isOpen(): boolean {
    return (this.stateName ?? '').toLowerCase().includes('open');
  }

  /**
   * Destination screen parsed from the `targetScreen` property (`"x,y"`), or
   * `null` when unset/malformed.
   */
  get target(): { x: number; y: number } | null {
    const raw = this.properties.targetScreen;
    if (!raw) return null;
    const parts = raw.split(',');
    if (parts.length !== 2) return null;
    const x = Number(parts[0]!.trim());
    const y = Number(parts[1]!.trim());
    return Number.isFinite(x) && Number.isFinite(y) ? { x, y } : null;
  }

  /**
   * World-space AABB of the current state's `activation` collider, or the
   * object's footprint when none is authored.
   */
  activationBox(): Rect {
    const activation = this.worldColliders().find((c) => c.layer === 'activation');
    return activation ? activation.bounds : this.bounds();
  }

  /** True when `box` overlaps this portal's activation zone. */
  overlaps(box: Rect): boolean {
    const a = this.activationBox();
    return (
      box.x < a.x + a.width &&
      box.x + box.width > a.x &&
      box.y < a.y + a.height &&
      box.y + box.height > a.y
    );
  }

  /**
   * Transitions the portal to its open state, matched by the `open` name
   * convention (`top-open`, `portal-open`, …). Idempotent — returns `true`
   * only when the state actually changed.
   */
  open(): boolean {
    if (this.isOpen) return false;
    const openState = this.machine.states.find((s) => s.name.toLowerCase().includes('open'));
    return openState ? this.play(openState.name) : false;
  }

  override render(ctx: RenderContext): void {
    super.render(ctx);
    // Affordance: outline the activation zone — green when open, dim when shut.
    const a = this.activationBox();
    ctx.strokeRect(a.x, a.y, a.width, a.height, this.isOpen ? '#66ff99' : '#555577');
  }
}
