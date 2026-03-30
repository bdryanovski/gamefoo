---
title: 'Class: TerminalRenderContext'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / TerminalRenderContext

# Class: TerminalRenderContext

Defined in: [core/renderer/terminal\_renderer.ts:149](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L149)

ANSI / TTY terminal [RenderContext](../interfaces/RenderContext.md) implementation for Bun / Node.

`TerminalRenderContext` writes ANSI truecolour escape codes to
`process.stdout`, turning the terminal into a character-cell game
display. It uses **double buffering** and a **dirty-cell diff** so that
only cells that changed since the last frame are written to stdout,
minimising flicker and write volume.

---

### Coordinate mapping

Game-world coordinates (floating-point pixels) are mapped to integer
character cells via:

```
col = floor((worldX + offsetX) / cellWidth)
row = floor((worldY + offsetY) / cellHeight)
```

Typical values for an 80×24 terminal with `cellWidth = 8`:
- Logical width: `80 × 8 = 640` game pixels
- Logical height: `24 × 16 = 384` game pixels (with `cellHeight = 16`)

### Sprite rendering

`drawSprite` is a **no-op** — sprites cannot be rendered in a character
cell terminal. Use the [TerminalRender](TerminalRender.md) behaviour instead to give
entities a character-based visual representation.

### Screen lifecycle

On construction the renderer switches to the **alternate screen buffer**
(`ESC[?1049h`) and hides the cursor. Call [TerminalRenderContext.destroy](#destroy)
on exit to restore the normal screen and cursor.

## Since

0.4.0

## Examples

```ts
import { Engine, IntervalLoopDriver, TerminalRenderContext } from "gamefoo";

const renderer = new TerminalRenderContext({
  cols: process.stdout.columns ?? 80,
  rows: process.stdout.rows    ?? 24,
  cellWidth:  8,
  cellHeight: 16,
});

const engine = new Engine(renderer, {
  backgroundColor: "#000000",
  loopDriver: new IntervalLoopDriver(30),
});

engine.setup();

// Restore terminal on exit:
process.on("exit", () => renderer.destroy());
```

```ts
process.stdout.on("resize", () => {
  const cols = process.stdout.columns ?? 80;
  const rows = process.stdout.rows    ?? 24;
  renderer.resize(cols, rows);
  engine.resize(renderer.width, renderer.height);
});
```

## See

 - [RenderContext](../interfaces/RenderContext.md)   — the interface this class implements
 - [WebRenderer](WebRenderer.md)     — canvas alternative for browsers
 - [TerminalRender](TerminalRender.md)  — behaviour for character-based entity visuals

## Implements

- [`RenderContext`](../interfaces/RenderContext.md)

## Constructors

### Constructor

```ts
new TerminalRenderContext(config: TerminalRenderConfig): TerminalRenderContext;
```

Defined in: [core/renderer/terminal\_renderer.ts:194](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L194)

Creates a new `TerminalRenderContext` and initialises the TTY.

Side effects on construction:
- Switches to the alternate screen buffer (`ESC[?1049h`).
- Hides the cursor.
- Clears the screen.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`TerminalRenderConfig`](../interfaces/TerminalRenderConfig.md) | Terminal dimensions and coordinate-mapping options. |

#### Returns

`TerminalRenderContext`

#### Since

