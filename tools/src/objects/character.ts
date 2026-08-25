import type {
  GameObjectDef,
  CharacterConfig,
  CharacterSlot,
  AnimationDef,
} from "../types";
import { makeObject } from "../types";
import type {
  StateMachineDef,
  StateNodeDef,
  StateTransitionDef,
} from "../statemachine/types";
import { uid } from "../utils/uid";

/** Standard character slots, in display + graph-layout order. */
export const STANDARD_SLOTS: {
  key: string;
  label: string;
  condition: string;
}[] = [
    { key: "idle", label: "Idle", condition: "idle" },
    { key: "up", label: "Up", condition: "move_up" },
    { key: "down", label: "Down", condition: "move_down" },
    { key: "left", label: "Left", condition: "move_left" },
    { key: "right", label: "Right", condition: "move_right" },
    { key: "sideways", label: "Sideways", condition: "move_side" },
    { key: "death", label: "Death", condition: "die" },
  ];

/** Fixed graph positions per standard slot (idle is the hub). */
const LAYOUT: Record<string, [number, number]> = {
  idle: [240, 170],
  up: [240, 40],
  down: [240, 300],
  left: [70, 170],
  right: [410, 170],
  sideways: [410, 40],
  death: [70, 300],
};

const CONDITION: Record<string, string> = Object.fromEntries(
  STANDARD_SLOTS.map((s) => [s.key, s.condition]),
);
const LABEL: Record<string, string> = Object.fromEntries(
  STANDARD_SLOTS.map((s) => [s.key, s.label]),
);

export function isCharacter(o: GameObjectDef): boolean {
  return o.character != null;
}

function emptyConfig(o: GameObjectDef): CharacterConfig {
  return o.character ?? { slots: {}, actions: [] };
}

/** Snake-case a user action name into a machine condition token. */
function conditionToken(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "action";
}

function slotDisplay(slot: CharacterSlot | undefined): StateNodeDef["display"] {
  if (!slot) return { kind: "sprite", spriteId: null };
  return slot.kind === "sprite"
    ? { kind: "sprite", spriteId: slot.id }
    : { kind: "animation", animationId: slot.id };
}

/**
 * Rebuild the object's embedded machine from its character slots as a
 * hub-and-spoke graph: idle is the initial hub, each filled slot is a
 * state with idle→slot (named condition) and slot→idle ("stop"). Node
 * positions are preserved by state id across regenerations.
 */
export function regenerateMachine(o: GameObjectDef): StateMachineDef {
  const config = emptyConfig(o);
  const prev = new Map(o.machine.states.map((s) => [s.id, s]));
  const states: StateNodeDef[] = [];
  const transitions: StateTransitionDef[] = [];
  const idleId = "st_idle";

  const node = (
    key: string,
    label: string,
    slot: CharacterSlot | undefined,
    pos: [number, number],
  ): StateNodeDef => {
    const id = `st_${key}`;
    const p = prev.get(id);
    return {
      id,
      name: label,
      display: slotDisplay(slot),
      x: p?.x ?? pos[0],
      y: p?.y ?? pos[1],
    };
  };
  const edge = (from: string, to: string, condition: string) =>
    transitions.push({ id: `tr_${from}_${to}`, fromStateId: from, toStateId: to, condition });

  // Idle hub is always present.
  states.push(node("idle", "Idle", config.slots["idle"], LAYOUT.idle!));

  for (const { key, label } of STANDARD_SLOTS) {
    if (key === "idle") continue;
    const slot = config.slots[key];
    if (!slot) continue;
    states.push(node(key, label, slot, LAYOUT[key]!));
    edge(idleId, `st_${key}`, CONDITION[key]!);
    edge(`st_${key}`, idleId, "stop");
  }

  config.actions.forEach((a, i) => {
    const slot = config.slots[a.id];
    if (!slot) return;
    states.push(node(a.id, a.name, slot, [560, 40 + i * 70]));
    edge(idleId, `st_${a.id}`, conditionToken(a.name));
    edge(`st_${a.id}`, idleId, "stop");
  });

  return {
    ...o.machine,
    name: o.name,
    states,
    transitions,
    initialStateId: idleId,
  };
}

/** Create a new character object (an object flagged with character config). */
export function makeCharacter(name: string): GameObjectDef {
  const base = makeObject(name);
  const withConfig: GameObjectDef = {
    ...base,
    meta: { ...base.meta, category: "character" },
    character: { slots: {}, actions: [] },
  };
  return { ...withConfig, machine: regenerateMachine(withConfig) };
}

/** Assign a slot to a sprite/animation, attach the asset, regenerate. */
export function assignSlot(
  o: GameObjectDef,
  key: string,
  slot: CharacterSlot,
): GameObjectDef {
  const config = emptyConfig(o);
  const sprites =
    slot.kind === "sprite" && !o.sprites.includes(slot.id)
      ? [...o.sprites, slot.id]
      : o.sprites;
  const animations =
    slot.kind === "animation" && !o.animations.includes(slot.id)
      ? [...o.animations, slot.id]
      : o.animations;
  const withConfig: GameObjectDef = {
    ...o,
    sprites,
    animations,
    character: { ...config, slots: { ...config.slots, [key]: slot } },
  };
  return { ...withConfig, machine: regenerateMachine(withConfig) };
}

export function clearSlot(o: GameObjectDef, key: string): GameObjectDef {
  const config = emptyConfig(o);
  const slots = { ...config.slots };
  delete slots[key];
  const withConfig: GameObjectDef = { ...o, character: { ...config, slots } };
  return { ...withConfig, machine: regenerateMachine(withConfig) };
}

export function addAction(o: GameObjectDef, name: string): GameObjectDef {
  const config = emptyConfig(o);
  const withConfig: GameObjectDef = {
    ...o,
    character: {
      ...config,
      actions: [...config.actions, { id: uid("act"), name }],
    },
  };
  return { ...withConfig, machine: regenerateMachine(withConfig) };
}

export function renameAction(
  o: GameObjectDef,
  actionId: string,
  name: string,
): GameObjectDef {
  const config = emptyConfig(o);
  const withConfig: GameObjectDef = {
    ...o,
    character: {
      ...config,
      actions: config.actions.map((a) => (a.id === actionId ? { ...a, name } : a)),
    },
  };
  return { ...withConfig, machine: regenerateMachine(withConfig) };
}

export function removeAction(o: GameObjectDef, actionId: string): GameObjectDef {
  const config = emptyConfig(o);
  const slots = { ...config.slots };
  delete slots[actionId];
  const withConfig: GameObjectDef = {
    ...o,
    character: {
      ...config,
      slots,
      actions: config.actions.filter((a) => a.id !== actionId),
    },
  };
  return { ...withConfig, machine: regenerateMachine(withConfig) };
}

/** Preview frames for a character: idle slot, else the first filled slot. */
export function characterPreviewFrames(
  o: GameObjectDef,
  animById: Map<string, AnimationDef>,
): { frames: string[]; duration: number } {
  const config = o.character;
  if (config) {
    const ordered = [
      config.slots["idle"],
      ...STANDARD_SLOTS.map((s) => config.slots[s.key]),
      ...config.actions.map((a) => config.slots[a.id]),
    ];
    const pick = ordered.find((s): s is CharacterSlot => s != null);
    if (pick) {
      if (pick.kind === "sprite") return { frames: [pick.id], duration: 0 };
      const a = animById.get(pick.id);
      if (a && a.frames.length > 0) return { frames: a.frames, duration: a.duration };
    }
  }
  return { frames: [], duration: 0 };
}
