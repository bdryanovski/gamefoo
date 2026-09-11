---
title: 'Type Alias: Placement'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Placement

# Type Alias: Placement

```ts
type Placement = Transform & {
  id: string;
  level: number;
  x: number;
  y: number;
} & 
  | {
  kind: "sprite";
  spriteId: string;
}
  | {
  animationId: string;
  kind: "animation";
}
  | {
  kind: "machine";
  machineId: string;
  stateName?: string;
};
```

Defined in: [core/map/types.ts:182](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L182)

One thing painted on a screen at a pixel offset and z-`level`.

## Type Declaration

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `id` | `string` | - | [core/map/types.ts:183](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L183) |
| `level` | `number` | Z-layer, `0` = back. Layers stack low → high. | [core/map/types.ts:192](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L192) |
| `x` | `number` | Pixel offset within the screen (grid-snapped). | [core/map/types.ts:187](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L187) |
| `y` | `number` | - | [core/map/types.ts:188](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L188) |
