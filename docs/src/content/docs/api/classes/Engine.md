---
title: 'Class: Engine'
---

[**@dryanovski/gamefoo**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Engine

# Class: Engine

Defined in: [core/engine.ts:14](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L14)

Game Engine - the main class that manages the game loop, rendering, and overall game state.

## Constructors

### Constructor

```ts
new Engine(
   canvasId, 
   width, 
   height, 
   config): Engine;
```

Defined in: [core/engine.ts:38](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L38)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `canvasId` | `string` |
| `width` | `number` |
| `height` | `number` |
| `config` | `EngineConfig` |

#### Returns

`Engine`

## Accessors

### collisions

#### Get Signature

```ts
get collisions(): World;
```

Defined in: [core/engine.ts:75](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L75)

##### Returns

[`World`](World.md)

***

### player

#### Get Signature

```ts
get player(): Player | undefined;
```

Defined in: [core/engine.ts:71](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L71)

##### Returns

[`Player`](Player.md) \| `undefined`

#### Set Signature

```ts
set player(player): void;
```

Defined in: [core/engine.ts:67](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L67)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `player` | [`Player`](Player.md) |

##### Returns

`void`

## Methods

### attachObjects()

```ts
attachObjects(objects): void;
```

Defined in: [core/engine.ts:79](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L79)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `objects` | [`GameObject`](../type-aliases/GameObject.md) |

#### Returns

`void`

***

### clear()

```ts
clear(): void;
```

Defined in: [core/engine.ts:182](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L182)

#### Returns

`void`

***

### destroy()

```ts
destroy(): void;
```

Defined in: [core/engine.ts:187](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L187)

#### Returns

`void`

***

### handleResize()

```ts
handleResize(): void;
```

Defined in: [core/engine.ts:83](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L83)

#### Returns

`void`

***

### pause()

```ts
pause(): void;
```

Defined in: [core/engine.ts:178](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L178)

#### Returns

`void`

***

### render()

```ts
render(): void;
```

Defined in: [core/engine.ts:164](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L164)

#### Returns

`void`

***

### resize()

```ts
resize(width, height): void;
```

Defined in: [core/engine.ts:101](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L101)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `width` | `number` |
| `height` | `number` |

#### Returns

`void`

***

### setup()

```ts
setup(setupFn): Promise<void>;
```

Defined in: [core/engine.ts:127](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L127)

Public - cause I'm old school

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `setupFn` | () => `void` |

#### Returns

`Promise`\<`void`\>

***

### update()

```ts
update(deltaTime): void;
```

Defined in: [core/engine.ts:144](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L144)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |

#### Returns

`void`
