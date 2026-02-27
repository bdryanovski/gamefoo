[**@dryanovski/gamefoo**](../../README.md)

***

[@dryanovski/gamefoo](../../README.md) / core/behaviours/collidable

# core/behaviours/collidable

## Classes

### Collidable

Defined in: [core/behaviours/collidable.ts:17](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviours/collidable.ts#L17)

#### Extends

- [`Behaviour`](../behaviour.md#abstract-behaviour)\<[`default`](../../entities/dynamic_entity.md#abstract-default)\>

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
new Collidable(
   owner, 
   world, 
   options): Collidable;
```

Defined in: [core/behaviours/collidable.ts:36](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviours/collidable.ts#L36)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `owner` | [`default`](../../entities/dynamic_entity.md#abstract-default) |
| `world` | [`default`](../world.md#default) |
| `options` | `CollidableOptions` |

###### Returns

[`Collidable`](#collidable)

###### Overrides

[`Behaviour`](../behaviour.md#abstract-behaviour).[`constructor`](../behaviour.md#constructor)

#### Methods

##### getOwner()

```ts
getOwner(): default;
```

Defined in: [core/behaviours/collidable.ts:67](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviours/collidable.ts#L67)

###### Returns

[`default`](../../entities/entity.md#abstract-default)

##### getWorldBounds()

```ts
getWorldBounds(): WorldBounds;
```

Defined in: [core/behaviours/collidable.ts:71](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviours/collidable.ts#L71)

###### Returns

[`WorldBounds`](../../types.md#worldbounds)

##### onAttach()

```ts
onAttach(): void;
```

Defined in: [core/behaviours/collidable.ts:59](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviours/collidable.ts#L59)

###### Returns

`void`

###### Overrides

[`Behaviour`](../behaviour.md#abstract-behaviour).[`onAttach`](../behaviour.md#onattach)

##### onDetach()

```ts
onDetach(): void;
```

Defined in: [core/behaviours/collidable.ts:63](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviours/collidable.ts#L63)

###### Returns

`void`

###### Overrides

[`Behaviour`](../behaviour.md#abstract-behaviour).[`onDetach`](../behaviour.md#ondetach)

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

###### Inherited from

[`Behaviour`](../behaviour.md#abstract-behaviour).[`render`](../behaviour.md#render)

##### update()

```ts
update(_deltaTime): void;
```

Defined in: [core/behaviours/collidable.ts:57](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviours/collidable.ts#L57)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `_deltaTime` | `number` |

###### Returns

`void`

###### Overrides

[`Behaviour`](../behaviour.md#abstract-behaviour).[`update`](../behaviour.md#update)

#### Properties

| Property | Modifier | Type | Default value | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="collideswith"></a> `collidesWith` | `public` | `Set`\<`string`\> | `undefined` | - | - | [core/behaviours/collidable.ts:26](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviours/collidable.ts#L26) |
| <a id="enabled"></a> `enabled` | `public` | `boolean` | `true` | - | [`Behaviour`](../behaviour.md#abstract-behaviour).[`enabled`](../behaviour.md#enabled) | [core/behaviour.ts:10](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviour.ts#L10) |
| <a id="fixed"></a> `fixed` | `public` | `boolean` | `false` | - | - | [core/behaviours/collidable.ts:30](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviours/collidable.ts#L30) |
| <a id="layer"></a> `layer` | `public` | `number` | `0` | - | - | [core/behaviours/collidable.ts:22](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviours/collidable.ts#L22) |
| <a id="oncollision"></a> `onCollision` | `public` | (`info`) => `void` | `undefined` | - | - | [core/behaviours/collidable.ts:32](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviours/collidable.ts#L32) |
| <a id="owner"></a> `owner` | `protected` | [`default`](../../entities/dynamic_entity.md#abstract-default) | `undefined` | - | [`Behaviour`](../behaviour.md#abstract-behaviour).[`owner`](../behaviour.md#owner) | [core/behaviour.ts:4](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviour.ts#L4) |
| <a id="priority"></a> `priority` | `public` | `number` | `1` | - | [`Behaviour`](../behaviour.md#abstract-behaviour).[`priority`](../behaviour.md#priority) | [core/behaviour.ts:8](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviour.ts#L8) |
| <a id="shape"></a> `shape` | `public` | [`ColliderShape`](../../types.md#collidershape) | `undefined` | - | - | [core/behaviours/collidable.ts:20](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviours/collidable.ts#L20) |
| <a id="solid"></a> `solid` | `public` | `boolean` | `false` | - | - | [core/behaviours/collidable.ts:28](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviours/collidable.ts#L28) |
| <a id="tags"></a> `tags` | `public` | `Set`\<`string`\> | `undefined` | - | - | [core/behaviours/collidable.ts:24](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviours/collidable.ts#L24) |
| <a id="type"></a> `type` | `readonly` | `"collidable"` | `"collidable"` | [`Behaviour`](../behaviour.md#abstract-behaviour).[`type`](../behaviour.md#type) | - | [core/behaviours/collidable.ts:18](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviours/collidable.ts#L18) |
