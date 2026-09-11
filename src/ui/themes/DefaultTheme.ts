/**
 * Default UI theme with neutral colors.
 *
 * @category UI
 * @module ui/themes/DefaultTheme
 * @since 0.5.0
 */

import FontBitmap from '@/core/fonts/font_bitmap';
import { TIC80 } from '@/core/palettes';
import { createTheme, type UITheme } from '../core/Theme';

/**
 * Creates the default UI theme.
 *
 * Uses the TIC-80 palette for a clean, neutral appearance.
 *
 * @returns The default theme
 *
 * @since 0.5.0
 */
export function createDefaultTheme(): UITheme {
  return createTheme({
    name: 'Default',
    palette: TIC80,
    fonts: {
      default: new FontBitmap('4x6'),
      small: new FontBitmap('4x6'),
      large: new FontBitmap('6x8'),
    },
    spacing: 4,
    borderRadius: 0,
    borderWidth: 1,
    colors: {
      // Panel/Container - dark background
      'panel.background': TIC80.colors[0]!, // black
      'panel.border': TIC80.colors[13]!, // gray
      'panel.header': TIC80.colors[1]!, // dark gray

      // Button - medium tone
      'button.background': TIC80.colors[15]!, // dark gray
      'button.backgroundHover': TIC80.colors[14]!, // gray
      'button.backgroundPressed': TIC80.colors[0]!, // black
      'button.backgroundDisabled': TIC80.colors[15]!, // dark gray
      'button.border': TIC80.colors[14]!, // gray
      'button.borderFocus': TIC80.colors[10]!, // light blue
      'button.text': TIC80.colors[12]!, // white
      'button.textDisabled': TIC80.colors[14]!, // gray

      // Label/Text
      'label.text': TIC80.colors[12]!, // white
      'label.textMuted': TIC80.colors[13]!, // light gray
      'label.textAccent': TIC80.colors[10]!, // light blue

      // Input
      'input.background': TIC80.colors[0]!, // black
      'input.border': TIC80.colors[14]!, // gray
      'input.borderFocus': TIC80.colors[10]!, // light blue
      'input.text': TIC80.colors[12]!, // white
      'input.placeholder': TIC80.colors[14]!, // gray
      'input.selection': TIC80.colors[15]!, // dark gray
      'input.caret': TIC80.colors[12]!, // white

      // Checkbox
      'checkbox.background': TIC80.colors[15]!, // dark gray
      'checkbox.border': TIC80.colors[14]!, // gray
      'checkbox.check': TIC80.colors[12]!, // white
      'checkbox.backgroundChecked': TIC80.colors[6]!, // green

      // Slider
      'slider.track': TIC80.colors[15]!, // dark gray
      'slider.trackFill': TIC80.colors[10]!, // light blue
      'slider.thumb': TIC80.colors[12]!, // white
      'slider.thumbHover': TIC80.colors[10]!, // light blue

      // Dropdown
      'dropdown.background': TIC80.colors[15]!, // dark gray
      'dropdown.border': TIC80.colors[14]!, // gray
      'dropdown.itemHover': TIC80.colors[14]!, // gray
      'dropdown.itemSelected': TIC80.colors[6]!, // green

      // Scrollbar
      'scrollbar.track': TIC80.colors[0]!, // black
      'scrollbar.thumb': TIC80.colors[14]!, // gray
      'scrollbar.thumbHover': TIC80.colors[12]!, // white

      // Separator
      'separator.line': TIC80.colors[14]!, // gray

      // Focus
      'focus.ring': TIC80.colors[10]!, // light blue

      // Tabs
      'tabs.background': TIC80.colors[15]!, // dark gray
      'tabs.activeBackground': TIC80.colors[0]!, // black
      'tabs.border': TIC80.colors[14]!, // gray
      'tabs.text': TIC80.colors[13]!, // light gray
      'tabs.activeText': TIC80.colors[12]!, // white
    },
  });
}

/**
 * Pre-created default theme instance.
 *
 * @since 0.5.0
 */
export const DEFAULT_THEME = createDefaultTheme();
