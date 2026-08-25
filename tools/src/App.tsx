import React, { useReducer, useCallback, useState, useEffect, useRef, useMemo } from "react";
import type { AppState, AppAction, ProjectSnapshot } from "./types";
import { INITIAL_STATE, migrateSpriteState } from "./types";
import { mapReducer } from "./map/types";
import { sanitizeMachine } from "./statemachine/types";
import { Toolbar } from "./components/Toolbar";
import { TilemapCanvas } from "./components/TilemapCanvas";
import { SpritePanel } from "./components/SpritePanel";
import { AnimationPanel } from "./components/AnimationPanel";
import { ImageLibraryPanel } from "./components/ImageLibraryPanel";
import { ExportPanel } from "./components/ExportPanel";
import { ObjectExplorer } from "./objects/ObjectExplorer";
import { StatusBar } from "./components/StatusBar";
import { ProjectManager } from "./components/ProjectManager";
import { SaveScreen } from "./components/SaveScreen";
import { MapEditor } from "./map/MapEditor";
import {
  saveStateToLocal,
  loadStateFromLocal,
  saveProjectId,
  getProjectId,
  uploadImage,
  reuploadDataUrl,
  saveProject,
  loadProject,
} from "./utils/storage";
import { uid } from "./utils/uid";

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "ADD_IMAGE":
      return {
        ...state,
        images: [...state.images, action.image],
        activeImageId:
          action.activate || state.activeImageId === null
            ? action.image.id
            : state.activeImageId,
        pan: { x: 0, y: 0 },
      };

    case "REMOVE_IMAGE": {
      const images = state.images.filter((i) => i.id !== action.imageId);
      const sprites = state.sprites.filter(
        (s) => s.imageId !== action.imageId,
      );
      return {
        ...state,
        images,
        sprites,
        activeImageId:
          state.activeImageId === action.imageId
            ? (images[0]?.id ?? null)
            : state.activeImageId,
        objects: state.objects.map((o) => ({
          ...o,
          sprites: o.sprites.filter((id) => sprites.some((s) => s.id === id)),
          machine: sanitizeMachine(o.machine, sprites, state.animations),
        })),
      };
    }

    case "SET_ACTIVE_IMAGE":
      return {
        ...state,
        activeImageId: action.imageId,
        pan: { x: 0, y: 0 },
      };

    case "SET_GRID":
      return { ...state, grid: { ...state.grid, ...action.grid } };

    case "ADD_SPRITE":
      return { ...state, sprites: [...state.sprites, action.sprite] };

    case "UPDATE_SPRITE":
      return {
        ...state,
        sprites: state.sprites.map((s) =>
          s.id === action.id ? { ...s, ...action.updates } : s,
        ),
      };

    case "DELETE_SPRITE": {
      const sprites = state.sprites.filter((s) => s.id !== action.id);
      const animations = state.animations.map((a) => ({
        ...a,
        frames: a.frames.filter((f) => f !== action.id),
      }));
      const objects = state.objects.map((o) => ({
        ...o,
        sprites: o.sprites.filter((s) => s !== action.id),
        machine: sanitizeMachine(o.machine, sprites, animations),
      }));
      return {
        ...state,
        sprites,
        selectedSpriteIds: state.selectedSpriteIds.filter(
          (id) => id !== action.id,
        ),
        animations,
        objects,
      };
    }

    case "SELECT_SPRITE":
      if (action.multi) {
        const has = state.selectedSpriteIds.includes(action.id);
        return {
          ...state,
          selectedSpriteIds: has
            ? state.selectedSpriteIds.filter((id) => id !== action.id)
            : [...state.selectedSpriteIds, action.id],
        };
      }
      return { ...state, selectedSpriteIds: [action.id] };

    case "DESELECT_ALL_SPRITES":
      return { ...state, selectedSpriteIds: [] };

    case "ADD_ANIMATION":
      return {
        ...state,
        animations: [...state.animations, action.animation],
      };

    case "UPDATE_ANIMATION":
      return {
        ...state,
        animations: state.animations.map((a) =>
          a.id === action.id ? { ...a, ...action.updates } : a,
        ),
      };

    case "DELETE_ANIMATION": {
      const animations = state.animations.filter((a) => a.id !== action.id);
      const objects = state.objects.map((o) => ({
        ...o,
        animations: o.animations.filter((a) => a !== action.id),
        machine: sanitizeMachine(o.machine, state.sprites, animations),
      }));
      return {
        ...state,
        animations,
        selectedAnimationId:
          state.selectedAnimationId === action.id
            ? null
            : state.selectedAnimationId,
        objects,
      };
    }

    case "SELECT_ANIMATION":
      return { ...state, selectedAnimationId: action.id };

    case "ADD_OBJECT":
      return { ...state, objects: [...state.objects, action.object] };

    case "UPDATE_OBJECT":
      return {
        ...state,
        objects: state.objects.map((o) =>
          o.id === action.id ? { ...o, ...action.updates } : o,
        ),
      };

    case "DELETE_OBJECT":
      return {
        ...state,
        objects: state.objects.filter((o) => o.id !== action.id),
        selectedObjectId:
          state.selectedObjectId === action.id ? null : state.selectedObjectId,
      };

    case "SELECT_OBJECT":
      return { ...state, selectedObjectId: action.id };

    case "SET_TOOL":
      return { ...state, activeTool: action.tool };

    case "SET_ZOOM":
      return { ...state, zoom: Math.max(0.25, Math.min(16, action.zoom)) };

    case "SET_PAN":
      return { ...state, pan: { x: action.x, y: action.y } };

    case "SET_TAB":
      return { ...state, activeTab: action.tab };

    case "SET_PROJECT_NAME":
      return { ...state, projectName: action.name };

    case "LOAD_PROJECT":
      return action.state;

    case "MAP":
      return { ...state, map: mapReducer(state.map, action.action) };

    default:
      return state;
  }
}

