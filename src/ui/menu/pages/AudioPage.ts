/**
 * Audio settings menu page.
 *
 * @category UI
 * @module ui/menu/pages/AudioPage
 * @since 0.5.0
 */

import Slider from '../../controls/Slider';
import Toggle from '../../controls/Toggle';
import Separator from '../../display/Separator';
import VerticalLayout from '../../layouts/VerticalLayout';
import MenuPage from '../MenuPage';

/**
 * Audio page configuration.
 *
 * @since 0.5.0
 */
export interface AudioPageConfig {
  /**
   * Master volume (0-100)
   */
  masterVolume?: number;
  /**
   * Music volume (0-100)
   */
  musicVolume?: number;
  /**
   * SFX volume (0-100)
   */
  sfxVolume?: number;
  /**
   * Mute all
   */
  muted?: boolean;
  /**
   * Callbacks
   */
  onMasterVolumeChange?: (volume: number) => void;
  onMusicVolumeChange?: (volume: number) => void;
  onSfxVolumeChange?: (volume: number) => void;
  onMutedChange?: (muted: boolean) => void;
}

/**
 * Audio settings page.
 *
 * @since 0.5.0
 */
export default class AudioPage extends MenuPage {
  /**
   * Configuration
   */
  private _config: AudioPageConfig;

  /**
   * Widgets
   */
  private _masterSlider: Slider;
  private _musicSlider: Slider;
  private _sfxSlider: Slider;
  private _muteToggle: Toggle;

  /**
   * Creates a new AudioPage.
   *
   * @param config - Configuration
   *
   * @since 0.5.0
   */
  constructor(config: AudioPageConfig = {}) {
    super('audio', 'Audio');
    this._config = config;

    const layout = new VerticalLayout({
      spacing: 6,
      padding: 0,
      fillWidth: true,
    });

    // Master volume
    this._masterSlider = new Slider({
      min: 0,
      max: 100,
      step: 10,
      value: config.masterVolume ?? 100,
      showValue: true,
      label: 'Master',
      onChange: (value: number) => config.onMasterVolumeChange?.(value),
    });
    layout.addChild(this._masterSlider);

    // Music volume
    this._musicSlider = new Slider({
      min: 0,
      max: 100,
      step: 10,
      value: config.musicVolume ?? 80,
      showValue: true,
      label: 'Music',
      onChange: (value: number) => config.onMusicVolumeChange?.(value),
    });
    layout.addChild(this._musicSlider);

    // SFX volume
    this._sfxSlider = new Slider({
      min: 0,
      max: 100,
      step: 10,
      value: config.sfxVolume ?? 100,
      showValue: true,
      label: 'SFX',
      onChange: (value: number) => config.onSfxVolumeChange?.(value),
    });
    layout.addChild(this._sfxSlider);

    layout.addChild(new Separator({}));

    // Mute toggle
    this._muteToggle = new Toggle({
      label: 'Mute All',
      value: config.muted ?? false,
      showText: true,
      onChange: (value: boolean) => config.onMutedChange?.(value),
    });
    layout.addChild(this._muteToggle);

    this.root.addChild(layout);
  }

  /**
   * Updates settings from config.
   *
   * @since 0.5.0
   */
  override refresh(): void {
    if (this._config.masterVolume !== undefined) {
      this._masterSlider.value = this._config.masterVolume;
    }
    if (this._config.musicVolume !== undefined) {
      this._musicSlider.value = this._config.musicVolume;
    }
    if (this._config.sfxVolume !== undefined) {
      this._sfxSlider.value = this._config.sfxVolume;
    }
    if (this._config.muted !== undefined) {
      this._muteToggle.value = this._config.muted;
    }
  }
}
