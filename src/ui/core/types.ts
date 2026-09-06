/**
 * Core type definitions for the GameFoo UI Framework.
 *
 * @category UI
 * @module ui/core/types
 * @since 0.5.0
 */

/**
 * Horizontal alignment options for layouts and text.
 *
 * @since 0.5.0
 */
export type HorizontalAlign = 'left' | 'center' | 'right';

/**
 * Justify options for distributing children in layouts.
 *
 * @since 0.5.0
 */
export type JustifyContent = 'start' | 'center' | 'end' | 'space-between';

/**
 * Vertical alignment options for layouts.
 *
 * @since 0.5.0
 */
export type VerticalAlign = 'top' | 'center' | 'bottom';

/**
 * Anchor point for widget positioning.
 *
 * @since 0.5.0
 */
export type Anchor =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/**
 * Padding/margin specification.
 * Can be a single number (all sides) or per-side values.
 *
 * @since 0.5.0
 */
export interface Insets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * UI-specific 2D position.
 *
 * @since 0.5.0
 */
export interface UIPosition {
  x: number;
  y: number;
}

/**
 * UI-specific dimensions.
 *
 * @since 0.5.0
 */
export interface UISize {
  width: number;
  height: number;
}

/**
 * Combined position and size for layout calculations.
 *
 * @since 0.5.0
 */
export interface UIRect extends UIPosition, UISize {}

/**
 * Mouse button identifiers.
 *
 * @since 0.5.0
 */
export type MouseButton = 'left' | 'right' | 'middle';

/**
 * Base UI event with common properties.
 *
 * @since 0.5.0
 */
export interface UIEvent {
  /**
   * Whether the event has been consumed by a widget.
   */
  consumed: boolean;
  /**
   * Mark this event as consumed to stop propagation.
   */
  consume(): void;
}

/**
 * Mouse movement event.
 *
 * @since 0.5.0
 */
export interface UIMouseMoveEvent extends UIEvent {
  type: 'mousemove';
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
}

/**
 * Mouse button press/release event.
 *
 * @since 0.5.0
 */
export interface UIMouseButtonEvent extends UIEvent {
  type: 'mousedown' | 'mouseup';
  x: number;
  y: number;
  button: MouseButton;
}

/**
 * Mouse wheel event.
 *
 * @since 0.5.0
 */
export interface UIMouseWheelEvent extends UIEvent {
  type: 'mousewheel';
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
}

/**
 * Keyboard event.
 *
 * @since 0.5.0
 */
export interface UIKeyEvent extends UIEvent {
  type: 'keydown' | 'keyup';
  key: string;
  code: string;
  shift: boolean;
  ctrl: boolean;
  alt: boolean;
  meta: boolean;
}

/**
 * Character input event (for text input).
 *
 * @since 0.5.0
 */
export interface UICharInputEvent extends UIEvent {
  type: 'charinput';
  char: string;
}

/**
 * Focus change event.
 *
 * @since 0.5.0
 */
export interface UIFocusEvent extends UIEvent {
  type: 'focus' | 'blur';
}

/**
 * Union of all UI event types.
 *
 * @since 0.5.0
 */
export type UIInputEvent =
  | UIMouseMoveEvent
  | UIMouseButtonEvent
  | UIMouseWheelEvent
  | UIKeyEvent
  | UICharInputEvent
  | UIFocusEvent;

/**
 * Sizing mode for widgets.
 *
 * @since 0.5.0
 */
export type SizeMode =
  | 'fixed' // Explicit width/height
  | 'fit' // Size to content
  | 'fill' // Fill available space
  | 'percentage'; // Percentage of parent

/**
 * Widget sizing configuration.
 *
 * @since 0.5.0
 */
export interface SizeConfig {
  mode: SizeMode;
  value?: number; // For fixed/percentage modes
}

/**
 * Callback type for widget events.
 *
 * @since 0.5.0
 */
export type UICallback<T = void> = (data: T) => void;

/**
 * Event handler map for common widget events.
 *
 * @since 0.5.0
 */
export interface UIEventHandlers {
  onClick?: UICallback;
  onHover?: UICallback<boolean>;
  onFocus?: UICallback<boolean>;
  onChange?: UICallback<unknown>;
}

/**
 * Creates an Insets object from various input formats.
 *
 * @param value - Single number, [vertical, horizontal], or [top, right, bottom, left]
 * @returns Normalized Insets object
 *
 * @since 0.5.0
 */
export function createInsets(
  value: number | [number, number] | [number, number, number, number] | Insets,
): Insets {
  if (typeof value === 'number') {
    return { top: value, right: value, bottom: value, left: value };
  }
  if (Array.isArray(value)) {
    if (value.length === 2) {
      return {
        top: value[0],
        right: value[1],
        bottom: value[0],
        left: value[1],
      };
    }
    return { top: value[0], right: value[1], bottom: value[2], left: value[3] };
  }
  return value;
}

/**
 * Creates a UIRect from position and size.
 *
 * @since 0.5.0
 */
export function createRect(x: number, y: number, width: number, height: number): UIRect {
  return { x, y, width, height };
}

/**
 * Checks if a point is inside a rectangle.
 *
 * @since 0.5.0
 */
export function pointInRect(px: number, py: number, rect: UIRect): boolean {
  return px >= rect.x && px < rect.x + rect.width && py >= rect.y && py < rect.y + rect.height;
}

/**
 * Creates a base UI event object.
 *
 * @since 0.5.0
 */
export function createUIEvent(): UIEvent {
  const event: UIEvent = {
    consumed: false,
    consume() {
      this.consumed = true;
    },
  };
  return event;
}
