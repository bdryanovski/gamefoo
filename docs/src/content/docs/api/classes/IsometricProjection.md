---
title: 'Class: IsometricProjection'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / IsometricProjection

# Class: IsometricProjection

Defined in: [core/grid/isometric.ts:50](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L50)

## Constructors

### Constructor

```ts
new IsometricProjection(config: IsoConfig): IsometricProjection;
```

Defined in: [core/grid/isometric.ts:92](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L92)

Creates a new isometric projection.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`IsoConfig`](../interfaces/IsoConfig.md) | Tile dimensions, origin offset, and layout mode. |

#### Returns

`IsometricProjection`

#### Since

0.4.0

#### Example

```ts
const iso = new IsometricProjection({
  tileWidth: 64,
  tileHeight: 32,
  origin: { x: 256, y: 32 },
  layout: "diamond",
});
```

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="layout"></a> `layout` | `readonly` | [`IsoLayout`](../type-aliases/IsoLayout.md) | Layout mode: `"diamond"` or `"staggered"`. | [core/grid/isometric.ts:61](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L61) |
| <a id="origin"></a> `origin` | `readonly` | [`Vector2`](../interfaces/Vector2.md) | Screen-space offset applied to all projected coordinates. | [core/grid/isometric.ts:58](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L58) |
| <a id="tileheight"></a> `tileHeight` | `readonly` | `number` | Full height of an isometric tile in pixels. | [core/grid/isometric.ts:55](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L55) |
| <a id="tilewidth"></a> `tileWidth` | `readonly` | `number` | Full width of an isometric tile in pixels. | [core/grid/isometric.ts:52](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L52) |
| <a id="_gridout"></a> `_gridOut` | `private` | \{ `col`: `number`; `row`: `number`; \} | Reusable output object for screenToGrid to reduce allocations. | [core/grid/isometric.ts:73](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L73) |
| `_gridOut.col` | `public` | `number` | - | [core/grid/isometric.ts:73](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L73) |
| `_gridOut.row` | `public` | `number` | - | [core/grid/isometric.ts:73](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L73) |
| <a id="_screenout"></a> `_screenOut` | `private` | [`Vector2`](../interfaces/Vector2.md) | Reusable output object for gridToScreen to reduce allocations. | [core/grid/isometric.ts:70](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L70) |
| <a id="hh"></a> `hh` | `private` | `number` | Half-tile height, cached for performance. | [core/grid/isometric.ts:67](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L67) |
| <a id="hw"></a> `hw` | `private` | `number` | Half-tile width, cached for performance. | [core/grid/isometric.ts:64](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L64) |

## Methods

### getTileDiamond()

```ts
getTileDiamond(col: number, row: number): [Vector2, Vector2, Vector2, Vector2];
```

Defined in: [core/grid/isometric.ts:274](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L274)

Returns the four corner vertices of a tile diamond at the given
grid position. Useful for debug rendering and hit-testing.

Vertices are ordered: **top**, **right**, **bottom**, **left**
(clockwise from the top).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `col` | `number` | Grid column index. |
| `row` | `number` | Grid row index. |

#### Returns

\[[`Vector2`](../interfaces/Vector2.md), [`Vector2`](../interfaces/Vector2.md), [`Vector2`](../interfaces/Vector2.md), [`Vector2`](../interfaces/Vector2.md)\]

Array of 4 screen-space points forming the diamond.

#### Since

0.4.0

#### Example

```ts
const [top, right, bottom, left] = iso.getTileDiamond(3, 2);

ctx.beginPath();
ctx.moveTo(top.x, top.y);
ctx.lineTo(right.x, right.y);
ctx.lineTo(bottom.x, bottom.y);
ctx.lineTo(left.x, left.y);
ctx.closePath();
ctx.stroke();
```

***

### getVisibleRange()

