---
title: 'Type Alias: GameObject'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / GameObject

# Type Alias: GameObject

```ts
type GameObject = 
  | Entity
  | DynamicEntity;
```

Defined in: [generic\_types.ts:70](https://github.com/bdryanovski/gamefoo/blob/main/src/generic_types.ts#L70)

Union of all entity types that can be managed by the engine's
[GameObjectRegister](../classes/GameObjectRegister.md).

Covers both static entities ([Entity](../classes/Entity.md)) and physics-capable
entities ([DynamicEntity](../classes/DynamicEntity.md)).

## Since

0.1.0

## See

 - [Entity](../classes/Entity.md)        — base abstract entity
 - [DynamicEntity](../classes/DynamicEntity.md)  — entity with velocity and speed
