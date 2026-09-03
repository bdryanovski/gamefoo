/**
 * Debug settings menu page.
 *
 * Controls the MonitorSystem for debug overlays.
 *
 * @category UI
 * @module ui/menu/pages/DebugPage
 * @since 0.5.0
 */

import type { GridSize, MonitorSystem } from '@/subsystems/monitor_system';
import Checkbox from '../../controls/Checkbox';
import Dropdown from '../../controls/Dropdown';
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
  /**
   * Reference to MonitorSystem (optional - can be set later)
   */
  monitorSystem?: MonitorSystem;
  /**
   * Show FPS counter
   */
  showFps?: boolean;
  /**
   * Show FPS graph
   */
  showGraph?: boolean;
  /**
   * Show memory usage
   */
  showMemory?: boolean;
  /**
   * Show grid overlay
   */
  showGrid?: boolean;
  /**
   * Grid size
   */
  gridSize?: GridSize;
  /**
   * Callbacks (used when MonitorSystem is not provided)
   */
  onShowFpsChange?: (value: boolean) => void;
  onShowGraphChange?: (value: boolean) => void;
  onShowMemoryChange?: (value: boolean) => void;
  onShowGridChange?: (value: boolean) => void;
  onGridSizeChange?: (size: GridSize) => void;
}

/**
 * Grid size options
 */
const GRID_SIZES: Array<{ label: string; value: GridSize }> = [
  { label: 'None', value: 'none' },
  { label: '8x8', value: 8 },
  { label: '16x16', value: 16 },
  { label: '32x32', value: 32 },
];

/**
 * Debug settings page.
 *
 * Controls MonitorSystem debug overlays including FPS counter,
 * memory usage, FPS graph, and grid overlay.
 *
 * @since 0.5.0
 */
export default class DebugPage extends MenuPage {
  /**
   * Configuration
   */
  private _config: DebugPageConfig;

  /**
   * MonitorSystem reference
   */
  private _monitorSystem: MonitorSystem | null = null;

  /**
   * Widgets
   */
  private _fpsCheckbox: Checkbox;
  private _graphCheckbox: Checkbox;
  private _memoryCheckbox: Checkbox;
  private _gridDropdown: Dropdown;

  /**
   * Stats label
   */
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
    this._monitorSystem = config.monitorSystem ?? null;

    const layout = new VerticalLayout({
      spacing: 4,
      padding: 0,
      fillWidth: true,
    });

    // Stats display (shows current FPS from MonitorSystem)
    this._statsLabel = new Label({
      text: 'FPS: --',
      fontSize: 'small',
      muted: true,
    });
    layout.addChild(this._statsLabel);

    layout.addChild(new Separator({}));

    // FPS counter toggle
    this._fpsCheckbox = new Checkbox({
      label: 'Show FPS',
      checked: config.showFps ?? this._monitorSystem?.showFps ?? true,
      onChange: (v: boolean) => this.setShowFps(v),
    });
    layout.addChild(this._fpsCheckbox);

    // FPS graph toggle
    this._graphCheckbox = new Checkbox({
      label: 'Show Graph',
      checked: config.showGraph ?? this._monitorSystem?.showGraph ?? true,
      onChange: (v: boolean) => this.setShowGraph(v),
    });
    layout.addChild(this._graphCheckbox);

    // Memory toggle
    this._memoryCheckbox = new Checkbox({
      label: 'Show Memory',
      checked: config.showMemory ?? this._monitorSystem?.showMemory ?? true,
      onChange: (v: boolean) => this.setShowMemory(v),
    });
    layout.addChild(this._memoryCheckbox);

    layout.addChild(new Separator({}));

    // Grid size dropdown
    layout.addChild(new Label({ text: 'Grid Overlay', muted: true }));

    const currentGridSize = config.gridSize ?? this._monitorSystem?.gridSize ?? 'none';
    const gridIndex = GRID_SIZES.findIndex((g) => g.value === currentGridSize);

    this._gridDropdown = new Dropdown({
      items: GRID_SIZES.map((g) => ({ label: g.label })),
      selectedIndex: gridIndex >= 0 ? gridIndex : 0,
      maxVisibleItems: 4,
      onChange: (index: number) => {
        const size = GRID_SIZES[index]?.value ?? 'none';
        this.setGridSize(size);
      },
    });
    layout.addChild(this._gridDropdown);

    this.root.addChild(layout);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MonitorSystem Control
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Sets the MonitorSystem reference.
   *
   * @param monitor - MonitorSystem instance
   *
   * @since 0.5.0
   */
  setMonitorSystem(monitor: MonitorSystem): void {
    this._monitorSystem = monitor;
    this.syncFromMonitor();
  }

  /**
   * Gets the MonitorSystem reference.
   *
   * @returns MonitorSystem or null
   *
   * @since 0.5.0
   */
  get monitorSystem(): MonitorSystem | null {
    return this._monitorSystem;
  }

  /**
   * Syncs UI state from MonitorSystem.
   *
   * @since 0.5.0
   */
  syncFromMonitor(): void {
    if (!this._monitorSystem) {
      return;
    }

    this._fpsCheckbox.checked = this._monitorSystem.showFps;
    this._graphCheckbox.checked = this._monitorSystem.showGraph;
    this._memoryCheckbox.checked = this._monitorSystem.showMemory;

    const gridSize = this._monitorSystem.gridSize;
    const gridIndex = GRID_SIZES.findIndex((g) => g.value === gridSize);
    if (gridIndex >= 0) {
      this._gridDropdown.selectedIndex = gridIndex;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Setters (update MonitorSystem or fire callbacks)
  // ═══════════════════════════════════════════════════════════════════════════

  private setShowFps(value: boolean): void {
    if (this._monitorSystem) {
      this._monitorSystem.showFps = value;
    }
    this._config.onShowFpsChange?.(value);
  }

  private setShowGraph(value: boolean): void {
    if (this._monitorSystem) {
      this._monitorSystem.showGraph = value;
    }
    this._config.onShowGraphChange?.(value);
  }

  private setShowMemory(value: boolean): void {
    if (this._monitorSystem) {
      this._monitorSystem.showMemory = value;
    }
    this._config.onShowMemoryChange?.(value);
  }

  private setGridSize(size: GridSize): void {
    if (this._monitorSystem) {
      this._monitorSystem.gridSize = size;
      this._monitorSystem.showGrid = size !== 'none';
    }
    this._config.onGridSizeChange?.(size);
    this._config.onShowGridChange?.(size !== 'none');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Updates
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Updates the displayed stats from MonitorSystem.
   *
   * @since 0.5.0
   */
  updateStats(): void {
    if (this._monitorSystem) {
      this._statsLabel.text = `FPS: ${this._monitorSystem.currentFps.toFixed(0)}`;
    }
  }

  /**
   * Called when page is shown - refresh stats.
   *
   * @since 0.5.0
   */
  override onShow(): void {
    this.updateStats();
  }

  /**
   * Refreshes settings from MonitorSystem.
   *
   * @since 0.5.0
   */
  override refresh(): void {
    this.syncFromMonitor();
    this.updateStats();
  }
}
