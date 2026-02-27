---
title: 'Class: Control'
---

[**@dryanovski/gamefoo**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Control

# Class: Control

Defined in: [core/behaviours/control.ts:5](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/behaviours/control.ts#L5)

## Extends

- [`Behaviour`](Behaviour.md)\<[`DynamicEntity`](DynamicEntity.md)\>

## Constructors

### Constructor

```ts
new Control(owner, input): Control;
```

Defined in: [core/behaviours/control.ts:12](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/behaviours/control.ts#L12)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `owner` | [`DynamicEntity`](DynamicEntity.md) |
| `input` | [`Input`](Input.md) |

#### Returns

`Control`

#### Overrides

[`Behaviour`](Behaviour.md).[`constructor`](Behaviour.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="enabled"></a> `enabled` | `public` | `boolean` | `true` | - | [`Behaviour`](Behaviour.md).[`enabled`](Behaviour.md#enabled) | [core/behaviour.ts:10](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/behaviour.ts#L10) |
| <a id="owner"></a> `owner` | `protected` | [`DynamicEntity`](DynamicEntity.md) | `undefined` | - | [`Behaviour`](Behaviour.md).[`owner`](Behaviour.md#owner) | [core/behaviour.ts:4](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/behaviour.ts#L4) |
| <a id="priority"></a> `priority` | `public` | `number` | `1` | - | [`Behaviour`](Behaviour.md).[`priority`](Behaviour.md#priority) | [core/behaviour.ts:8](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/behaviour.ts#L8) |
| <a id="type"></a> `type` | `readonly` | `"control"` | `"control"` | [`Behaviour`](Behaviour.md).[`type`](Behaviour.md#type) | - | [core/behaviours/control.ts:6](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/behaviours/control.ts#L6) |

## Accessors

### key

#### Get Signature

```ts
get key(): string;
```

Defined in: [core/behaviour.ts:12](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/behaviour.ts#L12)

##### Returns

`string`

#### Inherited from

[`Behaviour`](Behaviour.md).[`key`](Behaviour.md#key)

## Methods

### onAttach()?

```ts
optional onAttach(): void;
```

Defined in: [core/behaviour.ts:23](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/behaviour.ts#L23)

#### Returns

`void`

#### Inherited from

[`Behaviour`](Behaviour.md).[`onAttach`](Behaviour.md#onattach)

***

### onDetach()?

```ts
optional onDetach(): void;
```

Defined in: [core/behaviour.ts:24](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/behaviour.ts#L24)

#### Returns

`void`

#### Inherited from

[`Behaviour`](Behaviour.md).[`onDetach`](Behaviour.md#ondetach)

***

### render()?

```ts
optional render(ctx): void;
```

Defined in: [core/behaviour.ts:22](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/behaviour.ts#L22)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | `CanvasRenderingContext2D` |

#### Returns

`void`

#### Inherited from

[`Behaviour`](Behaviour.md).[`render`](Behaviour.md#render)

***

### update()

```ts
update(deltaTime): void;
```

Defined in: [core/behaviours/control.ts:17](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/behaviours/control.ts#L17)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |

#### Returns

`void`

#### Overrides

[`Behaviour`](Behaviour.md).[`update`](Behaviour.md#update)