```ts
getVisibleRange(
   viewX: number, 
   viewY: number, 
   viewW: number, 
   viewH: number, 
   gridCols: number, 
   gridRows: number): VisibleRange;
```

Defined in: [core/grid/isometric.ts:324](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L324)

Computes the range of grid cells that are potentially visible
within a viewport rectangle.

The returned range is conservatively padded by one tile in every
direction to avoid popping at the edges.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `viewX` | `number` | Left edge of the viewport in screen-space. |
| `viewY` | `number` | Top edge of the viewport in screen-space. |
| `viewW` | `number` | Width of the viewport in pixels. |
| `viewH` | `number` | Height of the viewport in pixels. |
| `gridCols` | `number` | Total columns in the grid (used for clamping). |
| `gridRows` | `number` | Total rows in the grid (used for clamping). |

#### Returns

[`VisibleRange`](../interfaces/VisibleRange.md)

A [VisibleRange](../interfaces/VisibleRange.md) with min/max column and row.

#### Since

0.4.0

#### Example

```ts
const view = camera.getViewRect();
const range = iso.getVisibleRange(
  view.x, view.y, view.width, view.height,
  grid.cols, grid.rows,
);

for (let r = range.minRow; r <= range.maxRow; r++) {
  for (let c = range.minCol; c <= range.maxCol; c++) {
    renderTile(c, r);
  }
}
```

***

### gridToScreen()

```ts
gridToScreen(col: number, row: number): Vector2;
```

Defined in: [core/grid/isometric.ts:131](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L131)

Converts grid coordinates to screen-space pixel position.

For **diamond** layout the returned point is the **top vertex** of
the tile diamond. For **staggered** layout it is the top-left
corner of the tile rectangle.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `col` | `number` | Grid column index. |
| `row` | `number` | Grid row index. |

#### Returns

[`Vector2`](../interfaces/Vector2.md)

Screen-space pixel position.

#### Since

0.4.0

#### Examples

```ts
const pos = iso.gridToScreen(2, 3);
// Classic 2:1 (64×32): { x: origin.x + (2-3)*32, y: origin.y + (2+3)*16 }
```

```ts
const iso = new IsometricProjection({
  tileWidth: 64, tileHeight: 32, layout: "staggered",
});
const pos = iso.gridToScreen(2, 3);
// Odd row offset by half a tile width
```

***

### gridToScreenFast()

```ts
gridToScreenFast(col: number, row: number): Vector2;
```

Defined in: [core/grid/isometric.ts:180](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L180)

