import React, { useMemo, useState } from 'react';
import type { AppState, AppAction } from '../types';
import type { DialogAction, DialogMessage, DialogTree } from './types';
import { DialogExportPanel } from './DialogExportPanel';
import { Icon } from '../components/Icon';

interface Props {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  dialogDispatch: (a: DialogAction) => void;
  projectId: string | null;
  saving: boolean;
  onSave: (mode?: 'save' | 'quick') => void;
  onOpenProjects: () => void;
}

type DialogTabType = 'inspector' | 'export';

/**
 * Copy text to the clipboard, preferring the async Clipboard API and
 * falling back to a temporary-textarea + execCommand for insecure contexts
 * or browsers that deny clipboard-write. Resolves to whether it succeeded.
 */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // permission denied / not focused — try the legacy path below
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Click-to-copy control for a message id. `compact` renders an icon-only
 * button (for dense rows); otherwise it shows the id inline with a hint.
 */
function CopyId({ id, compact }: { id: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    void copyText(id).then((ok) => {
      if (!ok) return;
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });
  };
  if (compact) {
    return (
      <button
        className={`dialog-copy-btn ${copied ? 'copied' : ''}`}
        title={`Copy id — ${id}`}
        onClick={copy}
      >
        <Icon name={copied ? 'check' : 'copy'} size={10} />
      </button>
    );
  }
  return (
    <button className={`dialog-id ${copied ? 'copied' : ''}`} title="Copy id" onClick={copy}>
      <Icon name={copied ? 'check' : 'copy'} size={11} />
      <code className="dialog-id__value">{id}</code>
      <span className="dialog-id__hint">{copied ? 'copied!' : 'copy'}</span>
    </button>
  );
}

/** A node in the rendered message tree. */
interface TreeNodeData {
  message: DialogMessage;
  /** Option label that leads here, or null for the root. */
  edgeLabel: string | null;
  /** Reached again (diamond/cycle) — shown as a leaf reference. */
  ref: boolean;
  children: TreeNodeData[];
}

/**
 * Build a nested tree by following option links from the root. A message
 * reached more than once (diamond or cycle) becomes a compact leaf
 * reference the second time, so the walk always terminates.
 */
function buildTreeData(tree: DialogTree): { root: TreeNodeData | null; reachable: Set<string> } {
  const byId = new Map(tree.messages.map((m) => [m.id, m] as const));
  const expanded = new Set<string>();

  const walk = (id: string, edgeLabel: string | null): TreeNodeData | null => {
    const message = byId.get(id);
    if (!message) return null;
    if (expanded.has(id)) return { message, edgeLabel, ref: true, children: [] };
    expanded.add(id);
    const children: TreeNodeData[] = [];
    for (const option of message.options) {
      if (!option.targetId) continue;
      const child = walk(option.targetId, option.label || '(option)');
      if (child) children.push(child);
    }
    return { message, edgeLabel, ref: false, children };
  };

  const root = tree.rootId ? walk(tree.rootId, null) : null;
  return { root, reachable: new Set(expanded) };
}

