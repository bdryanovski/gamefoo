import type Engine from "../core/engine";

/**
 * SubSystem is a modular component of the game engine that can be added or removed as needed.
 * It provides hooks for initialization, updating, rendering, and destruction.
 * Each subsystem can have its own logic and state, and can interact with the engine and other subsystems.
 *
 * @since 0.2.0
 *
 * @category SubSystems
 */
export interface SubSystem {
  /**
   * A unique identifier for the subsystem, used for registration and management within
   * the engine.
   */
  id: string;

  /**
   * Determines the order in which subsystems are updated and rendered. Subsystems
   * with lower order values are processed first.
   */
  enabled?: boolean;

  /**
   * Determines the order in which subsystems are updated and rendered. Subsystems with
   * lower order values are processed first.
   */
  order?: number;

  /**
   * Called when the subsystem is added to the engine. Use this method to perform any
   * necessary setup or initialization.
   */
  init?(engine: Engine): void;

  preUpdate?(deltaTime: number): void;
  update?(deltaTime: number): void;
  postUpdate?(deltaTime: number): void;

  preRender?(ctx: CanvasRenderingContext2D): void;
  render?(ctx: CanvasRenderingContext2D): void;
  postRender?(ctx: CanvasRenderingContext2D): void;

  destroy?(): void;
}
