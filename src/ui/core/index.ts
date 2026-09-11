/**
 * Core UI framework exports.
 *
 * @category UI
 * @module ui/core
 * @since 0.5.0
 */

export { type ContainerConfig, default as Container } from './Container';
export {
  default as FocusManager,
  type FocusConfig,
  type NavigationDirection,
} from './FocusManager';
export { default as InputRouter, type InputRouterConfig } from './InputRouter';
export {
  createDefaultColorMap,
  createTheme,
  getThemeColor,
  type UIColorKey,
  type UIColorMap,
  type UIFontNames,
  type UIFonts,
  type UITheme,
  type UIThemeConfig,
} from './Theme';
export {
  type Anchor,
  createInsets,
  createRect,
  createUIEvent,
  type HorizontalAlign,
  type Insets,
  type JustifyContent,
  type MouseButton,
  pointInRect,
  type SizeConfig,
  type SizeMode,
  type UICallback,
  type UICharInputEvent,
  type UIEvent,
  type UIEventHandlers,
  type UIFocusEvent,
  type UIInputEvent,
  type UIKeyEvent,
  type UIMouseButtonEvent,
  type UIMouseMoveEvent,
  type UIMouseWheelEvent,
  type UIPosition,
  type UIRect,
  type UISize,
  type VerticalAlign,
} from './types';
export {
  default as UIStateManager,
  type StateChangeEvent,
  type StateChangeListener,
  type WidgetState,
} from './UIStateManager';
export { default as UIWidget, type UIWidgetConfig } from './UIWidget';
