---
title: 'Function: drawFrame()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / drawFrame

# Function: drawFrame()

```ts
function drawFrame(
   ctx: RenderContext, 
   frame: Frame, 
   dx: number, 
   dy: number, 
   t?: Transform
): void;
```

Defined in: [core/map/draw.ts:15](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/draw.ts#L15)

Blits a resolved [Frame](../interfaces/Frame.md) at `(dx, dy)` applying optional
flip/rotation from a [Transform](../interfaces/Transform.md).

The fast path (no transform) is a single `drawSprite`. Flips use
`scale(±1)`; rotation requires the canvas-backed context and is skipped
on renderers that cannot rotate .

## Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) |
| `frame` | [`Frame`](../interfaces/Frame.md) |
| `dx` | `number` |
| `dy` | `number` |
| `t?` | [`Transform`](../interfaces/Transform.md) |

## Returns

`void`

## Since

0.5.0
