/**
 * Graphics settings menu page.
 *
 * @category UI
 * @module ui/menu/pages/GraphicsPage
 * @since 0.5.0
 */

import Slider from '../../controls/Slider';
import Toggle from '../../controls/Toggle';
import Separator from '../../display/Separator';
import VerticalLayout from '../../layouts/VerticalLayout';
import MenuPage from '../MenuPage';

/**
 * Graphics page configuration.
 *
 * @since 0.5.0
 */
export interface GraphicsPageConfig {
  /** Current fullscreen state */
  fullscreen?: boolean;
  /** Current scale */
  scale?: number;
  /** Available scales */
  scales?: number[];
  /** VSync enabled */
  vsync?: boolean;
  /** Show FPS */
  showFps?: boolean;
  /** Callbacks */
  onFullscreenChange?: (value: boolean) => void;
  onScaleChange?: (scale: number) => void;
  onVsyncChange?: (value: boolean) => void;
  onShowFpsChange?: (value: boolean) => void;
}

/**
 * Graphics settings page.
 *
 * @since 0.5.0
 */
export default class GraphicsPage extends MenuPage {
  /** Configuration */
  private _config: GraphicsPageConfig;

  /** Widgets */
  private _fullscreenToggle: Toggle;
  private _scaleSlider: Slider;
  private _vsyncToggle: Toggle;
  private _fpsToggle: Toggle;

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

    const layout = new VerticalLayout({
      spacing: 6,
      padding: 0,
      fillWidth: true,
    });

    // Fullscreen toggle
    this._fullscreenToggle = new Toggle({
      label: 'Fullscreen',
      value: config.fullscreen ?? false,
      showText: true,
      onChange: (value: boolean) => config.onFullscreenChange?.(value),
    });
    layout.addChild(this._fullscreenToggle);

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

    // VSync toggle
    this._vsyncToggle = new Toggle({
      label: 'VSync',
      value: config.vsync ?? true,
      showText: true,
      onChange: (value: boolean) => config.onVsyncChange?.(value),
    });
    layout.addChild(this._vsyncToggle);

    // Show FPS toggle
    this._fpsToggle = new Toggle({
      label: 'Show FPS',
      value: config.showFps ?? false,
      showText: true,
      onChange: (value: boolean) => config.onShowFpsChange?.(value),
    });
    layout.addChild(this._fpsToggle);

    this.root.addChild(layout);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // State Updates
  // ═══════════════════════════════════════════════════════════════════════════

  /** Sets fullscreen state */
  setFullscreen(value: boolean): void {
    this._fullscreenToggle.value = value;
  }

  /** Sets scale value */
  setScale(value: number): void {
    this._scaleSlider.value = value;
  }

  /** Sets VSync state */
  setVsync(value: boolean): void {
    this._vsyncToggle.value = value;
  }

  /** Sets show FPS state */
  setShowFps(value: boolean): void {
    this._fpsToggle.value = value;
  }
}
