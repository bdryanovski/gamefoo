---
title: 'Class: World'
---

[**@dryanovski/gamefoo v0.0.1**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / World

# Class: World

Defined in: [core/world.ts:4](https://github.com/bdryanovski/gamefoo/blob/main/src/core/world.ts#L4)

## Constructors

### Constructor

```ts
new World(): World;
```

#### Returns

`World`

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="colliders"></a> `colliders` | `private` | `Set`\<[`Collidable`](Collidable.md)\> | [core/world.ts:5](https://github.com/bdryanovski/gamefoo/blob/main/src/core/world.ts#L5) |

## Methods

### detect()

```ts
detect(): void;
```

Defined in: [core/world.ts:15](https://github.com/bdryanovski/gamefoo/blob/main/src/core/world.ts#L15)

#### Returns

`void`

***

### register()

```ts
register(collider: Collidable): void;
```

Defined in: [core/world.ts:7](https://github.com/bdryanovski/gamefoo/blob/main/src/core/world.ts#L7)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `collider` | [`Collidable`](Collidable.md) |

#### Returns

`void`

***

### unregister()

```ts
unregister(collider: Collidable): void;
```

Defined in: [core/world.ts:11](https://github.com/bdryanovski/gamefoo/blob/main/src/core/world.ts#L11)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `collider` | [`Collidable`](Collidable.md) |

#### Returns

`void`

***

### aabbVSAabb()

```ts
private aabbVSAabb(a: WorldBounds, b: WorldBounds): boolean;
```

Defined in: [core/world.ts:91](https://github.com/bdryanovski/gamefoo/blob/main/src/core/world.ts#L91)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `a` | `WorldBounds` |
| `b` | `WorldBounds` |

#### Returns

`boolean`

***

### circleVSAAabb()

```ts
private circleVSAAabb(
   circle: Collidable, 
   circleBounds: WorldBounds, 
   rect: WorldBounds): boolean;
```

Defined in: [core/world.ts:118](https://github.com/bdryanovski/gamefoo/blob/main/src/core/world.ts#L118)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `circle` | [`Collidable`](Collidable.md) |
| `circleBounds` | `WorldBounds` |
| `rect` | `WorldBounds` |

#### Returns

`boolean`

***

### circleVSCircle()

```ts
private circleVSCircle(
   a: Collidable, 
   boundsA: WorldBounds, 
   b: Collidable, 
   boundsB: WorldBounds): boolean;
```

Defined in: [core/world.ts:97](https://github.com/bdryanovski/gamefoo/blob/main/src/core/world.ts#L97)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `a` | [`Collidable`](Collidable.md) |
| `boundsA` | `WorldBounds` |
| `b` | [`Collidable`](Collidable.md) |
| `boundsB` | `WorldBounds` |

#### Returns

`boolean`

***

### intersects()

```ts
private intersects(
   a: Collidable, 
   boundsA: WorldBounds, 
   b: Collidable, 
   boundsB: WorldBounds): boolean;
```

Defined in: [core/world.ts:69](https://github.com/bdryanovski/gamefoo/blob/main/src/core/world.ts#L69)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `a` | [`Collidable`](Collidable.md) |
| `boundsA` | `WorldBounds` |
| `b` | [`Collidable`](Collidable.md) |
| `boundsB` | `WorldBounds` |

#### Returns

`boolean`

***

### resolveOverlap()

```ts
private resolveOverlap(
   a: Collidable, 
   boundsA: WorldBounds, 
   b: Collidable, 
   boundsB: WorldBounds): void;
```

Defined in: [core/world.ts:133](https://github.com/bdryanovski/gamefoo/blob/main/src/core/world.ts#L133)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `a` | [`Collidable`](Collidable.md) |
| `boundsA` | `WorldBounds` |
| `b` | [`Collidable`](Collidable.md) |
| `boundsB` | `WorldBounds` |

#### Returns

`void`

***

### tagsOverlap()

```ts
private tagsOverlap(wants: Set<string>, has: Set<string>): boolean;
```

Defined in: [core/world.ts:62](https://github.com/bdryanovski/gamefoo/blob/main/src/core/world.ts#L62)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `wants` | `Set`\<`string`\> |
| `has` | `Set`\<`string`\> |

#### Returns

`boolean`