/** Max undo snapshots kept (bounds persisted project size). */
const HISTORY_CAP = 100;

/** Top-level actions that change only view/selection — never recorded. */
const VIEW_ACTIONS: Record<string, true> = {
  SET_ACTIVE_IMAGE: true, SELECT_SPRITE: true, DESELECT_ALL_SPRITES: true,
  SELECT_ANIMATION: true, SELECT_OBJECT: true, SET_TOOL: true, SET_ZOOM: true,
  SET_PAN: true, SET_TAB: true, SET_PROJECT_NAME: true, LOAD_PROJECT: true,
  UNDO: true,
};
/** Map sub-actions that change only view/selection. */
const MAP_VIEW: Record<string, true> = {
  SELECT_PALETTE: true, SELECT_PLACEMENT: true, SET_TOOL: true, SET_ZOOM: true,
  SET_PAN: true, SET_ACTIVE_LEVEL: true, SET_SHOW_ALL_LEVELS: true, LOAD_MAP: true,
};

/** Does this action mutate the document (and so belong in undo history)? */
function isRecordable(action: AppAction): boolean {
  if (VIEW_ACTIONS[action.type]) return false;
  if (action.type === "MAP") return !MAP_VIEW[action.action.type];
  return true;
}

/** Strip the undo stack — snapshots never nest their own history. */
function snapshotOf(state: AppState): ProjectSnapshot {
  const { history: _history, ...doc } = state;
  return doc;
}

/**
 * Wraps the base reducer with a persisted undo stack. Recordable
 * (document-mutating) actions push the pre-action snapshot; UNDO pops
 * the latest snapshot back into place until the stack is empty.
 */
