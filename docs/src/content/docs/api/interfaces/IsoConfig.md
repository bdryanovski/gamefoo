---
title: 'Interface: IsoConfig'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / IsoConfig

# Interface: IsoConfig

Defined in: [core/grid/isometric\_types.ts:60](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric_types.ts#L60)

Configuration for constructing an [IsometricProjection](../classes/IsometricProjection.md).

The `tileWidth / tileHeight` ratio controls the perceived camera angle:

| Ratio   | tileWidth | tileHeight | Feel                           |
| ------- | --------- | ---------- | ------------------------------ |
| 4:1     | 64        | 16         | Very flat, almost top-down     |
| 2:1     | 64        | 32         | **Classic isometric**          |
| 1.33:1  | 64        | 48         | Steep / aggressive — more "3D" |
| 1:1     | 64        | 64         | 45-degree diamond (extreme)    |

## Since

0.4.0

## Examples

```ts
const config: IsoConfig = {
  tileWidth: 64,
  tileHeight: 32,
};
```

```ts
const config: IsoConfig = {
  tileWidth: 64,
  tileHeight: 48,
  origin: { x: 400, y: 50 },
  layout: "diamond",
};
```

## Properties

| Property | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="layout"></a> `layout?` | [`IsoLayout`](../type-aliases/IsoLayout.md) | `"diamond"` | Tile layout mode. | [core/grid/isometric\_types.ts:77](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric_types.ts#L77) |
| <a id="origin"></a> `origin?` | [`Vector2`](Vector2.md) | `{ x: 0, y: 0 }` | Screen-space offset applied to all projected coordinates. Useful for centering the map on the canvas. | [core/grid/isometric\_types.ts:71](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric_types.ts#L71) |
| <a id="tileheight"></a> `tileHeight` | `number` | `undefined` | Full height of an isometric tile in pixels. | [core/grid/isometric\_types.ts:64](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric_types.ts#L64) |
| <a id="tilewidth"></a> `tileWidth` | `number` | `undefined` | Full width of an isometric tile in pixels. | [core/grid/isometric\_types.ts:62](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric_types.ts#L62) |
