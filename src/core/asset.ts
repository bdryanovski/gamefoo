/**
 * Static image asset loader with an in-memory cache.
 *
 * `Asset` wraps the native `Image` constructor with a `Promise`-based
 * API and caches loaded images by URL so repeated requests for the same
 * source resolve instantly.
 *
 * @category Core
 * @since 0.1.0
 *
 * @example Loading an image
 * ```ts
 * const image = await Asset.load("sprites/hero.png");
 * ctx.drawImage(image, 0, 0);
 * ```
 *
 * @example Pre-loading multiple assets
 * ```ts
 * await Promise.all([
 *   Asset.load("sprites/hero.png"),
 *   Asset.load("sprites/enemy.png"),
 *   Asset.load("tiles/grass.png"),
 * ]);
 * ```
 *
 * @see {@link Sprite} — consumes loaded images for spritesheet slicing
 */
export default class Asset {
  /**
   * Internal cache mapping source URLs to their loaded
   * `HTMLImageElement` instances.
   */
  private static cache: Map<string, HTMLImageElement> = new Map();

  /**
   * Loads an image from the given URL.
   *
   * If the image has been loaded before, the cached `HTMLImageElement`
   * is returned immediately (the `Promise` resolves synchronously on
   * the microtask queue).
   *
   * @param src - URL or relative path of the image to load.
   * @returns A `Promise` that resolves with the loaded
   *   `HTMLImageElement`.
   *
   * @throws {Error} If the image fails to load (e.g. 404 or network
   *   error). The error message includes the failing `src`.
   *
   * @example
   * ```ts
   * try {
   *   const img = await Asset.load("missing.png");
   * } catch (err) {
   *   console.error(err); // "Failed to load image: missing.png"
   * }
   * ```
   */
  public static async load(src: string): Promise<HTMLImageElement> {
    const cache = Asset.cache.get(src);

    if (cache) {
      return cache;
    }
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        Asset.cache.set(src, image);
        resolve(image);
      };
      image.onerror = (_error) => {
        reject(new Error(`Failed to load image: ${src}`, { cause: _error }));
      };
      image.src = src;

      return image;
    });
  }
}
