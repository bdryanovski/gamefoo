---
title: 'Class: PerlinNoise'
---

[**@dryanovski/gamefoo v0.0.1**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / PerlinNoise

# Class: PerlinNoise

Defined in: [core/utils/perlin\_noise.ts:44](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/perlin_noise.ts#L44)

Deterministic 2-D Perlin noise generator with fractal Brownian motion
(fBm) support.

Produces smooth, continuous noise suitable for terrain heightmaps,
cloud textures, procedural vegetation placement, and other organic
patterns. The output is fully reproducible for a given seed.

The implementation uses a 256-entry permutation table shuffled by a
seeded linear congruential generator (LCG) and Ken Perlin's improved
5th-order fade curve \( 6t^5 - 15t^4 + 10t^3 \).

## Since

0.1.0

## Examples

```ts
import { PerlinNoise } from "gamefoo";

const noise = new PerlinNoise(42);
const value = noise.noise2d(1.5, 2.3); // returns a value in [-1, 1]
```

```ts
const noise = new PerlinNoise(12345);
const map: number[][] = [];

for (let y = 0; y < 128; y++) {
  map[y] = [];
  for (let x = 0; x < 128; x++) {
    map[y][x] = noise.fbm(x * 0.05, y * 0.05, 6, 2, 0.5);
  }
}
```

```ts
const a = new PerlinNoise(7);
const b = new PerlinNoise(7);
console.log(a.noise2d(3, 4) === b.noise2d(3, 4)); // true
```

## Constructors

### Constructor

```ts
new PerlinNoise(seed?: number): PerlinNoise;
```

Defined in: [core/utils/perlin\_noise.ts:59](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/perlin_noise.ts#L59)

Creates a new noise generator with the given seed.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `seed` | `number` | `0` | An integer seed for the internal LCG. Identical seeds produce identical noise fields. |

#### Returns

`PerlinNoise`

#### Default Value

`0`

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="perm"></a> `perm` | `private` | `Uint8Array` | Doubled permutation table (512 entries) used for gradient hashing. Built from a 256-entry shuffle of `[0..255]` seeded by the LCG. | [core/utils/perlin\_noise.ts:49](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/perlin_noise.ts#L49) |

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

Defined in: [core/utils/perlin\_noise.ts:181](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/perlin_noise.ts#L181)

Computes fractal Brownian motion (fBm) by layering multiple
octaves of [PerlinNoise.noise2d](#noise2d) with increasing frequency
and decreasing amplitude.

The result is normalised to `[-1, 1]`.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `x` | `number` | `undefined` | X coordinate. |
| `y` | `number` | `undefined` | Y coordinate. |
| `octaves` | `number` | `4` | Number of noise layers to sum. |
| `lacunarity` | `number` | `2` | Frequency multiplier per octave. |
| `persistence` | `number` | `0.5` | Amplitude multiplier per octave (controls roughness). |

#### Returns

`number`

A noise value in `[-1, 1]`.

#### Default Value

octaves = `4`

#### Default Value

lacunarity = `2`

#### Default Value

persistence = `0.5`

#### Example

```ts
// 6 octaves for high detail:
const height = noise.fbm(x * 0.01, y * 0.01, 6, 2.0, 0.5);
```

***

### noise2d()

```ts
noise2d(x: number, y: number): number;
```

Defined in: [core/utils/perlin\_noise.ts:136](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/perlin_noise.ts#L136)

Samples 2-D Perlin noise at the given coordinates.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X coordinate (any real number). |
| `y` | `number` | Y coordinate (any real number). |

#### Returns

`number`

A noise value in the range `[-1, 1]`.

#### Example

```ts
const n = noise.noise2d(0.5, 0.5);
// n is a smooth, deterministic value in [-1, 1]
```

***

### fade()

```ts
private fade(t: number): number;
```

Defined in: [core/utils/perlin\_noise.ts:84](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/perlin_noise.ts#L84)

**`Internal`**

Ken Perlin's improved 5th-order fade (smoothstep) curve:
\( 6t^5 - 15t^4 + 10t^3 \).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `t` | `number` | Value in `[0, 1]`. |

#### Returns

`number`

Smoothed value in `[0, 1]`.

***

### grad()

```ts
private grad(
   hash: number, 
   x: number, 
   y: number): number;
```

Defined in: [core/utils/perlin\_noise.ts:116](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/perlin_noise.ts#L116)

**`Internal`**

Computes a pseudo-random gradient dot product from a hash and
2-D offset.

Uses the bottom 2 bits of `hash` to select one of four gradient
directions.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hash` | `number` | Permutation table entry. |
| `x` | `number` | X offset from the grid point. |
| `y` | `number` | Y offset from the grid point. |

#### Returns

`number`

Dot product of the gradient and offset vectors.

***

### lerp()

```ts
private lerp(
   a: number, 
   b: number, 
   t: number): number;
```

Defined in: [core/utils/perlin\_noise.ts:98](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/perlin_noise.ts#L98)

**`Internal`**

Standard linear interpolation.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `a` | `number` | Start value. |
| `b` | `number` | End value. |
| `t` | `number` | Interpolant in `[0, 1]`. |

#### Returns

`number`

Interpolated value.
