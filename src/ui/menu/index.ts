/**
 * Menu system exports.
 *
 * @category UI
 * @module ui/menu
 * @since 0.5.0
 */

export { default as MenuPage, type IMenuPage } from './MenuPage';
export { default as MenuSystem, type MenuSystemConfig } from './MenuSystem';

// Re-export pages
export {
  AudioPage,
  type AudioPageConfig,
  ControlsPage,
  type ControlsPageConfig,
  DebugPage,
  type DebugPageConfig,
  GraphicsPage,
  type GraphicsPageConfig,
  PalettePage,
  type PalettePageConfig,
  QuitPage,
  type QuitPageConfig,
} from './pages';
