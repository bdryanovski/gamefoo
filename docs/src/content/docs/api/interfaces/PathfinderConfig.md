---
title: 'Interface: PathfinderConfig'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / PathfinderConfig

# Interface: PathfinderConfig

Defined in: [core/utils/pathfinding\_types.ts:97](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/pathfinding_types.ts#L97)

Configuration for constructing a [Pathfinder](../classes/Pathfinder.md).

## Since

0.4.0

## Examples

**4-directional Manhattan**

```ts
const config: PathfinderConfig = {
  grid: myGrid,
  allowDiagonal: false,
  heuristic: "manhattan",
};
```

**8-directional Euclidean**

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
| <a id="allowdiagonal"></a> `allowDiagonal?` | `boolean` | `false` | Allow 8-directional movement (including diagonals). | [core/utils/pathfinding\_types.ts:107](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/pathfinding_types.ts#L107) |
| <a id="diagonalcost"></a> `diagonalCost?` | `number` | `Math.SQRT2` (~1.414) | Movement cost for diagonal steps. Only used when `allowDiagonal` is `true`. | [core/utils/pathfinding\_types.ts:114](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/pathfinding_types.ts#L114) |
| <a id="grid"></a> `grid` | [`Grid`](../classes/Grid.md) | `undefined` | The grid to pathfind over. Walkability is read from cells. | [core/utils/pathfinding\_types.ts:101](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/pathfinding_types.ts#L101) |
| <a id="heuristic"></a> `heuristic?` | [`HeuristicName`](../type-aliases/HeuristicName.md) | `"manhattan"` | Distance heuristic. | [core/utils/pathfinding\_types.ts:120](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/pathfinding_types.ts#L120) |
