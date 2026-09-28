import React, { useState } from "react";
import { Icon } from "../components/Icon";

/**
 * Key/value property list editor for a game object — the single source of
 * truth behind the object's free-form `properties` map. Editing here always
 * writes the object definition itself, so every placed instance inherits
 * the change. Shared by the Object Explorer and the map's floating
 * placement inspector.
 */
export function ObjectPropertiesEditor({
  properties,
  onChange,
}: {
  properties: Record<string, string>;
  onChange: (properties: Record<string, string>) => void;
}) {
  const [newKey, setNewKey] = useState("");
  const [newVal, setNewVal] = useState("");

  const set = (key: string, value: string) =>
    onChange({ ...properties, [key]: value });

  const remove = (key: string) => {
    const next = { ...properties };
    delete next[key];
    onChange(next);
  };

  const add = () => {
    const key = newKey.trim();
    if (!key) return;
    set(key, newVal);
    setNewKey("");
    setNewVal("");
  };

  return (
    <div className="col gap-sm">
      {Object.entries(properties).map(([key, val]) => (
        <div key={key} className="field-row">
          <span className="field-label" style={{ minWidth: 70 }}>{key}:</span>
          <input
            type="text"
            className="input input-full"
            value={val}
            onChange={(e) => set(key, e.target.value)}
          />
          <button
            className="btn btn-sm danger"
            title="Remove property"
            style={{ padding: "0 3px", minHeight: 14 }}
            onClick={() => remove(key)}
          >
            <Icon name="close" size={11} />
          </button>
        </div>
      ))}
      {Object.keys(properties).length === 0 && (
        <div className="text-xs text-dim" style={{ padding: "0 4px" }}>
          No properties yet. Game code reads these at runtime — e.g. a
          "dialogId" key can point at a message from the Dialog tab.
        </div>
      )}
      <div className="field-row mt-4">
        <input
          type="text"
          className="input input-sm"
          placeholder="key"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <input
          type="text"
          className="input input-md"
          placeholder="value"
          value={newVal}
          onChange={(e) => setNewVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button className="btn btn-sm" disabled={!newKey.trim()} onClick={add}>
          +
        </button>
      </div>
    </div>
  );
}
