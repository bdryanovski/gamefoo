/**
 * PICO-8 style pixel art theme.
 *
 * @category UI
 * @module ui/themes/PixelTheme
 * @since 0.5.0
 */

import FontBitmap from '@/core/fonts/font_bitmap';
import { PICO8 } from '@/core/palettes';
import { createTheme, type UITheme } from '../core/Theme';

/**
 * Creates a PICO-8 style pixel art theme.
 *
 * @returns The pixel theme
 *
 * @since 0.5.0
 */
export function createPixelTheme(): UITheme {
  return createTheme({
    name: 'Pixel',
    palette: PICO8,
    fonts: {
      default: new FontBitmap('4x6'),
      small: new FontBitmap('4x6'),
      large: new FontBitmap('6x8'),
    },
    spacing: 4,
    borderRadius: 0,
    borderWidth: 1,
    colors: {
      // Panel/Container - dark blue background (PICO-8 style)
      'panel.background': PICO8.colors[0]!, // black
      'panel.border': PICO8.colors[5]!, // dark gray
      'panel.header': PICO8.colors[1]!, // dark blue

      // Button - colorful PICO-8 style
      'button.background': PICO8.colors[1]!, // dark blue
      'button.backgroundHover': PICO8.colors[13]!, // indigo
      'button.backgroundPressed': PICO8.colors[0]!, // black
      'button.backgroundDisabled': PICO8.colors[5]!, // dark gray
      'button.border': PICO8.colors[5]!, // dark gray
      'button.borderFocus': PICO8.colors[10]!, // yellow
      'button.text': PICO8.colors[7]!, // white
      'button.textDisabled': PICO8.colors[6]!, // light gray

      // Label/Text
      'label.text': PICO8.colors[7]!, // white
      'label.textMuted': PICO8.colors[6]!, // light gray
      'label.textAccent': PICO8.colors[11]!, // green

      // Input
      'input.background': PICO8.colors[0]!, // black
      'input.border': PICO8.colors[5]!, // dark gray
      'input.borderFocus': PICO8.colors[12]!, // blue
      'input.text': PICO8.colors[7]!, // white
      'input.placeholder': PICO8.colors[6]!, // light gray
      'input.selection': PICO8.colors[1]!, // dark blue
      'input.caret': PICO8.colors[7]!, // white

      // Checkbox
      'checkbox.background': PICO8.colors[0]!, // black
      'checkbox.border': PICO8.colors[5]!, // dark gray
      'checkbox.check': PICO8.colors[11]!, // green
      'checkbox.backgroundChecked': PICO8.colors[3]!, // dark green

      // Slider
      'slider.track': PICO8.colors[5]!, // dark gray
      'slider.trackFill': PICO8.colors[11]!, // green
      'slider.thumb': PICO8.colors[7]!, // white
      'slider.thumbHover': PICO8.colors[10]!, // yellow

      // Dropdown
      'dropdown.background': PICO8.colors[1]!, // dark blue
      'dropdown.border': PICO8.colors[5]!, // dark gray
      'dropdown.itemHover': PICO8.colors[13]!, // indigo
      'dropdown.itemSelected': PICO8.colors[3]!, // dark green

      // Scrollbar
      'scrollbar.track': PICO8.colors[0]!, // black
      'scrollbar.thumb': PICO8.colors[5]!, // dark gray
      'scrollbar.thumbHover': PICO8.colors[6]!, // light gray

      // Separator
      'separator.line': PICO8.colors[5]!, // dark gray

      // Focus
      'focus.ring': PICO8.colors[10]!, // yellow

      // Tabs
      'tabs.background': PICO8.colors[1]!, // dark blue
      'tabs.activeBackground': PICO8.colors[0]!, // black
      'tabs.border': PICO8.colors[5]!, // dark gray
      'tabs.text': PICO8.colors[6]!, // light gray
      'tabs.activeText': PICO8.colors[7]!, // white
    },
  });
}

/**
 * Pre-created pixel theme instance.
 *
 * @since 0.5.0
 */
export const PIXEL_THEME = createPixelTheme();