0.4.0

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="height"></a> `height` | `readonly` | `number` | `undefined` | Logical height in game-world units (`rows × cellHeight`). **Since** 0.4.0 | [core/renderer/terminal\_renderer.ts:162](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L162) |
| <a id="width"></a> `width` | `readonly` | `number` | `undefined` | Logical width in game-world units (`cols × cellWidth`). **Since** 0.4.0 | [core/renderer/terminal\_renderer.ts:155](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L155) |
| <a id="buffer"></a> `buffer` | `private` | `Cell`[][] | `undefined` | The back buffer — drawn into each frame. | [core/renderer/terminal\_renderer.ts:172](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L172) |
| <a id="cellheight"></a> `cellHeight` | `private` | `number` | `undefined` | - | [core/renderer/terminal\_renderer.ts:167](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L167) |
| <a id="cellwidth"></a> `cellWidth` | `private` | `number` | `undefined` | - | [core/renderer/terminal\_renderer.ts:166](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L166) |
| <a id="cols"></a> `cols` | `private` | `number` | `undefined` | - | [core/renderer/terminal\_renderer.ts:164](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L164) |
| <a id="defaultbg"></a> `defaultBg` | `private` | `string` | `undefined` | - | [core/renderer/terminal\_renderer.ts:168](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L168) |
| <a id="defaultfg"></a> `defaultFg` | `private` | `string` | `undefined` | - | [core/renderer/terminal\_renderer.ts:169](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L169) |
| <a id="prevbuffer"></a> `prevBuffer` | `private` | `Cell`[][] | `undefined` | The front buffer — reflects what was last written to stdout. | [core/renderer/terminal\_renderer.ts:175](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L175) |
| <a id="rows"></a> `rows` | `private` | `number` | `undefined` | - | [core/renderer/terminal\_renderer.ts:165](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L165) |
| <a id="transformstack"></a> `transformStack` | `private` | \{ `tx`: `number`; `ty`: `number`; \}[] | `[]` | - | [core/renderer/terminal\_renderer.ts:178](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L178) |
| <a id="tx"></a> `tx` | `private` | `number` | `0` | - | [core/renderer/terminal\_renderer.ts:179](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L179) |
| <a id="ty"></a> `ty` | `private` | `number` | `0` | - | [core/renderer/terminal\_renderer.ts:180](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L180) |

## Methods

### clear()

```ts
clear(color?: string): void;
```

Defined in: [core/renderer/terminal\_renderer.ts:325](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L325)

Fills the entire back buffer with blank cells using `color` as the
background.

