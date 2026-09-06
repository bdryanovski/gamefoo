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

/** Add a state; the first state added becomes the machine's initial. */
export function smAddState(
  m: StateMachineDef,
  state: StateNodeDef,
): StateMachineDef {
  return {
    ...m,
    states: [...m.states, state],
    initialStateId: m.initialStateId ?? state.id,
  };
}

export function smUpdateState(
  m: StateMachineDef,
  id: string,
  updates: Partial<Pick<StateNodeDef, "name" | "display" | "x" | "y">>,
): StateMachineDef {
  return {
    ...m,
    states: m.states.map((s) => (s.id === id ? { ...s, ...updates } : s)),
  };
}

/** Remove a state, pruning dangling transitions and fixing the initial. */
export function smRemoveState(m: StateMachineDef, id: string): StateMachineDef {
  const states = m.states.filter((s) => s.id !== id);
  const stateIds = new Set(states.map((s) => s.id));
  return {
    ...m,
    states,
    transitions: m.transitions.filter(
      (t) => stateIds.has(t.fromStateId) && stateIds.has(t.toStateId),
    ),
    initialStateId:
      m.initialStateId === id ? (states[0]?.id ?? null) : m.initialStateId,
  };
}

export function smAddTransition(
  m: StateMachineDef,
  transition: StateTransitionDef,
): StateMachineDef {
  return { ...m, transitions: [...m.transitions, transition] };
}

export function smUpdateTransition(
  m: StateMachineDef,
  id: string,
  updates: Partial<
    Pick<StateTransitionDef, "fromStateId" | "toStateId" | "condition">
  >,
): StateMachineDef {
  return {
    ...m,
    transitions: m.transitions.map((t) =>
      t.id === id ? { ...t, ...updates } : t,
    ),
  };
}

export function smRemoveTransition(
  m: StateMachineDef,
  id: string,
): StateMachineDef {
  return { ...m, transitions: m.transitions.filter((t) => t.id !== id) };
}

/** Drop/repair references to sprites & animations that no longer exist. */
export function sanitizeMachine(
  m: StateMachineDef,
  sprites: SpriteRegion[],
  animations: AnimationDef[],
): StateMachineDef {
  const spriteIds = new Set(sprites.map((s) => s.id));
  const animIds = new Set(animations.map((a) => a.id));
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
}
