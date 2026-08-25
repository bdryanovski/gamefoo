import type { AppState } from "../types";

const STATE_KEY = "gamefoo-tools-state";
const PROJECT_ID_KEY = "gamefoo-tools-project-id";

// ── LocalStorage ──────────────────────────────────────────

export function saveStateToLocal(state: AppState): void {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("localStorage save failed:", e);
  }
}

export function loadStateFromLocal(): AppState | null {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppState;
  } catch {
    return null;
  }
}

export function clearLocalState(): void {
  localStorage.removeItem(STATE_KEY);
  localStorage.removeItem(PROJECT_ID_KEY);
}

export function saveProjectId(id: string | null): void {
  if (id) localStorage.setItem(PROJECT_ID_KEY, id);
  else localStorage.removeItem(PROJECT_ID_KEY);
}

export function getProjectId(): string | null {
  return localStorage.getItem(PROJECT_ID_KEY);
}

// ── Server API ────────────────────────────────────────────

export async function uploadImage(
  file: File,
): Promise<{ path: string; name: string }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

/**
 * Re-upload a base64 data URL as a real file on the server.
 * Returns the new server path, or null on failure.
 */
export async function reuploadDataUrl(
  dataUrl: string,
  filename: string,
): Promise<string | null> {
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const file = new File([blob], filename, { type: blob.type });
    const result = await uploadImage(file);
    return result.path;
  } catch {
    return null;
  }
}

export interface ProjectMeta {
  id: string;
  name: string;
  kind?: string;
  lastModified: string;
  spriteCount: number;
  animCount: number;
  imageName: string;
}

export async function listProjects(): Promise<ProjectMeta[]> {
  const res = await fetch("/api/projects");
  if (!res.ok) return [];
  return res.json();
}

export async function loadProject(id: string): Promise<AppState | null> {
  const res = await fetch(`/api/projects/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function saveProject(
  id: string,
  state: AppState,
): Promise<void> {
  const res = await fetch(`/api/projects/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state),
  });
  if (!res.ok) throw new Error("Save failed");
}

export async function deleteProject(id: string): Promise<void> {
  await fetch(`/api/projects/${id}`, { method: "DELETE" });
}

export async function exportProjectFiles(
  id: string,
  files: Record<string, unknown>,
): Promise<Record<string, string>> {
  const res = await fetch(`/api/projects/${id}/export`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ files }),
  });
  if (!res.ok) throw new Error("Export failed");
  const data = await res.json();
  return data.files;
}
