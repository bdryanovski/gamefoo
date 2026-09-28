import React from "react";
import type { GameObjectDef } from "../types";
import type { MapLayer, MapPlacement, TextStyle } from "./types";
import { resolveMachineState, TEXT_FONTS } from "./types";

/**
 * Shared placement-editing field groups — the single source of truth for
 * machine state/property-override rows, text styling rows and placement
 * transform rows. Used by the map palette (brush config) and the floating
 * placement inspector so both always behave identically.
 */

/** Which state a machine placement (or the paint brush) shows. */
export function MachineStateSelect({
  object,
  stateName,
  onState,
}: {
  object: GameObjectDef;
  stateName?: string;
  onState: (name: string) => void;
}) {
  return (
    <div className="field-row">
      <span className="field-label">State:</span>
      <select
        className="input input-sm input-full"
        value={stateName ?? resolveMachineState(object.machine)?.name ?? ""}
        onChange={(e) => onState(e.target.value)}
      >
        {object.machine.states.map((s) => (
          <option key={s.id} value={s.name}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Property rows over an object's property keys. `properties` holds only
 * per-placement overrides; blank keys fall back to the object's values and
 * a ● marker shows which keys are overridden.
 */
export function MachineOverrideFields({
  object,
  properties,
  onProperties,
  title = "Properties",
}: {
  object: GameObjectDef;
  properties?: Record<string, string>;
  onProperties: (props: Record<string, string>) => void;
  /** Section heading (e.g. "Properties" vs "Instance overrides"). */
  title?: string;
}) {
  const keys = Object.keys(object.properties);
  return (
    <>
      <div className="section-title" style={{ marginTop: 4 }}>
        {title}
      </div>
      {keys.length === 0 && (
        <div className="text-xs text-dim" style={{ padding: "2px 4px" }}>
          No properties on this object. Define them in the Objects tab.
        </div>
      )}
      {keys.map((key) => {
        const overridden = properties?.[key] !== undefined;
        const value = overridden ? properties![key]! : object.properties[key]!;
        return (
          <div className="field-row" key={key}>
            <span
              className="field-label"
              title={overridden ? "Overridden" : "Inherited from the object"}
            >
              {overridden ? "● " : ""}
              {key}:
            </span>
            <input
              type="text"
              className="input input-sm input-full"
              value={value}
              onChange={(e) => onProperties({ ...(properties ?? {}), [key]: e.target.value })}
            />
            <button
              className="btn btn-sm"
              title="Reset to object default"
              disabled={!overridden}
              onClick={() => {
                const next = { ...(properties ?? {}) };
                delete next[key];
                onProperties(next);
              }}
            >
              ↺
            </button>
          </div>
        );
      })}
    </>
  );
}

/**
 * State + property overrides shared by the placement editor (edits one
 * placed instance) and the palette brush (configures what new placements
 * inherit).
 */
export function MachineConfigFields({
  object,
  stateName,
  properties,
  onState,
  onProperties,
}: {
  object: GameObjectDef;
  stateName?: string;
  properties?: Record<string, string>;
  onState: (name: string) => void;
  onProperties: (props: Record<string, string>) => void;
}) {
  return (
    <>
      <MachineStateSelect object={object} stateName={stateName} onState={onState} />
      <MachineOverrideFields object={object} properties={properties} onProperties={onProperties} />
    </>
  );
}

/**
 * Text styling controls shared by the text brush (configures new labels) and
 * the placement editor (edits one placed label): content, font, size, colour,
 * alignment. `onChange` receives only the changed fields.
 */
export function TextConfigFields({
  value,
  onChange,
}: {
  value: TextStyle;
  onChange: (patch: Partial<TextStyle>) => void;
}) {
  return (
    <>
      <div className="field-row">
        <span className="field-label">Text:</span>
        <input
          type="text"
          className="input input-full"
          value={value.text}
          onChange={(e) => onChange({ text: e.target.value })}
        />
      </div>
      <div className="field-row">
        <span className="field-label">Font:</span>
        <select
          className="input"
          value={value.font}
          onChange={(e) => onChange({ font: e.target.value })}
        >
          {TEXT_FONTS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>
      <div className="field-row">
        <span className="field-label">Size:</span>
        <input
          type="number"
          className="input input-sm"
          min={1}
          max={512}
          value={value.fontSize}
          onChange={(e) =>
            onChange({ fontSize: Math.max(1, Math.min(512, Number(e.target.value) || 1)) })
          }
        />
        <span className="text-xs text-dim">px</span>
        <span className="field-label">Color:</span>
        <input
          type="color"
          className="input input-sm"
          value={value.color}
          onChange={(e) => onChange({ color: e.target.value })}
        />
      </div>
      <div className="field-row">
        <span className="field-label">Align:</span>
        {(["left", "center", "right"] as const).map((a) => (
          <button
            key={a}
            className={`btn btn-sm ${value.align === a ? "active" : ""}`}
            onClick={() => onChange({ align: a })}
          >
            {a}
          </button>
        ))}
      </div>
    </>
  );
}

/** Fields a placement transform edit can carry (position/level/orientation). */
export type PlacementTransformUpdates = Partial<
  Pick<MapPlacement, "x" | "y" | "level" | "rotation" | "flipX" | "flipY">
>;

/**
 * Transform controls for one placed item: position, stacking layer,
 * rotation, flips, reset and delete. Shared by every placement editor.
 */
export function PlacementTransform({
  placement,
  layers,
  onChange,
  onDelete,
}: {
  placement: MapPlacement;
  /** The map's ordered layers (index = stacking level). */
  layers: MapLayer[];
  onChange: (updates: PlacementTransformUpdates) => void;
  onDelete: () => void;
}) {
  return (
    <>
      <div className="field-row">
        <span className="field-label">X:</span>
        <input
          type="number"
          className="input input-sm"
          value={placement.x}
          onChange={(e) => onChange({ x: Math.max(0, Number(e.target.value) || 0) })}
        />
        <span className="field-label">Y:</span>
        <input
          type="number"
          className="input input-sm"
          value={placement.y}
          onChange={(e) => onChange({ y: Math.max(0, Number(e.target.value) || 0) })}
        />
      </div>

      <div className="field-row">
        <span className="field-label">Layer:</span>
        <select
          className="input input-sm input-full"
          value={placement.level}
          title="Which map layer this sits on — higher layers render on top"
          onChange={(e) => onChange({ level: Math.max(0, Number(e.target.value) || 0) })}
        >
          {layers.map((l, i) => (
            <option key={i} value={i}>
              {i}: {l.name}
              {l.visible ? "" : " (hidden)"}
            </option>
          ))}
          {placement.level >= layers.length && (
            <option value={placement.level}>
              {placement.level}: (missing layer)
            </option>
          )}
        </select>
      </div>

      <div className="field-row">
        <span className="field-label">Rot:</span>
        <input
          type="number"
          className="input input-sm"
          step={15}
          value={placement.rotation ?? 0}
          onChange={(e) => onChange({ rotation: Number(e.target.value) || 0 })}
        />
        <span className="text-xs text-dim">deg</span>
        <button
          className="btn btn-sm"
          title="Rotate 90° clockwise (R)"
          onClick={() => onChange({ rotation: ((placement.rotation ?? 0) + 90) % 360 })}
        >
          +90°
        </button>
        <button
          className="btn btn-sm"
          title="Reset rotation"
          disabled={!placement.rotation}
          onClick={() => onChange({ rotation: 0 })}
        >
          ↺
        </button>
      </div>

      <div className="field-row">
        <button
          className={`btn btn-sm ${placement.flipX ? "active" : ""}`}
          title="Mirror horizontally (X)"
          onClick={() => onChange({ flipX: !placement.flipX })}
        >
          ⇄ Flip X {placement.flipX ? "ON" : ""}
        </button>
        <button
          className={`btn btn-sm ${placement.flipY ? "active" : ""}`}
          title="Mirror vertically (Y)"
          onClick={() => onChange({ flipY: !placement.flipY })}
        >
          ⇅ Flip Y {placement.flipY ? "ON" : ""}
        </button>
      </div>

      <div className="field-row">
        <button
          className="btn btn-sm"
          disabled={!placement.rotation && !placement.flipX && !placement.flipY}
          onClick={() => onChange({ rotation: 0, flipX: false, flipY: false })}
        >
          Reset Transform
        </button>
        <button className="btn btn-sm danger" onClick={onDelete}>
          Delete
        </button>
      </div>

      <div className="text-xs text-dim" style={{ padding: "2px 4px" }}>
        Shortcuts: R rotate · X flip X · Y flip Y
      </div>
    </>
  );
}
