---
title: 'Abstract Class: Behaviour<T>'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Behaviour

# Abstract Class: Behaviour\<T\>

Defined in: [core/behaviour.ts:52](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L52)

Abstract base class for all entity behaviours in the GameFoo engine.

A **behaviour** is a self-contained unit of logic (input handling,
collision response, health tracking, rendering, etc.) that can be
attached to any [Entity](Entity.md) at runtime via
[Entity.attachBehaviour](Entity.md#attachbehaviour).

Subclasses **must** implement:
- [type](#type) — a unique string identifier (e.g. `"control"`, `"healthkit"`).

Subclasses **may** override:
- [update](#update) — called once per frame with `deltaTime`.

Subclasses **may** override:
- [render](#render) — draw debug visuals or overlays.
- [onAttach](#onattach) — setup hook when added to an entity.
- [onDetach](#ondetach) — teardown hook when removed.

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

## Extended by

- [`Collidable`](Collidable.md)
- [`Control`](Control.md)
- [`HealthKit`](HealthKit.md)
- [`PathFollower`](PathFollower.md)
- [`SpriteRender`](SpriteRender.md)
- [`TerminalRender`](TerminalRender.md)

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `T` *extends* [`Entity`](Entity.md) | [`Entity`](Entity.md) | The entity type this behaviour operates on. Defaults to [Entity](Entity.md); narrow it to [DynamicEntity](DynamicEntity.md) or [Player](Player.md) when the behaviour needs velocity, speed, etc. |

## Constructors

### Constructor

```ts
new Behaviour<T>(owner: T): Behaviour<T>;
```

Defined in: [core/behaviour.ts:111](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L111)

Creates a new behaviour bound to the given entity.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `owner` | `T` | The entity this behaviour will operate on. |

#### Returns

`Behaviour`\<`T`\>

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="enabled"></a> `enabled` | `public` | `boolean` | `true` | Whether this behaviour is currently active. Disabled behaviours are skipped during both [Entity.updateBehaviours](Entity.md#updatebehaviours) and [Entity.renderBehaviours](Entity.md#renderbehaviours). | [core/behaviour.ts:94](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L94) |
| <a id="priority"></a> `priority` | `public` | `number` | `1` | Execution priority — lower numbers run first. When an entity has multiple behaviours, they are sorted by priority before each update/render pass. | [core/behaviour.ts:84](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L84) |
| <a id="type"></a> `type` | `abstract` | `string` | `undefined` | Unique string identifier for this behaviour type. Used as the look-up key in [Entity.getBehaviour](Entity.md#getbehaviour) and [Entity.hasBehaviour](Entity.md#hasbehaviour). Must be a compile-time constant (`readonly`). **Example** `class Gravity extends Behaviour { readonly type = "gravity"; // ... }` | [core/behaviour.ts:74](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L74) |
| <a id="owner"></a> `owner` | `protected` | `T` | `undefined` | Reference to the entity that owns this behaviour. Available to subclasses for reading and mutating entity state. | [core/behaviour.ts:57](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L57) |

## Accessors

### key

#### Get Signature

```ts
get key(): string;
```

Defined in: [core/behaviour.ts:102](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L102)

Derived look-up key, equal to [Behaviour.type](#type) in lowercase.

Used internally by the entity's behaviour map so that look-ups are
case-insensitive.

##### Returns

`string`

## Methods

### getOwner()

```ts
getOwner(): T;
```

Defined in: [core/behaviour.ts:122](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L122)

Returns the entity this behaviour is attached to.

#### Returns

`T`

The owning entity.

#### Since

0.5.0

***

### onAttach()?

```ts
optional onAttach(): void;
```

Defined in: [core/behaviour.ts:155](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L155)

Lifecycle hook called immediately after the behaviour is attached
to an entity via [Entity.attachBehaviour](Entity.md#attachbehaviour).

Use this for one-time setup such as registering with the
collision [World](World.md).

#### Returns

`void`

***

### onDetach()?

```ts
optional onDetach(): void;
```

Defined in: [core/behaviour.ts:163](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L163)

Lifecycle hook called when the behaviour is removed from an entity
via [Entity.detachBehaviour](Entity.md#detachbehaviour).

Use this to unregister from external systems or release resources.

#### Returns

`void`

***

### render()?

```ts
optional render(ctx: RenderContext): void;
```

Defined in: [core/behaviour.ts:146](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L146)

Optional rendering hook invoked after the entity's own
[Entity.render](Entity.md#render) call.

Override this to draw debug shapes, health bars, status effects, etc.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) | The rendering context. |

#### Returns

`void`

***

### update()

```ts
update(_deltaTime: number): void;
```

Defined in: [core/behaviour.ts:136](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L136)

Called once per frame to advance this behaviour's logic.

Override in subclasses that need per-frame logic. Behaviours that
are purely reactive (collision, health, terminal render) can omit
this — the default is a no-op.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `_deltaTime` | `number` | Seconds elapsed since the previous frame. |

#### Returns

`void`
