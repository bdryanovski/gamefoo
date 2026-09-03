import type { Demension } from '@/generic_types';
import Node from '../../../entities/node';
import type { BitmapData } from './bitmap_types';

export class Bitmap extends Node {
  public readonly id: string;

  private readonly data: BitmapData;

  private readonly path: Path2D | null = null;

  constructor(
    id: string,
    data: BitmapData,
    demension: Demension = { width: 1, height: 1 }, // A dot.
  ) {
    super({ x: 0, y: 0 }, demension);

    this.id = id;
    this.data = data;

    this.path = new Path2D();

    for (let row = 0; row < this.data.length; row++) {
      const bits = this.data[row]!;
      for (let col = 0; col < this.size.width; col++) {
        if ((bits & (1 << (this.size.width - 1 - col))) !== 0) {
          this.path.rect(col, row, 1, 1);
        }
      }
    }
  }

  render() {
    return this.path;
  }

  update() {
    /**
     * Bitmap are design to be static
     */
  }
}
