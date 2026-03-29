---
title: 'Interface: RenderContext'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / RenderContext

# Interface: RenderContext

Defined in: [core/renderer/type.ts:52](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L52)

The unified rendering surface interface used throughout the engine.

Every place that previously accepted `CanvasRenderingContext2D` now
accepts `RenderContext`. This decouples game logic from the specific
rendering backend so the same entities and subsystems can run under:

- **[WebRenderer](../classes/WebRenderer.md)** — wraps the browser's `CanvasRenderingContext2D`.
- **[TerminalRenderContext](../classes/TerminalRenderContext.md)** — writes ANSI escape codes to
  `process.stdout` in Bun / Node terminal environments.

---

### Coordinate space

- **Canvas mode**: logical units are CSS pixels (floating-point).
- **Terminal mode**: logical units are game-world pixels; the renderer
  maps them to character cells via configurable `cellWidth` / `cellHeight`.

### Optional methods

`drawSprite` and `flush` are optional because:
- Terminal renderers cannot render pixel sprites (`drawSprite` is a no-op).
- Canvas renderers are immediate-mode and do not need flushing.

## Since

0.4.0

## Example

```ts
import type { RenderContext } from "gamefoo";

class NullRenderer implements RenderContext {
  readonly width = 800;
  readonly height = 600;
  save() {}
  restore() {}
  translate(_x: number, _y: number) {}
  scale(_x: number, _y: number) {}
  clear(_color?: string) {}
  fillRect(_x: number, _y: number, _w: number, _h: number, _color: string) {}
  strokeRect(_x: number, _y: number, _w: number, _h: number, _color: string) {}
  drawText(_text: string, _x: number, _y: number) {}
  drawChar(_char: string, _x: number, _y: number) {}
  drawLine(_x1: number, _y1: number, _x2: number, _y2: number, _color: string) {}
  drawCircle(_x: number, _y: number, _radius: number, _color: string) {}
}
```

## See

 - [WebRenderer](../classes/WebRenderer.md)          — canvas implementation
 - [TerminalRenderContext](../classes/TerminalRenderContext.md) — ANSI terminal implementation

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="height"></a> `height` | `readonly` | `number` | Logical height of the rendering surface. - Canvas: pixel height of the `<canvas>` element. - Terminal: `rows × cellHeight` in game-world units. **Since** 0.4.0 | [core/renderer/type.ts:71](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L71) |
| <a id="width"></a> `width` | `readonly` | `number` | Logical width of the rendering surface. - Canvas: pixel width of the `<canvas>` element. - Terminal: `cols × cellWidth` in game-world units. **Since** 0.4.0 | [core/renderer/type.ts:61](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L61) |

## Methods

### clear()

```ts
clear(color?: string): void;
```

Defined in: [core/renderer/type.ts:142](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L142)

Clears the entire surface, optionally filling it with a background
colour.

