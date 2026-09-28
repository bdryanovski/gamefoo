---
title: 'Interface: SpriteFrame'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / SpriteFrame

# Interface: SpriteFrame

Defined in: [core/sprite.ts:51](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L51)

Describes the position and size of a single frame within a [Sprite](../classes/Sprite.md)
sheet.

## Since

0.2.0

## Example

```ts
const frame: SpriteFrame = {
 x: 32,
 y: 64,
 width: 32,
 height: 32,
 anchor: { x: 16, y: 16 },
 };
 ```

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="anchor"></a> `anchor?` | \{ `x`: `number`; `y`: `number`; \} | [core/sprite.ts:56](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L56) |
| `anchor.x` | `number` | [core/sprite.ts:56](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L56) |
| `anchor.y` | `number` | [core/sprite.ts:56](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L56) |
| <a id="height"></a> `height` | `number` | [core/sprite.ts:55](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L55) |
| <a id="width"></a> `width` | `number` | [core/sprite.ts:54](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L54) |
| <a id="x"></a> `x` | `number` | [core/sprite.ts:52](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L52) |
| <a id="y"></a> `y` | `number` | [core/sprite.ts:53](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L53) |
