---
title: 'Abstract Class: DynamicEntity'
---

[**@dryanovski/gamefoo v0.0.1**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / DynamicEntity

# Abstract Class: DynamicEntity

Defined in: [entities/dynamic\_entity.ts:4](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/dynamic_entity.ts#L4)

## Extends

- [`Entity`](Entity.md)

## Extended by

- [`Player`](Player.md)

## Constructors

### Constructor

```ts
new DynamicEntity(
   id: string, 
   x: number, 
   y: number, 
   width: number, 
   height: number): DynamicEntity;
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

`DynamicEntity`

#### Inherited from

[`Entity`](Entity.md).[`constructor`](Entity.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="id"></a> `id` | `public` | `string` | `""` | [`Entity`](Entity.md).[`id`](Entity.md#id) | [entities/entity.ts:5](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L5) |
| <a id="position"></a> `position` | `protected` | [`Vector2`](../interfaces/Vector2.md) | `undefined` | [`Entity`](Entity.md).[`position`](Entity.md#position) | [entities/entity.ts:6](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L6) |
| <a id="size"></a> `size` | `protected` | \{ `height`: `number`; `width`: `number`; \} | `undefined` | [`Entity`](Entity.md).[`size`](Entity.md#size) | [entities/entity.ts:7](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L7) |
| `size.height` | `public` | `number` | `0` | - | [entities/entity.ts:7](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L7) |
| `size.width` | `public` | `number` | `0` | - | [entities/entity.ts:7](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L7) |
| <a id="speed"></a> `speed` | `protected` | `number` | `0` | - | [entities/dynamic\_entity.ts:6](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/dynamic_entity.ts#L6) |
| <a id="velocity"></a> `velocity` | `protected` | [`Vector2`](../interfaces/Vector2.md) | `undefined` | - | [entities/dynamic\_entity.ts:5](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/dynamic_entity.ts#L5) |

## Accessors

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

[`Player`](Player.md).[`x`](Player.md#x)

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

[`Player`](Player.md).[`y`](Player.md#y)

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

[`Entity`](Entity.md).[`behaviors`](Entity.md#behaviors)

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

[`Entity`](Entity.md).[`attachBehaviour`](Entity.md#attachbehaviour)

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

[`Entity`](Entity.md).[`detachBehaviour`](Entity.md#detachbehaviour)

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

[`Entity`](Entity.md).[`getBehaviour`](Entity.md#getbehaviour)

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

[`Entity`](Entity.md).[`getBehavioursByType`](Entity.md#getbehavioursbytype)

***

### getPosition()

```ts
getPosition(): Vector2;
```

Defined in: [entities/entity.ts:37](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L37)

#### Returns

[`Vector2`](../interfaces/Vector2.md)

#### Inherited from

[`Entity`](Entity.md).[`getPosition`](Entity.md#getposition)

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

[`Entity`](Entity.md).[`getSize`](Entity.md#getsize)

***

### getSpeed()

```ts
getSpeed(): number;
```

Defined in: [entities/dynamic\_entity.ts:20](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/dynamic_entity.ts#L20)

#### Returns

`number`

***

### getVelocity()

```ts
getVelocity(): Vector2;
```

Defined in: [entities/dynamic\_entity.ts:12](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/dynamic_entity.ts#L12)

#### Returns

[`Vector2`](../interfaces/Vector2.md)

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

[`Entity`](Entity.md).[`hasBehaviour`](Entity.md#hasbehaviour)

***

### render()

```ts
abstract render(ctx: CanvasRenderingContext2D): void;
```

Defined in: [entities/entity.ts:35](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L35)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | `CanvasRenderingContext2D` |

#### Returns

`void`

#### Inherited from

[`Entity`](Entity.md).[`render`](Entity.md#render)

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

***

### update()

```ts
abstract update(deltaTime: number): void;
```

Defined in: [entities/entity.ts:34](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L34)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |

#### Returns

`void`

#### Inherited from

[`Entity`](Entity.md).[`update`](Entity.md#update)

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

[`Entity`](Entity.md).[`renderBehaviours`](Entity.md#renderbehaviours)

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

[`Entity`](Entity.md).[`updateBehaviours`](Entity.md#updatebehaviours)
