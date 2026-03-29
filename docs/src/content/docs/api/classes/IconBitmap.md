---
title: 'Class: IconBitmap'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / IconBitmap

# Class: IconBitmap

Defined in: [core/icons/icon\_bitmap.ts:49](https://github.com/bdryanovski/gamefoo/blob/main/src/core/icons/icon_bitmap.ts#L49)

Pixel-perfect bitmap icons set

## Since

0.4.0

## Example

```ts
import { IconBitmap } from "gamefoo";

const Icon = new IconBitmap("icons_8x8");

ctx.fillStyle = "#ffffff";
Icon.renderIcon("heart", 10, 10, ctx);
```

## Constructors

### Constructor

```ts
new IconBitmap(name: InternalBitmapIconName): IconBitmap;
```

Defined in: [core/icons/icon\_bitmap.ts:99](https://github.com/bdryanovski/gamefoo/blob/main/src/core/icons/icon_bitmap.ts#L99)

Creates a font renderer for the named catalogue entry.

If the name does not match any registered font the instance will
have empty data and zero dimensions — calls to `renderChar` /
`renderText` will be no-ops.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | [`InternalBitmapIconName`](../type-aliases/InternalBitmapIconName.md) | The catalogue key (e.g. `"icon_8x8"`). |

#### Returns

`IconBitmap`

#### Throws

Error if the name is not icon set in the catalogue.

#### Example

```ts
const icon = new IconBitmap("icon_8x8");
```

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="height"></a> `height` | `public` | `number` | `0` (populated from catalogue on construction) | Character cell height in pixels. | [core/icons/icon\_bitmap.ts:73](https://github.com/bdryanovski/gamefoo/blob/main/src/core/icons/icon_bitmap.ts#L73) |
| <a id="name"></a> `name` | `readonly` | `string` | `undefined` | The catalogue icon name. | [core/icons/icon\_bitmap.ts:51](https://github.com/bdryanovski/gamefoo/blob/main/src/core/icons/icon_bitmap.ts#L51) |
| <a id="width"></a> `width` | `public` | `number` | `0` (populated from catalogue on construction) | Character cell width in pixels (including spacing). | [core/icons/icon\_bitmap.ts:66](https://github.com/bdryanovski/gamefoo/blob/main/src/core/icons/icon_bitmap.ts#L66) |
| <a id="data"></a> `data` | `readonly` | `Record`\<`string`, `number`[]\> | `undefined` | Character bitmask data keyed by character string. Each value is an array of integers where each integer represents one row of pixels (MSB = leftmost pixel). | [core/icons/icon\_bitmap.ts:59](https://github.com/bdryanovski/gamefoo/blob/main/src/core/icons/icon_bitmap.ts#L59) |
| <a id="spacing"></a> `spacing` | `protected` | `number` | `0` | Horizontal spacing between the drawable area and the full cell width, in pixels. | [core/icons/icon\_bitmap.ts:81](https://github.com/bdryanovski/gamefoo/blob/main/src/core/icons/icon_bitmap.ts#L81) |

## Accessors

### metadata

#### Get Signature

```ts
get metadata(): 
  | {
  data: Record<string, number[]>;
  height: number;
  keys: string[];
  name: string;
  spacing: number;
  width: number;
}
  | null;
```

Defined in: [core/icons/icon\_bitmap.ts:120](https://github.com/bdryanovski/gamefoo/blob/main/src/core/icons/icon_bitmap.ts#L120)

Returns the raw catalogue entry for this icon set, or `null` if the icons are not found

##### Returns

  \| \{
  `data`: `Record`\<`string`, `number`[]\>;
  `height`: `number`;
  `keys`: `string`[];
  `name`: `string`;
  `spacing`: `number`;
  `width`: `number`;
\}
  \| `null`

Icon metadata object or `null`.

## Methods

### getIconBitmask()

```ts
getIconBitmask(icon: string): number[] | null;
```

Defined in: [core/icons/icon\_bitmap.ts:136](https://github.com/bdryanovski/gamefoo/blob/main/src/core/icons/icon_bitmap.ts#L136)

Retrieves the bitmask rows for a single character.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `icon` | `string` |

#### Returns

`number`[] \| `null`

An array of row bitmasks, or `null` if the character is
  not defined in this icon.

#### Example

```ts
const rows = font.getIcon("heart");
```

***

### getTextWidth()

```ts
getTextWidth(): number;
```

Defined in: [core/icons/icon\_bitmap.ts:151](https://github.com/bdryanovski/gamefoo/blob/main/src/core/icons/icon_bitmap.ts#L151)

Computes the pixel width required to render the given text string.

#### Returns

`number`

Width in pixels (`text.length * cellWidth`).

#### Example

```ts
const w = font.getTextWidth("heart");
```

***

### renderIcon()

```ts
renderIcon(
   icon: string, 
   x: number, 
   y: number, 
   ctx: RenderContext): void;
```

Defined in: [core/icons/icon\_bitmap.ts:172](https://github.com/bdryanovski/gamefoo/blob/main/src/core/icons/icon_bitmap.ts#L172)

Renders a single icon at the given pixel position.

Each set bit in the character's row bitmask produces a 1x1
`fillRect` call using the context's current `fillStyle`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `icon` | `string` | The character to draw. |
| `x` | `number` | Left edge X coordinate in canvas pixels. |
| `y` | `number` | Top edge Y coordinate in canvas pixels. |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) | The 2-D rendering context to draw into. |

#### Returns

`void`

#### Example

```ts
ctx.fillStyle = "#00ff00";
font.renderChar("heart", 20, 40, ctx);
```
