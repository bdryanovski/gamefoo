# Dither fog of war

This module renders a fog of war the retro way: instead of fading opacity, the
world is covered by a grid of tiny cells, and each cell is either solid fog or
fully punched out. A cell's fate is decided by comparing its _remaining fog
coverage_ against a threshold from a small tiled matrix — a Bayer matrix by
default. Partially revealed areas dissolve into ordered patterns of dots
rather than a muddy alpha gradient, and lights carve dithered holes that
track their owners, flicker like fire, and tint their surroundings.

This document walks through the whole thing twice: first as a tutorial —
how a frame actually happens, and why each stage exists — and then as a
reference for every property and the effect you get when you change it.

## Quick start

```ts
import { DitherFog } from '@dryanovski/gamefoo';

const fog = new DitherFog(renderer, {
  width: 320, // the fog's coordinate space — world pixels
  height: 256,
  cellSize: 2, // world px per dither cell
  color: '#08040f',
  ambientCoverage: 1, // fully opaque until a light says otherwise
});

// A light glued to the player, centred on its 16px sprite:
fog.addLight({
  followTarget: player,
  offsetX: 8,
  offsetY: 8,
  ditherRadius: 96,
  color: '#ffb54d', // optional additive glow
  flickerAmount: 0.15, // optional candle wobble
});

// In the game loop:
fog.update(dt); // advance flicker + follow targets (world pauses → flicker pauses)
// ... draw the world under the world-scale transform, then:
fog.render(); // composites glow + dithered cells over the scene
```

Everything below explains what these lines actually do.

## Why ordered dithering

An alpha fade is the obvious way to reveal a map, and it looks wrong for a
retro aesthetic: a half-revealed tile becomes a translucent smear of fog
colour and background. Ordered dithering keeps every pixel fully opaque or
fully transparent and encodes _how revealed_ an area is in the _density and
position_ of the dots. At 40% coverage an area is 40% dots; at 90% it is
90% dots — and because the thresholds in the matrix are spatially ordered,
the dots appear and disappear in a stable pattern instead of random
shimmering.

That last property is the entire reason a _matrix_ is used rather than a
per-cell random number: an ordered matrix turns coverage into a repeatable
texture, so the dissolve animates smoothly as coverage changes frame to
frame. Which texture you get is a choice — Bayer crosshatch, growing dot
clusters, or seeded noise — covered in the patterns section.

## The three modules

The folder is three files, each owning exactly one concern:

- **`dither_patterns.ts`** — pure data. Builds and caches the threshold
  matrices: Bayer, cluster dots, seeded noise. Nothing in it changes per
  frame.
- **`dither_light.ts`** — pure math for one light source: the coverage curve
  between its two radii, target following, flicker. It never touches the
  grid, allocates nothing per frame, and knows nothing about rendering.
- **`dither_fog.ts`** — all frame-to-frame state. The cell grid, the raster
  pipeline, the glow pass, the fallback path, every cache.

The split follows the data's lifetime: patterns are eternal, light math is
per-frame-but-stateless-in-shape, and only the fog owns anything that must be
pooled, cached, or repaired between frames.

## The light model

A light is a circle pair plus a strength. `coverageAt(px, py)` answers "how
much fog remains at this point" as a value in `0..1`:

- Inside `innerRadius`: `1 - strength`. At `strength = 1` that is zero —
  fully revealed.
- Between the radii: the distance is normalised to `t ∈ (0,1)`, bent by
  `softness`, then eased through a smoothstep, producing a curve from the
  floor back up to `1`.
- At or beyond `ditherRadius`: exactly `1` — the light has no opinion about
  this point.

Two details of that `1` matter later: a disabled light also returns `1`, so
"disabled" and "out of reach" are the same thing to the renderer; and equal
radii collapse to a hard disc rather than dividing by zero.

Flicker multiplies both radii each frame by a scale in
`[1 - flickerAmount, 1]`, computed from two detuned sine waves with a random
per-light phase. Two sines so the wobble drifts irregularly instead of
pulsing; the random phase so a room full of torches never breathes in
lockstep. `update(dt)` advances the wobble — call it from the game's update
so flicker pauses with the world, like every other map effect. `render()`
re-checks target positions defensively, so a light never lags a frame behind
its owner.

## One frame, step by step

This is the fast path — a raw canvas context exists. Each stage below exists
to kill a specific cost; the narrative is "here is the naive approach, here
is what it costs, here is what we do instead".

