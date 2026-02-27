[**@dryanovski/gamefoo**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / entities/dynamic\_entity

# entities/dynamic\_entity

## Classes

### `abstract` default

Defined in: [entities/dynamic\_entity.ts:4](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/dynamic_entity.ts#L4)

#### Extends

- [`default`](entity.md#abstract-default)

#### Extended by

- [`default`](player.md#default)

#### Accessors

##### x

###### Get Signature

```ts
get x(): number;
```

Defined in: [entities/entity.ts:12](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L12)

###### Returns

`number`

###### Set Signature

```ts
set x(value): void;
```

Defined in: [entities/entity.ts:16](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L16)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

###### Returns

`void`

###### Inherited from

[`default`](player.md#default).[`x`](player.md#x)

##### y

###### Get Signature

```ts
get y(): number;
```

Defined in: [entities/entity.ts:20](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L20)

###### Returns

`number`

###### Set Signature

```ts
set y(value): void;
```

Defined in: [entities/entity.ts:24](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L24)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

###### Returns

`void`

###### Inherited from

[`default`](player.md#default).[`y`](player.md#y)

#### Constructors

##### Constructor

```ts
new default(
   id, 
   x, 
   y, 
   width, 
   height): default;
```

Defined in: [entities/entity.ts:28](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L28)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `x` | `number` |
| `y` | `number` |
| `width` | `number` |
| `height` | `number` |

###### Returns

[`default`](#abstract-default)

###### Inherited from

[`default`](entity.md#abstract-default).[`constructor`](entity.md#constructor)

#### Methods

##### attachBehaviour()

```ts
attachBehaviour<T>(behavior): T;
```

Defined in: [entities/entity.ts:57](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L57)

###### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`Behaviour`](../core/behaviour.md#abstract-behaviour)\<[`default`](entity.md#abstract-default)\> |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `behavior` | `T` |

###### Returns

`T`

###### Inherited from

[`default`](entity.md#abstract-default).[`attachBehaviour`](entity.md#attachbehaviour)

##### detachBehaviour()

```ts
detachBehaviour(key): void;
```

Defined in: [entities/entity.ts:67](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L67)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

`void`

###### Inherited from

[`default`](entity.md#abstract-default).[`detachBehaviour`](entity.md#detachbehaviour)

##### getBehaviour()

```ts
getBehaviour<T>(key): T | undefined;
```

Defined in: [entities/entity.ts:45](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L45)

###### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`Behaviour`](../core/behaviour.md#abstract-behaviour)\<[`default`](entity.md#abstract-default)\> |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

`T` \| `undefined`

###### Inherited from

[`default`](entity.md#abstract-default).[`getBehaviour`](entity.md#getbehaviour)

##### getBehavioursByType()

```ts
getBehavioursByType<T>(type): T[];
```

Defined in: [entities/entity.ts:49](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L49)

###### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`Behaviour`](../core/behaviour.md#abstract-behaviour)\<[`default`](entity.md#abstract-default)\> |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | (...`args`) => `T` |

###### Returns

`T`[]

###### Inherited from

[`default`](entity.md#abstract-default).[`getBehavioursByType`](entity.md#getbehavioursbytype)

##### getPosition()

```ts
getPosition(): Vector2;
```

Defined in: [entities/entity.ts:37](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L37)

###### Returns

[`Vector2`](../types.md#vector2)

###### Inherited from

[`default`](entity.md#abstract-default).[`getPosition`](entity.md#getposition)

##### getSize()

```ts
getSize(): {
  height: number;
  width: number;
};
```

Defined in: [entities/entity.ts:41](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L41)

###### Returns

```ts
{
  height: number;
  width: number;
}
```

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [entities/entity.ts:41](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L41) |
| `width` | `number` | [entities/entity.ts:41](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L41) |

###### Inherited from

[`default`](entity.md#abstract-default).[`getSize`](entity.md#getsize)

##### getSpeed()

```ts
getSpeed(): number;
```

Defined in: [entities/dynamic\_entity.ts:20](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/dynamic_entity.ts#L20)

###### Returns

`number`

##### getVelocity()

```ts
getVelocity(): Vector2;
```

Defined in: [entities/dynamic\_entity.ts:12](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/dynamic_entity.ts#L12)

###### Returns

[`Vector2`](../types.md#vector2)

##### hasBehaviour()

```ts
hasBehaviour(key): boolean;
```

Defined in: [entities/entity.ts:53](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L53)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

`boolean`

###### Inherited from

[`default`](entity.md#abstract-default).[`hasBehaviour`](entity.md#hasbehaviour)

##### render()

```ts
abstract render(ctx): void;
```

Defined in: [entities/entity.ts:35](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L35)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | `CanvasRenderingContext2D` |

###### Returns

`void`

###### Inherited from

[`default`](entity.md#abstract-default).[`render`](entity.md#render)

##### renderBehaviours()

```ts
protected renderBehaviours(ctx): void;
```

Defined in: [entities/entity.ts:95](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L95)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | `CanvasRenderingContext2D` |

###### Returns

`void`

###### Inherited from

[`default`](entity.md#abstract-default).[`renderBehaviours`](entity.md#renderbehaviours)

##### setSpeed()

```ts
setSpeed(speed): void;
```

Defined in: [entities/dynamic\_entity.ts:16](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/dynamic_entity.ts#L16)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `speed` | `number` |

###### Returns

`void`

##### setVelocity()

```ts
setVelocity(velocity): void;
```

Defined in: [entities/dynamic\_entity.ts:8](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/dynamic_entity.ts#L8)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `velocity` | [`Vector2`](../types.md#vector2) |

###### Returns

`void`

##### update()

```ts
abstract update(deltaTime): void;
```

Defined in: [entities/entity.ts:34](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L34)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |

###### Returns

`void`

###### Inherited from

[`default`](entity.md#abstract-default).[`update`](entity.md#update)

##### updateBehaviours()

```ts
protected updateBehaviours(deltaTime): void;
```

Defined in: [entities/entity.ts:87](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L87)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |

###### Returns

`void`

###### Inherited from

[`default`](entity.md#abstract-default).[`updateBehaviours`](entity.md#updatebehaviours)

#### Properties

| Property | Modifier | Type | Default value | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="id"></a> `id` | `public` | `string` | `""` | [`default`](entity.md#abstract-default).[`id`](entity.md#id) | [entities/entity.ts:5](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L5) |
| <a id="position"></a> `position` | `protected` | [`Vector2`](../types.md#vector2) | `undefined` | [`default`](entity.md#abstract-default).[`position`](entity.md#position) | [entities/entity.ts:6](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L6) |
| <a id="size"></a> `size` | `protected` | \{ `height`: `number`; `width`: `number`; \} | `undefined` | [`default`](entity.md#abstract-default).[`size`](entity.md#size) | [entities/entity.ts:7](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L7) |
| `size.height` | `public` | `number` | `0` | - | [entities/entity.ts:7](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L7) |
| `size.width` | `public` | `number` | `0` | - | [entities/entity.ts:7](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L7) |
| <a id="speed"></a> `speed` | `protected` | `number` | `0` | - | [entities/dynamic\_entity.ts:6](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/dynamic_entity.ts#L6) |
| <a id="velocity"></a> `velocity` | `protected` | [`Vector2`](../types.md#vector2) | `undefined` | - | [entities/dynamic\_entity.ts:5](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/dynamic_entity.ts#L5) |