interface TreeNodeProps {
  node: TreeNodeData;
  rootId: string | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** Recursive node-link card with connector lines drawn in CSS. */
function DialogTreeNode({ node, rootId, selectedId, onSelect }: TreeNodeProps) {
  const m = node.message;
  const isRoot = rootId === m.id;
  const deadEnd = m.options.length === 0;
  return (
    <div className="dialog-tree-node">
      <div
        className={`dialog-card ${m.id === selectedId ? 'active' : ''} ${node.ref ? 'is-ref' : ''}`}
        onClick={() => onSelect(m.id)}
        title={node.ref ? 'Reference — expanded above' : m.title}
      >
        <div className="dialog-card__main">
          <Icon name="dialog" size={11} />
          {node.edgeLabel != null && (
            <span className="dialog-edge-label" title={`Option: ${node.edgeLabel}`}>
              ⟶ {node.edgeLabel}
            </span>
          )}
          <span className="dialog-card__title">{m.title || '(untitled)'}</span>
          {isRoot && <span className="dialog-pill dialog-pill--root">start</span>}
          {node.ref && <span className="dialog-pill dialog-pill--ref">↻ ref</span>}
          {!node.ref && deadEnd && !isRoot && (
            <span className="dialog-pill dialog-pill--end">end</span>
          )}
          {!node.ref && m.segments.length > 1 && (
            <span className="dialog-chip" title="sub-messages">
              ▤{m.segments.length}
            </span>
          )}
          {!node.ref && m.options.length > 0 && (
            <span className="dialog-chip" title="options">
              ⋔{m.options.length}
            </span>
          )}
        </div>
        <div className="dialog-card__id">
          <code className="dialog-card__id-value">{m.id}</code>
          <CopyId id={m.id} compact />
        </div>
      </div>
      {node.children.length > 0 && (
        <div className="dialog-tree-children">
          {node.children.map((c, i) => (
            <div className="dialog-tree-child" key={`${c.message.id}-${i}`}>
              <DialogTreeNode
                node={c}
                rootId={rootId}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DialogEditor({
  state,
  dispatch,
  dialogDispatch,
  projectId,
  saving,
  onSave,
  onOpenProjects,
}: Props) {
  const [tab, setTab] = useState<DialogTabType>('inspector');
  const dialog = state.dialog;

  const tree = useMemo(
    () => dialog.trees.find((t) => t.id === dialog.selectedTreeId) ?? null,
    [dialog.trees, dialog.selectedTreeId],
  );
  const message = useMemo(
    () => tree?.messages.find((m) => m.id === dialog.selectedMessageId) ?? null,
    [tree, dialog.selectedMessageId],
  );

  const { root, reachable } = useMemo(
    () => (tree ? buildTreeData(tree) : { root: null, reachable: new Set<string>() }),
    [tree],
  );
  const orphans = useMemo(
    () => (tree ? tree.messages.filter((m) => !reachable.has(m.id)) : []),
    [tree, reachable],
  );

  // Commit a whole message field; segments/options/meta edits build the next
  // array locally then hand it off through one UPDATE_MESSAGE.
  const commitSegments = (segments: string[]): void => {
    if (!message) return;
    dialogDispatch({
      type: 'UPDATE_MESSAGE',
      id: message.id,
      updates: { segments: segments.length > 0 ? segments : [''] },
    });
  };

  const messageCount = tree?.messages.length ?? 0;

  return (
    <div className="app-layout">
      {/* Title bar — shared project lifecycle */}
      <div className="title-bar">
        <span className="title-bar__icon">
          <Icon name="dialog" size={15} />
        </span>
        <span className="title-bar__name">
          GameFoo Dialog Tree — {state.projectName}
          {projectId ? '' : ' (unsaved)'}
        </span>
        <button className="btn btn-sm title-btn" onClick={onOpenProjects}>
          Projects
        </button>
        <button
          className="btn btn-sm title-btn"
          onClick={() => dispatch({ type: 'UNDO' })}
          disabled={state.history.length === 0}
          title="Undo — Ctrl/Cmd+Z"
        >
          <Icon name="undo" size={13} /> Undo
          {state.history.length > 0 ? ` (${state.history.length})` : ''}
        </button>
        <button
          className="btn btn-sm title-btn"
          onClick={() => onSave('quick')}
          disabled={saving}
          title="QuickSave — Ctrl/Cmd+S (no export screen)"
        >
          QuickSave
        </button>
        <button className="btn btn-sm title-btn" onClick={() => onSave('save')} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="main-area">
        {/* ── Sidebar: trees + message tree ─────────────── */}
        <div className="dialog-sidebar">
          <div className="row-between">
            <div className="section-title">Dialogs</div>
            <button
              className="btn btn-sm"
              title="New dialog tree"
              onClick={() => dialogDispatch({ type: 'ADD_TREE' })}
            >
              <Icon name="add" size={12} /> Tree
            </button>
          </div>

          <div className="col gap-sm">
            {dialog.trees.length === 0 && (
              <div className="text-dim text-xs p-4">No dialog trees yet.</div>
            )}
            {dialog.trees.map((t) => (
              <div
                key={t.id}
                className={`dialog-tree-item ${t.id === dialog.selectedTreeId ? 'active' : ''}`}
                onClick={() => dialogDispatch({ type: 'SELECT_TREE', id: t.id })}
              >
                <Icon name="dialog" size={12} />
                <span className="dialog-tree-item__name">{t.name}</span>
                <span className="text-dim text-xs">{t.messages.length}</span>
              </div>
            ))}
          </div>

          {tree && (
            <>
              <div className="row-between mt-4">
                <div className="section-title">Messages</div>
                <button
                  className="btn btn-sm"
                  title="Add message to this tree"
                  onClick={() => dialogDispatch({ type: 'ADD_MESSAGE' })}
                >
                  <Icon name="add" size={12} /> Msg
                </button>
              </div>

              <div className="dialog-tree">
                {root && (
                  <DialogTreeNode
                    node={root}
                    rootId={tree.rootId}
                    selectedId={dialog.selectedMessageId}
                    onSelect={(id) => dialogDispatch({ type: 'SELECT_MESSAGE', id })}
                  />
                )}

                {orphans.length > 0 && (
                  <div className="dialog-orphans">
                    <div className="dialog-orphans__label">Unlinked</div>
                    {orphans.map((m) => (
                      <div
                        key={m.id}
                        className={`dialog-card ${m.id === dialog.selectedMessageId ? 'active' : ''}`}
                        onClick={() => dialogDispatch({ type: 'SELECT_MESSAGE', id: m.id })}
                        title={m.title}
                      >
                        <div className="dialog-card__main">
                          <Icon name="dialog" size={11} />
                          <span className="dialog-card__title">{m.title || '(untitled)'}</span>
                          {m.options.length > 0 && (
                            <span className="dialog-chip" title="options">
                              ⋔{m.options.length}
                            </span>
                          )}
                        </div>
                        <div className="dialog-card__id">
                          <code className="dialog-card__id-value">{m.id}</code>
                          <CopyId id={m.id} compact />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* ── Main: message inspector ───────────────────── */}
        <div className="dialog-main">
          {!tree ? (
            <div className="dialog-empty">
              <Icon name="dialog" size={32} />
              <div>Create a dialog tree to begin.</div>
            </div>
          ) : !message ? (
            <div className="dialog-empty">
              <div>Select or add a message.</div>
            </div>
          ) : (
            <MessageInspector
              tree={tree}
              message={message}
              dialogDispatch={dialogDispatch}
              commitSegments={commitSegments}
            />
          )}
        </div>

        {/* ── Right panel: tree settings + export ───────── */}
        <div className="right-panel">
          <div className="panel-tabs">
            <div
              className={`panel-tab ${tab === 'inspector' ? 'active' : ''}`}
              onClick={() => setTab('inspector')}
            >
              Tree
            </div>
            <div
              className={`panel-tab ${tab === 'export' ? 'active' : ''}`}
              onClick={() => setTab('export')}
            >
              Export
            </div>
          </div>
          <div className="panel-content">
            {tab === 'inspector' &&
              (tree ? (
                <div className="col gap-md">
                  <div className="section-title">Tree</div>
                  <label className="col gap-sm">
                    <span className="text-dim text-xs">Name</span>
                    <input
                      className="input input-full"
                      value={tree.name}
                      onChange={(e) =>
                        dialogDispatch({
                          type: 'UPDATE_TREE',
                          id: tree.id,
                          updates: { name: e.target.value },
                        })
                      }
                    />
                  </label>
                  <div className="text-dim text-xs">Root: {tree.rootId ?? '—'}</div>
                  <div className="text-dim text-xs">Messages: {messageCount}</div>
                  <button
                    className="btn btn-sm danger"
                    onClick={() => {
                      if (confirm(`Delete dialog "${tree.name}"?`)) {
                        dialogDispatch({ type: 'DELETE_TREE', id: tree.id });
                      }
                    }}
                  >
                    <Icon name="delete" size={12} /> Delete tree
                  </button>
                </div>
              ) : (
                <div className="text-dim text-xs">No tree selected.</div>
              ))}
            {tab === 'export' && <DialogExportPanel state={state} />}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="status-bar">
        <div className="status-cell flex">{state.projectName}</div>
        <div className="status-cell">Trees: {dialog.trees.length}</div>
        <div className="status-cell">Tree: {tree?.name ?? '—'}</div>
        <div className="status-cell">Messages: {messageCount}</div>
        <div className="status-cell">Message: {message?.id ?? '—'}</div>
      </div>
    </div>
  );
}

interface InspectorProps {
  tree: DialogTree;
  message: DialogMessage;
  dialogDispatch: (a: DialogAction) => void;
  commitSegments: (segments: string[]) => void;
}

function MessageInspector({ tree, message, dialogDispatch, commitSegments }: InspectorProps) {
  const isRoot = tree.rootId === message.id;

  return (
    <div className="col gap-md dialog-inspector">
      {/* Header */}
      <div className="row-between">
        <div className="row gap-md">
          <input
            className="input dialog-title-input"
            value={message.title}
            placeholder="Message title"
            onChange={(e) =>
              dialogDispatch({
                type: 'UPDATE_MESSAGE',
                id: message.id,
                updates: { title: e.target.value },
              })
            }
          />
          {isRoot ? (
            <span className="dialog-pill dialog-pill--root">start</span>
          ) : (
            <button
              className="btn btn-sm"
              title="Make this the tree's entry message"
              onClick={() =>
                dialogDispatch({
                  type: 'UPDATE_TREE',
                  id: tree.id,
                  updates: { rootId: message.id },
                })
              }
            >
              Set as root
            </button>
          )}
        </div>
        <button
          className="btn btn-sm danger"
          onClick={() => dialogDispatch({ type: 'DELETE_MESSAGE', id: message.id })}
        >
          <Icon name="delete" size={12} /> Delete
        </button>
      </div>
      <div className="dialog-id-row">
        <span className="text-dim text-xs">Message id</span>
        <CopyId id={message.id} />
      </div>

      {/* Visual preview — sub-messages as dialog boxes, options as choices */}
      <div className="dialog-preview">
        {message.segments.map((seg, i) => (
          <div key={i} className="dialog-box">
            <span className="dialog-box__num">{i + 1}</span>
            <div className="dialog-box__body">
              {seg ? seg : <span className="text-dim">(empty sub-message)</span>}
            </div>
            {i < message.segments.length - 1 && <span className="dialog-box__next">▾</span>}
          </div>
        ))}
        <div className="dialog-choices">
          {message.options.length === 0 ? (
            <span className="dialog-end-tag">■ End of dialog</span>
          ) : (
            message.options.map((o) => {
              const target = o.targetId ? tree.messages.find((m) => m.id === o.targetId) : null;
              return (
                <button
                  key={o.id}
                  className={`dialog-choice ${o.targetId ? '' : 'is-end'}`}
                  disabled={!o.targetId}
                  title={
                    target
                      ? `Go to "${target.title || target.id}"`
                      : o.targetId
                        ? 'Missing target'
                        : 'Dead end — ends dialog'
                  }
                  onClick={() =>
                    o.targetId && dialogDispatch({ type: 'SELECT_MESSAGE', id: o.targetId })
                  }
                >
                  <span className="dialog-choice__label">{o.label || '(option)'}</span>
                  <span className="dialog-choice__to">
                    {o.targetId ? `→ ${target?.title || '?'}` : '▪ end'}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Segments (sub-messages) */}
      <div className="row-between">
        <div className="section-title">Sub-messages</div>
        <button className="btn btn-sm" onClick={() => commitSegments([...message.segments, ''])}>
          <Icon name="add" size={12} /> Part
        </button>
      </div>
      <div className="col gap-md">
        {message.segments.map((seg, i) => (
          <div key={i} className="dialog-segment">
            <span className="dialog-segment__num">{i + 1}</span>
            <textarea
              className="input dialog-segment__text"
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
                className="btn btn-sm"
                title="Move down"
                disabled={i === message.segments.length - 1}
                onClick={() => {
                  const next = [...message.segments];
                  [next[i + 1], next[i]] = [next[i]!, next[i + 1]!];
                  commitSegments(next);
                }}
              >
                <Icon name="down" size={11} />
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
      </div>

      {/* Options (branching paths) */}
      <div className="row-between">
        <div className="section-title">Options</div>
        <button
          className="btn btn-sm"
          onClick={() => dialogDispatch({ type: 'ADD_OPTION', messageId: message.id })}
        >
          <Icon name="add" size={12} /> Option
        </button>
      </div>
      {message.options.length === 0 && (
        <div className="text-dim text-xs">
          No options — this message is a dead end (dialog ends here).
        </div>
      )}
      <div className="col gap-md">
        {message.options.map((option) => (
          <div key={option.id} className="dialog-option">
            <input
              className="input dialog-option__label"
              value={option.label}
              placeholder="Choice text"
              onChange={(e) =>
                dialogDispatch({
                  type: 'UPDATE_OPTION',
                  messageId: message.id,
                  optionId: option.id,
                  updates: { label: e.target.value },
                })
              }
            />
            <span className="dialog-option__arrow">→</span>
            <select
              className="input dialog-option__target"
              value={option.targetId ?? ''}
              onChange={(e) =>
                dialogDispatch({
                  type: 'UPDATE_OPTION',
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
              title="Create a new message and link this option to it"
              onClick={() => dialogDispatch({ type: 'ADD_MESSAGE', linkFromOptionId: option.id })}
            >
              <Icon name="add" size={11} />
            </button>
            <button
              className="btn btn-sm danger"
              title="Remove option"
              onClick={() =>
                dialogDispatch({
                  type: 'DELETE_OPTION',
                  messageId: message.id,
                  optionId: option.id,
                })
              }
            >
              <Icon name="delete" size={11} />
            </button>
          </div>
        ))}
      </div>

      {/* Meta (key/value) */}
      <div className="row-between">
        <div className="section-title">Metadata</div>
        <button
          className="btn btn-sm"
          onClick={() => dialogDispatch({ type: 'ADD_META', messageId: message.id })}
        >
          <Icon name="add" size={12} /> Entry
        </button>
      </div>
      {message.meta.length === 0 && <div className="text-dim text-xs">No metadata attached.</div>}
      <div className="col gap-md">
        {message.meta.map((entry, i) => (
          <div key={i} className="dialog-meta">
            <input
              className="input dialog-meta__key"
              value={entry.key}
              placeholder="key"
              onChange={(e) =>
                dialogDispatch({
                  type: 'UPDATE_META',
                  messageId: message.id,
                  index: i,
                  updates: { key: e.target.value },
                })
              }
            />
            <input
              className="input dialog-meta__value"
              value={entry.value}
              placeholder="value"
              onChange={(e) =>
                dialogDispatch({
                  type: 'UPDATE_META',
                  messageId: message.id,
                  index: i,
                  updates: { value: e.target.value },
                })
              }
            />
            <button
              className="btn btn-sm danger"
              title="Remove entry"
              onClick={() =>
                dialogDispatch({ type: 'DELETE_META', messageId: message.id, index: i })
              }
            >
              <Icon name="delete" size={11} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
