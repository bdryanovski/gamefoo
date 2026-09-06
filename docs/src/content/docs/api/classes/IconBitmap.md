---
title: 'Class: IconBitmap'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / IconBitmap

# Class: IconBitmap

Defined in: [core/icons/icon\_bitmap.ts:36](https://github.com/bdryanovski/gamefoo/blob/main/src/core/icons/icon_bitmap.ts#L36)

Pixel-perfect bitmap icons set

## Since

0.4.0

## Example

**Rendering icon with the built-in icons\_8x8**

```ts
import { IconBitmap } from "gamefoo";

const Icon = new IconBitmap("icons_8x8");

ctx.fillStyle = "#ffffff";
Icon.renderIcon("heart", 10, 10, ctx);
```

## Extends

- `BitmapDataRenderer`

## Constructors

### Constructor

```ts
new IconBitmap(name: InternalBitmapIconName): IconBitmap;
```

Defined in: [core/icons/icon\_bitmap.ts:48](https://github.com/bdryanovski/gamefoo/blob/main/src/core/icons/icon_bitmap.ts#L48)

Creates an icon renderer for the named catalogue entry.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | [`InternalBitmapIconName`](../type-aliases/InternalBitmapIconName.md) | The catalogue key (e.g. `"icons_8x8"`). |

#### Returns

`IconBitmap`

#### Throws

Error if the name is not found in the catalogue.

#### Example

```ts
const icon = new IconBitmap("icons_8x8");
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

## Accessors

### metadata

#### Get Signature

```ts
get metadata(): BitmapCatalogEntry | null;
```

Defined in: [core/icons/icon\_bitmap.ts:57](https://github.com/bdryanovski/gamefoo/blob/main/src/core/icons/icon_bitmap.ts#L57)

Returns the raw catalogue entry for this icon set, or `null` if not found.

##### Returns

`BitmapCatalogEntry` \| `null`

Icon metadata object or `null`.

## Methods

### getIconBitmask()

```ts
getIconBitmask(icon: string): number[] | null;
```

Defined in: [core/icons/icon\_bitmap.ts:72](https://github.com/bdryanovski/gamefoo/blob/main/src/core/icons/icon_bitmap.ts#L72)

Retrieves the bitmask rows for a single icon.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `icon` | `string` | Icon name (e.g. `"heart"`). |

#### Returns

`number`[] \| `null`

An array of row bitmasks, or `null` if not found.

#### Example

```ts
const rows = icon.getIconBitmask("heart");
```

***

### getTextWidth()

```ts
getTextWidth(): number;
```

Defined in: [core/icons/icon\_bitmap.ts:79](https://github.com/bdryanovski/gamefoo/blob/main/src/core/icons/icon_bitmap.ts#L79)

Returns the width of a single icon cell.

#### Returns

`number`

***

### renderIcon()

```ts
renderIcon(
   icon: string, 
   x: number, 
   y: number, 
   ctx: RenderContext
): void;
```

Defined in: [core/icons/icon\_bitmap.ts:100](https://github.com/bdryanovski/gamefoo/blob/main/src/core/icons/icon_bitmap.ts#L100)

Renders a single icon at the given pixel position.

Each set bit in the icon's row bitmask produces a 1x1
`fillRect` call using the context's current `fillStyle`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `icon` | `string` | The icon name to draw. |
| `x` | `number` | Left edge X coordinate in canvas pixels. |
| `y` | `number` | Top edge Y coordinate in canvas pixels. |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) | The 2-D rendering context to draw into. |

#### Returns

`void`

#### Example

```ts
ctx.fillStyle = "#00ff00";
icon.renderIcon("heart", 20, 40, ctx);
```
