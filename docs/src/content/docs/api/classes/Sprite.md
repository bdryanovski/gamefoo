---
title: 'Class: Sprite'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Sprite

# Class: Sprite

Defined in: [core/sprite.ts:129](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L129)

Metadata wrapper around an HTMLImageElement that describes how
it is sliced into a uniform grid of frames and what named animations
are available.

`Sprite` does **not** handle rendering itself — use
[SpriteRender](SpriteRender.md) to play animations on an entity.

## Since

0.1.0

## Examples

**Loading and creating a sprite**

```ts
import { Asset } from "gamefoo";

const image = await Asset.load("hero.png");
const sprite = new Sprite(image, 32, 32, {
  idle: { frames: [0, 1], duration: 0.25, loop: true },
  run:  { frames: [2, 3, 4, 5], duration: 0.1, loop: true },
});
```

**Querying frame coordinates**

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
   animations?: Record<string, AnimationDefinition>
): Sprite;
```

Defined in: [core/sprite.ts:187](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L187)

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
| <a id="animations"></a> `animations` | `public` | `Map`\<`string`, `AnimationDefinition`\> | Named animation definitions keyed by animation name. Populated from the optional `animations` parameter passed to the constructor. | [core/sprite.ts:163](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L163) |
| <a id="columns"></a> `columns` | `readonly` | `number` | Number of frame columns in the spritesheet, computed as `Math.floor(image.width / width)`. | [core/sprite.ts:149](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L149) |
| <a id="frames"></a> `frames` | `public` | `Map`\<`string` \| `number`, [`SpriteFrame`](../interfaces/SpriteFrame.md)\> | **Since** 0.2.0 | [core/sprite.ts:168](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L168) |
| <a id="height"></a> `height` | `readonly` | `number` | Height of a single frame cell in pixels. | [core/sprite.ts:143](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L143) |
| <a id="image"></a> `image` | `public` | `HTMLImageElement` | The underlying image element containing the full spritesheet. | [core/sprite.ts:133](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L133) |
| <a id="rows"></a> `rows` | `readonly` | `number` | Number of frame rows in the spritesheet, computed as `Math.floor(image.height / height)`. | [core/sprite.ts:155](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L155) |
| <a id="width"></a> `width` | `readonly` | `number` | Width of a single frame cell in pixels. | [core/sprite.ts:138](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L138) |

## Methods

### fromAseprite()

```ts
static fromAseprite(imagePath: string, jsonPath: string): Promise<Sprite>;
```

Defined in: [core/sprite.ts:308](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L308)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `imagePath` | `string` |
| `jsonPath` | `string` |

#### Returns

`Promise`\<`Sprite`\>

***

### fromAtlas()

```ts
static fromAtlas(
   image: HTMLImageElement, 
   regions: Record<string, SpriteFrame>, 
   animations?: Record<string, AnimationDefinition>
): Sprite;
```

Defined in: [core/sprite.ts:296](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L296)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `image` | `HTMLImageElement` |
| `regions` | `Record`\<`string`, [`SpriteFrame`](../interfaces/SpriteFrame.md)\> |
| `animations?` | `Record`\<`string`, `AnimationDefinition`\> |

#### Returns

`Sprite`

***

### fromGrid()

```ts
static fromGrid(
   image: HTMLImageElement, 
   config: GridConfig, 
   animations?: Record<string, AnimationDefinition>
): Sprite;
```

Defined in: [core/sprite.ts:237](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L237)

Alternative constructor for spritesheets that are already sliced into a
uniform grid of frames.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `image` | `HTMLImageElement` | A fully-loaded `HTMLImageElement` containing the spritesheet texture. |
| `config` | `GridConfig` | Configuration options for slicing the image into a grid of frames. |
| `animations?` | `Record`\<`string`, `AnimationDefinition`\> | Optional map of named animation definitions. Keys are animation names (e.g. `"idle"`, `"run"`). |

#### Returns

`Sprite`

#### Since

0.2.0

#### Example

```ts
 const sprite = Sprite.fromGrid(img, {
 frameWidth: 64,

 frameHeight: 64,
 offsetX: 0,
 offsetY: 0,
 spacingX: 0,
 spacingY: 0,
 count: 16,
 }, {
 idle: { frames: [0, 1], duration: 0.25, loop: true },
 run:  { frames: [2, 3, 4, 5], duration: 0.1, loop: true },
 });
 ```

***

### generateGridFrames()

```ts
private static generateGridFrames(image: HTMLImageElement, config: GridConfig): Map<number, SpriteFrame>;
```

Defined in: [core/sprite.ts:265](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L265)

Helper method to compute frame rectangles for a spritesheet sliced into a
uniform grid.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `image` | `HTMLImageElement` | A fully-loaded `HTMLImageElement` containing the spritesheet texture. |
| `config` | `GridConfig` | Configuration options for slicing the image into a grid of frames. |

#### Returns

`Map`\<`number`, [`SpriteFrame`](../interfaces/SpriteFrame.md)\>

A map of frame indices to their corresponding source rectangles.
 Frame indices are zero-based and laid out left-to-right, top-to-bottom.
 The source rectangles are in pixel coordinates relative to the top-left corner
 of the source image.

#### Since

0.2.0

***

### getFrameRect()

```ts
getFrameRect(frame: string | number): SpriteFrame;
```

Defined in: [core/sprite.ts:356](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L356)

Computes the source rectangle for a given frame index within the
spritesheet.

Frame indices are zero-based and laid out left-to-right,
top-to-bottom.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `frame` | `string` \| `number` | Zero-based frame index. |

#### Returns

[`SpriteFrame`](../interfaces/SpriteFrame.md)

An `{ x, y, width, height }` rectangle in pixel coordinates
  relative to the top-left corner of the source image.

#### Example

```ts
// For a 4-column sheet, frame 5 → col 1, row 1
const rect = sprite.getFrameRect(5);
```
