import React from "react";
import { Icon, type IconName, ICON } from "./Icon";
import { Tooltip } from "./Tooltip";

interface Props {
  /** Editor glyph shown at the far left. */
  icon: IconName;
  /** Editor name, e.g. "Map Editor" — rendered as "GameFoo {title}". */
  title: string;
  projectName: string;
  /** Shows a "(unsaved)" hint when the project has never been persisted. */
  unsaved?: boolean;
  /** Undo stack depth. Omit to hide the Undo button (editors without history). */
  undoCount?: number;
  onUndo?: () => void;
  onOpenProjects?: () => void;
  onSave: (mode: "quick" | "save") => void;
  saving: boolean;
  /** Leading editor-specific actions (e.g. "+ Add Image"). */
  extras?: React.ReactNode;
}

/**
 * The single project-lifecycle chrome shared by every editor mode. Replaces
 * the six hand-rolled title bars that had drifted apart (Sprite mode was
 * missing Undo; button order differed per editor).
 */
export function EditorHeader({
  icon,
  title,
  projectName,
  unsaved,
  undoCount,
  onUndo,
  onOpenProjects,
  onSave,
  saving,
  extras,
}: Props) {
  return (
    <div className="title-bar">
      <span className="title-bar__icon">
        <Icon name={icon} size={ICON.md} />
      </span>
      <span className="title-bar__name">
        GameFoo {title} — {projectName}
        {unsaved ? " (unsaved)" : ""}
      </span>

      <div className="title-bar__actions">
        {extras}

        {onOpenProjects && (
          <Tooltip label="Browse & switch projects" side="bottom">
            <button className="btn btn-sm title-btn" onClick={onOpenProjects} aria-label="Projects">
              <Icon name="folder" size={ICON.sm} /> Projects
            </button>
          </Tooltip>
        )}

        {onUndo && (
          <Tooltip label="Undo last change" shortcut="Ctrl+Z" side="bottom">
            <button
              className="btn btn-sm title-btn"
              onClick={onUndo}
              disabled={!undoCount}
              aria-label="Undo"
            >
              <Icon name="undo" size={ICON.sm} /> Undo{undoCount ? ` (${undoCount})` : ""}
            </button>
          </Tooltip>
        )}

        <Tooltip label="Save without the export screen" shortcut="Ctrl+S" side="bottom">
          <button
            className="btn btn-sm title-btn"
            onClick={() => onSave("quick")}
            disabled={saving}
            aria-label="QuickSave"
          >
            <Icon name="save" size={ICON.sm} /> QuickSave
          </button>
        </Tooltip>

        <Tooltip label="Save and open the export screen" side="bottom">
          <button
            className="btn btn-sm title-btn"
            onClick={() => onSave("save")}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
