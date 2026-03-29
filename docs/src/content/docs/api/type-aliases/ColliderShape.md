---
title: 'Type Alias: ColliderShape'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

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

Defined in: [generic\_types.ts:103](https://github.com/bdryanovski/gamefoo/blob/main/src/generic_types.ts#L103)

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
| `height` | `number` | Height of the bounding box in pixels. | [generic\_types.ts:110](https://github.com/bdryanovski/gamefoo/blob/main/src/generic_types.ts#L110) |
| `offset?` | [`Vector2`](../interfaces/Vector2.md) | Optional positional offset relative to the owning entity's origin. | [generic\_types.ts:115](https://github.com/bdryanovski/gamefoo/blob/main/src/generic_types.ts#L115) |
| `type` | `"aabb"` | Discriminant for an axis-aligned bounding box. | [generic\_types.ts:106](https://github.com/bdryanovski/gamefoo/blob/main/src/generic_types.ts#L106) |
| `width` | `number` | Width of the bounding box in pixels. | [generic\_types.ts:108](https://github.com/bdryanovski/gamefoo/blob/main/src/generic_types.ts#L108) |

```ts
{
  offset?: Vector2;
  radius: number;
  type: "circle";
}
```

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `offset?` | [`Vector2`](../interfaces/Vector2.md) | Optional positional offset relative to the owning entity's origin. | [generic\_types.ts:126](https://github.com/bdryanovski/gamefoo/blob/main/src/generic_types.ts#L126) |
| `radius` | `number` | Radius of the circle in pixels. | [generic\_types.ts:121](https://github.com/bdryanovski/gamefoo/blob/main/src/generic_types.ts#L121) |
| `type` | `"circle"` | Discriminant for a circular collider. | [generic\_types.ts:119](https://github.com/bdryanovski/gamefoo/blob/main/src/generic_types.ts#L119) |

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
