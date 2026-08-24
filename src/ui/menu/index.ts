/**
 * Menu system exports.
 *
 * @category UI
 * @module ui/menu
 * @since 0.5.0
 */

// Re-export GridSize from MonitorSystem for convenience
export type { GridSize } from '@/subsystems/monitor_system';
export {
  type AnyPalette,
  type AudioState,
  type DebugState,
  default as MenuIntegration,
  type GraphicsState,
  type MenuIntegrationCallbacks,
  type MenuIntegrationConfig,
} from './MenuIntegration';
export { default as MenuPage, type IMenuPage } from './MenuPage';
export { default as MenuSystem, type MenuSystemConfig } from './MenuSystem';
export {
  default as MenuSubSystem,
  type MenuSubSystemCallbacks,
  type MenuSubSystemConfig,
} from './MenuSubSystem';

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
