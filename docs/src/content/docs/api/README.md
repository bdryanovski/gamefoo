---
title: '@dryanovski/gamefoo v0.4.0'
---

**@dryanovski/gamefoo v0.4.0**

***

# @dryanovski/gamefoo v0.4.0

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
| [Input](classes/Input.md) | Unified keyboard, mouse, and gamepad input manager. |
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
| [HealthKit](classes/HealthKit.md) | Health-tracking behaviour for a [Entity](classes/Entity.md). |
| [PathFollower](classes/PathFollower.md) | Abstract base class for all entity behaviours in the GameFoo engine. |
| [SpriteRender](classes/SpriteRender.md) | Sprite animation renderer that can be attached to any [Entity](classes/Entity.md). |

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
| [Bitmap](classes/Bitmap.md) | - |
| [BitmapAnimator](classes/BitmapAnimator.md) | - |
| [Control](classes/Control.md) | Keyboard and gamepad driven movement behaviour. |
| [Engine](classes/Engine.md) | Core game engine: manages the frame loop, rendering pipeline, and subsystem lifecycle. |
| [Grid](classes/Grid.md) | - |
| [InputMapper](classes/InputMapper.md) | Maps raw input to semantic actions using a control scheme. |
| [IntervalLoopDriver](classes/IntervalLoopDriver.md) | Server game loop driver using `setInterval`. |
| [IsometricProjection](classes/IsometricProjection.md) | - |
| [MapGenerator](classes/MapGenerator.md) | - |
| [MonitorSystem](classes/MonitorSystem.md) | Performance and debug overlay subsystem. |
| [Pathfinder](classes/Pathfinder.md) | - |
| [RAFLoopDriver](classes/RAFLoopDriver.md) | Browser game loop driver using `requestAnimationFrame`. |
| [TileLayer](classes/TileLayer.md) | - |
| [TileMap](classes/TileMap.md) | - |
| [TileSet](classes/TileSet.md) | - |
| [WebRenderer](classes/WebRenderer.md) | Canvas-backed [RenderContext](interfaces/RenderContext.md) implementation for browser games. |

### Icons

| Class | Description |
| ------ | ------ |
| [IconBitmap](classes/IconBitmap.md) | Pixel-perfect bitmap icons set |

### Map

