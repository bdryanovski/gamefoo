import React, { useState, useMemo, useRef, useCallback } from "react";
import type {
  AppState,
  AppAction,
  AnimationDef,
  GameObjectDef,
  SpriteRegion,
} from "../types";
import { objectMachines } from "../types";
import type { MapAction, MachinePlacement } from "./types";
import { findPlacement, resolveMachineState, resolvePlacementDisplay } from "./types";
import type { DialogAction } from "../dialog/types";
import { allDialogMessages, findDialogMessage } from "../dialog/types";
import { DialogMessageCard } from "../dialog/DialogMessageCard";
import { ObjectPropertiesEditor } from "../objects/ObjectPropertiesEditor";
import { ObjectCollisionEditor } from "../objects/ObjectCollisionEditor";
import {
  MachineStateSelect,
  MachineOverrideFields,
  TextConfigFields,
  PlacementTransform,
} from "./PlacementFields";
import { AnimatedSpritePreview } from "../components/AnimatedSpritePreview";
import { Icon, ICON } from "../components/Icon";

/**
 * Floating placement inspector — the map editor's in-place editor for a
 * selected placement. For plain sprite/animation/text placements it offers
 * the Sprite tab (position, rotation, flips, text styling). When the
 * placement instances a game object (machine placement) it also opens:
 *
 *   Properties — the object's property map (the same one the Objects tab
 *                edits; writes update the object definition itself) plus
 *                this instance's overrides.
 *   Dialogs    — properties that reference a dialog message id, with the
 *                full message list in a dropdown and the referenced
 *                message's sub-messages/options editable inline.
 *   Collisions — the object's per-state collision volumes (edits affect
 *                every instance of the object on every map).
 *
 * All edits flow through the regular app/map/dialog actions — the inspector
 * owns no data of its own beyond window position and the active tab.
 */

type InspectorTab = "sprite" | "properties" | "dialogs" | "collisions";

/** Fields a placement edit can carry (position, transform, machine config, text style). */
type PlacementUpdates = NonNullable<
  Extract<MapAction, { type: "UPDATE_PLACEMENT" }>["updates"]
>;

const INSPECTOR_WIDTH = 320;
const POS_STORAGE_KEY = "gamefoo-inspector-pos";

/** Clamp so the window always keeps a grip inside the viewport. */
function clampPos(x: number, y: number): { x: number; y: number } {
  const maxX = Math.max(0, window.innerWidth - 60);
  const maxY = Math.max(0, window.innerHeight - 40);
  return {
    x: Math.min(maxX, Math.max(0, x)),
    y: Math.min(maxY, Math.max(0, y)),
  };
}

function loadPos(): { x: number; y: number } {
  try {
    const raw = localStorage.getItem(POS_STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as { x?: unknown; y?: unknown };
      if (typeof p.x === "number" && typeof p.y === "number") {
        return clampPos(p.x, p.y);
      }
    }
  } catch {
    // corrupted entry — fall through to the default spot
  }
  return clampPos(window.innerWidth - INSPECTOR_WIDTH - 24, 120);
}

/** Property keys that are considered dialog references by name. */
const DIALOG_KEY_RE = /dialog|message|msg/i;

interface Props {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  mapDispatch: (a: MapAction) => void;
  dialogDispatch: (a: DialogAction) => void;
  imageMap: Map<string, HTMLImageElement>;
  onClose: () => void;
}

