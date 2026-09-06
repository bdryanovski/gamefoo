import type { DeltaTime } from '@/generic_types';
import type Engine from '../core/engine';
import type { RenderContext } from '../core/renderer/type';
import type { Shader } from '../core/shaders/shader';
import { ShaderStack } from '../core/shaders/shader_stack';
import type { SubSystem } from './types';

/**
 * Engine-level shader host: applies full-screen {@link Shader}s as a final
 * post-render pass, after every other subsystem has drawn.
 *
 * Register it with {@link Engine.use}, then add screen effects (vignette,
 * colour grade, damage flash). The engine can look effects back up by key
 * via {@link ShaderSystem.get} to toggle or reconfigure them at runtime.
 *
 * @category SubSystems
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const shaders = new ShaderSystem();
 * shaders.add(new VignetteShader({ intensity: 0.45 }));
 * engine.use(shaders);
 *
 * // later — react to game state:
 * shaders.get<VignetteShader>("vignette")!.enabled = isNight;
 * ```
 */
export class ShaderSystem implements SubSystem {
  public readonly id = 'shaders';

  /**
   * Runs late so effects composite over the finished frame.
   */
  public readonly order = 900;

  public enabled = true;

  private readonly stack = new ShaderStack();
  private width = 0;
  private height = 0;

  /**
   * Captures the screen dimensions to size the full-screen region.
   */
  public init(engine: Engine): void {
    const { width, height } = engine.dementions;
    this.width = width;
    this.height = height;
  }

  /**
   * Adds a screen shader and returns it for fluent configuration.
   */
  public add<T extends Shader>(shader: T): T {
    return this.stack.attach(shader);
  }

  /**
   * The attached shader with `type`, or `undefined`.
   */
  public get<T extends Shader>(type: string): T | undefined {
    return this.stack.get<T>(type);
  }

  /**
   * Removes the shader with `type`, if present.
   */
  public remove(type: string): void {
    this.stack.detach(type);
  }

  public update(deltaTime: DeltaTime): void {
    this.stack.update(deltaTime);
  }

  public postRender(ctx: RenderContext): void {
    this.stack.render(ctx, { x: 0, y: 0, width: this.width, height: this.height });
  }
}
