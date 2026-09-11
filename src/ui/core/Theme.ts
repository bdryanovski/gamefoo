/**
 * Theme system for the UI framework.
 *
 * Themes define the visual appearance of all widgets using colors from
 * the existing palette system. Widgets never hardcode colors - everything
 * comes from the active theme.
 *
 * @category UI
 * @module ui/core/Theme
 * @since 0.5.0
 */

import type FontBitmap from '@/core/fonts/font_bitmap';
import type { InternalBitmapFontName } from '@/core/fonts/font_bitmap';
import type { ColorPalette, HexColor } from '@/core/palettes/types';

/**
 * Semantic color keys for UI elements.
 *
 * @since 0.5.0
 */
export type UIColorKey =
  // Panel/Container
  | 'panel.background'
  | 'panel.border'
  | 'panel.header'
  // Button
  | 'button.background'
  | 'button.backgroundHover'
  | 'button.backgroundPressed'
  | 'button.backgroundDisabled'
  | 'button.border'
  | 'button.borderFocus'
  | 'button.text'
  | 'button.textDisabled'
  // Label/Text
  | 'label.text'
  | 'label.textMuted'
  | 'label.textAccent'
  // Input
  | 'input.background'
  | 'input.border'
  | 'input.borderFocus'
  | 'input.text'
  | 'input.placeholder'
  | 'input.selection'
  | 'input.caret'
  // Checkbox/Toggle
  | 'checkbox.background'
  | 'checkbox.border'
  | 'checkbox.check'
  | 'checkbox.backgroundChecked'
  // Slider
  | 'slider.track'
  | 'slider.trackFill'
  | 'slider.thumb'
  | 'slider.thumbHover'
  // Dropdown
  | 'dropdown.background'
  | 'dropdown.border'
  | 'dropdown.itemHover'
  | 'dropdown.itemSelected'
  // Scrollbar
  | 'scrollbar.track'
  | 'scrollbar.thumb'
  | 'scrollbar.thumbHover'
  // Separator
  | 'separator.line'
  // Focus ring
  | 'focus.ring'
  // Tabs
  | 'tabs.background'
  | 'tabs.activeBackground'
  | 'tabs.border'
  | 'tabs.text'
  | 'tabs.activeText';

/**
 * Color mappings for a theme.
 *
 * @since 0.5.0
 */
export type UIColorMap = Record<UIColorKey, HexColor>;

/**
 * Font configuration for a theme.
 *
 * @since 0.5.0
 */
export interface UIFonts {
  /**
   * Default font for most text
   */
  default: FontBitmap;
  /**
   * Small font for labels, hints
   */
  small: FontBitmap;
  /**
   * Large font for headers, titles
   */
  large: FontBitmap;
}

/**
 * Font name configuration (for lazy loading).
 *
 * @since 0.5.0
 */
export interface UIFontNames {
  default: InternalBitmapFontName;
  small: InternalBitmapFontName;
  large: InternalBitmapFontName;
}

/**
 * Complete UI theme definition.
 *
 * @since 0.5.0
 */
export interface UITheme {
  /**
   * Theme identifier
   */
  readonly name: string;
  /**
   * Base color palette
   */
  readonly palette: ColorPalette;
  /**
   * Semantic color mappings
   */
  readonly colors: UIColorMap;
  /**
   * Font instances
   */
  readonly fonts: UIFonts;
  /**
   * Spacing unit in pixels (widgets use multiples of this)
   */
  readonly spacing: number;
  /**
   * Border radius in pixels (0 for pixel-art sharp corners)
   */
  readonly borderRadius: number;
  /**
   * Border width in pixels
   */
  readonly borderWidth: number;
}

/**
 * Configuration for creating a theme.
 *
 * @since 0.5.0
 */
export interface UIThemeConfig {
  /**
   * Theme name
   */
  name: string;
  /**
   * Base palette
   */
  palette: ColorPalette;
  /**
   * Color overrides (partial)
   */
  colors?: Partial<UIColorMap>;
  /**
   * Font instances
   */
  fonts: UIFonts;
  /**
   * Spacing unit (default: 4)
   */
  spacing?: number;
  /**
   * Border radius (default: 0)
   */
  borderRadius?: number;
  /**
   * Border width (default: 1)
   */
  borderWidth?: number;
}

/**
 * Creates default color mappings from a palette.
 *
 * @param palette - Color palette to derive colors from
 * @returns Default color map
 *
 * @since 0.5.0
 */
