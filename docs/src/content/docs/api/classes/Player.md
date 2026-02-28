---
title: 'Class: Player'
---

[**@dryanovski/gamefoo v0.0.1**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Player

# Class: Player

Defined in: [entities/player.ts:5](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/player.ts#L5)

## Extends

- [`DynamicEntity`](DynamicEntity.md)

## Constructors

### Constructor

```ts
new Player(
   id: string, 
   x: number, 
   y: number, 
   width: number, 
   height: number): Player;
```

Defined in: [entities/entity.ts:28](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L28)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `x` | `number` |
| `y` | `number` |
| `width` | `number` |
| `height` | `number` |

#### Returns

`Player`

#### Inherited from

[`DynamicEntity`](DynamicEntity.md).[`constructor`](DynamicEntity.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="id"></a> `id` | `public` | `string` | `""` | [`DynamicEntity`](DynamicEntity.md).[`id`](DynamicEntity.md#id) | [entities/entity.ts:5](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L5) |
| <a id="position"></a> `position` | `protected` | [`Vector2`](../interfaces/Vector2.md) | `undefined` | [`DynamicEntity`](DynamicEntity.md).[`position`](DynamicEntity.md#position) | [entities/entity.ts:6](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L6) |
| <a id="size"></a> `size` | `protected` | \{ `height`: `number`; `width`: `number`; \} | `undefined` | [`DynamicEntity`](DynamicEntity.md).[`size`](DynamicEntity.md#size) | [entities/entity.ts:7](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L7) |
| `size.height` | `public` | `number` | `0` | - | [entities/entity.ts:7](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L7) |
| `size.width` | `public` | `number` | `0` | - | [entities/entity.ts:7](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L7) |
| <a id="speed"></a> `speed` | `protected` | `number` | `0` | [`DynamicEntity`](DynamicEntity.md).[`speed`](DynamicEntity.md#speed) | [entities/dynamic\_entity.ts:6](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/dynamic_entity.ts#L6) |
| <a id="velocity"></a> `velocity` | `protected` | [`Vector2`](../interfaces/Vector2.md) | `undefined` | [`DynamicEntity`](DynamicEntity.md).[`velocity`](DynamicEntity.md#velocity) | [entities/dynamic\_entity.ts:5](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/dynamic_entity.ts#L5) |

## Accessors

### control

#### Get Signature

```ts
get control(): Control | undefined;
```

Defined in: [entities/player.ts:6](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/player.ts#L6)

##### Returns

[`Control`](Control.md) \| `undefined`

***

### healthkit

#### Get Signature

```ts
get healthkit(): HealthKit | undefined;
```

Defined in: [entities/player.ts:10](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/player.ts#L10)

##### Returns

[`HealthKit`](HealthKit.md) \| `undefined`

***

### x

#### Get Signature

```ts
get x(): number;
```

Defined in: [entities/entity.ts:12](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L12)

##### Returns

`number`

#### Set Signature

```ts
set x(value: number): void;
```

Defined in: [entities/entity.ts:16](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L16)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`DynamicEntity`](DynamicEntity.md).[`x`](DynamicEntity.md#x)

***

### y

#### Get Signature

```ts
get y(): number;
```

Defined in: [entities/entity.ts:20](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L20)

##### Returns

`number`

#### Set Signature

```ts
set y(value: number): void;
```

Defined in: [entities/entity.ts:24](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L24)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`DynamicEntity`](DynamicEntity.md).[`y`](DynamicEntity.md#y)

***

### behaviors

#### Get Signature

```ts
get private behaviors(): Behaviour<Entity>[];
```

Defined in: [entities/entity.ts:78](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L78)

##### Returns

[`Behaviour`](Behaviour.md)\<[`Entity`](Entity.md)\>[]

#### Inherited from

[`DynamicEntity`](DynamicEntity.md).[`behaviors`](DynamicEntity.md#behaviors)

## Methods

### attachBehaviour()

```ts
attachBehaviour<T>(behavior: T): T;
```

Defined in: [entities/entity.ts:57](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L57)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`Behaviour`](Behaviour.md)\<[`Entity`](Entity.md)\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `behavior` | `T` |

#### Returns

`T`

#### Inherited from

[`DynamicEntity`](DynamicEntity.md).[`attachBehaviour`](DynamicEntity.md#attachbehaviour)

***

### detachBehaviour()

```ts
detachBehaviour(key: string): void;
```

Defined in: [entities/entity.ts:67](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L67)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

#### Returns

`void`

#### Inherited from

[`DynamicEntity`](DynamicEntity.md).[`detachBehaviour`](DynamicEntity.md#detachbehaviour)

***

### getBehaviour()

```ts
getBehaviour<T>(key: string): T | undefined;
```

Defined in: [entities/entity.ts:45](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L45)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`Behaviour`](Behaviour.md)\<[`Entity`](Entity.md)\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

#### Returns

`T` \| `undefined`

#### Inherited from

[`DynamicEntity`](DynamicEntity.md).[`getBehaviour`](DynamicEntity.md#getbehaviour)

***

### getBehavioursByType()

```ts
getBehavioursByType<T>(type: (...args: any[]) => T): T[];
```

Defined in: [entities/entity.ts:49](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L49)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`Behaviour`](Behaviour.md)\<[`Entity`](Entity.md)\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | (...`args`: `any`[]) => `T` |

#### Returns

`T`[]

#### Inherited from

[`DynamicEntity`](DynamicEntity.md).[`getBehavioursByType`](DynamicEntity.md#getbehavioursbytype)

***

### getPosition()

```ts
getPosition(): Vector2;
```

Defined in: [entities/entity.ts:37](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L37)

#### Returns

[`Vector2`](../interfaces/Vector2.md)

#### Inherited from

[`DynamicEntity`](DynamicEntity.md).[`getPosition`](DynamicEntity.md#getposition)

***

### getSize()

```ts
getSize(): {
  height: number;
  width: number;
};
```

Defined in: [entities/entity.ts:41](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L41)

#### Returns

```ts
{
  height: number;
  width: number;
}
```

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [entities/entity.ts:41](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L41) |
| `width` | `number` | [entities/entity.ts:41](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L41) |

#### Inherited from

[`DynamicEntity`](DynamicEntity.md).[`getSize`](DynamicEntity.md#getsize)

***

### getSpeed()

```ts
getSpeed(): number;
```

Defined in: [entities/dynamic\_entity.ts:20](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/dynamic_entity.ts#L20)

#### Returns

`number`

#### Inherited from

[`DynamicEntity`](DynamicEntity.md).[`getSpeed`](DynamicEntity.md#getspeed)

***

### getVelocity()

```ts
getVelocity(): Vector2;
```

Defined in: [entities/dynamic\_entity.ts:12](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/dynamic_entity.ts#L12)

#### Returns

[`Vector2`](../interfaces/Vector2.md)

#### Inherited from

[`DynamicEntity`](DynamicEntity.md).[`getVelocity`](DynamicEntity.md#getvelocity)

***

### hasBehaviour()

```ts
hasBehaviour(key: string): boolean;
```

Defined in: [entities/entity.ts:53](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L53)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

#### Returns

`boolean`

#### Inherited from

[`DynamicEntity`](DynamicEntity.md).[`hasBehaviour`](DynamicEntity.md#hasbehaviour)

***

### render()

```ts
render(ctx: CanvasRenderingContext2D): void;
```

Defined in: [entities/player.ts:18](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/player.ts#L18)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | `CanvasRenderingContext2D` |

#### Returns

`void`

#### Overrides

[`DynamicEntity`](DynamicEntity.md).[`render`](DynamicEntity.md#render)

***

### setSpeed()

```ts
setSpeed(speed: number): void;
```

Defined in: [entities/dynamic\_entity.ts:16](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/dynamic_entity.ts#L16)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `speed` | `number` |

#### Returns

`void`

#### Inherited from

[`DynamicEntity`](DynamicEntity.md).[`setSpeed`](DynamicEntity.md#setspeed)

***

### setVelocity()

```ts
setVelocity(velocity: Vector2): void;
```

Defined in: [entities/dynamic\_entity.ts:8](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/dynamic_entity.ts#L8)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `velocity` | [`Vector2`](../interfaces/Vector2.md) |

#### Returns

`void`

#### Inherited from

[`DynamicEntity`](DynamicEntity.md).[`setVelocity`](DynamicEntity.md#setvelocity)

***

### update()

```ts
update(deltaTime: number): void;
```

Defined in: [entities/player.ts:14](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/player.ts#L14)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |

#### Returns

`void`

#### Overrides

[`DynamicEntity`](DynamicEntity.md).[`update`](DynamicEntity.md#update)

***

### renderBehaviours()

```ts
protected renderBehaviours(ctx: CanvasRenderingContext2D): void;
```

Defined in: [entities/entity.ts:95](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L95)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | `CanvasRenderingContext2D` |

#### Returns

`void`

#### Inherited from

[`DynamicEntity`](DynamicEntity.md).[`renderBehaviours`](DynamicEntity.md#renderbehaviours)

***

### updateBehaviours()

```ts
protected updateBehaviours(deltaTime: number): void;
```

Defined in: [entities/entity.ts:87](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L87)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |

#### Returns

`void`

#### Inherited from

[`DynamicEntity`](DynamicEntity.md).[`updateBehaviours`](DynamicEntity.md#updatebehaviours)
