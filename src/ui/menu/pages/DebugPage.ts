/**
 * Debug settings menu page.
 *
 * @category UI
 * @module ui/menu/pages/DebugPage
 * @since 0.5.0
 */

import Button from '../../controls/Button';
import Checkbox from '../../controls/Checkbox';
import Label from '../../display/Label';
import Separator from '../../display/Separator';
import HorizontalLayout from '../../layouts/HorizontalLayout';
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
  /** Show memory usage */
  showMemory?: boolean;
  /** Show draw calls */
  showDrawCalls?: boolean;
  /** Show collision debug */
  showCollisions?: boolean;
  /** Show grid overlay */
  showGrid?: boolean;
  /** Show entity bounds */
  showBounds?: boolean;
  /** Callbacks */
  onShowFpsChange?: (value: boolean) => void;
  onShowMemoryChange?: (value: boolean) => void;
  onShowDrawCallsChange?: (value: boolean) => void;
  onShowCollisionsChange?: (value: boolean) => void;
  onShowGridChange?: (value: boolean) => void;
  onShowBoundsChange?: (value: boolean) => void;
  onResetStats?: () => void;
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
  private _memoryCheckbox: Checkbox;
  private _drawCallsCheckbox: Checkbox;
  private _collisionsCheckbox: Checkbox;
  private _gridCheckbox: Checkbox;
  private _boundsCheckbox: Checkbox;

  /** Stats labels */
  private _fpsLabel: Label;
  private _memoryLabel: Label;
  private _drawCallsLabel: Label;

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

    // Stats section
    layout.addChild(new Label({ text: 'Performance', accent: true }));

    const statsRow = new HorizontalLayout({ spacing: 16, align: 'top' });

    const statsLeft = new VerticalLayout({ spacing: 2 });
    this._fpsLabel = new Label({ text: 'FPS: --', fontSize: 'small' });
    this._memoryLabel = new Label({ text: 'Mem: --', fontSize: 'small' });
    this._drawCallsLabel = new Label({ text: 'Draw: --', fontSize: 'small' });
    statsLeft.addChild(this._fpsLabel);
    statsLeft.addChild(this._memoryLabel);
    statsLeft.addChild(this._drawCallsLabel);
    statsRow.addChild(statsLeft);

    layout.addChild(statsRow);

    layout.addChild(new Separator({}));

    // Display toggles
    layout.addChild(new Label({ text: 'Display', accent: true }));

    this._fpsCheckbox = new Checkbox({
      label: 'Show FPS',
      checked: config.showFps ?? false,
      onChange: (v: boolean) => config.onShowFpsChange?.(v),
    });
    layout.addChild(this._fpsCheckbox);

    this._memoryCheckbox = new Checkbox({
      label: 'Show Memory',
      checked: config.showMemory ?? false,
      onChange: (v: boolean) => config.onShowMemoryChange?.(v),
    });
    layout.addChild(this._memoryCheckbox);

    this._drawCallsCheckbox = new Checkbox({
      label: 'Show Draw Calls',
      checked: config.showDrawCalls ?? false,
      onChange: (v: boolean) => config.onShowDrawCallsChange?.(v),
    });
    layout.addChild(this._drawCallsCheckbox);

    layout.addChild(new Separator({}));

    // Visualization toggles
    layout.addChild(new Label({ text: 'Visualization', accent: true }));

    this._collisionsCheckbox = new Checkbox({
      label: 'Collision Debug',
      checked: config.showCollisions ?? false,
      onChange: (v: boolean) => config.onShowCollisionsChange?.(v),
    });
    layout.addChild(this._collisionsCheckbox);

    this._gridCheckbox = new Checkbox({
      label: 'Grid Overlay',
      checked: config.showGrid ?? false,
      onChange: (v: boolean) => config.onShowGridChange?.(v),
    });
    layout.addChild(this._gridCheckbox);

    this._boundsCheckbox = new Checkbox({
      label: 'Entity Bounds',
      checked: config.showBounds ?? false,
      onChange: (v: boolean) => config.onShowBoundsChange?.(v),
    });
    layout.addChild(this._boundsCheckbox);

    // Reset button
    layout.addChild(new Separator({ length: 200 }));
    layout.addChild(
      new Button({
        text: 'Reset Stats',
        onClick: () => config.onResetStats?.(),
      }),
    );

    this.root.addChild(layout);
  }

  /**
   * Updates the displayed stats.
   *
   * @param fps - Frames per second
   * @param memory - Memory usage in MB
   * @param drawCalls - Number of draw calls
   *
   * @since 0.5.0
   */
  updateStats(fps: number, memory: number, drawCalls: number): void {
    this._fpsLabel.text = `FPS: ${fps.toFixed(0)}`;
    this._memoryLabel.text = `Mem: ${memory.toFixed(1)} MB`;
    this._drawCallsLabel.text = `Draw: ${drawCalls}`;
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
    if (this._config.showMemory !== undefined) {
      this._memoryCheckbox.checked = this._config.showMemory;
    }
    if (this._config.showDrawCalls !== undefined) {
      this._drawCallsCheckbox.checked = this._config.showDrawCalls;
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
