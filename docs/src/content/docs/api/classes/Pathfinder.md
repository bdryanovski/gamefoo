---
title: 'Class: Pathfinder'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Pathfinder

# Class: Pathfinder

Defined in: [core/utils/pathfinding.ts:134](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/pathfinding.ts#L134)

## Constructors

### Constructor

```ts
new Pathfinder(config: PathfinderConfig): Pathfinder;
```

Defined in: [core/utils/pathfinding.ts:159](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/pathfinding.ts#L159)

Creates a new pathfinder bound to a grid.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`PathfinderConfig`](../interfaces/PathfinderConfig.md) | Grid, movement rules, and heuristic selection. |

#### Returns

`Pathfinder`

#### Since

0.4.0

#### Example

```ts
const pf = new Pathfinder({
  grid: myGrid,
  allowDiagonal: true,
  heuristic: "euclidean",
});
```

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="allowdiagonal"></a> `allowDiagonal` | `private` | `boolean` | [core/utils/pathfinding.ts:136](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/pathfinding.ts#L136) |
| <a id="diagonalcost"></a> `diagonalCost` | `private` | `number` | [core/utils/pathfinding.ts:137](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/pathfinding.ts#L137) |
| <a id="grid"></a> `grid` | `private` | [`Grid`](Grid.md) | [core/utils/pathfinding.ts:135](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/pathfinding.ts#L135) |
| <a id="heuristicfn"></a> `heuristicFn` | `private` | (`a`: \{ `col`: `number`; `row`: `number`; \}, `b`: \{ `col`: `number`; `row`: `number`; \}) => `number` | [core/utils/pathfinding.ts:138](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/pathfinding.ts#L138) |

## Methods

### getHeuristic()

```ts
private static getHeuristic(name: HeuristicName): (a: {
  col: number;
  row: number;
}, b: {
  col: number;
  row: number;
}) => number;
```

Defined in: [core/utils/pathfinding.ts:337](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/pathfinding.ts#L337)

**`Internal`**

Returns a heuristic function by name.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | [`HeuristicName`](../type-aliases/HeuristicName.md) | Heuristic identifier. |

#### Returns

Distance estimation function.

```ts
(a: {
  col: number;
  row: number;
}, b: {
  col: number;
  row: number;
}): number;
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `a` | \{ `col`: `number`; `row`: `number`; \} |
| `a.col` | `number` |
| `a.row` | `number` |
| `b` | \{ `col`: `number`; `row`: `number`; \} |
| `b.col` | `number` |
| `b.row` | `number` |

##### Returns

`number`

***

### findPath()

```ts
findPath(
   startCol: number, 
   startRow: number, 
   goalCol: number, 
   goalRow: number): 
  | {
  col: number;
  row: number;
}[]
  | null;
```

Defined in: [core/utils/pathfinding.ts:188](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/pathfinding.ts#L188)

Finds the shortest path between two grid cells.

Returns an ordered array of `{ col, row }` waypoints from `start`
to `goal` (inclusive), or `null` if no path exists.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `startCol` | `number` | Starting column. |
| `startRow` | `number` | Starting row. |
| `goalCol` | `number` | Destination column. |
| `goalRow` | `number` | Destination row. |

#### Returns

  \| \{
  `col`: `number`;
  `row`: `number`;
\}[]
  \| `null`

Ordered path waypoints, or `null` if unreachable.

#### Since

0.4.0

#### Example

```ts
const path = pathfinder.findPath(0, 0, 10, 10);
if (path) {
  console.log(`Path has ${path.length} steps`);
}
```

***

### isReachable()

```ts
isReachable(
   startCol: number, 
   startRow: number, 
   goalCol: number, 
   goalRow: number): boolean;
```

Defined in: [core/utils/pathfinding.ts:303](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/pathfinding.ts#L303)

Checks whether a cell is reachable from another.

Equivalent to `findPath() !== null` but communicates intent more
clearly.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `startCol` | `number` | Starting column. |
| `startRow` | `number` | Starting row. |
| `goalCol` | `number` | Destination column. |
| `goalRow` | `number` | Destination row. |

#### Returns

`boolean`

`true` if a path exists.

#### Since

0.4.0

#### Example

```ts
if (pathfinder.isReachable(0, 0, 10, 10)) {
  npc.walkTo(10, 10);
}
```

***

### reconstructPath()

```ts
private reconstructPath(node: PathNode): {
  col: number;
  row: number;
}[];
```

Defined in: [core/utils/pathfinding.ts:318](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/pathfinding.ts#L318)

**`Internal`**

Reconstructs the path from goal node back to start by following
parent pointers.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | [`PathNode`](../interfaces/PathNode.md) |

#### Returns

\{
  `col`: `number`;
  `row`: `number`;
\}[]
