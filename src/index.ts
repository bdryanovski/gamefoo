/**
 * GameFoo — a lightweight 2-D canvas game engine.
 *
 * This barrel module re-exports every public class, behaviour, utility,
 * and type so consumers can import from a single entry point:
 *
 * ```ts
 * import { Engine, Player, Input, Collidable } from "gamefoo";
 * ```
 *
 * @category Core
 * @module gamefoo
 * @since 0.1.0
 */

// ── Assets / Rendering ─────────────────────────────────────────────
export { default as Asset } from "./core/asset";
// ── Core ────────────────────────────────────────────────────────────
export { Behaviour } from "./core/behaviour";
export { Collidable } from "./core/behaviours/collidable";
export { Control } from "./core/behaviours/control";
export { HealthKit } from "./core/behaviours/healtkit";
export type { PathFollowerConfig } from "./core/behaviours/path_follower";
export { PathFollower } from "./core/behaviours/path_follower";
export { default as SpriteRender } from "./core/behaviours/sprite_render";
export { default as Camera } from "./core/camera";
export { default as Engine } from "./core/engine";
export type { EnhancedCameraConfig } from "./core/enhanced_camera";
export { EnhancedCamera } from "./core/enhanced_camera";
export type { InternalBitmapFontName } from "./core/fonts/font_bitmap";
export { default as FontBitmap } from "./core/fonts/font_bitmap";
export { default as GameObjectRegister } from "./core/game_object_register";
// ── Grid ────────────────────────────────────────────────────────────
export { Grid } from "./core/grid/grid";
export type { GridCell, GridConfig } from "./core/grid/grid_types";
export { IsometricProjection } from "./core/grid/isometric";
export type { IsoConfig, IsoLayout, VisibleRange } from "./core/grid/isometric_types";
// ── Icons ───────────────────────────────────────────────────────────
export type { InternalBitmapIconName } from "./core/icons/icon_bitmap";
export { default as IconBitmap } from "./core/icons/icon_bitmap";
export { default as Input } from "./core/input";
export { default as Sprite } from "./core/sprite";
export { default as StateMachine } from "./core/state_machine";
// ── Tilemap ─────────────────────────────────────────────────────────
export { TileLayer } from "./core/tilemap/tile_layer";
export { TileMap } from "./core/tilemap/tilemap";
export { TilemapSystem } from "./core/tilemap/tilemap_system";
export type { TileLayerConfig, TileMapConfig, TileSetConfig } from "./core/tilemap/tilemap_types";
export { TileSet } from "./core/tilemap/tileset";
// ── Utilities ───────────────────────────────────────────────────────
export { MapGenerator } from "./core/utils/map_generator";
export type { BiomeRule, GeneratedMapData, MapGeneratorConfig } from "./core/utils/map_generator_types";
export { Pathfinder } from "./core/utils/pathfinding";
export type { HeuristicName, PathfinderConfig, PathNode } from "./core/utils/pathfinding_types";
export { PerlinNoise } from "./core/utils/perlin_noise";
// ── World / Physics ─────────────────────────────────────────────────
export { default as World } from "./core/world";
// ── Debug ───────────────────────────────────────────────────────────
export { GridDebugSystem } from "./debug/grid_debug";
export type { GridDebugConfig } from "./debug/grid_debug_types";
export { default as Monitor } from "./debug/monitor";
// ── Decorators ──────────────────────────────────────────────────────
export { log } from "./decorators/index";
// ── Entities ────────────────────────────────────────────────────────
export { default as DynamicEntity } from "./entities/dynamic_entity";
export { default as Entity } from "./entities/entity";
export { default as Player } from "./entities/player";
export { default as Text } from "./entities/text";
// ── Type-only exports ───────────────────────────────────────────────
export type { ColliderShape, CollisionInfo, Demension, GameObject, Vector2 } from "./generic_types";
export { CameraSystem } from "./subsystems/camera_system";
// ── Subsystems ──────────────────────────────────────────────────────
export { CollisionSystem } from "./subsystems/collision_system";
export { IsometricCameraSystem } from "./subsystems/iso_camera_system";
export { MonitorSystem } from "./subsystems/monitor_system";
export type { ObjectSystemConfig } from "./subsystems/object_system";
export { ObjectSystem } from "./subsystems/object_system";
export type { SubSystem } from "./subsystems/types";
