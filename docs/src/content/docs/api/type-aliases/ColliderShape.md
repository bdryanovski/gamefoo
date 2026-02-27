---
title: 'Type Alias: ColliderShape'
---

[**@dryanovski/gamefoo**](../README.md)

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

Defined in: [types.ts:11](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/types.ts#L11)
