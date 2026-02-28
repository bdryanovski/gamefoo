---
title: '@dryanovski/gamefoo v0.0.1'
---

**@dryanovski/gamefoo v0.0.1**

***

# @dryanovski/gamefoo v0.0.1

GameFoo — a lightweight 2-D canvas game engine.

This barrel module re-exports every public class, behaviour, utility,
and type so consumers can import from a single entry point:

```ts
import { Engine, Player, Input, Collidable } from "gamefoo";
```

## Since

0.1.0

## Classes

### Core

| Class | Description |
| ------ | ------ |
| [Camera](classes/Camera.md) | A 2-D viewport camera that tracks a target position within the game world. |
| [GameObjectRegister](classes/GameObjectRegister.md) | Central registry that stores and manages all non-player [game objects](type-aliases/GameObject.md) within the engine. |
| [Input](classes/Input.md) | Unified keyboard and mouse input manager. |
| [World](classes/World.md) | Spatial collision-detection world. |

### Utilities

| Class | Description |
| ------ | ------ |
| [PerlinNoise](classes/PerlinNoise.md) | Deterministic 2-D Perlin noise generator with fractal Brownian motion (fBm) support. |

### Behaviours

| Class | Description |
| ------ | ------ |
| [Behaviour](classes/Behaviour.md) | Abstract base class for all entity behaviours in the GameFoo engine. |
| [Collidable](classes/Collidable.md) | Collision behaviour that can be attached to any [DynamicEntity](classes/DynamicEntity.md). |
| [Control](classes/Control.md) | Keyboard-driven movement behaviour for a [DynamicEntity](classes/DynamicEntity.md). |
| [HealthKit](classes/HealthKit.md) | Health-tracking behaviour for a [DynamicEntity](classes/DynamicEntity.md). |

### Entities

| Class | Description |
| ------ | ------ |
| [DynamicEntity](classes/DynamicEntity.md) | Abstract entity with built-in velocity and speed, suitable for any game object that moves (players, NPCs, projectiles, etc.). |
| [Entity](classes/Entity.md) | Abstract base class for every game entity in the GameFoo engine. |
| [Player](classes/Player.md) | Default player entity with convenience accessors for common behaviours. |

### Fonts

| Class | Description |
| ------ | ------ |
| [FontBitmap](classes/FontBitmap.md) | Pixel-perfect bitmap font renderer. |

### General

| Class | Description |
| ------ | ------ |
| [Engine](classes/Engine.md) | Core game engine responsible for the game loop, rendering pipeline, entity management, collision detection, and camera tracking. |

## Interfaces

### Types

| Interface | Description |
| ------ | ------ |
| [CollisionInfo](interfaces/CollisionInfo.md) | Payload delivered to a [Collidable.onCollision](classes/Collidable.md#oncollision) callback when two colliders overlap. |
| [Vector2](interfaces/Vector2.md) | A two-dimensional vector representing a position, direction, or offset. |

## Type Aliases

### Types

| Type Alias | Description |
| ------ | ------ |
| [ColliderShape](type-aliases/ColliderShape.md) | Discriminated union describing the shape of a collision volume. |
| [GameObject](type-aliases/GameObject.md) | Union of all entity types that can be managed by the engine's [GameObjectRegister](classes/GameObjectRegister.md). |
