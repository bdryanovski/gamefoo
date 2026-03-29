---
title: 'Class: PathFollower'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / PathFollower

# Class: PathFollower

Defined in: [core/behaviours/path\_follower.ts:105](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L105)

Abstract base class for all entity behaviours in the GameFoo engine.

A **behaviour** is a self-contained unit of logic (input handling,
collision response, health tracking, rendering, etc.) that can be
attached to any [Entity](Entity.md) at runtime via
[Entity.attachBehaviour](Entity.md#attachbehaviour).

Subclasses **must** implement:
- [type](Behaviour.md#type) — a unique string identifier (e.g. `"control"`, `"healthkit"`).
- [update](Behaviour.md#update) — called once per frame with `deltaTime`.

Subclasses **may** override:
- [render](Behaviour.md#render) — draw debug visuals or overlays.
- [onAttach](Behaviour.md#onattach) — setup hook when added to an entity.
- [onDetach](Behaviour.md#ondetach) — teardown hook when removed.

## Since

0.1.0

## Examples

```ts
import { Behaviour, type Entity } from "gamefoo";

class Gravity extends Behaviour<Entity> {
  readonly type = "gravity";

  update(deltaTime: number): void {
    this.owner.y += 9.8 * 60 * deltaTime;
  }
}
```

```ts
const entity = new Player("hero", 100, 100, 32, 32);
entity.attachBehaviour(new Gravity(entity));
```

## See

 - [Entity.attachBehaviour](Entity.md#attachbehaviour)
 - [Entity.detachBehaviour](Entity.md#detachbehaviour)

## Extends

- [`Behaviour`](Behaviour.md)\<[`DynamicEntity`](DynamicEntity.md)\>

## Constructors

### Constructor

```ts
new PathFollower(
   owner: DynamicEntity, 
   pathfinder: Pathfinder, 
   grid: Grid, 
   config?: PathFollowerConfig): PathFollower;
```

Defined in: [core/behaviours/path\_follower.ts:146](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L146)

Creates a new path follower behaviour.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `owner` | [`DynamicEntity`](DynamicEntity.md) | The entity this behaviour is attached to. |
| `pathfinder` | [`Pathfinder`](Pathfinder.md) | Pathfinder instance for A* computation. |
| `grid` | [`Grid`](Grid.md) | The grid being navigated. |
| `config?` | [`PathFollowerConfig`](../interfaces/PathFollowerConfig.md) | Optional movement and callback configuration. |

#### Returns

`PathFollower`

#### Since

0.4.0

#### Example

```ts
const pf = new PathFollower(npc, pathfinder, grid, {
  speed: 60,
  onPathComplete: () => console.log("Done!"),
});
npc.attachBehaviour(pf);
```

#### Overrides

[`Behaviour`](Behaviour.md).[`constructor`](Behaviour.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Description | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="enabled"></a> `enabled` | `public` | `boolean` | `true` | Whether this behaviour is currently active. Disabled behaviours are skipped during both [Entity.updateBehaviours](Entity.md#updatebehaviours) and [Entity.renderBehaviours](Entity.md#renderbehaviours). | - | [`Behaviour`](Behaviour.md).[`enabled`](Behaviour.md#enabled) | [core/behaviour.ts:92](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L92) |
| <a id="priority"></a> `priority` | `public` | `number` | `1` | Execution priority — lower numbers run first. When an entity has multiple behaviours, they are sorted by priority before each update/render pass. | - | [`Behaviour`](Behaviour.md).[`priority`](Behaviour.md#priority) | [core/behaviour.ts:82](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L82) |
| <a id="type"></a> `type` | `readonly` | `"pathfollower"` | `'pathfollower'` | Unique string identifier for this behaviour type. Used as the look-up key in [Entity.getBehaviour](Entity.md#getbehaviour) and [Entity.hasBehaviour](Entity.md#hasbehaviour). Must be a compile-time constant (`readonly`). **Example** `class Gravity extends Behaviour { readonly type = "gravity"; // ... }` | [`Behaviour`](Behaviour.md).[`type`](Behaviour.md#type) | - | [core/behaviours/path\_follower.ts:107](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L107) |
| <a id="owner"></a> `owner` | `protected` | [`DynamicEntity`](DynamicEntity.md) | `undefined` | Reference to the entity that owns this behaviour. Available to subclasses for reading and mutating entity state. | - | [`Behaviour`](Behaviour.md).[`owner`](Behaviour.md#owner) | [core/behaviour.ts:55](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L55) |
| <a id="_ismoving"></a> `_isMoving` | `private` | `boolean` | `false` | Whether the entity is actively following a path. | - | - | [core/behaviours/path\_follower.ts:125](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L125) |
| <a id="arrivalthreshold"></a> `arrivalThreshold` | `private` | `number` | `undefined` | - | - | - | [core/behaviours/path\_follower.ts:113](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L113) |
| <a id="arrivalthresholdsq"></a> `arrivalThresholdSq` | `private` | `number` | `undefined` | - | - | - | [core/behaviours/path\_follower.ts:114](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L114) |
| <a id="currentindex"></a> `currentIndex` | `private` | `number` | `0` | Index of the current waypoint being approached. | - | - | [core/behaviours/path\_follower.ts:122](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L122) |
| <a id="grid"></a> `grid` | `private` | [`Grid`](Grid.md) | `undefined` | - | - | - | [core/behaviours/path\_follower.ts:110](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L110) |
| <a id="onpathblocked"></a> `onPathBlocked?` | `private` | () => `void` | `undefined` | - | - | - | [core/behaviours/path\_follower.ts:116](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L116) |
| <a id="onpathcomplete"></a> `onPathComplete?` | `private` | () => `void` | `undefined` | - | - | - | [core/behaviours/path\_follower.ts:115](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L115) |
| <a id="path"></a> `path` | `private` | \{ `col`: `number`; `row`: `number`; \}[] | `[]` | The current computed path (array of grid waypoints). | - | - | [core/behaviours/path\_follower.ts:119](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L119) |
| <a id="pathfinder"></a> `pathfinder` | `private` | [`Pathfinder`](Pathfinder.md) | `undefined` | - | - | - | [core/behaviours/path\_follower.ts:109](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L109) |
| <a id="projection"></a> `projection` | `private` | [`IsometricProjection`](IsometricProjection.md) \| `null` | `undefined` | - | - | - | [core/behaviours/path\_follower.ts:111](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L111) |
| <a id="speed"></a> `speed` | `private` | `number` | `undefined` | - | - | - | [core/behaviours/path\_follower.ts:112](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L112) |

## Accessors

### currentPath

#### Get Signature

```ts
get currentPath(): readonly {
  col: number;
  row: number;
}[];
```

Defined in: [core/behaviours/path\_follower.ts:193](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L193)

Returns a copy of the current path waypoints.

Useful for debug visualisation.

##### Since

0.4.0

##### Example

```ts
debugSystem.setDebugPath(follower.currentPath);
```

##### Returns

readonly \{
  `col`: `number`;
  `row`: `number`;
\}[]

Array of `{ col, row }` waypoints, or empty array.

***

### isMoving

#### Get Signature

```ts
get isMoving(): boolean;
```

Defined in: [core/behaviours/path\_follower.ts:175](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L175)

Whether the entity is currently following a path.

##### Since

0.4.0

##### Example

```ts
if (follower.isMoving) {
  console.log("NPC is walking...");
}
```

##### Returns

`boolean`

***

### key

#### Get Signature

```ts
get key(): string;
```

Defined in: [core/behaviour.ts:100](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L100)

Derived look-up key, equal to [Behaviour.type](Behaviour.md#type) in lowercase.

Used internally by the entity's behaviour map so that look-ups are
case-insensitive.

##### Returns

`string`

#### Inherited from

[`Behaviour`](Behaviour.md).[`key`](Behaviour.md#key)

## Methods

### getOwner()

```ts
getOwner(): DynamicEntity;
```

Defined in: [core/behaviours/path\_follower.ts:346](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L346)

Provides access to the owner entity for external systems.

#### Returns

[`DynamicEntity`](DynamicEntity.md)

The entity this behaviour is attached to.

#### Since

0.4.0

#### Example

```ts
const entity = follower.getOwner();
console.log(entity.id);
```

***

### moveTo()

```ts
moveTo(goalCol: number, goalRow: number): boolean;
```

Defined in: [core/behaviours/path\_follower.ts:217](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L217)

Computes a path to the target grid cell and begins following it.

Returns `true` if a path was found, `false` otherwise. When the
path is blocked, `onPathBlocked` is called if configured.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `goalCol` | `number` | Destination grid column. |
| `goalRow` | `number` | Destination grid row. |

#### Returns

`boolean`

`true` if a path was computed successfully.

#### Since

0.4.0

#### Example

```ts
const success = follower.moveTo(15, 10);
if (!success) {
  console.log("Cannot reach target!");
}
```

***

### onAttach()?

```ts
optional onAttach(): void;
```

Defined in: [core/behaviour.ts:137](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L137)

Lifecycle hook called immediately after the behaviour is attached
to an entity via [Entity.attachBehaviour](Entity.md#attachbehaviour).

Use this for one-time setup such as registering with the
collision [World](World.md).

#### Returns

`void`

#### Inherited from

[`Behaviour`](Behaviour.md).[`onAttach`](Behaviour.md#onattach)

***

### onDetach()?

```ts
optional onDetach(): void;
```

Defined in: [core/behaviour.ts:145](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L145)

Lifecycle hook called when the behaviour is removed from an entity
via [Entity.detachBehaviour](Entity.md#detachbehaviour).

Use this to unregister from external systems or release resources.

#### Returns

`void`

#### Inherited from

[`Behaviour`](Behaviour.md).[`onDetach`](Behaviour.md#ondetach)

***

### render()?

```ts
optional render(ctx: RenderContext): void;
```

Defined in: [core/behaviour.ts:128](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L128)

Optional rendering hook invoked after the entity's own
[Entity.render](Entity.md#render) call.

Override this to draw debug shapes, health bars, status effects, etc.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) | The rendering context. |

#### Returns

`void`

#### Inherited from

[`Behaviour`](Behaviour.md).[`render`](Behaviour.md#render)

***

### stop()

```ts
stop(): void;
```

Defined in: [core/behaviours/path\_follower.ts:252](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L252)

Cancels the current path and stops the entity.

#### Returns

`void`

#### Since

0.4.0

#### Example

```ts
// Stop the NPC when the player approaches
follower.stop();
```

***

### update()

```ts
update(deltaTime: number): void;
```

Defined in: [core/behaviours/path\_follower.ts:265](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L265)

Called every frame. Moves the entity toward the next waypoint.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | Seconds since the last frame. |

#### Returns

`void`

#### Since

0.4.0

#### Overrides

[`Behaviour`](Behaviour.md).[`update`](Behaviour.md#update)

***

### getOwnerGridPosition()

```ts
private getOwnerGridPosition(): {
  col: number;
  row: number;
};
```

Defined in: [core/behaviours/path\_follower.ts:313](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L313)

**`Internal`**

Gets the owner's current grid position based on their world
coordinates.

#### Returns

```ts
{
  col: number;
  row: number;
}
```

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `col` | `number` | [core/behaviours/path\_follower.ts:313](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L313) |
| `row` | `number` | [core/behaviours/path\_follower.ts:313](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L313) |

***

### gridToWorld()

```ts
private gridToWorld(col: number, row: number): {
  x: number;
  y: number;
};
```

Defined in: [core/behaviours/path\_follower.ts:326](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L326)

**`Internal`**

Converts grid coordinates to world-space position using the
configured projection or orthogonal fallback.

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
| `x` | `number` | [core/behaviours/path\_follower.ts:326](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L326) |
| `y` | `number` | [core/behaviours/path\_follower.ts:326](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L326) |