| Class | Description |
| ------ | ------ |
| [AnimatedObject](classes/AnimatedObject.md) | A lightweight animated placement: advances a [Clip](interfaces/Clip.md) on its own timer and blits the current frame at a fixed screen position. |
| [AssetManager](classes/AssetManager.md) | Loads a [MapProject](interfaces/MapProject.md)'s images and pre-resolves its catalog into draw-ready [Frame](interfaces/Frame.md)s and [Clip](interfaces/Clip.md)s, so the render loop never performs string/id lookups. |
| [CollisionMap](classes/CollisionMap.md) | The per-screen collision world. Built once from a screen's static tile/ sprite colliders (indexed in a uniform spatial hash) plus a walkable "ground" grid, then queried each frame. Live objects and characters join as [occupants](classes/CollisionMap.md#addoccupant) whose colliders are read fresh (so they stay correct as objects move or change FSM state). |
| [MapManager](classes/MapManager.md) | The whole map: every screen, keyed by grid coordinate, plus a shared [AssetManager](classes/AssetManager.md) and a `current` pointer. |
| [MapObject](classes/MapObject.md) | Base class for every placed object driven by a [StateMachineDefinition](interfaces/StateMachineDefinition.md) (chests, torches, switches, enemies). |
| [MapObjectRegistry](classes/MapObjectRegistry.md) | Maps an object-type key to the [MapObject](classes/MapObject.md) subclass that should represent it. Populate it before [MapManager.load](classes/MapManager.md#load); machine placements whose key is unregistered fall back to the base `MapObject`. |
| [Screen](classes/Screen.md) | One navigable screen. |
| [ScreenRegistry](classes/ScreenRegistry.md) | Maps a screen coordinate (`"x,y"`) to the [Screen](classes/Screen.md) subclass that should represent it, with an optional default class applied to every other screen. Populate it before [MapManager.load](classes/MapManager.md#load); coordinates without an entry fall back to the default class, and if none is set, to the base [Screen](classes/Screen.md). |

### Shaders

| Class | Description |
| ------ | ------ |
| [GlowShader](classes/GlowShader.md) | An additive radial glow centred on the region — a cheap bloom for fire, lamps, portals, pickups. Uses the `lighter` composite so it brightens whatever is underneath rather than painting over it. |
| [ParticleShader](classes/ParticleShader.md) | A lightweight additive particle emitter — embers rising from a fire, sparks, dust, bubbles. Particles spawn across the region's width near its vertical middle, drift under `gravity`, and fade out over their lifetime. |
| [Shader](classes/Shader.md) | Base class for every screen effect ("shader"). |
| [ShaderStack](classes/ShaderStack.md) | An ordered collection of [Shader](classes/Shader.md)s bound to a single host (a game object or the engine). Handles keyed look-up plus the per-frame update and render fan-out, skipping disabled shaders. |
| [VignetteShader](classes/VignetteShader.md) | A full-screen vignette: transparent at the centre, darkening toward the edges. Register it with a [ShaderSystem](classes/ShaderSystem.md) for an engine-wide mood effect (dungeon gloom, focus framing, damage flash when animated). |

### SubSystems

| Class | Description |
| ------ | ------ |
| [CameraSystem](classes/CameraSystem.md) | Camera subsystem with optional zoom, smooth follow, and isometric-aware viewport transforms. |
| [CollisionSystem](classes/CollisionSystem.md) | CollisionSystem is responsible for detecting collisions between game objects. It uses the World class to manage and detect collisions based on registered collidable objects. |
| [GridDebugSystem](classes/GridDebugSystem.md) | SubSystem is a modular component of the game engine that can be added or removed as needed. It provides hooks for initialization, updating, rendering, and destruction. Each subsystem can have its own logic and state, and can interact with the engine and other subsystems. |
| [ObjectSystem](classes/ObjectSystem.md) | ObjectSystem is responsible for managing all non-player game objects within the engine. It maintains a central registry of game objects and delegates per-frame update and render calls to them. |
| [ShaderSystem](classes/ShaderSystem.md) | Engine-level shader host: applies full-screen [Shader](classes/Shader.md)s as a final post-render pass, after every other subsystem has drawn. |
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
| [CollidableOptions](interfaces/CollidableOptions.md) | Options for constructing a [Collidable](classes/Collidable.md) behaviour. |
| [PathFollowerConfig](interfaces/PathFollowerConfig.md) | Configuration options for [PathFollower](classes/PathFollower.md). |

### Debug

| Interface | Description |
| ------ | ------ |
| [GridDebugConfig](interfaces/GridDebugConfig.md) | Configuration for the [GridDebugSystem](classes/GridDebugSystem.md) subsystem. |

### General

| Interface | Description |
| ------ | ------ |
| [ActionBinding](interfaces/ActionBinding.md) | Complete binding for a single action, combining keyboard and gamepad inputs. |
| [AnimationDefinition](interfaces/AnimationDefinition.md) | A named animation: an ordered list of [SpriteRegionDefinition](interfaces/SpriteRegionDefinition.md) ids. |
| [Atari2600Colors](interfaces/Atari2600Colors.md) | Named colors for common Atari 2600 palette entries. |
| [C64Colors](interfaces/C64Colors.md) | Named colors for the Commodore 64 palette. |
| [CgaColors](interfaces/CgaColors.md) | Named colors for the CGA Mode 4 Palette 1 High Intensity. |
| [CgaFullColors](interfaces/CgaFullColors.md) | Full CGA 16-color palette (all available colors). |
| [Clip](interfaces/Clip.md) | A resolved animation: pre-looked-up frames + timing. |
| [CollisionDefinition](interfaces/CollisionDefinition.md) | One authored collider, tagged with a collision layer (solid, trigger, …). |
| [ColorPalette](interfaces/ColorPalette.md) | A basic color palette with a name and array of colors. |
| [ConsoleDefinition](interfaces/ConsoleDefinition.md) | Console definition with resolution and palette. |
| [ControlScheme](interfaces/ControlScheme.md) | A complete control scheme with all action bindings and aliases. |
| [EgaColors](interfaces/EgaColors.md) | Named colors for the EGA default palette. |
| [Frame](interfaces/Frame.md) | A loaded image region ready to place and render — no id lookups at draw time. |
| [GameBoyColors](interfaces/GameBoyColors.md) | Named colors for the Game Boy palette. |
| [GameObjectDefinition](interfaces/GameObjectDefinition.md) | A prefab grouping sprites/animations behind a [StateMachineDefinition](interfaces/StateMachineDefinition.md). |
| [GamepadBinding](interfaces/GamepadBinding.md) | Gamepad button/axis binding configuration. |
| [GeneratedPalette](interfaces/GeneratedPalette.md) | A palette that generates colors programmatically. |
| [GlowConfig](interfaces/GlowConfig.md) | Options for [GlowShader](classes/GlowShader.md). |
| [ImageDefinition](interfaces/ImageDefinition.md) | A source spritesheet image in the project's asset library. |
| [InputMapperOptions](interfaces/InputMapperOptions.md) | Options for configuring an [InputMapper](classes/InputMapper.md) instance. |
| [LoopDriver](interfaces/LoopDriver.md) | Abstraction over the mechanism that drives the game loop. |
| [MapData](interfaces/MapData.md) | The map: grid dimensions plus every screen keyed by `"x,y"`. |
| [MapLoadOptions](interfaces/MapLoadOptions.md) | Options for [MapManager.load](classes/MapManager.md#load) / [MapManager.fromUrl](classes/MapManager.md#fromurl). |
| [MapObjectContext](interfaces/MapObjectContext.md) | Everything a [MapObject](classes/MapObject.md) needs, assembled by the loader and injected once at construction. Custom classes read from this instead of reaching into the loader. |
| [MapProject](interfaces/MapProject.md) | A complete exported project — the single runtime input. |
| [NamedColorPalette](interfaces/NamedColorPalette.md) | A color palette with both array access and named color access. |
| [NesColors](interfaces/NesColors.md) | Named colors for common NES palette entries. |
| [ParticleConfig](interfaces/ParticleConfig.md) | Options for [ParticleShader](classes/ParticleShader.md). |
| [Pico8Colors](interfaces/Pico8Colors.md) | Named colors for the PICO-8 palette. |
| [PlaydateColors](interfaces/PlaydateColors.md) | Named colors for the Playdate palette. |
| [Rect](interfaces/Rect.md) | An axis-aligned rectangle in pixels — colliders, regions, bounds. |
| [RenderContext](interfaces/RenderContext.md) | The unified rendering surface interface used throughout the engine. |
| [SchemeOverrides](interfaces/SchemeOverrides.md) | Options for customizing or extending an existing control scheme. |
| [ScreenContext](interfaces/ScreenContext.md) | Everything a [Screen](classes/Screen.md) needs to build itself, bundled so custom screen subclasses only need a single `super(context)` call. |
| [ScreenData](interfaces/ScreenData.md) | A single navigable screen: a fill tile plus placements. |
| [ScreenResolution](interfaces/ScreenResolution.md) | Resolution definition object |
| [ShaderConfig](interfaces/ShaderConfig.md) | Base options shared by every [Shader](classes/Shader.md). |
| [ShaderRegion](interfaces/ShaderRegion.md) | The rectangular area a [Shader](classes/Shader.md) affects, expressed in the same coordinate space as the surrounding draw calls (logical game pixels). |
| [SpriteRegionDefinition](interfaces/SpriteRegionDefinition.md) | A named source rectangle cut from an [ImageDefinition](interfaces/ImageDefinition.md). |
| [StateMachineDefinition](interfaces/StateMachineDefinition.md) | An object's embedded finite state machine. |
| [Tic80Colors](interfaces/Tic80Colors.md) | Named colors for the TIC-80 / Sweetie 16 palette. |
| [Transform](interfaces/Transform.md) | Optional per-placement transform flags shared by tiles and objects. |
| [VignetteConfig](interfaces/VignetteConfig.md) | Options for [VignetteShader](classes/VignetteShader.md). |
| [WorldCollider](interfaces/WorldCollider.md) | A collision shape resolved into world (screen) pixels, tagged with its layer and — for object/character colliders — the [MapObject](classes/MapObject.md) that owns it (so a query can turn "what did I bump/touch" into "which object"). |

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

### General

| Type Alias | Description |
| ------ | ------ |
| [ButtonLabelStyle](type-aliases/ButtonLabelStyle.md) | Type for button label style. |
| [CollisionShape](type-aliases/CollisionShape.md) | A collision shape in object/sprite-local pixels: rectangle or circle. |
| [ConsoleName](type-aliases/ConsoleName.md) | Type for valid console names. |
| [ConsolePaletteName](type-aliases/ConsolePaletteName.md) | Type for the keys of CONSOLE_PALETTES. |
| [~~ConsoleResolutionName~~](type-aliases/ConsoleResolutionName.md) | Predefined supported console resolutions. |
| [ControlSchemeName](type-aliases/ControlSchemeName.md) | Type for valid control scheme names. |
| [HexColor](type-aliases/HexColor.md) | A hex color string in the format `#RRGGBB`. |
| [ImageResolver](type-aliases/ImageResolver.md) | Maps an [ImageDefinition](interfaces/ImageDefinition.md) to the URL to actually fetch. |
| [InputAction](type-aliases/InputAction.md) | Standard input actions used across all control schemes. |
| [InternalBitmapFontName](type-aliases/InternalBitmapFontName.md) | - |
| [InternalBitmapIconName](type-aliases/InternalBitmapIconName.md) | - |
| [~~IsometricCameraSystem~~](type-aliases/IsometricCameraSystem.md) | - |
| [MapObjectConstructor](type-aliases/MapObjectConstructor.md) | Constructor shape a [MapObjectRegistry](classes/MapObjectRegistry.md) stores. |
| [Placement](type-aliases/Placement.md) | One thing painted on a screen at a pixel offset and z-`level`. |
| [ScreenConstructor](type-aliases/ScreenConstructor.md) | Constructor shape a [ScreenRegistry](classes/ScreenRegistry.md) stores. |
| [ScreenCoordinate](type-aliases/ScreenCoordinate.md) | A screen's grid coordinate `[x, y]`. |
| [ScreenName](type-aliases/ScreenName.md) | A screen's stable identifier, `"x,y"`. |

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

## Functions

### Decorators

| Function | Description |
| ------ | ------ |
| [log](functions/log.md) | A method decorator that logs the method name, arguments, and return value. |

### General

| Function | Description |
| ------ | ------ |
| [binding](functions/binding.md) | Creates an [ActionBinding](interfaces/ActionBinding.md) from keys and optional gamepad config. |
| [createGameBoyPalette](functions/createGameBoyPalette.md) | Creates a custom Game Boy-style 4-color palette from a tint color. |
| [createScheme](functions/createScheme.md) | Creates a new control scheme from scratch with partial action definitions. |
| [extendScheme](functions/extendScheme.md) | Creates a new control scheme by extending an existing one with overrides. |
| [getButtonLabel](functions/getButtonLabel.md) | Gets a human-readable label for a gamepad button. |
| [getColor](functions/getColor.md) | Gets a color by index with wrapping (modulo). |
| [getConsole](functions/getConsole.md) | Gets a console definition by name. |
| [getControlScheme](functions/getControlScheme.md) | Gets a control scheme by name. |
| [getControlSchemeName](functions/getControlSchemeName.md) | Gets the control scheme name for a console. |
| [getDefaultControls](functions/getDefaultControls.md) | Gets the default control scheme for a console. |
| [getPalette](functions/getPalette.md) | Gets just the palette for a console. |
| [getResolution](functions/getResolution.md) | Gets just the resolution for a console. |
| [hexToRgb](functions/hexToRgb.md) | Converts a hex color string to RGB tuple. |
| [isGeneratedPalette](functions/isGeneratedPalette.md) | Type guard to check if a palette is a generated palette. |
| [listConsoles](functions/listConsoles.md) | Lists all available console names. |
| [listControlSchemes](functions/listControlSchemes.md) | Lists all available control scheme names. |
| [mergeSchemes](functions/mergeSchemes.md) | Merges multiple partial schemes into one complete scheme. |
| [nearestColor](functions/nearestColor.md) | Finds the nearest color in a palette to a target color. Uses Euclidean distance in RGB space. |
| [paletteGradient](functions/paletteGradient.md) | Creates a gradient of colors between two palette indices. |
| [paletteSize](functions/paletteSize.md) | Gets the number of colors in a palette. |
| [quantize](functions/quantize.md) | Alias for nearestColor. Quantizes any color to the nearest palette color. |
| [randomColor](functions/randomColor.md) | Gets a random color from a palette. |
| [rebindAction](functions/rebindAction.md) | Creates a new scheme with a single action's keys rebound. |
| [rgbToHex](functions/rgbToHex.md) | Converts RGB values to a hex color string. |
| [shapeBounds](functions/shapeBounds.md) | World-space AABB of a collision shape. |
| [to3Bit](functions/to3Bit.md) | Converts an 8-bit RGB value (0-255) to Genesis 3-bit format. |
| [to4Bit](functions/to4Bit.md) | Converts an 8-bit RGB value (0-255) to Game Gear 4-bit format. |
| [to5Bit](functions/to5Bit.md) | Converts an 8-bit RGB value (0-255) to SNES 5-bit format. |
| [toGameGear](functions/toGameGear.md) | Converts a hex color to the nearest Game Gear-compatible color. |
| [toGenesis](functions/toGenesis.md) | Converts a hex color to the nearest Genesis-compatible color. |
| [toSNES](functions/toSNES.md) | Converts a hex color to the nearest SNES-compatible color. |
| [translateShape](functions/translateShape.md) | Returns a copy of `shape` translated by `(dx, dy)` into world space. |
| [unassignedBinding](functions/unassignedBinding.md) | Creates an unassigned binding for actions not supported by a console. |

### Map

| Function | Description |
| ------ | ------ |
| [drawFrame](functions/drawFrame.md) | Blits a resolved [Frame](interfaces/Frame.md) at `(dx, dy)` applying optional flip/rotation from a [Transform](interfaces/Transform.md). |

## Variables

| Variable | Description |
| ------ | ------ |
| [ATARI\_2600](variables/ATARI_2600.md) | Atari 2600 128-color NTSC palette. |
| [ATARI\_2600\_CONTROLS](variables/ATARI_2600_CONTROLS.md) | Atari 2600 control scheme. |
| [BUTTON\_LABELS](variables/BUTTON_LABELS.md) | Console-specific button labels for UI display. |
| [C64](variables/C64.md) | Commodore 64 16-color palette. |
| [C64\_CONTROLS](variables/C64_CONTROLS.md) | Commodore 64 control scheme. |
| [CGA](variables/CGA.md) | CGA Mode 4, Palette 1, High Intensity (4 colors). |
| [CGA\_FULL](variables/CGA_FULL.md) | Full CGA 16-color palette. |
| [CONSOLE\_DEFAULT\_CONTROLS](variables/CONSOLE_DEFAULT_CONTROLS.md) | Maps console names to their default control scheme. |
| [~~CONSOLE\_PALETTES~~](variables/CONSOLE_PALETTES.md) | Collection of all console palettes for easy access. |
| [~~CONSOLE\_RESOLUTION~~](variables/CONSOLE_RESOLUTION.md) | Standard console resolutions. |
| [CONSOLES](variables/CONSOLES.md) | All supported console definitions. |
| [CONTROL\_SCHEMES](variables/CONTROL_SCHEMES.md) | Collection of all control schemes for easy access. |
| [CONTROLLER\_LEGEND](variables/CONTROLLER_LEGEND.md) | Console controller to Standard Gamepad mapping legend. |
| [DEFAULT\_CONTROLS](variables/DEFAULT_CONTROLS.md) | Default control scheme for PC gaming. |
| [DREAMCAST\_CONTROLS](variables/DREAMCAST_CONTROLS.md) | Sega Dreamcast control scheme. |
| [EGA](variables/EGA.md) | EGA default 16-color palette. |
| [EGA\_64](variables/EGA_64.md) | Full EGA 64-color palette. |
| [FAMICOM\_CONTROLS](variables/FAMICOM_CONTROLS.md) | Famicom control scheme. |
| [GAMEBOY](variables/GAMEBOY.md) | Original Game Boy (DMG) green-tinted palette. |
| [GAMEBOY\_CONTROLS](variables/GAMEBOY_CONTROLS.md) | Game Boy control scheme. |
| [GAMEGEAR](variables/GAMEGEAR.md) | Sega Game Gear 12-bit RGB generated palette. |
| [GAMEGEAR\_CONTROLS](variables/GAMEGEAR_CONTROLS.md) | Sega Game Gear control scheme. |
| [GAMEPAD\_AXIS](variables/GAMEPAD_AXIS.md) | Standard Gamepad axis indices. |
| [GAMEPAD\_BUTTON](variables/GAMEPAD_BUTTON.md) | Standard Gamepad button indices. |
| [GBA](variables/GBA.md) | GBA 15-bit RGB generated palette. |
| [GBA\_CONTROLS](variables/GBA_CONTROLS.md) | Game Boy Advance control scheme. |
| [GBC](variables/GBC.md) | GBC 15-bit RGB generated palette. |
| [GBC\_CONTROLS](variables/GBC_CONTROLS.md) | Game Boy Color control scheme. |
| [GENESIS](variables/GENESIS.md) | Sega Genesis / Mega Drive 9-bit RGB generated palette. |
| [GENESIS\_CONTROLS](variables/GENESIS_CONTROLS.md) | Sega Genesis / Mega Drive control scheme (3-button). |
| [~~IsometricCameraSystem~~](variables/IsometricCameraSystem.md) | - |
| [MEGADRIVE](variables/MEGADRIVE.md) | Alias for GENESIS for Mega Drive naming. |
| [N64\_CONTROLS](variables/N64_CONTROLS.md) | N64 control scheme. |
| [NDS\_CONTROLS](variables/NDS_CONTROLS.md) | Nintendo DS control scheme. |
| [NEO\_GEO](variables/NEO_GEO.md) | Neo Geo 15-bit RGB generated palette. |
| [NEO\_GEO\_CONTROLS](variables/NEO_GEO_CONTROLS.md) | Neo Geo control scheme. |
| [NES](variables/NES.md) | NES 54-color palette (FCEUX-based). |
| [NES\_CONTROLS](variables/NES_CONTROLS.md) | NES control scheme. |
| [PICO8](variables/PICO8.md) | PICO-8 16-color palette. |
| [PICO8\_CONTROLS](variables/PICO8_CONTROLS.md) | PICO-8 control scheme. |
| [PLAYDATE](variables/PLAYDATE.md) | Playdate 1-bit (2-color) palette. |
| [PLAYDATE\_CONTROLS](variables/PLAYDATE_CONTROLS.md) | Playdate control scheme. |
| [PS1\_CONTROLS](variables/PS1_CONTROLS.md) | PlayStation control scheme. |
| [PSP\_CONTROLS](variables/PSP_CONTROLS.md) | PSP control scheme. |
| [SNES](variables/SNES.md) | SNES 15-bit RGB generated palette. |
| [SNES\_CONTROLS](variables/SNES_CONTROLS.md) | SNES control scheme. |
| [TIC80](variables/TIC80.md) | TIC-80 / Sweetie 16 color palette. |
| [TIC80\_CONTROLS](variables/TIC80_CONTROLS.md) | TIC-80 control scheme. |
