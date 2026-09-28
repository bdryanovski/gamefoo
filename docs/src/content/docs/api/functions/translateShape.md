---
title: 'Function: translateShape()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / translateShape

# Function: translateShape()

```ts
function translateShape(
   shape: CollisionShape, 
   dx: number, 
   dy: number
): CollisionShape;
```

Defined in: [core/map/collision\_map.ts:42](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L42)

Returns a copy of `shape` translated by `(dx, dy)` into world space.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `shape` | [`CollisionShape`](../type-aliases/CollisionShape.md) |
| `dx` | `number` |
| `dy` | `number` |

## Returns

[`CollisionShape`](../type-aliases/CollisionShape.md)