The actual TTY is not written until [TerminalRenderContext.flush](#flush).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `string` | Background colour (hex string). Defaults to `defaultBg`. |

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`RenderContext`](../interfaces/RenderContext.md).[`clear`](../interfaces/RenderContext.md#clear)

***

### destroy()

```ts
destroy(): void;
```

Defined in: [core/renderer/terminal\_renderer.ts:661](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L661)

Restores the terminal to its normal state.

- Shows the cursor.
- Exits the alternate screen buffer.

Always call this on process exit:

```ts
process.on("exit", () => renderer.destroy());
process.on("SIGINT", () => { renderer.destroy(); process.exit(); });
```

#### Returns

`void`

#### Since

0.4.0

***

### drawChar()

```ts
drawChar(
   char: string, 
   x: number, 
   y: number, 
   color?: string, 
   bgColor?: string): void;
```

Defined in: [core/renderer/terminal\_renderer.ts:436](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L436)

Writes a single character into the cell buffer at `(x, y)`.

If `char` is longer than one character, only the first is used.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `char` | `string` | A single character (e.g. `"@"`, `"█"`). |
| `x` | `number` | Left edge in game-world units. |
| `y` | `number` | Top edge in game-world units. |
| `color` | `string` | Foreground colour. Defaults to `defaultFg`. |
| `bgColor` | `string` | Background colour. Defaults to `defaultBg`. |

#### Returns

`void`

#### Since

0.4.0

#### Example

```ts
ctx.drawChar("@", player.x, player.y, "#00ff00");
```

#### Implementation of

[`RenderContext`](../interfaces/RenderContext.md).[`drawChar`](../interfaces/RenderContext.md#drawchar)

***

### drawCircle()

```ts
drawCircle(
   x: number, 
   y: number, 
   radius: number, 
   color: string, 
   _fill?: boolean): void;
```

Defined in: [core/renderer/terminal\_renderer.ts:514](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L514)

Draws a circle outline using the midpoint circle algorithm.

Cells on the circle are filled with `"o"` characters.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `x` | `number` | `undefined` | Centre X in game-world units. |
| `y` | `number` | `undefined` | Centre Y in game-world units. |
| `radius` | `number` | `undefined` | Radius in game-world units (converted to cell radius). |
| `color` | `string` | `undefined` | Character foreground colour. |
| `_fill` | `boolean` | `false` | Ignored in terminal mode (fill not implemented). |

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`RenderContext`](../interfaces/RenderContext.md).[`drawCircle`](../interfaces/RenderContext.md#drawcircle)

***

### drawLine()

```ts
drawLine(
   x1: number, 
   y1: number, 
   x2: number, 
   y2: number, 
   color: string): void;
```

Defined in: [core/renderer/terminal\_renderer.ts:474](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L474)

Draws a line between two world positions using Bresenham's line
algorithm.

Cells along the line are filled with `"─"` (horizontal), `"│"`
(vertical), or `"·"` (diagonal) characters.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x1` | `number` | Start X in game-world units. |
| `y1` | `number` | Start Y in game-world units. |
| `x2` | `number` | End X in game-world units. |
| `y2` | `number` | End Y in game-world units. |
| `color` | `string` | Character foreground colour. |

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`RenderContext`](../interfaces/RenderContext.md).[`drawLine`](../interfaces/RenderContext.md#drawline)

***

### drawSprite()

```ts
drawSprite(): void;
```

Defined in: [core/renderer/terminal\_renderer.ts:455](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L455)

No-op — sprites cannot be rendered in terminal mode.

Attach a [TerminalRender](TerminalRender.md) behaviour to entities for
character-based visual representations in terminal mode.

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`RenderContext`](../interfaces/RenderContext.md).[`drawSprite`](../interfaces/RenderContext.md#drawsprite)

***

### drawText()

```ts
drawText(
   text: string, 
   x: number, 
   y: number, 
   color?: string, 
   bgColor?: string): void;
```

Defined in: [core/renderer/terminal\_renderer.ts:405](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L405)

Writes a text string into the cell buffer starting at `(x, y)`.

Each character occupies one cell. Characters that overflow the buffer
bounds are silently discarded.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `text` | `string` | The string to write. |
| `x` | `number` | Left edge in game-world units. |
| `y` | `number` | Top edge in game-world units. |
| `color` | `string` | Foreground colour. Defaults to `defaultFg`. |
| `bgColor` | `string` | Background colour. Defaults to `defaultBg`. |

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`RenderContext`](../interfaces/RenderContext.md).[`drawText`](../interfaces/RenderContext.md#drawtext)

***

### fillRect()

```ts
fillRect(
   x: number, 
   y: number, 
   w: number, 
   h: number, 
   color: string): void;
```

Defined in: [core/renderer/terminal\_renderer.ts:352](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L352)

Fills a rectangular region of cells with `color`.

The region is defined in game-world coordinates and converted to
cell indices automatically.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | Left edge in game-world units. |
| `y` | `number` | Top edge in game-world units. |
| `w` | `number` | Width in game-world units. |
| `h` | `number` | Height in game-world units. |
| `color` | `string` | Fill colour (hex string). |

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`RenderContext`](../interfaces/RenderContext.md).[`fillRect`](../interfaces/RenderContext.md#fillrect)

***

### flush()

```ts
flush(): void;
```

Defined in: [core/renderer/terminal\_renderer.ts:566](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L566)

Flushes changed cells to `process.stdout`.

Compares the back buffer against the front buffer (previous frame)
and writes only cells whose `char`, `fg`, or `bg` changed. This
**dirty-cell diff** avoids rewriting unchanged cells each frame,
dramatically reducing flicker and stdout write volume.

Called automatically by the [Engine](Engine.md) at the end of every tick.

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`RenderContext`](../interfaces/RenderContext.md).[`flush`](../interfaces/RenderContext.md#flush)

***

### resize()

```ts
resize(cols: number, rows: number): void;
```

Defined in: [core/renderer/terminal\_renderer.ts:623](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L623)

Reallocates the cell buffers for a new terminal size and forces a
full-screen redraw on the next [TerminalRenderContext.flush](#flush).

Call this in response to `process.stdout.on("resize", ...)`, then
also call `engine.resize(renderer.width, renderer.height)` to keep
the engine's logical dimensions in sync.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cols` | `number` | New column count. |
| `rows` | `number` | New row count. |

#### Returns

`void`

#### Since

0.4.0

#### Example

```ts
process.stdout.on("resize", () => {
  const cols = process.stdout.columns ?? 80;
  const rows = process.stdout.rows    ?? 24;
  renderer.resize(cols, rows);
  engine.resize(renderer.width, renderer.height);
});
```

***

### restore()

```ts
restore(): void;
```

Defined in: [core/renderer/terminal\_renderer.ts:240](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L240)

Pops and restores the most recently saved translation.

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`RenderContext`](../interfaces/RenderContext.md).[`restore`](../interfaces/RenderContext.md#restore)

***

### save()

```ts
save(): void;
```

Defined in: [core/renderer/terminal\_renderer.ts:231](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L231)

Pushes the current translation onto the transform stack.

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`RenderContext`](../interfaces/RenderContext.md).[`save`](../interfaces/RenderContext.md#save)

***

### scale()

```ts
scale(_x: number, _y: number): void;
```

Defined in: [core/renderer/terminal\_renderer.ts:269](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L269)

No-op in terminal mode — character cells cannot scale arbitrarily.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `_x` | `number` |
| `_y` | `number` |

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`RenderContext`](../interfaces/RenderContext.md).[`scale`](../interfaces/RenderContext.md#scale)

***

### strokeRect()

```ts
strokeRect(
   x: number, 
   y: number, 
   w: number, 
   h: number, 
   color: string): void;
```

Defined in: [core/renderer/terminal\_renderer.ts:374](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L374)

Draws a box outline using Unicode box-drawing characters
(`─`, `│`, `┌`, `┐`, `└`, `┘`).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | Left edge in game-world units. |
| `y` | `number` | Top edge in game-world units. |
| `w` | `number` | Width in game-world units. |
| `h` | `number` | Height in game-world units. |
| `color` | `string` | Foreground colour for the border characters. |

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`RenderContext`](../interfaces/RenderContext.md).[`strokeRect`](../interfaces/RenderContext.md#strokerect)

***

### translate()

```ts
translate(x: number, y: number): void;
```

Defined in: [core/renderer/terminal\_renderer.ts:259](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L259)

Adds `(x, y)` to the current translation offset.

All subsequent world coordinates are shifted by this offset before
being converted to cell indices.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | Horizontal offset in game-world units. |
| `y` | `number` | Vertical offset in game-world units. |

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`RenderContext`](../interfaces/RenderContext.md).[`translate`](../interfaces/RenderContext.md#translate)

***

### setCell()

```ts
private setCell(
   col: number, 
   row: number, 
   char: string, 
   fg: string, 
   bg: string): void;
```

Defined in: [core/renderer/terminal\_renderer.ts:298](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L298)

**`Internal`**

Writes a character to the back buffer at `(col, row)`.

Out-of-bounds writes are silently discarded.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `col` | `number` |
| `row` | `number` |
| `char` | `string` |
| `fg` | `string` |
| `bg` | `string` |

#### Returns

`void`

***

### worldToCell()

```ts
private worldToCell(x: number, y: number): [number, number];
```

Defined in: [core/renderer/terminal\_renderer.ts:285](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L285)

**`Internal`**

Converts game-world coordinates to terminal cell indices, applying
the current translation offset.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | World X. |
| `y` | `number` | World Y. |

#### Returns

\[`number`, `number`\]

`[col, row]` integer cell indices.
