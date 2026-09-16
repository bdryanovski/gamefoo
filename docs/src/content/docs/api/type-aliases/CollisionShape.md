---
title: 'Type Alias: CollisionShape'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / CollisionShape

# Type Alias: CollisionShape

```ts
type CollisionShape = 
  | {
  height: number;
  kind: "rect";
  width: number;
  x: number;
  y: number;
}
  | {
  cx: number;
  cy: number;
  kind: "circle";
  radius: number;
};
```

Defined in: [core/map/types.ts:133](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L133)

A collision shape in object/sprite-local pixels: rectangle or circle.
