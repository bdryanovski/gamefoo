---
title: 'Interface: PathfinderConfig'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / PathfinderConfig

# Interface: PathfinderConfig

Defined in: [core/utils/pathfinding\_types.ts:85](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/pathfinding_types.ts#L85)

Configuration for constructing a [Pathfinder](../classes/Pathfinder.md).

## Since

0.4.0

## Examples

```ts
const config: PathfinderConfig = {
  grid: myGrid,
  allowDiagonal: false,
  heuristic: "manhattan",
};
```

```ts
const config: PathfinderConfig = {
  grid: myGrid,
  allowDiagonal: true,
  diagonalCost: Math.SQRT2,
  heuristic: "euclidean",
};
```

## Properties

| Property | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="allowdiagonal"></a> `allowDiagonal?` | `boolean` | `false` | Allow 8-directional movement (including diagonals). | [core/utils/pathfinding\_types.ts:93](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/pathfinding_types.ts#L93) |
| <a id="diagonalcost"></a> `diagonalCost?` | `number` | `Math.SQRT2` (~1.414) | Movement cost for diagonal steps. Only used when `allowDiagonal` is `true`. | [core/utils/pathfinding\_types.ts:100](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/pathfinding_types.ts#L100) |
| <a id="grid"></a> `grid` | [`Grid`](../classes/Grid.md) | `undefined` | The grid to pathfind over. Walkability is read from cells. | [core/utils/pathfinding\_types.ts:87](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/pathfinding_types.ts#L87) |
| <a id="heuristic"></a> `heuristic?` | [`HeuristicName`](../type-aliases/HeuristicName.md) | `"manhattan"` | Distance heuristic. | [core/utils/pathfinding\_types.ts:106](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/pathfinding_types.ts#L106) |
