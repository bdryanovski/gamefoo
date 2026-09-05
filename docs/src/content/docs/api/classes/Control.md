---
title: 'Class: Control'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Control

# Class: Control

Defined in: [core/behaviours/control.ts:50](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/control.ts#L50)

Keyboard and gamepad driven movement behaviour.

## Since

0.1.0

## Extends

- [`Behaviour`](Behaviour.md)\<[`DynamicEntity`](DynamicEntity.md)\>

## Constructors

### Constructor

```ts
new Control(
   owner: DynamicEntity, 
   input: Input, 
   scheme?: ControlScheme
): Control;
```

Defined in: [core/behaviours/control.ts:91](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/control.ts#L91)

Creates a new control behaviour.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `owner` | [`DynamicEntity`](DynamicEntity.md) | `undefined` | The dynamic entity whose velocity will be updated. |
| `input` | [`Input`](Input.md) | `undefined` | The [Input](Input.md) instance to read input from. |
| `scheme` | [`ControlScheme`](../interfaces/ControlScheme.md) | `CONTROL_SCHEMES.DEFAULT` | The control scheme to use (default: DEFAULT). |

#### Returns

`Control`

#### Since

0.1.0 (scheme parameter added in 0.5.0)

#### Example

```ts
// Default controls (WASD + arrows)
player.attachBehaviour(new Control(player, input));

// NES-style controls
player.attachBehaviour(new Control(player, input, CONTROL_SCHEMES.NES));

// PICO-8 controls
player.attachBehaviour(new Control(player, input, CONTROL_SCHEMES.PICO8));
```

#### Overrides

[`Behaviour`](Behaviour.md).[`constructor`](Behaviour.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Description | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="enabled"></a> `enabled` | `public` | `boolean` | `true` | Whether this behaviour is currently active. Disabled behaviours are skipped during both [Entity.updateBehaviours](Entity.md#updatebehaviours) and [Entity.renderBehaviours](Entity.md#renderbehaviours). | - | [`Behaviour`](Behaviour.md).[`enabled`](Behaviour.md#enabled) | [core/behaviour.ts:94](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L94) |
| <a id="priority"></a> `priority` | `public` | `number` | `1` | Execution priority — lower numbers run first. When an entity has multiple behaviours, they are sorted by priority before each update/render pass. | - | [`Behaviour`](Behaviour.md).[`priority`](Behaviour.md#priority) | [core/behaviour.ts:84](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L84) |
| <a id="type"></a> `type` | `readonly` | `"control"` | `'control'` | Unique string identifier for this behaviour type. Used as the look-up key in [Entity.getBehaviour](Entity.md#getbehaviour) and [Entity.hasBehaviour](Entity.md#hasbehaviour). Must be a compile-time constant (`readonly`). **Example** `class Gravity extends Behaviour { readonly type = "gravity"; // ... }` | [`Behaviour`](Behaviour.md).[`type`](Behaviour.md#type) | - | [core/behaviours/control.ts:54](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/control.ts#L54) |
| <a id="owner"></a> `owner` | `protected` | [`DynamicEntity`](DynamicEntity.md) | `undefined` | Reference to the entity that owns this behaviour. Available to subclasses for reading and mutating entity state. | - | [`Behaviour`](Behaviour.md).[`owner`](Behaviour.md#owner) | [core/behaviour.ts:57](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L57) |
| <a id="mapper"></a> `mapper` | `private` | [`InputMapper`](InputMapper.md) | `undefined` | Input mapper for action-based queries. **Since** 0.5.0 | - | - | [core/behaviours/control.ts:61](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/control.ts#L61) |
| <a id="speed"></a> `speed` | `private` | `number` | `500` | Movement speed in pixels per second. | - | - | [core/behaviours/control.ts:68](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/control.ts#L68) |

## Accessors

### key

#### Get Signature

```ts
get key(): string;
```

Defined in: [core/behaviour.ts:102](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L102)

Derived look-up key, equal to [Behaviour.type](Behaviour.md#type) in lowercase.

Used internally by the entity's behaviour map so that look-ups are
case-insensitive.

##### Returns

`string`

#### Inherited from

[`Behaviour`](Behaviour.md).[`key`](Behaviour.md#key)

## Methods

### getMapper()

```ts
getMapper(): InputMapper;
```

Defined in: [core/behaviours/control.ts:145](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/control.ts#L145)

Gets the InputMapper for advanced input queries.

Use this to check action buttons or access the control scheme.

#### Returns

[`InputMapper`](InputMapper.md)

The InputMapper instance

#### Since

0.5.0

#### Example

```ts
const control = player.getBehaviour('control') as Control;
const mapper = control.getMapper();

if (mapper.isAction('PRIMARY')) {
  player.jump();
}
```

***

### getOwner()

```ts
getOwner(): DynamicEntity;
```

Defined in: [core/behaviour.ts:122](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L122)

Returns the entity this behaviour is attached to.

#### Returns

[`DynamicEntity`](DynamicEntity.md)

The owning entity.

#### Since

0.4.0

#### Inherited from

[`Behaviour`](Behaviour.md).[`getOwner`](Behaviour.md#getowner)

***

### getScheme()

```ts
getScheme(): ControlScheme;
```

Defined in: [core/behaviours/control.ts:173](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/control.ts#L173)

Gets the current control scheme.

#### Returns

[`ControlScheme`](../interfaces/ControlScheme.md)

The current ControlScheme

#### Since

0.5.0

***

### getSpeed()

```ts
getSpeed(): number;
```

Defined in: [core/behaviours/control.ts:195](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/control.ts#L195)

Gets the current movement speed.

#### Returns

`number`

Speed in pixels per second

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

#### Inherited from

[`Behaviour`](Behaviour.md).[`onAttach`](Behaviour.md#onattach)

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

#### Inherited from

[`Behaviour`](Behaviour.md).[`onDetach`](Behaviour.md#ondetach)

***

### render()?

```ts
optional render(ctx: RenderContext): void;
```

Defined in: [core/behaviour.ts:146](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L146)

Optional rendering hook invoked after the entity's own
[Entity.render](DynamicEntity.md#render) call.

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

### setScheme()

```ts
setScheme(scheme: ControlScheme): void;
```

Defined in: [core/behaviours/control.ts:162](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/control.ts#L162)

Changes the control scheme.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `scheme` | [`ControlScheme`](../interfaces/ControlScheme.md) | The new control scheme to use |

#### Returns

`void`

#### Since

0.5.0

#### Example

```ts
// Switch to SNES controls
control.setScheme(CONTROL_SCHEMES.SNES);
```

***

### setSpeed()

```ts
setSpeed(speed: number): void;
```

Defined in: [core/behaviours/control.ts:184](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/control.ts#L184)

Sets the movement speed.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `speed` | `number` | Speed in pixels per second |

#### Returns

`void`

#### Since

0.5.0

***

### update()

```ts
update(_deltaTime: number): void;
```

Defined in: [core/behaviours/control.ts:113](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/control.ts#L113)

Reads the current input state and moves the owner entity.

Uses the control scheme's directional actions (UP, DOWN, LEFT, RIGHT)
to determine movement. Supports both keyboard and gamepad input.

Diagonal input is normalised so the effective speed remains
constant regardless of direction.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `_deltaTime` | `number` | Seconds elapsed since the previous frame (unused). |

#### Returns

`void`

#### Since

0.1.0

#### Overrides

[`Behaviour`](Behaviour.md).[`update`](Behaviour.md#update)
