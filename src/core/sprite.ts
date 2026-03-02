import Asset from "./asset";

/**
 * Describes a single named animation within a {@link Sprite} sheet.
 *
 * @category Core
 * @since 0.1.0
 *
 * @example
 * ```ts
 * const walkAnim: AnimationDefinition = {
 *   frames: [0, 1, 2, 3],
 *   duration: 0.15,
 *   loop: true,
 * };
 * ```
 */
interface AnimationDefinition {
  /** Ordered frame indices into the spritesheet grid. */
  frames: (string | number)[];
  /** Time in seconds each frame is displayed before advancing. */
  duration: number;
  /** Whether the animation restarts from frame 0 after the last frame. */
  loop: boolean;
}

/**
 * Describes the position and size of a single frame within a {@link Sprite}
 * sheet.
 *
 * @category Core
 * @since 0.2.0
 *
 * @example
 * ```ts
 * const frame: SpriteFrame = {
 *  x: 32,
 *  y: 64,
 *  width: 32,
 *  height: 32,
 *  anchor: { x: 16, y: 16 },
 *  };
 *  ```
 */
interface SpriteFrame {
  x: number;
  y: number;
  width: number;
  height: number;
  anchor?: { x: number; y: number };
}

/**
 * Configuration options for slicing a {@link Sprite} sheet into a grid of
 * frames.
 *
 * @category Core
 * @since 0.2.0
 *
 * @example
 * ```ts
 * const config: GridConfig = {
 *  frameWidth: 32,
 *  frameHeight: 32,
 *  offsetX: 0,
 *  offsetY: 0,
 *  spacingX: 0,
 *  spacingY: 0,
 *  count: 16,
 *  };
 *  ```
 */
interface GridConfig {
  frameWidth: number;
  frameHeight: number;
  /* left margin before the first column */
  offsetX?: number;
  /* top margin before the first row */
  offsetY?: number;
  /* horizontal gap between cells */
  spacingX?: number;
  /* vertical gap between cells */
  spacingY?: number;
  /* total number of frames in the sheet (optional, can be inferred from image size) */
  count?: number;
}

/**
 * Metadata wrapper around an {@link HTMLImageElement} that describes how
 * it is sliced into a uniform grid of frames and what named animations
 * are available.
 *
 * `Sprite` does **not** handle rendering itself — use
 * {@link SpriteRender} to play animations on an entity.
 *
 * @category Core
 * @since 0.1.0
 *
 * @example Loading and creating a sprite
 * ```ts
 * import { Asset } from "gamefoo";
 *
 * const image = await Asset.load("hero.png");
 * const sprite = new Sprite(image, 32, 32, {
 *   idle: { frames: [0, 1], duration: 0.25, loop: true },
 *   run:  { frames: [2, 3, 4, 5], duration: 0.1, loop: true },
 * });
 * ```
 *
 * @example Querying frame coordinates
 * ```ts
 * const rect = sprite.getFrameRect(5);
 * ctx.drawImage(
 *   sprite.image,
 *   rect.x, rect.y, rect.width, rect.height,
 *   destX, destY, rect.width, rect.height,
 * );
 * ```
 *
 * @see {@link SpriteRender} — behaviour that plays sprite animations
 * @see {@link Asset}        — image loading utility
 */
export default class Sprite {
  /** The underlying image element containing the full spritesheet. */
  public image: HTMLImageElement;

  /** Width of a single frame cell in pixels. */
  readonly width: number;

  /** Height of a single frame cell in pixels. */
  readonly height: number;

  /**
   * Number of frame columns in the spritesheet, computed as
   * `Math.floor(image.width / width)`.
   */
  readonly columns: number;

  /**
   * Number of frame rows in the spritesheet, computed as
   * `Math.floor(image.height / height)`.
   */
  readonly rows: number;

  /**
   * Named animation definitions keyed by animation name.
   *
   * Populated from the optional `animations` parameter passed to the
   * constructor.
   */
  public animations: Map<string, AnimationDefinition>;

  /**
   * @since 0.2.0
   */
  public frames: Map<number | string, SpriteFrame>;

  /**
   * Creates a new spritesheet descriptor.
   *
   * @param image      - A fully-loaded `HTMLImageElement` containing the
   *   spritesheet texture.
   * @param width      - Width of each individual frame in pixels.
   * @param height     - Height of each individual frame in pixels.
   * @param animations - Optional map of named animation definitions.
   *   Keys are animation names (e.g. `"idle"`, `"run"`).
   *
   * @example
   * ```ts
   * const sprite = new Sprite(img, 64, 64, {
   *   idle: { frames: [0], duration: 1, loop: false },
   * });
   * ```
   */
  constructor(
    image: HTMLImageElement,
    width: number,
    height: number,
    animations?: Record<string, AnimationDefinition>,
  ) {
    this.image = image;
    this.width = width;
    this.height = height;
    this.columns = Math.floor(image.width / width);
    this.rows = Math.floor(image.height / height);

    this.frames = Sprite.generateGridFrames(image, {
      frameWidth: width,
      frameHeight: height,
    });

    this.animations = new Map(Object.entries(animations || {}));
  }

