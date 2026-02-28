---
title: 'Abstract Class: Entity'
---

[**@dryanovski/gamefoo v0.0.1**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Entity

# Abstract Class: Entity

Defined in: [entities/entity.ts:4](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L4)

## Extended by

- [`DynamicEntity`](DynamicEntity.md)

## Constructors

### Constructor

```ts
new Entity(
   id: string, 
   x: number, 
   y: number, 
   width: number, 
   height: number): Entity;
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

`Entity`

## Properties

| Property | Modifier | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="id"></a> `id` | `public` | `string` | `""` | [entities/entity.ts:5](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L5) |
| <a id="position"></a> `position` | `protected` | [`Vector2`](../interfaces/Vector2.md) | `undefined` | [entities/entity.ts:6](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L6) |
| <a id="size"></a> `size` | `protected` | \{ `height`: `number`; `width`: `number`; \} | `undefined` | [entities/entity.ts:7](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L7) |
| `size.height` | `public` | `number` | `0` | [entities/entity.ts:7](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L7) |
| `size.width` | `public` | `number` | `0` | [entities/entity.ts:7](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L7) |
| <a id="_sortedbehaviors"></a> `_sortedBehaviors` | `private` | [`Behaviour`](Behaviour.md)\<`Entity`\>[] \| `null` | `null` | [entities/entity.ts:10](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L10) |
| <a id="behaviormap"></a> `behaviorMap` | `private` | `Map`\<`string`, [`Behaviour`](Behaviour.md)\<`Entity`\>\> | `undefined` | [entities/entity.ts:9](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L9) |

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

***

### behaviors

#### Get Signature

```ts
get private behaviors(): Behaviour<Entity>[];
```

Defined in: [entities/entity.ts:78](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L78)

##### Returns

[`Behaviour`](Behaviour.md)\<`Entity`\>[]

## Methods

### attachBehaviour()

```ts
attachBehaviour<T>(behavior: T): T;
```

Defined in: [entities/entity.ts:57](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L57)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`Behaviour`](Behaviour.md)\<`Entity`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `behavior` | `T` |

#### Returns

`T`

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

***

### getBehaviour()

```ts
getBehaviour<T>(key: string): T | undefined;
```

Defined in: [entities/entity.ts:45](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L45)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`Behaviour`](Behaviour.md)\<`Entity`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

#### Returns

`T` \| `undefined`

***

### getBehavioursByType()

```ts
getBehavioursByType<T>(type: (...args: any[]) => T): T[];
```

Defined in: [entities/entity.ts:49](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L49)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`Behaviour`](Behaviour.md)\<`Entity`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | (...`args`: `any`[]) => `T` |

#### Returns

`T`[]

***

### getPosition()

```ts
getPosition(): Vector2;
```

Defined in: [entities/entity.ts:37](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L37)

#### Returns

[`Vector2`](../interfaces/Vector2.md)

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
