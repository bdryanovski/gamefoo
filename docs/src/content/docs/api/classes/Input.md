---
title: 'Class: Input'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Input

# Class: Input

Defined in: [core/input.ts:66](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L66)

Unified keyboard, mouse, and gamepad input manager.

`Input` listens to `keydown`, `keyup`, `mousedown`, `mouseup`, and
`mousemove` events on the `window` and exposes a polling API so game
logic can query the current state at any point during a frame rather
than relying on event callbacks.

All keyboard keys are stored **lowercased** for case-insensitive
look-ups.

Implements [SubSystem](../interfaces/SubSystem.md) so it can be registered with the Engine
via `engine.use(input)` for automatic updates each frame.

## Since

0.1.0

## Examples

**Polling keys**

```ts
const input = new Input();

function update() {
  if (input.isKeyDown("w")) {
    player.y -= speed;
  }
}
```

**Checking mouse state (canvas-relative)**

```ts
const input = new Input({ canvasId: "game", gameScale: 2 });

if (input.isMouseButtonDown(0)) {           // left-click
  const { x, y } = input.getMousePosition();
  shoot(x, y); // coordinates are in game-world space
}
```

**Using as a subsystem (recommended)**

```ts
const input = new Input({ canvasId: "game" });
const mapper = new InputMapper(input, NES_CONTROLS);

engine.use(input); // Auto-updates each frame

// In game logic:
if (mapper.isActionPressed('A')) player.jump();
```

**Manual update (without Engine)**

```ts
const input = new Input({ canvasId: "game" });
const mapper = new InputMapper(input, NES_CONTROLS);

function gameLoop() {
  input.update(); // Required for "just pressed" detection
  if (mapper.isActionPressed('A')) player.jump();
}
```

## See

 - [Control](Control.md) — behaviour that consumes `Input` for player movement
 - [InputMapper](InputMapper.md) — action-based input mapping using control schemes

## Implements

- [`SubSystem`](../interfaces/SubSystem.md)

## Constructors

### Constructor

```ts
new Input(options?: {
  canvasId?: string;
  deadzone?: number;
  gameScale?: number;
}): Input;
```

Defined in: [core/input.ts:188](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L188)

Creates a new `Input` instance and attaches global event listeners
to the `window`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | \{ `canvasId?`: `string`; `deadzone?`: `number`; `gameScale?`: `number`; \} | Optional configuration for canvas-relative mouse tracking. |
| `options.canvasId?` | `string` | The `id` of the canvas element. When provided, mouse positions are returned relative to the canvas. |
| `options.deadzone?` | `number` | Gamepad analog stick deadzone (default: 0.3). |
| `options.gameScale?` | `number` | The pixel scale factor (default: 1). Use this when your game uses a scaled canvas (e.g., pixel-art games). |

#### Returns

`Input`

#### Remarks

