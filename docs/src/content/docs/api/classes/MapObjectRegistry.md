---
title: 'Class: MapObjectRegistry'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / MapObjectRegistry

# Class: MapObjectRegistry

Defined in: [core/map/map\_object\_registry.ts:24](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object_registry.ts#L24)

Maps an object-type key to the [MapObject](MapObject.md) subclass that should
represent it. Populate it before [MapManager.load](MapManager.md#load); machine
placements whose key is unregistered fall back to the base `MapObject`.

The loader resolves a placement's key as `properties.class` if present,
otherwise the object's `name`.

## Since

0.5.0

## Example

```ts
const registry = new MapObjectRegistry();
registry.register(Chest);            // uses Chest.type
registry.register("torch", Torch);   // explicit key
const map = await MapManager.fromUrl("./map.json", { registry });
```

## See

[MapObject](MapObject.md)

## Constructors

### Constructor

```ts
new MapObjectRegistry(): MapObjectRegistry;
```

#### Returns

`MapObjectRegistry`

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="bytype"></a> `byType` | `private` | `Map`\<`string`, [`MapObjectConstructor`](../type-aliases/MapObjectConstructor.md)\> | [core/map/map\_object\_registry.ts:25](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object_registry.ts#L25) |

## Methods

### register()

#### Call Signature

```ts
register(ctor: MapObjectConstructor): void;
```

Defined in: [core/map/map\_object\_registry.ts:34](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object_registry.ts#L34)

Registers a class. With one argument the class's static `type` is the
key; with two, the first argument is an explicit key.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctor` | [`MapObjectConstructor`](../type-aliases/MapObjectConstructor.md) |

##### Returns

`void`

##### Throws

When called with a single class that has no static
  `type`.

#### Call Signature

```ts
register(type: string, ctor: MapObjectConstructor): void;
```

Defined in: [core/map/map\_object\_registry.ts:35](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object_registry.ts#L35)

Registers a class. With one argument the class's static `type` is the
key; with two, the first argument is an explicit key.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `string` |
| `ctor` | [`MapObjectConstructor`](../type-aliases/MapObjectConstructor.md) |

##### Returns

`void`

##### Throws

When called with a single class that has no static
  `type`.

***

### resolve()

```ts
resolve(key: string): 
  | MapObjectConstructor
  | undefined;
```

Defined in: [core/map/map\_object\_registry.ts:56](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_object_registry.ts#L56)

The class registered for `key`, or `undefined`.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

#### Returns

  \| [`MapObjectConstructor`](../type-aliases/MapObjectConstructor.md)
  \| `undefined`
