
export default class Asset {
  private cache: Map<string, HTMLImageElement> = new Map()
  private pending: Map<string, string> = new Map()

  queue(key: string, src: string) {
    this.pending.set(key, src)
  }

  loadAll() {
    const loads = this.pending.entries().map(([key, src]) => {
      this.load(key, src)
    })
    this.pending = new Map()
    return Promise.all(loads)
  }

  load(key: string, src: string) {
    if (this.cache.has(key)) {
      return Promise.resolve(this.cache.get(key))
    }

    return new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => {
        this.cache.set(key, image);
        resolve(image)
      }

      image.onerror = () => reject(`Failed to load asset: ${src}`)
      image.src = src;
    })
  }

  get(key: string) {
    if (!this.cache.has(key)) throw new Error(`Asset not loaded: ${key}`)
    return this.cache.get(key)
  }

  drawSprite(ctx, key: string, frameX: number, frameY: number, frameW: number, frameH: number, destX: number, destY: number) {
    const image = this.get(key)
    ctx.drawImage(image, frameX, frameY, frameW, frameH, destX, destY, frameW, frameH)
  }

  drawFrame(ctx, key: string, col: number, row: number, frameW: number, frameH: number, destX: number, destY: number) {
    const image = this.get(key)
    ctx.drawImage(
      image,
      col * frameW,
      row * frameH,
      frameW,
      frameH,
      destX,
      destY,
      frameW,
      frameH
    )
  }
}
