import type { DeltaTime } from '@/generic_types';
import type { RenderContext } from '../renderer/type';
import type { Shader } from './shader';
import type { ShaderRegion } from './types';

/**
 * An ordered collection of {@link Shader}s bound to a single host (a game
 * object or the engine). Handles keyed look-up plus the per-frame update
 * and render fan-out, skipping disabled shaders.
 *
 * Hosts embed a stack rather than inheriting from it, so both
 * {@link MapObject} and {@link Entity} can expose identical shader APIs.
 *
 * @category Shaders
 * @since 0.5.0
 */
export class ShaderStack {
  private readonly items: Shader[] = [];

  /**
   * Adds a shader (rendered in insertion order) and returns it for
   * fluent configuration.
   */
  attach<T extends Shader>(shader: T): T {
    this.items.push(shader);
    return shader;
  }

  /**
   * The first shader whose `type` matches `type`, or `undefined`.
   */
  get<T extends Shader>(type: string): T | undefined {
    return this.items.find((shader) => shader.type === type) as T | undefined;
  }

  /**
   * Whether a shader with `type` is attached.
   */
  has(type: string): boolean {
    return this.items.some((shader) => shader.type === type);
  }

  /**
   * Removes the first shader with `type`, if present.
   */
  detach(type: string): void {
    const index = this.items.findIndex((shader) => shader.type === type);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  /**
   * Removes every shader.
   */
  clear(): void {
    this.items.length = 0;
  }

  /**
   * A read-only view of the attached shaders, in render order.
   */
  get all(): readonly Shader[] {
    return this.items;
  }

  /**
   * Advances every enabled shader.
   */
  update(deltaTime: DeltaTime): void {
    for (const shader of this.items) {
      if (shader.enabled) {
        shader.update(deltaTime);
      }
    }
  }

  /**
   * Renders every enabled shader over `region`, in insertion order.
   */
  render(ctx: RenderContext, region: ShaderRegion): void {
    for (const shader of this.items) {
      if (shader.enabled) {
        shader.render(ctx, region);
      }
    }
  }
}
