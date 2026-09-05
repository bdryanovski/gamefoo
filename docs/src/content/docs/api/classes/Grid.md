---
title: 'Class: Grid<T = `number`>'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Grid

# Class: Grid\<T = `number`\>

Defined in: [core/grid/grid.ts:46](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid.ts#L46)

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `number` |

## Constructors

### Constructor

```ts
new Grid<T = number>(config: GridConfig, defaultValue: T): Grid<T>;
```

Defined in: [core/grid/grid.ts:93](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid.ts#L93)

Creates a new grid, pre-filling every cell with `defaultValue`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`GridConfig`](../interfaces/GridConfig.md) | Grid dimensions and cell sizing. |
| `defaultValue` | `T` | Initial value written to every cell. |

#### Returns

`Grid`\<`T`\>

#### Since

0.4.0

#### Example

```ts
const grid = new Grid<number>(
  { cols: 16, rows: 16, cellWidth: 32, cellHeight: 32 },
  0,
);
```

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="cellheight"></a> `cellHeight` | `readonly` | `number` | Height of a single cell in world-space pixels. | [core/grid/grid.ts:65](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid.ts#L65) |
| <a id="cellwidth"></a> `cellWidth` | `readonly` | `number` | Width of a single cell in world-space pixels. | [core/grid/grid.ts:60](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid.ts#L60) |
| <a id="cols"></a> `cols` | `readonly` | `number` | Number of columns in the grid. | [core/grid/grid.ts:50](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid.ts#L50) |
| <a id="origin"></a> `origin` | `readonly` | [`Vector2`](../interfaces/Vector2.md) | World-space offset of cell (0, 0). | [core/grid/grid.ts:70](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid.ts#L70) |
| <a id="rows"></a> `rows` | `readonly` | `number` | Number of rows in the grid. | [core/grid/grid.ts:55](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid.ts#L55) |
| <a id="cells"></a> `cells` | `private` | [`GridCell`](../interfaces/GridCell.md)\<`T`\>[][] | Internal 2-D array storing all cells, indexed `[row][col]`. | [core/grid/grid.ts:75](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid.ts#L75) |

## Methods

### cellToWorld()

```ts
cellToWorld(col: number, row: number): Vector2;
```

Defined in: [core/grid/grid.ts:229](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid.ts#L229)

Converts grid coordinates to world-space pixel position.

For orthogonal (top-down) grids this is the top-left corner of
the cell. For isometric grids, use [IsometricProjection.gridToScreen](IsometricProjection.md#gridtoscreen)
instead.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `col` | `number` | Column index. |
| `row` | `number` | Row index. |

#### Returns

[`Vector2`](../interfaces/Vector2.md)

World-space position of the cell's top-left corner.

#### Since

0.4.0

#### Example

```ts
const pos = grid.cellToWorld(3, 2);
// For a 32×32 grid with origin (0,0): { x: 96, y: 64 }
```

***

### fill()

```ts
fill(value: T): void;
```

Defined in: [core/grid/grid.ts:349](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid.ts#L349)

Fills every cell in the grid with the given value.

Walkability flags are **not** modified.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `T` | Value to write into all cells. |

#### Returns

`void`

#### Since

0.4.0

#### Example

```ts
grid.fill(0); // reset all tiles to 0
```

***

### fillRect()

```ts
fillRect(
   col: number, 
   row: number, 
   w: number, 
   h: number, 
   value: T
): void;
```

Defined in: [core/grid/grid.ts:374](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid.ts#L374)

Fills a rectangular sub-region of the grid with the given value.

Cells outside the grid bounds are silently skipped.
Walkability flags are **not** modified.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `col` | `number` | Starting column (top-left of the rectangle). |
| `row` | `number` | Starting row (top-left of the rectangle). |
| `w` | `number` | Width of the rectangle in cells. |
| `h` | `number` | Height of the rectangle in cells. |
| `value` | `T` | Value to write. |

#### Returns

`void`

#### Since

0.4.0

#### Example

**Fill a 4×3 area with tile ID 5**

```ts
grid.fillRect(2, 2, 4, 3, 5);
```

***

### forEach()

```ts
forEach(callback: (cell: GridCell<T>, col: number, row: number) => void): void;
```

Defined in: [core/grid/grid.ts:283](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid.ts#L283)

Iterates every cell in the grid, calling `callback` for each.

Iteration order is row-major: row 0 left-to-right, then row 1, etc.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `callback` | (`cell`: [`GridCell`](../interfaces/GridCell.md)\<`T`\>, `col`: `number`, `row`: `number`) => `void` | Function invoked for each cell with the cell, its column, and its row. |

#### Returns

`void`

#### Since

0.4.0

#### Example

**Count walls**

```ts
let walls = 0;
grid.forEach((cell) => {
  if (!cell.walkable) walls++;
});
```

***

### getCell()

```ts
getCell(col: number, row: number): GridCell<T> | undefined;
```

Defined in: [core/grid/grid.ts:134](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid.ts#L134)

Returns the cell at the given grid coordinates, or `undefined` if
the coordinates are out of bounds.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `col` | `number` | Zero-based column index. |
| `row` | `number` | Zero-based row index. |

#### Returns

[`GridCell`](../interfaces/GridCell.md)\<`T`\> \| `undefined`

The cell, or `undefined` if out of range.

#### Since

0.4.0

#### Example

```ts
const cell = grid.getCell(3, 7);
if (cell) {
  console.log(cell.value, cell.walkable);
}
```

***

### getNeighbours()

```ts
getNeighbours(
   col: number, 
   row: number, 
   includeDiagonals?: boolean
): GridCell<T>[];
```

Defined in: [core/grid/grid.ts:318](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid.ts#L318)

Returns the direct neighbours of a cell.

By default returns the 4 cardinal neighbours (up, down, left, right).
Pass `includeDiagonals = true` for all 8 surrounding cells.

Only in-bounds cells are returned.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `col` | `number` | `undefined` | Column of the target cell. |
| `row` | `number` | `undefined` | Row of the target cell. |
| `includeDiagonals` | `boolean` | `false` | Include the 4 diagonal neighbours. |

#### Returns

[`GridCell`](../interfaces/GridCell.md)\<`T`\>[]

Array of neighbouring cells.

#### Since

0.4.0

#### Examples

**Cardinal neighbours**

```ts
const neighbours = grid.getNeighbours(5, 5);
// Up to 4 cells: (4,5), (6,5), (5,4), (5,6)
```

**Including diagonals**

```ts
const all = grid.getNeighbours(5, 5, true);
// Up to 8 cells
```

***

### isInBounds()

```ts
isInBounds(col: number, row: number): boolean;
```

Defined in: [core/grid/grid.ts:204](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid.ts#L204)

Checks whether a column/row pair falls within the grid boundaries.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `col` | `number` | Column index to test. |
| `row` | `number` | Row index to test. |

#### Returns

`boolean`

`true` if `0 <= col < cols` and `0 <= row < rows`.

#### Since

0.4.0

#### Example

```ts
grid.isInBounds(0, 0);    // true
grid.isInBounds(-1, 0);   // false
grid.isInBounds(100, 0);  // false (if cols < 100)
```

***

### setCell()

```ts
setCell(
   col: number, 
   row: number, 
   value: T
): void;
```

Defined in: [core/grid/grid.ts:157](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid.ts#L157)

Sets the value of a cell at the given grid coordinates.

Does nothing if the coordinates are out of bounds.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `col` | `number` | Zero-based column index. |
| `row` | `number` | Zero-based row index. |
| `value` | `T` | New value for the cell. |

#### Returns

`void`

#### Since

0.4.0

#### Example

```ts
grid.setCell(5, 3, 4); // set tile ID 4 at column 5, row 3
```

***

### setWalkable()

```ts
setWalkable(
   col: number, 
   row: number, 
   walkable: boolean
): void;
```

Defined in: [core/grid/grid.ts:181](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid.ts#L181)

Sets the walkability flag of a cell.

This flag is consumed by the [Pathfinder](Pathfinder.md) to determine
traversable terrain.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `col` | `number` | Zero-based column index. |
| `row` | `number` | Zero-based row index. |
| `walkable` | `boolean` | `true` if entities can traverse this cell. |

#### Returns

`void`

#### Since

0.4.0

#### Example

```ts
grid.setWalkable(10, 5, false); // mark as impassable
```

***

### worldToCell()

```ts
worldToCell(wx: number, wy: number): {
  col: number;
  row: number;
};
```

Defined in: [core/grid/grid.ts:256](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid.ts#L256)

Converts a world-space position to grid coordinates.

The returned values are floored to integers. For isometric grids,
use [IsometricProjection.screenToGrid](IsometricProjection.md#screentogrid) instead.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `wx` | `number` | World-space X coordinate. |
| `wy` | `number` | World-space Y coordinate. |

#### Returns

```ts
{
  col: number;
  row: number;
}
```

Grid column and row (may be out of bounds).

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `col` | `number` | [core/grid/grid.ts:256](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid.ts#L256) |
| `row` | `number` | [core/grid/grid.ts:256](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid.ts#L256) |

#### Since

0.4.0

#### Example

```ts
const { col, row } = grid.worldToCell(100, 70);
if (grid.isInBounds(col, row)) {
  console.log("Valid cell:", col, row);
}
```
