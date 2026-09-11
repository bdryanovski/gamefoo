---
title: 'Class: Engine'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Engine

# Class: Engine

Defined in: [core/engine.ts:105](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L105)

Core game engine: manages the frame loop, rendering pipeline, and
subsystem lifecycle.

`Engine` is renderer-agnostic. Pass any [RenderContext](../interfaces/RenderContext.md) —
[WebRenderer](WebRenderer.md) for browser canvas output, or

---

### Frame lifecycle (one tick)

```text
preUpdate  → update → postUpdate  (all registered subsystems)
  ↓
Engine.update()                   (override hook)
  ↓
clearScrean()                     (fill background colour)
  ↓
Engine.render(ctx)                (override hook)
  ↓
preRender → render → postRender   (all registered subsystems)
```

---

### Browser usage

```ts
import { Engine, WebRenderer, ObjectSystem, Player } from "gamefoo";

const renderer = new WebRenderer("game-canvas", 800, 600);
const engine   = new Engine(renderer, { backgroundColor: "#1a1a2e" });

const player = new Player("hero", 400, 300, 32, 32);
engine.use(new ObjectSystem([player]));

engine.setup(() => console.log("Game started!"));
```
### Subclassing

```ts
class MyGame extends Engine {
  override update(dt: number) {
    // custom per-frame logic
  }
  override render(ctx: RenderContext) {
    // custom rendering on top of subsystems
  }
}
const game = new MyGame(new WebRenderer("game", 800, 600));
game.setup();
```

## Since

0.1.0

## See

 - [WebRenderer](WebRenderer.md)          — canvas adapter
 - [SubSystem](../interfaces/SubSystem.md)            — subsystem interface
 - [RAFLoopDriver](RAFLoopDriver.md)        — default browser loop
 - [IntervalLoopDriver](IntervalLoopDriver.md)   — server loop

## Constructors

### Constructor

```ts
new Engine(renderer: RenderContext, config?: EngineConfig): Engine;
```

Defined in: [core/engine.ts:196](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L196)

Creates a new `Engine` instance bound to the given renderer.

The renderer's `width` and `height` become the engine's logical
dimensions. If `gameScale` is set to a value other than `1`, the
renderer's `scale()` method is called once immediately.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderer` | [`RenderContext`](../interfaces/RenderContext.md) | Any [RenderContext](../interfaces/RenderContext.md) implementation. |
| `config` | `EngineConfig` | Optional engine configuration. |

#### Returns

`Engine`

#### Since

0.1.0

#### Example

**Browser**

