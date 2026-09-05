---
title: 'Class: AssetManager'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / AssetManager

# Class: AssetManager

Defined in: [core/map/asset\_manager.ts:33](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/asset_manager.ts#L33)

Loads a [MapProject](../interfaces/MapProject.md)'s images and pre-resolves its catalog into
draw-ready [Frame](../interfaces/Frame.md)s and [Clip](../interfaces/Clip.md)s, so the render loop never
performs string/id lookups.

All catalogs are keyed by their authoring id (`spr_…`, `anim_…`,
`sm_…`, `img_…`). [MapManager](MapManager.md) owns one `AssetManager` shared by
every [Screen](Screen.md).

## Since

0.5.0

## Example

```ts
const assets = new AssetManager();
await assets.load(project, (img) => `./assets/${img.name}`);
const frame = assets.frame("spr_floor");
```

## See

[MapManager](MapManager.md)

## Constructors

### Constructor

```ts
new AssetManager(): AssetManager;
```

#### Returns

`AssetManager`

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="clipsbyid"></a> `clipsById` | `private` | `Map`\<`string`, [`Clip`](../interfaces/Clip.md)\> | Resolved animations by `AnimationDefinition.id`. | [core/map/asset\_manager.ts:45](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/asset_manager.ts#L45) |
| <a id="framesbyid"></a> `framesById` | `private` | `Map`\<`string`, [`Frame`](../interfaces/Frame.md)\> | Draw-ready source rects by `SpriteRegionDefinition.id`. | [core/map/asset\_manager.ts:41](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/asset_manager.ts#L41) |
| <a id="images"></a> `images` | `private` | `Map`\<`string`, `HTMLImageElement`\> | Loaded images by `ImageDefinition.id`. | [core/map/asset\_manager.ts:37](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/asset_manager.ts#L37) |
| <a id="machinesbyid"></a> `machinesById` | `private` | `Map`\<`string`, [`StateMachineDefinition`](../interfaces/StateMachineDefinition.md)\> | Embedded machines by `StateMachineDefinition.id`. | [core/map/asset\_manager.ts:49](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/asset_manager.ts#L49) |
| <a id="objectsbyid"></a> `objectsById` | `private` | `Map`\<`string`, [`GameObjectDefinition`](../interfaces/GameObjectDefinition.md)\> | Object prefabs by `GameObjectDefinition.id`. | [core/map/asset\_manager.ts:53](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/asset_manager.ts#L53) |
| <a id="objectsbymachineid"></a> `objectsByMachineId` | `private` | `Map`\<`string`, [`GameObjectDefinition`](../interfaces/GameObjectDefinition.md)\> | Object prefabs by their embedded machine's id. | [core/map/asset\_manager.ts:57](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/asset_manager.ts#L57) |
| <a id="objectsbyname"></a> `objectsByName` | `private` | `Map`\<`string`, [`GameObjectDefinition`](../interfaces/GameObjectDefinition.md)\> | Object prefabs by their `name` (last one wins on duplicates). | [core/map/asset\_manager.ts:61](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/asset_manager.ts#L61) |
| <a id="spritecollisionsbyid"></a> `spriteCollisionsById` | `private` | `Map`\<`string`, [`CollisionDefinition`](../interfaces/CollisionDefinition.md)[]\> | Authored colliders by `SpriteRegionDefinition.id` (only sprites that have any). | [core/map/asset\_manager.ts:65](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/asset_manager.ts#L65) |

## Methods

### clip()

```ts
clip(id: string): Clip | undefined;
```

Defined in: [core/map/asset\_manager.ts:140](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/asset_manager.ts#L140)

Resolved animation clip for an animation id.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

#### Returns

[`Clip`](../interfaces/Clip.md) \| `undefined`

***

### frame()

```ts
frame(id: string): Frame | undefined;
```

Defined in: [core/map/asset\_manager.ts:133](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/asset_manager.ts#L133)

Draw-ready frame for a sprite id, or `undefined` if unknown.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

#### Returns

[`Frame`](../interfaces/Frame.md) \| `undefined`

***

### image()

```ts
image(id: string): HTMLImageElement | undefined;
```

Defined in: [core/map/asset\_manager.ts:182](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/asset_manager.ts#L182)

Loaded image element for an image id.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

#### Returns

`HTMLImageElement` \| `undefined`

***

### load()

```ts
load(project: MapProject, resolve?: ImageResolver): Promise<void>;
```

Defined in: [core/map/asset\_manager.ts:75](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/asset_manager.ts#L75)

Loads every image, then resolves frames, clips, machines and objects.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `project` | [`MapProject`](../interfaces/MapProject.md) | The parsed project document. |
| `resolve` | [`ImageResolver`](../type-aliases/ImageResolver.md) | Maps each `ImageDefinition` to the URL to fetch. Defaults to the raw `url` field. Use it to redirect editor paths (`/uploads/x.png`) to wherever the game actually serves them. |

#### Returns

`Promise`\<`void`\>

***

### machine()

```ts
machine(id: string): 
  | StateMachineDefinition
  | undefined;
```

Defined in: [core/map/asset\_manager.ts:147](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/asset_manager.ts#L147)

State machine definition for a machine id.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

#### Returns

  \| [`StateMachineDefinition`](../interfaces/StateMachineDefinition.md)
  \| `undefined`

***

### object()

```ts
object(id: string): 
  | GameObjectDefinition
  | undefined;
```

Defined in: [core/map/asset\_manager.ts:154](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/asset_manager.ts#L154)

Object prefab for an object id.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

#### Returns

  \| [`GameObjectDefinition`](../interfaces/GameObjectDefinition.md)
  \| `undefined`

***

### objectByMachine()

```ts
objectByMachine(machineId: string): 
  | GameObjectDefinition
  | undefined;
```

Defined in: [core/map/asset\_manager.ts:161](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/asset_manager.ts#L161)

Object prefab that owns the machine with `machineId`.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `machineId` | `string` |

#### Returns

  \| [`GameObjectDefinition`](../interfaces/GameObjectDefinition.md)
  \| `undefined`

***

### objectByName()

```ts
objectByName(name: string): 
  | GameObjectDefinition
  | undefined;
```

Defined in: [core/map/asset\_manager.ts:168](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/asset_manager.ts#L168)

Object prefab with the given `name`, or `undefined`.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

  \| [`GameObjectDefinition`](../interfaces/GameObjectDefinition.md)
  \| `undefined`

***

### spriteCollisions()

```ts
spriteCollisions(id: string): 
  | CollisionDefinition[]
  | undefined;
```

Defined in: [core/map/asset\_manager.ts:175](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/asset_manager.ts#L175)

Authored colliders for a sprite id, or `undefined` if it has none.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

#### Returns

  \| [`CollisionDefinition`](../interfaces/CollisionDefinition.md)[]
  \| `undefined`