On terminal renderers this fills the double-buffer with blank cells;
the actual TTY output only changes on the next [RenderContext.flush](#flush).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color?` | `string` | Fill colour (CSS colour string). Defaults to black. |

#### Returns

`void`

#### Since

0.4.0

#### Example

```ts
ctx.clear("#1a1a2e");
```

***

### drawChar()

```ts
drawChar(
   character: string, 
   x: number, 
   y: number, 
   color?: string, 
   bgColor?: string): void;
```

Defined in: [core/renderer/type.ts:232](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L232)

Draws a single character at the specified position.

Equivalent to calling `drawText(char, x, y, ...)` with a one-character
string. Provided as a convenience for terminal-mode entity rendering
via [TerminalRender](../classes/TerminalRender.md).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `character` | `string` | A single character. |
| `x` | `number` | Left edge in logical units. |
| `y` | `number` | Top edge in logical units. |
| `color?` | `string` | Foreground colour. Defaults to white. |
| `bgColor?` | `string` | Background colour. Defaults to black (terminal only). |

#### Returns

`void`

#### Since

0.4.0

#### Example

```ts
ctx.drawChar("@", player.x, player.y, "#00ff00");
```

***

### drawCircle()

```ts
drawCircle(
   x: number, 
   y: number, 
   radius: number, 
   color: string, 
   fill?: boolean): void;
```

Defined in: [core/renderer/type.ts:300](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L300)

Draws a circle outline (or filled circle).

Terminal renderers use the midpoint circle algorithm with `"o"`
characters.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | Centre X. |
| `y` | `number` | Centre Y. |
| `radius` | `number` | Radius in logical units. |
| `color` | `string` | Stroke / fill colour. |
| `fill?` | `boolean` | If `true`, fill the circle. Default `false`. |

#### Returns

`void`

#### Since

0.4.0

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

Defined in: [core/renderer/type.ts:284](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L284)

Draws a straight line between two points.

Terminal renderers approximate the line using Bresenham's algorithm
and box-drawing characters.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x1` | `number` | Start X. |
| `y1` | `number` | Start Y. |
| `x2` | `number` | End X. |
| `y2` | `number` | End Y. |
| `color` | `string` | Line colour. |

#### Returns

`void`

#### Since

0.4.0

***

### drawSprite()?

```ts
optional drawSprite(
   source: string | HTMLImageElement | null, 
   sourceX: number, 
   sourceY: number, 
   sourceWidth: number, 
   souceHeight: number, 
   destinationX: number, 
   destinationY: number, 
   destinationWidth: number, 
   destinationHeight: number): void;
```

Defined in: [core/renderer/type.ts:258](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L258)

Draws a sprite (image region) onto the surface. **Optional.**

Terminal renderers implement this as a no-op. Canvas renderers
delegate to `ctx.drawImage(...)`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `source` | `string` \| `HTMLImageElement` \| `null` | The source image or `null`. |
| `sourceX` | `number` | X offset inside the source image. |
| `sourceY` | `number` | Y offset inside the source image. |
| `sourceWidth` | `number` | Width of the source region. |
| `souceHeight` | `number` | Height of the source region. |
| `destinationX` | `number` | X position on the canvas. |
| `destinationY` | `number` | Y position on the canvas. |
| `destinationWidth` | `number` | Rendered width. |
| `destinationHeight` | `number` | - |

#### Returns

`void`

#### Since

0.4.0

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

Defined in: [core/renderer/type.ts:204](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L204)

Draws a text string at the specified position.

- **Canvas**: delegates to `CanvasRenderingContext2D.fillText`.
- **Terminal**: writes each character directly into the cell buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `text` | `string` | The string to render. |
| `x` | `number` | Left edge in logical units. |
| `y` | `number` | Top edge (baseline) in logical units. |
| `color?` | `string` | Foreground colour. Defaults to white. |
| `bgColor?` | `string` | Background colour. Defaults to black (terminal only). |

#### Returns

`void`

#### Since

0.4.0

#### Example

```ts
ctx.drawText("SCORE: 100", 8, 8, "#ffff00");
```

***

### fillRect()

```ts
fillRect(
   x: number, 
   y: number, 
   width: number, 
   height: number, 
   color: string): void;
```

Defined in: [core/renderer/type.ts:155](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L155)

Draws a filled rectangle.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | Left edge in logical units. |
| `y` | `number` | Top edge in logical units. |
| `width` | `number` | Rectangle width. |
| `height` | `number` | Rectangle height. |
| `color` | `string` | Fill colour (CSS colour string). |

#### Returns

`void`

#### Since

0.4.0

***

### flush()?

```ts
optional flush(): void;
```

Defined in: [core/renderer/type.ts:318](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L318)

Flushes buffered output to the display. **Optional.**

- **Terminal**: performs a dirty-cell diff against the previous frame
  and writes only changed cells to `process.stdout`. Call this at the
  end of every frame (the engine does this automatically).
- **Canvas**: no-op (immediate-mode rendering needs no flush).

#### Returns

`void`

#### Since

0.4.0

***

### getCanvas()?

```ts
optional getCanvas(): CanvasRenderingContext2D | null;
```

Defined in: [core/renderer/type.ts:337](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L337)

Returns the raw `CanvasRenderingContext2D` if this renderer is
canvas-backed, or `null` for non-canvas renderers (terminal, etc.).

Use this to access canvas-specific APIs (Path2D, globalAlpha, etc.)
that are not part of the `RenderContext` surface:

```ts
const raw = ctx.getCanvas?.();
if (raw) {
  raw.globalAlpha = 0.5;
  raw.fill(path);
}
```

#### Returns

`CanvasRenderingContext2D` \| `null`

#### Since

0.4.0

***

### restore()

```ts
restore(): void;
```

Defined in: [core/renderer/type.ts:97](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L97)

Restores the most recently saved transform state.

#### Returns

`void`

#### Since

0.4.0

***

### save()

```ts
save(): void;
```

Defined in: [core/renderer/type.ts:90](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L90)

Saves the current transform state onto a stack.

Use together with [RenderContext.restore](#restore) to isolate transforms.

#### Returns

`void`

#### Since

0.4.0

#### Example

```ts
ctx.save();
ctx.translate(entity.x, entity.y);
// ... draw ...
ctx.restore();
```

***

### scale()

```ts
scale(x: number, y: number): void;
```

Defined in: [core/renderer/type.ts:122](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L122)

Applies a scale factor to the current transform.

Terminal renderers ignore this call (character cells cannot scale
arbitrarily).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | Horizontal scale factor. |
| `y` | `number` | Vertical scale factor. |

#### Returns

`void`

#### Since

0.4.0

***

### strokeRect()

```ts
strokeRect(
   x: number, 
   y: number, 
   width: number, 
   height: number, 
   color: string): void;
```

Defined in: [core/renderer/type.ts:177](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L177)

Draws a stroked (outlined) rectangle.

On terminal renderers, box-drawing characters (`─`, `│`, `┌`…) are
used for the border.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | Left edge in logical units. |
| `y` | `number` | Top edge in logical units. |
| `width` | `number` | Rectangle width. |
| `height` | `number` | Rectangle height. |
| `color` | `string` | Stroke colour (CSS colour string). |

#### Returns

`void`

#### Since

0.4.0

***

### translate()

```ts
translate(x: number, y: number): void;
```

Defined in: [core/renderer/type.ts:109](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L109)

Applies a translation to the current transform.

Subsequent draw calls are offset by `(x, y)`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | Horizontal offset in logical units. |
| `y` | `number` | Vertical offset in logical units. |

#### Returns

`void`

#### Since

0.4.0
