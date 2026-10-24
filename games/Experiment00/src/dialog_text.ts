import type { DialogDocument, DialogMessageData, DialogTreeData } from '../../../src/index';

/** Upper bounds so a deeply branching tree can never flood the reading pane. */
const MAX_LINES = 40;
const MAX_CHARS = 2000;

/**
 * Flattens a dialog reference into readable lines for the inventory/journal
 * reading pane. Editor objects carry a `message` property naming a dialog; the
 * text the player would read is resolved from that tree instead of being
 * duplicated as a plain string.
 *
 * The reference may be a tree's key, its id, its name, or the id of a message
 * inside a tree. Matching is forgiving: numbers are compared leniently, and a
 * bare message id finds its owning tree. From the resolved start message the
 * walk follows every option `target` (breadth-first), collecting each message's
 * `segments` once, so branching conversations read as one continuous note.
 *
 * Returns `[]` when the document, reference, or resolved start is missing.
 *
 * @example
 * ```ts
 * const lines = resolveDialogText(dialogs, object.getProperty('message') ?? '');
 * journal.discover('4', 'The Long Hall', lines);
 * ```
 */
export function resolveDialogText(
  doc: DialogDocument | undefined,
  ref: string | null | undefined,
): string[] {
  if (!doc || !ref) {
    return [];
  }
  const clean = ref.trim();
  if (clean === '' || clean === '0') {
    return [];
  }
  const located = locate(doc, clean);
  if (!located) {
    return [];
  }
  return collect(located.tree, located.startId);
}

/** The tree + starting message id a reference resolves to. */
interface Located {
  tree: DialogTreeData;
  startId: string;
}

/** Resolves `ref` to a tree and a starting message id, or `undefined`. */
function locate(doc: DialogDocument, ref: string): Located | undefined {
  const direct = findTree(doc, ref);
  if (direct) {
    const startId = direct.messages[ref] ? ref : direct.root;
    if (startId && direct.messages[startId]) {
      return { tree: direct, startId };
    }
  }
  for (const tree of Object.values(doc.trees)) {
    if (tree.messages[ref]) {
      return { tree, startId: ref };
    }
  }
  return undefined;
}

/** Finds a tree by its key, id, name, or 1-based position. */
function findTree(doc: DialogDocument, ref: string): DialogTreeData | undefined {
  const byKey = doc.trees[ref];
  if (byKey) {
    return byKey;
  }
  for (const tree of Object.values(doc.trees)) {
    if (tree.id === ref || tree.name === ref) {
      return tree;
    }
  }
  const index = Number(ref);
  const trees = Object.values(doc.trees);
  if (Number.isInteger(index) && index >= 1 && index <= trees.length) {
    return trees[index - 1];
  }
  return undefined;
}

/** Breadth-first walk collecting each reachable message's segments once. */
function collect(tree: DialogTreeData, startId: string): string[] {
  const lines: string[] = [];
  const seen = new Set<string>();
  const queue: string[] = [startId];
  let chars = 0;
  while (queue.length > 0 && lines.length < MAX_LINES && chars < MAX_CHARS) {
    const message = takeNext(tree, queue, seen);
    if (!message) {
      continue;
    }
    chars += pushSegments(lines, message);
    enqueueTargets(queue, message, seen);
  }
  return lines;
}

/** Dequeues the next unseen message, marking it visited. */
function takeNext(
  tree: DialogTreeData,
  queue: string[],
  seen: Set<string>,
): DialogMessageData | undefined {
  const id = queue.shift();
  if (id === undefined || seen.has(id)) {
    return undefined;
  }
  seen.add(id);
  return tree.messages[id];
}

/** Appends a message's non-blank segments; returns the characters added. */
function pushSegments(lines: string[], message: DialogMessageData): number {
  let chars = 0;
  for (const segment of message.segments) {
    const text = segment.trim();
    if (text === '') {
      continue;
    }
    lines.push(text);
    chars += text.length;
  }
  return chars;
}

/** Queues every as-yet-unseen option target from a message. */
function enqueueTargets(
  queue: string[],
  message: DialogMessageData,
  seen: Set<string>,
): void {
  for (const option of message.options) {
    if (option.target && !seen.has(option.target)) {
      queue.push(option.target);
    }
  }
}
