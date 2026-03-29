---
title: 'Class: TerminalInputDriver'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / TerminalInputDriver

# Class: TerminalInputDriver

Defined in: [core/input/terminal.ts:121](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input/terminal.ts#L121)

Terminal keyboard input driver using `process.stdin` in raw mode.

In raw mode the OS delivers each keypress immediately as raw bytes —
no line buffering, no echo. Arrow keys arrive as multi-byte escape
sequences (e.g. `"\x1b[A"` for ↑).

**`Ctrl+C`** always calls `process.exit()` to prevent the process from
hanging when the TTY is in raw mode.

### Common key strings

| Key       | Raw string   |
|-----------|--------------|
| `w/a/s/d` | `"w"/"a"/"s"/"d"` |
| Arrow Up  | `"\x1b[A"`   |
| Arrow Down | `"\x1b[B"`  |
| Arrow Right | `"\x1b[C"` |
| Arrow Left  | `"\x1b[D"` |
| Enter     | `"\r"`       |
| Space     | `" "`        |
| Escape    | `"\x1b"`     |

## Since

0.4.0

## Example

```ts
import { TerminalInputDriver, IntervalLoopDriver, TerminalRenderContext, Engine } from "gamefoo";

const input    = new TerminalInputDriver();
const renderer = new TerminalRenderContext({ cols: 80, rows: 24 });
const engine   = new Engine(renderer, {
  loopDriver: new IntervalLoopDriver(30),
});

engine.setup(() => {
  console.log("Use WASD to move, Ctrl+C to quit.");
});

// In your entity update:
// input.update();
// if (input.isKeyDown("w")) player.moveUp();
```

## See

[InputDriver](../interfaces/InputDriver.md) — the interface this class implements

## Implements

- [`InputDriver`](../interfaces/InputDriver.md)

## Constructors

### Constructor

```ts
new TerminalInputDriver(): TerminalInputDriver;
```

Defined in: [core/input/terminal.ts:151](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input/terminal.ts#L151)

Creates a new `TerminalInputDriver` and configures `process.stdin`.

- Enables **raw mode** if `stdin` is a TTY (disables line buffering
  and character echo).
- Resumes the stdin stream so data events fire.
- Registers a `data` listener for key processing.
- Automatically exits the process on `Ctrl+C` (`\u0003`).

#### Returns

`TerminalInputDriver`

#### Since

0.4.0

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="held"></a> `held` | `private` | `Set`\<`string`\> | Keys currently considered held (received at least one data event since the last [TerminalInputDriver.update](#update) call). | [core/input/terminal.ts:126](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input/terminal.ts#L126) |
| <a id="nextpressed"></a> `nextPressed` | `private` | `Set`\<`string`\> | Keys that arrived from stdin since the last update. Promoted to `pressed` on the next [TerminalInputDriver.update](#update) call. | [core/input/terminal.ts:138](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input/terminal.ts#L138) |
| <a id="pressed"></a> `pressed` | `private` | `Set`\<`string`\> | Keys that are "pressed" for the current frame only (set during the previous update cycle). | [core/input/terminal.ts:132](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input/terminal.ts#L132) |

## Methods

### destroy()

```ts
destroy(): void;
```

Defined in: [core/input/terminal.ts:208](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input/terminal.ts#L208)

Disables raw mode and pauses stdin.

Call on game exit to restore the terminal to normal (cooked) mode.

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`InputDriver`](../interfaces/InputDriver.md).[`destroy`](../interfaces/InputDriver.md#destroy)

***

### isKeyDown()

```ts
isKeyDown(key: string): boolean;
```

Defined in: [core/input/terminal.ts:171](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input/terminal.ts#L171)

Returns `true` while the key string is in the held set.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | Raw key string (see class-level table). |

#### Returns

`boolean`

#### Since

0.4.0

#### Implementation of

[`InputDriver`](../interfaces/InputDriver.md).[`isKeyDown`](../interfaces/InputDriver.md#iskeydown)

***

### isKeyPressed()

```ts
isKeyPressed(key: string): boolean;
```

Defined in: [core/input/terminal.ts:183](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input/terminal.ts#L183)

Returns `true` only on the frame a key first appears in the pressed
set.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | Raw key string. |

#### Returns

`boolean`

#### Since

0.4.0

#### Implementation of

[`InputDriver`](../interfaces/InputDriver.md).[`isKeyPressed`](../interfaces/InputDriver.md#iskeypressed)

***

### update()

```ts
update(): void;
```

Defined in: [core/input/terminal.ts:196](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input/terminal.ts#L196)

Advances input state by one frame.

Moves keys from `nextPressed` into `pressed` for one-frame detection,
then clears `nextPressed`. Note that "key up" detection is not
supported in raw TTY mode — held keys are not automatically cleared.

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`InputDriver`](../interfaces/InputDriver.md).[`update`](../interfaces/InputDriver.md#update)
