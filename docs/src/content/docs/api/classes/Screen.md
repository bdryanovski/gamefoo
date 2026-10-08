---
title: 'Class: Screen'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Screen

# Class: Screen

Defined in: [core/map/screen.ts:93](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen.ts#L93)

One navigable screen.

Built once at load into z-Layers: static `sprite` placements
become inert Tiles (resident, never updated); animation and
machine placements become LiveDescriptor blueprints. Live
instances exist only while the screen is **active** — created on
[Screen.activate](#activate) and disposed on [Screen.deactivate](#deactivate) — so
leaving a screen frees every per-object state, timer and subscription.

Rendering walks layers back-to-front; within a layer tiles draw before
live objects.

## Since

0.5.0

## See

 - [MapManager](MapManager.md)
 - [MapObject](MapObject.md)

## Constructors

### Constructor

```ts
new Screen(context: ScreenContext): Screen;
```

Defined in: [core/map/screen.ts:122](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen.ts#L122)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`ScreenContext`](../interfaces/ScreenContext.md) |

#### Returns

`Screen`

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="collision"></a> `collision` | `readonly` | [`CollisionMap`](CollisionMap.md) | `undefined` | Precomputed collision world for this screen (solids + ground + objects). | [core/map/screen.ts:114](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen.ts#L114) |
| <a id="coordinate"></a> `coordinate` | `readonly` | [`ScreenCoordinate`](../type-aliases/ScreenCoordinate.md) | `undefined` | Grid coordinate `[x, y]`. | [core/map/screen.ts:101](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen.ts#L101) |
| <a id="height"></a> `height` | `readonly` | `number` | `undefined` | Screen height in pixels (`screenRows * blockSize`). | [core/map/screen.ts:109](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen.ts#L109) |
| <a id="name"></a> `name` | `readonly` | `string` | `undefined` | Stable `"x,y"` identifier. | [core/map/screen.ts:97](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen.ts#L97) |
| <a id="width"></a> `width` | `readonly` | `number` | `undefined` | Screen width in pixels (`screenCols * blockSize`). | [core/map/screen.ts:105](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen.ts#L105) |
| <a id="active"></a> `active` | `private` | `boolean` | `false` | - | [core/map/screen.ts:120](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen.ts#L120) |
| <a id="layers"></a> `layers` | `private` | `Layer`[] | `[]` | Sparse, index === z-level. Holes are skipped when iterating. | [core/map/screen.ts:119](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen.ts#L119) |

## Accessors

### objects

#### Get Signature

```ts
get objects(): MapObject[];
```

Defined in: [core/map/screen.ts:342](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen.ts#L342)

Live [MapObject](MapObject.md)s on the active screen (empty while inactive).

##### Returns

[`MapObject`](MapObject.md)[]

## Methods

### activate()

```ts
activate(): void;
```

Defined in: [core/map/screen.ts:222](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen.ts#L222)

Instantiates every live object and fires their spawn hooks.

#### Returns

`void`

***

### deactivate()

```ts
deactivate(): void;
```

Defined in: [core/map/screen.ts:252](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen.ts#L252)

Disposes every live object (spawn/despawn is idempotent).

#### Returns

`void`

***

### objectsByType()

```ts
objectsByType<T extends MapObject>(type: (...args: never[]) => T): T[];
```

Defined in: [core/map/screen.ts:360](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen.ts#L360)

Live objects that are instances of `type`.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`MapObject`](MapObject.md) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | (...`args`: `never`[]) => `T` |

#### Returns

`T`[]

***

### render()

```ts
render(ctx: RenderContext): void;
```

Defined in: [core/map/screen.ts:293](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen.ts#L293)

Draws every layer back-to-front (tiles then live objects per layer).

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) |

#### Returns

`void`

***

### update()

```ts
update(deltaTime: number): void;
```

Defined in: [core/map/screen.ts:275](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen.ts#L275)

Advances every live object (no-op while inactive).

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |

#### Returns

`void`

***

### onEnter()

```ts
protected onEnter(): void;
```

Defined in: [core/map/screen.ts:315](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen.ts#L315)

Hook fired once after this screen's objects spawn (it became active).
Override in a subclass to configure objects (variants), apply story
state, or trigger UI. Default: no-op.

#### Returns

`void`

#### Since

0.5.0

***

### onExit()

```ts
protected onExit(): void;
```

Defined in: [core/map/screen.ts:323](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen.ts#L323)

Hook fired once before this screen's objects are disposed (it is being
left). Objects are still live here. Default: no-op.

#### Returns

`void`

#### Since

0.5.0

***

### onRender()

```ts
protected onRender(_ctx: RenderContext): void;
```

Defined in: [core/map/screen.ts:337](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen.ts#L337)

Per-frame hook after the screen's layers render. Default: no-op.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `_ctx` | [`RenderContext`](../interfaces/RenderContext.md) |

#### Returns

`void`

#### Since

0.5.0

***

### onUpdate()

```ts
protected onUpdate(_deltaTime: number): void;
```

Defined in: [core/map/screen.ts:330](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen.ts#L330)

Per-frame hook after the live objects update. Default: no-op.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `_deltaTime` | `number` |

#### Returns

`void`

#### Since

0.5.0

***

### addStaticColliders()

```ts
private addStaticColliders(
   defs: CollisionDefinition[], 
   x: number, 
   y: number
): void;
```

Defined in: [core/map/screen.ts:209](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen.ts#L209)

Adds a sprite/tile's authored colliders to the collision world.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `defs` | [`CollisionDefinition`](../interfaces/CollisionDefinition.md)[] |
| `x` | `number` |
| `y` | `number` |

#### Returns

`void`

***

### layer()

```ts
private layer(level: number): Layer;
```

Defined in: [core/map/screen.ts:367](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen.ts#L367)

Returns (creating if needed) the layer at z-`level`.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `level` | `number` |

#### Returns

`Layer`

***

### paintFill()

```ts
private paintFill(
   spriteId: string | null, 
   assets: AssetManager, 
   map: MapData
): void;
```

Defined in: [core/map/screen.ts:379](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen.ts#L379)

Tiles the fill sprite across the whole grid on layer 0.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `spriteId` | `string` \| `null` |
| `assets` | [`AssetManager`](AssetManager.md) |
| `map` | [`MapData`](../interfaces/MapData.md) |

#### Returns

`void`
