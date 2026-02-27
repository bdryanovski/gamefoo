[**@dryanovski/gamefoo**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / entities/entity

# entities/entity

## Classes

### `abstract` default

Defined in: [entities/entity.ts:4](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L4)

#### Extended by

- [`default`](dynamic_entity.md#abstract-default)

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

#### Methods

##### attachBehaviour()

```ts
attachBehaviour<T>(behavior): T;
```

Defined in: [entities/entity.ts:57](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L57)

###### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`Behaviour`](../core/behaviour.md#abstract-behaviour)\<[`default`](#abstract-default)\> |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `behavior` | `T` |

###### Returns

`T`

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

##### getBehaviour()

```ts
getBehaviour<T>(key): T | undefined;
```

Defined in: [entities/entity.ts:45](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L45)

###### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`Behaviour`](../core/behaviour.md#abstract-behaviour)\<[`default`](#abstract-default)\> |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

`T` \| `undefined`

##### getBehavioursByType()

```ts
getBehavioursByType<T>(type): T[];
```

Defined in: [entities/entity.ts:49](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L49)

###### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`Behaviour`](../core/behaviour.md#abstract-behaviour)\<[`default`](#abstract-default)\> |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | (...`args`) => `T` |

###### Returns

`T`[]

##### getPosition()

```ts
getPosition(): Vector2;
```

Defined in: [entities/entity.ts:37](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L37)

###### Returns

[`Vector2`](../types.md#vector2)

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

#### Properties

| Property | Modifier | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="id"></a> `id` | `public` | `string` | `""` | [entities/entity.ts:5](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L5) |
| <a id="position"></a> `position` | `protected` | [`Vector2`](../types.md#vector2) | `undefined` | [entities/entity.ts:6](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L6) |
| <a id="size"></a> `size` | `protected` | \{ `height`: `number`; `width`: `number`; \} | `undefined` | [entities/entity.ts:7](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L7) |
| `size.height` | `public` | `number` | `0` | [entities/entity.ts:7](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L7) |
| `size.width` | `public` | `number` | `0` | [entities/entity.ts:7](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/entities/entity.ts#L7) |
