---
title: 'Class: GridDebugSystem'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / GridDebugSystem

# Class: GridDebugSystem

Defined in: [debug/grid\_debug.ts:57](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L57)

SubSystem is a modular component of the game engine that can be added or removed as needed.
It provides hooks for initialization, updating, rendering, and destruction.
Each subsystem can have its own logic and state, and can interact with the engine and other subsystems.

## Since

0.2.0

## Implements

- [`SubSystem`](../interfaces/SubSystem.md)

## Constructors

### Constructor

```ts
new GridDebugSystem(config: GridDebugConfig): GridDebugSystem;
```

Defined in: [debug/grid\_debug.ts:120](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L120)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`GridDebugConfig`](../interfaces/GridDebugConfig.md) |

#### Returns

`GridDebugSystem`

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="id"></a> `id` | `public` | `string` | `'grid-debug'` | Subsystem identifier. | [debug/grid\_debug.ts:61](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L61) |
| <a id="order"></a> `order` | `public` | `number` | `90` | Execution order. `90` renders on top of most subsystems. | [debug/grid\_debug.ts:66](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L66) |
| <a id="canvas"></a> `canvas` | `private` | `HTMLCanvasElement` \| `null` | `null` | - | [debug/grid\_debug.ts:89](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L89) |
| <a id="canvasheight"></a> `canvasHeight` | `private` | `number` | `0` | - | [debug/grid\_debug.ts:88](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L88) |
| <a id="collisioncolor"></a> `collisionColor` | `private` | `string` | `undefined` | - | [debug/grid\_debug.ts:81](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L81) |
| <a id="configcanvas"></a> `configCanvas` | `private` | `HTMLCanvasElement` \| `undefined` | `undefined` | Stored canvas reference from config for use in init(). | [debug/grid\_debug.ts:118](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L118) |
| <a id="debugpath"></a> `debugPath` | `private` | \{ `col`: `number`; `row`: `number`; \}[] | `[]` | - | [debug/grid\_debug.ts:84](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L84) |
| <a id="fontsize"></a> `fontSize` | `private` | `number` | `undefined` | - | [debug/grid\_debug.ts:82](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L82) |
| <a id="grid"></a> `grid` | `private` | [`Grid`](Grid.md) | `undefined` | - | [debug/grid\_debug.ts:68](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L68) |
| <a id="gridcolor"></a> `gridColor` | `private` | `string` | `undefined` | - | [debug/grid\_debug.ts:79](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L79) |
| <a id="mouseactive"></a> `mouseActive` | `private` | `boolean` | `false` | - | [debug/grid\_debug.ts:87](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L87) |
| <a id="mousex"></a> `mouseX` | `private` | `number` | `0` | - | [debug/grid\_debug.ts:85](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L85) |
| <a id="mousey"></a> `mouseY` | `private` | `number` | `0` | - | [debug/grid\_debug.ts:86](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L86) |
| <a id="pathcolor"></a> `pathColor` | `private` | `string` | `undefined` | - | [debug/grid\_debug.ts:80](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L80) |
| <a id="projection"></a> `projection` | `private` | [`IsometricProjection`](IsometricProjection.md) \| `null` | `undefined` | - | [debug/grid\_debug.ts:69](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L69) |
| <a id="showcollisionbounds"></a> `showCollisionBounds` | `private` | `boolean` | `undefined` | - | [debug/grid\_debug.ts:75](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L75) |
| <a id="showcoordinates"></a> `showCoordinates` | `private` | `boolean` | `undefined` | - | [debug/grid\_debug.ts:73](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L73) |
| <a id="showgrid"></a> `showGrid` | `private` | `boolean` | `undefined` | - | [debug/grid\_debug.ts:72](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L72) |
| <a id="showpathfinding"></a> `showPathfinding` | `private` | `boolean` | `undefined` | - | [debug/grid\_debug.ts:76](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L76) |
| <a id="showtileinspector"></a> `showTileInspector` | `private` | `boolean` | `undefined` | - | [debug/grid\_debug.ts:77](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L77) |
| <a id="showworldcoordinates"></a> `showWorldCoordinates` | `private` | `boolean` | `undefined` | - | [debug/grid\_debug.ts:74](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L74) |
| <a id="viewh"></a> `viewH` | `private` | `number` | `0` | - | [debug/grid\_debug.ts:97](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L97) |
| <a id="vieww"></a> `viewW` | `private` | `number` | `0` | - | [debug/grid\_debug.ts:96](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L96) |
| <a id="viewx"></a> `viewX` | `private` | `number` | `0` | Cached viewport bounds for culling debug overlays. | [debug/grid\_debug.ts:94](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L94) |
| <a id="viewy"></a> `viewY` | `private` | `number` | `0` | - | [debug/grid\_debug.ts:95](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L95) |
| <a id="world"></a> `world` | `private` | [`World`](World.md) \| `null` | `undefined` | - | [debug/grid\_debug.ts:70](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L70) |

## Methods

### destroy()

```ts
destroy(): void;
```

Defined in: [debug/grid\_debug.ts:242](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L242)

