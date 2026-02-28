---
title: 'Class: GameObjectRegister'
---

[**@dryanovski/gamefoo v0.0.1**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / GameObjectRegister

# Class: GameObjectRegister

Defined in: [core/game\_object\_register.ts:3](https://github.com/bdryanovski/gamefoo/blob/main/src/core/game_object_register.ts#L3)

## Constructors

### Constructor

```ts
new GameObjectRegister(): GameObjectRegister;
```

#### Returns

`GameObjectRegister`

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="objects"></a> `objects` | `private` | `Map`\<`string`, [`GameObject`](../type-aliases/GameObject.md)\> | [core/game\_object\_register.ts:4](https://github.com/bdryanovski/gamefoo/blob/main/src/core/game_object_register.ts#L4) |

## Methods

### get()

```ts
get(id: string): GameObject | undefined;
```

Defined in: [core/game\_object\_register.ts:10](https://github.com/bdryanovski/gamefoo/blob/main/src/core/game_object_register.ts#L10)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

#### Returns

[`GameObject`](../type-aliases/GameObject.md) \| `undefined`

***

### getAll()

```ts
getAll(_filter: () => true): GameObject[];
```

Defined in: [core/game\_object\_register.ts:18](https://github.com/bdryanovski/gamefoo/blob/main/src/core/game_object_register.ts#L18)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `_filter` | () => `true` |

#### Returns

[`GameObject`](../type-aliases/GameObject.md)[]

***

### has()

```ts
has(id: string): boolean;
```

Defined in: [core/game\_object\_register.ts:14](https://github.com/bdryanovski/gamefoo/blob/main/src/core/game_object_register.ts#L14)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

#### Returns

`boolean`

***

### register()

```ts
register(object: GameObject): void;
```

Defined in: [core/game\_object\_register.ts:6](https://github.com/bdryanovski/gamefoo/blob/main/src/core/game_object_register.ts#L6)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `object` | [`GameObject`](../type-aliases/GameObject.md) |

#### Returns

`void`

***

### renderAll()

```ts
renderAll(ctx: CanvasRenderingContext2D): void;
```

Defined in: [core/game\_object\_register.ts:28](https://github.com/bdryanovski/gamefoo/blob/main/src/core/game_object_register.ts#L28)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | `CanvasRenderingContext2D` |

#### Returns

`void`

***

### updateAll()

```ts
updateAll(deltaTime: number): void;
```

Defined in: [core/game\_object\_register.ts:22](https://github.com/bdryanovski/gamefoo/blob/main/src/core/game_object_register.ts#L22)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |

#### Returns

`void`
