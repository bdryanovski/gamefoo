---
title: 'Interface: PathNode'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / PathNode

# Interface: PathNode

Defined in: [core/utils/pathfinding\_types.ts:45](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/pathfinding_types.ts#L45)

A single node in the A* open/closed sets.

## Since

0.4.0

## Example

```ts
const node: PathNode = {
  col: 3, row: 5,
  g: 4.0, h: 6.0, f: 10.0,
  parent: null,
};
```

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="col"></a> `col` | `number` | Grid column index. | [core/utils/pathfinding\_types.ts:47](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/pathfinding_types.ts#L47) |
| <a id="f"></a> `f` | `number` | Total estimated cost: `g + h`. | [core/utils/pathfinding\_types.ts:55](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/pathfinding_types.ts#L55) |
| <a id="g"></a> `g` | `number` | Accumulated cost from the start node to this node. | [core/utils/pathfinding\_types.ts:51](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/pathfinding_types.ts#L51) |
| <a id="h"></a> `h` | `number` | Heuristic estimate from this node to the goal. | [core/utils/pathfinding\_types.ts:53](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/pathfinding_types.ts#L53) |
| <a id="parent"></a> `parent` | `PathNode` \| `null` | Parent node in the shortest path tree, or `null` for the start. | [core/utils/pathfinding\_types.ts:57](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/pathfinding_types.ts#L57) |
| <a id="row"></a> `row` | `number` | Grid row index. | [core/utils/pathfinding\_types.ts:49](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/pathfinding_types.ts#L49) |
