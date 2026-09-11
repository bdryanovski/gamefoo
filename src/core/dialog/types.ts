/**
 * Dialog runtime types — the shape the engine consumes at play time. This is
 * exactly the JSON the editor's dialog exporter produces (`*.dialogs.json`):
 * trees keyed by name, each a flat table of id-addressable messages.
 *
 * A message is a list of ordered `segments` (sub-messages, one dialog box
 * each) plus `options` (branching choices). An option either links to another
 * message by id (`target`) or is a dead end (`target: null`) that ends the
 * conversation. `meta` is developer-defined key/value data read at the message
 * (portrait, flags, audio cues, …).
 *
 * @category Dialog
 * @since 0.5.0
 */

/** A branching choice presented at a message. */
export interface DialogOptionData {
  /** Text shown to the player ("Yes", "Tell me more"). */
  label: string;
  /** Target message id, or `null` for a dead-end / final choice. */
  target: string | null;
}

/** A single dialog node. */
export interface DialogMessageData {
  /** Author label (for tooling); not required at runtime. */
  title?: string;
  /** Ordered sub-messages; each is shown in one dialog box. */
  segments: string[];
  /** Branching paths from this message. */
  options: DialogOptionData[];
  /** Free-form key/value metadata. */
  meta?: Record<string, string>;
}

/** A named tree of messages with a single entry point. */
export interface DialogTreeData {
  id: string;
  name: string;
  /** Entry message id (`null` when the tree is empty). */
  root: string | null;
  /** Messages keyed by id. */
  messages: Record<string, DialogMessageData>;
}

/** A full dialogs document: named trees plus optional export metadata. */
export interface DialogDocument {
  meta?: Record<string, unknown>;
  trees: Record<string, DialogTreeData>;
}

/** What a {@link DialogRunner} is doing right now. */
export type DialogPhase = 'typing' | 'ready' | 'choosing';

/**
 * A choice presented to the player. Mirrors {@link DialogOptionData} but is
 * also synthesized (a single "Close") at dead-end messages with no options.
 */
export interface DialogChoice {
  label: string;
  target: string | null;
}
