[**@dryanovski/gamefoo**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / entities/player

# entities/player

## Classes

### default

Defined in: [entities/player.ts:5](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/player.ts#L5)

#### Extends

- [`default`](dynamic_entity.md#abstract-default)

#### Accessors

##### control

###### Get Signature

```ts
get control(): Control | undefined;
```

Defined in: [entities/player.ts:6](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/player.ts#L6)

###### Returns

[`Control`](../core/behaviours/control.md#control) \| `undefined`

##### healthkit

###### Get Signature

```ts
get healthkit(): HealthKit | undefined;
```

Defined in: [entities/player.ts:10](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/player.ts#L10)

###### Returns

[`HealthKit`](../core/behaviours/healtkit.md#healthkit) \| `undefined`

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

[`default`](dynamic_entity.md#abstract-default).[`x`](dynamic_entity.md#x)

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

[`default`](dynamic_entity.md#abstract-default).[`y`](dynamic_entity.md#y)

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

[`default`](#default)

###### Inherited from

[`default`](dynamic_entity.md#abstract-default).[`constructor`](dynamic_entity.md#constructor)

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

[`default`](dynamic_entity.md#abstract-default).[`attachBehaviour`](dynamic_entity.md#attachbehaviour)

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

[`default`](dynamic_entity.md#abstract-default).[`detachBehaviour`](dynamic_entity.md#detachbehaviour)

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

[`default`](dynamic_entity.md#abstract-default).[`getBehaviour`](dynamic_entity.md#getbehaviour)

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

[`default`](dynamic_entity.md#abstract-default).[`getBehavioursByType`](dynamic_entity.md#getbehavioursbytype)

##### getPosition()

```ts
getPosition(): Vector2;
```

Defined in: [entities/entity.ts:37](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L37)

###### Returns

[`Vector2`](../types.md#vector2)

###### Inherited from

[`default`](dynamic_entity.md#abstract-default).[`getPosition`](dynamic_entity.md#getposition)

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

[`default`](dynamic_entity.md#abstract-default).[`getSize`](dynamic_entity.md#getsize)

##### getSpeed()

```ts
getSpeed(): number;
```

Defined in: [entities/dynamic\_entity.ts:20](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/dynamic_entity.ts#L20)

###### Returns

`number`

###### Inherited from

[`default`](dynamic_entity.md#abstract-default).[`getSpeed`](dynamic_entity.md#getspeed)

##### getVelocity()

```ts
getVelocity(): Vector2;
```

Defined in: [entities/dynamic\_entity.ts:12](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/dynamic_entity.ts#L12)

###### Returns

[`Vector2`](../types.md#vector2)

###### Inherited from

[`default`](dynamic_entity.md#abstract-default).[`getVelocity`](dynamic_entity.md#getvelocity)

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

[`default`](dynamic_entity.md#abstract-default).[`hasBehaviour`](dynamic_entity.md#hasbehaviour)

##### render()

```ts
render(ctx): void;
```

Defined in: [entities/player.ts:18](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/player.ts#L18)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | `CanvasRenderingContext2D` |

###### Returns

`void`

###### Overrides

[`default`](dynamic_entity.md#abstract-default).[`render`](dynamic_entity.md#render)

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

[`default`](dynamic_entity.md#abstract-default).[`renderBehaviours`](dynamic_entity.md#renderbehaviours)

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

###### Inherited from

[`default`](dynamic_entity.md#abstract-default).[`setSpeed`](dynamic_entity.md#setspeed)

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

###### Inherited from

[`default`](dynamic_entity.md#abstract-default).[`setVelocity`](dynamic_entity.md#setvelocity)

##### update()

```ts
update(deltaTime): void;
```

Defined in: [entities/player.ts:14](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/player.ts#L14)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |

###### Returns

`void`

###### Overrides

[`default`](dynamic_entity.md#abstract-default).[`update`](dynamic_entity.md#update)

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

[`default`](dynamic_entity.md#abstract-default).[`updateBehaviours`](dynamic_entity.md#updatebehaviours)

#### Properties

| Property | Modifier | Type | Default value | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="id"></a> `id` | `public` | `string` | `""` | [`default`](dynamic_entity.md#abstract-default).[`id`](dynamic_entity.md#id) | [entities/entity.ts:5](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L5) |
| <a id="position"></a> `position` | `protected` | [`Vector2`](../types.md#vector2) | `undefined` | [`default`](dynamic_entity.md#abstract-default).[`position`](dynamic_entity.md#position) | [entities/entity.ts:6](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L6) |
| <a id="size"></a> `size` | `protected` | \{ `height`: `number`; `width`: `number`; \} | `undefined` | [`default`](dynamic_entity.md#abstract-default).[`size`](dynamic_entity.md#size) | [entities/entity.ts:7](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L7) |
| `size.height` | `public` | `number` | `0` | - | [entities/entity.ts:7](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L7) |
| `size.width` | `public` | `number` | `0` | - | [entities/entity.ts:7](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L7) |
| <a id="speed"></a> `speed` | `protected` | `number` | `0` | [`default`](dynamic_entity.md#abstract-default).[`speed`](dynamic_entity.md#speed) | [entities/dynamic\_entity.ts:6](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/dynamic_entity.ts#L6) |
| <a id="velocity"></a> `velocity` | `protected` | [`Vector2`](../types.md#vector2) | `undefined` | [`default`](dynamic_entity.md#abstract-default).[`velocity`](dynamic_entity.md#velocity) | [entities/dynamic\_entity.ts:5](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/dynamic_entity.ts#L5) |