Cleans up event listeners when the subsystem is destroyed.

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`SubSystem`](../interfaces/SubSystem.md).[`destroy`](../interfaces/SubSystem.md#destroy)

***

### init()

```ts
init(engine: Engine): void;
```

Defined in: [debug/grid\_debug.ts:149](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L149)

Called by the engine when this subsystem is attached.

Sets up mouse tracking for the tile inspector and coordinate
readout.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `engine` | [`Engine`](Engine.md) | The engine instance. |

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`SubSystem`](../interfaces/SubSystem.md).[`init`](../interfaces/SubSystem.md#init)

***

### render()

```ts
render(ctx: RenderContext): void;
```

Defined in: [debug/grid\_debug.ts:211](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L211)

Renders all enabled debug overlays.

Only functional on canvas-backed `RenderContext` implementations.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) | The active render context. |

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`SubSystem`](../interfaces/SubSystem.md).[`render`](../interfaces/SubSystem.md#render)

***

### setDebugPath()

```ts
setDebugPath(path: {
  col: number;
  row: number;
}[]): void;
```

Defined in: [debug/grid\_debug.ts:198](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L198)

Sets a pathfinding result to visualise.

The path is drawn as a green line connecting cell centres. Call
with an empty array to clear.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | \{ `col`: `number`; `row`: `number`; \}[] | Array of `{ col, row }` waypoints. |

#### Returns

`void`

#### Since

0.4.0

#### Example

```ts
const path = pathfinder.findPath(0, 0, 10, 10);
if (path) debugSystem.setDebugPath(path);
```

***

### setViewport()

```ts
setViewport(
   x: number, 
   y: number, 
   w: number, 
   h: number
): void;
```

Defined in: [debug/grid\_debug.ts:175](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L175)

Sets the viewport rectangle for culling. Call once per frame
before render with the camera's view rect.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | Left edge in world/screen-space. |
| `y` | `number` | Top edge in world/screen-space. |
| `w` | `number` | Width in pixels. |
| `h` | `number` | Height in pixels. |

#### Returns

`void`

#### Since

0.4.0

***

### getCellCenter()

```ts
private getCellCenter(col: number, row: number): {
  x: number;
  y: number;
};
```

Defined in: [debug/grid\_debug.ts:604](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L604)

**`Internal`**

Returns the screen-space center of a grid cell.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `col` | `number` |
| `row` | `number` |

#### Returns

```ts
{
  x: number;
  y: number;
}
```

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `x` | `number` | [debug/grid\_debug.ts:604](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L604) |
| `y` | `number` | [debug/grid\_debug.ts:604](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L604) |

***

### handleMouseLeave()

```ts
private handleMouseLeave(): void;
```

Defined in: [debug/grid\_debug.ts:257](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L257)

#### Returns

`void`

***

### handleMouseMove()

```ts
private handleMouseMove(e: MouseEvent): void;
```

Defined in: [debug/grid\_debug.ts:251](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L251)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `e` | `MouseEvent` |

#### Returns

`void`

***

### renderCollisionBounds()

```ts
private renderCollisionBounds(ctx: CanvasRenderingContext2D): void;
```

Defined in: [debug/grid\_debug.ts:410](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L410)

**`Internal`**

Draws outlines for all active colliders in the world.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | `CanvasRenderingContext2D` |

#### Returns

`void`

***

### renderCoordinates()

```ts
private renderCoordinates(ctx: CanvasRenderingContext2D): void;
```

Defined in: [debug/grid\_debug.ts:348](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L348)

**`Internal`**

Draws `(col, row)` labels in each visible cell.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | `CanvasRenderingContext2D` |

#### Returns

`void`

***

### renderGrid()

```ts
private renderGrid(ctx: CanvasRenderingContext2D): void;
```

Defined in: [debug/grid\_debug.ts:269](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L269)

**`Internal`**

Draws the grid structure — rectangular lines for orthogonal,
diamond outlines for isometric.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | `CanvasRenderingContext2D` |

#### Returns

`void`

***

### renderIsometricGrid()

```ts
private renderIsometricGrid(ctx: CanvasRenderingContext2D): void;
```

Defined in: [debug/grid\_debug.ts:310](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L310)

**`Internal`**

Draws isometric diamond outlines for each tile.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | `CanvasRenderingContext2D` |

#### Returns

`void`

***

### renderOrthogonalGrid()

```ts
private renderOrthogonalGrid(ctx: CanvasRenderingContext2D): void;
```

Defined in: [debug/grid\_debug.ts:282](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L282)

**`Internal`**

Draws orthogonal grid lines.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | `CanvasRenderingContext2D` |

#### Returns

`void`

***

### renderPathfinding()

```ts
private renderPathfinding(ctx: CanvasRenderingContext2D): void;
```

Defined in: [debug/grid\_debug.ts:444](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L444)

**`Internal`**

Draws the debug path as a line connecting cell centres, with
dots at each waypoint.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | `CanvasRenderingContext2D` |

#### Returns

`void`

***

### renderTileInspector()

```ts
private renderTileInspector(ctx: CanvasRenderingContext2D): void;
```

Defined in: [debug/grid\_debug.ts:484](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L484)

**`Internal`**

Highlights the tile under the cursor and shows a tooltip.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | `CanvasRenderingContext2D` |

#### Returns

`void`

***

### renderWorldCoordinates()

```ts
private renderWorldCoordinates(ctx: CanvasRenderingContext2D): void;
```

Defined in: [debug/grid\_debug.ts:553](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/grid_debug.ts#L553)

**`Internal`**

Draws a fixed-position readout showing the cursor's grid, world,
and screen coordinates.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | `CanvasRenderingContext2D` |

#### Returns

`void`
