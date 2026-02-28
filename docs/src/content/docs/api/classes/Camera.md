---
title: 'Class: Camera'
---

[**@dryanovski/gamefoo v0.0.1**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Camera

# Class: Camera

Defined in: [core/camera.ts:3](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L3)

## Constructors

### Constructor

```ts
new Camera(width: number, height: number): Camera;
```

Defined in: [core/camera.ts:9](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L9)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `width` | `number` |
| `height` | `number` |

#### Returns

`Camera`

## Properties

| Property | Modifier | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="height"></a> `height` | `private` | `number` | `undefined` | [core/camera.ts:7](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L7) |
| <a id="width"></a> `width` | `private` | `number` | `undefined` | [core/camera.ts:6](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L6) |
| <a id="x"></a> `x` | `private` | `number` | `0` | [core/camera.ts:4](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L4) |
| <a id="y"></a> `y` | `private` | `number` | `0` | [core/camera.ts:5](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L5) |

## Methods

### follow()

```ts
follow(target: Vector2): void;
```

Defined in: [core/camera.ts:14](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L14)

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

Defined in: [core/camera.ts:24](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L24)

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

Defined in: [core/camera.ts:28](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L28)

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
| `height` | `number` | [core/camera.ts:28](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L28) |
| `width` | `number` | [core/camera.ts:28](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L28) |
| `x` | `number` | [core/camera.ts:28](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L28) |
| `y` | `number` | [core/camera.ts:28](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L28) |

***

### moveTo()

```ts
moveTo(target: Vector2): void;
```

Defined in: [core/camera.ts:19](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L19)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `target` | [`Vector2`](../interfaces/Vector2.md) |

#### Returns

`void`

***

### resize()

```ts
resize(width: number, height: number): void;
```

Defined in: [core/camera.ts:37](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L37)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `width` | `number` |
| `height` | `number` |

#### Returns

`void`
