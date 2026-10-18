import type { SubSystem } from '../../../../src/index';

/** Who currently holds the screen. */
export type ModalOwner = 'splash' | 'dialog' | 'lock' | 'transition';

/**
 * The modal stack: replaces the hardcoded early-return chain at the top of the
 * old `MapGame.update()` (splash → dialog → keypad → transition → world).
 * Modals push/pop themselves; world systems consult one boolean
 * ({@link GameFlow.worldActive}) and silently skip their frame while a modal
 * owns the screen.
 *
 * The "pending" hacks (`pendingLock`, `shelfAwaitingSlide`) are **not** flow
 * state — they are continuations carried by `DialogSystem.start(...)`.
 */
export class GameFlow implements SubSystem {
  readonly id = 'flow';
  readonly order = 5; // before everything: pushes/pops settle before systems read worldActive

  private readonly stack: ModalOwner[] = [];

  /** Opens a modal; no-op if it is already open. */
  push(owner: ModalOwner): void {
    if (!this.stack.includes(owner)) this.stack.push(owner);
  }

  /** Closes a modal; no-op when it was not open. */
  pop(owner: ModalOwner): void {
    const i = this.stack.lastIndexOf(owner);
    if (i !== -1) this.stack.splice(i, 1);
  }

  /** True while no modal is up — world systems early-return while false. */
  get worldActive(): boolean {
    return this.stack.length === 0;
  }

  /** True while `owner` is anywhere on the stack (e.g. splash also hides the world). */
  has(owner: ModalOwner): boolean {
    return this.stack.includes(owner);
  }
}