Only one `Input` instance should exist at a time to avoid
duplicate listeners. If you need to tear down, call [Input.reset](#reset)
to clear tracked state.

#### Examples

**Window coordinates (default)**

```ts
const input = new Input();
```

**Canvas-relative coordinates**

```ts
const input = new Input({ canvasId: "game" });
```

**Canvas-relative with scale factor**

```ts
const input = new Input({ canvasId: "game", gameScale: 4 });
```

**With custom deadzone**

```ts
const input = new Input({ canvasId: "game", deadzone: 0.2 });
```

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="enabled"></a> `enabled` | `public` | `boolean` | `true` | Whether the subsystem is enabled. **Since** 0.5.0 | [core/input.ts:87](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L87) |
| <a id="id"></a> `id` | `readonly` | `"input"` | `'input'` | Subsystem identifier. **Since** 0.5.0 | [core/input.ts:72](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L72) |
| <a id="order"></a> `order` | `readonly` | `0` | `0` | Subsystem execution order. Runs early (order 0) so input state is available to all other subsystems. **Since** 0.5.0 | [core/input.ts:80](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L80) |
| <a id="canvas"></a> `canvas` | `private` | `HTMLCanvasElement` \| `null` | `null` | Reference to the canvas element for coordinate conversion. **Since** 0.4.0 | [core/input.ts:134](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L134) |
| <a id="gamepaddeadzone"></a> `gamepadDeadzone` | `private` | `number` | `0.3` | Analog stick deadzone threshold. Axis values below this threshold are treated as zero. **Since** 0.5.0 | [core/input.ts:150](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L150) |
| <a id="gamescale"></a> `gameScale` | `private` | `number` | `1` | Scale factor to convert from CSS pixels to game-world coordinates. **Since** 0.4.0 | [core/input.ts:141](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L141) |
| <a id="keys"></a> `keys` | `private` | `Set`\<`string`\> | `undefined` | Set of currently-pressed keyboard keys (lowercased). Populated on `keydown`, cleared on `keyup`. | [core/input.ts:93](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L93) |
| <a id="keysjustpressed"></a> `keysJustPressed` | `private` | `Set`\<`string`\> | `undefined` | Set of keys that were just pressed this frame. Populated by [Input.update](#update), contains keys that are down this frame but weren't down last frame. **Since** 0.5.0 | [core/input.ts:112](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L112) |
| <a id="keyslastframe"></a> `keysLastFrame` | `private` | `Set`\<`string`\> | `undefined` | Set of keys that were pressed in the previous frame. Used to detect "just pressed" state. **Since** 0.5.0 | [core/input.ts:102](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L102) |
| <a id="mousebuttons"></a> `mouseButtons` | `private` | `Set`\<`number`\> | `undefined` | Set of currently-pressed mouse button indices. Standard mapping: `0` = left, `1` = middle, `2` = right. | [core/input.ts:119](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L119) |
| <a id="mouseposition"></a> `mousePosition` | `private` | \{ `x`: `number`; `y`: `number`; \} | `{ x: 0, y: 0 }` | Last known mouse position in game-world coordinates (canvas-relative and scale-adjusted when a canvas is provided). | [core/input.ts:127](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L127) |
| `mousePosition.x` | `public` | `number` | `undefined` | - | [core/input.ts:127](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L127) |
| `mousePosition.y` | `public` | `number` | `undefined` | - | [core/input.ts:127](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L127) |

## Methods

### getDeadzone()

```ts
getDeadzone(): number;
```

Defined in: [core/input.ts:425](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L425)

Gets the current gamepad deadzone threshold.

#### Returns

`number`

The deadzone value (0.0 - 1.0)

#### Since

0.5.0

***

### getGamepad()

```ts
getGamepad(index?: number): Gamepad | null;
```

Defined in: [core/input.ts:411](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L411)

Gets a gamepad by index using the Gamepad API.

Returns `null` if no gamepad is connected at the given index or
if the Gamepad API is not available.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `index` | `number` | `0` | Gamepad index (0-3, default: 0) |

#### Returns

`Gamepad` \| `null`

The Gamepad object or null if not available

#### Since

0.5.0

#### Example

```ts
const gamepad = input.getGamepad(0);
if (gamepad) {
  // Check A button (standard mapping)
  if (gamepad.buttons[0].pressed) {
    player.jump();
  }

  // Check left stick
  const stickX = gamepad.axes[0];
  const stickY = gamepad.axes[1];
}
```

***

### getMousePosition()

```ts
getMousePosition(): {
  x: number;
  y: number;
};
```

Defined in: [core/input.ts:381](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L381)

Returns the last known mouse position.

When a canvas was provided in the constructor, coordinates are
relative to the canvas and adjusted for `gameScale`. Otherwise,
coordinates are in client (viewport) space.

The returned object is a **copy** — mutating it does not affect
the internal state.

#### Returns

```ts
{
  x: number;
  y: number;
}
```

An `{ x, y }` object with the mouse coordinates in game-world space.

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `x` | `number` | [core/input.ts:381](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L381) |
| `y` | `number` | [core/input.ts:381](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L381) |

#### Example

```ts
const input = new Input({ canvasId: "game", gameScale: 2 });
const pos = input.getMousePosition();
// pos.x and pos.y are now in game-world coordinates
ctx.fillRect(pos.x, pos.y, 4, 4); // draw cursor dot at mouse position
```

***

### getPressedKeys()

```ts
getPressedKeys(): Set<string>;
```

Defined in: [core/input.ts:339](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L339)

Returns a snapshot of all keys that are currently held down.

The returned `Set` is a **copy** — mutating it does not affect
the internal state.

#### Returns

`Set`\<`string`\>

A new `Set<string>` of pressed key names (lowercased).

#### Example

```ts
const pressed = input.getPressedKeys();
console.log([...pressed]); // e.g. ["w", "shift"]
```

***

### isKeyDown()

```ts
isKeyDown(key: string): boolean;
```

Defined in: [core/input.ts:296](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L296)

Checks whether a specific key is currently held down.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | The key name to check (case-insensitive). Uses the standard KeyboardEvent.key values (e.g. `"a"`, `"ArrowLeft"`, `"Shift"`). |

#### Returns

`boolean`

`true` if the key is currently pressed.

#### Example

```ts
if (input.isKeyDown("space")) {
  player.jump();
}
```

***

### isKeyPressed()

```ts
isKeyPressed(key: string): boolean;
```

Defined in: [core/input.ts:321](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L321)

Checks whether a specific key was just pressed this frame.

Returns `true` only on the first frame a key is pressed, then
`false` on subsequent frames even if the key is still held.

**Requires [Input.update](#update) to be called each frame.**

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | The key name to check (case-insensitive). |

#### Returns

`boolean`

`true` if the key was just pressed this frame.

#### Since

0.5.0

#### Example

```ts
// In game loop (after calling input.update())
if (input.isKeyPressed("space")) {
  player.jump(); // Only triggers once per press
}
```

***

### isMouseButtonDown()

```ts
isMouseButtonDown(button: number): boolean;
```

Defined in: [core/input.ts:357](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L357)

Checks whether a specific mouse button is currently held down.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `button` | `number` | The mouse button index (`0` = left, `1` = middle, `2` = right). |

#### Returns

`boolean`

`true` if the button is currently pressed.

#### Example

```ts
if (input.isMouseButtonDown(2)) {
  openContextMenu();
}
```

***

### preUpdate()

```ts
preUpdate(_deltaTime: number): void;
```

Defined in: [core/input.ts:240](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L240)

SubSystem hook: called at the start of each frame.

When registered with the Engine via `engine.use(input)`, this method
is called automatically, ensuring "just pressed" detection works.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `_deltaTime` | `number` | Seconds since last frame (unused). |

#### Returns

`void`

#### Since

0.5.0

#### Implementation of

[`SubSystem`](../interfaces/SubSystem.md).[`preUpdate`](../interfaces/SubSystem.md#preupdate)

***

### reset()

```ts
reset(): void;
```

Defined in: [core/input.ts:461](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L461)

Clears all tracked key and mouse-button state.

Useful when pausing the game or switching scenes to prevent stale
input from carrying over.

#### Returns

`void`

#### Example

```ts
engine.pause();
input.reset();
```

***

### setDeadzone()

```ts
setDeadzone(value: number): void;
```

Defined in: [core/input.ts:445](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L445)

Sets the gamepad analog stick deadzone.

Axis values below this threshold are treated as zero, helping
prevent drift from analog sticks at rest.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Deadzone threshold (0.0 - 1.0) |

#### Returns

`void`

#### Since

0.5.0

#### Example

```ts
input.setDeadzone(0.2); // Lower deadzone for more sensitivity
input.setDeadzone(0.4); // Higher deadzone for less sensitivity
```

***

### update()

```ts
update(): void;
```

Defined in: [core/input.ts:268](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L268)

Updates the input state for the current frame.

Call this once at the beginning of each frame to enable "just pressed"
detection via [Input.isKeyPressed](#iskeypressed). Without calling this method,
`isKeyPressed` will always return `false`.

When using Input as a subsystem via `engine.use(input)`, this is
called automatically and you don't need to call it manually.

#### Returns

`void`

#### Since

0.5.0

#### Example

```ts
// Manual usage (without Engine)
function gameLoop() {
  input.update(); // Call first thing each frame

  if (input.isKeyPressed('space')) {
    player.jump(); // Only triggers once per press
  }
}
```

#### Implementation of

[`SubSystem`](../interfaces/SubSystem.md).[`update`](../interfaces/SubSystem.md#update)
