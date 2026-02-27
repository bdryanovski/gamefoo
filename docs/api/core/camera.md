[**@dryanovski/gamefoo**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / core/camera

# core/camera

## Classes

### default

Defined in: [core/camera.ts:3](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/camera.ts#L3)

#### Constructors

##### Constructor

```ts
new default(width, height): default;
```

Defined in: [core/camera.ts:9](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/camera.ts#L9)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `width` | `number` |
| `height` | `number` |

###### Returns

[`default`](#default)

#### Methods

##### follow()

```ts
follow(target): void;
```

Defined in: [core/camera.ts:14](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/camera.ts#L14)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `target` | [`Vector2`](../types.md#vector2) |

###### Returns

`void`

##### getPosition()

```ts
getPosition(): Vector2;
```

Defined in: [core/camera.ts:24](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/camera.ts#L24)

###### Returns

[`Vector2`](../types.md#vector2)

##### getViewRect()

```ts
getViewRect(): {
  height: number;
  width: number;
  x: number;
  y: number;
};
```

Defined in: [core/camera.ts:28](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/camera.ts#L28)

###### Returns

```ts
{
  height: number;
  width: number;
  x: number;
  y: number;
}
```

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [core/camera.ts:28](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/camera.ts#L28) |
| `width` | `number` | [core/camera.ts:28](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/camera.ts#L28) |
| `x` | `number` | [core/camera.ts:28](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/camera.ts#L28) |
| `y` | `number` | [core/camera.ts:28](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/camera.ts#L28) |

##### moveTo()

```ts
moveTo(target): void;
```

Defined in: [core/camera.ts:19](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/camera.ts#L19)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `target` | [`Vector2`](../types.md#vector2) |

###### Returns

`void`

##### resize()

```ts
resize(width, height): void;
```

Defined in: [core/camera.ts:37](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/camera.ts#L37)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `width` | `number` |
| `height` | `number` |

###### Returns

`void`
