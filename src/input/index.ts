/**
 * Keyboard, mouse, gamepad, and action-based input.
 *
 * Use the small {@link Input} primitive for demos and experiments, or
 * {@link InputSystem} when a game needs actions, control schemes, and engine
 * integration.
 *
 * @category Input
 * @module input
 *
 * @example Primitive input
 * ```ts
 * import { Input } from 'gamefoo';
 *
 * const input = new Input({ canvasId: 'game' });
 *
 * function update() {
 *   input.update();
 *   if (input.isKeyPressed('space')) player.jump();
 * }
 * ```
 *
 * @example Actions with a built-in scheme
 * ```ts
 * import { InputSystem, NES_CONTROLS } from 'gamefoo';
 *
 * const input = new InputSystem({ scheme: NES_CONTROLS, canvasId: 'game' });
 * engine.use(input);
 *
 * if (input.isActionPressed('A')) player.jump();
 * ```
 *
 * @example Custom actions
 * ```ts
 * import { InputSystem, binding, defineScheme } from 'gamefoo';
 *
 * type Action = 'left' | 'right' | 'dash';
 *
 * const scheme = defineScheme<Action>({
 *   name: 'Runner',
 *   actions: {
 *     left: binding(['a', 'arrowleft']),
 *     right: binding(['d', 'arrowright']),
 *     dash: binding(['shift'], { button: 0 }),
 *   },
 *   directions: { up: 'dash', down: 'dash', left: 'left', right: 'right' },
 * });
 *
 * const input = new InputSystem({ scheme });
 * ```
 */

export { STANDARD_ACTIONS, binding, defineActions, unassignedBinding } from './actions';
export type { ActionBinding, ActionMap, GamepadBinding, StandardAction } from './actions';
export {
  BUTTON_LABELS,
  CONTROLLER_LEGEND,
  GAMEPAD_AXIS,
  GAMEPAD_BUTTON,
  getButtonLabel,
} from './gamepad';
export type { ButtonLabelStyle } from './gamepad';
export { default as Input } from './input';
export type { InputOptions } from './input';
export { InputMapper } from './mapper';
export type { InputMapperOptions } from './mapper';
export * from './schemes';
export { InputSystem } from './system';
export type { InputSystemOptions } from './system';
