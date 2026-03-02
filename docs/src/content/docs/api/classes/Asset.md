---
title: 'Class: Asset'
---

[**@dryanovski/gamefoo v0.0.1**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Asset

# Class: Asset

Defined in: [core/asset.ts:28](https://github.com/bdryanovski/gamefoo/blob/main/src/core/asset.ts#L28)

Static image asset loader with an in-memory cache.

`Asset` wraps the native `Image` constructor with a `Promise`-based
API and caches loaded images by URL so repeated requests for the same
source resolve instantly.

## Since

0.1.0

## Examples

```ts
const image = await Asset.load("sprites/hero.png");
ctx.drawImage(image, 0, 0);
```

```ts
await Promise.all([
  Asset.load("sprites/hero.png"),
  Asset.load("sprites/enemy.png"),
  Asset.load("tiles/grass.png"),
]);
```

## See

[Sprite](Sprite.md) — consumes loaded images for spritesheet slicing

## Constructors

### Constructor

```ts
new Asset(): Asset;
```

#### Returns

`Asset`

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="cache"></a> `cache` | `private` | `Map`\<`string`, `HTMLImageElement`\> | Internal cache mapping source URLs to their loaded `HTMLImageElement` instances. | [core/asset.ts:33](https://github.com/bdryanovski/gamefoo/blob/main/src/core/asset.ts#L33) |

## Methods

### load()

```ts
static load(src: string): Promise<HTMLImageElement>;
```

Defined in: [core/asset.ts:58](https://github.com/bdryanovski/gamefoo/blob/main/src/core/asset.ts#L58)

Loads an image from the given URL.

If the image has been loaded before, the cached `HTMLImageElement`
is returned immediately (the `Promise` resolves synchronously on
the microtask queue).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `src` | `string` | URL or relative path of the image to load. |

#### Returns

`Promise`\<`HTMLImageElement`\>

A `Promise` that resolves with the loaded
  `HTMLImageElement`.

#### Throws

If the image fails to load (e.g. 404 or network
  error). The error message includes the failing `src`.

#### Example

```ts
try {
  const img = await Asset.load("missing.png");
} catch (err) {
  console.error(err); // "Failed to load image: missing.png"
}
```
