/**
 * Retro CRT/terminal style theme.
 *
 * @category UI
 * @module ui/themes/RetroTheme
 * @since 0.5.0
 */

import FontBitmap from '@/core/fonts/font_bitmap';
import type { ColorPalette, HexColor } from '@/core/palettes/types';
import { createTheme, type UIColorMap, type UITheme } from '../core/Theme';

/**
 * Green phosphor CRT palette.
 *
 * @since 0.5.0
 */
const GREEN_PHOSPHOR_PALETTE: ColorPalette = {
  name: 'Green Phosphor',
  colors: [
    '#0a0a0a', // 0: Black
    '#0d1f0d', // 1: Very dark green
    '#143314', // 2: Dark green
    '#1a4d1a', // 3: Medium dark green
    '#20661a', // 4: Medium green
    '#33cc33', // 5: Green
    '#4dff4d', // 6: Bright green
    '#66ff66', // 7: Very bright green
    '#99ff99', // 8: Pale green
    '#ccffcc', // 9: Very pale green
    '#000000', // 10: Pure black
    '#001100', // 11: Near black green
    '#002200', // 12: Dark phosphor
    '#003300', // 13: Phosphor glow
    '#00ff00', // 14: Full green
    '#ffffff', // 15: White
  ] as HexColor[],
};

/**
 * Amber phosphor CRT palette.
 *
 * @since 0.5.0
 */
const AMBER_PHOSPHOR_PALETTE: ColorPalette = {
  name: 'Amber Phosphor',
  colors: [
    '#0a0a00', // 0: Black
    '#1a1500', // 1: Very dark amber
    '#332a00', // 2: Dark amber
    '#4d3f00', // 3: Medium dark amber
    '#665500', // 4: Medium amber
    '#cc9900', // 5: Amber
    '#ffaa00', // 6: Bright amber
    '#ffbb33', // 7: Very bright amber
    '#ffcc66', // 8: Pale amber
    '#ffdd99', // 9: Very pale amber
    '#000000', // 10: Pure black
    '#110d00', // 11: Near black amber
    '#221a00', // 12: Dark phosphor
    '#332600', // 13: Phosphor glow
    '#ffaa00', // 14: Full amber
    '#ffffff', // 15: White
  ] as HexColor[],
};

/**
 * Creates a retro CRT theme.
 *
 * @param variant - Color variant: 'green' or 'amber'
 * @returns The retro theme
 *
 * @since 0.5.0
 */
export function createRetroTheme(variant: 'green' | 'amber' = 'green'): UITheme {
  const palette = variant === 'green' ? GREEN_PHOSPHOR_PALETTE : AMBER_PHOSPHOR_PALETTE;

  const colors: UIColorMap = {
    // Panel/Container
    'panel.background': palette.colors[0]!,
    'panel.border': palette.colors[4]!,
    'panel.header': palette.colors[1]!,

    // Button
    'button.background': palette.colors[1]!,
    'button.backgroundHover': palette.colors[2]!,
    'button.backgroundPressed': palette.colors[0]!,
    'button.backgroundDisabled': palette.colors[1]!,
    'button.border': palette.colors[4]!,
    'button.borderFocus': palette.colors[6]!,
    'button.text': palette.colors[5]!,
    'button.textDisabled': palette.colors[3]!,

    // Label/Text
    'label.text': palette.colors[5]!,
    'label.textMuted': palette.colors[3]!,
    'label.textAccent': palette.colors[6]!,

    // Input
    'input.background': palette.colors[0]!,
    'input.border': palette.colors[4]!,
    'input.borderFocus': palette.colors[6]!,
    'input.text': palette.colors[5]!,
    'input.placeholder': palette.colors[3]!,
    'input.selection': palette.colors[2]!,
    'input.caret': palette.colors[6]!,

    // Checkbox
    'checkbox.background': palette.colors[0]!,
    'checkbox.border': palette.colors[4]!,
    'checkbox.check': palette.colors[6]!,
    'checkbox.backgroundChecked': palette.colors[2]!,

    // Slider
    'slider.track': palette.colors[1]!,
    'slider.trackFill': palette.colors[5]!,
    'slider.thumb': palette.colors[6]!,
    'slider.thumbHover': palette.colors[7]!,

    // Dropdown
    'dropdown.background': palette.colors[1]!,
    'dropdown.border': palette.colors[4]!,
    'dropdown.itemHover': palette.colors[2]!,
    'dropdown.itemSelected': palette.colors[3]!,

    // Scrollbar
    'scrollbar.track': palette.colors[0]!,
    'scrollbar.thumb': palette.colors[3]!,
    'scrollbar.thumbHover': palette.colors[5]!,

    // Separator
    'separator.line': palette.colors[3]!,

    // Focus
    'focus.ring': palette.colors[6]!,

    // Tabs
    'tabs.background': palette.colors[1]!,
    'tabs.activeBackground': palette.colors[0]!,
    'tabs.border': palette.colors[3]!,
    'tabs.text': palette.colors[3]!,
    'tabs.activeText': palette.colors[5]!,
  };

  return createTheme({
    name: `Retro ${variant.charAt(0).toUpperCase() + variant.slice(1)}`,
    palette,
    fonts: {
      default: new FontBitmap('4x6'),
      small: new FontBitmap('4x6'),
      large: new FontBitmap('6x8'),
    },
    spacing: 4,
    borderRadius: 0,
    borderWidth: 1,
    colors,
  });
}

/**
 * Pre-created green phosphor retro theme.
 *
 * @since 0.5.0
 */
export const RETRO_GREEN_THEME = createRetroTheme('green');

/**
 * Pre-created amber phosphor retro theme.
 *
 * @since 0.5.0
 */
export const RETRO_AMBER_THEME = createRetroTheme('amber');
