export default class Asset {
  private static cache: Map<string, HTMLImageElement> = new Map();

  static async load(src: string): Promise<HTMLImageElement> {
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
        reject(new Error(`Failed to load image: ${src}`));
      };
      image.src = src;
    });
  }
}
