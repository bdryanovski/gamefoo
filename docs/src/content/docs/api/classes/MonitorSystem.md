---
title: 'Class: MonitorSystem'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / MonitorSystem

# Class: MonitorSystem

Defined in: [subsystems/monitor\_system.ts:97](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L97)

Performance and debug overlay subsystem.

## Since

0.2.0

## Implements

- [`SubSystem`](../interfaces/SubSystem.md)

## Constructors

### Constructor

```ts
new MonitorSystem(options?: MonitorSystemOptions): MonitorSystem;
```

Defined in: [subsystems/monitor\_system.ts:150](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L150)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | `MonitorSystemOptions` |

#### Returns

`MonitorSystem`

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="enabled"></a> `enabled` | `public` | `boolean` | `true` | Determines the order in which subsystems are updated and rendered. Subsystems with lower order values are processed first. | [subsystems/monitor\_system.ts:103](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L103) |
| <a id="id"></a> `id` | `public` | `string` | `'monitor'` | A unique identifier for the subsystem, used for registration and management within the engine. | [subsystems/monitor\_system.ts:98](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L98) |
| <a id="order"></a> `order` | `public` | `number` | `90` | Order 90 ensures grid renders BEFORE menu system (order 95) | [subsystems/monitor\_system.ts:102](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L102) |
| <a id="x"></a> `x` | `public` | `number` | `8` | X position of the overlay in pixels. | [subsystems/monitor\_system.ts:114](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L114) |
| <a id="y"></a> `y` | `public` | `number` | `8` | Y position of the overlay in pixels. | [subsystems/monitor\_system.ts:118](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L118) |
| <a id="_engine"></a> `_engine` | `private` | [`Engine`](Engine.md) \| `null` | `null` | Engine reference for screen dimensions | [subsystems/monitor\_system.ts:148](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L148) |
| <a id="_gridcolor"></a> `_gridColor` | `private` | `string` | `'#333333'` | Grid color | [subsystems/monitor\_system.ts:143](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L143) |
| <a id="_gridsize"></a> `_gridSize` | `private` | `GridSize` | `16` | Grid size | [subsystems/monitor\_system.ts:139](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L139) |
| <a id="_showfps"></a> `_showFps` | `private` | `boolean` | `true` | Show FPS counter | [subsystems/monitor\_system.ts:127](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L127) |
| <a id="_showgraph"></a> `_showGraph` | `private` | `boolean` | `true` | Show FPS graph | [subsystems/monitor\_system.ts:123](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L123) |
| <a id="_showgrid"></a> `_showGrid` | `private` | `boolean` | `false` | Show grid overlay | [subsystems/monitor\_system.ts:135](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L135) |
| <a id="_showmemory"></a> `_showMemory` | `private` | `boolean` | `true` | Show memory usage | [subsystems/monitor\_system.ts:131](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L131) |
| <a id="fps"></a> `fps` | `private` | `number` | `0` | - | [subsystems/monitor\_system.ts:105](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L105) |
| <a id="framecount"></a> `frameCount` | `private` | `number` | `0` | - | [subsystems/monitor\_system.ts:107](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L107) |
| <a id="frames"></a> `frames` | `private` | `number`[] | `[]` | - | [subsystems/monitor\_system.ts:109](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L109) |
| <a id="memory"></a> `memory` | `private` | `number` | `0` | - | [subsystems/monitor\_system.ts:108](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L108) |
| <a id="timer"></a> `timer` | `private` | `number` | `0` | - | [subsystems/monitor\_system.ts:106](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L106) |

## Accessors

### currentFps

#### Get Signature

```ts
get currentFps(): number;
```

Defined in: [subsystems/monitor\_system.ts:254](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L254)

Current FPS value (read-only).

##### Since

0.5.0

##### Returns

`number`

***

### currentMemory

#### Get Signature

```ts
get currentMemory(): number;
```

Defined in: [subsystems/monitor\_system.ts:263](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L263)

Current memory usage in MB (read-only).

##### Since

0.5.0

##### Returns

