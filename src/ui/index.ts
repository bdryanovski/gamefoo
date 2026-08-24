/**
 * GameFoo UI Framework
 *
 * A complete canvas-based UI framework for the GameFoo engine.
 * Works entirely on Canvas with no HTML or DOM dependencies.
 *
 * @category UI
 * @module ui
 * @since 0.5.0
 *
 * @example Basic usage
 * ```ts
 * import { UISystem, Panel, Button, Label, DEFAULT_THEME } from 'gamefoo/ui';
 *
 * // Create UI system
 * const uiSystem = new UISystem({ theme: DEFAULT_THEME });
 * engine.use(uiSystem);
 *
 * // Create UI
 * const panel = new Panel({ width: 200, height: 100, padding: 8 });
 * panel.addChild(new Label({ text: 'Hello World' }));
 * panel.addChild(new Button({ text: 'Click Me', onClick: () => console.log('Clicked!') }));
 *
 * uiSystem.setRoot(panel);
 * uiSystem.show();
 * ```
 *
 * @example Using the menu system
 * ```ts
 * import { MenuSystem, ControlsPage, AudioPage, DebugPage, QuitPage } from 'gamefoo/ui';
 *
 * const menu = new MenuSystem({ width: 280, height: 200 });
 * menu.registerPage(new ControlsPage());
 * menu.registerPage(new AudioPage({ masterVolume: 100 }));
 * menu.registerPage(new DebugPage());
 * menu.registerPage(new QuitPage({ onQuit: () => window.close() }));
 *
 * engine.use(menu);
 * ```
 */

// Animation
export {
  createFadeTransition,
  createSlideTransition,
  Easing,
  type EasingFunction,
  Transition,
  type TransitionConfig,
  type TransitionState,
} from './animation';
// Container widgets
export {
  Panel,
  type PanelConfig,
  type TabPage,
  Tabs,
  type TabsConfig,
  Window,
  type WindowConfig,
} from './containers';
// Control widgets
export {
  Button,
  type ButtonConfig,
  Checkbox,
  type CheckboxConfig,
  Dropdown,
  type DropdownConfig,
  type DropdownItem,
  KeyBinding,
  type KeyBindingConfig,
  Slider,
  type SliderConfig,
  TextInput,
  type TextInputConfig,
  Toggle,
  type ToggleConfig,
} from './controls';
export {
  type ContainerConfig,
  default as Container,
} from './core/Container';
export {
  default as FocusManager,
  type FocusConfig,
  type NavigationDirection,
} from './core/FocusManager';
export {
  default as InputRouter,
  type InputRouterConfig,
} from './core/InputRouter';
export {
  createDefaultColorMap,
  createTheme,
  getThemeColor,
  type UIColorKey,
  type UIColorMap,
  type UITheme,
  type UIThemeConfig,
} from './core/Theme';
export * from './core/types';
export {
  default as UIStateManager,
  type StateChangeEvent,
  type WidgetState,
} from './core/UIStateManager';
export {
  default as UIWidget,
  type UIWidgetConfig,
} from './core/UIWidget';
// Display widgets
export {
  Icon,
  type IconConfig,
  Image,
  type ImageConfig,
  Label,
  type LabelConfig,
  Separator,
  type SeparatorConfig,
} from './display';
// Layouts
export {
  GridLayout,
  type GridLayoutConfig,
  HorizontalLayout,
  type HorizontalLayoutConfig,
  ScrollView,
  type ScrollViewConfig,
  StackLayout,
  type StackLayoutConfig,
  VerticalLayout,
  type VerticalLayoutConfig,
} from './layouts';
// Menu system
export {
  type AnyPalette,
  AudioPage,
  type AudioPageConfig,
  type AudioState,
  ControlsPage,
  type ControlsPageConfig,
  DebugPage,
  type DebugPageConfig,
  type DebugState,
  GraphicsPage,
  type GraphicsPageConfig,
  type GraphicsState,
  type IMenuPage,
  MenuIntegration,
  type MenuIntegrationCallbacks,
  type MenuIntegrationConfig,
  MenuPage,
  MenuSubSystem,
  type MenuSubSystemCallbacks,
  type MenuSubSystemConfig,
  MenuSystem,
  type MenuSystemConfig,
  PalettePage,
  type PalettePageConfig,
  QuitPage,
  type QuitPageConfig,
} from './menu';
// Themes
export {
  createDefaultTheme,
  createPixelTheme,
  createRetroTheme,
  DEFAULT_THEME,
  PIXEL_THEME,
  RETRO_AMBER_THEME,
  RETRO_GREEN_THEME,
} from './themes';
// Core
export { default as UISystem, type UISystemConfig } from './UISystem';
