---
title: 'Class: Input'
---

[**@dryanovski/gamefoo**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Input

# Class: Input

Defined in: [core/input.ts:1](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/input.ts#L1)

## Constructors

### Constructor

```ts
new Input(): Input;
```

Defined in: [core/input.ts:6](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/input.ts#L6)

#### Returns

`Input`

## Methods

### getMousePosition()

```ts
getMousePosition(): {
  x: number;
  y: number;
};
```

Defined in: [core/input.ts:41](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/input.ts#L41)

#### Returns

```ts
{
  x: number;
  y: number;
}
```

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `x` | `number` | [core/input.ts:41](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/input.ts#L41) |
| `y` | `number` | [core/input.ts:41](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/input.ts#L41) |

***

### getPressedKeys()

```ts
getPressedKeys(): Set<string>;
```

Defined in: [core/input.ts:33](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/input.ts#L33)

#### Returns

`Set`\<`string`\>

***

### isKeyDown()

```ts
isKeyDown(key): boolean;
```

Defined in: [core/input.ts:29](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/input.ts#L29)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

#### Returns

`boolean`

***

### isMouseButtonDown()

```ts
isMouseButtonDown(button): boolean;
```

Defined in: [core/input.ts:37](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/input.ts#L37)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `button` | `number` |

#### Returns

`boolean`

***

### reset()

```ts
reset(): void;
```

Defined in: [core/input.ts:45](https://github.com/bdryanovski/gamefoo/blob/c900f9a4693c62c5ba9335c6c0c3d641dcb7431d/src/core/input.ts#L45)

#### Returns

`void`
