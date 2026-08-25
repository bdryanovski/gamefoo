import React, { useEffect, useCallback } from "react";
import type { AppState, AppAction } from "../types";
import type { SMAction } from "./types";
import { makeState } from "./types";
import { StateMachineCanvas } from "./StateMachineCanvas";
import { StateMachinePanel } from "./StateMachinePanel";

interface Props {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  smDispatch: (a: SMAction) => void;
  imageMap: Map<string, HTMLImageElement>;
  projectId: string | null;
  saving: boolean;
  onSave: (mode?: "save" | "quick") => void;
  onOpenProjects: () => void;
}

export function StateMachineEditor({
  state,
  dispatch: _dispatch,
  smDispatch,
  imageMap,
  projectId,
  saving,
  onSave,
  onOpenProjects,
}: Props) {
  const sm = state.stateMachines;
  const machine = sm.machines.find((m) => m.id === sm.selectedMachineId) ?? null;
  const selectedState =
    machine?.states.find((s) => s.id === sm.selectedStateId) ?? null;

  const handleAddStateAt = useCallback(
    (x: number, y: number) => {
      if (!machine) return;
      const st = makeState(`state_${machine.states.length}`, x, y);
      smDispatch({ type: "ADD_STATE", machineId: machine.id, state: st });
    },
    [machine, smDispatch],
  );

  const handleCommitStatePos = useCallback(
    (id: string, x: number, y: number) => {
      if (!machine) return;
      smDispatch({
        type: "UPDATE_STATE",
        machineId: machine.id,
        id,
        updates: { x, y },
      });
    },
    [machine, smDispatch],
  );

  const handleSelectState = useCallback(
    (id: string | null) => smDispatch({ type: "SELECT_STATE", id }),
    [smDispatch],
  );

  // Delete key removes the selected state
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT")) return;
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      if (!machine || !selectedState) return;
      e.preventDefault();
      smDispatch({
        type: "REMOVE_STATE",
        machineId: machine.id,
        id: selectedState.id,
      });
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [machine, selectedState, smDispatch]);

  const totalStates = machine?.states.length ?? 0;
  const totalTransitions = machine?.transitions.length ?? 0;

  return (
    <div className="app-layout">
      {/* Title bar — shared project lifecycle */}
      <div className="title-bar">
        <span className="title-bar__name">
          GameFoo State Machines — {state.projectName}
          {projectId ? "" : " (unsaved)"}
        </span>
        <button className="btn btn-sm title-btn" onClick={onOpenProjects}>
          Projects
        </button>
        <button
          className="btn btn-sm title-btn"
          onClick={() => onSave("quick")}
          disabled={saving}
          title="QuickSave — Ctrl/Cmd+S (no export screen)"
        >
          QuickSave
        </button>
        <button
          className="btn btn-sm title-btn"
          onClick={() => onSave("save")}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Main area */}
      <div className="main-area">
        <StateMachineCanvas
          machine={machine}
          sprites={state.sprites}
          animations={state.animations}
          imageMap={imageMap}
          selectedStateId={sm.selectedStateId}
          onSelectState={handleSelectState}
          onCommitStatePos={handleCommitStatePos}
          onAddStateAt={handleAddStateAt}
        />

        <div className="right-panel">
          <div className="panel-tabs">
            <div className="panel-tab active">States</div>
          </div>
          <div className="panel-content">
            <StateMachinePanel
              state={state}
              imageMap={imageMap}
              smDispatch={smDispatch}
              machine={machine}
              selectedState={selectedState}
            />
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="status-bar">
        <div className="status-cell flex">
          {state.projectName} · machines {sm.machines.length}
        </div>
        <div className="status-cell">
          Machine: {machine?.name ?? "—"}
        </div>
        <div className="status-cell">
          Selected: {selectedState?.name ?? "—"}
          {selectedState && selectedState.id === machine?.initialStateId
            ? " (initial)"
            : ""}
        </div>
        <div className="status-cell">States: {totalStates}</div>
        <div className="status-cell">Transitions: {totalTransitions}</div>
      </div>
    </div>
  );
}
