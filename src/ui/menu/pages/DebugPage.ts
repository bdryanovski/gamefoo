/**
 * Debug settings menu page.
 *
 * @category UI
 * @module ui/menu/pages/DebugPage
 * @since 0.5.0
 */

import Checkbox from '../../controls/Checkbox';
import Label from '../../display/Label';
import Separator from '../../display/Separator';
import VerticalLayout from '../../layouts/VerticalLayout';
import MenuPage from '../MenuPage';

/**
 * Debug page configuration.
 *
 * @since 0.5.0
 */
export interface DebugPageConfig {
  /** Show FPS counter */
  showFps?: boolean;
  /** Show collision debug */
  showCollisions?: boolean;
  /** Show grid overlay */
  showGrid?: boolean;
  /** Show entity bounds */
  showBounds?: boolean;
  /** Callbacks */
  onShowFpsChange?: (value: boolean) => void;
  onShowCollisionsChange?: (value: boolean) => void;
  onShowGridChange?: (value: boolean) => void;
  onShowBoundsChange?: (value: boolean) => void;
}

/**
 * Debug settings page.
 *
 * @since 0.5.0
 */
export default class DebugPage extends MenuPage {
  /** Configuration */
  private _config: DebugPageConfig;

  /** Widgets */
  private _fpsCheckbox: Checkbox;
  private _collisionsCheckbox: Checkbox;
  private _gridCheckbox: Checkbox;
  private _boundsCheckbox: Checkbox;

  /** Stats label */
  private _statsLabel: Label;

  /**
   * Creates a new DebugPage.
   *
   * @param config - Configuration
   *
   * @since 0.5.0
   */
  constructor(config: DebugPageConfig = {}) {
    super('debug', 'Debug');
    this._config = config;

    const layout = new VerticalLayout({
      spacing: 4,
      padding: 0,
      fillWidth: true,
    });

    // Stats display
    this._statsLabel = new Label({
      text: 'FPS: --',
      fontSize: 'small',
      muted: true,
    });
    layout.addChild(this._statsLabel);

    layout.addChild(new Separator({}));

    // Display toggles
    this._fpsCheckbox = new Checkbox({
      label: 'Show FPS',
      checked: config.showFps ?? false,
      onChange: (v: boolean) => config.onShowFpsChange?.(v),
    });
    layout.addChild(this._fpsCheckbox);

    this._collisionsCheckbox = new Checkbox({
      label: 'Collisions',
      checked: config.showCollisions ?? false,
      onChange: (v: boolean) => config.onShowCollisionsChange?.(v),
    });
    layout.addChild(this._collisionsCheckbox);

    this._gridCheckbox = new Checkbox({
      label: 'Grid',
      checked: config.showGrid ?? false,
      onChange: (v: boolean) => config.onShowGridChange?.(v),
    });
    layout.addChild(this._gridCheckbox);

    this._boundsCheckbox = new Checkbox({
      label: 'Bounds',
      checked: config.showBounds ?? false,
      onChange: (v: boolean) => config.onShowBoundsChange?.(v),
    });
    layout.addChild(this._boundsCheckbox);

    this.root.addChild(layout);
  }

  /**
   * Updates the displayed stats.
   *
   * @param fps - Frames per second
   *
   * @since 0.5.0
   */
  updateStats(fps: number): void {
    this._statsLabel.text = `FPS: ${fps.toFixed(0)}`;
  }

  /**
   * Refreshes settings from config.
   *
   * @since 0.5.0
   */
  override refresh(): void {
    if (this._config.showFps !== undefined) {
      this._fpsCheckbox.checked = this._config.showFps;
    }
    if (this._config.showCollisions !== undefined) {
      this._collisionsCheckbox.checked = this._config.showCollisions;
    }
    if (this._config.showGrid !== undefined) {
      this._gridCheckbox.checked = this._config.showGrid;
    }
    if (this._config.showBounds !== undefined) {
      this._boundsCheckbox.checked = this._config.showBounds;
    }
  }
}
