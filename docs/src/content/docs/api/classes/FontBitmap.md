---
title: 'Class: FontBitmap'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / FontBitmap

# Class: FontBitmap

Defined in: [core/fonts/font\_bitmap.ts:76](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L76)

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
new FontBitmap(name: InternalBitmapFontName): FontBitmap;
```

Defined in: [core/fonts/font\_bitmap.ts:134](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L134)

Creates a font renderer for the named catalogue entry.

If the name does not match any registered font the instance will
have empty data and zero dimensions — calls to `renderChar` /
`renderText` will be no-ops.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | [`InternalBitmapFontName`](../type-aliases/InternalBitmapFontName.md) | The catalogue key (e.g. `"5x5"`). |

#### Returns

`FontBitmap`

#### Throws

Error if the name is not found in the catalogue.

#### Example

```ts
const font = new FontBitmap("5x5");
```

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="height"></a> `height` | `public` | `number` | `0` (populated from catalogue on construction) | Character cell height in pixels. | [core/fonts/font\_bitmap.ts:100](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L100) |
| <a id="name"></a> `name` | `readonly` | `string` | `undefined` | The catalogue name of the loaded font (e.g. `"5x5"`). | [core/fonts/font\_bitmap.ts:78](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L78) |
| <a id="width"></a> `width` | `public` | `number` | `0` (populated from catalogue on construction) | Character cell width in pixels (including spacing). | [core/fonts/font\_bitmap.ts:93](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L93) |
| <a id="data"></a> `data` | `readonly` | `Record`\<`string`, `number`[]\> | `undefined` | Character bitmask data keyed by character string. Each value is an array of integers where each integer represents one row of pixels (MSB = leftmost pixel). | [core/fonts/font\_bitmap.ts:86](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L86) |
| <a id="spacing"></a> `spacing` | `protected` | `number` | `0` | Horizontal spacing between the drawable area and the full cell width, in pixels. | [core/fonts/font\_bitmap.ts:108](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L108) |
| <a id="glyphpaths"></a> `glyphPaths` | `private` | `Map`\<`string`, `Path2D`\> | `undefined` | Map of pre-built `Path2D` objects for each character. Keys are characters, values are their corresponding paths. This cache is used to store pre-built paths for characters that have been rendered at least once, allowing for faster rendering on subsequent calls. | [core/fonts/font\_bitmap.ts:116](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L116) |

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

Defined in: [core/fonts/font\_bitmap.ts:156](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L156)

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

Defined in: [core/fonts/font\_bitmap.ts:221](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L221)

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

Defined in: [core/fonts/font\_bitmap.ts:236](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L236)

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

### prebuildGlyphs()

```ts
prebuildGlyphs(chars?: string[]): void;
```

Defined in: [core/fonts/font\_bitmap.ts:197](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L197)

Pre-builds `Path2D` objects for a set of characters, storing them in the `glyphPaths`
cache. This method can be called with a list of characters that are expected to
be rendered frequently,

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `chars` | `string`[] | `[]` |

#### Returns

`void`

***

### renderChar()

```ts
renderChar(
   char: string, 
   x: number, 
   y: number, 
   ctx: RenderContext): void;
```

Defined in: [core/fonts/font\_bitmap.ts:257](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L257)

Renders a single character at the given pixel position.

Each set bit in the character's row bitmask produces a 1x1
`fillRect` call using the context's current `fillStyle`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `char` | `string` | The character to draw. |
| `x` | `number` | Left edge X coordinate in canvas pixels. |
| `y` | `number` | Top edge Y coordinate in canvas pixels. |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) | The 2-D rendering context to draw into. |

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
   ctx: RenderContext): void;
```

Defined in: [core/fonts/font\_bitmap.ts:296](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L296)

Renders a full text string by drawing each character sequentially.

Characters are spaced according to the font's cell width.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `text` | `string` | The string to render. |
| `x` | `number` | Left edge X coordinate of the first character. |
| `y` | `number` | Top edge Y coordinate. |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) | The 2-D rendering context. |

#### Returns

`void`

#### Example

```ts
ctx.fillStyle = "#ffffff";
font.renderText("GAME OVER", 100, 50, ctx);
```

***

### buildGlyphPath()

```ts
private buildGlyphPath(char: string): Path2D | null;
```

Defined in: [core/fonts/font\_bitmap.ts:175](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L175)

Builds a `Path2D` object for the specified character based on its bitmap data.
This method reads the character's bitmap data and constructs a path that
represents the filled pixels of the character.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `char` | `string` | The character to build a path for. |

#### Returns

`Path2D` \| `null`

A `Path2D` object representing the character's shape, or `null` if the character is not found in the font data.

#### Remarks

This method is called internally when a character is rendered for the first time
or when pre-building glyphs. It converts the bitmap representation of the character
into a vector path that can be efficiently rendered using `CanvasRenderingContext2D`.
The resulting `Path2D` object is cached in the `glyphPaths` map for future use, reducing the overhead of path construction on subsequent renders.
