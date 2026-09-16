import React, { useMemo, useCallback } from "react";
import type { AppState } from "../types";
import { exportDialogs, downloadDialogsExport } from "./dialogExport";

interface Props {
  state: AppState;
}

export function DialogExportPanel({ state }: Props) {
  const data = useMemo(() => exportDialogs(state), [state]);
  const preview = useMemo(() => JSON.stringify(data, null, 2), [data]);

  const handleDownload = useCallback(() => downloadDialogsExport(state), [state]);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(preview);
  }, [preview]);

  const treeCount = state.dialog.trees.length;
  const messageCount = state.dialog.trees.reduce((n, t) => n + t.messages.length, 0);

  return (
    <div className="col gap-md">
      <div className="section-title">Export dialogs</div>
      <div className="text-dim text-xs">
        id-keyed JSON: each tree exposes a <code>root</code> message and a flat
        <code> messages</code> table. Options link by message id; a null target
        ends the dialog. <code>meta</code> is your key/value data per message.
      </div>
      <div className="row gap-md text-xs text-dim">
        <span>{treeCount} trees</span>
        <span>{messageCount} messages</span>
      </div>
      <div className="row gap-md">
        <button className="btn btn-sm" onClick={handleDownload} disabled={treeCount === 0}>
          Download JSON
        </button>
        <button className="btn btn-sm" onClick={handleCopy} disabled={treeCount === 0}>
          Copy
        </button>
      </div>
      <pre className="dialog-export-preview">{preview}</pre>
    </div>
  );
}
