---
title: 'Class: Input'
---

[**@dryanovski/gamefoo v0.0.1**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Input

# Class: Input

Defined in: [core/input.ts:1](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L1)

## Constructors

### Constructor

```ts
new Input(): Input;
```

Defined in: [core/input.ts:6](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L6)

#### Returns

`Input`

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="keys"></a> `keys` | `private` | `Set`\<`string`\> | [core/input.ts:2](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L2) |
| <a id="mousebuttons"></a> `mouseButtons` | `private` | `Set`\<`number`\> | [core/input.ts:3](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L3) |
| <a id="mouseposition"></a> `mousePosition` | `private` | \{ `x`: `number`; `y`: `number`; \} | [core/input.ts:4](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L4) |
| `mousePosition.x` | `public` | `number` | [core/input.ts:4](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L4) |
| `mousePosition.y` | `public` | `number` | [core/input.ts:4](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L4) |

## Methods

### getMousePosition()

```ts
getMousePosition(): {
  x: number;
  y: number;
};
```

Defined in: [core/input.ts:41](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L41)

#### Returns

```ts
{
  x: number;
  y: number;
}
```

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `x` | `number` | [core/input.ts:41](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L41) |
| `y` | `number` | [core/input.ts:41](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L41) |

***

### getPressedKeys()

```ts
getPressedKeys(): Set<string>;
```

Defined in: [core/input.ts:33](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L33)

#### Returns

`Set`\<`string`\>

***

### isKeyDown()

```ts
isKeyDown(key: string): boolean;
```

Defined in: [core/input.ts:29](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L29)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

#### Returns

`boolean`

***

### isMouseButtonDown()

```ts
isMouseButtonDown(button: number): boolean;
```

Defined in: [core/input.ts:37](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L37)

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

Defined in: [core/input.ts:45](https://github.com/bdryanovski/gamefoo/blob/main/src/core/input.ts#L45)

#### Returns

`void`
