---
title: 'Class: MapObject'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / MapObject

# Class: MapObject

Defined in: [core/map/map\_object.ts:54](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L54)

Base class for every placed object driven by a [StateMachineDefinition](../interfaces/StateMachineDefinition.md)
(chests, torches, switches, enemies).

The base wires the FSM from [MapObjectContext.machine](../interfaces/MapObjectContext.md#machine), resolves
each state's `display` (a static sprite or an animation) on entry, and
draws/advances it — so an unsubclassed `MapObject` already works. Custom
classes extend this to own the machine: add timers, fire conditions in
[interact](#interact), and override the lifecycle hooks.

Instances are created when their screen becomes active and disposed when
it is left (see [Screen](Screen.md)); [onDespawn](#ondespawn)
tears the FSM down.

## Since

0.5.0

## Example

**A custom chest**

```ts
class Chest extends MapObject {
  static readonly type = "Chest";
  private opened = false;
  override interact(): boolean {
    if (this.opened) return false;
    this.opened = true;
    return this.play("open"); // by state name
  }
}
registry.register(Chest);
```

## See

 - [MapObjectRegistry](MapObjectRegistry.md)
 - [StateMachine](StateMachine.md)

## Constructors

### Constructor

```ts
new MapObject(ctx: MapObjectContext): MapObject;
```

Defined in: [core/map/map\_object.ts:109](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L109)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`MapObjectContext`](../interfaces/MapObjectContext.md) |

#### Returns

`MapObject`

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="type"></a> `type?` | `readonly` | `string` | Registry key. Override in subclasses; falls back to the object name. | [core/map/map\_object.ts:58](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L58) |
| <a id="level"></a> `level` | `readonly` | `number` | Z-layer this object lives on. | [core/map/map\_object.ts:71](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L71) |
| <a id="x"></a> `x` | `public` | `number` | Pixel X within the screen. | [core/map/map\_object.ts:63](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L63) |
| <a id="y"></a> `y` | `public` | `number` | Pixel Y within the screen. | [core/map/map\_object.ts:67](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L67) |
| <a id="assets"></a> `assets` | `readonly` | [`AssetManager`](AssetManager.md) | Shared catalog for resolving frames/clips. | [core/map/map\_object.ts:88](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L88) |
| <a id="def"></a> `def` | `readonly` | [`GameObjectDefinition`](../interfaces/GameObjectDefinition.md) | The object prefab (name, sprites, animations, meta). | [core/map/map\_object.ts:76](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L76) |
| <a id="fsm"></a> `fsm` | `readonly` | [`StateMachine`](StateMachine.md)\<`string`\> | The finite state machine this object drives. | [core/map/map\_object.ts:92](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L92) |
| <a id="machine"></a> `machine` | `readonly` | [`StateMachineDefinition`](../interfaces/StateMachineDefinition.md) | The machine definition (states + transitions). | [core/map/map\_object.ts:80](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L80) |
| <a id="properties"></a> `properties` | `readonly` | `Record`\<`string`, `string`\> | Free-form key/value config authored on the object. | [core/map/map\_object.ts:84](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L84) |
| <a id="anim"></a> `anim?` | `private` | [`AnimatedObject`](AnimatedObject.md) | Active animation for the current state, if it displays one. | [core/map/map\_object.ts:98](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L98) |
| <a id="shaders"></a> `shaders` | `private` | [`ShaderStack`](ShaderStack.md) | Screen effects attached to this object (glow, particles, …). | [core/map/map\_object.ts:107](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L107) |
| <a id="staticframe"></a> `staticFrame?` | `private` | [`Frame`](../interfaces/Frame.md) | Active static frame for the current state, if it displays one. | [core/map/map\_object.ts:102](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L102) |
| <a id="transform"></a> `transform?` | `private` | [`Transform`](../interfaces/Transform.md) | - | [core/map/map\_object.ts:94](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L94) |

## Accessors

### state

#### Get Signature

```ts
get state(): string;
```

Defined in: [core/map/map\_object.ts:136](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L136)

The current state's id.

##### Returns

`string`

## Methods

### attachShader()

```ts
attachShader<T extends Shader>(shader: T): T;
```

Defined in: [core/map/map\_object.ts:196](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L196)

Attaches a screen shader to this object; returns it for configuration.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`Shader`](Shader.md) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `shader` | `T` |

#### Returns

`T`

***

### detachShader()

```ts
detachShader(type: string): void;
```

Defined in: [core/map/map\_object.ts:217](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L217)

Detaches the shader with `type`, if present.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `string` |

#### Returns

`void`

***

### getShader()

```ts
getShader<T extends Shader>(type: string): T | undefined;
```

Defined in: [core/map/map\_object.ts:203](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L203)

The attached shader with `type`, or `undefined`.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`Shader`](Shader.md) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `string` |

