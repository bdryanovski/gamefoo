import { uid } from "../utils/uid";

/**
 * Dialog Tree definitions — part of the unified project.
 *
 * A project holds a list of dialog trees. Each tree is an entry point
 * (`rootId`) into a bag of messages. Every message carries a stable id
 * so it can be found in a flat list and linked to from anywhere.
 *
 * A message is split into ordered `segments` (sub-messages) so a runtime
 * dialog box can show small parts of the text one at a time. A message
 * may also present `options` (branching choices): each option either
 * links to another message by id or is a dead end (`targetId === null`),
 * which ends the conversation. `meta` is free-form key/value data the
 * game reads to know where it is / what to do at a message.
 */

/** A branching choice presented at a message. */
export interface DialogOption {
  id: string;
  /** Text shown to the player ("Yes", "Tell me more"). */
  label: string;
  /** Message this option leads to, or null for a dead-end / final choice. */
  targetId: string | null;
}

/** Free-form metadata attached to a message. */
export interface DialogMetaEntry {
  key: string;
  value: string;
}

/** A single node in a dialog tree. */
export interface DialogMessage {
  id: string;
  /** Short label used to find the message in a list. */
  title: string;
  /**
   * Ordered sub-messages. The full message text split into small parts,
   * each meant to fit one dialog box.
   */
  segments: string[];
  /** Branching paths the player can take from this message. */
  options: DialogOption[];
  /** Free-form key/value metadata. */
  meta: DialogMetaEntry[];
}

/** A named tree of messages with a single entry point. */
export interface DialogTree {
  id: string;
  name: string;
  /** Entry message id (null when the tree has no messages yet). */
  rootId: string | null;
  messages: DialogMessage[];
  /**
   * Presentation-only grouping path ("NPCs/Villagers"), max 3 levels.
   * Never exported — message ids, links and engine consumption are
   * unaffected by how trees are grouped in the editor sidebar.
   */
  folder?: string;
}

/** Dialog editor slice of the project. */
export interface DialogState {
  trees: DialogTree[];
  /**
   * Explicit folder paths, in creation order. Folders exist even while
   * empty (until deleted); grouping itself is presentation-only.
   */
  folders: string[];
  selectedTreeId: string | null;
  selectedMessageId: string | null;
}

export const INITIAL_DIALOG_STATE: DialogState = {
  trees: [],
  folders: [],
  selectedTreeId: null,
  selectedMessageId: null,
};

// ── Folder path helpers ──────────────────────────────────

/** Max folder nesting depth (path segments). */
export const MAX_DIALOG_FOLDER_DEPTH = 3;

/** Normalize a folder path: trimmed non-empty segments, capped at depth 3. */
export function normalizeFolderPath(raw: string): string {
  return raw
    .split("/")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, MAX_DIALOG_FOLDER_DEPTH)
    .join("/");
}

/** The path of a folder's parent (null for root-level folders). */
export function parentOf(path: string): string | null {
  const i = path.lastIndexOf("/");
  return i === -1 ? null : path.slice(0, i);
}

// ── Factories ────────────────────────────────────────────

export function makeDialogMessage(title = "New message"): DialogMessage {
  return {
    id: uid("msg"),
    title,
    segments: [""],
    options: [],
    meta: [],
  };
}

export function makeDialogOption(targetId: string | null = null): DialogOption {
  return { id: uid("opt"), label: "Option", targetId };
}

/** A fresh tree with one root message. */
export function makeDialogTree(name = "New dialog"): DialogTree {
  const root = makeDialogMessage("Start");
  return { id: uid("dlg"), name, rootId: root.id, messages: [root] };
}

// ── Actions ──────────────────────────────────────────────

