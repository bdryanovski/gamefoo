import { uid } from "../utils/uid";
import type { AnimationDef, SpriteRegion } from "../types";

/**
 * State Machine definitions — part of the unified project.
 *
 * A machine has STATES (what to display: a single static sprite or an
 * animation) and TRANSITIONS (named conditions). Conditions are
 * engine-controlled: the developer triggers them from game code, e.g.
 * `machine.set("ignite")` — the editor only names them.
 */

export interface StateNodeDef {
  id: string;
  name: string;
  /** What this state renders: one static sprite, or an animation. */
  display:
    | { kind: "sprite"; spriteId: string | null }
    | { kind: "animation"; animationId: string | null };
  /** Editor graph position. */
  x: number;
  y: number;
}

export interface StateTransitionDef {
  id: string;
  fromStateId: string;
  toStateId: string;
  /** Engine-controlled condition name, e.g. "ignite", "on_interact". */
  condition: string;
}

export interface StateMachineDef {
  id: string;
  name: string;
  states: StateNodeDef[];
  transitions: StateTransitionDef[];
  initialStateId: string | null;
}

export interface StateMachinesState {
  machines: StateMachineDef[];
  selectedMachineId: string | null;
  selectedStateId: string | null;
}

export const INITIAL_SM_STATE: StateMachinesState = {
  machines: [],
  selectedMachineId: null,
  selectedStateId: null,
};

export type SMAction =
  | { type: "ADD_MACHINE"; machine: StateMachineDef }
  | { type: "REMOVE_MACHINE"; id: string }
  | {
      type: "UPDATE_MACHINE";
      id: string;
      updates: Partial<Pick<StateMachineDef, "name" | "initialStateId">>;
    }
  | { type: "ADD_STATE"; machineId: string; state: StateNodeDef }
  | {
      type: "UPDATE_STATE";
      machineId: string;
      id: string;
      updates: Partial<Pick<StateNodeDef, "name" | "display" | "x" | "y">>;
    }
  | { type: "REMOVE_STATE"; machineId: string; id: string }
  | { type: "ADD_TRANSITION"; machineId: string; transition: StateTransitionDef }
  | {
      type: "UPDATE_TRANSITION";
      machineId: string;
      id: string;
      updates: Partial<
        Pick<StateTransitionDef, "fromStateId" | "toStateId" | "condition">
      >;
    }
  | { type: "REMOVE_TRANSITION"; machineId: string; id: string }
  | { type: "SELECT_MACHINE"; id: string | null }
  | { type: "SELECT_STATE"; id: string | null };

export function makeState(name: string, x: number, y: number): StateNodeDef {
  return {
    id: uid("st"),
    name,
    display: { kind: "sprite", spriteId: null },
    x,
    y,
  };
}

export function makeStateMachine(name: string): StateMachineDef {
  const first = makeState("state_0", 80, 80);
  return {
    id: uid("sm"),
    name,
    states: [first],
    transitions: [],
    initialStateId: first.id,
  };
}

