---
title: 'Interface: InputDriver'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / InputDriver

# Interface: InputDriver

Defined in: [core/input/terminal.ts:12](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input/terminal.ts#L12)

Abstraction over platform-specific keyboard input.

`InputDriver` mirrors the essential query methods of the browser
[Input](../classes/Input.md) class so that entity behaviours written against it can
work unchanged in a terminal environment by swapping the driver.

## Since

0.4.0

## See

[TerminalInputDriver](../classes/TerminalInputDriver.md) — stdin-based implementation

## Methods

### destroy()

```ts
destroy(): void;
```

Defined in: [core/input/terminal.ts:72](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input/terminal.ts#L72)

Cleans up stdin raw mode and stops listening for input events.

Call this when the game exits or the renderer is destroyed to
restore the terminal to its normal (cooked) mode.

#### Returns

`void`

#### Since

0.4.0

#### Example

```ts
process.on("exit", () => inputDriver.destroy());
```

***

### isKeyDown()

```ts
isKeyDown(key: string): boolean;
```

Defined in: [core/input/terminal.ts:25](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input/terminal.ts#L25)

Returns `true` while the key is physically held down.

In terminal raw mode a key is considered "held" from the moment a
data event arrives until the process processes another frame via
[InputDriver.update](#update). There is no reliable "key up" event in
raw TTY mode, so held keys are cleared on the next update cycle.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | The raw key string (e.g. `"w"`, `"\x1b[A"` for ↑). |

#### Returns

`boolean`

#### Since

0.4.0

***

### isKeyPressed()

```ts
isKeyPressed(key: string): boolean;
```

Defined in: [core/input/terminal.ts:37](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input/terminal.ts#L37)

Returns `true` only on the **first frame** a key is pressed.

Subsequent frames return `false` until the key is released and
pressed again.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | The raw key string. |

#### Returns

`boolean`

#### Since

0.4.0

***

### update()

```ts
update(): void;
```

Defined in: [core/input/terminal.ts:57](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input/terminal.ts#L57)

Advances the input state by one frame.

Call this once per frame (before reading key state) to move keys
from the "pressed this frame" set into the "held" state.

The engine does **not** call this automatically — wire it into a
subsystem's `update` hook or your game loop.

#### Returns

`void`

#### Since

0.4.0

#### Example

```ts
// Inside an update subsystem or game loop:
inputDriver.update();
if (inputDriver.isKeyDown("w")) player.jump();
```