### One pixel per cell, one blit per frame

The fog rasterises into an offscreen canvas with exactly **one pixel per
dither cell**, and reaches the screen as a single `drawImage` stretched to
the fog's world size, with smoothing off so cells stay crisp rectangles.
This is the load-bearing decision of the whole design: compositing cost is
one blit no matter how many cells exist, and per-cell writes go through a
`Uint32Array` view over the `ImageData` buffer — one 32-bit word per cell.
The fog colour is parsed once (a 1×1 probe canvas converts any CSS colour,
including alpha, to a packed RGBA word; byte order is detected once at class
load and the result cached statically).

### Plans and the distance LUT

Evaluating the coverage curve at every cell means a `pow` (for `softness`)
and a smoothstep per cell. Instead, each renderable light gets a pooled
_plan_ containing a **distance LUT**: an array where `lut[i]` is the coverage
at distance `i`, built once per frame. A cell's coverage becomes one flat
array read indexed by its truncated distance. The LUT is rebuilt every frame
because flicker can move the radii every frame; for a steady light the
rebuild is a few hundred float operations — deliberately not worth the
cache-invalidation logic that caching it would require.

### Circles, not boxes

The naive loop iterates each light's bounding box. That wastes the corners —
about a fifth of the box — and worse: the blend operator (next section)
_dips below_ its inputs when they are equal, so an out-of-reach light folded
in as coverage `1` visibly speckled its own box corners. So the loop
computes, per row, the circle's true column interval: with the row's
vertical offset `dy` from the light, the circle's half-width is
`s = sqrt(outer² - dy²)`, and only cells whose centres fall within
`(light.x - s, light.x + s)` are touched. Rows the circle misses entirely
are skipped. The rule this enforces, shared with the fallback path, is:
**a light that does not reach a cell contributes nothing to it** — no blend,
no threshold-pattern claim.

### Blending overlapping lights

When two reveals overlap, their coverages merge through a quadratic
smooth-min, with `blendSharpness / 100` as the soft-zone width (plain `min`
at zero). A plain `min` makes two reveals collide at a hard seam — the
stricter light's edge cuts a visible corner through the softer one's.
Smooth-min hands coverage over gradually instead. The cost of the formula is
the equal-inputs dip described above, which is precisely why out-of-reach
lights are excluded rather than folded in as `1`: with the exclusion, the dip
only ever softens the boundary between the ambient and a light that genuinely
reaches the cell — which is the intended behaviour, not an artifact.

### Who owns a cell

A cell in the dissolve band needs one threshold to compare against, and
each light can name its own pattern — so a cell needs a winner. The winner
is the light leaving the _lowest_ coverage at that cell (the strongest
reveal); a light that does not reach the cell can never win. With no
covering light at all, the fog's `defaultPattern` grid decides. This is what
makes per-light patterns composable: torches can dissolve as `bayer8` while
the ambient haze dithers as `bayer2`, and each cell resolves against
whichever pattern is actually revealing it.

### The final decision

The blended coverage is compared against two epsilons first: at or below
`0.004` the cell is transparent, at or above `0.996` it is solid, and only
the band in between consults the threshold grid. Without the epsilons,
nearly-solid areas would still punch stray cells — a coverage of `0.98`
still loses to `bayer8`'s highest threshold (`63/64 ≈ 0.984`) once every 64
cells — and those strays would shimmer as coverage wobbles frame to frame.
The epsilons give each region a clean, stable edge.

### Repairing only what changed

Between frames, only the region lights touched can differ — so only that
region is repaired. The fog precomputes a **template**: the per-cell state of
a world with no lights. Each frame it:

1. resets the _previous_ frame's painted box from the template — a cell
   revealed last frame by a light that has since moved away must go back to
   ambient fog;
2. paints the current frame's circles;
3. uploads the **union** of both boxes with the seven-argument
   `putImageData` — one call, changed rows only.

A completely static fog — no lights, nothing moving — uploads nothing at
all. The live-mutable `color` and `ambientCoverage` fields are the exception:
when either changes, the template rebuilds and one frame takes the full
reset-and-upload path instead, which is what keeps those fields safe to
animate without staleness bugs.

### Glow

