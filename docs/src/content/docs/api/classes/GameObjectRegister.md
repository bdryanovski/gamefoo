---
title: 'Class: GameObjectRegister'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / GameObjectRegister

# Class: GameObjectRegister

Defined in: [core/game\_object\_register.ts:35](https://github.com/bdryanovski/gamefoo/blob/main/src/core/game_object_register.ts#L35)

Central registry that stores and manages all non-player
[game objects](../type-aliases/GameObject.md) within the engine.

Objects are keyed by their `id` property, so each ID must be unique.
The [Engine](Engine.md) delegates per-frame `update` and `render` calls to
this register.

## Since

0.1.0

## Examples

```ts
const register = new GameObjectRegister();

register.register(tree);
register.register(rock);

const found = register.get("tree"); // Entity | undefined
console.log(register.has("rock"));  // true
```

```ts
// Called internally by Engine each frame:
register.updateAll(deltaTime);
register.renderAll(ctx);
```

## See

Engine.attachObjects — convenience method that delegates here

## Constructors

### Constructor

```ts
new GameObjectRegister(): GameObjectRegister;
```

#### Returns

`GameObjectRegister`

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="_cache"></a> `_cache` | `private` | [`GameObject`](../type-aliases/GameObject.md)[] \| `null` | `null` | - | [core/game\_object\_register.ts:41](https://github.com/bdryanovski/gamefoo/blob/main/src/core/game_object_register.ts#L41) |
| <a id="objects"></a> `objects` | `private` | `Map`\<`string`, [`GameObject`](../type-aliases/GameObject.md)\> | `undefined` | Internal map from entity ID to its [GameObject](../type-aliases/GameObject.md) instance. | [core/game\_object\_register.ts:39](https://github.com/bdryanovski/gamefoo/blob/main/src/core/game_object_register.ts#L39) |

## Methods

### get()

```ts
get(id: string): GameObject | undefined;
```

Defined in: [core/game\_object\_register.ts:73](https://github.com/bdryanovski/gamefoo/blob/main/src/core/game_object_register.ts#L73)

Retrieves a registered object by its unique ID.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | The ID of the object to find. |

#### Returns

[`GameObject`](../type-aliases/GameObject.md) \| `undefined`

The matching [GameObject](../type-aliases/GameObject.md), or `undefined` if not found.

#### Example

```ts
const crate = register.get("crate_1");
if (crate) crate.x += 10;
```

***

### getAll()

```ts
getAll(filter?: () => true): GameObject[];
```

Defined in: [core/game\_object\_register.ts:116](https://github.com/bdryanovski/gamefoo/blob/main/src/core/game_object_register.ts#L116)

Returns all registered objects that pass the supplied filter.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `filter?` | () => `true` | (optional) A predicate function. Return `true` to include the object in the result. |

#### Returns

[`GameObject`](../type-aliases/GameObject.md)[]

An array of matching [GameObject](../type-aliases/GameObject.md) instances.

#### Example

```ts
const enemies = register.getAll(() => true);
```

***

### has()

```ts
has(id: string): boolean;
```

Defined in: [core/game\_object\_register.ts:83](https://github.com/bdryanovski/gamefoo/blob/main/src/core/game_object_register.ts#L83)

Checks whether an object with the given ID is registered.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | The ID to look up. |

#### Returns

`boolean`

`true` if the registry contains the object.

***

### register()

```ts
register(object: GameObject): void;
```

Defined in: [core/game\_object\_register.ts:56](https://github.com/bdryanovski/gamefoo/blob/main/src/core/game_object_register.ts#L56)

Adds a game object to the registry.

If an object with the same `id` already exists it will be
silently overwritten.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `object` | [`GameObject`](../type-aliases/GameObject.md) | The game object to register. |

#### Returns

`void`

#### Example

```ts
register.register(new Crate("crate_1", 200, 150, 32, 32));
```

***

### renderAll()

```ts
renderAll(ctx: RenderContext): void;
```

Defined in: [core/game\_object\_register.ts:162](https://github.com/bdryanovski/gamefoo/blob/main/src/core/game_object_register.ts#L162)

Calls [render(ctx)](Entity.md#render) on every registered
object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) | The rendering context. |

#### Returns

`void`

***

### sort()

```ts
sort(compareFn: (a: GameObject, b: GameObject) => number): void;
```

Defined in: [core/game\_object\_register.ts:152](https://github.com/bdryanovski/gamefoo/blob/main/src/core/game_object_register.ts#L152)

Sorts the internal object cache using the given comparator.

Call before [renderAll](#renderall) to control draw order (e.g. Y-sort
for isometric depth).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `compareFn` | (`a`: [`GameObject`](../type-aliases/GameObject.md), `b`: [`GameObject`](../type-aliases/GameObject.md)) => `number` | Standard `Array.sort` comparator. |

#### Returns

`void`

#### Since

0.4.0

#### Example

```ts
register.sort((a, b) => a.y - b.y);
register.renderAll(ctx);
```

***

### toArray()

```ts
toArray(): GameObject[];
```

Defined in: [core/game\_object\_register.ts:96](https://github.com/bdryanovski/gamefoo/blob/main/src/core/game_object_register.ts#L96)

Returns all registered objects as an array.

Make sure to also cache the objects

#### Returns

[`GameObject`](../type-aliases/GameObject.md)[]

An array of all [GameObject](../type-aliases/GameObject.md) instances in the registry.

#### Since

0.2.0

***

### updateAll()

```ts
updateAll(deltaTime: number): void;
```

Defined in: [core/game\_object\_register.ts:130](https://github.com/bdryanovski/gamefoo/blob/main/src/core/game_object_register.ts#L130)

Calls [update(deltaTime)](Entity.md#update) on every
registered object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | Seconds elapsed since the previous frame. |

#### Returns

`void`
