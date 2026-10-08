---
title: 'Class: CollisionSystem'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / CollisionSystem

# Class: CollisionSystem

Defined in: [subsystems/collision\_system.ts:12](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/collision_system.ts#L12)

CollisionSystem is responsible for detecting collisions between game objects.
It uses the World class to manage and detect collisions based on registered collidable objects.

## Since

0.2.0

## Implements

- [`SubSystem`](../interfaces/SubSystem.md)

## Constructors

### Constructor

```ts
new CollisionSystem(world?: World): CollisionSystem;
```

Defined in: [subsystems/collision\_system.ts:41](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/collision_system.ts#L41)

Creates a collision subsystem.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `world?` | [`World`](World.md) | Optional external [World](World.md) instance. When provided, this world is used for all collision detection. When omitted, an internal empty world is created (legacy behaviour for demos that register colliders via the world returned by this system). |

#### Returns

`CollisionSystem`

#### Since

0.4.0

#### Examples

**Using a shared world**

```ts
const world = new World();
// Register colliders on `world`, then:
engine.use(new CollisionSystem(world));
```

**Legacy (internal world)**

```ts
engine.use(new CollisionSystem());
```

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="id"></a> `id` | `public` | `string` | `'collision'` | A unique identifier for the subsystem, used for registration and management within the engine. | [subsystems/collision\_system.ts:13](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/collision_system.ts#L13) |
| <a id="order"></a> `order` | `public` | `number` | `30` | Determines the order in which subsystems are updated and rendered. Subsystems with lower order values are processed first. | [subsystems/collision\_system.ts:14](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/collision_system.ts#L14) |
| <a id="world"></a> `world` | `private` | [`World`](World.md) | `undefined` | - | [subsystems/collision\_system.ts:16](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/collision_system.ts#L16) |

## Methods

### getWorld()

```ts
getWorld(): World;
```

Defined in: [subsystems/collision\_system.ts:60](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/collision_system.ts#L60)

Returns the [World](World.md) instance used by this subsystem.

Useful when no external world was provided and callers need to
register colliders on the internal world.

#### Returns

[`World`](World.md)

#### Since

0.4.0

#### Example

```ts
const sys = new CollisionSystem();
const world = sys.getWorld();
entity.attachBehaviour(new Collidable(entity, world, { ... }));
```

***

### update()

```ts
update(): void;
```

Defined in: [subsystems/collision\_system.ts:64](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/collision_system.ts#L64)

#### Returns

`void`

#### Implementation of

[`SubSystem`](../interfaces/SubSystem.md).[`update`](../interfaces/SubSystem.md#update)
