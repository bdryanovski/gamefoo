---
title: 'Class: Input'
---

[**@dryanovski/gamefoo v0.0.1**](../README.md)

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
const input = new Input();

if (input.isMouseButtonDown(0)) {           // left-click
  const { x, y } = input.getMousePosition();
  shoot(x, y);
}
```

## See

[Control](Control.md) — behaviour that consumes `Input` for player movement

## Constructors

### Constructor

```ts
new Input(): Input;
```

Defined in: [core/input.ts:69](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L69)

Creates a new `Input` instance and attaches global event listeners
to the `window`.

#### Returns

`Input`

#### Remarks

Only one `Input` instance should exist at a time to avoid
duplicate listeners. If you need to tear down, call [Input.reset](#reset)
to clear tracked state.

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="keys"></a> `keys` | `private` | `Set`\<`string`\> | `undefined` | Set of currently-pressed keyboard keys (lowercased). Populated on `keydown`, cleared on `keyup`. | [core/input.ts:44](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L44) |
| <a id="mousebuttons"></a> `mouseButtons` | `private` | `Set`\<`number`\> | `undefined` | Set of currently-pressed mouse button indices. Standard mapping: `0` = left, `1` = middle, `2` = right. | [core/input.ts:51](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L51) |
| <a id="mouseposition"></a> `mousePosition` | `private` | \{ `x`: `number`; `y`: `number`; \} | `{ x: 0, y: 0 }` | Last known mouse position in **client** (viewport) coordinates. | [core/input.ts:58](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L58) |
| `mousePosition.x` | `public` | `number` | `undefined` | - | [core/input.ts:58](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L58) |
| `mousePosition.y` | `public` | `number` | `undefined` | - | [core/input.ts:58](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L58) |

## Methods

### getMousePosition()

```ts
getMousePosition(): {
  x: number;
  y: number;
};
```

Defined in: [core/input.ts:162](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L162)

Returns the last known mouse position in client (viewport)
coordinates.

The returned object is a **copy** — mutating it does not affect
the internal state.

#### Returns

```ts
{
  x: number;
  y: number;
}
```

An `{ x, y }` object with the mouse coordinates.

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `x` | `number` | [core/input.ts:162](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L162) |
| `y` | `number` | [core/input.ts:162](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L162) |

#### Example

```ts
const pos = input.getMousePosition();
ctx.fillRect(pos.x, pos.y, 4, 4); // draw cursor dot
```

***

### getPressedKeys()

```ts
getPressedKeys(): Set<string>;
```

Defined in: [core/input.ts:125](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L125)

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

Defined in: [core/input.ts:107](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L107)

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

Defined in: [core/input.ts:143](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L143)

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

Defined in: [core/input.ts:178](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L178)

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
