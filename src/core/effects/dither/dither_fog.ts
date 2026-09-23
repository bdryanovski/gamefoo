import { DitherLight, type DitherLightOptions } from './dither_light';
import { DitherPatterns } from './dither_patterns';

interface DitherFogOptions {
  cellSize: number;
  color: string;
  width: number;
  height: number;
  ambientCoverage?: number;
  blendSharpness: number;
  defaultPattern: string;
  mixPatterns?: any;
  drawGlow?: boolean;
  lights?: any;
}

export class DitherFog {
  width: number;
  height: number;
  cellSize: number;
  color: string;
  ambientCoverage: number;

  blendSharpness: number;
  defaultPattern: string;

  mixPatterns: any;
  drawGlow: boolean;
  lights: any;

  constructor(ctx, opts: DitherFogOptions) {
    this.ctx = ctx;

    /** size in px of one dither cell; smaller = crisper but slower */
    this.cellSize = opts.cellSize ?? 4;
    /** the fog's solid color */
    this.color = opts.color ?? '#08040f';
    /** base coverage with no lights nearby (1 = fully opaque fog, 0 = no fog at all) */
    this.ambientCoverage = opts.ambientCoverage ?? 1;
    /** how smoothly multiple light circles blend into one another (0 = hard min, higher = softer) */
    this.blendSharpness = opts.blendSharpness ?? 24;
    /** pattern used wherever no light is the closest influence */
    this.defaultPattern = opts.defaultPattern ?? 'bayer4';
    /** optional array of {pattern, weight} to blend several patterns everywhere, e.g. for a banded/mixed look */
    this.mixPatterns = opts.mixPatterns ?? null;
    /** whether to draw each light's optional color glow underneath the dithered fog */
    this.drawGlow = opts.drawGlow ?? true;

    this.width = opts.width ?? 100;
    this.height = opts.height ?? 100;

    this.lights = [];
    (opts.lights ?? []).forEach((l) => this.addLight(l));
  }

  addLight(opts: DitherLightOptions): DitherLight {
    const light = opts instanceof DitherLight ? opts : new DitherLight(opts);
    this.lights.push(light);
    return light;
  }

  removeLight(light: DitherLight): void {
    this.lights = this.lights.filter((l: DitherLight) => l !== light);
  }

  static smoothMin(a: number, b: number, k: number): number {
    if (k <= 0) {
      return Math.min(a, b);
    }
    const h = Math.max(0, Math.min(1, 0.5 + (0.5 * (b - a)) / k));
    return b * (1 - h) + a * h - k * h * (1 - h);
  }

  _patternValue(name: string, gx: number, gy: number): number[][] {
    const p = DitherPatterns.get(name);
    return p.matrix[gy % p.size][gx % p.size];
  }

  _mixedPatternValue(gx: number, gy: number): number[][] {
    if (!this.mixPatterns?.length)
      {return this._patternValue(this.defaultPattern, gx, gy);}
    let sum = 0,
      total = 0;
    for (const { pattern, weight = 1 } of this.mixPatterns) {
      sum += this._patternValue(pattern, gx, gy) * weight;
      total += weight;
    }
    return total ? sum / total : 0;
  }

  /** Call once per frame, after drawing your scene, to composite the fog on top. */
  render(): void {
    const { ctx, width, height, cellSize } = this;
    this.lights.forEach((l) => l.updatePosition());

    if (this.drawGlow) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const light of this.lights) {
        if (!light.color || !light.enabled) {continue;}
        const g = ctx.createRadialGradient(
          light.x,
          light.y,
          0,
          light.x,
          light.y,
          light.ditherRadius,
        );
        g.addColorStop(0, light.color);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = light.glowAlpha;
        ctx.fillStyle = g;
        ctx.fillRect(
          light.x - light.ditherRadius,
          light.y - light.ditherRadius,
          light.ditherRadius * 2,
          light.ditherRadius * 2,
        );
      }
      ctx.restore();
    }

    ctx.save();
    ctx.fillStyle = this.color;
    const cols = Math.ceil(width / cellSize);
    const rows = Math.ceil(height / cellSize);
    const k = this.blendSharpness / 100;

    for (let gy = 0; gy < rows; gy++) {
      const py = gy * cellSize + cellSize / 2;
      for (let gx = 0; gx < cols; gx++) {
        const px = gx * cellSize + cellSize / 2;
        let coverage = this.ambientCoverage;
        let dominant = null,
          dominantVal = coverage;

        for (const light of this.lights) {
          const c = light.coverageAt(px, py);
          coverage = DitherFog.smoothMin(coverage, c, k);
          if (c < dominantVal) {
            dominantVal = c;
            dominant = light;
          }
        }

        if (coverage <= 0.004) {continue;} // fully clear cell, nothing to draw

        if (coverage >= 0.996) {
          ctx.fillRect(gx * cellSize, gy * cellSize, cellSize, cellSize);
          continue;
        }

        const threshold = dominant
          ? this._patternValue(dominant.pattern, gx, gy)
          : this._mixedPatternValue(gx, gy);

        if (coverage > threshold) {
          ctx.fillRect(gx * cellSize, gy * cellSize, cellSize, cellSize);
        }
      }
    }
    ctx.restore();
  }
}