function historyReducer(state: AppState, action: AppAction): AppState {
  if (action.type === "UNDO") {
    if (state.history.length === 0) return state;
    const prev = state.history[state.history.length - 1]!;
    return { ...prev, history: state.history.slice(0, -1) };
  }
  const next = reducer(state, action);
  if (next === state || !isRecordable(action)) return next;
  const history = [...state.history, snapshotOf(state)].slice(-HISTORY_CAP);
  return { ...next, history };
}

export function App() {
  const [state, dispatch] = useReducer(historyReducer, INITIAL_STATE);
  const [mode, setMode] = useState<"sprite" | "map" | "objects">(() => {
    const saved = localStorage.getItem("gamefoo-tools-mode");
    return saved === "map" || saved === "objects"
      ? saved
      : "sprite";
  });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(() =>
    getProjectId(),
  );
  const [showProjects, setShowProjects] = useState(false);
  const [showSaveScreen, setShowSaveScreen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  // ── Image element cache (all library images) ───────────

  const [imageMap, setImageMap] = useState<Map<string, HTMLImageElement>>(
    () => new Map(),
  );

  useEffect(() => {
    let cancelled = false;
    const next = new Map(imageMap);
    let changed = false;
    for (const img of state.images) {
      if (next.has(img.id)) continue;
      const el = new Image();
      el.onload = () => {
        if (!cancelled) setImageMap((m) => new Map(m).set(img.id, el));
      };
      el.src = img.url;
      next.set(img.id, el);
      changed = true;
    }
    for (const key of Array.from(next.keys())) {
      if (!state.images.some((i) => i.id === key)) {
        next.delete(key);
        changed = true;
      }
    }
    if (changed && !cancelled) setImageMap(next);
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.images]);

  const activeImageEl = useMemo(
    () =>
      state.activeImageId ? (imageMap.get(state.activeImageId) ?? null) : null,
    [state.activeImageId, imageMap],
  );

  const mapDispatch = useCallback(
    (a: Parameters<typeof mapReducer>[1]) => dispatch({ type: "MAP", action: a }),
    [],
  );

  // ── Load saved state on mount ──────────────────────────

  useEffect(() => {
    const saved = loadStateFromLocal();
    if (saved) {
      dispatch({ type: "LOAD_PROJECT", state: migrateSpriteState(saved) });
    }
    setInitialized(true);
  }, []);

  // ── Auto-save to localStorage (debounced) ──────────────

  useEffect(() => {
    if (!initialized) return;
    const timeout = setTimeout(() => {
      saveStateToLocal(state);
    }, 300);
    return () => clearTimeout(timeout);
  }, [state, initialized]);

  // ── Sync project ID to localStorage ────────────────────

  useEffect(() => {
    saveProjectId(currentProjectId);
  }, [currentProjectId]);

  // ── Persist mode ───────────────────────────────────────

  useEffect(() => {
    localStorage.setItem("gamefoo-tools-mode", mode);
  }, [mode]);

  // ── Global undo (Ctrl/Cmd+Z) ───────────────────────────

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "z" || e.shiftKey || !(e.metaKey || e.ctrlKey)) {
        return;
      }
      const el = e.target as HTMLElement | null;
      if (
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      dispatch({ type: "UNDO" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ── Upload images ──────────────────────────────────────

  const handleUploadImages = useCallback(
    async (files: FileList | File[] | null) => {
      if (!files) return;
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        try {
          const { path, name } = await uploadImage(file);
          const img = new Image();
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error("load failed"));
            img.src = path;
          });
          dispatch({
            type: "ADD_IMAGE",
            activate: true,
            image: {
              id: uid("img"),
              url: path,
              name,
              width: img.width,
              height: img.height,
            },
          });
        } catch (e) {
          console.error("Upload failed:", file.name, e);
        }
      }
    },
    [],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleUploadImages(e.target.files);
      e.target.value = "";
    },
    [handleUploadImages],
  );

  // ── Drag & drop ────────────────────────────────────────

  useEffect(() => {
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) handleUploadImages(files);
    };
    const handleDragOver = (e: DragEvent) => e.preventDefault();
    window.addEventListener("drop", handleDrop);
    window.addEventListener("dragover", handleDragOver);
    return () => {
      window.removeEventListener("drop", handleDrop);
      window.removeEventListener("dragover", handleDragOver);
    };
  }, [handleUploadImages]);

  // ── Save project (sprite library + map together) ───────

  const handleSave = useCallback(
    async (mode: "save" | "quick" = "save") => {
      setSaving(true);
      try {
        let projId = currentProjectId;
        if (!projId) {
          projId = uid("proj");
          setCurrentProjectId(projId);
        }
        await saveProject(projId, state);
        if (mode === "save") {
          setShowSaveScreen(true);
        } else {
          // QuickSave — silent confirmation
          setQuickSavedAt(Date.now());
        }
      } catch (e) {
        console.error("Save failed:", e);
        alert("Failed to save project to server");
      } finally {
        setSaving(false);
      }
    },
    [currentProjectId, state],
  );

  // ── QuickSave keyboard shortcut (Ctrl/Cmd+S) ───────────

  const [quickSavedAt, setQuickSavedAt] = useState<number | null>(null);
  const [flashQuickSaved, setFlashQuickSaved] = useState(false);

  useEffect(() => {
    if (quickSavedAt === null) return;
    setFlashQuickSaved(true);
    const t = setTimeout(() => setFlashQuickSaved(false), 1500);
    return () => clearTimeout(t);
  }, [quickSavedAt]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave("quick");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  // ── Open / new / import — reset BOTH editors ───────────

  const handleOpenProject = useCallback(async (id: string) => {
    const data = await loadProject(id);
    if (data) {
      dispatch({ type: "LOAD_PROJECT", state: migrateSpriteState(data) });
      setCurrentProjectId(id);
      setShowProjects(false);
    }
  }, []);

  const handleNewProject = useCallback(() => {
    dispatch({ type: "LOAD_PROJECT", state: { ...INITIAL_STATE } });
    setCurrentProjectId(null);
    setShowProjects(false);
  }, []);

  const handleImportFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = "";

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const raw = JSON.parse(reader.result as string);
          // Legacy map project files (kind: "map") — load just the map slice.
          if (raw && raw.kind === "map") {
            const data = migrateSpriteState({
              projectName: raw.projectName ?? "Imported Map",
              map: raw,
            });
            const projId = uid("proj");
            dispatch({ type: "LOAD_PROJECT", state: data });
            setCurrentProjectId(projId);
            await saveProject(projId, data);
            setShowProjects(false);
            setMode("map");
            return;
          }

          // Re-upload any data-URL images to the server
          const data = migrateSpriteState(raw);
          for (let i = 0; i < data.images.length; i++) {
            const img = data.images[i]!;
            if (img.url.startsWith("data:")) {
              const serverPath = await reuploadDataUrl(img.url, img.name || "imported.png");
              if (serverPath) img.url = serverPath;
            }
          }

          const projId = uid("proj");
          dispatch({ type: "LOAD_PROJECT", state: data });
          setCurrentProjectId(projId);
          await saveProject(projId, data);
          setShowProjects(false);
        } catch {
          alert("Invalid project file");
        }
      };
      reader.readAsText(file);
    },
    [],
  );

  return (
    <div className="app-root">
      <div className="mode-bar">
        <button
          className={`mode-btn ${mode === "sprite" ? "active" : ""}`}
          onClick={() => setMode("sprite")}
        >
          ▣ Sprite Editor
        </button>
        <button
          className={`mode-btn ${mode === "map" ? "active" : ""}`}
          onClick={() => setMode("map")}
        >
          ▦ Map Editor
        </button>
        <button
          className={`mode-btn ${mode === "objects" ? "active" : ""}`}
          onClick={() => setMode("objects")}
        >
          ⬡ Objects
        </button>
        <span className="mode-bar__project">
          {state.projectName}
          {currentProjectId ? "" : " (unsaved)"}
        </span>
      </div>
      <div className="mode-content">
        {mode === "sprite" ? (
          <div className="app-layout">
            {/* Title bar */}
            <div className="title-bar">
              <span className="title-bar__name">
                GameFoo Sprite Editor — {state.projectName}
              </span>
              <button
                className="btn btn-sm title-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                + Add Image
              </button>
              <button
                className="btn btn-sm title-btn"
                onClick={() => setShowProjects(true)}
              >
                Projects
              </button>
              <button
                className="btn btn-sm title-btn"
                onClick={() => handleSave("quick")}
                disabled={saving}
                title="QuickSave — Ctrl/Cmd+S (no export screen)"
              >
                QuickSave
              </button>
              <button
                className="btn btn-sm title-btn"
                onClick={() => handleSave("save")}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <input
              ref={importInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportFile}
            />

            {/* Main area */}
            <div className="main-area">
              <Toolbar state={state} dispatch={dispatch} />

              <TilemapCanvas
                state={state}
                dispatch={dispatch}
                image={activeImageEl}
                onMouseMove={setMousePos}
                onUploadClick={() => fileInputRef.current?.click()}
              />

              <div className="right-panel">
                <div className="panel-tabs">
                  {(
                    [
                      { key: "images", label: "Images" },
                      { key: "sprites", label: "Sprites" },
                      { key: "animations", label: "Anims" },
                      { key: "export", label: "Export" },
                    ] as const
                  ).map((t) => (
                    <div
                      key={t.key}
                      className={`panel-tab ${state.activeTab === t.key ? "active" : ""}`}
                      onClick={() =>
                        dispatch({ type: "SET_TAB", tab: t.key as never })
                      }
                    >
                      {t.label}
                    </div>
                  ))}
                </div>

                <div className="panel-content">
                  {state.activeTab === "images" && (
                    <ImageLibraryPanel state={state} dispatch={dispatch} />
                  )}
                  {state.activeTab === "sprites" && (
                    <SpritePanel
                      state={state}
                      dispatch={dispatch}
                      image={activeImageEl}
                    />
                  )}
                  {state.activeTab === "animations" && (
                    <AnimationPanel
                      state={state}
                      dispatch={dispatch}
                      image={activeImageEl}
                      imageMap={imageMap}
                    />
                  )}
                  {state.activeTab === "export" && (
                    <ExportPanel state={state} dispatch={dispatch} />
                  )}
                </div>
              </div>
            </div>

            <StatusBar state={state} mousePos={mousePos} />
          </div>
        ) : mode === "map" ? (
          <MapEditor
            state={state}
            dispatch={dispatch}
            mapDispatch={mapDispatch}
            imageMap={imageMap}
            projectId={currentProjectId}
            saving={saving}
            onSave={handleSave}
            onOpenProjects={() => setShowProjects(true)}
          />
        ) : (
          <ObjectExplorer
            state={state}
            dispatch={dispatch}
            imageMap={imageMap}
            projectId={currentProjectId}
            saving={saving}
            onSave={handleSave}
            onOpenProjects={() => setShowProjects(true)}
          />
        )}
      </div>

      {/* Overlays — shared */}
      {showProjects && (
        <ProjectManager
          currentId={currentProjectId}
          onOpen={handleOpenProject}
          onNew={handleNewProject}
          onImport={() => importInputRef.current?.click()}
          onClose={() => setShowProjects(false)}
        />
      )}
      {showSaveScreen && (
        <SaveScreen
          state={state}
          projectId={currentProjectId!}
          onClose={() => setShowSaveScreen(false)}
        />
      )}

      {/* QuickSave toast */}
      {flashQuickSaved && (
        <div className="quicksave-toast">✓ Saved</div>
      )}
    </div>
  );
}
