import type { RenderContext } from '../renderer/type';
import { Shader } from './shader';
import type { Frame, Transform } from '../map/types';
import type { ShaderConfig, ShaderPart, ShaderRegion } from './types';

/**
 * Options for {@link OutlineShader}.
 */
export interface OutlineConfig extends ShaderConfig {
  /**
   * Outline colour (any CSS colour — an alpha like `#ffffff80` works).
   * @defaultValue `"#ffffff"`
   */
  color?: string;
  /**
   * Outline thickness in logical pixels. Keep whole for crisp pixel art
   * (`1` reads as one art pixel). `0` disables the draw.
   * @defaultValue `1`
   */
  thickness?: number;
}

/**
 * The eight blit directions a silhouette is stamped in — the orthogonal
 * sides first, then the diagonals, so a `1px` outline hugs the art with no
 * corner gaps.
 */
const OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
];

/**
 * Recoloured-frame cache, image → (source rect + colour → canvas). Grows
 * only with authored frames × outline colours — project data, not runtime
 * state — and releases whole atlases with the image via the `WeakMap` key.
 */
const CACHE = new WeakMap<HTMLImageElement, Map<string, HTMLCanvasElement>>();

/**
 * The frame's opaque pixels as a solid `color` silhouette — a tiny canvas
 * holding the source rect, repainted with `source-in`. Built once per
 * (frame, colour) pair and cached; `null` without a 2-D context.
 */
function silhouette(frame: Frame, color: string): HTMLCanvasElement | null {
  let byRect = CACHE.get(frame.image);
  if (!byRect) {
    byRect = new Map();
    CACHE.set(frame.image, byRect);
  }
  const key = `${frame.sx},${frame.sy},${frame.sw},${frame.sh},${color}`;
  const hit = byRect.get(key);
  if (hit) {
    return hit;
  }

  const canvas = document.createElement('canvas');
  canvas.width = frame.sw;
  canvas.height = frame.sh;
  const raw = canvas.getContext('2d');
  if (!raw) {
    return null;
  }
  raw.drawImage(frame.image, frame.sx, frame.sy, frame.sw, frame.sh, 0, 0, frame.sw, frame.sh);
  raw.globalCompositeOperation = 'source-in';
  raw.fillStyle = color;
  raw.fillRect(0, 0, frame.sw, frame.sh);

  byRect.set(key, canvas);
  return canvas;
}

/**
 * Blits a silhouette at `(dx, dy)` applying the part's flip/rotation — the
 * same transform flow as the map's own draw path, so the outline lands
 * exactly under the art it traces.
 */
function blit(
  raw: CanvasRenderingContext2D,
  sil: HTMLCanvasElement,
  dx: number,
  dy: number,
  t?: Transform,
): void {
  const flipX = t?.flipX ?? false;
  const flipY = t?.flipY ?? false;
  const rotation = t?.rotation ?? 0;

  if (!flipX && !flipY && !rotation) {
    raw.drawImage(sil, dx, dy);
    return;
  }

  raw.save();
  raw.translate(dx + sil.width / 2, dy + sil.height / 2);
  if (rotation) {
    raw.rotate((rotation * Math.PI) / 180);
  }
  raw.scale(flipX ? -1 : 1, flipY ? -1 : 1);
  raw.drawImage(sil, -sil.width / 2, -sil.height / 2);
  raw.restore();
}

/**
 * A solid-colour border that hugs the host sprite's actual pixels — the
 * classic selection/interactable outline.
 *
 * Each current draw part is turned into a cached solid silhouette (its
 * opaque pixels, recoloured) and stamped eight times around the art at
 * `thickness` offset. The shader renders in the **under** pass — beneath
 * the host's sprite — so the sprite covers every inner overlap and only
 * the clean outer ring stays visible.
 *
 * Object hosts forward their parts automatically; attach the shader and
 * toggle `enabled` (e.g. from a proximity check) — nothing else to wire:
 *
 * @category Shaders
 * @since 0.5.0
 *
 * @example Highlighting the interactable the player can reach
 * ```ts
 * const outline = chest.attachShader(
 *   new OutlineShader({ color: "#ffffff", thickness: 1 }),
 * );
 * // Each frame, flip it with reach:
 * outline.enabled = chest.overlaps(player.interactionBox());
 * ```
 */
export class OutlineShader extends Shader {
  readonly type = 'outline';
  override readonly under = true;

  private readonly color: string;
  private readonly thickness: number;

  constructor(config: OutlineConfig = {}) {
    super(config);
    this.color = config.color ?? '#ffffff';
    this.thickness = Math.max(0, config.thickness ?? 1);
  }

  render(ctx: RenderContext, region: ShaderRegion, parts?: readonly ShaderPart[]): void {
    const raw = this.raw(ctx);
    if (!raw || !parts || this.thickness <= 0) {
      return;
    }

    const t = this.thickness;
    for (const part of parts) {
      const frame = part.anim?.frame ?? part.frame;
      if (!frame) {
        continue;
      }
      const sil = silhouette(frame, this.color);
      if (!sil) {
        continue;
      }
      for (const [ox, oy] of OFFSETS) {
        blit(raw, sil, region.x + part.ox + ox * t, region.y + part.oy + oy * t, part.transform);
      }
    }
  }
}
