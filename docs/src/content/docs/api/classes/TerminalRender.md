---
title: 'Class: TerminalRender'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / TerminalRender

# Class: TerminalRender

Defined in: [core/behaviours/terminal\_render.ts:108](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/terminal_render.ts#L108)

Terminal visual renderer behaviour.

Attach `TerminalRender` to any entity so it has a character-based
visual representation in terminal mode (via [TerminalRenderContext](TerminalRenderContext.md)).
The behaviour calls `ctx.drawChar(...)` each frame at the entity's
`(x, y)` position.

For canvas games the same call renders a single character at pixel
coordinates — typically invisible or used for debug labels.

---

### Dual-mode entities

Entities that support **both** canvas and terminal rendering typically
attach both a [SpriteRender](SpriteRender.md) (for canvas) and a `TerminalRender`
(for the terminal). `SpriteRender.render` calls `ctx.drawSprite?(...)`,
which is a no-op on terminal renderers, so only `TerminalRender`
produces visible output in terminal mode.

```ts
player.attachBehaviour(new SpriteRender(player, sheet));       // canvas
player.attachBehaviour(new TerminalRender(player, { char: "@", fg: "#0f0" })); // terminal
```

### Unicode block characters

For denser visuals, Unicode block elements give sub-character resolution:

| Character | Coverage         |
|-----------|------------------|
| `█`       | Full block       |
| `▓`       | Dark shade       |
| `▒`       | Medium shade     |
| `░`       | Light shade      |
| `▀` / `▄` | Upper/lower half |
| `▌` / `▐` | Left/right half  |

## Since

0.4.0

## Examples

```ts
import { Player, TerminalRender } from "gamefoo";

const player = new Player("hero", 40, 12, 8, 8);
player.attachBehaviour(
  new TerminalRender(player, { char: "@", fg: "#00ff00" }),
);
```

```ts
const tr = new TerminalRender(player, { char: "@", fg: "#00ff00" });
player.attachBehaviour(tr);

// Later, when the player is poisoned:
tr.setGlyph({ char: "@", fg: "#88ff00", bg: "#004400" });
```

## See

 - [TerminalRenderContext](TerminalRenderContext.md) — the renderer that processes `drawChar`
 - [TerminalGlyph](../interfaces/TerminalGlyph.md)        — glyph definition
 - [SpriteRender](SpriteRender.md)         — canvas-mode counterpart

## Extends

- [`Behaviour`](Behaviour.md)\<[`Entity`](Entity.md)\>

## Constructors

### Constructor

```ts
new TerminalRender(entity: Entity, glyph: TerminalGlyph): TerminalRender;
```

Defined in: [core/behaviours/terminal\_render.ts:139](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/terminal_render.ts#L139)

Creates a new `TerminalRender` behaviour.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `entity` | [`Entity`](Entity.md) | The owning entity whose position determines where the glyph is drawn. |
| `glyph` | [`TerminalGlyph`](../interfaces/TerminalGlyph.md) | The character and colours to render. |

#### Returns

`TerminalRender`

#### Since

0.4.0

#### Example

```ts
const tr = new TerminalRender(enemy, { char: "E", fg: "#ff4444" });
enemy.attachBehaviour(tr);
```

#### Overrides

[`Behaviour`](Behaviour.md).[`constructor`](Behaviour.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Description | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="enabled"></a> `enabled` | `public` | `boolean` | `true` | Whether this behaviour is currently active. Disabled behaviours are skipped during both [Entity.updateBehaviours](Entity.md#updatebehaviours) and [Entity.renderBehaviours](Entity.md#renderbehaviours). | - | [`Behaviour`](Behaviour.md).[`enabled`](Behaviour.md#enabled) | [core/behaviour.ts:92](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L92) |
| <a id="priority"></a> `priority` | `public` | `number` | `10` | Execution priority. Lower values run first in the behaviour pipeline. Defaults to `10` (after physics-related behaviours). **Since** 0.4.0 | [`Behaviour`](Behaviour.md).[`priority`](Behaviour.md#priority) | - | [core/behaviours/terminal\_render.ts:119](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/terminal_render.ts#L119) |
| <a id="type"></a> `type` | `readonly` | `"terminal_render"` | `'terminal_render'` | Unique string identifier for this behaviour type. Used as the look-up key in [Entity.getBehaviour](Entity.md#getbehaviour) and [Entity.hasBehaviour](Entity.md#hasbehaviour). Must be a compile-time constant (`readonly`). **Example** `class Gravity extends Behaviour { readonly type = "gravity"; // ... }` | [`Behaviour`](Behaviour.md).[`type`](Behaviour.md#type) | - | [core/behaviours/terminal\_render.ts:110](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/terminal_render.ts#L110) |
| <a id="owner"></a> `owner` | `protected` | [`Entity`](Entity.md) | `undefined` | Reference to the entity that owns this behaviour. Available to subclasses for reading and mutating entity state. | - | [`Behaviour`](Behaviour.md).[`owner`](Behaviour.md#owner) | [core/behaviour.ts:55](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L55) |
| <a id="glyph"></a> `glyph` | `private` | [`TerminalGlyph`](../interfaces/TerminalGlyph.md) | `undefined` | The current glyph definition. | - | - | [core/behaviours/terminal\_render.ts:122](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/terminal_render.ts#L122) |

## Accessors

### key

#### Get Signature

```ts
get key(): string;
```

Defined in: [core/behaviour.ts:100](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L100)

Derived look-up key, equal to [Behaviour.type](Behaviour.md#type) in lowercase.

Used internally by the entity's behaviour map so that look-ups are
case-insensitive.

##### Returns

`string`

#### Inherited from

[`Behaviour`](Behaviour.md).[`key`](Behaviour.md#key)

## Methods

### getGlyph()

```ts
getGlyph(): TerminalGlyph;
```

Defined in: [core/behaviours/terminal\_render.ts:169](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/terminal_render.ts#L169)

Returns the current glyph definition.

#### Returns

[`TerminalGlyph`](../interfaces/TerminalGlyph.md)

#### Since

0.4.0

***

### onAttach()?

```ts
optional onAttach(): void;
```

Defined in: [core/behaviour.ts:137](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L137)

Lifecycle hook called immediately after the behaviour is attached
to an entity via [Entity.attachBehaviour](Entity.md#attachbehaviour).

Use this for one-time setup such as registering with the
collision [World](World.md).

#### Returns

`void`

#### Inherited from

[`Behaviour`](Behaviour.md).[`onAttach`](Behaviour.md#onattach)

***

### onDetach()?

```ts
optional onDetach(): void;
```

Defined in: [core/behaviour.ts:145](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L145)

Lifecycle hook called when the behaviour is removed from an entity
via [Entity.detachBehaviour](Entity.md#detachbehaviour).

Use this to unregister from external systems or release resources.

#### Returns

`void`

#### Inherited from

[`Behaviour`](Behaviour.md).[`onDetach`](Behaviour.md#ondetach)

***

### render()

```ts
render(ctx: RenderContext): void;
```

Defined in: [core/behaviours/terminal\_render.ts:193](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/terminal_render.ts#L193)

Draws the glyph at the entity's current `(x, y)` position.

On [TerminalRenderContext](TerminalRenderContext.md), this writes the character into the
cell buffer. On [WebRenderer](WebRenderer.md), it renders one canvas character
(typically invisible in pixel-art games unless a font is set).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) | The active [RenderContext](../interfaces/RenderContext.md). |

#### Returns

`void`

#### Since

0.4.0

#### Overrides

[`Behaviour`](Behaviour.md).[`render`](Behaviour.md#render)

***

### setGlyph()

```ts
setGlyph(glyph: TerminalGlyph): void;
```

Defined in: [core/behaviours/terminal\_render.ts:160](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/terminal_render.ts#L160)

Replaces the current glyph definition.

The new glyph takes effect on the next rendered frame.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `glyph` | [`TerminalGlyph`](../interfaces/TerminalGlyph.md) | The new glyph to use. |

#### Returns

`void`

#### Since

0.4.0

#### Example

```ts
// Flash red when hit:
tr.setGlyph({ char: "!", fg: "#ff0000" });
setTimeout(() => tr.setGlyph({ char: "@", fg: "#00ff00" }), 200);
```

***

### update()

```ts
update(_dt: number): void;
```

Defined in: [core/behaviours/terminal\_render.ts:180](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/terminal_render.ts#L180)

No-op — `TerminalRender` has no per-frame logic.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `_dt` | `number` | Unused delta time. |

#### Returns

`void`

#### Since

0.4.0

#### Overrides

[`Behaviour`](Behaviour.md).[`update`](Behaviour.md#update)
