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

// --- Assets / Rendering ───────────────────────────────────────────────
export { default as Asset } from "./core/asset";
// ── Core ────────────────────────────────────────────────────────────
export { Behaviour } from "./core/behaviour";
export { Collidable } from "./core/behaviours/collidable";
export { Control } from "./core/behaviours/control";
export { HealthKit } from "./core/behaviours/healtkit";
export { default as SpriteRender } from "./core/behaviours/sprite_render";
export { default as Camera } from "./core/camera";
export { default as Engine } from "./core/engine";
export type { InternalBitmapFontName } from "./core/fonts/font_bitmap";
export { default as FontBitmap } from "./core/fonts/font_bitmap";
export { default as FontBitmapPrebuild } from "./core/fonts/font_bitmap_prebuild";
export { default as GameObjectRegister } from "./core/game_object_register";
export { default as Input } from "./core/input";
export { default as Sprite } from "./core/sprite";
// ── Utilities ───────────────────────────────────────────────────────
export { PerlinNoise } from "./core/utils/perlin_noise";
// ── World / Physics ─────────────────────────────────────────────────
export { default as World } from "./core/world";
// -- Debug -----
export { default as Monitor } from "./debug/monitor";
// ── Decorators ───────────────────────────────────────────────────────
export { log } from "./decorators/index";
// ── Entities ────────────────────────────────────────────────────────
export { default as DynamicEntity } from "./entities/dynamic_entity";
export { default as Entity } from "./entities/entity";
export { default as Player } from "./entities/player";
export { default as Text } from "./entities/text";
// ── Type-only exports ───────────────────────────────────────────────
export type { ColliderShape, CollisionInfo, Demension, GameObject, Vector2 } from "./generic_types";
export { CameraSystem } from "./subsystems/camera_system";
// ── Subsystems ───────────────────────────────────────────────────
export { CollisionSystem } from "./subsystems/collision_system";
export { MonitorSystem } from "./subsystems/monitor_system";
export { ObjectSystem } from "./subsystems/object_system";
export type { SubSystem } from "./subsystems/types";
