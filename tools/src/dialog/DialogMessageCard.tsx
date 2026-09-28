import React from "react";
import type { DialogAction, DialogMessage, DialogTree } from "./types";
import { Icon } from "../components/Icon";

/**
 * Compact inline editor for one dialog message — the message card half of
 * the Dialog Editor (title, sub-messages, options, metadata), sized for the
 * map's floating placement inspector so a story can be authored without
 * leaving the map.
 *
 * All edits go through the regular dialog actions; the card selects the
 * message's tree first when needed, so the reducer always targets the
 * right tree no matter which one the Dialog tab has open.
 */
export function DialogMessageCard({
  tree,
  message,
  selectedTreeId,
  dialogDispatch,
  onNavigate,
}: {
  tree: DialogTree;
  message: DialogMessage;
  /** The dialog slice's currently selected tree (SELECT_TREE guards). */
  selectedTreeId: string | null;
  dialogDispatch: (a: DialogAction) => void;
  /** Follow a link to another message (used to move focus). */
  onNavigate?: (messageId: string) => void;
}) {
  const act = (a: DialogAction) => {
    if (selectedTreeId !== tree.id) {
      dialogDispatch({ type: "SELECT_TREE", id: tree.id });
    }
    dialogDispatch(a);
  };

  const commitSegments = (segments: string[]) =>
    act({ type: "UPDATE_MESSAGE", id: message.id, updates: { segments } });

  return (
    <div className="col gap-sm dialog-message-card">
      {/* Title + id */}
      <div className="field-row">
        <span className="field-label">Title:</span>
        <input
          type="text"
          className="input input-full"
          value={message.title}
          placeholder="Message title"
          onChange={(e) =>
            act({ type: "UPDATE_MESSAGE", id: message.id, updates: { title: e.target.value } })
          }
        />
      </div>
      <div className="dialog-id-row">
        <span className="text-dim text-xs">Message id</span>
        <code className="dialog-card__id-value">{message.id}</code>
      </div>

      {/* Sub-messages (segments) */}
      <div className="row-between">
        <span className="text-dim text-xs">Sub-messages</span>
        <button className="btn btn-sm" onClick={() => act({ type: "UPDATE_MESSAGE", id: message.id, updates: { segments: [...message.segments, ""] } })}>
          <Icon name="add" size={11} /> Part
        </button>
      </div>
      {message.segments.map((seg, i) => (
        <div key={i} className="field-row">
          <span className="field-label">{i + 1}:</span>
          <textarea
            className="input dialog-message-card__text"
            rows={2}
            value={seg}
            placeholder="Text shown in one dialog box…"
            onChange={(e) =>
              commitSegments(message.segments.map((s, j) => (j === i ? e.target.value : s)))
            }
          />
          <div className="col gap-sm">
            <button
              className="btn btn-sm"
              title="Move up"
              disabled={i === 0}
              onClick={() => {
                const next = [...message.segments];
                [next[i - 1], next[i]] = [next[i]!, next[i - 1]!];
                commitSegments(next);
              }}
            >
              <Icon name="up" size={11} />
            </button>
            <button
              className="btn btn-sm danger"
              title="Remove part"
              disabled={message.segments.length <= 1}
              onClick={() => commitSegments(message.segments.filter((_, j) => j !== i))}
            >
              <Icon name="delete" size={11} />
            </button>
          </div>
        </div>
      ))}

      {/* Options (branching paths) */}
      <div className="row-between">
        <span className="text-dim text-xs">Options</span>
        <button className="btn btn-sm" onClick={() => act({ type: "ADD_OPTION", messageId: message.id })}>
          <Icon name="add" size={11} /> Option
        </button>
      </div>
      {message.options.length === 0 && (
        <div className="text-dim text-xs">No options — this message is a dead end.</div>
      )}
      {message.options.map((option) => {
        const target = option.targetId
          ? tree.messages.find((m) => m.id === option.targetId)
          : null;
        return (
          <div key={option.id} className="field-row">
            <input
              type="text"
              className="input input-sm"
              value={option.label}
              placeholder="Choice text"
              title="Text shown to the player"
              onChange={(e) =>
                act({
                  type: "UPDATE_OPTION",
                  messageId: message.id,
                  optionId: option.id,
                  updates: { label: e.target.value },
                })
              }
            />
            <span className="text-dim text-xs">→</span>
            <select
              className="input input-sm input-full"
              value={option.targetId ?? ""}
              title="Where this choice leads"
              onChange={(e) =>
                act({
                  type: "UPDATE_OPTION",
                  messageId: message.id,
                  optionId: option.id,
                  updates: { targetId: e.target.value || null },
                })
              }
            >
              <option value="">— dead end (final) —</option>
              {tree.messages
                .filter((m) => m.id !== message.id)
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title || m.id}
                  </option>
                ))}
            </select>
            <button
              className="btn btn-sm"
              title={`Follow to "${target?.title ?? option.targetId ?? "?"}"`}
              disabled={!option.targetId}
              onClick={() => option.targetId && onNavigate?.(option.targetId)}
            >
              <Icon name="next" size={11} />
            </button>
            <button
              className="btn btn-sm danger"
              title="Remove option"
              onClick={() =>
                act({ type: "DELETE_OPTION", messageId: message.id, optionId: option.id })
              }
            >
              <Icon name="delete" size={11} />
            </button>
          </div>
        );
      })}

      {/* Metadata (read-only chips) */}
      {message.meta.length > 0 && (
        <div className="col gap-sm">
          <span className="text-dim text-xs">Metadata</span>
          {message.meta.map((entry, i) => (
            <div key={i} className="text-xs" style={{ padding: "0 4px" }}>
              <b>{entry.key || "(key)"}</b>: {entry.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
