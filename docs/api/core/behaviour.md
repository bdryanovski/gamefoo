[**@dryanovski/gamefoo**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / core/behaviour

# core/behaviour

## Classes

### `abstract` Behaviour

Defined in: [core/behaviour.ts:3](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviour.ts#L3)

#### Extended by

- [`Collidable`](behaviours/collidable.md#collidable)
- [`Control`](behaviours/control.md#control)
- [`HealthKit`](behaviours/healtkit.md#healthkit)
- [`default`](behaviours/sprite_render.md#default)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`default`](../entities/entity.md#abstract-default) | [`default`](../entities/entity.md#abstract-default) |

#### Accessors

##### key

###### Get Signature

```ts
get key(): string;
```

Defined in: [core/behaviour.ts:12](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviour.ts#L12)

###### Returns

`string`

#### Constructors

##### Constructor

```ts
new Behaviour<T>(owner): Behaviour<T>;
```

Defined in: [core/behaviour.ts:16](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviour.ts#L16)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `owner` | `T` |

###### Returns

[`Behaviour`](#abstract-behaviour)\<`T`\>

#### Methods

##### onAttach()?

```ts
optional onAttach(): void;
```

Defined in: [core/behaviour.ts:23](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviour.ts#L23)

###### Returns

`void`

##### onDetach()?

```ts
optional onDetach(): void;
```

Defined in: [core/behaviour.ts:24](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviour.ts#L24)

###### Returns

`void`

##### render()?

```ts
optional render(ctx): void;
```

Defined in: [core/behaviour.ts:22](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviour.ts#L22)

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

Defined in: [core/behaviour.ts:20](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviour.ts#L20)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |

###### Returns

`void`

#### Properties

| Property | Modifier | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="enabled"></a> `enabled` | `public` | `boolean` | `true` | [core/behaviour.ts:10](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviour.ts#L10) |
| <a id="owner"></a> `owner` | `protected` | `T` | `undefined` | [core/behaviour.ts:4](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviour.ts#L4) |
| <a id="priority"></a> `priority` | `public` | `number` | `1` | [core/behaviour.ts:8](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviour.ts#L8) |
| <a id="type"></a> `type` | `abstract` | `string` | `undefined` | [core/behaviour.ts:6](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviour.ts#L6) |