export type DialogAction =
  | { type: "ADD_TREE"; folder?: string }
  | { type: "UPDATE_TREE"; id: string; updates: Partial<Pick<DialogTree, "name" | "rootId" | "folder">> }
  | { type: "DELETE_TREE"; id: string }
  | { type: "SELECT_TREE"; id: string | null }
  /** Create (or make known) a folder at a normalized path. */
  | { type: "ADD_FOLDER"; path: string }
  /** Rename a folder's own segment, keeping its parent and depth. */
  | { type: "RENAME_FOLDER"; path: string; name: string }
  /** Delete a folder; its contents move up one level. */
  | { type: "DELETE_FOLDER"; path: string }
  /** Move one tree into a folder (null = root). */
  | { type: "MOVE_TREE"; treeId: string; folder: string | null }
  /** Re-parent a folder (and everything under it) into another folder (null = root). */
  | { type: "MOVE_FOLDER"; from: string; toParent: string | null }
  | { type: "ADD_MESSAGE"; linkFromOptionId?: string }
  | {
      type: "UPDATE_MESSAGE";
      id: string;
      updates: Partial<Pick<DialogMessage, "title" | "segments">>;
    }
  | { type: "DELETE_MESSAGE"; id: string }
  | { type: "SELECT_MESSAGE"; id: string | null }
  | { type: "ADD_OPTION"; messageId: string }
  | {
      type: "UPDATE_OPTION";
      messageId: string;
      optionId: string;
      updates: Partial<Pick<DialogOption, "label" | "targetId">>;
    }
  | { type: "DELETE_OPTION"; messageId: string; optionId: string }
  | { type: "ADD_META"; messageId: string }
  | {
      type: "UPDATE_META";
      messageId: string;
      index: number;
      updates: Partial<DialogMetaEntry>;
    }
  | { type: "DELETE_META"; messageId: string; index: number };

// ── Tree helpers ─────────────────────────────────────────

function updateSelectedTree(
  state: DialogState,
  fn: (tree: DialogTree) => DialogTree,
): DialogState {
  if (!state.selectedTreeId) return state;
  return {
    ...state,
    trees: state.trees.map((t) => (t.id === state.selectedTreeId ? fn(t) : t)),
  };
}

function mapMessage(
  tree: DialogTree,
  id: string,
  fn: (m: DialogMessage) => DialogMessage,
): DialogTree {
  return { ...tree, messages: tree.messages.map((m) => (m.id === id ? fn(m) : m)) };
}

/**
 * Rewrite folder memberships after a folder move/rename/delete: every
 * path at or under `from` re-roots at `to`. With `dropExact`, the folder
 * itself is removed and only its contents move into `to` (delete-folder
 * semantics — children move up one level).
 */
function rebaseFolders(
  state: DialogState,
  from: string,
  to: string,
  opts: { dropExact?: boolean } = {},
): DialogState {
  const rebased = (p: string | undefined): string | undefined => {
    if (!p) return undefined;
    if (p === from) return opts.dropExact ? (to || undefined) : to;
    if (p.startsWith(from + "/")) return normalizeFolderPath(`${to}/${p.slice(from.length)}`);
    return p;
  };
  const folders = new Set<string>();
  for (const f of state.folders) {
    const next = rebased(f);
    if (next) folders.add(next);
  }
  const trees = state.trees.map((t) => {
    const next = rebased(t.folder);
    return next === t.folder ? t : { ...t, folder: next };
  });
  return { ...state, folders: [...folders], trees };
}

// ── Reducer ──────────────────────────────────────────────

