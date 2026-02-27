[**@dryanovski/gamefoo**](../../README.md)

***

[@dryanovski/gamefoo](../../README.md) / core/utils/perlin\_noise

# core/utils/perlin\_noise

## Classes

### PerlinNoise

Defined in: [core/utils/perlin\_noise.ts:1](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/utils/perlin_noise.ts#L1)

#### Constructors

##### Constructor

```ts
new PerlinNoise(seed?): PerlinNoise;
```

Defined in: [core/utils/perlin\_noise.ts:4](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/utils/perlin_noise.ts#L4)

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `seed` | `number` | `0` |

###### Returns

[`PerlinNoise`](#perlinnoise)

#### Methods

##### fbm()

```ts
fbm(
   x, 
   y, 
   octaves?, 
   lacunarity?, 
   persistence?): number;
```

Defined in: [core/utils/perlin\_noise.ts:60](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/utils/perlin_noise.ts#L60)

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `x` | `number` | `undefined` |
| `y` | `number` | `undefined` |
| `octaves` | `number` | `4` |
| `lacunarity` | `number` | `2` |
| `persistence` | `number` | `0.5` |

###### Returns

`number`

##### noise2d()

```ts
noise2d(x, y): number;
```

Defined in: [core/utils/perlin\_noise.ts:40](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/utils/perlin_noise.ts#L40)

Returns a value in [-1, 1]

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |

###### Returns

`number`
