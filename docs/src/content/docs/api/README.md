---
title: '@dryanovski/gamefoo v0.3.0'
---

**@dryanovski/gamefoo v0.3.0**

***

# @dryanovski/gamefoo v0.3.0

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
| [Asset](classes/Asset.md) | Static image asset loader with an in-memory cache. |
| [Camera](classes/Camera.md) | A 2-D viewport camera that tracks a target position within the game world. |
| [EnhancedCamera](classes/EnhancedCamera.md) | A 2-D viewport camera that tracks a target position within the game world. |
| [GameObjectRegister](classes/GameObjectRegister.md) | Central registry that stores and manages all non-player [game objects](type-aliases/GameObject.md) within the engine. |
| [Input](classes/Input.md) | Unified keyboard and mouse input manager. |
| [Sprite](classes/Sprite.md) | Metadata wrapper around an HTMLImageElement that describes how it is sliced into a uniform grid of frames and what named animations are available. |
| [StateMachine](classes/StateMachine.md) | Generic, type-safe finite state machine. |
| [World](classes/World.md) | Spatial collision-detection world. |

### Utilities

| Class | Description |
| ------ | ------ |
| [PerlinNoise](classes/PerlinNoise.md) | Deterministic 2-D Perlin noise generator with fractal Brownian motion (fBm) support. |

### Behaviours

| Class | Description |
| ------ | ------ |
| [Behaviour](classes/Behaviour.md) | Abstract base class for all entity behaviours in the GameFoo engine. |
| [Collidable](classes/Collidable.md) | Collision behaviour that can be attached to any [Entity](classes/Entity.md). |
| [Control](classes/Control.md) | Keyboard-driven movement behaviour for a [Entity](classes/Entity.md). |
| [HealthKit](classes/HealthKit.md) | Health-tracking behaviour for a [Entity](classes/Entity.md). |
| [PathFollower](classes/PathFollower.md) | Abstract base class for all entity behaviours in the GameFoo engine. |
| [SpriteRender](classes/SpriteRender.md) | Sprite animation renderer that can be attached to any [Entity](classes/Entity.md). |
| [TerminalRender](classes/TerminalRender.md) | Terminal visual renderer behaviour. |

### Entities

| Class | Description |
| ------ | ------ |
| [DynamicEntity](classes/DynamicEntity.md) | Abstract entity with built-in velocity and speed, suitable for any game object that moves (players, NPCs, projectiles, etc.). |
| [Entity](classes/Entity.md) | Abstract base class for every game entity in the GameFoo engine. |
| [Player](classes/Player.md) | Default player entity with convenience accessors for common behaviours. |
| [Text](classes/Text.md) | Abstract base class for Text and Label alike objects |

### Fonts

| Class | Description |
| ------ | ------ |
| [FontBitmap](classes/FontBitmap.md) | Pixel-perfect bitmap font renderer. |

### General

| Class | Description |
| ------ | ------ |
| [Engine](classes/Engine.md) | Core game engine: manages the frame loop, rendering pipeline, and subsystem lifecycle. |
| [Grid](classes/Grid.md) | - |
| [IntervalLoopDriver](classes/IntervalLoopDriver.md) | Terminal / server game loop driver using `setInterval`. |
| [IsometricProjection](classes/IsometricProjection.md) | - |
| [MapGenerator](classes/MapGenerator.md) | - |
| [Pathfinder](classes/Pathfinder.md) | - |
| [RAFLoopDriver](classes/RAFLoopDriver.md) | Browser game loop driver using `requestAnimationFrame`. |
| [TerminalInputDriver](classes/TerminalInputDriver.md) | Terminal keyboard input driver using `process.stdin` in raw mode. |
| [TerminalRenderContext](classes/TerminalRenderContext.md) | ANSI / TTY terminal [RenderContext](interfaces/RenderContext.md) implementation for Bun / Node. |
| [TileLayer](classes/TileLayer.md) | - |
| [TileMap](classes/TileMap.md) | - |
| [TileSet](classes/TileSet.md) | - |
| [WebRenderer](classes/WebRenderer.md) | Canvas-backed [RenderContext](interfaces/RenderContext.md) implementation for browser games. |

### Icons

| Class | Description |
| ------ | ------ |
| [IconBitmap](classes/IconBitmap.md) | Pixel-perfect bitmap icons set |

