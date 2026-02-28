---
title: 'Class: PerlinNoise'
---

[**@dryanovski/gamefoo v0.0.1**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / PerlinNoise

# Class: PerlinNoise

Defined in: [core/utils/perlin\_noise.ts:1](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/perlin_noise.ts#L1)

Utility function

## Constructors

### Constructor

```ts
new PerlinNoise(seed?: number): PerlinNoise;
```

Defined in: [core/utils/perlin\_noise.ts:4](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/perlin_noise.ts#L4)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `seed` | `number` | `0` |

#### Returns

`PerlinNoise`

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="perm"></a> `perm` | `private` | `Uint8Array` | [core/utils/perlin\_noise.ts:2](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/perlin_noise.ts#L2) |

## Methods

### fbm()

```ts
fbm(
   x: number, 
   y: number, 
   octaves?: number, 
   lacunarity?: number, 
   persistence?: number): number;
```

Defined in: [core/utils/perlin\_noise.ts:60](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/perlin_noise.ts#L60)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `x` | `number` | `undefined` |
| `y` | `number` | `undefined` |
| `octaves` | `number` | `4` |
| `lacunarity` | `number` | `2` |
| `persistence` | `number` | `0.5` |

#### Returns

`number`

***

### noise2d()

```ts
noise2d(x: number, y: number): number;
```

Defined in: [core/utils/perlin\_noise.ts:40](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/perlin_noise.ts#L40)

Returns a value in [-1, 1]

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |

#### Returns

`number`

***

### fade()

```ts
private fade(t: number): number;
```

Defined in: [core/utils/perlin\_noise.ts:23](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/perlin_noise.ts#L23)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `t` | `number` |

#### Returns

`number`

***

### grad()

```ts
private grad(
   hash: number, 
   x: number, 
   y: number): number;
```

Defined in: [core/utils/perlin\_noise.ts:31](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/perlin_noise.ts#L31)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `hash` | `number` |
| `x` | `number` |
| `y` | `number` |

#### Returns

`number`

***

### lerp()

```ts
private lerp(
   a: number, 
   b: number, 
   t: number): number;
```

Defined in: [core/utils/perlin\_noise.ts:27](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/perlin_noise.ts#L27)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `a` | `number` |
| `b` | `number` |
| `t` | `number` |

#### Returns

`number`
