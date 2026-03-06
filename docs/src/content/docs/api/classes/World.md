---
title: 'Class: World'
---

[**@dryanovski/gamefoo v0.0.1**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / World

# Class: World

Defined in: [core/world.ts:48](https://github.com/bdryanovski/gamefoo/blob/main/src/core/world.ts#L48)

Spatial collision-detection world.

`World` maintains a set of [Collidable](Collidable.md) behaviours and, each
frame, performs an **O(n^2)** broad-phase + narrow-phase pass via
[World.detect](#detect).  It supports:

- **Layer filtering** — only colliders on the same layer are tested.
- **Tag-based interest** — a collider only receives callbacks for
  tags it has opted into via `collidesWith`.
- **Shape combinations** — AABB vs AABB, circle vs circle, and
  circle vs AABB.
- **Solid overlap resolution** — when both colliders are marked
  `solid`, entities are pushed apart along the axis of least
  penetration.
- **Fixed bodies** — colliders flagged `fixed` are immovable; the
  other body absorbs the full push.

## Since

0.1.0

## Examples

```ts
const world = new World();

const collidable = new Collidable(entity, world, {
  shape: { type: "aabb", width: 32, height: 32 },
  layer: 0,
  tags: new Set(["enemy"]),
  solid: true,
  collidesWith: new Set(["player", "bullet"]),
});

entity.attachBehaviour(collidable); // calls world.register internally
```

```ts
world.detect(); // typically called by Engine.update each frame
```

## See

 - [Collidable](Collidable.md) — the behaviour that plugs into this world
 - [Engine](Engine.md)     — calls [World.detect](#detect) every frame

## Constructors

### Constructor

```ts
new World(): World;
```

#### Returns

`World`

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="colliders"></a> `colliders` | `private` | `Set`\<[`Collidable`](Collidable.md)\> | The live set of all registered [Collidable](Collidable.md) behaviours. | [core/world.ts:52](https://github.com/bdryanovski/gamefoo/blob/main/src/core/world.ts#L52) |

## Methods

### detect()

```ts
detect(): void;
```

Defined in: [core/world.ts:92](https://github.com/bdryanovski/gamefoo/blob/main/src/core/world.ts#L92)

Runs one full collision-detection pass over every registered
collider.

**Algorithm:**

1. Iterate all unique pairs `(i, j)` where `i < j`.
2. Skip disabled colliders or mismatched layers.
3. Check tag interest in both directions.
4. Compute world bounds and test intersection.
5. If both are `solid`, resolve the overlap.
6. Fire `onCollision` callbacks on interested sides.

#### Returns

`void`

#### Since

0.1.0

***

### register()

```ts
register(collider: Collidable): void;
```

Defined in: [core/world.ts:62](https://github.com/bdryanovski/gamefoo/blob/main/src/core/world.ts#L62)

Adds a collider to the world so it participates in future
[World.detect](#detect) passes.

Called automatically by [Collidable.onAttach](Collidable.md#onattach).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `collider` | [`Collidable`](Collidable.md) | The collidable behaviour to register. |

#### Returns

`void`

***

### unregister()

```ts
unregister(collider: Collidable): void;
```

Defined in: [core/world.ts:73](https://github.com/bdryanovski/gamefoo/blob/main/src/core/world.ts#L73)

Removes a collider from the world.

Called automatically by [Collidable.onDetach](Collidable.md#ondetach).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `collider` | [`Collidable`](Collidable.md) | The collidable behaviour to remove. |

#### Returns

`void`

***

### aabbVSAabb()

```ts
private aabbVSAabb(a: WorldBounds, b: WorldBounds): boolean;
```

Defined in: [core/world.ts:225](https://github.com/bdryanovski/gamefoo/blob/main/src/core/world.ts#L225)

**`Internal`**

AABB-vs-AABB overlap test.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `a` | `WorldBounds` | First bounding rectangle. |
| `b` | `WorldBounds` | Second bounding rectangle. |

#### Returns

`boolean`

`true` if the rectangles overlap.

***

### circleVSAAabb()

```ts
private circleVSAAabb(
   circle: Collidable, 
   circleBounds: WorldBounds, 
   rect: WorldBounds): boolean;
```

Defined in: [core/world.ts:268](https://github.com/bdryanovski/gamefoo/blob/main/src/core/world.ts#L268)

**`Internal`**

Circle-vs-AABB overlap test. Finds the closest point on the
rectangle to the circle centre and checks the squared distance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `circle` | [`Collidable`](Collidable.md) | The collidable with a `circle` shape. |
| `circleBounds` | `WorldBounds` | World bounds of the circle collider. |
| `rect` | `WorldBounds` | World bounds of the AABB collider. |

#### Returns

`boolean`

`true` if the circle and rectangle overlap.

***

### circleVSCircle()

```ts
private circleVSCircle(
   a: Collidable, 
   boundsA: WorldBounds, 
   b: Collidable, 
   boundsB: WorldBounds): boolean;
```

Defined in: [core/world.ts:241](https://github.com/bdryanovski/gamefoo/blob/main/src/core/world.ts#L241)

**`Internal`**

Circle-vs-circle overlap test using squared-distance comparison
(avoids `Math.sqrt`).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `a` | [`Collidable`](Collidable.md) | First collidable (must have `circle` shape). |
| `boundsA` | `WorldBounds` | World bounds of `a`. |
| `b` | [`Collidable`](Collidable.md) | Second collidable (must have `circle` shape). |
| `boundsB` | `WorldBounds` | World bounds of `b`. |

#### Returns

`boolean`

`true` if the circles overlap.

***

### intersects()

```ts
private intersects(
   a: Collidable, 
   boundsA: WorldBounds, 
   b: Collidable, 
   boundsB: WorldBounds): boolean;
```

Defined in: [core/world.ts:199](https://github.com/bdryanovski/gamefoo/blob/main/src/core/world.ts#L199)

**`Internal`**

Dispatches to the correct narrow-phase test based on collider
shape types.

Supports AABB-vs-AABB, circle-vs-circle, and circle-vs-AABB.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `a` | [`Collidable`](Collidable.md) | First collidable. |
| `boundsA` | `WorldBounds` | World bounds of `a`. |
| `b` | [`Collidable`](Collidable.md) | Second collidable. |
| `boundsB` | `WorldBounds` | World bounds of `b`. |

#### Returns

`boolean`

`true` if the two shapes overlap.

***

### resolveOverlap()

```ts
private resolveOverlap(
   a: Collidable, 
   boundsA: WorldBounds, 
   b: Collidable, 
   boundsB: WorldBounds): void;
```

Defined in: [core/world.ts:298](https://github.com/bdryanovski/gamefoo/blob/main/src/core/world.ts#L298)

**`Internal`**

Resolves positional overlap between two solid colliders by pushing
their owning entities apart along the axis of minimum penetration.

Respects the `fixed` flag: if one collider is fixed the other
absorbs the full displacement; if both are fixed, no resolution
occurs.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `a` | [`Collidable`](Collidable.md) | First collidable. |
| `boundsA` | `WorldBounds` | World bounds of `a`. |
| `b` | [`Collidable`](Collidable.md) | Second collidable. |
| `boundsB` | `WorldBounds` | World bounds of `b`. |

#### Returns

`void`

***

### tagsOverlap()

```ts
private tagsOverlap(wants: Set<string>, has: Set<string>): boolean;
```

Defined in: [core/world.ts:178](https://github.com/bdryanovski/gamefoo/blob/main/src/core/world.ts#L178)

**`Internal`**

Returns `true` if any tag in `wants` exists in `has`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `wants` | `Set`\<`string`\> | Tags the collider is interested in. |
| `has` | `Set`\<`string`\> | Tags the other collider owns. |

#### Returns

`boolean`

Whether at least one tag overlaps.
