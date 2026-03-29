---
title: 'Class: WebRenderer'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / WebRenderer

# Class: WebRenderer

Defined in: [core/renderer/web\_renderer.ts:47](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/web_renderer.ts#L47)

Canvas-backed [RenderContext](../interfaces/RenderContext.md) implementation for browser games.

`WebRenderer` wraps a `<canvas>` DOM element and its
`CanvasRenderingContext2D`, adapting the full Canvas 2D API surface to
the minimal [RenderContext](../interfaces/RenderContext.md) interface the engine requires.

### Scaling

When `gameScale > 1` (e.g. `4` for a 200×75 pixel-art game displayed
at 800×300):

- The canvas **backing buffer** is sized to `width × gameScale` ×
  `height × gameScale` so there is a physical pixel for each logical
  pixel in the up-scaled view.
- `ctx.scale(gameScale, gameScale)` is applied once at construction so
  all subsequent draw calls use logical (`width × height`) coordinates.
- CSS is set to `width × height` so the browser displays the canvas at
  its intended logical size.
- `imageSmoothingEnabled` is disabled globally to preserve crisp
  pixel-art edges.

## Since

0.4.0

## Examples

```ts
import { Engine, WebRenderer } from "gamefoo";

const renderer = new WebRenderer("game-canvas", 800, 600);
const engine   = new Engine(renderer, { backgroundColor: "#1a1a2e" });
engine.setup();
```

```ts
// Internal resolution 200×75, displayed at 800×300
const renderer = new WebRenderer("game", 200, 75, 4);
const engine   = new Engine(renderer, { backgroundColor: "#e0e0e0" });
engine.setup();
```

## See

 - [RenderContext](../interfaces/RenderContext.md)         — the interface this class implements
 - [TerminalRenderContext](TerminalRenderContext.md) — ANSI terminal alternative

## Implements

- [`RenderContext`](../interfaces/RenderContext.md)

## Constructors

### Constructor

```ts
new WebRenderer(
   canvasId: string, 
   width: number, 
   height: number, 
   gameScale?: number): WebRenderer;
```

Defined in: [core/renderer/web\_renderer.ts:101](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/web_renderer.ts#L101)

Creates a new `WebRenderer` and configures the target canvas.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `canvasId` | `string` | `undefined` | `id` attribute of the `<canvas>` element in the DOM. |
| `width` | `number` | `undefined` | Logical width in game-world pixels. |
| `height` | `number` | `undefined` | Logical height in game-world pixels. |
| `gameScale` | `number` | `1` | Pixel scale factor. Sizes the backing buffer at `width × gameScale` × `height × gameScale` and applies `ctx.scale(gameScale, gameScale)` so all drawing uses logical coordinates. Default `1` (no scaling). |

#### Returns

`WebRenderer`

#### Throws

If no `<canvas>` element with `id === canvasId` is found,
  or if the browser cannot provide a 2-D context.

#### Since

0.4.0

#### Examples

```ts
// HTML: <canvas id="game"></canvas>
const renderer = new WebRenderer("game", 800, 600);
```

```ts
const renderer = new WebRenderer("game", 200, 75, 4);
```

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="height"></a> `height` | `readonly` | `number` | The logical height — coordinates supplied to draw calls should stay within `0..height`. **Since** 0.4.0 | [core/renderer/web\_renderer.ts:65](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/web_renderer.ts#L65) |
| <a id="width"></a> `width` | `readonly` | `number` | The logical width — coordinates supplied to draw calls should stay within `0..width`. **Since** 0.4.0 | [core/renderer/web\_renderer.ts:57](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/web_renderer.ts#L57) |
| <a id="ctx"></a> `ctx` | `private` | `CanvasRenderingContext2D` | The underlying canvas 2-D rendering context. | [core/renderer/web\_renderer.ts:49](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/web_renderer.ts#L49) |
| <a id="gamescale"></a> `gameScale` | `private` | `number` | The pixel scale factor applied to the canvas backing buffer. Stored so that `clear()` can reset the full buffer regardless of accumulated transforms. | [core/renderer/web\_renderer.ts:72](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/web_renderer.ts#L72) |

## Methods

### clear()

```ts
clear(color?: string): void;
```

Defined in: [core/renderer/web\_renderer.ts:212](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/web_renderer.ts#L212)

Clears the entire canvas and fills it with `color`.

Uses `clearRect` over the **full buffer** (accounting for `gameScale`)
to ensure no residual pixels remain from the previous frame even when
a translate transform is active.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color` | `string` | `'#000000'` | CSS colour string. Default `"#000000"`. |

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`RenderContext`](../interfaces/RenderContext.md).[`clear`](../interfaces/RenderContext.md#clear)

***

### drawChar()

```ts
drawChar(
   char: string, 
   x: number, 
   y: number, 
   color?: string): void;
```

Defined in: [core/renderer/web\_renderer.ts:303](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/web_renderer.ts#L303)

Draws a single character at `(x, y)`.

Delegates to [WebRenderer.drawText](#drawtext) with a one-character string.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `char` | `string` | `undefined` | A single character to draw. |
| `x` | `number` | `undefined` | Left edge in logical pixels. |
| `y` | `number` | `undefined` | Baseline Y in logical pixels. |
| `color` | `string` | `'#ffffff'` | Fill colour. Default `"#ffffff"`. |

#### Returns

`void`

#### Since

0.4.0

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
   fill?: boolean): void;
```

Defined in: [core/renderer/web\_renderer.ts:368](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/web_renderer.ts#L368)

Draws a circle (stroke or fill).

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `x` | `number` | `undefined` | Centre X in logical pixels. |
| `y` | `number` | `undefined` | Centre Y in logical pixels. |
| `radius` | `number` | `undefined` | Radius in logical pixels. |
| `color` | `string` | `undefined` | Stroke or fill colour. |
| `fill` | `boolean` | `false` | If `true`, fills the circle. Default `false` (stroke only). |

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

Defined in: [core/renderer/web\_renderer.ts:349](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/web_renderer.ts#L349)

Draws a straight line between two points.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x1` | `number` | Start X in logical pixels. |
| `y1` | `number` | Start Y in logical pixels. |
| `x2` | `number` | End X in logical pixels. |
| `y2` | `number` | End Y in logical pixels. |
| `color` | `string` | Stroke colour. |

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`RenderContext`](../interfaces/RenderContext.md).[`drawLine`](../interfaces/RenderContext.md#drawline)

***

### drawSprite()

```ts
drawSprite(
   source: HTMLImageElement, 
   sx: number, 
   sy: number, 
   sw: number, 
   sh: number, 
   dx: number, 
   dy: number, 
   dw: number, 
   dh: number): void;
```

Defined in: [core/renderer/web\_renderer.ts:324](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/web_renderer.ts#L324)

Draws an image region (sprite frame) onto the canvas.

Delegates directly to `CanvasRenderingContext2D.drawImage`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `source` | `HTMLImageElement` | The source `HTMLImageElement`. |
| `sx` | `number` | Source X in the sprite sheet. |
| `sy` | `number` | Source Y in the sprite sheet. |
| `sw` | `number` | Source region width. |
| `sh` | `number` | Source region height. |
| `dx` | `number` | Destination X in logical pixels. |
| `dy` | `number` | Destination Y in logical pixels. |
| `dw` | `number` | Rendered width in logical pixels. |
| `dh` | `number` | Rendered height in logical pixels. |

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
   _bgColor?: string): void;
```

Defined in: [core/renderer/web\_renderer.ts:280](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/web_renderer.ts#L280)

Draws a text string using the canvas's current font setting.

The `bgColor` parameter exists for [RenderContext](../interfaces/RenderContext.md) compatibility
but is ignored on canvas — set the background with a `fillRect` call
if needed.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `text` | `string` | `undefined` | The string to render. |
| `x` | `number` | `undefined` | Left edge in logical pixels. |
| `y` | `number` | `undefined` | Baseline Y in logical pixels. |
| `color` | `string` | `'#ffffff'` | Fill colour. Default `"#ffffff"`. |
| `_bgColor?` | `string` | `undefined` | Not used on canvas. |

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

Defined in: [core/renderer/web\_renderer.ts:244](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/web_renderer.ts#L244)

Draws a filled rectangle.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | Left edge in logical pixels. |
| `y` | `number` | Top edge in logical pixels. |
| `w` | `number` | Width in logical pixels. |
| `h` | `number` | Height in logical pixels. |
| `color` | `string` | Fill colour (CSS colour string). |

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

Defined in: [core/renderer/web\_renderer.ts:391](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/web_renderer.ts#L391)

No-op — canvas rendering is immediate-mode and requires no explicit flush.

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`RenderContext`](../interfaces/RenderContext.md).[`flush`](../interfaces/RenderContext.md#flush)

***

### getCanvas()

```ts
getCanvas(): CanvasRenderingContext2D;
```

Defined in: [core/renderer/web\_renderer.ts:416](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/web_renderer.ts#L416)

Returns the underlying `CanvasRenderingContext2D`.

Use this to access canvas-specific APIs not exposed by the
[RenderContext](../interfaces/RenderContext.md) interface (e.g. `Path2D`, `globalAlpha`,
`arc`, `fill`, `beginPath`, etc.):

```ts
const raw = ctx.getCanvas?.();
if (raw) {
  raw.globalAlpha = 0.5;
  raw.beginPath();
  raw.arc(x, y, r, 0, Math.PI * 2);
  raw.fill();
}
```

#### Returns

`CanvasRenderingContext2D`

The raw 2-D canvas rendering context.

#### Since

0.4.0

#### Implementation of

[`RenderContext`](../interfaces/RenderContext.md).[`getCanvas`](../interfaces/RenderContext.md#getcanvas)

***

### restore()

```ts
restore(): void;
```

Defined in: [core/renderer/web\_renderer.ts:165](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/web_renderer.ts#L165)

Restores the most recently saved canvas state.

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

Defined in: [core/renderer/web\_renderer.ts:156](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/web_renderer.ts#L156)

Saves the current canvas state onto the state stack.

After `save()`, transforms, clipping regions, and style properties
can be mutated and then rolled back with [WebRenderer.restore](#restore).

**Note:** `imageSmoothingEnabled` is part of the saved state, so
[WebRenderer.restore](#restore) automatically re-applies the `false`
value set at construction.

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`RenderContext`](../interfaces/RenderContext.md).[`save`](../interfaces/RenderContext.md#save)

***

### scale()

```ts
scale(x: number, y: number): void;
```

Defined in: [core/renderer/web\_renderer.ts:197](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/web_renderer.ts#L197)

Multiplies the current transform by a scale factor.

This is an **additional** scale on top of the `gameScale` already
applied at construction. Use it for camera zoom, not for the base
pixel-art scale (that is handled by the constructor).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | Horizontal scale factor. |
| `y` | `number` | Vertical scale factor. |

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

Defined in: [core/renderer/web\_renderer.ts:260](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/web_renderer.ts#L260)

Draws a stroked (outlined) rectangle.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | Left edge in logical pixels. |
| `y` | `number` | Top edge in logical pixels. |
| `w` | `number` | Width in logical pixels. |
| `h` | `number` | Height in logical pixels. |
| `color` | `string` | Stroke colour (CSS colour string). |

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

Defined in: [core/renderer/web\_renderer.ts:181](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/web_renderer.ts#L181)

Translates the canvas origin by `(x, y)` in logical coordinates.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | Horizontal offset in logical pixels. |
| `y` | `number` | Vertical offset in logical pixels. |

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`RenderContext`](../interfaces/RenderContext.md).[`translate`](../interfaces/RenderContext.md#translate)
