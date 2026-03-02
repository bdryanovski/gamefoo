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

Defined in: [types.ts:103](https://github.com/bdryanovski/gamefoo/blob/main/src/types.ts#L103)

Discriminated union describing the shape of a collision volume.

The `type` field acts as the discriminant:

| `type`     | Extra fields               | Description                    |
| ---------- | -------------------------- | ------------------------------ |
| `"aabb"`   | `width`, `height`, `offset?` | Axis-aligned bounding box      |
| `"circle"` | `radius`, `offset?`          | Circle centred on the entity   |

## Type Declaration

```ts
{
  height: number;
  offset?: Vector2;
  type: "aabb";
  width: number;
}
```

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `height` | `number` | Height of the bounding box in pixels. | [types.ts:110](https://github.com/bdryanovski/gamefoo/blob/main/src/types.ts#L110) |
| `offset?` | [`Vector2`](../interfaces/Vector2.md) | Optional positional offset relative to the owning entity's origin. | [types.ts:115](https://github.com/bdryanovski/gamefoo/blob/main/src/types.ts#L115) |
| `type` | `"aabb"` | Discriminant for an axis-aligned bounding box. | [types.ts:106](https://github.com/bdryanovski/gamefoo/blob/main/src/types.ts#L106) |
| `width` | `number` | Width of the bounding box in pixels. | [types.ts:108](https://github.com/bdryanovski/gamefoo/blob/main/src/types.ts#L108) |

```ts
{
  offset?: Vector2;
  radius: number;
  type: "circle";
}
```

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `offset?` | [`Vector2`](../interfaces/Vector2.md) | Optional positional offset relative to the owning entity's origin. | [types.ts:126](https://github.com/bdryanovski/gamefoo/blob/main/src/types.ts#L126) |
| `radius` | `number` | Radius of the circle in pixels. | [types.ts:121](https://github.com/bdryanovski/gamefoo/blob/main/src/types.ts#L121) |
| `type` | `"circle"` | Discriminant for a circular collider. | [types.ts:119](https://github.com/bdryanovski/gamefoo/blob/main/src/types.ts#L119) |

## Since

0.1.0

## Examples

```ts
const box: ColliderShape = {
  type: "aabb",
  width: 32,
  height: 32,
};
```

```ts
const circle: ColliderShape = {
  type: "circle",
  radius: 16,
  offset: { x: 0, y: -4 },
};
```
