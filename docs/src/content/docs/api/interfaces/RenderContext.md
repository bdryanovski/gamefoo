---
title: 'Interface: RenderContext'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / RenderContext

# Interface: RenderContext

Defined in: [core/renderer/type.ts:46](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L46)

The unified rendering surface interface used throughout the engine.

Every place that previously accepted `CanvasRenderingContext2D` now
accepts `RenderContext`. This decouples game logic from the specific
rendering backend so the same entities and subsystems can run under:

- **[WebRenderer](../classes/WebRenderer.md)** — wraps the browser's `CanvasRenderingContext2D`.

---

### Coordinate space

- **Canvas mode**: logical units are CSS pixels (floating-point).

### Optional methods

`drawSprite` and `flush` are optional because:
- Canvas renderers are immediate-mode and do not need flushing.

## Since

0.4.0

## Example

**Implementing a custom renderer**

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

[WebRenderer](../classes/WebRenderer.md)          — canvas implementation

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="gamescale"></a> `gameScale` | `readonly` | `number` | Rendered scalling factor **Since** 0.5.0 | [core/renderer/type.ts:70](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L70) |
| <a id="height"></a> `height` | `readonly` | `number` | Logical height of the rendering surface. - Canvas: pixel height of the `<canvas>` element. **Since** 0.4.0 | [core/renderer/type.ts:63](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L63) |
| <a id="width"></a> `width` | `readonly` | `number` | Logical width of the rendering surface. - Canvas: pixel width of the `<canvas>` element. **Since** 0.4.0 | [core/renderer/type.ts:54](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L54) |

## Methods

### clear()

```ts
clear(color?: string): void;
```

Defined in: [core/renderer/type.ts:142](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L142)

Clears the entire surface, optionally filling it with a background
colour.

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
   color?: string
): void;
```

Defined in: [core/renderer/type.ts:239](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L239)

Draws a single character at the specified position.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `character` | `string` | A single character. |
| `x` | `number` | Left edge in logical units. |
| `y` | `number` | Top edge in logical units. |
| `color?` | `string` | Foreground colour. Defaults to white. |

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
   fill?: boolean
): void;
```

Defined in: [core/renderer/type.ts:292](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L292)

Draws a circle outline (or filled circle).

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
   color: string
): void;
```

Defined in: [core/renderer/type.ts:279](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L279)

Draws a straight line between two points.

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
   sourceHeight: number, 
   destinationX: number, 
   destinationY: number, 
   destinationWidth: number, 
   destinationHeight: number
): void;
```

Defined in: [core/renderer/type.ts:256](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L256)

Draws a sprite (image region) onto the surface. **Optional.**

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `source` | `string` \| `HTMLImageElement` \| `null` | The source image or `null`. |
| `sourceX` | `number` | X offset inside the source image. |
| `sourceY` | `number` | Y offset inside the source image. |
| `sourceWidth` | `number` | Width of the source region. |
| `sourceHeight` | `number` | Height of the source region. |
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
   color?: string
): void;
```

Defined in: [core/renderer/type.ts:222](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L222)

Draws a text string at the specified position.

- **Canvas**: delegates to `CanvasRenderingContext2D.fillText`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `text` | `string` | The string to render. |
| `x` | `number` | Left edge in logical units. |
| `y` | `number` | Top edge (baseline) in logical units. |
| `color?` | `string` | Foreground colour. Defaults to white. |

#### Returns

`void`

#### Since

0.4.0

#### Example

```ts
ctx.drawText("SCORE: 100", 8, 8, "#ffff00");
```

***

### fill()

```ts
fill(path?: Path2D): void;
```

Defined in: [core/renderer/type.ts:177](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L177)

Fills the current path or a provided Path2D.

Mirrors the Canvas 2D `fill()` API.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path?` | `Path2D` | Optional Path2D to fill. If omitted, fills the current path. |

#### Returns

`void`

#### Since

0.5.0

#### Examples

**Fill current path**

```ts
ctx.beginPath();
ctx.moveTo(10, 10);
ctx.lineTo(50, 50);
ctx.lineTo(10, 50);
ctx.closePath();
ctx.fill();
```

**Fill a Path2D**

```ts
const path = new Path2D();
path.rect(10, 10, 50, 50);
ctx.fill(path);
```

**Fill a Bitmap (call render() to get Path2D)**

```ts
const bitmap = new Bitmap('icon', [0b11111, 0b10001, 0b11111], { width: 5, height: 3 });
ctx.translate(100, 100);
ctx.fill(bitmap.render());
```

***

### fillRect()

```ts
fillRect(
   x: number, 
   y: number, 
   width: number, 
   height: number, 
   color: string
): void;
```

Defined in: [core/renderer/type.ts:190](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L190)

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

### getCanvas()?

```ts
optional getCanvas(): CanvasRenderingContext2D | null;
```

Defined in: [core/renderer/type.ts:311](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L311)

Returns the raw `CanvasRenderingContext2D` if this renderer is
canvas-backed, or `null` for non-canvas renderers.

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

### readGameScale()

```ts
readGameScale(): number;
```

Defined in: [core/renderer/type.ts:77](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L77)

Read the rendering scale factor

#### Returns

`number`

#### Since

0.5.0

***

### restore()

```ts
restore(): void;
```

Defined in: [core/renderer/type.ts:103](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L103)

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

Defined in: [core/renderer/type.ts:96](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L96)

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

Defined in: [core/renderer/type.ts:125](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L125)

Applies a scale factor to the current transform.

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
   color: string
): void;
```

Defined in: [core/renderer/type.ts:203](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L203)

Draws a stroked (outlined) rectangle.

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

Defined in: [core/renderer/type.ts:115](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L115)

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
