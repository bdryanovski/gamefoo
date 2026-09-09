import { MapObject, type Rect, type RenderContext, type ScopedState } from '../../../../src/index';

/**
 * Parse a `"x,y"` property into a coordinate, or `null` when absent or
 * malformed. Whitespace around each number is tolerated.
 */
function parseCoord(raw: string | undefined): { x: number; y: number } | null {
  if (!raw) return null;
  const parts = raw.split(',');
  if (parts.length !== 2) return null;
  const x = Number(parts[0]!.trim());
  const y = Number(parts[1]!.trim());
  return Number.isFinite(x) && Number.isFinite(y) ? { x, y } : null;
}

/**
 * Custom class bound to the "portal" object — the only way to travel between
 * placement, three things authored in the map editor:
 *
 * - **state** — its state machine spawns in a state whose name marks it open
 *   or closed (`top-open`/`top-close`, `portal-open`/`portal-close`, …). Only
 *   an *open* portal transports the player; a closed one is inert.
 * - **`targetScreen` property** — the destination screen coordinate as
 *   `"x,y"` (e.g. `"1,3"`). Set it on the placement (or the object default)
 *   in the editor's placement panel.
 * - **`spawn` property** — which cell to drop the player on the destination
 *   screen, as grid `"col,row"`. `"0,0"` (the default) means "unset — use
 *   the screen centre".
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

  /** Shared "which doors are open" state, scoped to `"doors"`. */
  private static store: ScopedState | null = null;

  /** Binds the opened-doors state every instance reads and writes. */
  static useState(store: ScopedState | null): void {
    Portal.store = store;
  }

  /** True while the open sound is playing, before the door actually opens. */
  private opening = false;

  /** Seconds elapsed since {@link beginOpening} while the door swings open. */
  private openElapsed = 0;

  /** Expected seconds until the door finishes opening (drives the pie). */
  private openDuration = 0;

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

  /** Whether the open sound is playing and the door is about to open. */
  get isOpening(): boolean {
    return this.opening;
  }

  /**
   * Marks the door as opening — call when its open sound starts. `duration`
   * is the expected seconds until it finishes (the open cue's length), used
   * to fill the {@link openProgress} pie.
   */
  beginOpening(duration: number): void {
    if (!this.isOpen) {
      this.opening = true;
      this.openElapsed = 0;
      this.openDuration = Math.max(0, duration);
    }
  }

  /**
   * How far the door has swung open, `0..1` — the pie's fill fraction.
   * `0` when closed and idle, ramps to `1` as the open cue completes.
   */
  get openProgress(): number {
    if (!this.opening || this.openDuration <= 0) {
      return 0;
    }
    return Math.min(1, this.openElapsed / this.openDuration);
  }

  /** The authored state name marked `open`/`close` (by convention). */
  private stateNamed(marker: string): string | undefined {
    return this.machine.states.find((s) => s.name.toLowerCase().includes(marker))?.name;
  }

  override onSpawn(): void {
    // All doors start closed; a door remembered open is restored silently.
    const opened = this.id !== '' && Portal.store?.get<boolean>(this.id) === true;
    const target = this.stateNamed(opened ? 'open' : 'close');
    if (target) {
      this.play(target);
    }
  }

  /**
   * Destination screen parsed from the `targetScreen` property (`"x,y"`), or
   * `null` when unset/malformed.
   */
  get target(): { x: number; y: number } | null {
    return parseCoord(this.properties.targetScreen);
  }

  /**
   * Player spawn cell on the destination screen, as grid **column/row**
   * (the screen's tile coordinate system, e.g. a 20×16 grid of 16px blocks).
   * Parsed from the `spawn` property (`"col,row"`). `null` when unset,
   * malformed, or `"0,0"` — the sentinel meaning "no explicit cell, drop the
   * player at the screen centre". The game converts cells to pixels.
   */
  get spawn(): { col: number; row: number } | null {
    const point = parseCoord(this.properties.spawn);
    if (!point || (point.x === 0 && point.y === 0)) {
      return null;
    }
    return { col: point.x, row: point.y };
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
   * Opens the door for good: swaps to the open state and remembers it, so it
   * re-spawns open (silently) and never needs its sound again. Returns `true`
   * only when it actually changed from closed to open.
   */
  open(): boolean {
    this.opening = false;
    this.openElapsed = 0;
    this.openDuration = 0;
    if (this.isOpen) {
      return false;
    }
    const openState = this.stateNamed('open');
    if (openState === undefined) {
      return false;
    }
    this.play(openState);
    if (this.id !== '') {
      Portal.store?.set(this.id, true);
    }
    return true;
  }

  /** Advances the opening clock while the door is swinging open. */
  override update(dt: number): void {
    super.update(dt);
    if (this.opening) {
      this.openElapsed += dt;
    }
  }

  /**
   * Draws the pixel-art opening badge: a chunky pie above the door that
   * fills clockwise from twelve o'clock as {@link openProgress} climbs to
   * `1`. Rendered by the game as a top-most overlay (after every map layer)
   * so no wall or pillar can hide it. Cells are whole map pixels, so it
   * stays crisp under the game's nearest-neighbour upscale.
   */
  renderProgress(ctx: RenderContext): void {
    if (!this.opening) {
      return;
    }
    const box = this.bounds();
    const cell = 1; // one map pixel per pie block — matches the art grid
    const radius = Math.max(4, Math.round(Math.min(box.width, box.height) * 0.3));
    const cx = Math.round(box.x + box.width / 2);
    const cy = Math.round(box.y) - radius - 2; // hover just above the door
    const sweep = this.openProgress * Math.PI * 2;
    const twelve = -Math.PI / 2;
    for (let gy = -radius; gy <= radius; gy += cell) {
      for (let gx = -radius; gx <= radius; gx += cell) {
        const ox = gx + cell / 2;
        const oy = gy + cell / 2;
        const dist = Math.hypot(ox, oy);
        if (dist > radius) {
          continue;
        }
        let color: string;
        if (dist > radius - cell) {
          color = '#ffffff'; // rim ring
        } else {
          // Clockwise angle from twelve o'clock, 0..2π.
          let rel = Math.atan2(oy, ox) - twelve;
          if (rel < 0) rel += Math.PI * 2;
          color = rel <= sweep ? '#ffd66e' : '#2a2a3a';
        }
        ctx.fillRect(cx + gx, cy + gy, cell, cell, color);
      }
    }
  }
}
