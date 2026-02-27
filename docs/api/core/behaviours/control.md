[**@dryanovski/gamefoo**](../../README.md)

***

[@dryanovski/gamefoo](../../README.md) / core/behaviours/control

# core/behaviours/control

## Classes

### Control

Defined in: [core/behaviours/control.ts:5](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviours/control.ts#L5)

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
new Control(owner, input): Control;
```

Defined in: [core/behaviours/control.ts:12](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviours/control.ts#L12)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `owner` | [`default`](../../entities/dynamic_entity.md#abstract-default) |
| `input` | [`default`](../input.md#default) |

###### Returns

[`Control`](#control)

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
update(deltaTime): void;
```

Defined in: [core/behaviours/control.ts:17](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviours/control.ts#L17)

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
| <a id="owner"></a> `owner` | `protected` | [`default`](../../entities/dynamic_entity.md#abstract-default) | `undefined` | - | [`Behaviour`](../behaviour.md#abstract-behaviour).[`owner`](../behaviour.md#owner) | [core/behaviour.ts:4](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviour.ts#L4) |
| <a id="priority"></a> `priority` | `public` | `number` | `1` | - | [`Behaviour`](../behaviour.md#abstract-behaviour).[`priority`](../behaviour.md#priority) | [core/behaviour.ts:8](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviour.ts#L8) |
| <a id="type"></a> `type` | `readonly` | `"control"` | `"control"` | [`Behaviour`](../behaviour.md#abstract-behaviour).[`type`](../behaviour.md#type) | - | [core/behaviours/control.ts:6](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/behaviours/control.ts#L6) |
