---
title: 'Class: Camera'
---

[**@dryanovski/gamefoo**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Camera

# Class: Camera

Defined in: [core/camera.ts:3](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/camera.ts#L3)

## Constructors

### Constructor

```ts
new Camera(width, height): Camera;
```

Defined in: [core/camera.ts:9](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/camera.ts#L9)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `width` | `number` |
| `height` | `number` |

#### Returns

`Camera`

## Methods

### follow()

```ts
follow(target): void;
```

Defined in: [core/camera.ts:14](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/camera.ts#L14)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `target` | [`Vector2`](../interfaces/Vector2.md) |

#### Returns

`void`

***

### getPosition()

```ts
getPosition(): Vector2;
```

Defined in: [core/camera.ts:24](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/camera.ts#L24)

#### Returns

[`Vector2`](../interfaces/Vector2.md)

***

### getViewRect()

```ts
getViewRect(): {
  height: number;
  width: number;
  x: number;
  y: number;
};
```

Defined in: [core/camera.ts:28](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/camera.ts#L28)

#### Returns

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
| `height` | `number` | [core/camera.ts:28](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/camera.ts#L28) |
| `width` | `number` | [core/camera.ts:28](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/camera.ts#L28) |
| `x` | `number` | [core/camera.ts:28](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/camera.ts#L28) |
| `y` | `number` | [core/camera.ts:28](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/camera.ts#L28) |

***

### moveTo()

```ts
moveTo(target): void;
```

Defined in: [core/camera.ts:19](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/camera.ts#L19)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `target` | [`Vector2`](../interfaces/Vector2.md) |

#### Returns

`void`

***

### resize()

```ts
resize(width, height): void;
```

Defined in: [core/camera.ts:37](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/camera.ts#L37)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `width` | `number` |
| `height` | `number` |

#### Returns

`void`
