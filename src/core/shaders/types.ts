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
