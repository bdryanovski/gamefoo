import type Player from "../entities/player";
import Camera from "./camera";
import GameObjectRegister from "./game_object_register";

interface EngineConfig {
  backgroundColor?: string;
}

/**
 * Game Engine - the main class that manages the game loop, rendering, and overall game state.
 */
export default class Engine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private lastTime: number = 0;

  private width: number;
  private height: number;

  private _initialized: boolean = false;
  private running: boolean = false;

  private cnf: EngineConfig = {
    backgroundColor: "#000000",
  };

  private _player?: Player;

  private engine: {
    camera: Camera | null;
    objects: GameObjectRegister; // Placeholder for game objects, can be expanded later
  };

  constructor(
    canvasId: string,
    width: number,
    height: number,
    config: EngineConfig,
  ) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.height = height;
    this.width = width;
    this.canvas.width = width;
    this.canvas.height = height;
    const context = this.canvas.getContext("2d");
    if (!context) {
      throw new Error("Failed to get 2D context");
    }
    this.ctx = context;

    this.cnf = { ...this.cnf, ...config };

    this.engine = {
      /**
       * Maybe later will find a beter way to initialize this
       */
      camera: new Camera(this.width, this.height),

      /**
       * This holds all the game objects
       */
      objects: new GameObjectRegister(),
    };
  }

  set player(player: Player) {
    this._player = player;
  }

  get player(): Player | undefined {
    return this._player;
  }

  handleResize() {
    if (!this.canvas) return;

    const container = this.canvas.parentElement;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const scaleX = containerWidth / this.width;
    const scaleY = containerHeight / this.height;
    const scale = Math.min(scaleX, scaleY);
    const offsetX = (containerWidth - this.width * scale) / 2;
    const offsetY = (containerHeight - this.height * scale) / 2;

    this.canvas.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
  }

  resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  private loop(timestamp: number) {
    if (!this.running) {
      return;
    }

    if (this.lastTime === 0) {
      this.lastTime = timestamp;
    }

    const deltaTime = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    this.update(deltaTime);
    this.render();
    requestAnimationFrame((timestamp) => this.loop(timestamp));
  }

  /**
   * Public - cause I'm old school
   */

  public async setup(setupFn: () => void) {
    if (this._initialized) {
      console.warn("Engine is already initialized.");
      return;
    }

    if (typeof setupFn !== "function") {
      throw new Error(
        "Setup function must be provided and must be a function.",
      );
    }

    this.lastTime = 0;
    setupFn();
    this._initialized = true;
    this.running = true;
    requestAnimationFrame((timestamp) => this.loop(timestamp));
  }

  public update(deltaTime: number) {
    if (this.player) {
      this.player.update(deltaTime);
    }

    if (this.engine.objects) {
      this.engine.objects.updateAll(deltaTime);
    }

    /**
     * There is oportunity to optimize this with much better follow mechanic
     * but I'm to lazy today so won't do it
     */
    if (this.engine.camera && this.player) {
      this.engine.camera.follow(this.player.getPosition());
    }
  }

  public render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = this.cnf.backgroundColor || "#000000";
    this.ctx.fillRect(0, 0, this.width, this.height);

    if (this.player) {
      this.player.render(this.ctx);
    }

    if (this.engine.objects) {
      this.engine.objects.renderAll(this.ctx);
    }
  }

  public pause() {
    this.running = false;
  }

  public clear() {
    this.running = false;
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  public destroy() {
    // Clean up resources, event listeners, etc. if needed.
  }
}