```ts
const renderer = new WebRenderer("game-canvas", 800, 600);
const engine   = new Engine(renderer, { backgroundColor: "#1a1a2e" });
```

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="gamescale"></a> `gameScale` | `readonly` | `number` | `undefined` | Curent game enegine game scale **Since** 0.5.0 | [core/engine.ts:141](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L141) |
| <a id="_initialized"></a> `_initialized` | `private` | `boolean` | `false` | Guards against calling [Engine.setup](#setup) more than once. Flipped to `true` after the first successful setup invocation. | [core/engine.ts:148](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L148) |
| <a id="cnf"></a> `cnf` | `private` | `EngineConfig` | `undefined` | Merged configuration. Combines caller-supplied values with defaults. | [core/engine.ts:161](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L161) |
| <a id="ctx"></a> `ctx` | `private` | [`RenderContext`](../interfaces/RenderContext.md) | `undefined` | The active rendering context. All subsystem render hooks and the [Engine.render](#render) override receive this context. | [core/engine.ts:112](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L112) |
| <a id="height"></a> `height` | `private` | `number` | `undefined` | Logical height of the game world in renderer units (pixels or cells). Read from the renderer's `height` property at construction time. | [core/engine.ts:134](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L134) |
| <a id="lasttime"></a> `lastTime` | `private` | `number` | `0` | Timestamp (in milliseconds) of the previous frame. Used internally to derive `deltaTime`. Reset to `0` on [Engine.setup](#setup). | [core/engine.ts:120](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L120) |
| <a id="loopdriver"></a> `loopDriver` | `private` | [`LoopDriver`](../interfaces/LoopDriver.md) | `undefined` | The [LoopDriver](../interfaces/LoopDriver.md) responsible for invoking the game tick. Defaults to [RAFLoopDriver](RAFLoopDriver.md) (browser `requestAnimationFrame`). Override via EngineConfig.loopDriver in the constructor. | [core/engine.ts:171](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L171) |
| <a id="running"></a> `running` | `private` | `boolean` | `false` | Whether the frame loop is currently running. Set `true` by [Engine.setup](#setup); `false` by [Engine.pause](#pause) or [Engine.destroy](#destroy). | [core/engine.ts:156](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L156) |
| <a id="subsystems"></a> `subsystems` | `private` | [`SubSystem`](../interfaces/SubSystem.md)[] | `[]` | Registered subsystems, sorted ascending by their `order` property. | [core/engine.ts:176](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L176) |
| <a id="width"></a> `width` | `private` | `number` | `undefined` | Logical width of the game world in renderer units (pixels or cells). Read from the renderer's `width` property at construction time. | [core/engine.ts:127](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L127) |

## Accessors

### dementions

#### Get Signature

```ts
get dementions(): {
  height: number;
  width: number;
};
```

Defined in: [core/engine.ts:219](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L219)

The logical dimensions of the game area.

These reflect the renderer's `width` / `height` at construction time
and are updated by [Engine.resize](#resize) if the viewport changes.

##### Since

0.4.0

##### Example

```ts
const { width, height } = engine.dementions;
console.log(`Game area: ${width}×${height}`);
```

##### Returns

```ts
{
  height: number;
  width: number;
}
```

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [core/engine.ts:219](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L219) |
| `width` | `number` | [core/engine.ts:219](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L219) |

***

### renderer

#### Get Signature

```ts
get renderer(): RenderContext;
```

Defined in: [core/engine.ts:239](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L239)

The render context used by this engine.

Provides access to the underlying renderer for subsystems that need
to query canvas properties or perform custom rendering.

##### Since

0.5.0

##### Example

```ts
const canvas = engine.renderer.getCanvas?.()?.canvas;
```

##### Returns

[`RenderContext`](../interfaces/RenderContext.md)

## Methods

### clearScrean()

```ts
clearScrean(): void;
```

Defined in: [core/engine.ts:462](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L462)

Clears the screen with the configured EngineConfig.backgroundColor.

Called automatically at the start of every frame. Can also be
called manually for a one-shot screen clear.

#### Returns

`void`

#### Since

0.1.0

#### Example

```ts
// Force a blank frame before showing a transition:
engine.clearScrean();
```

***

### destroy()

```ts
destroy(): void;
```

Defined in: [core/engine.ts:480](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L480)

Tears down the engine and releases resources.

Pauses the loop and calls `destroy()` on every registered subsystem
in reverse registration order (last-in, first-out).

#### Returns

`void`

#### Since

0.1.0

#### Example

```ts
// When navigating away from the game screen:
engine.destroy();
```

***

### pause()

```ts
pause(): void;
```

Defined in: [core/engine.ts:443](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L443)

Pauses the frame loop.

The current frame completes normally; no further frames are
scheduled. The rendered output remains on screen.

#### Returns

`void`

#### Since

0.1.0

#### Example

```ts
document.addEventListener("visibilitychange", () => {
  if (document.hidden) engine.pause();
});
```

***

### render()

```ts
render(_ctx: RenderContext): void;
```

Defined in: [core/engine.ts:426](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L426)

Override hook called once per frame **after** `clearScrean()` and
**before** subsystem render hooks.

The default implementation is a no-op. Subclasses override this to
draw custom content that should appear below all subsystems.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `_ctx` | [`RenderContext`](../interfaces/RenderContext.md) |

#### Returns

`void`

#### Since

0.1.0

#### Example

```ts
class MyGame extends Engine {
  override render(ctx: RenderContext) {
    ctx.drawText("Hello!", 10, 10, "#ffffff");
  }
}
```

***

### resize()

```ts
resize(width: number, height: number): void;
```

Defined in: [core/engine.ts:300](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L300)

Updates the engine's logical dimensions.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `width` | `number` | New logical width in renderer units. |
| `height` | `number` | New logical height in renderer units. |

#### Returns

`void`

#### Since

0.4.0

***

### setup()

```ts
setup(setupFn?: () => void): Promise<void>;
```

Defined in: [core/engine.ts:365](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L365)

Initialises the engine and starts the frame loop.

The optional `setupFn` callback is invoked **synchronously** before
the first frame. Use it to create entities, configure subsystems, or
load initial assets.

Calling `setup` more than once on the same instance is a no-op — a
warning is emitted and the method returns immediately.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `setupFn?` | () => `void` | Optional one-time initialisation callback. |

#### Returns

`Promise`\<`void`\>

#### Since

0.1.0

#### Examples

**Simple setup**

```ts
engine.setup(() => {
  console.log("Engine ready — first frame incoming!");
});
```

**Async setup (asset loading)**

```ts
engine.setup(async () => {
  const image = await Asset.load("hero.png");
  // attach sprite renders, etc.
});
```

***

### update()

```ts
update(_deltaTime: number): void;
```

Defined in: [core/engine.ts:404](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L404)

Override hook called once per frame **before** subsystem render
hooks.

The default implementation is a no-op. Subclasses override this to
add per-frame game logic that does not belong to any specific
subsystem.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `_deltaTime` | `number` |

#### Returns

`void`

#### Since

0.1.0

#### Example

```ts
class MyGame extends Engine {
  override update(dt: number) {
    score += 10 * dt;
  }
}
```

***

### use()

```ts
use(subsystem: SubSystem): this;
```

Defined in: [core/engine.ts:263](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L263)

Attaches a subsystem to the engine and calls its `init` hook.

Subsystems are sorted by their `order` property (lower = earlier).
The default order is `100` when not specified.

Returns `this` for fluent chaining.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `subsystem` | [`SubSystem`](../interfaces/SubSystem.md) | The subsystem to register. |

#### Returns

`this`

#### Since

0.2.0

#### Example

```ts
engine
  .use(new CameraSystem(800, 600, () => player.getPosition()))
  .use(new ObjectSystem([player, enemy]))
  .use(new CollisionSystem(world));
```

***

### run()

```ts
private run<K extends keyof SubSystem>(hook: K, ...args: any[]): void;
```

Defined in: [core/engine.ts:279](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L279)

**`Internal`**

Invokes a named lifecycle hook on every enabled subsystem that
implements it.

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof [`SubSystem`](../interfaces/SubSystem.md) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hook` | `K` | The lifecycle method name (e.g. `"update"`, `"render"`). |
| ...`args` | `any`[] | Arguments forwarded to the hook. |

#### Returns

`void`

***

### tick()

```ts
private tick(deltaTime: number): void;
```

Defined in: [core/engine.ts:316](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L316)

**`Internal`**

The internal frame tick, called once per frame by the
[LoopDriver](../interfaces/LoopDriver.md).

Executes the full update → render pipeline including all subsystem
hooks and the [Engine.update](#update) / [Engine.render](#render) overrides.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | Seconds elapsed since the previous frame. |

#### Returns

`void`