`number`

***

### gridColor

#### Get Signature

```ts
get gridColor(): string;
```

Defined in: [subsystems/monitor\_system.ts:241](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L241)

Grid overlay color.

##### Default Value

```ts
'#333333'
```

##### Since

0.5.0

##### Returns

`string`

#### Set Signature

```ts
set gridColor(value: string): void;
```

Defined in: [subsystems/monitor\_system.ts:245](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L245)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

***

### gridSize

#### Get Signature

```ts
get gridSize(): GridSize;
```

Defined in: [subsystems/monitor\_system.ts:223](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L223)

Grid size in pixels (8, 16, 32, or 'none').
Setting a numeric value automatically enables the grid.

##### Since

0.5.0

##### Returns

`GridSize`

#### Set Signature

```ts
set gridSize(value: GridSize): void;
```

Defined in: [subsystems/monitor\_system.ts:227](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L227)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GridSize` |

##### Returns

`void`

***

### showFps

#### Get Signature

```ts
get showFps(): boolean;
```

Defined in: [subsystems/monitor\_system.ts:170](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L170)

Whether to show FPS counter.

##### Since

0.5.0

##### Returns

`boolean`

#### Set Signature

```ts
set showFps(value: boolean): void;
```

Defined in: [subsystems/monitor\_system.ts:174](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L174)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

### showGraph

#### Get Signature

```ts
get showGraph(): boolean;
```

Defined in: [subsystems/monitor\_system.ts:183](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L183)

Whether to show FPS graph.

##### Since

0.5.0

##### Returns

`boolean`

#### Set Signature

```ts
set showGraph(value: boolean): void;
```

Defined in: [subsystems/monitor\_system.ts:187](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L187)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

### showGrid

#### Get Signature

```ts
get showGrid(): boolean;
```

Defined in: [subsystems/monitor\_system.ts:209](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L209)

Whether to show grid overlay.

##### Since

0.5.0

##### Returns

`boolean`

#### Set Signature

```ts
set showGrid(value: boolean): void;
```

Defined in: [subsystems/monitor\_system.ts:213](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L213)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

### showMemory

#### Get Signature

```ts
get showMemory(): boolean;
```

Defined in: [subsystems/monitor\_system.ts:196](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L196)

Whether to show memory usage.

##### Since

0.5.0

##### Returns

`boolean`

#### Set Signature

```ts
set showMemory(value: boolean): void;
```

Defined in: [subsystems/monitor\_system.ts:200](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L200)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

## Methods

### init()

```ts
init(engine: Engine): void;
```

Defined in: [subsystems/monitor\_system.ts:278](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L278)

Initializes the monitor system.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `engine` | [`Engine`](Engine.md) | Engine instance |

#### Returns

`void`

#### Since

0.5.0

#### Implementation of

[`SubSystem`](../interfaces/SubSystem.md).[`init`](../interfaces/SubSystem.md#init)

***

### render()

```ts
render(ctx: RenderContext): void;
```

Defined in: [subsystems/monitor\_system.ts:302](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L302)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) |

#### Returns

`void`

#### Implementation of

[`SubSystem`](../interfaces/SubSystem.md).[`render`](../interfaces/SubSystem.md#render)

***

### update()

```ts
update(deltaTime: number): void;
```

Defined in: [subsystems/monitor\_system.ts:282](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L282)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |

#### Returns

`void`

#### Implementation of

[`SubSystem`](../interfaces/SubSystem.md).[`update`](../interfaces/SubSystem.md#update)

***

### renderGrid()

```ts
private renderGrid(ctx: RenderContext): void;
```

Defined in: [subsystems/monitor\_system.ts:325](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L325)

**`Internal`**

Renders the grid overlay.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) | Render context |

#### Returns

`void`

***

### renderOverlay()

```ts
private renderOverlay(ctx: RenderContext): void;
```

Defined in: [subsystems/monitor\_system.ts:357](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L357)

**`Internal`**

Renders the FPS/memory overlay.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) | Render context |

#### Returns

`void`
