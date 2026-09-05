import type { AppState } from "../types";
import type { DialogTree } from "./types";
import { downloadJSON } from "../utils/export";

/**
 * Dialog trees export — id-keyed so the engine can look any message up in
 * a flat table and follow option links by id.
 *
 * Engine-side contract: start at `root`, render the current message's
 * ordered `segments` one box at a time, then present `options`. Following
 * an option jumps to `target` (another message id) or ends the dialog when
 * `target` is null. `meta` is developer-defined key/value data read at the
 * message (flags, portraits, audio cues, …).
 */
export interface DialogTreeExport {
  id: string;
  name: string;
  root: string | null;
  messages: Record<
    string,
    {
      title: string;
      segments: string[];
      options: { label: string; target: string | null }[];
      meta: Record<string, string>;
    }
  >;
}

export function exportDialogTree(tree: DialogTree): DialogTreeExport {
  return {
    id: tree.id,
    name: tree.name,
    root: tree.rootId,
    messages: Object.fromEntries(
      tree.messages.map((m) => [
        m.id,
        {
          title: m.title,
          segments: m.segments,
          options: m.options.map((o) => ({ label: o.label, target: o.targetId })),
          meta: Object.fromEntries(m.meta.filter((e) => e.key).map((e) => [e.key, e.value])),
        },
      ]),
    ),
  };
}

export function exportDialogs(state: AppState) {
  return {
    meta: {
      version: "1.0",
      tool: "gamefoo-dialog-editor",
      projectName: state.projectName,
    },
    trees: Object.fromEntries(
      state.dialog.trees.map((t) => [t.name, exportDialogTree(t)]),
    ),
  };
}

export function downloadDialogsExport(state: AppState): void {
  const base = state.projectName.replace(/\s+/g, "_").toLowerCase() || "project";
  downloadJSON(exportDialogs(state), `${base}.dialogs.json`);
}
