/**
 * Graphics settings menu page.
 *
 * @category UI
 * @module ui/menu/pages/GraphicsPage
 * @since 0.5.0
 */

import {
  CONSOLE_RESOLUTION,
  type ScreenResolution,
} from '@/core/renderer/resolutions';
import Dropdown from '../../controls/Dropdown';
import Slider from '../../controls/Slider';
import Label from '../../display/Label';
import Separator from '../../display/Separator';
import VerticalLayout from '../../layouts/VerticalLayout';
import MenuPage from '../MenuPage';

/**
 * Resolution option for dropdown.
 *
 * @since 0.5.0
 */
export interface ResolutionOption {
  /** Display name */
  name: string;
  /** Resolution width */
  width: number;
  /** Resolution height */
  height: number;
}

/**
 * Graphics page configuration.
 *
 * @since 0.5.0
 */
export interface GraphicsPageConfig {
  /** Current scale */
  scale?: number;
  /** Available scales */
  scales?: number[];
  /** Current resolution */
  resolution?: ScreenResolution;
  /** Available resolutions (defaults to common console resolutions) */
  resolutions?: ResolutionOption[];
  /** Callbacks */
  onScaleChange?: (scale: number) => void;
  onResolutionChange?: (resolution: ResolutionOption) => void;
}

/** Default resolution options */
const DEFAULT_RESOLUTIONS: ResolutionOption[] = [
  { name: 'PICO-8 (128x128)', ...CONSOLE_RESOLUTION.PICO8 },
  { name: 'Game Boy (160x144)', ...CONSOLE_RESOLUTION.GAMEBOY },
  { name: 'Atari 2600 (160x192)', ...CONSOLE_RESOLUTION.ATARI_2600 },
  { name: 'TIC-80 (240x136)', ...CONSOLE_RESOLUTION.TIC80 },
  { name: 'GBA (240x160)', ...CONSOLE_RESOLUTION.GBA },
  { name: 'NES (256x240)', ...CONSOLE_RESOLUTION.NES },
  { name: 'SNES (256x224)', ...CONSOLE_RESOLUTION.SNES },
  { name: 'Atari 7800 (320x240)', ...CONSOLE_RESOLUTION.ATARI_7800 },
  { name: 'Genesis (320x224)', ...CONSOLE_RESOLUTION.GENESIS },
  { name: 'C64 (320x200)', ...CONSOLE_RESOLUTION.C64 },
  { name: 'PS1 (320x240)', ...CONSOLE_RESOLUTION.PS1 },
];

/**
 * Graphics settings page.
 *
 * Shows scale and resolution options only.
 *
 * @since 0.5.0
 */
export default class GraphicsPage extends MenuPage {
  /** Configuration */
  private _config: GraphicsPageConfig;

  /** Widgets */
  private _scaleSlider: Slider;
  private _resolutionDropdown: Dropdown;

  /** Resolution options */
  private _resolutions: ResolutionOption[];

  /**
   * Creates a new GraphicsPage.
   *
   * @param config - Configuration
   *
   * @since 0.5.0
   */
  constructor(config: GraphicsPageConfig = {}) {
    super('graphics', 'Video');
    this._config = config;
    this._resolutions = config.resolutions ?? DEFAULT_RESOLUTIONS;

    const layout = new VerticalLayout({
      spacing: 6,
      padding: 0,
      fillWidth: true,
    });

    // Scale slider
    const scales = config.scales ?? [1, 2, 3, 4];
    const minScale = Math.min(...scales);
    const maxScale = Math.max(...scales);
    const currentScale = config.scale ?? 2;

    this._scaleSlider = new Slider({
      min: minScale,
      max: maxScale,
      step: 1,
      value: currentScale,
      showValue: true,
      label: 'Scale',
      onChange: (value: number) => config.onScaleChange?.(value),
    });
    layout.addChild(this._scaleSlider);

    layout.addChild(new Separator({}));

    // Resolution label
    layout.addChild(
      new Label({
        text: 'Resolution',
      }),
    );

    // Resolution dropdown
    const resolutionItems = this._resolutions.map((r) => ({ label: r.name }));
    const initialResIndex = this._findResolutionIndex(config.resolution);

    this._resolutionDropdown = new Dropdown({
      items: resolutionItems,
      selectedIndex: initialResIndex,
      maxVisibleItems: 5,
      onChange: (index: number) => {
        const res = this._resolutions[index];
        if (res) {
          config.onResolutionChange?.(res);
        }
      },
    });
    layout.addChild(this._resolutionDropdown);

    this.root.addChild(layout);
  }

  /**
   * Finds the index of a resolution in the list.
   *
   * @param resolution - Resolution to find
   * @returns Index in resolutions array, or 0 if not found
   *
   * @internal
   * @since 0.5.0
   */
  private _findResolutionIndex(resolution?: ScreenResolution): number {
    if (!resolution) return 0;
    const idx = this._resolutions.findIndex(
      (r) => r.width === resolution.width && r.height === resolution.height,
    );
    return idx >= 0 ? idx : 0;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // State Updates
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Sets the scale value.
   *
   * @param value - Scale value
   *
   * @since 0.5.0
   */
  setScale(value: number): void {
    this._scaleSlider.value = value;
  }

  /**
   * Sets the resolution by matching width/height.
   *
   * @param resolution - Resolution to select
   *
   * @since 0.5.0
   */
  setResolution(resolution: ScreenResolution): void {
    const idx = this._findResolutionIndex(resolution);
    this._resolutionDropdown.selectedIndex = idx;
  }

  /**
   * Gets the currently selected resolution.
   *
   * @since 0.5.0
   */
  get resolution(): ResolutionOption | null {
    return this._resolutions[this._resolutionDropdown.selectedIndex] ?? null;
  }
}
