/**
 * Shared types for the shader (screen-effect) system.
 *
 * GameFoo renders through a Canvas 2-D {@link RenderContext}, so a "shader"
 * here is a post-draw effect pass — emissive glow, particles, a full-screen
 * vignette — rather than a GPU/GLSL program. Effects that need pixel access
 * reach the raw context via {@link RenderContext.getCanvas} and become
 *
 * @category Shaders
 * @since 0.5.0
 */

import type { Frame, Transform } from '../map/types';

/**
 * The rectangular area a {@link Shader} affects, expressed in the same
 * coordinate space as the surrounding draw calls (logical game pixels).
 *
 * - Object shaders receive the host object's bounding box.
 * - Engine shaders receive the whole screen.
 */
export interface ShaderRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * One resolved draw unit of the host object's current state, as
 * {@link MapObject} renders it: a static {@link Frame} or a live animation
 * (exposed structurally — "has a current frame"), at a pixel offset from
 * the object origin, with optional flip/rotation.
 *
 * Object hosts forward their parts to {@link Shader.render} so silhouette
 * effects (e.g. {@link OutlineShader}) can trace the host's actual art.
 * Screen-level hosts have no parts and omit them.
 *
 * @category Shaders
 * @since 0.5.0
 */
export interface ShaderPart {
  /**
   * Static frame, when the part is a fixed sprite.
   */
  frame?: Frame;
  /**
   * Live animation part — only its current frame is read here.
   */
  anim?: { readonly frame: Frame | undefined };
  /**
   * Pixel offset from the host origin (`region.x`/`region.y`).
   */
  ox: number;
  /**
   * Pixel offset from the host origin.
   */
  oy: number;
  /**
   * Optional flip/rotation applied to the part.
   */
  transform?: Transform;
}

/**
 * Base options shared by every {@link Shader}.
 */
export interface ShaderConfig {
  /**
   * Whether the shader starts enabled. Disabled shaders are skipped by
   * both update and render passes.
   *
   * @defaultValue `true`
   */
  enabled?: boolean;
}