### SubSystems

| Class | Description |
| ------ | ------ |
| [CameraSystem](classes/CameraSystem.md) | Camera subsystem with optional zoom, smooth follow, and isometric-aware viewport transforms. |
| [CollisionSystem](classes/CollisionSystem.md) | CollisionSystem is responsible for detecting collisions between game objects. It uses the World class to manage and detect collisions based on registered collidable objects. |
| [GridDebugSystem](classes/GridDebugSystem.md) | SubSystem is a modular component of the game engine that can be added or removed as needed. It provides hooks for initialization, updating, rendering, and destruction. Each subsystem can have its own logic and state, and can interact with the engine and other subsystems. |
| [MonitorSystem](classes/MonitorSystem.md) | SubSystem is a modular component of the game engine that can be added or removed as needed. It provides hooks for initialization, updating, rendering, and destruction. Each subsystem can have its own logic and state, and can interact with the engine and other subsystems. |
| [ObjectSystem](classes/ObjectSystem.md) | ObjectSystem is responsible for managing all non-player game objects within the engine. It maintains a central registry of game objects and delegates per-frame update and render calls to them. |
| [TilemapSystem](classes/TilemapSystem.md) | SubSystem is a modular component of the game engine that can be added or removed as needed. It provides hooks for initialization, updating, rendering, and destruction. Each subsystem can have its own logic and state, and can interact with the engine and other subsystems. |

## Interfaces

### Core

| Interface | Description |
| ------ | ------ |
| [EnhancedCameraConfig](interfaces/EnhancedCameraConfig.md) | Configuration options for [EnhancedCamera](classes/EnhancedCamera.md). |
| [SpriteFrame](interfaces/SpriteFrame.md) | Describes the position and size of a single frame within a [Sprite](classes/Sprite.md) sheet. |

### Utilities