export function PlacementInspector({
  state,
  dispatch,
  mapDispatch,
  dialogDispatch,
  imageMap,
  onClose,
}: Props) {
  const map = state.map;
  const [tab, setTab] = useState<InspectorTab>("sprite");
  const [pos, setPos] = useState<{ x: number; y: number }>(loadPos);
  const dragRef = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);

  const spriteById = useMemo(
    () => new Map(state.sprites.map((s) => [s.id, s])),
    [state.sprites],
  );
  const animById = useMemo(
    () => new Map(state.animations.map((a) => [a.id, a])),
    [state.animations],
  );

  const sel = findPlacement(map, map.selectedPlacementId);
  const placement = sel?.placement ?? null;
  const screenKey = sel?.screenKey;

  const machinePlacement = placement?.kind === "machine" ? placement : null;
  const object =
    machinePlacement != null
      ? (state.objects.find((o) => o.machine.id === machinePlacement.machineId) ?? null)
      : null;

  const updatePlacement = useCallback(
    (updates: PlacementUpdates) => {
      if (!placement || !screenKey) return;
      mapDispatch({
        type: "UPDATE_PLACEMENT",
        screenKey,
        id: placement.id,
        updates,
      });
    },
    [placement, screenKey, mapDispatch],
  );

  const removePlacement = useCallback(() => {
    if (!placement || !screenKey) return;
    mapDispatch({ type: "REMOVE_PLACEMENT", screenKey, id: placement.id });
  }, [placement, screenKey, mapDispatch]);

  // ── Window dragging (title bar) ────────────────────────

  const onTitlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Don't hijack clicks on the title bar's own controls (close button):
      // capturing the pointer here would retarget the follow-up mouse events
      // away from the button and its click would never fire.
      if ((e.target as HTMLElement).closest("button")) return;
      dragRef.current = { px: e.clientX, py: e.clientY, ox: pos.x, oy: pos.y };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [pos],
  );

  const onTitlePointerMove = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    setPos(clampPos(d.ox + (e.clientX - d.px), d.oy + (e.clientY - d.py)));
  }, []);

  const onTitlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // pointer already released — ignore
    }
    setPos((p) => {
      localStorage.setItem(POS_STORAGE_KEY, JSON.stringify(p));
      return p;
    });
  }, []);

  // ── Tab availability ───────────────────────────────────

  const tabs: InspectorTab[] = object
    ? ["sprite", "properties", "dialogs", "collisions"]
    : ["sprite"];
  const activeTab: InspectorTab = tabs.includes(tab) ? tab : "sprite";

  if (!placement || !screenKey) return null;

  const display = resolvePlacementDisplay(
    placement,
    state.sprites,
    state.animations,
    objectMachines(state.objects),
  );
  const previewSprite = display.spriteId ? spriteById.get(display.spriteId) : undefined;
  const previewAnim = display.animationId ? animById.get(display.animationId) : undefined;
  const previewFrames =
    previewAnim && previewAnim.frames.length > 0
      ? previewAnim.frames
      : previewSprite
        ? [previewSprite.id]
        : [];
  const previewDuration = previewAnim?.duration ?? 0;

  const title =
    object?.name ??
    (placement.kind === "sprite"
      ? (spriteById.get(placement.spriteId)?.name ?? "Sprite")
      : placement.kind === "animation"
        ? (animById.get(placement.animationId)?.name ?? "Animation")
        : placement.kind === "text"
          ? "Text label"
          : "Object");

  return (
    <div
      className="placement-inspector"
      style={{ left: pos.x, top: pos.y, width: INSPECTOR_WIDTH }}
      role="dialog"
      aria-label={`Placement inspector — ${title}`}
    >
      {/* Title bar — drag to move */}
      <div
        className="inspector-title"
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={onTitlePointerUp}
        onPointerCancel={onTitlePointerUp}
      >
        <Icon name={object ? "objects" : placement.kind === "text" ? "draw" : "sprite-editor"} size={ICON.sm} />
        <span className="inspector-title__name">{title}</span>
        {object && <span className="text-xs">object</span>}
        <button
          className="btn btn-sm"
          title="Deselect placement"
          onClick={onClose}
        >
          <Icon name="close" size={ICON.xs} />
        </button>
      </div>

      {/* Tabs */}
      <div className="inspector-tabs">
        {tabs.map((t) => (
          <div
            key={t}
            className={`inspector-tab ${activeTab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "sprite"
              ? "Sprite"
              : t === "properties"
                ? "Properties"
                : t === "dialogs"
                  ? "Dialogs"
                  : "Collisions"}
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="inspector-body panel-content">
        {activeTab === "sprite" && (
          <div className="col gap-md">
            {previewFrames.length > 0 && (
              <div className="row" style={{ gap: 8, alignItems: "center", padding: 4 }}>
                <div className="asset-thumb" style={{ width: 44, height: 44, cursor: "default" }}>
                  <AnimatedSpritePreview
                    frames={previewFrames}
                    duration={previewDuration}
                    spriteById={spriteById}
                    imageMap={imageMap}
                    size={42}
                    transform={{
                      flipX: placement.flipX,
                      flipY: placement.flipY,
                      rotation: placement.rotation,
                    }}
                  />
                </div>
                <div className="col text-xs text-dim" style={{ gap: 2 }}>
                  <span>{title}</span>
                  {previewSprite && (
                    <span>
                      {previewSprite.width}×{previewSprite.height}px
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="text-xs text-dim" style={{ padding: "2px 4px" }}>
              Screen {screenKey} · layer {placement.level}:{" "}
              {map.layers[placement.level]?.name ?? "?"}
              {map.layers[placement.level]?.visible === false ? " (hidden)" : ""}
            </div>

            {object && machinePlacement && (
              <MachineStateSelect
                object={object}
                stateName={machinePlacement.stateName}
                onState={(name) => updatePlacement({ stateName: name })}
              />
            )}

            {placement.kind === "text" && (
              <TextConfigFields value={placement} onChange={(patch) => updatePlacement(patch)} />
            )}

            <PlacementTransform
              placement={placement}
              layers={map.layers}
              onChange={updatePlacement}
              onDelete={removePlacement}
            />
          </div>
        )}

        {activeTab === "properties" && object && machinePlacement && (
          <PropertiesTab
            object={object}
            machinePlacement={machinePlacement}
            dispatch={dispatch}
            updatePlacement={updatePlacement}
          />
        )}

        {activeTab === "dialogs" && object && machinePlacement && (
          <DialogsTab
            key={placement.id}
            state={state}
            object={object}
            machinePlacement={machinePlacement}
            dispatch={dispatch}
            updatePlacement={updatePlacement}
            dialogDispatch={dialogDispatch}
          />
        )}

        {activeTab === "collisions" && object && machinePlacement && (
          <CollisionsTab
            key={placement.id}
            state={state}
            object={object}
            machinePlacement={machinePlacement}
            dispatch={dispatch}
            spriteById={spriteById}
            animById={animById}
            imageMap={imageMap}
          />
        )}
      </div>
    </div>
  );
}

/** ── Properties tab ──────────────────────────────────────── */

function PropertiesTab({
  object,
  machinePlacement,
  dispatch,
  updatePlacement,
}: {
  object: GameObjectDef;
  machinePlacement: MachinePlacement;
  dispatch: React.Dispatch<AppAction>;
  updatePlacement: (updates: PlacementUpdates) => void;
}) {
  return (
    <div className="col gap-md">
      <div className="section">
        <div className="section-title">Object Properties</div>
        <ObjectPropertiesEditor
          properties={object.properties}
          onChange={(properties) =>
            dispatch({ type: "UPDATE_OBJECT", id: object.id, updates: { properties } })
          }
        />
        <div className="text-xs text-dim" style={{ padding: "2px 4px" }}>
          These live on the object — every placed instance inherits them.
        </div>
      </div>
      <div className="section">
        <MachineOverrideFields
          title="This Instance"
          object={object}
          properties={machinePlacement.properties}
          onProperties={(properties) => updatePlacement({ properties })}
        />
        <div className="text-xs text-dim" style={{ padding: "2px 4px" }}>
          ● marks keys this instance overrides — reset with ↺ to follow the
          object again.
        </div>
      </div>
    </div>
  );
}

/** ── Dialogs tab ─────────────────────────────────────────── */

function DialogsTab({
  state,
  object,
  machinePlacement,
  dispatch,
  updatePlacement,
  dialogDispatch,
}: {
  state: AppState;
  object: GameObjectDef;
  machinePlacement: MachinePlacement;
  dispatch: React.Dispatch<AppAction>;
  updatePlacement: (updates: PlacementUpdates) => void;
  dialogDispatch: (a: DialogAction) => void;
}) {
  // Per-key browsing focus: property key → message id being viewed (set by
  // following an option link). Unset keys view the property's own target.
  const [focus, setFocus] = useState<Record<string, string>>({});

  const effectiveProps: Record<string, string> = {
    ...object.properties,
    ...(machinePlacement.properties ?? {}),
  };
  const allMessages = useMemo(() => allDialogMessages(state.dialog.trees), [state.dialog.trees]);
  const messageIndex = useMemo(
    () => new Map(allMessages.map(({ message }) => [message.id, message])),
    [allMessages],
  );

  const dialogKeys = Object.keys(effectiveProps).filter(
    (key) =>
      messageIndex.has(effectiveProps[key]!) ||
      DIALOG_KEY_RE.test(key),
  );

  /** Change where a property points — written to the instance override when
   *  one exists, else to the object definition. */
  const setPropValue = (key: string, value: string) => {
    if (machinePlacement.properties?.[key] !== undefined) {
      updatePlacement({ properties: { ...machinePlacement.properties, [key]: value } });
    } else {
      dispatch({
        type: "UPDATE_OBJECT",
        id: object.id,
        updates: { properties: { ...object.properties, [key]: value } },
      });
    }
    setFocus((f) => ({ ...f, [key]: value }));
  };

  if (dialogKeys.length === 0) {
    return (
      <div className="col gap-md">
        <div className="section">
          <div className="section-title">Dialog References</div>
          <div className="text-xs text-dim" style={{ padding: "4px" }}>
            No dialog references yet. A property counts as one when its value
            is a message id from the Dialog tab (or its key mentions
            dialog/message). Add one in the Properties tab — e.g. key
            "dialogId" — then pick a message here.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col gap-md">
      {dialogKeys.map((key) => {
        const value = effectiveProps[key]!;
        const overridden = machinePlacement.properties?.[key] !== undefined;
        const viewId = focus[key] ?? value;
        const found = findDialogMessage(state.dialog.trees, viewId);
        const viewingLinked = viewId !== value;
        return (
          <div className="section" key={key}>
            <div className="section-title">
              <span>{key}</span>
              <span className="text-xs text-dim">
                {overridden ? "● instance" : "object"}
              </span>
            </div>
            <div className="field-row">
              <span className="field-label">Msg:</span>
              <select
                className="input input-sm input-full"
                value={value}
                title="Which dialog message this property points at"
                onChange={(e) => setPropValue(key, e.target.value)}
              >
                {!messageIndex.has(value) && (
                  <option value={value}>{value || "— none —"} (not a message id)</option>
                )}
                {state.dialog.trees.map((t) => (
                  <optgroup key={t.id} label={t.name}>
                    {t.messages.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title || "(untitled)"} — {m.id}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {found ? (
              <>
                {viewingLinked && (
                  <div className="field-row">
                    <span className="text-xs text-dim">Viewing a linked message</span>
                    <button
                      className="btn btn-sm"
                      onClick={() => setFocus((f) => ({ ...f, [key]: value }))}
                    >
                      <Icon name="undo" size={ICON.xs} /> Back to property target
                    </button>
                  </div>
                )}
                <DialogMessageCard
                  tree={found.tree}
                  message={found.message}
                  selectedTreeId={state.dialog.selectedTreeId}
                  dialogDispatch={dialogDispatch}
                  onNavigate={(id) => setFocus((f) => ({ ...f, [key]: id }))}
                />
              </>
            ) : (
              <div className="text-xs text-dim" style={{ padding: "2px 4px" }}>
                No message with id "{value || "—"}" — pick one above to link
                this property to a dialog.
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** ── Collisions tab ─────────────────────────────────────── */

function CollisionsTab({
  state,
  object,
  machinePlacement,
  dispatch,
  spriteById,
  animById,
  imageMap,
}: {
  state: AppState;
  object: GameObjectDef;
  machinePlacement: MachinePlacement;
  dispatch: React.Dispatch<AppAction>;
  spriteById: Map<string, SpriteRegion>;
  animById: Map<string, AnimationDef>;
  imageMap: Map<string, HTMLImageElement>;
}) {
  // Defaults to the state this instance shows; editable to any state.
  const [stateId, setStateId] = useState<string | null>(
    () => resolveMachineState(object.machine, machinePlacement.stateName)?.id ?? null,
  );

  return (
    <div className="col gap-md">
      <div className="section">
        <div className="section-title">
          <span>State</span>
          <select
            className="input input-sm"
            value={stateId ?? ""}
            onChange={(e) => setStateId(e.target.value || null)}
          >
            {object.machine.states.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
                {s.id === object.machine.initialStateId ? " (idle)" : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="text-xs text-dim" style={{ padding: "2px 4px" }}>
          Edits the object definition — every instance of {object.name} on
          every map uses these collisions.
        </div>
      </div>
      <ObjectCollisionEditor
        object={object}
        stateId={stateId}
        layers={state.collisionLayers}
        dispatch={dispatch}
        spriteById={spriteById}
        animById={animById}
        imageMap={imageMap}
      />
    </div>
  );
}