export function dialogReducer(state: DialogState, action: DialogAction): DialogState {
  switch (action.type) {
    case "ADD_TREE": {
      const folder = normalizeFolderPath(action.folder ?? "");
      const tree: DialogTree = {
        ...makeDialogTree(`Dialog ${state.trees.length + 1}`),
        ...(folder ? { folder } : {}),
      };
      return {
        ...state,
        trees: [...state.trees, tree],
        selectedTreeId: tree.id,
        selectedMessageId: tree.rootId,
      };
    }

    case "ADD_FOLDER": {
      const path = normalizeFolderPath(action.path);
      if (!path || state.folders.includes(path)) return state;
      return { ...state, folders: [...state.folders, path] };
    }

    case "RENAME_FOLDER": {
      const from = normalizeFolderPath(action.path);
      const name = action.name.replace(/\//g, " ").trim();
      if (!from || !name) return state;
      const parent = parentOf(from);
      const to = normalizeFolderPath(parent ? `${parent}/${name}` : name);
      if (!to || to === from) return state;
      return rebaseFolders(state, from, to);
    }

    case "DELETE_FOLDER": {
      const path = normalizeFolderPath(action.path);
      if (!path) return state;
      // Children move up one level: "A/B/C" under deleted "A/B" → "A/C".
      return rebaseFolders(state, path, parentOf(path) ?? "", { dropExact: true });
    }

    case "MOVE_TREE": {
      const folder = action.folder ? normalizeFolderPath(action.folder) : "";
      return {
        ...state,
        trees: state.trees.map((t) =>
          t.id === action.treeId ? { ...t, folder: folder || undefined } : t,
        ),
      };
    }

    case "MOVE_FOLDER": {
      const from = normalizeFolderPath(action.from);
      if (!from) return state;
      const name = from.slice(from.lastIndexOf("/") + 1);
      const to = normalizeFolderPath(action.toParent ? `${action.toParent}/${name}` : name);
      if (!to || to === from || to.startsWith(from + "/")) return state;
      // The folder plus its deepest descendant must still fit the depth cap.
      const tail = [
        ...state.folders,
        ...state.trees.map((t) => t.folder ?? ""),
      ]
        .filter((p) => p === from || p.startsWith(from + "/"))
        .reduce((m, p) => Math.max(m, p.split("/").length - from.split("/").length), 0);
      if (to.split("/").length + tail > MAX_DIALOG_FOLDER_DEPTH) return state;
      return rebaseFolders(state, from, to);
    }

    case "UPDATE_TREE":
      return {
        ...state,
        trees: state.trees.map((t) => (t.id === action.id ? { ...t, ...action.updates } : t)),
      };

    case "DELETE_TREE": {
      const trees = state.trees.filter((t) => t.id !== action.id);
      const selectedTreeId =
        state.selectedTreeId === action.id ? (trees[0]?.id ?? null) : state.selectedTreeId;
      const selectedMessageId =
        state.selectedTreeId === action.id
          ? (trees.find((t) => t.id === selectedTreeId)?.rootId ?? null)
          : state.selectedMessageId;
      return { ...state, trees, selectedTreeId, selectedMessageId };
    }

    case "SELECT_TREE": {
      const tree = state.trees.find((t) => t.id === action.id) ?? null;
      return {
        ...state,
        selectedTreeId: action.id,
        selectedMessageId: tree?.rootId ?? null,
      };
    }

    case "SELECT_MESSAGE":
      return { ...state, selectedMessageId: action.id };

    case "ADD_MESSAGE": {
      if (!state.selectedTreeId) return state;
      const message = makeDialogMessage(`Message`);
      const next = updateSelectedTree(state, (tree) => {
        const messages = [...tree.messages, message];
        // First message in an empty tree becomes the root.
        const rootId = tree.rootId ?? message.id;
        // Optionally wire an existing option to this new message.
        const withLink = action.linkFromOptionId
          ? messages.map((m) => ({
              ...m,
              options: m.options.map((o) =>
                o.id === action.linkFromOptionId ? { ...o, targetId: message.id } : o,
              ),
            }))
          : messages;
        return { ...tree, messages: withLink, rootId };
      });
      return { ...next, selectedMessageId: message.id };
    }

    case "UPDATE_MESSAGE":
      return updateSelectedTree(state, (tree) =>
        mapMessage(tree, action.id, (m) => ({ ...m, ...action.updates })),
      );

    case "DELETE_MESSAGE":
      return updateSelectedTree(state, (tree) => {
        const messages = tree.messages
          .filter((m) => m.id !== action.id)
          // Sever any links that pointed at the deleted message.
          .map((m) => ({
            ...m,
            options: m.options.map((o) =>
              o.targetId === action.id ? { ...o, targetId: null } : o,
            ),
          }));
        const rootId =
          tree.rootId === action.id ? (messages[0]?.id ?? null) : tree.rootId;
        return { ...tree, messages, rootId };
      });

    case "ADD_OPTION":
      return updateSelectedTree(state, (tree) =>
        mapMessage(tree, action.messageId, (m) => ({
          ...m,
          options: [...m.options, makeDialogOption()],
        })),
      );

    case "UPDATE_OPTION":
      return updateSelectedTree(state, (tree) =>
        mapMessage(tree, action.messageId, (m) => ({
          ...m,
          options: m.options.map((o) =>
            o.id === action.optionId ? { ...o, ...action.updates } : o,
          ),
        })),
      );

    case "DELETE_OPTION":
      return updateSelectedTree(state, (tree) =>
        mapMessage(tree, action.messageId, (m) => ({
          ...m,
          options: m.options.filter((o) => o.id !== action.optionId),
        })),
      );

    case "ADD_META":
      return updateSelectedTree(state, (tree) =>
        mapMessage(tree, action.messageId, (m) => ({
          ...m,
          meta: [...m.meta, { key: "", value: "" }],
        })),
      );

    case "UPDATE_META":
      return updateSelectedTree(state, (tree) =>
        mapMessage(tree, action.messageId, (m) => ({
          ...m,
          meta: m.meta.map((e, i) => (i === action.index ? { ...e, ...action.updates } : e)),
        })),
      );

    case "DELETE_META":
      return updateSelectedTree(state, (tree) =>
        mapMessage(tree, action.messageId, (m) => ({
          ...m,
          meta: m.meta.filter((_, i) => i !== action.index),
        })),
      );

    default:
      return state;
  }
}

// ── Cross-tree lookups ──────────────────────────────────

/** Every message across every tree, flattened as (tree, message) pairs. */
export function allDialogMessages(
  trees: DialogTree[],
): { tree: DialogTree; message: DialogMessage }[] {
  const out: { tree: DialogTree; message: DialogMessage }[] = [];
  for (const tree of trees) {
    for (const message of tree.messages) out.push({ tree, message });
  }
  return out;
}

/** The tree + message holding an id, searched across every tree. */
export function findDialogMessage(
  trees: DialogTree[],
  id: string | null | undefined,
): { tree: DialogTree; message: DialogMessage } | null {
  if (!id) return null;
  for (const tree of trees) {
    const message = tree.messages.find((m) => m.id === id);
    if (message) return { tree, message };
  }
  return null;
}

// ── Normalization ────────────────────────────────────────

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

function normalizeOption(raw: unknown): DialogOption | null {
  const o = asRecord(raw);
  if (!o) return null;
  return {
    id: typeof o.id === "string" ? o.id : uid("opt"),
    label: typeof o.label === "string" ? o.label : "Option",
    targetId: typeof o.targetId === "string" ? o.targetId : null,
  };
}

function normalizeMeta(raw: unknown): DialogMetaEntry | null {
  const e = asRecord(raw);
  if (!e) return null;
  return {
    key: typeof e.key === "string" ? e.key : "",
    value: typeof e.value === "string" ? e.value : "",
  };
}

function normalizeMessage(raw: unknown): DialogMessage | null {
  const m = asRecord(raw);
  if (!m) return null;
  const segments = Array.isArray(m.segments)
    ? m.segments.filter((s): s is string => typeof s === "string")
    : typeof m.text === "string"
      ? [m.text]
      : [""];
  return {
    id: typeof m.id === "string" ? m.id : uid("msg"),
    title: typeof m.title === "string" ? m.title : "Message",
    segments: segments.length > 0 ? segments : [""],
    options: Array.isArray(m.options)
      ? m.options.map(normalizeOption).filter((o): o is DialogOption => o != null)
      : [],
    meta: Array.isArray(m.meta)
      ? m.meta.map(normalizeMeta).filter((e): e is DialogMetaEntry => e != null)
      : [],
  };
}

function normalizeTree(raw: unknown): DialogTree | null {
  const t = asRecord(raw);
  if (!t) return null;
  const messages = Array.isArray(t.messages)
    ? t.messages.map(normalizeMessage).filter((m): m is DialogMessage => m != null)
    : [];
  const ids = new Set(messages.map((m) => m.id));
  // Drop links to messages that no longer exist.
  const cleaned = messages.map((m) => ({
    ...m,
    options: m.options.map((o) =>
      o.targetId && !ids.has(o.targetId) ? { ...o, targetId: null } : o,
    ),
  }));
  const rawRoot = typeof t.rootId === "string" ? t.rootId : null;
  const rootId = rawRoot && ids.has(rawRoot) ? rawRoot : (cleaned[0]?.id ?? null);
  const folder =
    typeof t.folder === "string" ? normalizeFolderPath(t.folder) : "";
  return {
    id: typeof t.id === "string" ? t.id : uid("dlg"),
    name: typeof t.name === "string" ? t.name : "Dialog",
    rootId,
    messages: cleaned,
    ...(folder ? { folder } : {}),
  };
}

/** Coerce persisted/imported dialog data to the current shape. */
export function sanitizeDialogState(raw: unknown): DialogState {
  const d = asRecord(raw);
  if (!d) return { ...INITIAL_DIALOG_STATE };
  const trees = Array.isArray(d.trees)
    ? d.trees.map(normalizeTree).filter((t): t is DialogTree => t != null)
    : [];
  const folders: string[] = [];
  if (Array.isArray(d.folders)) {
    for (const f of d.folders) {
      if (typeof f !== "string") continue;
      const p = normalizeFolderPath(f);
      if (p && !folders.includes(p)) folders.push(p);
    }
  }
  const treeIds = new Set(trees.map((t) => t.id));
  const selectedTreeId =
    typeof d.selectedTreeId === "string" && treeIds.has(d.selectedTreeId)
      ? d.selectedTreeId
      : (trees[0]?.id ?? null);
  const selTree = trees.find((t) => t.id === selectedTreeId);
  const msgIds = new Set(selTree?.messages.map((m) => m.id) ?? []);
  const selectedMessageId =
    typeof d.selectedMessageId === "string" && msgIds.has(d.selectedMessageId)
      ? d.selectedMessageId
      : (selTree?.rootId ?? null);
  return { trees, folders, selectedTreeId, selectedMessageId };
}