Allocation-free variant of [gridToScreen](#gridtoscreen). Writes into a
shared internal object and returns it. **Do not cache** the
returned reference — it is overwritten on the next call.

Ideal for tight render loops where thousands of calls per frame
would otherwise create garbage.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `col` | `number` | Grid column index. |
| `row` | `number` | Grid row index. |

#### Returns

[`Vector2`](../interfaces/Vector2.md)

Shared mutable `{ x, y }` — use immediately.

#### Since

0.4.0

***

### screenToGrid()

```ts
screenToGrid(screenX: number, screenY: number): {
  col: number;
  row: number;
};
```

Defined in: [core/grid/isometric.ts:159](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L159)

Converts a screen-space pixel position back to grid coordinates.

The returned column and row are **floored** to the nearest cell.
Results may be out of grid bounds — use
[Grid.isInBounds](Grid.md#isinbounds) to validate.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `screenX` | `number` | Screen-space X coordinate. |
| `screenY` | `number` | Screen-space Y coordinate. |

#### Returns

```ts
{
  col: number;
  row: number;
}
```

Grid column and row as integers.

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `col` | `number` | [core/grid/isometric.ts:159](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L159) |
| `row` | `number` | [core/grid/isometric.ts:159](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L159) |

#### Since

0.4.0

#### Example

```ts
const { col, row } = iso.screenToGrid(mouseX, mouseY);
if (grid.isInBounds(col, row)) {
  console.log("Hovered cell:", col, row);
}
```

***

### screenToGridFast()

```ts
screenToGridFast(screenX: number, screenY: number): {
  col: number;
  row: number;
};
```

Defined in: [core/grid/isometric.ts:203](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L203)

Allocation-free variant of [screenToGrid](#screentogrid). Writes into a
shared internal object and returns it. **Do not cache** the
returned reference.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `screenX` | `number` | Screen-space X coordinate. |
| `screenY` | `number` | Screen-space Y coordinate. |

#### Returns

```ts
{
  col: number;
  row: number;
}
```

Shared mutable `{ col, row }` — use immediately.

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `col` | `number` | [core/grid/isometric.ts:206](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L206) |
| `row` | `number` | [core/grid/isometric.ts:206](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L206) |

#### Since

0.4.0

***

### snapToGrid()

```ts
snapToGrid(screenX: number, screenY: number): {
  col: number;
  row: number;
};
```

Defined in: [core/grid/isometric.ts:242](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L242)

Snaps a screen-space position to the nearest grid cell center.

Equivalent to `screenToGrid` followed by `gridToScreen`, which
effectively rounds to the closest tile.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `screenX` | `number` | Screen-space X coordinate. |
| `screenY` | `number` | Screen-space Y coordinate. |

#### Returns

```ts
{
  col: number;
  row: number;
}
```

The grid cell that the point falls within.

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `col` | `number` | [core/grid/isometric.ts:242](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L242) |
| `row` | `number` | [core/grid/isometric.ts:242](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L242) |

#### Since

0.4.0

#### Example

```ts
const snapped = iso.snapToGrid(mouseX, mouseY);
// Place a building at the snapped cell
building.moveTo(snapped.col, snapped.row);
```

***

### gridToScreenDiamond()

```ts
private gridToScreenDiamond(col: number, row: number): Vector2;
```

Defined in: [core/grid/isometric.ts:365](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L365)

**`Internal`**

Diamond layout: grid → screen.

```
screenX = origin.x + (col - row) * (tileWidth / 2)
screenY = origin.y + (col + row) * (tileHeight / 2)
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `col` | `number` |
| `row` | `number` |

#### Returns

[`Vector2`](../interfaces/Vector2.md)

***

### gridToScreenStaggered()

```ts
private gridToScreenStaggered(col: number, row: number): Vector2;
```

Defined in: [core/grid/isometric.ts:403](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L403)

**`Internal`**

Staggered layout: grid → screen.

Odd rows are offset by half a tile width.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `col` | `number` |
| `row` | `number` |

#### Returns

[`Vector2`](../interfaces/Vector2.md)

***

### screenToGridDiamond()

```ts
private screenToGridDiamond(screenX: number, screenY: number): {
  col: number;
  row: number;
};
```

Defined in: [core/grid/isometric.ts:382](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L382)

**`Internal`**

Diamond layout: screen → grid (inverse of gridToScreenDiamond).

```
col = floor((sx / halfW + sy / halfH) / 2)
row = floor((sy / halfH - sx / halfW) / 2)
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `screenX` | `number` |
| `screenY` | `number` |

#### Returns

```ts
{
  col: number;
  row: number;
}
```

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `col` | `number` | [core/grid/isometric.ts:385](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L385) |
| `row` | `number` | [core/grid/isometric.ts:385](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L385) |

***

### screenToGridStaggered()

```ts
private screenToGridStaggered(screenX: number, screenY: number): {
  col: number;
  row: number;
};
```

Defined in: [core/grid/isometric.ts:416](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L416)

**`Internal`**

Staggered layout: screen → grid.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `screenX` | `number` |
| `screenY` | `number` |

#### Returns

```ts
{
  col: number;
  row: number;
}
```

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `col` | `number` | [core/grid/isometric.ts:419](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L419) |
| `row` | `number` | [core/grid/isometric.ts:419](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric.ts#L419) |
