import React, { useReducer, useCallback, useState, useEffect, useRef } from "react";
import type { AppState, AppAction, TabType } from "./types";
import { INITIAL_STATE } from "./types";
import { Toolbar } from "./components/Toolbar";
import { TilemapCanvas } from "./components/TilemapCanvas";
import { SpritePanel } from "./components/SpritePanel";
import { AnimationPanel } from "./components/AnimationPanel";
import { ExportPanel } from "./components/ExportPanel";
import { ObjectPanel } from "./components/ObjectPanel";
import { StatusBar } from "./components/StatusBar";
import { ProjectManager } from "./components/ProjectManager";
import { SaveScreen } from "./components/SaveScreen";
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
    case "SET_IMAGE":
      return {
        ...state,
        imageData: {
          url: action.url,
          name: action.name,
          width: action.width,
          height: action.height,
        },
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
      const animations = state.animations.map((a) => ({
        ...a,
        frames: a.frames.filter((f) => f !== action.id),
      }));
      const objects = state.objects.map((o) => ({
        ...o,
        sprites: o.sprites.filter((s) => s !== action.id),
      }));
      return {
        ...state,
        sprites: state.sprites.filter((s) => s.id !== action.id),
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
      const objects = state.objects.map((o) => ({
        ...o,
        animations: o.animations.filter((a) => a !== action.id),
      }));
      return {
        ...state,
        animations: state.animations.filter((a) => a.id !== action.id),
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
          state.selectedObjectId === action.id
            ? null
            : state.selectedObjectId,
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
      return { ...action.state };

    default:
      return state;
  }
}

const TABS: { key: TabType; label: string }[] = [
  { key: "sprites", label: "Sprites" },
  { key: "animations", label: "Anims" },
  { key: "objects", label: "Objects" },
  { key: "export", label: "Export" },
];

export function App() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(
    () => getProjectId(),
  );
  const [showProjects, setShowProjects] = useState(false);
  const [showSaveScreen, setShowSaveScreen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  // ── Load saved state on mount ──────────────────────────

  useEffect(() => {
    const saved = loadStateFromLocal();
    if (saved) {
      dispatch({ type: "LOAD_PROJECT", state: saved });
    }
    setInitialized(true);
  }, []);

  // ── Auto-load image when imageData.url changes ─────────

  useEffect(() => {
    if (!state.imageData?.url) {
      setImage(null);
      return;
    }
    const img = new Image();
    img.onload = () => setImage(img);
    img.onerror = () => setImage(null);
    img.src = state.imageData.url;
  }, [state.imageData?.url]);

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

  // ── Upload image to server ─────────────────────────────

  const handleUploadImage = useCallback(async (file: File) => {
    try {
      const { path, name } = await uploadImage(file);
      const img = new Image();
      img.onload = () => {
        setImage(img);
        dispatch({
          type: "SET_IMAGE",
          url: path,
          name,
          width: img.width,
          height: img.height,
        });
      };
      img.src = path;
    } catch (e) {
      console.error("Upload failed:", e);
      // Fallback: load directly as data URL
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        const img = new Image();
        img.onload = () => {
          setImage(img);
          dispatch({
            type: "SET_IMAGE",
            url,
            name: file.name,
            width: img.width,
            height: img.height,
          });
        };
        img.src = url;
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleUploadImage(file);
      e.target.value = "";
    },
    [handleUploadImage],
  );

  // ── Drag & drop ────────────────────────────────────────

  useEffect(() => {
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer?.files[0];
      if (file && file.type.startsWith("image/")) handleUploadImage(file);
    };
    const handleDragOver = (e: DragEvent) => e.preventDefault();
    window.addEventListener("drop", handleDrop);
    window.addEventListener("dragover", handleDragOver);
    return () => {
      window.removeEventListener("drop", handleDrop);
      window.removeEventListener("dragover", handleDragOver);
    };
  }, [handleUploadImage]);

  // ── Save project ───────────────────────────────────────

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      let projId = currentProjectId;
      if (!projId) {
        projId = uid("proj");
        setCurrentProjectId(projId);
      }
      await saveProject(projId, state);
      setShowSaveScreen(true);
    } catch (e) {
      console.error("Save failed:", e);
      alert("Failed to save project to server");
    } finally {
      setSaving(false);
    }
  }, [currentProjectId, state]);

  // ── Open project from manager ──────────────────────────

  const handleOpenProject = useCallback(
    async (id: string) => {
      const data = await loadProject(id);
      if (data) {
        dispatch({ type: "LOAD_PROJECT", state: data });
        setCurrentProjectId(id);
        setShowProjects(false);
      }
    },
    [],
  );

  // ── New project ────────────────────────────────────────

  const handleNewProject = useCallback(() => {
    dispatch({ type: "LOAD_PROJECT", state: { ...INITIAL_STATE } });
    setCurrentProjectId(null);
    setImage(null);
    setShowProjects(false);
  }, []);

  // ── Import project from JSON file ──────────────────────

  const handleImportClick = useCallback(() => {
    importInputRef.current?.click();
  }, []);

  const handleImportFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = "";

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const data = JSON.parse(reader.result as string) as AppState;

          // If the image URL is a data URL, re-upload it to the server
          if (data.imageData?.url?.startsWith("data:")) {
            const serverPath = await reuploadDataUrl(
              data.imageData.url,
              data.imageData.name || "imported.png",
            );
            if (serverPath) {
              data.imageData.url = serverPath;
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
    <div className="app-layout">
      {/* Title bar */}
      <div className="title-bar">
        <span className="title-bar__name">
          GameFoo Dev Tools — {state.projectName}
          {currentProjectId ? "" : " (unsaved)"}
        </span>
        <button className="btn btn-sm title-btn" onClick={handleFileClick}>
          Open Image
        </button>
        <button
          className="btn btn-sm title-btn"
          onClick={() => setShowProjects(true)}
        >
          Projects
        </button>
        <button
          className="btn btn-sm title-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
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
          image={image}
          onMouseMove={setMousePos}
          onUploadClick={handleFileClick}
        />

        <div className="right-panel">
          <div className="panel-tabs">
            {TABS.map((t) => (
              <div
                key={t.key}
                className={`panel-tab ${state.activeTab === t.key ? "active" : ""}`}
                onClick={() => dispatch({ type: "SET_TAB", tab: t.key })}
              >
                {t.label}
              </div>
            ))}
          </div>

          <div className="panel-content">
            {state.activeTab === "sprites" && (
              <SpritePanel state={state} dispatch={dispatch} image={image} />
            )}
            {state.activeTab === "animations" && (
              <AnimationPanel
                state={state}
                dispatch={dispatch}
                image={image}
              />
            )}
            {state.activeTab === "objects" && (
              <ObjectPanel state={state} dispatch={dispatch} />
            )}
            {state.activeTab === "export" && (
              <ExportPanel state={state} dispatch={dispatch} />
            )}
          </div>
        </div>
      </div>

      <StatusBar state={state} mousePos={mousePos} />

      {/* Overlays */}
      {showProjects && (
        <ProjectManager
          currentId={currentProjectId}
          onOpen={handleOpenProject}
          onNew={handleNewProject}
          onImport={handleImportClick}
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
    </div>
  );
}
