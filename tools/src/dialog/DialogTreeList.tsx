import React, { useMemo, useState } from "react";
import type { DialogAction, DialogTree } from "./types";
import {
  MAX_DIALOG_FOLDER_DEPTH,
  normalizeFolderPath,
  parentOf,
} from "./types";
import { Icon, ICON } from "../components/Icon";

/**
 * The Dialog editor's sidebar tree list — dialogs grouped into folders,
 * up to 3 levels deep. Grouping is presentation-only: it never touches
 * message ids, links, exports or how the engine consumes trees.
 *
 * Interaction model:
 *   • Drag a dialog onto a folder to file it there; drop it on the
 *     "Dialogs" header (or the ↰ button) to move it back to the root.
 *   • Drag a folder onto another folder to re-parent it (depth-guarded).
 *   • Folder hover actions: new dialog inside, new subfolder (under depth
 *     3), rename (inline), delete (contents move up one level).
 *   • "+ Tree" / "+ Folder" at the header create at the root level.
 */
export function DialogTreeList({
  trees,
  folders,
  selectedTreeId,
  dialogDispatch,
}: {
  trees: DialogTree[];
  folders: string[];
  selectedTreeId: string | null;
  dialogDispatch: (a: DialogAction) => void;
}) {
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(new Set());
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  /** Inline new-folder input: undefined = hidden, null = root, string = inside that folder. */
  const [newFolderParent, setNewFolderParent] = useState<string | null | undefined>(undefined);
  const [newFolderName, setNewFolderName] = useState("");
  const [dragTreeId, setDragTreeId] = useState<string | null>(null);
  const [dragFolderPath, setDragFolderPath] = useState<string | null>(null);
  /** Drop highlight: "root" = the header, a path = that folder row. */
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  // Every folder path, parents first: explicit folders in creation order,
  // plus folders referenced by trees (and their implicit parents).
  const orderedFolders = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    const push = (raw: string) => {
      const segs = normalizeFolderPath(raw).split("/");
      for (let i = 1; i <= segs.length; i++) {
        const prefix = segs.slice(0, i).join("/");
        if (prefix && !seen.has(prefix)) {
          seen.add(prefix);
          out.push(prefix);
        }
      }
    };
    for (const f of folders) push(f);
    for (const t of trees) if (t.folder) push(t.folder);
    return out;
  }, [folders, trees]);

  /** Flattened render rows, respecting collapsed folders. */
  type Row =
    | {
        kind: "folder";
        path: string;
        name: string;
        depth: number;
        hasChildren: boolean;
        treeCount: number;
      }
    | { kind: "tree"; tree: DialogTree; depth: number };

  const rows = useMemo(() => {
    const out: Row[] = [];
    const emitFolder = (path: string, depth: number): void => {
      const name = path.slice(path.lastIndexOf("/") + 1);
      const subFolders = orderedFolders.filter((p) => parentOf(p) === path);
      const ownTrees = trees.filter((t) => (t.folder ?? null) === path);
      const allTrees = trees.filter(
        (t) => t.folder === path || (t.folder ?? "").startsWith(path + "/"),
      );
      out.push({
        kind: "folder",
        path,
        name,
        depth,
        hasChildren: subFolders.length > 0 || ownTrees.length > 0,
        treeCount: allTrees.length,
      });
      if (collapsed.has(path)) return;
      for (const sub of subFolders) emitFolder(sub, depth + 1);
      for (const t of ownTrees) out.push({ kind: "tree", tree: t, depth: depth + 1 });
    };
    for (const p of orderedFolders.filter((p) => parentOf(p) === null)) {
      emitFolder(p, 0);
    }
    for (const t of trees.filter((t) => !t.folder)) {
      out.push({ kind: "tree", tree: t, depth: 0 });
    }
    return out;
  }, [orderedFolders, trees, collapsed]);

  // ── Folder ops ────────────────────────────────────────

  const toggleFolder = (path: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });

  const addTreeHere = (path: string) => {
    // Auto-expand so the new dialog is visible where it lands.
    setCollapsed((prev) => {
      if (!prev.has(path)) return prev;
      const next = new Set(prev);
      next.delete(path);
      return next;
    });
    dialogDispatch({ type: "ADD_TREE", folder: path });
  };

  const startNewFolder = (parent: string | null) => {
    setRenaming(null);
    setNewFolderName("");
    setNewFolderParent(parent);
  };

  const commitNewFolder = (parent: string | null) => {
    const name = newFolderName.replace(/\//g, " ").trim();
    if (name) {
      const path = normalizeFolderPath(parent ? `${parent}/${name}` : name);
      if (path) dialogDispatch({ type: "ADD_FOLDER", path });
    }
    setNewFolderParent(undefined);
    setNewFolderName("");
  };

  const commitRename = (path: string) => {
    if (renaming === path) {
      const name = renameValue.replace(/\//g, " ").trim();
      if (name) dialogDispatch({ type: "RENAME_FOLDER", path, name });
    }
    setRenaming(null);
  };

  const deleteFolder = (path: string) => {
    const name = path.slice(path.lastIndexOf("/") + 1);
    const dest = parentOf(path) ?? "the root level";
    if (confirm(`Delete folder "${name}"? Its dialogs move up to ${dest}.`)) {
      dialogDispatch({ type: "DELETE_FOLDER", path });
    }
  };

  // ── Drag & drop ───────────────────────────────────────

  const endDrag = () => {
    setDragTreeId(null);
    setDragFolderPath(null);
    setDropTarget(null);
  };

  /** Drop whatever is being dragged into `dest` (null = root). */
  const dropInto = (dest: string | null) => {
    const treeId = dragTreeId;
    const from = dragFolderPath;
    endDrag();
    if (treeId) {
      dialogDispatch({ type: "MOVE_TREE", treeId, folder: dest });
      return;
    }
    if (!from || from === dest) return;
    const name = from.slice(from.lastIndexOf("/") + 1);
    const to = dest ? `${dest}/${name}` : name;
    // The reducer re-checks everything; skip clearly invalid drops here
    // so the UI doesn't promise a move that will be refused.
    if (to === from || to.startsWith(from + "/")) return;
    if (to.split("/").length > MAX_DIALOG_FOLDER_DEPTH) return;
    dialogDispatch({ type: "MOVE_FOLDER", from, toParent: dest });
  };

  const newFolderInput = (depth: number, parent: string | null) => (
    <div
      className="dialog-new-folder"
      style={{ paddingLeft: 4 + depth * 12 }}
      key={`new-folder-${parent ?? "root"}`}
    >
      <Icon name="folder" size={12} />
      <input
        autoFocus
        className="input input-sm input-full"
        placeholder="Folder name… (Enter to add)"
        value={newFolderName}
        onChange={(e) => setNewFolderName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") commitNewFolder(parent);
          else if (e.key === "Escape") setNewFolderParent(undefined);
        }}
      />
      <button
        className="btn btn-sm"
        title="Add folder"
        disabled={!newFolderName.trim()}
        onClick={() => commitNewFolder(parent)}
      >
        <Icon name="check" size={ICON.xs} />
      </button>
      <button
        className="btn btn-sm"
        title="Cancel"
        onClick={() => setNewFolderParent(undefined)}
      >
        <Icon name="close" size={ICON.xs} />
      </button>
    </div>
  );

  return (
    <>
      <div
        className={`row-between dialog-drop-root ${dropTarget === "root" ? "drop-target-hint" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDropTarget("root");
        }}
        onDragLeave={() => setDropTarget((cur) => (cur === "root" ? null : cur))}
        onDrop={(e) => {
          e.preventDefault();
          dropInto(null);
        }}
      >
        <div className="section-title">Dialogs</div>
        <div className="row" style={{ gap: 4 }}>
          <button
            className="btn btn-sm"
            title="New dialog tree (at the root)"
            onClick={() => dialogDispatch({ type: "ADD_TREE" })}
          >
            <Icon name="add" size={12} /> Tree
          </button>
          <button
            className="btn btn-sm"
            title="New folder"
            onClick={() => startNewFolder(null)}
          >
            <Icon name="folder" size={12} /> Folder
          </button>
        </div>
      </div>

      <div className="col gap-sm">
        {trees.length === 0 && folders.length === 0 && (
          <div className="text-dim text-xs p-4">
            No dialog trees yet. Group related ones into folders — grouping is
            only for organizing the list here; ids and exports never change.
          </div>
        )}

        {newFolderParent === null && newFolderInput(0, null)}

        {rows.map((row) =>
          row.kind === "folder" ? (
            <React.Fragment key={row.path}>
              <div
                className={`dialog-folder-row ${dropTarget === row.path ? "drop-target-hint" : ""} ${dragFolderPath === row.path ? "dragging" : ""}`}
                style={{ paddingLeft: 4 + row.depth * 12 }}
                draggable={renaming !== row.path}
                onDragStart={(e) => {
                  setDragFolderPath(row.path);
                  setDragTreeId(null);
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragEnd={endDrag}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDropTarget((cur) => (cur === row.path ? cur : row.path));
                }}
                onDragLeave={() => setDropTarget((cur) => (cur === row.path ? null : cur))}
                onDrop={(e) => {
                  e.preventDefault();
                  dropInto(row.path);
                }}
              >
                <button
                  className="btn btn-sm dialog-folder-chevron"
                  style={{ visibility: row.hasChildren ? "visible" : "hidden" }}
                  title={collapsed.has(row.path) ? "Expand" : "Collapse"}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFolder(row.path);
                  }}
                >
                  <Icon name={collapsed.has(row.path) ? "next" : "down"} size={ICON.xs} />
                </button>
                <Icon name="folder" size={12} />
                {renaming === row.path ? (
                  <input
                    autoFocus
                    className="input input-sm input-full"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onFocus={(e) => e.currentTarget.select()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitRename(row.path);
                      else if (e.key === "Escape") setRenaming(null);
                    }}
                    onBlur={() => commitRename(row.path)}
                  />
                ) : (
                  <span className="dialog-folder-name" onClick={() => toggleFolder(row.path)}>
                    {row.name}
                  </span>
                )}
                <span
                  className="text-dim text-xs"
                  title={`${row.treeCount} dialog${row.treeCount === 1 ? "" : "s"} inside (including subfolders)`}
                >
                  {row.treeCount}
                </span>
                {renaming !== row.path && (
                  <span className="dialog-folder-actions">
                    <button
                      className="btn btn-sm"
                      title="New dialog in this folder"
                      onClick={(e) => {
                        e.stopPropagation();
                        addTreeHere(row.path);
                      }}
                    >
                      <Icon name="add" size={ICON.xs} />
                    </button>
                    {row.depth + 1 < MAX_DIALOG_FOLDER_DEPTH && (
                      <button
                        className="btn btn-sm"
                        title="New subfolder"
                        onClick={(e) => {
                          e.stopPropagation();
                          startNewFolder(row.path);
                        }}
                      >
                        <Icon name="sparkle" size={ICON.xs} />
                      </button>
                    )}
                    <button
                      className="btn btn-sm"
                      title="Rename folder"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewFolderParent(undefined);
                        setRenaming(row.path);
                        setRenameValue(row.name);
                      }}
                    >
                      <Icon name="draw" size={ICON.xs} />
                    </button>
                    <button
                      className="btn btn-sm danger"
                      title="Delete folder — dialogs move up one level"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFolder(row.path);
                      }}
                    >
                      <Icon name="delete" size={ICON.xs} />
                    </button>
                  </span>
                )}
              </div>
              {newFolderParent === row.path && newFolderInput(row.depth + 1, row.path)}
            </React.Fragment>
          ) : (
            <div
              key={row.tree.id}
              className={`dialog-tree-item ${row.tree.id === selectedTreeId ? "active" : ""} ${dragTreeId === row.tree.id ? "dragging" : ""}`}
              style={{ paddingLeft: 10 + row.depth * 12 }}
              draggable
              onDragStart={(e) => {
                setDragTreeId(row.tree.id);
                setDragFolderPath(null);
                e.dataTransfer.effectAllowed = "move";
              }}
              onDragEnd={endDrag}
              onClick={() => dialogDispatch({ type: "SELECT_TREE", id: row.tree.id })}
              title={row.tree.folder ? `${row.tree.name} — in ${row.tree.folder}` : "Drag onto a folder to group it"}
            >
              <Icon name="dialog" size={12} />
              <span className="dialog-tree-item__name">{row.tree.name}</span>
              <span className="text-dim text-xs">{row.tree.messages.length}</span>
              {row.tree.folder && (
                <button
                  className="btn btn-sm dialog-row-action"
                  title="Move to root level"
                  onClick={(e) => {
                    e.stopPropagation();
                    dialogDispatch({ type: "MOVE_TREE", treeId: row.tree.id, folder: null });
                  }}
                >
                  <Icon name="undo" size={ICON.xs} />
                </button>
              )}
            </div>
          ),
        )}
      </div>
    </>
  );
}
