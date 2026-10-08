---
title: 'Class: CollisionMap'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / CollisionMap

# Class: CollisionMap

Defined in: [core/map/collision\_map.ts:76](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L76)

The per-screen collision world. Built once from a screen's static tile/
sprite colliders (indexed in a uniform spatial hash) plus a walkable
"ground" grid, then queried each frame. Live objects and characters join
as [occupants](#addoccupant) whose colliders are read
fresh (so they stay correct as objects move or change FSM state).

Everyone — walls, props, and the player — shares this one structure, so
movement, bump resolution, fall checks and interaction all read the same
precomputed world.

## Since

0.5.0

## Example

```ts
const { x, y } = screen.collision.resolve(player.box(), dx, dy, player);
player.place(x, y);
if (!screen.collision.isWalkable(x + 8, y + 14)) player.fall();
const [target] = screen.collision.owners(player.reach(), 'activation', player);
```

## Constructors

### Constructor

```ts
new CollisionMap(
   cols: number, 
   rows: number, 
   cellSize: number
): CollisionMap;
```

Defined in: [core/map/collision\_map.ts:86](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L86)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `cols` | `number` |
| `rows` | `number` |
| `cellSize` | `number` |

#### Returns

`CollisionMap`

## Properties

| Property | Modifier | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="cellsize"></a> `cellSize` | `readonly` | `number` | `undefined` | [core/map/collision\_map.ts:79](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L79) |
| <a id="cols"></a> `cols` | `readonly` | `number` | `undefined` | [core/map/collision\_map.ts:77](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L77) |
| <a id="rows"></a> `rows` | `readonly` | `number` | `undefined` | [core/map/collision\_map.ts:78](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L78) |
| <a id="cellindex"></a> `cellIndex` | `private` | `Map`\<`number`, `number`[]\> | `undefined` | [core/map/collision\_map.ts:82](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L82) |
| <a id="ground"></a> `ground` | `private` | `Uint8Array` | `undefined` | [core/map/collision\_map.ts:83](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L83) |
| <a id="occupants"></a> `occupants` | `private` | `Set`\<[`MapObject`](MapObject.md)\> | `undefined` | [core/map/collision\_map.ts:84](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L84) |
| <a id="statics"></a> `statics` | `private` | [`WorldCollider`](../interfaces/WorldCollider.md)[] | `[]` | [core/map/collision\_map.ts:81](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L81) |

## Methods

### addOccupant()

```ts
addOccupant(object: MapObject): void;
```

Defined in: [core/map/collision\_map.ts:122](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L122)

Registers a live object/character; its colliders are read each query.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `object` | [`MapObject`](MapObject.md) |

#### Returns

`void`

***

### addStatic()

```ts
addStatic(collider: WorldCollider): void;
```

Defined in: [core/map/collision\_map.ts:96](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L96)

Adds a resident collider (from a tile/sprite) to the spatial index.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `collider` | [`WorldCollider`](../interfaces/WorldCollider.md) |

#### Returns

`void`

***

### clearOccupants()

```ts
clearOccupants(): void;
```

Defined in: [core/map/collision\_map.ts:136](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L136)

Drops every occupant (e.g. when leaving the screen).

#### Returns

`void`

***

### isWalkable()

```ts
isWalkable(x: number, y: number): boolean;
```

Defined in: [core/map/collision\_map.ts:143](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L143)

Whether the world point `(x, y)` sits over walkable ground.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |

#### Returns

`boolean`

***

### overlaps()

```ts
overlaps(
   bounds: Rect, 
   layer?: string, 
   ignore?: MapObject
): boolean;
```

Defined in: [core/map/collision\_map.ts:171](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L171)

Whether anything on `layer` overlaps `bounds`.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `bounds` | [`Rect`](../interfaces/Rect.md) |
| `layer?` | `string` |
| `ignore?` | [`MapObject`](MapObject.md) |

#### Returns

`boolean`

***

### owners()

```ts
owners(
   bounds: Rect, 
   layer?: string, 
   ignore?: MapObject
): MapObject[];
```

Defined in: [core/map/collision\_map.ts:186](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L186)

Distinct owning objects whose colliders overlap `bounds`.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `bounds` | [`Rect`](../interfaces/Rect.md) |
| `layer?` | `string` |
| `ignore?` | [`MapObject`](MapObject.md) |

#### Returns

[`MapObject`](MapObject.md)[]

***

### query()

```ts
query(
   bounds: Rect, 
   layer?: string, 
   ignore?: MapObject
): WorldCollider[];
```

Defined in: [core/map/collision\_map.ts:155](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L155)

Colliders overlapping `bounds`, optionally filtered to one `layer`.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `bounds` | [`Rect`](../interfaces/Rect.md) |
| `layer?` | `string` |
| `ignore?` | [`MapObject`](MapObject.md) |

#### Returns

[`WorldCollider`](../interfaces/WorldCollider.md)[]

***

### removeOccupant()

```ts
removeOccupant(object: MapObject): void;
```

Defined in: [core/map/collision\_map.ts:129](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L129)

Unregisters a live object/character.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `object` | [`MapObject`](MapObject.md) |

#### Returns

`void`

***

### resolve()

```ts
resolve(
   box: Rect, 
   dx: number, 
   dy: number, 
   ignore?: MapObject
): {
  x: number;
  y: number;
};
```

Defined in: [core/map/collision\_map.ts:205](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L205)

Slides `box` by `(dx, dy)`, stopping at any `solid` collider (axis by
axis, so it slides along walls). Returns the resolved top-left position.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `box` | [`Rect`](../interfaces/Rect.md) | The mover's world AABB. |
| `dx` | `number` | Desired X delta this step. |
| `dy` | `number` | Desired Y delta this step. |
| `ignore?` | [`MapObject`](MapObject.md) | An owner to skip (usually the mover itself). |

#### Returns

```ts
{
  x: number;
  y: number;
}
```

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `x` | `number` | [core/map/collision\_map.ts:205](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L205) |
| `y` | `number` | [core/map/collision\_map.ts:205](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L205) |

***

### setWalkable()

```ts
setWalkable(
   col: number, 
   row: number, 
   walkable?: boolean
): void;
```

Defined in: [core/map/collision\_map.ts:112](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L112)

Marks a cell as walkable ground (or not).

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `col` | `number` | `undefined` |
| `row` | `number` | `undefined` |
| `walkable` | `boolean` | `true` |

#### Returns

`void`

***

### candidates()

```ts
private candidates(bounds: Rect, ignore?: MapObject): Iterable<WorldCollider>;
```

Defined in: [core/map/collision\_map.ts:256](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L256)

Yields candidate colliders near `bounds`: indexed statics + occupants.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `bounds` | [`Rect`](../interfaces/Rect.md) |
| `ignore?` | [`MapObject`](MapObject.md) |

#### Returns

`Iterable`\<[`WorldCollider`](../interfaces/WorldCollider.md)\>

***

### cellsOf()

```ts
private cellsOf(bounds: Rect): Iterable<number>;
```

Defined in: [core/map/collision\_map.ts:284](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L284)

Cell keys (row*cols+col) that `bounds` overlaps, clamped to the grid.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `bounds` | [`Rect`](../interfaces/Rect.md) |

#### Returns

`Iterable`\<`number`\>
