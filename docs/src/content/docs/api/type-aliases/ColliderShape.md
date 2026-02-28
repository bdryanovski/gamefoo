---
title: 'Type Alias: ColliderShape'
---

[**@dryanovski/gamefoo v0.0.1**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / ColliderShape

# Type Alias: ColliderShape

```ts
type ColliderShape = 
  | {
  height: number;
  offset?: Vector2;
  type: "aabb";
  width: number;
}
  | {
  offset?: Vector2;
  radius: number;
  type: "circle";
};
```

Defined in: [types.ts:11](https://github.com/bdryanovski/gamefoo/blob/main/src/types.ts#L11)
