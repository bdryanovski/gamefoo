---
title: 'Class: ObjectSystem'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / ObjectSystem

# Class: ObjectSystem

Defined in: [subsystems/object\_system.ts:30](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/object_system.ts#L30)

ObjectSystem is responsible for managing all non-player game objects within the engine.
It maintains a central registry of game objects and delegates per-frame update and render calls to them.

## Since

0.2.0

## Implements

- [`SubSystem`](../interfaces/SubSystem.md)

## Constructors

### Constructor

```ts
new ObjectSystem(objects?: GameObject[], config?: ObjectSystemConfig): ObjectSystem;
```

Defined in: [subsystems/object\_system.ts:45](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/object_system.ts#L45)

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `objects` | [`GameObject`](../type-aliases/GameObject.md)[] | `[]` | Initial list of game objects to register. |
| `config?` | [`ObjectSystemConfig`](../interfaces/ObjectSystemConfig.md) | `undefined` | Optional configuration (depth sorting, etc.). |

#### Returns

`ObjectSystem`

#### Since

0.2.0

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="id"></a> `id` | `public` | `string` | `'objects'` | A unique identifier for the subsystem, used for registration and management within the engine. | [subsystems/object\_system.ts:31](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/object_system.ts#L31) |
| <a id="order"></a> `order` | `public` | `number` | `20` | Determines the order in which subsystems are updated and rendered. Subsystems with lower order values are processed first. | [subsystems/object\_system.ts:33](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/object_system.ts#L33) |
| <a id="_depthsort"></a> `_depthSort` | `private` | `boolean` | `undefined` | - | [subsystems/object\_system.ts:37](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/object_system.ts#L37) |
| <a id="objects"></a> `objects` | `private` | [`GameObjectRegister`](GameObjectRegister.md) | `undefined` | - | [subsystems/object\_system.ts:35](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/object_system.ts#L35) |

## Methods

### render()

```ts
render(ctx: RenderContext): void;
```

Defined in: [subsystems/object\_system.ts:58](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/object_system.ts#L58)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) |

#### Returns

`void`

#### Implementation of

[`SubSystem`](../interfaces/SubSystem.md).[`render`](../interfaces/SubSystem.md#render)

***

### update()

```ts
update(deltaTime: number): void;
```

Defined in: [subsystems/object\_system.ts:52](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/object_system.ts#L52)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |

#### Returns

`void`

#### Implementation of

[`SubSystem`](../interfaces/SubSystem.md).[`update`](../interfaces/SubSystem.md#update)
