---
title: 'Class: HealthKit'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / HealthKit

# Class: HealthKit

Defined in: [core/behaviours/healtkit.ts:37](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/healtkit.ts#L37)

Health-tracking behaviour for a [Entity](Entity.md).

`HealthKit` manages a current and maximum HP value, provides damage
and healing methods, and exposes queries for health percentage and
death state.

## Since

0.1.0

## Examples

```ts
import { HealthKit, Player } from "gamefoo";

const player = new Player("hero", 400, 300, 50, 50);
player.attachBehaviour(new HealthKit(player, 100));

player.healthkit?.takeDamage(25);
console.log(player.healthkit?.getHealth());        // 75
console.log(player.healthkit?.getHealthPercent());  // 0.75
```

```ts
const hk = new HealthKit(entity, 50, 200);
// starts at 50 HP, max is 200
hk.heal(999);
console.log(hk.getHealth()); // 200 (clamped to max)
```

## See

 - [Behaviour](Behaviour.md) — abstract base class
 - [Player](Player.md)    — has a convenience getter for this behaviour

## Extends

- [`Behaviour`](Behaviour.md)\<[`Entity`](Entity.md)\>

## Constructors

### Constructor

```ts
new HealthKit(
   owner: Entity, 
   health: number, 
   maxHP?: number): HealthKit;
```

Defined in: [core/behaviours/healtkit.ts:55](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/healtkit.ts#L55)

Creates a new health behaviour.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `owner` | [`Entity`](Entity.md) | The entity this behaviour is attached to. |
| `health` | `number` | Starting health value. |
| `maxHP?` | `number` | Maximum health cap. If omitted, defaults to the initial `health` value. |

#### Returns

`HealthKit`

#### Overrides

[`Behaviour`](Behaviour.md).[`constructor`](Behaviour.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Description | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="enabled"></a> `enabled` | `public` | `boolean` | `true` | Whether this behaviour is currently active. Disabled behaviours are skipped during both [Entity.updateBehaviours](Entity.md#updatebehaviours) and [Entity.renderBehaviours](Entity.md#renderbehaviours). | - | [`Behaviour`](Behaviour.md).[`enabled`](Behaviour.md#enabled) | [core/behaviour.ts:92](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L92) |
| <a id="priority"></a> `priority` | `public` | `number` | `1` | Execution priority — lower numbers run first. When an entity has multiple behaviours, they are sorted by priority before each update/render pass. | - | [`Behaviour`](Behaviour.md).[`priority`](Behaviour.md#priority) | [core/behaviour.ts:82](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L82) |
| <a id="type"></a> `type` | `readonly` | `"healthkit"` | `'healthkit'` | Unique string identifier for this behaviour type. Used as the look-up key in [Entity.getBehaviour](Entity.md#getbehaviour) and [Entity.hasBehaviour](Entity.md#hasbehaviour). Must be a compile-time constant (`readonly`). **Example** `class Gravity extends Behaviour { readonly type = "gravity"; // ... }` | [`Behaviour`](Behaviour.md).[`type`](Behaviour.md#type) | - | [core/behaviours/healtkit.ts:39](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/healtkit.ts#L39) |
| <a id="owner"></a> `owner` | `protected` | [`Entity`](Entity.md) | `undefined` | Reference to the entity that owns this behaviour. Available to subclasses for reading and mutating entity state. | - | [`Behaviour`](Behaviour.md).[`owner`](Behaviour.md#owner) | [core/behaviour.ts:55](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L55) |
| <a id="health"></a> `health` | `private` | `number` | `undefined` | Current health points. | - | - | [core/behaviours/healtkit.ts:42](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/healtkit.ts#L42) |
| <a id="maxhp"></a> `maxHP` | `private` | `number` | `undefined` | Maximum health points (healing cap). | - | - | [core/behaviours/healtkit.ts:45](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/healtkit.ts#L45) |

## Accessors

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

### getHealth()

```ts
getHealth(): number;
```

Defined in: [core/behaviours/healtkit.ts:102](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/healtkit.ts#L102)

Returns the current health value.

#### Returns

`number`

Current HP.

***

### getHealthPercent()

```ts
getHealthPercent(): number;
```

Defined in: [core/behaviours/healtkit.ts:163](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/healtkit.ts#L163)

Returns health as a normalised ratio in the range `[0, 1]`.

Useful for rendering health bars.

#### Returns

`number`

`health / maxHP`, or `0` if `maxHP` is zero.

#### Example

```ts
const barWidth = 100 * healthkit.getHealthPercent();
ctx.fillRect(x, y, barWidth, 8);
```

***

### getMaxHealth()

```ts
getMaxHealth(): number;
```

Defined in: [core/behaviours/healtkit.ts:111](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/healtkit.ts#L111)

Returns the maximum health cap.

#### Returns

`number`

Maximum HP.

***

### heal()

```ts
heal(amount: number): void;
```

Defined in: [core/behaviours/healtkit.ts:93](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/healtkit.ts#L93)

Increases health by the given amount, clamping at
[HealthKit.maxHP](#maxhp).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `amount` | `number` | Health to restore (positive number). |

#### Returns

`void`

#### Example

```ts
healthkit.heal(50);
```

***

### isDead()

```ts
isDead(): boolean;
```

Defined in: [core/behaviours/healtkit.ts:146](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/healtkit.ts#L146)

Whether the entity is dead (health is zero or below).

#### Returns

`boolean`

`true` if `health <= 0`.

#### Example

```ts
if (healthkit.isDead()) {
  entity.destroy();
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

### setMaxHealth()

```ts
setMaxHealth(value: number): void;
```

Defined in: [core/behaviours/healtkit.ts:127](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/healtkit.ts#L127)

Updates the maximum health cap.

If the current health exceeds the new cap it is clamped down.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | The new maximum HP. |

#### Returns

`void`

#### Example

```ts
healthkit.setMaxHealth(150);
```

***

### takeDamage()

```ts
takeDamage(amount: number): void;
```

Defined in: [core/behaviours/healtkit.ts:78](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/healtkit.ts#L78)

Reduces health by the given amount, clamping at zero.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `amount` | `number` | Damage to apply (positive number). |

#### Returns

`void`

#### Example

```ts
healthkit.takeDamage(30);
```

***

### update()

```ts
update(_deltaTime: number): void;
```

Defined in: [core/behaviours/healtkit.ts:66](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/healtkit.ts#L66)

No-op — health does not change passively each frame.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `_deltaTime` | `number` | Unused. |

#### Returns

`void`

#### Overrides

[`Behaviour`](Behaviour.md).[`update`](Behaviour.md#update)
