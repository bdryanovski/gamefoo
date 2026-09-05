---
title: 'Interface: Vector2'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Vector2

# Interface: Vector2

Defined in: [generic\_types.ts:33](https://github.com/bdryanovski/gamefoo/blob/main/src/generic_types.ts#L33)

A two-dimensional vector representing a position, direction, or offset.

Used pervasively across the engine for entity positions, velocities,
camera coordinates, and collider offsets.

## Since

0.1.0

## Examples

**Basic position**

```ts
const position: Vector2 = { x: 100, y: 200 };
```

**Direction vector**

```ts
const direction: Vector2 = { x: Math.cos(angle), y: Math.sin(angle) };
```

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="x"></a> `x` | `number` | Horizontal component (increases rightward). | [generic\_types.ts:37](https://github.com/bdryanovski/gamefoo/blob/main/src/generic_types.ts#L37) |
| <a id="y"></a> `y` | `number` | Vertical component (increases downward in canvas coordinates). | [generic\_types.ts:41](https://github.com/bdryanovski/gamefoo/blob/main/src/generic_types.ts#L41) |
