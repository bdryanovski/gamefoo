import { DialogBox, DialogRunner } from '../../../../src/index';
import type { RenderContext, SubSystem } from '../../../../src/index';
import type { GameContext } from '../context';

/**
 * Owns the dialog modal: ticks the runner + box every frame, freezes the
 * world while open (`flow.push('dialog')`), handles the modal keys (arrows
 * move the selection, E/Enter/Space confirm), and runs an `onClosed`
 * continuation once the modal closes — the replacement for MapGame's
 * `pendingLock` / `shelfAwaitingSlide` fields.
 */
export class DialogSystem implements SubSystem {
  readonly id = 'dialog';
  readonly order = 85;

  private runner?: DialogRunner;
  private box?: DialogBox;
  private onClosed?: () => void;

  constructor(private readonly ctx: GameContext) {}

  /** True while the dialog modal is up. */
  get active(): boolean {
    return this.runner?.active ?? false;
  }

  /** Installs the box (created in boot once the font is known). */
  useBox(box: DialogBox): void {
    this.box = box;
  }

  /** Installs the runner for the loaded dialog document (called from boot). */
  useRunner(runner: DialogRunner): void {
    this.runner = runner;
  }

  /**
   * Starts a dialog by `ref`, records it with telemetry, and returns whether
   * it opened. `onClosed` runs exactly once when the modal closes again.
   * A `ref` that resolves to nothing logs a warning — the dialogs export is
   * likely stale or the ref is typo'd.
   *
   * Consumes the E/Space edges so the press that opened the modal cannot
   * also confirm it on the next frame.
   */
  start(ref: string | null, source: string, onClosed?: () => void): boolean {
    this.ctx.input.consume('e');
    this.ctx.input.consume(' ');
    if (ref && this.runner?.start(ref)) {
      this.ctx.telemetry.dialogOpen(source, ref);
      this.onClosed = onClosed;
      return true;
    }
    if (ref) {
      console.warn(
        `[dialog] "${ref}" from ${source} did not resolve — is the dialogs export stale?`,
      );
    }
    return false;
  }

  update(dt: number): void {
    const runner = this.runner;
    if (!runner) return;

    runner.update(dt); // typewriter + slide — the modal animates while the world freezes
    this.box?.update(dt, runner.active);

    // Reconcile the freeze with the runner's current state. Both open (via
    // interact earlier this frame, order 40) and close (via confirm() below)
    // flip `runner.active` outside this method, so an edge captured here would
    // be stale; `flow.has('dialog')` is the durable record of what we pushed.
    const open = runner.active;
    const frozen = this.ctx.flow?.has('dialog') ?? false;
    if (open && !frozen) {
      this.ctx.flow?.push('dialog');
    } else if (!open && frozen) {
      this.ctx.flow?.pop('dialog');
      const done = this.onClosed;
      this.onClosed = undefined;
      done?.();
    }
    if (!open) return;

    const input = this.ctx.input;
    if (
      input.isKeyPressed('arrowup') ||
      input.isKeyPressed('arrowleft') ||
      input.isKeyPressed('w')
    ) {
      runner.moveSelection(-1);
    } else if (
      input.isKeyPressed('arrowdown') ||
      input.isKeyPressed('arrowright') ||
      input.isKeyPressed('s')
    ) {
      runner.moveSelection(1);
    } else if (input.isKeyPressed('e') || input.isKeyPressed(' ') || input.isKeyPressed('enter')) {
      runner.confirm();
      this.ctx.telemetry.dialogAdvance();
    }
  }

  render(ctx: RenderContext): void {
    if (this.runner && this.box) {
      this.box.render(ctx, this.runner);
    }
  }
}
