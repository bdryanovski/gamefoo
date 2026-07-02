---
title: 'Class: Input'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Input

# Class: Input

Defined in: [core/input.ts:38](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L38)

Unified keyboard and mouse input manager.

`Input` listens to `keydown`, `keyup`, `mousedown`, `mouseup`, and
`mousemove` events on the `window` and exposes a polling API so game
logic can query the current state at any point during a frame rather
than relying on event callbacks.

All keyboard keys are stored **lowercased** for case-insensitive
look-ups.

## Since

0.1.0

## Examples

```ts
const input = new Input();

function update() {
  if (input.isKeyDown("w")) {
    player.y -= speed;
  }
}
```

```ts
const input = new Input({ canvasId: "game", gameScale: 2 });

if (input.isMouseButtonDown(0)) {           // left-click
  const { x, y } = input.getMousePosition();
  shoot(x, y); // coordinates are in game-world space
}
```

## See

[Control](Control.md) — behaviour that consumes `Input` for player movement

## Constructors

### Constructor

```ts
new Input(options?: {
  canvasId?: string;
  gameScale?: number;
}): Input;
```

Defined in: [core/input.ts:105](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L105)

Creates a new `Input` instance and attaches global event listeners
to the `window`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | \{ `canvasId?`: `string`; `gameScale?`: `number`; \} | Optional configuration for canvas-relative mouse tracking. |
| `options.canvasId?` | `string` | The `id` of the canvas element. When provided, mouse positions are returned relative to the canvas. |
| `options.gameScale?` | `number` | The pixel scale factor (default: 1). Use this when your game uses a scaled canvas (e.g., pixel-art games). |

#### Returns

`Input`

#### Remarks

Only one `Input` instance should exist at a time to avoid
duplicate listeners. If you need to tear down, call [Input.reset](#reset)
to clear tracked state.

#### Examples

```ts
const input = new Input();
```

```ts
const input = new Input({ canvasId: "game" });
```

```ts
const input = new Input({ canvasId: "game", gameScale: 4 });
```

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="canvas"></a> `canvas` | `private` | `HTMLCanvasElement` \| `null` | `null` | Reference to the canvas element for coordinate conversion. **Since** 0.4.0 | [core/input.ts:66](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L66) |
| <a id="gamescale"></a> `gameScale` | `private` | `number` | `1` | Scale factor to convert from CSS pixels to game-world coordinates. **Since** 0.4.0 | [core/input.ts:73](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L73) |
| <a id="keys"></a> `keys` | `private` | `Set`\<`string`\> | `undefined` | Set of currently-pressed keyboard keys (lowercased). Populated on `keydown`, cleared on `keyup`. | [core/input.ts:44](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L44) |
| <a id="mousebuttons"></a> `mouseButtons` | `private` | `Set`\<`number`\> | `undefined` | Set of currently-pressed mouse button indices. Standard mapping: `0` = left, `1` = middle, `2` = right. | [core/input.ts:51](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L51) |
| <a id="mouseposition"></a> `mousePosition` | `private` | \{ `x`: `number`; `y`: `number`; \} | `{ x: 0, y: 0 }` | Last known mouse position in game-world coordinates (canvas-relative and scale-adjusted when a canvas is provided). | [core/input.ts:59](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L59) |
| `mousePosition.x` | `public` | `number` | `undefined` | - | [core/input.ts:59](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L59) |
| `mousePosition.y` | `public` | `number` | `undefined` | - | [core/input.ts:59](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L59) |

## Methods

### getMousePosition()

```ts
getMousePosition(): {
  x: number;
  y: number;
};
```

Defined in: [core/input.ts:221](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L221)

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
| `x` | `number` | [core/input.ts:221](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L221) |
| `y` | `number` | [core/input.ts:221](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L221) |

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

Defined in: [core/input.ts:179](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L179)

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

Defined in: [core/input.ts:161](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L161)

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

### isMouseButtonDown()

```ts
isMouseButtonDown(button: number): boolean;
```

Defined in: [core/input.ts:197](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L197)

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

### reset()

```ts
reset(): void;
```

Defined in: [core/input.ts:237](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L237)

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