| Interface | Description |
| ------ | ------ |
| [BiomeRule](interfaces/BiomeRule.md) | A biome rule that maps a noise-value range to a tile ID and walkability status. |
| [GeneratedMapData](interfaces/GeneratedMapData.md) | Output of [MapGenerator.generateTileData](classes/MapGenerator.md#generatetiledata). |
| [MapGeneratorConfig](interfaces/MapGeneratorConfig.md) | Configuration for constructing a [MapGenerator](classes/MapGenerator.md). |
| [PathfinderConfig](interfaces/PathfinderConfig.md) | Configuration for constructing a [Pathfinder](classes/Pathfinder.md). |
| [PathNode](interfaces/PathNode.md) | A single node in the A* open/closed sets. |

### Behaviours

| Interface | Description |
| ------ | ------ |
| [PathFollowerConfig](interfaces/PathFollowerConfig.md) | Configuration options for [PathFollower](classes/PathFollower.md). |

### Debug

| Interface | Description |
| ------ | ------ |
| [GridDebugConfig](interfaces/GridDebugConfig.md) | Configuration for the [GridDebugSystem](classes/GridDebugSystem.md) subsystem. |

### General

| Interface | Description |
| ------ | ------ |
| [InputDriver](interfaces/InputDriver.md) | Abstraction over platform-specific keyboard input. |
| [LoopDriver](interfaces/LoopDriver.md) | Abstraction over the mechanism that drives the game loop. |
| [RenderContext](interfaces/RenderContext.md) | The unified rendering surface interface used throughout the engine. |
| [TerminalCell](interfaces/TerminalCell.md) | A single terminal character cell. |
| [TerminalGlyph](interfaces/TerminalGlyph.md) | Describes the visual appearance of an entity in terminal mode. |
| [TerminalRenderConfig](interfaces/TerminalRenderConfig.md) | Configuration for [TerminalRenderContext](classes/TerminalRenderContext.md). |

### Grid

| Interface | Description |
| ------ | ------ |
| [GridCell](interfaces/GridCell.md) | A single cell within a [Grid](classes/Grid.md). |
| [GridConfig](interfaces/GridConfig.md) | Configuration object for constructing a [Grid](classes/Grid.md). |
| [IsoConfig](interfaces/IsoConfig.md) | Configuration for constructing an [IsometricProjection](classes/IsometricProjection.md). |
| [VisibleRange](interfaces/VisibleRange.md) | A range of grid cells visible within a viewport rectangle. |

### SubSystems

| Interface | Description |
| ------ | ------ |
| [ObjectSystemConfig](interfaces/ObjectSystemConfig.md) | Configuration options for [ObjectSystem](classes/ObjectSystem.md). |
| [SubSystem](interfaces/SubSystem.md) | SubSystem is a modular component of the game engine that can be added or removed as needed. It provides hooks for initialization, updating, rendering, and destruction. Each subsystem can have its own logic and state, and can interact with the engine and other subsystems. |

### Tilemap

| Interface | Description |
| ------ | ------ |
| [TileLayerConfig](interfaces/TileLayerConfig.md) | Configuration for constructing a [TileLayer](classes/TileLayer.md). |
| [TileMapConfig](interfaces/TileMapConfig.md) | Configuration for constructing a [TileMap](classes/TileMap.md). |
| [TileSetConfig](interfaces/TileSetConfig.md) | Configuration for constructing a [TileSet](classes/TileSet.md). |

### Types

| Interface | Description |
| ------ | ------ |
| [CollisionInfo](interfaces/CollisionInfo.md) | Payload delivered to a [Collidable.onCollision](classes/Collidable.md#oncollision) callback when two colliders overlap. |
| [Demension](interfaces/Demension.md) | An object representin 2D demensions of anything |
| [Vector2](interfaces/Vector2.md) | A two-dimensional vector representing a position, direction, or offset. |
| [WorldBounds](interfaces/WorldBounds.md) | Axis-aligned rectangle used internally by the collision detection system ([World](classes/World.md)) to represent an entity's bounding volume in world-space. |

## Type Aliases

### Utilities

| Type Alias | Description |
| ------ | ------ |
| [HeuristicName](type-aliases/HeuristicName.md) | Heuristic function name for A* distance estimation. |

### Behaviours

| Type Alias | Description |
| ------ | ------ |
| [CollidableOptions](type-aliases/CollidableOptions.md) | Options for constructing a [Collidable](classes/Collidable.md) behaviour. |

### General

| Type Alias | Description |
| ------ | ------ |
| [ConsoleName](type-aliases/ConsoleName.md) | Predefined supported console resolutions |
| [InternalBitmapFontName](type-aliases/InternalBitmapFontName.md) | - |
| [InternalBitmapIconName](type-aliases/InternalBitmapIconName.md) | - |
| [~~IsometricCameraSystem~~](type-aliases/IsometricCameraSystem.md) | - |
| [ScreenResolution](type-aliases/ScreenResolution.md) | Resolution definition object |
| [TerminalBuffer](type-aliases/TerminalBuffer.md) | A 2-D grid of [TerminalCell](interfaces/TerminalCell.md) objects representing the full terminal screen (`buffer[row][col]`). |

### Grid

| Type Alias | Description |
| ------ | ------ |
| [IsoLayout](type-aliases/IsoLayout.md) | Layout mode for isometric tile placement. |

### Types

| Type Alias | Description |
| ------ | ------ |
| [ColliderShape](type-aliases/ColliderShape.md) | Discriminated union describing the shape of a collision volume. |
| [~~Dimension~~](type-aliases/Dimension.md) | Alias for [Demension](interfaces/Demension.md) with correct spelling. |
| [GameObject](type-aliases/GameObject.md) | Union of all entity types that can be managed by the engine's [GameObjectRegister](classes/GameObjectRegister.md). |

## Enumerations

| Enumeration | Description |
| ------ | ------ |
| [INPUT\_CONTROLS](enumerations/INPUT_CONTROLS.md) | Input controls is developer friendly name for predefined controlled scheme |
| [INPUT\_KEY](enumerations/INPUT_KEY.md) | Representation of input keys provided from external controllers |

## Functions

### Decorators

| Function | Description |
| ------ | ------ |
| [log](functions/log.md) | A method decorator that logs the method name, arguments, and return value. |

### General

| Function | Description |
| ------ | ------ |
| [createBunLoop](functions/createBunLoop.md) | - |

## Variables

| Variable | Description |
| ------ | ------ |
| [CONSOLE\_RESOLUTION](variables/CONSOLE_RESOLUTION.md) | Standart Console resolution |
| [~~IsometricCameraSystem~~](variables/IsometricCameraSystem.md) | - |
