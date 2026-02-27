[**@dryanovski/gamefoo**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / core/animate

# core/animate

## Classes

### default

Defined in: [core/animate.ts:1](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/animate.ts#L1)

#### Constructors

##### Constructor

```ts
new default(
   key, 
   frames, 
   frameW, 
   frameH, 
   fps): default;
```

Defined in: [core/animate.ts:12](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/animate.ts#L12)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `frames` | \{ `col`: `number`; `row`: `number`; \}[] |
| `frameW` | `number` |
| `frameH` | `number` |
| `fps` | `number` |

###### Returns

[`default`](#default)

#### Methods

##### draw()

```ts
draw(
   _ctx, 
   _destX, 
   _destY): void;
```

Defined in: [core/animate.ts:37](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/animate.ts#L37)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `_ctx` | `CanvasRenderingContext2D` |
| `_destX` | `number` |
| `_destY` | `number` |

###### Returns

`void`

##### reset()

```ts
reset(): void;
```

Defined in: [core/animate.ts:44](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/animate.ts#L44)

###### Returns

`void`

##### update()

```ts
update(delta): void;
```

Defined in: [core/animate.ts:28](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/animate.ts#L28)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `delta` | `number` |

###### Returns

`void`
