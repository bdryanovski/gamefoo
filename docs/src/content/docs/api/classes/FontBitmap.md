---
title: 'Class: FontBitmap'
---

[**@dryanovski/gamefoo v0.0.1**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / FontBitmap

# Class: FontBitmap

Defined in: [core/fonts/font\_bitmap.ts:17](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L17)

## Constructors

### Constructor

```ts
new FontBitmap(name: string): FontBitmap;
```

Defined in: [core/fonts/font\_bitmap.ts:26](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L26)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

`FontBitmap`

## Properties

| Property | Modifier | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="name"></a> `name` | `readonly` | `string` | `undefined` | [core/fonts/font\_bitmap.ts:18](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L18) |
| <a id="data"></a> `data` | `private` | `Record`\<`string`, `number`[]\> | `undefined` | [core/fonts/font\_bitmap.ts:20](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L20) |
| <a id="height"></a> `height` | `private` | `number` | `0` | [core/fonts/font\_bitmap.ts:23](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L23) |
| <a id="spacing"></a> `spacing` | `private` | `number` | `0` | [core/fonts/font\_bitmap.ts:24](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L24) |
| <a id="width"></a> `width` | `private` | `number` | `0` | [core/fonts/font\_bitmap.ts:22](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L22) |

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

Defined in: [core/fonts/font\_bitmap.ts:40](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L40)

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

## Methods

### getChar()

```ts
getChar(char: string): number[] | null;
```

Defined in: [core/fonts/font\_bitmap.ts:44](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L44)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `char` | `string` |

#### Returns

`number`[] \| `null`

***

### getTextWidth()

```ts
getTextWidth(text: string): number;
```

Defined in: [core/fonts/font\_bitmap.ts:48](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L48)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |

#### Returns

`number`

***

### renderChar()

```ts
renderChar(
   char: string, 
   x: number, 
   y: number, 
   ctx: CanvasRenderingContext2D): void;
```

Defined in: [core/fonts/font\_bitmap.ts:52](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L52)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `char` | `string` |
| `x` | `number` |
| `y` | `number` |
| `ctx` | `CanvasRenderingContext2D` |

#### Returns

`void`

***

### renderText()

```ts
renderText(
   text: string, 
   x: number, 
   y: number, 
   ctx: CanvasRenderingContext2D): void;
```

Defined in: [core/fonts/font\_bitmap.ts:67](https://github.com/bdryanovski/gamefoo/blob/main/src/core/fonts/font_bitmap.ts#L67)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |
| `x` | `number` |
| `y` | `number` |
| `ctx` | `CanvasRenderingContext2D` |

#### Returns

`void`
