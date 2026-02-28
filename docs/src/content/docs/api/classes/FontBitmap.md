---
title: 'Class: FontBitmap'
---

[**@dryanovski/gamefoo v0.0.1**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / FontBitmap

# Class: FontBitmap

Defined in: [core/fonts/font\_bitmap.ts:57](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L57)

Pixel-perfect bitmap font renderer.

`FontBitmap` looks up a named font from the built-in catalogue,
then renders individual characters or whole strings onto a
`CanvasRenderingContext2D` one pixel at a time using `fillRect`.

Each character is stored as an array of row bitmasks where each bit
represents a single pixel.

## Since

0.1.0

## Examples

```ts
import { FontBitmap } from "gamefoo";

const font = new FontBitmap("5x5");

ctx.fillStyle = "#ffffff";
font.renderText("HELLO WORLD", 10, 10, ctx);
```

```ts
const font  = new FontBitmap("5x5");
const width = font.getTextWidth("SCORE 999");
// width === 9 * 6 = 54 (each char is 5px + 1px spacing)
```

## See

FONT\_5x5 — the built-in 5x5 pixel font data

## Constructors

### Constructor

```ts
new FontBitmap(name: string): FontBitmap;
```

Defined in: [core/fonts/font\_bitmap.ts:105](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L105)

Creates a font renderer for the named catalogue entry.

If the name does not match any registered font the instance will
have empty data and zero dimensions — calls to `renderChar` /
`renderText` will be no-ops.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | The catalogue key (e.g. `"5x5"`). |

#### Returns

`FontBitmap`

#### Example

```ts
const font = new FontBitmap("5x5");
```

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="name"></a> `name` | `readonly` | `string` | `undefined` | The catalogue name of the loaded font (e.g. `"5x5"`). | [core/fonts/font\_bitmap.ts:59](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L59) |
| <a id="data"></a> `data` | `private` | `Record`\<`string`, `number`[]\> | `undefined` | Character bitmask data keyed by character string. Each value is an array of integers where each integer represents one row of pixels (MSB = leftmost pixel). | [core/fonts/font\_bitmap.ts:67](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L67) |
| <a id="height"></a> `height` | `private` | `number` | `0` (populated from catalogue on construction) | Character cell height in pixels. | [core/fonts/font\_bitmap.ts:81](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L81) |
| <a id="spacing"></a> `spacing` | `private` | `number` | `0` | Horizontal spacing between the drawable area and the full cell width, in pixels. | [core/fonts/font\_bitmap.ts:89](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L89) |
| <a id="width"></a> `width` | `private` | `number` | `0` (populated from catalogue on construction) | Character cell width in pixels (including spacing). | [core/fonts/font\_bitmap.ts:74](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L74) |

## Accessors

### metadata

#### Get Signature

```ts
get metadata(): 
  | {
  chars: string;
  data: Record<string, number[]>;
  height: number;
  name: string;
  spacing: number;
  width: number;
}
  | null;
```

Defined in: [core/fonts/font\_bitmap.ts:125](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L125)

Returns the raw catalogue entry for this font, or `null` if the
font name was not found.

##### Returns

  \| \{
  `chars`: `string`;
  `data`: `Record`\<`string`, `number`[]\>;
  `height`: `number`;
  `name`: `string`;
  `spacing`: `number`;
  `width`: `number`;
\}
  \| `null`

Font metadata object or `null`.

## Methods

### getChar()

```ts
getChar(char: string): number[] | null;
```

Defined in: [core/fonts/font\_bitmap.ts:142](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L142)

Retrieves the bitmask rows for a single character.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `char` | `string` | A single character string (e.g. `"A"`). |

#### Returns

`number`[] \| `null`

An array of row bitmasks, or `null` if the character is
  not defined in this font.

#### Example

```ts
const rows = font.getChar("A");
// rows → [14, 17, 31, 17, 17] for the 5x5 font
```

***

### getTextWidth()

```ts
getTextWidth(text: string): number;
```

Defined in: [core/fonts/font\_bitmap.ts:157](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L157)

Computes the pixel width required to render the given text string.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `text` | `string` | The string to measure. |

#### Returns

`number`

Width in pixels (`text.length * cellWidth`).

#### Example

```ts
const w = font.getTextWidth("HI"); // 12 for the 5x5 font
```

***

### renderChar()

```ts
renderChar(
   char: string, 
   x: number, 
   y: number, 
   ctx: CanvasRenderingContext2D): void;
```

Defined in: [core/fonts/font\_bitmap.ts:178](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L178)

Renders a single character at the given pixel position.

Each set bit in the character's row bitmask produces a 1x1
`fillRect` call using the context's current `fillStyle`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `char` | `string` | The character to draw. |
| `x` | `number` | Left edge X coordinate in canvas pixels. |
| `y` | `number` | Top edge Y coordinate in canvas pixels. |
| `ctx` | `CanvasRenderingContext2D` | The 2-D rendering context to draw into. |

#### Returns

`void`

#### Example

```ts
ctx.fillStyle = "#00ff00";
font.renderChar("G", 20, 40, ctx);
```

***

### renderText()

```ts
renderText(
   text: string, 
   x: number, 
   y: number, 
   ctx: CanvasRenderingContext2D): void;
```

Defined in: [core/fonts/font\_bitmap.ts:209](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L209)

Renders a full text string by drawing each character sequentially.

Characters are spaced according to the font's cell width.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `text` | `string` | The string to render. |
| `x` | `number` | Left edge X coordinate of the first character. |
| `y` | `number` | Top edge Y coordinate. |
| `ctx` | `CanvasRenderingContext2D` | The 2-D rendering context. |

#### Returns

`void`

#### Example

```ts
ctx.fillStyle = "#ffffff";
font.renderText("GAME OVER", 100, 50, ctx);
```