  /**
   * Alternative constructor for spritesheets that are already sliced into a
   * uniform grid of frames.
   *
   * @since 0.2.0
   *
   * @param image      - A fully-loaded `HTMLImageElement` containing the
   *  spritesheet texture.
   * @param config     - Configuration options for slicing the image into a
   *  grid of frames.
   * @param animations - Optional map of named animation definitions.
   *  Keys are animation names (e.g. `"idle"`, `"run"`).
   *
   * @example
   *  ```ts
   *  const sprite = Sprite.fromGrid(img, {
   *  frameWidth: 64,
   *
   *  frameHeight: 64,
   *  offsetX: 0,
   *  offsetY: 0,
   *  spacingX: 0,
   *  spacingY: 0,
   *  count: 16,
   *  }, {
   *  idle: { frames: [0, 1], duration: 0.25, loop: true },
   *  run:  { frames: [2, 3, 4, 5], duration: 0.1, loop: true },
   *  });
   *  ```
   */
  static fromGrid(
    image: HTMLImageElement,
    config: GridConfig,
    animations?: Record<string, AnimationDefinition>,
  ): Sprite {
    const sprite = Object.create(Sprite.prototype) as Sprite;
    sprite.image = image;
    sprite.frames = Sprite.generateGridFrames(image, config);
    sprite.animations = new Map(Object.entries(animations || {}));
    return sprite;
  }

  /**
   * Helper method to compute frame rectangles for a spritesheet sliced into a
   * uniform grid.
   *
   * @since 0.2.0
   *
   * @param image  - A fully-loaded `HTMLImageElement` containing the
   * spritesheet texture.
   * @param config - Configuration options for slicing the image into a grid of
   * frames.
   *
   * @returns A map of frame indices to their corresponding source rectangles.
   *  Frame indices are zero-based and laid out left-to-right, top-to-bottom.
   *  The source rectangles are in pixel coordinates relative to the top-left corner
   *  of the source image.
   */
  private static generateGridFrames(image: HTMLImageElement, config: GridConfig): Map<number, SpriteFrame> {
    const { frameWidth, frameHeight, offsetX = 0, offsetY = 0, spacingX = 0, spacingY = 0 } = config;

    const cols = Math.floor((image.width - offsetX + spacingX) / (frameWidth + spacingX));
    const rows = Math.floor((image.height - offsetY + spacingY) / (frameHeight + spacingY));
    const total = config.count ?? cols * rows;
    const frames = new Map<number, SpriteFrame>();

    for (let i = 0; i < total; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      frames.set(i, {
        x: offsetX + col * (frameWidth + spacingX),
        y: offsetY + row * (frameHeight + spacingY),
        width: frameWidth,
        height: frameHeight,
      });
    }
    return frames;
  }

  static fromAtlas(
    image: HTMLImageElement,
    regions: Record<string, SpriteFrame>,
    animations?: Record<string, AnimationDefinition>,
  ): Sprite {
    const sprite = Object.create(Sprite.prototype) as Sprite;
    sprite.image = image;
    sprite.frames = new Map(Object.entries(regions));
    sprite.animations = new Map(Object.entries(animations || {}));
    return sprite;
  }

  static async fromAseprite(imagePath: string, jsonPath: string): Promise<Sprite> {
    const [image, response] = await Promise.all([Asset.load(imagePath), fetch(jsonPath)]);
    const data = await response.json();

    const regions: Record<string, SpriteFrame> = {};
    for (const [name, entry] of Object.entries(data.frames)) {
      const f = (entry as any).frame;
      regions[name] = { x: f.x, y: f.y, width: f.w, height: f.h };
    }

    const animations: Record<string, AnimationDefinition> = {};
    if (data.meta?.frameTags) {
      for (const tag of data.meta.frameTags) {
        const frameNames: string[] = [];
        for (let i = tag.from; i <= tag.to; i++) {
          const key = Object.keys(data.frames)[i];
          if (key) frameNames.push(key);
        }
        animations[tag.name] = {
          frames: frameNames,
          duration: ((data.frames[frameNames[0]!] as any)?.duration ?? 100) / 1000,
          loop: tag.direction !== "forward_once",
        };
      }
    }

    return Sprite.fromAtlas(image, regions, animations);
  }

  /**
   * Computes the source rectangle for a given frame index within the
   * spritesheet.
   *
   * Frame indices are zero-based and laid out left-to-right,
   * top-to-bottom.
   *
   * @param frame - Zero-based frame index.
   * @returns An `{ x, y, width, height }` rectangle in pixel coordinates
   *   relative to the top-left corner of the source image.
   *
   * @example
   * ```ts
   * // For a 4-column sheet, frame 5 → col 1, row 1
   * const rect = sprite.getFrameRect(5);
   * ```
   */
  getFrameRect(frame: number | string): SpriteFrame {
    const rect = this.frames.get(frame);
    if (!rect) {
      throw new Error(`Frame "${frame}" not found in sprite`);
    }
    return rect;
  }
}
