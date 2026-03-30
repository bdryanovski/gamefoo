/**
 * @deprecated Use {@link CameraSystem} instead. `CameraSystem` now supports
 * zoom, smooth follow, and isometric projections with the same feature set.
 *
 * This file is kept for backward compatibility and will be removed in the next
 * major version.
 *
 * @since 0.4.0
 * @category SubSystems
 *
 * @example Migration
 * ```ts
 * // Before:
 * import { IsometricCameraSystem } from "gamefoo";
 * engine.use(new IsometricCameraSystem(800, 600, () => player.getPosition(), isoProjection, { zoom: 2 }));
 *
 * // After:
 * import { CameraSystem } from "gamefoo";
 * engine.use(new CameraSystem(800, 600, () => player.getPosition(), isoProjection, { zoom: 2 }));
 * ```
 */

import { CameraSystem } from './camera_system';

/**
 * @deprecated Use {@link CameraSystem} instead.
 */
export const IsometricCameraSystem = CameraSystem;

/**
 * @deprecated Use {@link CameraSystem} instead.
 */
export type IsometricCameraSystem = CameraSystem;
