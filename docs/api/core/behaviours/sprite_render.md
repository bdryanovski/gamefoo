[**@dryanovski/gamefoo**](../../README.md)

***

[@dryanovski/gamefoo](../../README.md) / core/behaviours/sprite\_render

# core/behaviours/sprite\_render

## Classes

### default

Defined in: [core/behaviours/sprite\_render.ts:6](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviours/sprite_render.ts#L6)

#### Extends

- [`Behaviour`](../behaviour.md#abstract-behaviour)\<[`default`](../../entities/entity.md#abstract-default)\>

#### Accessors

##### key

###### Get Signature

```ts
get key(): string;
```

Defined in: [core/behaviour.ts:12](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviour.ts#L12)

###### Returns

`string`

###### Inherited from

[`Behaviour`](../behaviour.md#abstract-behaviour).[`key`](../behaviour.md#key)

#### Constructors

##### Constructor

```ts
new default(owner, sheet): default;
```

Defined in: [core/behaviours/sprite\_render.ts:17](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviours/sprite_render.ts#L17)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `owner` | [`default`](../../entities/entity.md#abstract-default) |
| `sheet` | [`default`](../sprite.md#default) |

###### Returns

[`default`](#default)

###### Overrides

[`Behaviour`](../behaviour.md#abstract-behaviour).[`constructor`](../behaviour.md#constructor)

#### Methods

##### onAttach()?

```ts
optional onAttach(): void;
```

Defined in: [core/behaviour.ts:23](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviour.ts#L23)

###### Returns

`void`

###### Inherited from

[`Behaviour`](../behaviour.md#abstract-behaviour).[`onAttach`](../behaviour.md#onattach)

##### onDetach()?

```ts
optional onDetach(): void;
```

Defined in: [core/behaviour.ts:24](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviour.ts#L24)

###### Returns

`void`

###### Inherited from

[`Behaviour`](../behaviour.md#abstract-behaviour).[`onDetach`](../behaviour.md#ondetach)

##### play()

```ts
play(animation): void;
```

Defined in: [core/behaviours/sprite\_render.ts:22](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviours/sprite_render.ts#L22)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `animation` | `string` |

###### Returns

`void`

##### render()

```ts
render(ctx): void;
```

Defined in: [core/behaviours/sprite\_render.ts:65](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviours/sprite_render.ts#L65)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | `CanvasRenderingContext2D` |

###### Returns

`void`

###### Overrides

[`Behaviour`](../behaviour.md#abstract-behaviour).[`render`](../behaviour.md#render)

##### setFlipX()

```ts
setFlipX(flip): void;
```

Defined in: [core/behaviours/sprite\_render.ts:37](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviours/sprite_render.ts#L37)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `flip` | `boolean` |

###### Returns

`void`

##### stop()

```ts
stop(): void;
```

Defined in: [core/behaviours/sprite\_render.ts:31](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviours/sprite_render.ts#L31)

###### Returns

`void`

##### update()

```ts
update(deltaTime): void;
```

Defined in: [core/behaviours/sprite\_render.ts:41](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviours/sprite_render.ts#L41)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |

###### Returns

`void`

###### Overrides

[`Behaviour`](../behaviour.md#abstract-behaviour).[`update`](../behaviour.md#update)

#### Properties

| Property | Modifier | Type | Default value | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="enabled"></a> `enabled` | `public` | `boolean` | `true` | - | [`Behaviour`](../behaviour.md#abstract-behaviour).[`enabled`](../behaviour.md#enabled) | [core/behaviour.ts:10](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviour.ts#L10) |
| <a id="offset"></a> `offset` | `public` | [`Vector2`](../../types.md#vector2) | `undefined` | - | - | [core/behaviours/sprite\_render.ts:15](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviours/sprite_render.ts#L15) |
| <a id="owner"></a> `owner` | `protected` | [`default`](../../entities/entity.md#abstract-default) | `undefined` | - | [`Behaviour`](../behaviour.md#abstract-behaviour).[`owner`](../behaviour.md#owner) | [core/behaviour.ts:4](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviour.ts#L4) |
| <a id="priority"></a> `priority` | `public` | `number` | `1` | - | [`Behaviour`](../behaviour.md#abstract-behaviour).[`priority`](../behaviour.md#priority) | [core/behaviour.ts:8](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviour.ts#L8) |
| <a id="type"></a> `type` | `readonly` | `"sprite"` | `"sprite"` | [`Behaviour`](../behaviour.md#abstract-behaviour).[`type`](../behaviour.md#type) | - | [core/behaviours/sprite\_render.ts:7](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviours/sprite_render.ts#L7) |