export function smReducer(
  state: StateMachinesState,
  action: SMAction,
): StateMachinesState {
  switch (action.type) {
    case "ADD_MACHINE":
      return {
        ...state,
        machines: [...state.machines, action.machine],
        selectedMachineId: action.machine.id,
        selectedStateId: action.machine.states[0]?.id ?? null,
      };

    case "REMOVE_MACHINE": {
      const machines = state.machines.filter((m) => m.id !== action.id);
      const nextSelected =
        state.selectedMachineId === action.id
          ? (machines[0]?.id ?? null)
          : state.selectedMachineId;
      return {
        ...state,
        machines,
        selectedMachineId: nextSelected,
        selectedStateId:
          nextSelected === state.selectedMachineId
            ? state.selectedStateId
            : (machines[0]?.states[0]?.id ?? null),
      };
    }

    case "UPDATE_MACHINE":
      return {
        ...state,
        machines: state.machines.map((m) =>
          m.id === action.id ? { ...m, ...action.updates } : m,
        ),
      };

    case "ADD_STATE":
      return {
        ...state,
        machines: state.machines.map((m) =>
          m.id === action.machineId
            ? {
                ...m,
                states: [...m.states, action.state],
                initialStateId: m.initialStateId ?? action.state.id,
              }
            : m,
        ),
        selectedStateId: action.state.id,
      };

    case "UPDATE_STATE":
      return {
        ...state,
        machines: state.machines.map((m) =>
          m.id === action.machineId
            ? {
                ...m,
                states: m.states.map((s) =>
                  s.id === action.id ? { ...s, ...action.updates } : s,
                ),
              }
            : m,
        ),
      };

    case "REMOVE_STATE":
      return {
        ...state,
        machines: state.machines.map((m) => {
          if (m.id !== action.machineId) return m;
          const states = m.states.filter((s) => s.id !== action.id);
          const stateIds = new Set(states.map((s) => s.id));
          return {
            ...m,
            states,
            transitions: m.transitions.filter(
              (t) =>
                stateIds.has(t.fromStateId) && stateIds.has(t.toStateId),
            ),
            initialStateId:
              m.initialStateId === action.id
                ? (states[0]?.id ?? null)
                : m.initialStateId,
          };
        }),
        selectedStateId:
          state.selectedStateId === action.id
            ? null
            : state.selectedStateId,
      };

    case "ADD_TRANSITION":
      return {
        ...state,
        machines: state.machines.map((m) =>
          m.id === action.machineId
            ? { ...m, transitions: [...m.transitions, action.transition] }
            : m,
        ),
      };

    case "UPDATE_TRANSITION":
      return {
        ...state,
        machines: state.machines.map((m) =>
          m.id === action.machineId
            ? {
                ...m,
                transitions: m.transitions.map((t) =>
                  t.id === action.id ? { ...t, ...action.updates } : t,
                ),
              }
            : m,
        ),
      };

    case "REMOVE_TRANSITION":
      return {
        ...state,
        machines: state.machines.map((m) =>
          m.id === action.machineId
            ? {
                ...m,
                transitions: m.transitions.filter(
                  (t) => t.id !== action.id,
                ),
              }
            : m,
        ),
      };

    case "SELECT_MACHINE": {
      const machine = state.machines.find((m) => m.id === action.id) ?? null;
      return {
        ...state,
        selectedMachineId: action.id,
        selectedStateId: machine?.states[0]?.id ?? null,
      };
    }

    case "SELECT_STATE":
      return { ...state, selectedStateId: action.id };

    default:
      return state;
  }
}

/** Drop/repair references to sprites & animations that no longer exist. */
export function sanitizeStateMachines(
  sm: StateMachinesState | null | undefined,
  sprites: SpriteRegion[],
  animations: AnimationDef[],
): StateMachinesState {
  const spriteIds = new Set(sprites.map((s) => s.id));
  const animIds = new Set(animations.map((a) => a.id));

  const machines = (sm?.machines ?? []).map((m) => {
    const states = (m.states ?? []).map((st) => ({
      ...st,
      display:
        st.display?.kind === "animation"
          ? {
              kind: "animation" as const,
              animationId:
                st.display.animationId && animIds.has(st.display.animationId)
                  ? st.display.animationId
                  : null,
            }
          : {
              kind: "sprite" as const,
              spriteId:
                st.display?.kind === "sprite" &&
                st.display.spriteId &&
                spriteIds.has(st.display.spriteId)
                  ? st.display.spriteId
                  : null,
            },
    }));
    const stateIds = new Set(states.map((s) => s.id));
    return {
      ...m,
      states,
      transitions: (m.transitions ?? []).filter(
        (t) => stateIds.has(t.fromStateId) && stateIds.has(t.toStateId),
      ),
      initialStateId:
        m.initialStateId && stateIds.has(m.initialStateId)
          ? m.initialStateId
          : (states[0]?.id ?? null),
    };
  });

  const machineIds = new Set(machines.map((m) => m.id));
  const selectedMachineId =
    sm?.selectedMachineId && machineIds.has(sm.selectedMachineId)
      ? sm.selectedMachineId
      : (machines[0]?.id ?? null);
  const selMachine = machines.find((m) => m.id === selectedMachineId);
  const selectedStateId =
    sm?.selectedStateId &&
    selMachine?.states.some((s) => s.id === sm.selectedStateId)
      ? sm.selectedStateId
      : (selMachine?.states[0]?.id ?? null);

  return { machines, selectedMachineId, selectedStateId };
}

/** Accepts persisted state machine data of any shape. */
export function migrateStateMachines(
  raw: unknown,
  sprites: SpriteRegion[],
  animations: AnimationDef[],
): StateMachinesState {
  return sanitizeStateMachines(
    raw as StateMachinesState | null | undefined,
    sprites,
    animations,
  );
}
