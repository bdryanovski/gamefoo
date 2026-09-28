import React from "react";
import { Icon } from "./Icon";
import { THEMES, type ThemeId } from "../utils/theme";

interface Props {
  theme: ThemeId;
  onSelect: (theme: ThemeId) => void;
  onClose: () => void;
}

export function SettingsPanel({ theme, onSelect, onClose }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          <span>
            <Icon name="settings" size={13} /> Settings
          </span>
          <button className="btn btn-sm" onClick={onClose}>
            X
          </button>
        </div>

        <div className="modal-body">
          <div className="settings-section">
            <div className="settings-section__label">Theme</div>
            <div className="theme-grid">
              {THEMES.map((t) => {
                const selected = t.id === theme;
                return (
                  <div
                    key={t.id}
                    className={`theme-card raised ${selected ? "selected" : ""}`}
                    onClick={() => onSelect(t.id)}
                  >
                    <div className="theme-card__preview" style={{ background: t.preview.surface }}>
                      <div
                        className="theme-card__preview-bar"
                        style={{ background: t.preview.bar, color: t.preview.barText }}
                      >
                        {t.name}
                      </div>
                      <div className="theme-card__preview-body">
                        <div
                          className="theme-card__swatch"
                          style={{ background: t.preview.accent }}
                        />
                        <div className="theme-card__chip" style={{ background: t.preview.ink, opacity: 0.35 }} />
                        <div className="theme-card__chip" style={{ background: t.preview.ink, opacity: 0.2 }} />
                      </div>
                    </div>
                    <div className="theme-card__body">
                      <div className="theme-card__name">
                        {t.name}
                        {selected && (
                          <span className="theme-card__check">
                            <Icon name="check" size={11} />
                          </span>
                        )}
                      </div>
                      <div className="theme-card__desc">{t.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
