---
title: 'Interface: SpriteFrame'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / SpriteFrame

# Interface: SpriteFrame

Defined in: [core/sprite.ts:45](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L45)

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
| <a id="anchor"></a> `anchor?` | \{ `x`: `number`; `y`: `number`; \} | [core/sprite.ts:50](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L50) |
| `anchor.x` | `number` | [core/sprite.ts:50](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L50) |
| `anchor.y` | `number` | [core/sprite.ts:50](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L50) |
| <a id="height"></a> `height` | `number` | [core/sprite.ts:49](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L49) |
| <a id="width"></a> `width` | `number` | [core/sprite.ts:48](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L48) |
| <a id="x"></a> `x` | `number` | [core/sprite.ts:46](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L46) |
| <a id="y"></a> `y` | `number` | [core/sprite.ts:47](https://github.com/bdryanovski/gamefoo/blob/main/src/core/sprite.ts#L47) |