A light with a `color` also draws a soft additive glow beneath the fog.
Rasterising a radial gradient is a per-pixel cost, so it is done **once**
per (colour, size bucket) into a cached sprite and blitted per frame with
`globalCompositeOperation = 'lighter'`. The radius is bucketed to multiples
of 16 px so flicker's continuous wobble cannot churn the cache; the sprite is
drawn at the light's _true_ radius, so bucketing costs a little gradient
resolution and nothing else. Lights fully outside the fog rectangle are
culled. The cache holds at most 64 sprites, FIFO-evicting — a safety valve
for pathological cases such as dynamically recoloured lights, not something
a normal scene ever hits.

### The fallback path

Without a raw canvas context (a non-canvas renderer, or a headless
environment like the test suite), every cell is evaluated with the exact
per-point `coverageAt` — same out-of-reach rule, same blend, same thresholds
— and solid cells are batched into horizontal `fillRect` runs, one call per
run instead of per cell. Glow is skipped; additive compositing needs the
canvas. The fallback is deliberately the _semantic reference_: the fast
path must render the same fog, just faster.

## Every property and its effect

### Fog properties

| Property           | Default     | What it is                                                                                    | What changing it does                                                                                                                                                |
| ------------------ | ----------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `width` / `height` | 100         | The fog's coordinate space, in world pixels. Lights must live in it.                          | Bigger space, same `cellSize` → proportionally more cells. Fixed at construction.                                                                                    |
| `cellSize`         | 4           | World pixels per dither cell.                                                                 | The dominant performance and look knob — work scales with `1 / cellSize²`. `8` is chunky and cheap; `2` is fine; `0.5` is near-pixel-perfect and 4× the work of `1`. |
| `color`            | `'#08040f'` | The solid fog colour; any CSS colour, alpha supported.                                        | Re-tints everything; a live change costs one full-repaint frame.                                                                                                     |
| `ambientCoverage`  | 1           | Fog opacity where no light reaches. Lights can only reduce below it.                          | `1` (or above ~0.996) is a classic opaque fog of war. `0.5` renders a half-dithered veil everywhere. At or below ~0.004 there is no fog at all. Live-mutable.        |
| `blendSharpness`   | 24          | Soft-zone width for merging overlapping lights, in "pixel" units (divided by 100 internally). | `0` = hard `min`: overlapping reveals collide at visible seams. Higher = wider, softer hand-offs; too high looks mushy. Live-mutable.                                |
| `defaultPattern`   | `'bayer4'`  | Threshold matrix for cells no light reaches — what the ambient dither dissolves against.      | Changes the ambient haze's texture (see patterns below).                                                                                                             |
| `enabled`          | true        | Master switch.                                                                                | `false` makes `render()` a cheap no-op.                                                                                                                              |
| `lights`           | —           | Lights created with the fog.                                                                  | Same as calling `addLight` per entry.                                                                                                                                |

### Light properties

| Property                               | Default     | What it is                                                                                                             | What changing it does                                                                                                                                                   |
| -------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `x` / `y`                              | 0           | Fixed centre, world px.                                                                                                | Use these _or_ `followTarget`.                                                                                                                                          |
| `followTarget` + `offsetX` / `offsetY` | null / 0    | Track any live `{ x, y }` (the player, a map object); offsets centre the light on a sprite (half its size, typically). | The reveal follows the owner every frame and never lags one behind.                                                                                                     |
| `innerRadius`                          | 40          | Fully-cleared radius (to `1 - strength`).                                                                              | Grows the see-through pool.                                                                                                                                             |
| `ditherRadius`                         | 140         | Outer radius; beyond it the light contributes nothing.                                                                 | Widens the dissolve band — the gradualness of the reveal. Must be ≥ `innerRadius`; equal radii give a hard-edged disc.                                                  |
| `strength`                             | 1           | How much fog the light removes.                                                                                        | `1` = see-through at the centre. `0.5` keeps the area half-fogged even at the flame — reads as dim, not revealed.                                                       |
| `softness`                             | 1           | Exponent bending the curve between the radii.                                                                          | `> 1` keeps the centre fully cleared longer and compresses the dissolve against the outer edge. `< 1` starts dissolving early — murky near the centre, gentle far edge. |
| `pattern`                              | `'bayer4'`  | Threshold matrix for cells this light reveals.                                                                         | Per-light choice works because each cell is resolved by its dominant light — torches can differ from the ambient.                                                       |
| `color` / `glowAlpha`                  | null / 0.25 | Additive glow beneath the fog, and its opacity.                                                                        | `color: null` disables the glow entirely.                                                                                                                               |
| `enabled`                              | true        | Light on/off.                                                                                                          | `false` is indistinguishable from removing the light — the fog stays untouched.                                                                                         |
| `flickerAmount`                        | 0           | Radius wobble depth, `0..1`.                                                                                           | `0` steady; `0.12` a breathing torch; `0.3+` a struggling flame.                                                                                                        |
| `flickerSpeed`                         | 2           | Wobbles per second.                                                                                                    | Pairs with `flickerAmount`; try `1.5–3` for fire.                                                                                                                       |

