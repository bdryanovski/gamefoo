---
title: 'Interface: GridDebugConfig'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / GridDebugConfig

# Interface: GridDebugConfig

Defined in: [debug/grid\_debug\_types.ts:45](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug_types.ts#L45)

Configuration for the [GridDebugSystem](../classes/GridDebugSystem.md) subsystem.

Toggle individual debug overlays via boolean flags. All overlays
default to `false` (disabled).

## Since

0.4.0

## Examples

**Enable all overlays**

```ts
const config: GridDebugConfig = {
  grid: myGrid,
  projection: isoProjection,
  world: collisionWorld,
  showGrid: true,
  showCoordinates: true,
  showWorldCoordinates: true,
  showCollisionBounds: true,
  showPathfinding: true,
  showTileInspector: true,
};
```

**Minimal — grid lines only**

```ts
const config: GridDebugConfig = {
  grid: myGrid,
  showGrid: true,
};
```

## Properties

| Property | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="canvas"></a> `canvas?` | `HTMLCanvasElement` | `undefined` | The canvas element to attach mouse event listeners to. Required for [GridDebugConfig.showTileInspector](#showtileinspector) and [GridDebugConfig.showWorldCoordinates](#showworldcoordinates) to respond to mouse movement. When omitted, `GridDebugSystem` falls back to `document.querySelector("canvas")` (browser-only). **Since** 0.4.0 **Example** `const debug = new GridDebugSystem({ grid: myGrid, canvas: document.getElementById("game") as HTMLCanvasElement, showTileInspector: true, });` | [debug/grid\_debug\_types.ts:70](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug_types.ts#L70) |
| <a id="collisioncolor"></a> `collisionColor?` | `string` | `"rgba(255,0,0,0.5)"` | Colour for collision bound outlines. | [debug/grid\_debug\_types.ts:149](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug_types.ts#L149) |
| <a id="fontsize"></a> `fontSize?` | `number` | `8` | Font size in pixels for text overlays. | [debug/grid\_debug\_types.ts:156](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug_types.ts#L156) |
| <a id="grid"></a> `grid` | [`Grid`](../classes/Grid.md) | `undefined` | The grid to visualise. | [debug/grid\_debug\_types.ts:49](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug_types.ts#L49) |
| <a id="gridcolor"></a> `gridColor?` | `string` | `"rgba(255,255,0,0.3)"` | Colour for grid lines / diamond outlines. | [debug/grid\_debug\_types.ts:135](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug_types.ts#L135) |
| <a id="pathcolor"></a> `pathColor?` | `string` | `"rgba(0,255,0,0.8)"` | Colour for the pathfinding overlay line. | [debug/grid\_debug\_types.ts:142](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug_types.ts#L142) |
| <a id="projection"></a> `projection?` | [`IsometricProjection`](../classes/IsometricProjection.md) | `undefined` | Isometric projection. When provided, the debug overlay renders diamond outlines instead of rectangular grid lines. | [debug/grid\_debug\_types.ts:76](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug_types.ts#L76) |
| <a id="showcollisionbounds"></a> `showCollisionBounds?` | `boolean` | `false` | Render collision bounds (AABB rectangles / circles) for all active colliders. Requires [GridDebugConfig.world](#world). | [debug/grid\_debug\_types.ts:112](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug_types.ts#L112) |
| <a id="showcoordinates"></a> `showCoordinates?` | `boolean` | `false` | Show `(col, row)` text in each visible cell. | [debug/grid\_debug\_types.ts:96](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug_types.ts#L96) |
| <a id="showgrid"></a> `showGrid?` | `boolean` | `false` | Draw grid lines (orthogonal) or tile diamond outlines (isometric). | [debug/grid\_debug\_types.ts:89](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug_types.ts#L89) |
| <a id="showpathfinding"></a> `showPathfinding?` | `boolean` | `false` | Visualise the most recently set pathfinding result as a green line connecting cell centres. | [debug/grid\_debug\_types.ts:120](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug_types.ts#L120) |
| <a id="showtileinspector"></a> `showTileInspector?` | `boolean` | `false` | Highlight the tile under the cursor and show a tooltip with tile ID, coordinates, and walkability. | [debug/grid\_debug\_types.ts:128](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug_types.ts#L128) |
| <a id="showworldcoordinates"></a> `showWorldCoordinates?` | `boolean` | `false` | Show world-space and grid-space coordinates at a fixed screen position tracking the cursor. | [debug/grid\_debug\_types.ts:104](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug_types.ts#L104) |
| <a id="world"></a> `world?` | [`World`](../classes/World.md) | `undefined` | Collision world reference. Required for [GridDebugConfig.showCollisionBounds](#showcollisionbounds). | [debug/grid\_debug\_types.ts:82](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug_types.ts#L82) |
