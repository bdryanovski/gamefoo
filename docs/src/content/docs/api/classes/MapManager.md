---
title: 'Class: MapManager'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / MapManager

# Class: MapManager

Defined in: [core/map/map\_manager.ts:65](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_manager.ts#L65)

The whole map: every screen, keyed by grid coordinate, plus a shared
[AssetManager](AssetManager.md) and a `current` pointer.

A screen is the navigable unit (often called a "level"). Screens are
*built* once at load, but their live objects only exist while the screen
is current: navigating activates the target screen (spawning its
objects) and deactivates the previous one (disposing them). Navigation
itself never touches the network.

## Since

0.5.0

## Example

**Load with custom classes**

```ts
const registry = new MapObjectRegistry();
registry.register(Chest);

const map = await MapManager.fromUrl("./map.json", {
  resolve: (img) => `./assets/${img.name}`,
  registry,
});
map.navigateTo(0, 0);

// in the engine loop:
map.update(dt);
map.render(ctx);
```

## See

 - [Screen](Screen.md)
 - [MapObjectRegistry](MapObjectRegistry.md)

## Constructors

### Constructor

```ts
new MapManager(): MapManager;
```

#### Returns

`MapManager`

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="assets"></a> `assets` | `readonly` | [`AssetManager`](AssetManager.md) | Shared catalog of images/frames/clips/machines. | [core/map/map\_manager.ts:69](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_manager.ts#L69) |
| <a id="currentscreen"></a> `currentScreen?` | `private` | [`Screen`](Screen.md) | - | [core/map/map\_manager.ts:76](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_manager.ts#L76) |
| <a id="map"></a> `map?` | `private` | [`MapData`](../interfaces/MapData.md) | - | [core/map/map\_manager.ts:75](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_manager.ts#L75) |
| <a id="screens"></a> `screens` | `private` | `Map`\<`string`, [`Screen`](Screen.md)\> | Every screen keyed by `"x,y"`. | [core/map/map\_manager.ts:74](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_manager.ts#L74) |

## Accessors

### coordinates

#### Get Signature

```ts
get coordinates(): ScreenCoordinate[];
```

Defined in: [core/map/map\_manager.ts:163](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_manager.ts#L163)

Coordinates of every screen in the map.

##### Returns

[`ScreenCoordinate`](../type-aliases/ScreenCoordinate.md)[]

***

### current

#### Get Signature

```ts
get current(): Screen | undefined;
```

Defined in: [core/map/map\_manager.ts:149](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_manager.ts#L149)

The active screen, or `undefined` before [MapManager.load](#load).

##### Returns

[`Screen`](Screen.md) \| `undefined`

***

### screenSize

#### Get Signature

```ts
get screenSize(): {
  height: number;
  width: number;
};
```

Defined in: [core/map/map\_manager.ts:170](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_manager.ts#L170)

Pixel size of a single screen.

##### Returns

```ts
{
  height: number;
  width: number;
}
```

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [core/map/map\_manager.ts:170](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_manager.ts#L170) |
| `width` | `number` | [core/map/map\_manager.ts:170](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_manager.ts#L170) |

## Methods

### fromUrl()

```ts
static fromUrl(url: string, options?: MapLoadOptions): Promise<MapManager>;
```

Defined in: [core/map/map\_manager.ts:84](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_manager.ts#L84)

Fetches a project JSON document and builds the map from it.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | URL of the exported `*.map.project.json` document. |
| `options` | [`MapLoadOptions`](../interfaces/MapLoadOptions.md) | Image resolver and/or object-class registry. |

#### Returns

`Promise`\<`MapManager`\>

***

### load()

```ts
load(project: MapProject, options?: MapLoadOptions): Promise<void>;
```

Defined in: [core/map/map\_manager.ts:102](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_manager.ts#L102)

Loads assets and builds every screen from an already-parsed project,
then activates the current screen (`(0, 0)` or the first present).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `project` | [`MapProject`](../interfaces/MapProject.md) | The parsed project document. |
| `options` | [`MapLoadOptions`](../interfaces/MapLoadOptions.md) | Image resolver and/or object-class registry. |

#### Returns

`Promise`\<`void`\>

***

### navigateTo()

```ts
navigateTo(x: number, y: number): boolean;
```

Defined in: [core/map/map\_manager.ts:131](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_manager.ts#L131)

Points `current` at the screen at `(x, y)`, deactivating the previous
screen and activating the new one.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |

#### Returns

`boolean`

`true` if that screen exists, `false` otherwise (current
  stays put).

***

### render()

```ts
render(ctx: RenderContext): void;
```

Defined in: [core/map/map\_manager.ts:187](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_manager.ts#L187)

Renders the current screen.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) |

#### Returns

`void`

***

### screenAt()

```ts
screenAt(x: number, y: number): Screen | undefined;
```

Defined in: [core/map/map\_manager.ts:156](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_manager.ts#L156)

The screen at `(x, y)`, if any.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |

#### Returns

[`Screen`](Screen.md) \| `undefined`

***

### update()

```ts
update(deltaTime: number): void;
```

Defined in: [core/map/map\_manager.ts:180](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_manager.ts#L180)

Advances the current screen's live objects.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |

#### Returns

`void`
