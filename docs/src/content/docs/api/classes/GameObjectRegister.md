---
title: 'Class: GameObjectRegister'
---

[**@dryanovski/gamefoo**](../README.md)

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

## Methods

### get()

```ts
get(id): GameObject | undefined;
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
getAll(_filter): GameObject[];
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
has(id): boolean;
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
register(object): void;
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
renderAll(ctx): void;
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
updateAll(deltaTime): void;
```

Defined in: [core/game\_object\_register.ts:22](https://github.com/bdryanovski/gamefoo/blob/main/src/core/game_object_register.ts#L22)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |

#### Returns

`void`
