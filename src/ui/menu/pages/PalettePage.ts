/**
 * Palette viewer/selector menu page.
 *
 * @category UI
 * @module ui/menu/pages/PalettePage
 * @since 0.5.0
 */

import type { ColorPalette } from '@/core/palettes/types';
import type { RenderContext } from '@/core/renderer/type';
import Dropdown, { type DropdownItem } from '../../controls/Dropdown';
import Container from '../../core/Container';
import Label from '../../display/Label';
import GridLayout from '../../layouts/GridLayout';
import VerticalLayout from '../../layouts/VerticalLayout';
import MenuPage from '../MenuPage';

/**
 * Color swatch widget for palette display.
 *
 * @internal
 */
class ColorSwatch extends Container {
  private _color: string;

  constructor(color: string) {
    super({ width: 12, height: 12 });
    this._color = color;
  }

  set color(value: string) {
    this._color = value;
  }

  protected override drawSelf(ctx: RenderContext): void {
    ctx.fillRect(0, 0, this._width, this._height, this._color);
    ctx.strokeRect(0, 0, this._width, this._height, '#333333');
  }
}

/**
 * Palette page configuration.
 *
 * @since 0.5.0
 */
export interface PalettePageConfig {
  /** Available palettes */
  palettes?: ColorPalette[];
  /** Currently selected palette index */
  selectedIndex?: number;
  /** Palette change callback */
  onPaletteChange?: (palette: ColorPalette, index: number) => void;
}

/**
 * Palette viewer and selector page.
 *
 * @since 0.5.0
 */
export default class PalettePage extends MenuPage {
  /** Configuration */
  private _config: PalettePageConfig;

  /** Palette dropdown */
  private _dropdown: Dropdown;

  /** Color grid */
  private _colorGrid: GridLayout;

  /** Color swatches */
  private _swatches: ColorSwatch[] = [];

  /** Current palette name label */
  private _nameLabel: Label;

  /** Color count label */
  private _countLabel: Label;

  /**
   * Creates a new PalettePage.
   *
   * @param config - Configuration
   *
   * @since 0.5.0
   */
  constructor(config: PalettePageConfig = {}) {
    super('palette', 'Palette');
    this._config = config;

    const layout = new VerticalLayout({
      spacing: 8,
      padding: 0,
      fillWidth: true,
    });

    // Palette selector
    const palettes = config.palettes ?? [];
    const items: DropdownItem[] = palettes.map((p, i) => ({
      label: p.name,
      value: i,
    }));

    this._dropdown = new Dropdown({
      items,
      selectedIndex: config.selectedIndex ?? 0,
      width: 120,
      placeholder: 'Select palette...',
      onChange: (index: number, _item) => {
        if (palettes[index]) {
          this.updatePaletteDisplay(palettes[index]!);
          config.onPaletteChange?.(palettes[index]!, index);
        }
      },
    });
    layout.addChild(this._dropdown);

    // Palette info
    this._nameLabel = new Label({ text: '', muted: true });
    layout.addChild(this._nameLabel);

    this._countLabel = new Label({ text: '', muted: true, fontSize: 'small' });
    layout.addChild(this._countLabel);

    // Color grid
    this._colorGrid = new GridLayout({
      columns: 8,
      columnGap: 2,
      rowGap: 2,
      cellWidth: 12,
      cellHeight: 12,
    });
    layout.addChild(this._colorGrid);

    this.root.addChild(layout);

    // Initial display
    if (palettes.length > 0) {
      const initialIndex = config.selectedIndex ?? 0;
      this.updatePaletteDisplay(palettes[initialIndex]!);
    }
  }

  /**
   * Updates the palette display.
   *
   * @param palette - Palette to display
   *
   * @internal
   */
  private updatePaletteDisplay(palette: ColorPalette): void {
    this._nameLabel.text = palette.name;
    this._countLabel.text = `${palette.colors.length} colors`;

    // Clear existing swatches
    this._colorGrid.clearChildren();
    this._swatches = [];

    // Create new swatches
    for (const color of palette.colors) {
      const swatch = new ColorSwatch(color);
      this._swatches.push(swatch);
      this._colorGrid.addChild(swatch);
    }

    this._colorGrid.markLayoutDirty();
  }

  /**
   * Sets the available palettes.
   *
   * @param palettes - Palettes to show
   *
   * @since 0.5.0
   */
  setPalettes(palettes: ColorPalette[]): void {
    this._config.palettes = palettes;

    const items: DropdownItem[] = palettes.map((p, i) => ({
      label: p.name,
      value: i,
    }));
    this._dropdown.items = items;

    if (palettes.length > 0) {
      this.updatePaletteDisplay(palettes[0]!);
    }
  }

  /**
   * Refreshes the display.
   *
   * @since 0.5.0
   */
  override refresh(): void {
    const palettes = this._config.palettes ?? [];
    const index = this._dropdown.selectedIndex;
    if (index >= 0 && palettes[index]) {
      this.updatePaletteDisplay(palettes[index]!);
    }
  }
}