### Patterns

| Pattern                        | Look                         | Notes                                                                                                                                                                 |
| ------------------------------ | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bayer2` / `bayer4` / `bayer8` | Classic crosshatch dissolve. | Bigger matrices = finer, silkier texture in the dissolve band; `bayer2` is chunky. Built recursively (quadrant offsets `0, 2, 3, 1`), so sizes must be powers of two. |
| `dots4` / `dots8`              | Soft, blobby clusters.       | Cells ranked by distance from the matrix centre, so the dissolve grows in rings. A tiny deterministic jitter breaks distance ties, keeping the order reproducible.    |
| `noise8`                       | Grainy, TV-static dissolve.  | Filled from a seeded LCG — the same seed always yields the same grain.                                                                                                |
| Custom matrix                  | Yours.                       | Any square `number[][]` of `0..1` thresholds; passed per light or as `defaultPattern`.                                                                                |

All matrices are cached per size (and seed), so many lights on one pattern
share one matrix.

## Cost and memory

Per frame, each light does: a box clamp, a LUT rebuild, and one pass over
the cells its **circle** covers — about `π · (ditherRadius / cellSize)²`
cells. Everything else — glow, reset, upload, blit — is per light or per
changed region, never per cell. The worst realistic case is a fine grid with
huge radii: at `cellSize: 0.5` on a 320×256 world (a 640×512 grid), a single
radius-148 light evaluates ~275,000 cells — a few milliseconds. A typical
scene at `cellSize` 1–4 is a small fraction of that.

Memory is bounded by sharing and pooling:

| State                      | Scope                               | Size                                      |
| -------------------------- | ----------------------------------- | ----------------------------------------- |
| Threshold matrices         | Module-level, per size/seed         | `n²` numbers                              |
| Tiled threshold grids      | Per fog, per **distinct** pattern   | `cols × rows` floats (~1.3 MB at 640×512) |
| Pixel buffer + template    | Per fog                             | `cols × rows × 4` bytes each              |
| Plans (box, LUT, grid ref) | Per fog, pooled per light           | ~`outer` floats per light                 |
| Glow sprites               | Per fog, per (colour, bucket), ≤ 64 | `(2 × bucket)²` each                      |
| Packed colours             | Static, per CSS string              | one word                                  |

The shared-grid row is the one that matters in practice: a dozen `bayer8`
lights over a `bayer2` ambient hold **two** grids, not thirteen.

## What was deliberately left out

This is as far as a canvas-2D, clarity-first design should go. The known
further steps, and why each was declined:

- **WebGL.** A fragment shader computes the whole fog per screen pixel in
  one pass and beats everything above. It would also add a GL context,
  shader lifecycle, and a second compositing model to a 2D canvas engine for
  an effect already within budget. This is the ceiling if the fog ever needs
  to go per-pixel.
- **Per-cell exact math on the fast path.** The LUT exists precisely to keep
  the curve evaluation out of the cell loop.
- **A squared-distance LUT.** Coverage is a function of distance, not its
  square; a `d²`-indexed table needs nonlinear bucketing to stay accurate.
  Complexity for nothing.
- **Incremental (DDA) row stepping** to remove the per-cell `sqrt`. It
  hard-codes circle geometry into the blend loop to save one cheap call.
- **Caching LUTs across frames.** Needs invalidation on every radius,
  strength, softness, and flicker input; the rebuild is hundreds of floats.
- **Per-light dirty rects instead of one union box.** More `putImageData`
  calls and rectangle bookkeeping for a modest upload saving.
- **Micro-optimising the cell loop** (hoisting fields, inlining writes).
  Measured-nothing on V8's monomorphic loads, and the loop reads worse.

The benefit of every decline is the same one: each stage of the pipeline —
surface, LUT, interval, blend, threshold, dirty rect — is a short method
with one job and no hidden state, so the fog's cost can be reasoned about
from its structure rather than from a profiler.
