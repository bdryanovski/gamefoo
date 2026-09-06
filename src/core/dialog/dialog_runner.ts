import type {
  DialogChoice,
  DialogDocument,
  DialogMessageData,
  DialogPhase,
  DialogTreeData,
} from './types';

/**
 * Configuration for a {@link DialogRunner}.
 */
export interface DialogRunnerConfig {
  /** Characters revealed per second by the typewriter. @defaultValue `45` */
  charsPerSecond?: number;
  /** Label for the synthesized "close" choice at dead-end messages. @defaultValue `'Close'` */
  closeLabel?: string;
}

const DEFAULT_CPS = 45;
const DEFAULT_CLOSE = 'Close';

/**
 * Headless dialog state machine. Feeds a view (e.g. {@link DialogBox}) and is
 * driven by the game: {@link DialogRunner.start | start} a tree, tick
 * {@link DialogRunner.update | update} for the typewriter, and route input to
 * {@link DialogRunner.moveSelection | moveSelection} /
 * {@link DialogRunner.confirm | confirm}.
 *
 * Flow within a message: each `segment` is revealed by the typewriter and
 * advanced with confirm; after the last segment the message's `options` are
 * shown for selection. A message with no options is a dead end — a single
 * "Close" choice is synthesized so the player can dismiss it. Choosing an
 * option with a `target` jumps to that message; a `null` target ends the
 * dialog.
 *
 * @category Dialog
 * @since 0.5.0
 */
export class DialogRunner {
  private readonly doc: DialogDocument;
  private readonly cps: number;
  private readonly closeLabel: string;

  private tree: DialogTreeData | null = null;
  private messageId: string | null = null;
  private segmentIndex = 0;
  /** Fractional count of revealed characters in the current segment. */
  private revealed = 0;
  private selected = 0;
  private running = false;

  constructor(doc: DialogDocument, config: DialogRunnerConfig = {}) {
    this.doc = doc;
    this.cps = config.charsPerSecond ?? DEFAULT_CPS;
    this.closeLabel = config.closeLabel ?? DEFAULT_CLOSE;
  }

  /** Whether a dialog is currently open. */
  get active(): boolean {
    return this.running;
  }

  /**
   * Begin a dialog. `ref` resolves in order to: a tree by its keyed name,
   * `id`, or `name`; a numeric index into the document's trees (started at the
   * tree root); or a **message id** in any tree (started at that message).
   * Returns `false` (and stays inactive) when nothing resolves.
   */
  start(ref: string): boolean {
    const tree = this.resolveTree(ref);
    if (tree && tree.root && tree.messages[tree.root]) {
      this.tree = tree;
      this.running = true;
      this.goto(tree.root);
      return true;
    }
    // Fall back: treat `ref` as a message id and open its tree at that message.
    const owner = this.findTreeByMessage(ref);
    if (owner) {
      this.tree = owner;
      this.running = true;
      this.goto(ref);
      return true;
    }
    return false;
  }

  private findTreeByMessage(messageId: string): DialogTreeData | null {
    for (const t of Object.values(this.doc.trees)) {
      if (t.messages[messageId]) {return t;}
    }
    return null;
  }

  private resolveTree(ref: string): DialogTreeData | null {
    const trees = this.doc.trees;
    if (Object.prototype.hasOwnProperty.call(trees, ref)) {return trees[ref]!;}
    for (const t of Object.values(trees)) {
      if (t.id === ref || t.name === ref) {return t;}
    }
    const idx = Number(ref);
    if (Number.isInteger(idx) && idx >= 0) {
      const list = Object.values(trees);
      if (idx < list.length) {return list[idx]!;}
    }
    return null;
  }

  private goto(id: string): void {
    this.messageId = id;
    this.segmentIndex = 0;
    this.revealed = 0;
    this.selected = 0;
  }

  private get message(): DialogMessageData | null {
    if (!this.tree || !this.messageId) {return null;}
    return this.tree.messages[this.messageId] ?? null;
  }

  private get segmentText(): string {
    return this.message?.segments[this.segmentIndex] ?? '';
  }

  private get atLastSegment(): boolean {
    const segments = this.message?.segments ?? [];
    return this.segmentIndex >= segments.length - 1;
  }

  /**
   * `typing` while the typewriter is revealing the current segment; `ready`
   * when a fully-shown segment can be advanced; `choosing` once the last
   * segment is shown and the options are selectable.
   */
  get phase(): DialogPhase {
    if (this.revealed < this.segmentText.length) {return 'typing';}
    if (!this.atLastSegment) {return 'ready';}
    return 'choosing';
  }

  /** The full text of the current segment. */
  get fullText(): string {
    return this.segmentText;
  }

  /** How many characters of the current segment are revealed. */
  get revealedCount(): number {
    return Math.floor(this.revealed);
  }

  /** The revealed prefix of the current segment (typewriter output). */
  get visibleText(): string {
    return this.segmentText.slice(0, this.revealedCount);
  }

  /** Author title of the current message, or `''`. */
  get title(): string {
    return this.message?.title ?? '';
  }

  /** Metadata of the current message (portrait, flags, …). */
  get meta(): Record<string, string> {
    return this.message?.meta ?? {};
  }

  /**
   * The choices shown while {@link DialogRunner.phase | phase} is `choosing`.
   * A dead-end message (no options) yields a single synthesized "Close".
   */
  get choices(): DialogChoice[] {
    const options = this.message?.options ?? [];
    if (options.length === 0) {return [{ label: this.closeLabel, target: null }];}
    return options.map((o) => ({ label: o.label, target: o.target }));
  }

  /** Index of the highlighted choice. */
  get selectedIndex(): number {
    return this.selected;
  }

  /** Advance the typewriter by `dt` seconds. No-op when inactive. */
  update(dt: number): void {
    if (!this.running) {return;}
    const length = this.segmentText.length;
    if (this.revealed < length) {
      this.revealed = Math.min(length, this.revealed + this.cps * dt);
    }
  }

  /** Move the option selection (wraps). Only effective while `choosing`. */
  moveSelection(delta: number): void {
    if (!this.running || this.phase !== 'choosing') {return;}
    const count = this.choices.length;
    this.selected = (((this.selected + delta) % count) + count) % count;
  }

  /**
   * Confirm / advance (the "E" action):
   * - `typing` → reveal the rest of the current segment immediately;
   * - `ready` → advance to the next segment;
   * - `choosing` → follow the selected choice (jump to its `target`, or end
   *   the dialog when the target is `null` or missing).
   */
  confirm(): void {
    if (!this.running) {return;}
    const phase = this.phase;
    if (phase === 'typing') {
      this.revealed = this.segmentText.length;
      return;
    }
    if (phase === 'ready') {
      this.segmentIndex += 1;
      this.revealed = 0;
      return;
    }
    const choice = this.choices[this.selected];
    if (choice?.target == null || !this.tree?.messages[choice.target]) {
      this.close();
      return;
    }
    this.goto(choice.target);
  }

  /** End the dialog and reset all state. */
  close(): void {
    this.running = false;
    this.tree = null;
    this.messageId = null;
    this.segmentIndex = 0;
    this.revealed = 0;
    this.selected = 0;
  }
}
