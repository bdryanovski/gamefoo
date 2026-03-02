---
title: 'Class: Sprite'
---

[**@dryanovski/gamefoo v0.0.1**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Sprite

# Class: Sprite

Defined in: [core/sprite.ts:60](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L60)

Metadata wrapper around an HTMLImageElement that describes how
it is sliced into a uniform grid of frames and what named animations
are available.

`Sprite` does **not** handle rendering itself — use
[SpriteRender](SpriteRender.md) to play animations on an entity.

## Since

0.1.0

## Examples

```ts
import { Asset } from "gamefoo";

const image = await Asset.load("hero.png");
const sprite = new Sprite(image, 32, 32, {
  idle: { frames: [0, 1], duration: 0.25, loop: true },
  run:  { frames: [2, 3, 4, 5], duration: 0.1, loop: true },
});
```

```ts
const rect = sprite.getFrameRect(5);
ctx.drawImage(
  sprite.image,
  rect.x, rect.y, rect.width, rect.height,
  destX, destY, rect.width, rect.height,
);
```

## See

 - [SpriteRender](SpriteRender.md) — behaviour that plays sprite animations
 - [Asset](Asset.md)        — image loading utility

## Constructors

### Constructor

```ts
new Sprite(
   image: HTMLImageElement, 
   width: number, 
   height: number, 
   animations?: Record<string, AnimationDefinition>): Sprite;
```

Defined in: [core/sprite.ts:107](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L107)

Creates a new spritesheet descriptor.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `image` | `HTMLImageElement` | A fully-loaded `HTMLImageElement` containing the spritesheet texture. |
| `width` | `number` | Width of each individual frame in pixels. |
| `height` | `number` | Height of each individual frame in pixels. |
| `animations?` | `Record`\<`string`, `AnimationDefinition`\> | Optional map of named animation definitions. Keys are animation names (e.g. `"idle"`, `"run"`). |

#### Returns

`Sprite`

#### Example

```ts
const sprite = new Sprite(img, 64, 64, {
  idle: { frames: [0], duration: 1, loop: false },
});
```

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="animations"></a> `animations` | `readonly` | `Map`\<`string`, `AnimationDefinition`\> | Named animation definitions keyed by animation name. Populated from the optional `animations` parameter passed to the constructor. | [core/sprite.ts:88](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L88) |
| <a id="columns"></a> `columns` | `readonly` | `number` | Number of frame columns in the spritesheet, computed as `Math.floor(image.width / width)`. | [core/sprite.ts:74](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L74) |
| <a id="height"></a> `height` | `readonly` | `number` | Height of a single frame cell in pixels. | [core/sprite.ts:68](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L68) |
| <a id="image"></a> `image` | `readonly` | `HTMLImageElement` | The underlying image element containing the full spritesheet. | [core/sprite.ts:62](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L62) |
| <a id="rows"></a> `rows` | `readonly` | `number` | Number of frame rows in the spritesheet, computed as `Math.floor(image.height / height)`. | [core/sprite.ts:80](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L80) |
| <a id="width"></a> `width` | `readonly` | `number` | Width of a single frame cell in pixels. | [core/sprite.ts:65](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L65) |

## Methods

### getFrameRect()

```ts
getFrameRect(frame: number): {
  height: number;
  width: number;
  x: number;
  y: number;
};
```

Defined in: [core/sprite.ts:138](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L138)

Computes the source rectangle for a given frame index within the
spritesheet.

Frame indices are zero-based and laid out left-to-right,
top-to-bottom.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `frame` | `number` | Zero-based frame index. |

#### Returns

```ts
{
  height: number;
  width: number;
  x: number;
  y: number;
}
```

An `{ x, y, width, height }` rectangle in pixel coordinates
  relative to the top-left corner of the source image.

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [core/sprite.ts:142](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L142) |
| `width` | `number` | [core/sprite.ts:141](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L141) |
| `x` | `number` | [core/sprite.ts:139](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L139) |
| `y` | `number` | [core/sprite.ts:140](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L140) |

#### Example

```ts
// For a 4-column sheet, frame 5 → col 1, row 1
const rect = sprite.getFrameRect(5);
```
