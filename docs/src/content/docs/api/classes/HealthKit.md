---
title: 'Class: HealthKit'
---

[**@dryanovski/gamefoo**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / HealthKit

# Class: HealthKit

Defined in: [core/behaviours/healtkit.ts:4](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/healtkit.ts#L4)

## Extends

- [`Behaviour`](Behaviour.md)\<[`DynamicEntity`](DynamicEntity.md)\>

## Constructors

### Constructor

```ts
new HealthKit(
   owner, 
   health, 
   maxHP?): HealthKit;
```

Defined in: [core/behaviours/healtkit.ts:10](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/healtkit.ts#L10)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `owner` | [`DynamicEntity`](DynamicEntity.md) |
| `health` | `number` |
| `maxHP?` | `number` |

#### Returns

`HealthKit`

#### Overrides

[`Behaviour`](Behaviour.md).[`constructor`](Behaviour.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="enabled"></a> `enabled` | `public` | `boolean` | `true` | - | [`Behaviour`](Behaviour.md).[`enabled`](Behaviour.md#enabled) | [core/behaviour.ts:10](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L10) |
| <a id="owner"></a> `owner` | `protected` | [`DynamicEntity`](DynamicEntity.md) | `undefined` | - | [`Behaviour`](Behaviour.md).[`owner`](Behaviour.md#owner) | [core/behaviour.ts:4](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L4) |
| <a id="priority"></a> `priority` | `public` | `number` | `1` | - | [`Behaviour`](Behaviour.md).[`priority`](Behaviour.md#priority) | [core/behaviour.ts:8](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L8) |
| <a id="type"></a> `type` | `readonly` | `"healthkit"` | `"healthkit"` | [`Behaviour`](Behaviour.md).[`type`](Behaviour.md#type) | - | [core/behaviours/healtkit.ts:5](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/healtkit.ts#L5) |

## Accessors

### key

#### Get Signature

```ts
get key(): string;
```

Defined in: [core/behaviour.ts:12](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L12)

##### Returns

`string`

#### Inherited from

[`Behaviour`](Behaviour.md).[`key`](Behaviour.md#key)

## Methods

### getHealth()

```ts
getHealth(): number;
```

Defined in: [core/behaviours/healtkit.ts:26](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/healtkit.ts#L26)

#### Returns

`number`

***

### getHealthPercent()

```ts
getHealthPercent(): number;
```

Defined in: [core/behaviours/healtkit.ts:45](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/healtkit.ts#L45)

#### Returns

`number`

***

### getMaxHealth()

```ts
getMaxHealth(): number;
```

Defined in: [core/behaviours/healtkit.ts:30](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/healtkit.ts#L30)

#### Returns

`number`

***

### heal()

```ts
heal(amount): void;
```

Defined in: [core/behaviours/healtkit.ts:22](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/healtkit.ts#L22)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `amount` | `number` |

#### Returns

`void`

***

### isDead()

```ts
isDead(): boolean;
```

Defined in: [core/behaviours/healtkit.ts:41](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/healtkit.ts#L41)

#### Returns

`boolean`

***

### onAttach()?

```ts
optional onAttach(): void;
```

Defined in: [core/behaviour.ts:23](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L23)

#### Returns

`void`

#### Inherited from

[`Behaviour`](Behaviour.md).[`onAttach`](Behaviour.md#onattach)

***

### onDetach()?

```ts
optional onDetach(): void;
```

Defined in: [core/behaviour.ts:24](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L24)

#### Returns

`void`

#### Inherited from

[`Behaviour`](Behaviour.md).[`onDetach`](Behaviour.md#ondetach)

***

### render()?

```ts
optional render(ctx): void;
```

Defined in: [core/behaviour.ts:22](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L22)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | `CanvasRenderingContext2D` |

#### Returns

`void`

#### Inherited from

[`Behaviour`](Behaviour.md).[`render`](Behaviour.md#render)

***

### setMaxHealth()

```ts
setMaxHealth(value): void;
```

Defined in: [core/behaviours/healtkit.ts:34](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/healtkit.ts#L34)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

#### Returns

`void`

***

### takeDamage()

```ts
takeDamage(amount): void;
```

Defined in: [core/behaviours/healtkit.ts:18](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/healtkit.ts#L18)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `amount` | `number` |

#### Returns

`void`

***

### update()

```ts
update(_deltaTime): void;
```

Defined in: [core/behaviours/healtkit.ts:16](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/healtkit.ts#L16)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `_deltaTime` | `number` |

#### Returns

`void`

#### Overrides

[`Behaviour`](Behaviour.md).[`update`](Behaviour.md#update)
