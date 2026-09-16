---
title: 'Interface: GridCell<T = `number`>'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / GridCell

# Interface: GridCell\<T = `number`\>

Defined in: [core/grid/grid\_types.ts:54](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid_types.ts#L54)

A single cell within a [Grid](../classes/Grid.md).

Each cell knows its own column/row coordinates, holds a user-defined
value (tile ID, terrain type, etc.) and a walkability flag used by
the [Pathfinder](../classes/Pathfinder.md).

## Since

0.4.0

## Examples

```ts
const cell: GridCell<number> = {
  col: 3,
  row: 7,
  value: 2,       // grass tile
  walkable: true,
};
```

**Custom cell data**

```ts
interface TerrainData {
  biome: string;
  elevation: number;
}

const cell: GridCell<TerrainData> = {
  col: 0,
  row: 0,
  value: { biome: "forest", elevation: 0.6 },
  walkable: true,
};
```

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `T` | `number` | The type of data stored in each cell. Defaults to `number` (typically a tile ID). |

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="col"></a> `col` | `number` | Zero-based column index (horizontal). | [core/grid/grid\_types.ts:58](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid_types.ts#L58) |
| <a id="row"></a> `row` | `number` | Zero-based row index (vertical). | [core/grid/grid\_types.ts:62](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid_types.ts#L62) |
| <a id="value"></a> `value` | `T` | User-defined payload for this cell. | [core/grid/grid\_types.ts:66](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid_types.ts#L66) |
| <a id="walkable"></a> `walkable` | `boolean` | Whether entities can traverse this cell. Used by pathfinding. | [core/grid/grid\_types.ts:70](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid_types.ts#L70) |
