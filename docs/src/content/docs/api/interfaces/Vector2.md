---
title: 'Interface: Vector2'
---

[**@dryanovski/gamefoo v0.0.1**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Vector2

# Interface: Vector2

Defined in: [types.ts:34](https://github.com/bdryanovski/gamefoo/blob/main/src/types.ts#L34)

A two-dimensional vector representing a position, direction, or offset.

Used pervasively across the engine for entity positions, velocities,
camera coordinates, and collider offsets.

## Since

0.1.0

## Examples

```ts
const position: Vector2 = { x: 100, y: 200 };
```

```ts
const direction: Vector2 = { x: Math.cos(angle), y: Math.sin(angle) };
```

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="x"></a> `x` | `number` | Horizontal component (increases rightward). | [types.ts:36](https://github.com/bdryanovski/gamefoo/blob/main/src/types.ts#L36) |
| <a id="y"></a> `y` | `number` | Vertical component (increases downward in canvas coordinates). | [types.ts:38](https://github.com/bdryanovski/gamefoo/blob/main/src/types.ts#L38) |
