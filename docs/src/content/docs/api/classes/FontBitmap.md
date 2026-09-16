---
title: 'Class: FontBitmap'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / FontBitmap

# Class: FontBitmap

Defined in: [core/fonts/font\_bitmap.ts:59](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L59)

Pixel-perfect bitmap font renderer.

`FontBitmap` looks up a named font from the built-in catalogue,
then renders individual characters or whole strings onto a
`CanvasRenderingContext2D` one pixel at a time using `fillRect`.

Each character is stored as an array of row bitmasks where each bit
represents a single pixel.

## Since

0.1.0

## Examples

**Rendering text with the built-in 5x5 font**

```ts
import { FontBitmap } from "gamefoo";

const font = new FontBitmap("5x5");

ctx.fillStyle = "#ffffff";
font.renderText("HELLO WORLD", 10, 10, ctx);
```

**Measuring text width**

```ts
const font  = new FontBitmap("5x5");
const width = font.getTextWidth("SCORE 999");
// width === 9 * 6 = 54 (each char is 5px + 1px spacing)
```

## See

FONT\_5x5 — the built-in 5x5 pixel font data

## Extends

- `BitmapDataRenderer`

## Constructors

### Constructor

```ts
new FontBitmap(name: InternalBitmapFontName): FontBitmap;
```

Defined in: [core/fonts/font\_bitmap.ts:77](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L77)

Creates a font renderer for the named catalogue entry.

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

#### Overrides

```ts
BitmapDataRenderer.constructor
```

## Properties

| Property | Modifier | Type | Default value | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="height"></a> `height` | `public` | `number` | `0` (populated from catalogue on construction) | Cell height in pixels. | `BitmapDataRenderer.height` | [core/shared/bitmap\_data\_renderer.ts:48](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shared/bitmap_data_renderer.ts#L48) |
| <a id="name"></a> `name` | `readonly` | `string` | `undefined` | The catalogue name of the loaded resource. | `BitmapDataRenderer.name` | [core/shared/bitmap\_data\_renderer.ts:26](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shared/bitmap_data_renderer.ts#L26) |
| <a id="width"></a> `width` | `public` | `number` | `0` (populated from catalogue on construction) | Cell width in pixels (including spacing). | `BitmapDataRenderer.width` | [core/shared/bitmap\_data\_renderer.ts:41](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shared/bitmap_data_renderer.ts#L41) |
| <a id="data"></a> `data` | `readonly` | `Record`\<`string`, `number`[]\> | `undefined` | Bitmask data keyed by character / icon name. Each value is an array of integers where each integer represents one row of pixels (MSB = leftmost pixel). | `BitmapDataRenderer.data` | [core/shared/bitmap\_data\_renderer.ts:34](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shared/bitmap_data_renderer.ts#L34) |
| <a id="spacing"></a> `spacing` | `protected` | `number` | `0` | Horizontal spacing between the drawable area and the full cell width, in pixels. | `BitmapDataRenderer.spacing` | [core/shared/bitmap\_data\_renderer.ts:56](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shared/bitmap_data_renderer.ts#L56) |
| <a id="glyphpaths"></a> `glyphPaths` | `private` | `Map`\<`string`, `Path2D`\> | `undefined` | Map of pre-built `Path2D` objects for each character. Keys are characters, values are their corresponding paths. | - | [core/fonts/font\_bitmap.ts:64](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L64) |

## Accessors

### metadata

#### Get Signature

```ts
get metadata(): BitmapCatalogEntry | null;
```

Defined in: [core/fonts/font\_bitmap.ts:87](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L87)

Returns the raw catalogue entry for this font, or `null` if the
font name was not found.

##### Returns

`BitmapCatalogEntry` \| `null`

Font metadata object or `null`.

## Methods

### getChar()

```ts
getChar(char: string): number[] | null;
```

Defined in: [core/fonts/font\_bitmap.ts:143](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L143)

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
```

***

### getTextWidth()

```ts
getTextWidth(text: string): number;
```

Defined in: [core/fonts/font\_bitmap.ts:158](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L158)

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

Defined in: [core/fonts/font\_bitmap.ts:120](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L120)

Pre-builds `Path2D` objects for a set of characters, storing them in the `glyphPaths`
cache.

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
   ctx: RenderContext
): void;
```

Defined in: [core/fonts/font\_bitmap.ts:176](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L176)

Renders a single character at the given pixel position.

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
   ctx: RenderContext
): void;
```

Defined in: [core/fonts/font\_bitmap.ts:213](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L213)

Renders a full text string by drawing each character sequentially.

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

Defined in: [core/fonts/font\_bitmap.ts:97](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L97)

Builds a `Path2D` object for the specified character based on its bitmap data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `char` | `string` | The character to build a path for. |

#### Returns

`Path2D` \| `null`

A `Path2D` object representing the character's shape, or `null` if not found.
