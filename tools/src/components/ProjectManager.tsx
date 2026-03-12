import React, { useEffect, useState, useCallback } from "react";
import {
  listProjects,
  deleteProject,
  type ProjectMeta,
} from "../utils/storage";

interface Props {
  currentId: string | null;
  onOpen: (id: string) => void;
  onNew: () => void;
  onImport: () => void;
  onClose: () => void;
}

export function ProjectManager({
  currentId,
  onOpen,
  onNew,
  onImport,
  onClose,
}: Props) {
  const [projects, setProjects] = useState<ProjectMeta[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const list = await listProjects();
    setProjects(list);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this project? This cannot be undone.")) return;
      await deleteProject(id);
      await refresh();
    },
    [refresh],
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          <span>Projects</span>
          <button className="btn btn-sm" onClick={onClose}>
            X
          </button>
        </div>

        <div className="modal-body">
          <div className="row gap-md mb-8">
            <button className="btn" onClick={onNew}>
              + New Project
            </button>
            <button className="btn" onClick={onImport}>
              Import JSON...
            </button>
          </div>

          {loading && <div className="text-dim p-4">Loading projects...</div>}

          {!loading && projects.length === 0 && (
            <div className="text-dim p-4">
              No saved projects yet. Click "Save" in the title bar to save
              your current work as a project.
            </div>
          )}

          <div className="project-list">
            {projects.map((p) => (
              <div
                key={p.id}
                className={`project-item ${p.id === currentId ? "current" : ""}`}
              >
                <div className="project-item__info">
                  <div className="project-item__name">
                    {p.name}
                    {p.id === currentId && (
                      <span className="project-item__badge">current</span>
                    )}
                  </div>
                  <div className="project-item__meta">
                    {p.spriteCount} sprites · {p.animCount} anims
                    {p.imageName ? ` · ${p.imageName}` : ""}
                  </div>
                  <div className="project-item__date">
                    {p.lastModified
                      ? new Date(p.lastModified).toLocaleString()
                      : "Unknown date"}
                  </div>
                </div>
                <div className="project-item__actions">
                  <button
                    className="btn btn-sm"
                    onClick={() => onOpen(p.id)}
                    disabled={p.id === currentId}
                  >
                    Open
                  </button>
                  <button
                    className="btn btn-sm danger"
                    onClick={() => handleDelete(p.id)}
                  >
                    Del
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
