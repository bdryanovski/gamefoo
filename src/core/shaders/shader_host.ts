import Node from '../../entities/node';
import type { DeltaTime } from '@/generic_types';
import type { RenderContext } from '../renderer/type';
import type { Shader } from './shader';
import { ShaderStack } from './shader_stack';
import type { ShaderPart, ShaderRegion } from './types';

/**
 * A {@link Node} that carries a stack of {@link Shader}s — anything on screen
 * that effects a region of itself: an object, a character, an HUD.
 *
 * Subclasses get the keyed shader API ({@link ShaderHost.attachShader} and
 * friends) plus {@link ShaderHost.renderShaders}, which frames the host's own
 * draw between the two shader passes: shaders flagged `under` (ground decals,
 * silhouettes, {@link OutlineShader}) draw **beneath** the host, the rest draw
 * on top. Wrap the draw call rather than calling the passes by hand, so the
 * sandwich can't be got wrong:
 *
 * ```ts
 * override render(ctx: RenderContext): void {
 *   this.renderShaders(ctx, () => {
 *     drawFrame(ctx, this.frame, this.x, this.y);
 *   });
 * }
 * ```
 *
 * Hosts that render composite art override {@link ShaderHost.shaderParts} to
 * forward it, letting silhouette shaders trace the actual pixels instead of
 * the bounding box.
 *
 * @category Shaders
 * @since 0.5.0
 *
 * @see {@link Entity}    — identity, transform, behaviours
 * @see {@link MapObject} — authored, stateful objects
 * @see {@link ShaderStack}
 */
export default abstract class ShaderHost extends Node {
  /**
   * Screen effects attached to this host, in render order.
   */
  private readonly shaderStack = new ShaderStack();

  /**
   * Attaches a screen shader to this host; returns it for configuration.
   *
   * @param shader - The shader to attach.
   */
  attachShader<T extends Shader>(shader: T): T {
    return this.shaderStack.attach(shader);
  }

  /**
   * The attached shader with `type`, or `undefined`.
   *
   * @param type - The shader's {@link Shader.type} key.
   */
  getShader<T extends Shader>(type: string): T | undefined {
    return this.shaderStack.get<T>(type);
  }

  /**
   * Whether a shader with `type` is attached.
   *
   * @param type - The shader's {@link Shader.type} key.
   */
  hasShader(type: string): boolean {
    return this.shaderStack.has(type);
  }

  /**
   * Detaches the shader with `type`, if present.
   *
   * @param type - The shader's {@link Shader.type} key.
   */
  detachShader(type: string): void {
    this.shaderStack.detach(type);
  }

  /**
   * The area this host's shaders affect — its bounding box by default.
   * Override when the host draws something wider or narrower than its size
   * (e.g. {@link TextObject}'s estimated text box).
   */
  protected bounds(): ShaderRegion {
    const { width, height } = this.getSize();
    return { x: this.x, y: this.y, width, height };
  }

  /**
   * The host's current draw parts, for shaders that trace its art rather than
   * its bounding box. `undefined` for a host that draws a single primitive.
   *
   * @see {@link ShaderPart}
   */
  protected shaderParts(): readonly ShaderPart[] | undefined {
    return undefined;
  }

  /**
   * Advances every enabled shader. Call from the host's `update`.
   *
   * @param deltaTime - Seconds since the previous frame.
   */
  protected updateShaders(deltaTime: DeltaTime): void {
    this.shaderStack.update(deltaTime);
  }

  /**
   * Detaches every shader. Call when the host is disposed.
   */
  protected clearShaders(): void {
    this.shaderStack.clear();
  }

  /**
   * Runs the host's draw between the two shader passes: `under` shaders first,
   * then `draw`, then the rest.
   *
   * @param ctx  - The active render context.
   * @param draw - The host's own draw for this frame.
   */
  protected renderShaders(ctx: RenderContext, draw: () => void): void {
    const region = this.bounds();
    const parts = this.shaderParts();
    this.shaderStack.renderUnder(ctx, region, parts);
    draw();
    this.shaderStack.renderOver(ctx, region, parts);
  }
}