#### Returns

`T` \| `undefined`

***

### hasShader()

```ts
hasShader(type: string): boolean;
```

Defined in: [core/map/map\_object.ts:210](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L210)

Whether a shader with `type` is attached.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `string` |

#### Returns

`boolean`

***

### interact()

```ts
interact(condition: string): boolean;
```

Defined in: [core/map/map\_object.ts:146](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L146)

Fires `condition`. If a transition leaves the current state on that
condition, moves to its target (and swaps the display).

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `condition` | `string` |

#### Returns

`boolean`

`true` if a transition was taken.

***

### onDespawn()

```ts
onDespawn(): void;
```

Defined in: [core/map/map\_object.ts:165](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L165)

Called once when the object's screen is left; disposes the FSM.

#### Returns

`void`

***

### onSpawn()

```ts
onSpawn(): void;
```

Defined in: [core/map/map\_object.ts:160](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L160)

Called once when the object's screen becomes active.

#### Returns

`void`

***

### render()

```ts
render(ctx: RenderContext): void;
```

Defined in: [core/map/map\_object.ts:181](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L181)

Draws the current state's display.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) |

#### Returns

`void`

***

### update()

```ts
update(_deltaTime: number): void;
```

Defined in: [core/map/map\_object.ts:173](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L173)

Advances the current animation, if any.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `_deltaTime` | `number` |

#### Returns

`void`

***

### worldColliders()

```ts
worldColliders(): WorldCollider[];
```

Defined in: [core/map/map\_object.ts:228](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L228)

This object's colliders in world (screen) pixels for its **current
state**, resolved from `collisionsByState`. Each carries its layer
(`solid`, `trigger`, …) and points back to this object as `owner`, so a
[CollisionMap](CollisionMap.md) can block movement or resolve interactions. Empty
when the current state authors none (e.g. an unlit, non-solid campfire).

#### Returns

[`WorldCollider`](../interfaces/WorldCollider.md)[]

***

### bounds()

```ts
protected bounds(): ShaderRegion;
```

Defined in: [core/map/map\_object.ts:244](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L244)

The object's bounding box, used as the region passed to shaders.

#### Returns

[`ShaderRegion`](../interfaces/ShaderRegion.md)

***

### play()

```ts
protected play(stateName: string): boolean;
```

Defined in: [core/map/map\_object.ts:261](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L261)

Transitions to a state by its authored **name**.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `stateName` | `string` |

#### Returns

`boolean`

***

### prop()

```ts
protected prop(key: string): string | undefined;
```

Defined in: [core/map/map\_object.ts:269](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L269)

Reads an authored property.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

#### Returns

`string` \| `undefined`

***

### propBool()

```ts
protected propBool(key: string): boolean;
```

Defined in: [core/map/map\_object.ts:284](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L284)

Reads an authored property as a boolean (`"true"`/`"1"` are true).

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

#### Returns

`boolean`

***

### propNumber()

```ts
protected propNumber(key: string, fallback?: number): number;
```

Defined in: [core/map/map\_object.ts:276](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L276)

Reads an authored property as a number, or `fallback` if absent/NaN.

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `key` | `string` | `undefined` |
| `fallback` | `number` | `0` |

#### Returns

`number`

***

### transition()

```ts
protected transition(stateId: string): boolean;
```

Defined in: [core/map/map\_object.ts:254](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L254)

Transitions to a state by **id**.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `stateId` | `string` |

#### Returns

`boolean`

***

### applyState()

```ts
private applyState(state: StateNodeDefinition): void;
```

Defined in: [core/map/map\_object.ts:292](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object.ts#L292)

Resolves a state's `display` into a frame or a fresh animation.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | `StateNodeDefinition` |

#### Returns

`void`
