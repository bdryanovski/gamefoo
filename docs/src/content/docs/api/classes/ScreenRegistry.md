---
title: 'Class: ScreenRegistry'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / ScreenRegistry

# Class: ScreenRegistry

Defined in: [core/map/screen\_registry.ts:29](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen_registry.ts#L29)

Maps a screen coordinate (`"x,y"`) to the [Screen](Screen.md) subclass that
should represent it, with an optional default class applied to every other
screen. Populate it before [MapManager.load](MapManager.md#load); coordinates without an
entry fall back to the default class, and if none is set, to the base
[Screen](Screen.md).

This lets a game keep most screens generic while giving specific rooms
bespoke logic — configuring object variants, applying story state, or
triggering UI on enter/exit.

## Since

0.5.0

## Example

```ts
const screens = new ScreenRegistry();
screens.register(0, 4, DarkChamberScreen); // one bespoke room
screens.setDefault(RoomScreen);            // every other room
const map = await MapManager.fromUrl('./map.json', { screens });
```

## See

 - [Screen](Screen.md)
 - [MapObjectRegistry](MapObjectRegistry.md)

## Constructors

### Constructor

```ts
new ScreenRegistry(): ScreenRegistry;
```

#### Returns

`ScreenRegistry`

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="bycoordinate"></a> `byCoordinate` | `private` | `Map`\<`string`, [`ScreenConstructor`](../type-aliases/ScreenConstructor.md)\> | [core/map/screen\_registry.ts:30](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen_registry.ts#L30) |
| <a id="defaultconstructor"></a> `defaultConstructor?` | `private` | [`ScreenConstructor`](../type-aliases/ScreenConstructor.md) | [core/map/screen\_registry.ts:31](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen_registry.ts#L31) |

## Methods

### register()

```ts
register(
   x: number, 
   y: number, 
   ctor: ScreenConstructor
): void;
```

Defined in: [core/map/screen\_registry.ts:36](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen_registry.ts#L36)

Binds a screen class to a single grid coordinate.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |
| `ctor` | [`ScreenConstructor`](../type-aliases/ScreenConstructor.md) |

#### Returns

`void`

***

### resolve()

```ts
resolve(x: number, y: number): ScreenConstructor | undefined;
```

Defined in: [core/map/screen\_registry.ts:52](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen_registry.ts#L52)

The screen class for `(x, y)` — the per-coordinate entry, else the
default, else `undefined` (caller falls back to the base `Screen`).

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |

#### Returns

[`ScreenConstructor`](../type-aliases/ScreenConstructor.md) \| `undefined`

***

### setDefault()

```ts
setDefault(ctor: ScreenConstructor): void;
```

Defined in: [core/map/screen\_registry.ts:44](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen_registry.ts#L44)

Sets the class used for every screen without an explicit coordinate
entry.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctor` | [`ScreenConstructor`](../type-aliases/ScreenConstructor.md) |

#### Returns

`void`
