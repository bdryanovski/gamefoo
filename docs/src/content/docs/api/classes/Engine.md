---
title: 'Class: Engine'
---

[**@dryanovski/gamefoo v0.0.1**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Engine

# Class: Engine

Defined in: [core/engine.ts:115](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L115)

Core game engine responsible for the game loop, rendering pipeline,
entity management, collision detection, and camera tracking.

`Engine` owns a single HTML `<canvas>` element and drives a
`requestAnimationFrame`-based loop that, on every tick:

1. Computes **deltaTime** (seconds since the previous frame).
2. Calls [update](#update) — advances all entities and runs
   collision detection via the internal [World](World.md).
3. Calls [render](#render) — clears the canvas and draws every
   registered entity.

---

### Lifecycle

```text
new Engine()          — creates canvas context, camera, object register, world
     │
     ▼
  setup(fn)           — runs the user-supplied initialiser, then starts the loop
     │
     ▼
 ┌─► loop(timestamp)  — called every frame via requestAnimationFrame
 │     ├─ update(dt)
 │     └─ render()
 │         │
 └─────────┘
     │
  pause() / clear() / destroy()  — stops or tears down the engine
```

---

### Minimal example

```ts
import { Engine, Player } from "gamefoo";

const engine = new Engine("game", 800, 600, {
  backgroundColor: "#1a1a2e",
});

const player = new Player("hero", 400, 300, 50, 50);
engine.player = player;

engine.setup(() => {
  console.log("Game started!");
});
```

### Adding game objects

```ts
import { Engine, DynamicEntity } from "gamefoo";

const engine = new Engine("game", 800, 600, {});

class Crate extends DynamicEntity {
  constructor(x: number, y: number) {
    super("crate", x, y, 32, 32);
  }
  override update(_dt: number) {}
  override render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(this.x, this.y, 32, 32);
  }
}

engine.attachObjects(new Crate(200, 150));

engine.setup(() => {
  console.log("Crate placed!");
});
```

## See

 - [Camera](Camera.md)            — viewport tracking
 - [GameObjectRegister](GameObjectRegister.md) — entity storage
 - [World](World.md)             — collision detection

## Constructors

### Constructor

```ts
new Engine(
   canvasId: string, 
   width: number, 
   height: number, 
   config: EngineConfig): Engine;
```

Defined in: [core/engine.ts:221](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L221)

Creates a new `Engine` instance, binds it to a `<canvas>` element,
and initialises the camera, object register, and collision world.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `canvasId` | `string` | The DOM `id` attribute of the `<canvas>` element to render into. Must already exist in the document. |
| `width` | `number` | Logical width of the game area in pixels. Sets both `canvas.width` and the camera viewport width. |
| `height` | `number` | Logical height of the game area in pixels. Sets both `canvas.height` and the camera viewport height. |
| `config` | `EngineConfig` | Optional overrides for engine-level settings. See EngineConfig. |

#### Returns

`Engine`

#### Throws

If no 2-D rendering context can be obtained from the
  canvas (e.g. the browser does not support Canvas 2D).

#### Example

```ts
const engine = new Engine("game", 800, 600, {
  backgroundColor: "#1a1a2e",
});
```

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="_initialized"></a> `_initialized` | `private` | `boolean` | `false` | Guards against calling [Engine.setup](#setup) more than once. Flipped to `true` after the first successful setup invocation. | [core/engine.ts:154](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L154) |
| <a id="_player"></a> `_player?` | `private` | [`Player`](Player.md) | `undefined` | Optional reference to the designated player entity. When set, the player is updated and rendered separately from the general object register and is used as the camera-follow target. | [core/engine.ts:178](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L178) |
| <a id="canvas"></a> `canvas` | `private` | `HTMLCanvasElement` | `undefined` | The underlying `<canvas>` DOM element retrieved by its `id` during construction. | [core/engine.ts:120](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L120) |
| <a id="cnf"></a> `cnf` | `private` | `EngineConfig` | `undefined` | Merged engine configuration. Combines user-supplied values with internal defaults (`backgroundColor: "#000000"`). | [core/engine.ts:168](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L168) |
| <a id="ctx"></a> `ctx` | `private` | `CanvasRenderingContext2D` | `undefined` | The 2-D rendering context obtained from [Engine.canvas](#canvas). Used by [Engine.render](#render) and exposed indirectly to game objects. | [core/engine.ts:126](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L126) |
| <a id="engine"></a> `engine` | `private` | \{ `camera`: [`Camera`](Camera.md) \| `null`; `collisions`: [`World`](World.md); `objects`: [`GameObjectRegister`](GameObjectRegister.md); \} | `undefined` | Internal subsystem container holding the three pillars of the engine: | Subsystem | Purpose | | ------------ | -------------------------------------------- | | `camera` | Viewport that tracks a target position | | `objects` | Registry of all non-player game objects | | `collisions` | Spatial world that performs collision detection | | [core/engine.ts:189](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L189) |
| `engine.camera` | `public` | [`Camera`](Camera.md) \| `null` | `undefined` | Viewport camera; follows the player position each frame. | [core/engine.ts:191](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L191) |
| `engine.collisions` | `public` | [`World`](World.md) | `undefined` | Collision-detection world. Entities register their [Collidable](Collidable.md) behaviour here. | [core/engine.ts:195](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L195) |
| `engine.objects` | `public` | [`GameObjectRegister`](GameObjectRegister.md) | `undefined` | Central registry for all [GameObject](../type-aliases/GameObject.md) instances (excluding the player). | [core/engine.ts:193](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L193) |
| <a id="height"></a> `height` | `private` | `number` | `undefined` | The logical height of the game world (and the canvas), in pixels. Set once during construction and also used by the [Camera](Camera.md). | [core/engine.ts:148](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L148) |
| <a id="lasttime"></a> `lastTime` | `private` | `number` | `0` | Timestamp (in milliseconds) of the previous animation frame. Used internally to calculate `deltaTime` between frames. Reset to `0` when the engine is set up via [Engine.setup](#setup). | [core/engine.ts:134](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L134) |
| <a id="running"></a> `running` | `private` | `boolean` | `false` | Whether the game loop is actively requesting new frames. - Set to `true` inside [Engine.setup](#setup). - Set to `false` by [Engine.pause](#pause) or [Engine.clear](#clear). | [core/engine.ts:162](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L162) |
| <a id="width"></a> `width` | `private` | `number` | `undefined` | The logical width of the game world (and the canvas), in pixels. Set once during construction and also used by the [Camera](Camera.md). | [core/engine.ts:141](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L141) |

## Accessors

### camera

#### Get Signature

```ts
get camera(): Camera | null;
```

Defined in: [core/engine.ts:304](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L304)

Provides direct access to the engine's [Camera](Camera.md).

Use this to control viewport tracking, e.g. by calling `camera.follow`
with a custom target or adjusting the camera position manually.
The camera automatically follows the player position each frame when a
player is set, but you can override this behaviour by manipulating the
camera directly.

##### Since

0.2.0

##### Examples

```ts
// Manually set the camera to a specific position:
engine.camera?.moveTo({ x: 500, y: 300 });
```

```ts
// Disable automatic camera follow by overriding the follow method:
if (engine.camera) {
 engine.camera.follow = () => {};
 }

 // The camera will now ignore the player position and stay fixed.
 ```

##### Returns

[`Camera`](Camera.md) \| `null`

The active [Camera](Camera.md) instance managed by this engine.
Note that the camera is always present and never `null` in the current
implementation, but the return type allows for future flexibility (e.g. optional camera).

***

### collisions

#### Get Signature

```ts
get collisions(): World;
```

Defined in: [core/engine.ts:328](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L328)

Provides direct access to the engine's collision [World](World.md).

Use this to register [Collidable](Collidable.md) behaviours so they participate
in the per-frame collision detection pass.

##### Example

```ts
const collidable = new Collidable(entity, engine.collisions, {
  shape: { type: "aabb", width: 40, height: 40 },
  layer: 0,
  tags: new Set(["enemy"]),
  solid: true,
  collidesWith: new Set(["player"]),
});
entity.attachBehaviour(collidable);
```

##### Returns

[`World`](World.md)

The active [World](World.md) instance managed by this engine.

***

### player

#### Get Signature

```ts
get player(): Player | undefined;
```

Defined in: [core/engine.ts:270](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L270)

Returns the current player entity, or `undefined` if none has been set.

##### Example

```ts
if (engine.player) {
  console.log("Player position:", engine.player.getPosition());
}
```

##### Returns

[`Player`](Player.md) \| `undefined`

The active [Player](Player.md) instance, or `undefined`.

#### Set Signature

```ts
set player(player: Player): void;
```

Defined in: [core/engine.ts:254](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L254)

Assigns the primary player entity that the engine will update, render,
and have the camera follow each frame.

##### Example

```ts
const hero = new Player("hero", 400, 300, 50, 50);
engine.player = hero;
```

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `player` | [`Player`](Player.md) | A [Player](Player.md) (or subclass) instance. |

##### Returns

`void`

## Methods

### attachObjects()

```ts
attachObjects(objects: GameObject): void;
```

Defined in: [core/engine.ts:358](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L358)

Registers a game object (entity) with the engine so it is automatically
updated and rendered each frame.

Objects registered here are **separate** from the player — the player is
managed via the [player](#player) setter.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `objects` | [`GameObject`](../type-aliases/GameObject.md) | Any [GameObject](../type-aliases/GameObject.md) (`Entity` or `DynamicEntity`) to include in the game loop. |

#### Returns

`void`

#### Example

```ts
class Tree extends DynamicEntity {
  constructor(x: number, y: number) {
    super("tree", x, y, 40, 60);
  }
  override update(_dt: number) {}
  override render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#228822";
    ctx.fillRect(this.x, this.y, 40, 60);
  }
}

engine.attachObjects(new Tree(300, 200));
```

***

### clear()

```ts
clear(): void;
```

Defined in: [core/engine.ts:597](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L597)

Stops the game loop **and** clears the canvas to transparent.

Equivalent to calling [Engine.pause](#pause) followed by erasing all
drawn content.

#### Returns

`void`

#### Example

```ts
engine.clear();
// Canvas is now blank; loop is stopped.
```

***

### destroy()

```ts
destroy(): void;
```

Defined in: [core/engine.ts:619](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L619)

Tears down the engine and releases resources.

Use this to perform any cleanup such as removing event listeners or
releasing external references when the engine is no longer needed.

#### Returns

`void`

#### Remarks

Currently a no-op placeholder. Extend this method when the engine
acquires resources that need explicit cleanup (e.g. `ResizeObserver`,
`WebSocket`, audio contexts).

#### Example

```ts
// When leaving the game screen:
engine.destroy();
```

***

### handleResize()

```ts
handleResize(): void;
```

Defined in: [core/engine.ts:380](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L380)

Resizes the canvas via CSS transforms so it fits within its parent
container while preserving the original aspect ratio.

Call this in a `window` `resize` event listener to keep the game
centred and properly scaled in responsive layouts.

#### Returns

`void`

#### Remarks

The method calculates the uniform scale factor from the container
dimensions and centres the canvas with a CSS `translate + scale`
transform. The internal resolution (`width` / `height`) remains
unchanged.

#### Example

```ts
window.addEventListener("resize", () => engine.handleResize());
```

***

### pause()

```ts
pause(): void;
```

Defined in: [core/engine.ts:581](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L581)

Pauses the game loop.

The current frame finishes, but no further frames are scheduled.
The canvas retains its last rendered state.

Resume by calling [Engine.setup](#setup) on a **new** engine instance
(the current instance cannot be restarted after pausing because
`_initialized` remains `true`).

#### Returns

`void`

#### Example

```ts
document.addEventListener("visibilitychange", () => {
  if (document.hidden) engine.pause();
});
```

***

### render()

```ts
render(): void;
```

Defined in: [core/engine.ts:546](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L546)

Draws one complete frame to the canvas.

Called automatically after [Engine.update](#update) in the game loop, but
is `public` for manual / debug rendering.

**Render order:**
1. Clear the entire canvas.
2. Fill with the configured EngineConfig.backgroundColor.
3. Draw the player (if set).
4. Draw all registered game objects.

#### Returns

`void`

#### Example

```ts
// Force a single frame repaint:
engine.render();
```

***

### resize()

```ts
resize(width: number, height: number): void;
```

Defined in: [core/engine.ts:412](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L412)

Directly sets the canvas pixel dimensions.

Unlike [Engine.handleResize](#handleresize), this changes the **actual**
resolution of the canvas (clearing its contents in the process).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `width` | `number` | New canvas width in pixels. |
| `height` | `number` | New canvas height in pixels. |

#### Returns

`void`

#### Example

```ts
engine.resize(1024, 768);
```

***

### setup()

```ts
setup(setupFn: () => void): Promise<void>;
```

Defined in: [core/engine.ts:475](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L475)

Initialises the engine and starts the game loop.

The supplied `setupFn` callback is invoked **synchronously** before the
first frame. Use it to perform any last-minute setup that depends on
the engine being ready (e.g. spawning initial entities, binding UI).

Calling `setup` more than once is a no-op — a warning is logged to the
console and the method returns immediately.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `setupFn` | () => `void` | A synchronous callback executed once before the loop begins. Typically used for scene initialisation. |

#### Returns

`Promise`\<`void`\>

#### Throws

If `setupFn` is not a function.

#### Examples

```ts
engine.setup(() => {
  console.log("Engine initialised — first frame incoming!");
});
```

```ts
// Attempting a second setup is safely ignored:
engine.setup(() => {}); // warns: "Engine is already initialized."
```

***

### update()

```ts
update(deltaTime: number): void;
```

Defined in: [core/engine.ts:512](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L512)

Advances the game state by one tick.

Called automatically by the game loop, but is `public` so it can be
invoked manually for deterministic / test-driven updates.

**Update order:**
1. Player (if set).
2. All registered game objects.
3. Collision detection pass ([World.detect](World.md#detect)).
4. Camera follow (tracks the player position).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | Time elapsed since the last frame, **in seconds**. |

#### Returns

`void`

#### Example

```ts
// Manual update (useful for unit testing):
engine.update(1 / 60); // simulate a single 60 FPS tick
```

***

### loop()

```ts
private loop(timestamp: number): void;
```

Defined in: [core/engine.ts:430](https://github.com/bdryanovski/gamefoo/blob/main/src/core/engine.ts#L430)

**`Internal`**

The core animation loop driven by `requestAnimationFrame`.

Each iteration:
1. Computes **deltaTime** (seconds since the last frame).
2. Delegates to [Engine.update](#update) and [Engine.render](#render).
3. Schedules itself for the next frame (unless `running` is `false`).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `timestamp` | `number` | The high-resolution timestamp provided by `requestAnimationFrame`, in milliseconds. |

#### Returns

`void`