export function createDefaultColorMap(palette: ColorPalette): UIColorMap {
  const colors = palette.colors;

  // Helper to get color by index with fallback
  const c = (index: number, fallback: number = 0): HexColor => {
    return colors[index] ?? colors[fallback] ?? '#000000';
  };

  // Assuming a typical 16-color palette layout:
  // 0: Black, 1: Dark, 2: Medium, 3: Light
  // 4-7: Accent colors
  // 8-15: More colors

  const hasEnough = colors.length >= 8;

  return {
    // Panel
    'panel.background': c(hasEnough ? 1 : 0),
    'panel.border': c(hasEnough ? 2 : 0),
    'panel.header': c(hasEnough ? 2 : 0),

    // Button
    'button.background': c(hasEnough ? 2 : 0),
    'button.backgroundHover': c(hasEnough ? 3 : 0),
    'button.backgroundPressed': c(hasEnough ? 1 : 0),
    'button.backgroundDisabled': c(hasEnough ? 1 : 0),
    'button.border': c(hasEnough ? 4 : 0),
    'button.borderFocus': c(hasEnough ? 7 : 0),
    'button.text': c(hasEnough ? 7 : Math.min(colors.length - 1, 1)),
    'button.textDisabled': c(hasEnough ? 5 : 0),

    // Label
    'label.text': c(hasEnough ? 7 : Math.min(colors.length - 1, 1)),
    'label.textMuted': c(hasEnough ? 5 : 0),
    'label.textAccent': c(hasEnough ? 6 : 0),

    // Input
    'input.background': c(0),
    'input.border': c(hasEnough ? 2 : 0),
    'input.borderFocus': c(hasEnough ? 7 : Math.min(colors.length - 1, 1)),
    'input.text': c(hasEnough ? 7 : Math.min(colors.length - 1, 1)),
    'input.placeholder': c(hasEnough ? 5 : 0),
    'input.selection': c(hasEnough ? 4 : 0),
    'input.caret': c(hasEnough ? 7 : Math.min(colors.length - 1, 1)),

    // Checkbox
    'checkbox.background': c(hasEnough ? 1 : 0),
    'checkbox.border': c(hasEnough ? 5 : 0),
    'checkbox.check': c(hasEnough ? 7 : Math.min(colors.length - 1, 1)),
    'checkbox.backgroundChecked': c(hasEnough ? 4 : 0),

    // Slider
    'slider.track': c(hasEnough ? 1 : 0),
    'slider.trackFill': c(hasEnough ? 4 : 0),
    'slider.thumb': c(hasEnough ? 7 : Math.min(colors.length - 1, 1)),
    'slider.thumbHover': c(hasEnough ? 6 : 0),

    // Dropdown
    'dropdown.background': c(hasEnough ? 1 : 0),
    'dropdown.border': c(hasEnough ? 2 : 0),
    'dropdown.itemHover': c(hasEnough ? 2 : 0),
    'dropdown.itemSelected': c(hasEnough ? 4 : 0),

    // Scrollbar
    'scrollbar.track': c(hasEnough ? 1 : 0),
    'scrollbar.thumb': c(hasEnough ? 3 : 0),
    'scrollbar.thumbHover': c(hasEnough ? 4 : 0),

    // Separator
    'separator.line': c(hasEnough ? 2 : 0),

    // Focus
    'focus.ring': c(hasEnough ? 7 : Math.min(colors.length - 1, 1)),

    // Tabs
    'tabs.background': c(hasEnough ? 1 : 0),
    'tabs.activeBackground': c(hasEnough ? 2 : 0),
    'tabs.border': c(hasEnough ? 3 : 0),
    'tabs.text': c(hasEnough ? 5 : 0),
    'tabs.activeText': c(hasEnough ? 7 : Math.min(colors.length - 1, 1)),
  };
}

/**
 * Creates a UI theme from configuration.
 *
 * @param config - Theme configuration
 * @returns Complete UI theme
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * import { PICO8 } from 'gamefoo/palettes';
 * import FontBitmap from 'gamefoo/fonts';
 *
 * const theme = createTheme({
 *   name: 'My Theme',
 *   palette: PICO8,
 *   fonts: {
 *     default: new FontBitmap('5x5'),
 *     small: new FontBitmap('3x5'),
 *     large: new FontBitmap('8x8'),
 *   },
 * });
 * ```
 */
export function createTheme(config: UIThemeConfig): UITheme {
  const defaultColors = createDefaultColorMap(config.palette);

  return {
    name: config.name,
    palette: config.palette,
    colors: {
      ...defaultColors,
      ...config.colors,
    },
    fonts: config.fonts,
    spacing: config.spacing ?? 4,
    borderRadius: config.borderRadius ?? 0,
    borderWidth: config.borderWidth ?? 1,
  };
}

/**
 * Helper to get a color from theme with fallback.
 *
 * @param theme - The theme
 * @param key - Color key
 * @param fallback - Fallback color if key not found
 * @returns The color
 *
 * @since 0.5.0
 */
export function getThemeColor(
  theme: UITheme,
  key: UIColorKey,
  fallback: HexColor = '#FF00FF',
): HexColor {
  return theme.colors[key] ?? fallback;
}
