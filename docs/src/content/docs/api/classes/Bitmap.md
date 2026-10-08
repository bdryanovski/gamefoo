---
title: 'Class: Bitmap'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Bitmap

# Class: Bitmap

Defined in: [core/renderer/objects/bitmap.ts:5](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/objects/bitmap.ts#L5)

## Extends

- `default`

## Constructors

### Constructor

```ts
new Bitmap(
   id: string, 
   data: BitmapData, 
   demension?: Demension
): Bitmap;
```

Defined in: [core/renderer/objects/bitmap.ts:12](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/objects/bitmap.ts#L12)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `data` | `BitmapData` |
| `demension` | [`Demension`](../interfaces/Demension.md) |

#### Returns

`Bitmap`

#### Overrides

```ts
Node.constructor
```

## Properties

| Property | Modifier | Type | Default value | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="id"></a> `id` | `readonly` | `string` | `undefined` | - | - | [core/renderer/objects/bitmap.ts:6](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/objects/bitmap.ts#L6) |
| <a id="position"></a> `position` | `readonly` | [`Vector2`](../interfaces/Vector2.md) | `undefined` | World-space position of the node's origin (top-left corner). **Since** 0.5.0 | `Node.position` | [entities/node.ts:50](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L50) |
| <a id="size"></a> `size` | `readonly` | [`Demension`](../interfaces/Demension.md) | `undefined` | Bounding dimensions of the node in pixels. **Since** 0.5.0 | `Node.size` | [entities/node.ts:57](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L57) |
| <a id="data"></a> `data` | `private` | `BitmapData` | `undefined` | - | - | [core/renderer/objects/bitmap.ts:8](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/objects/bitmap.ts#L8) |
| <a id="path"></a> `path` | `private` | `Path2D` \| `null` | `null` | - | - | [core/renderer/objects/bitmap.ts:10](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/objects/bitmap.ts#L10) |

## Accessors

### x

#### Get Signature

```ts
get x(): number;
```

Defined in: [entities/node.ts:90](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L90)

Horizontal position of the node (shorthand for `position.x`).

##### Since

0.5.0

##### Returns

`number`

#### Set Signature

```ts
set x(value: number): void;
```

Defined in: [entities/node.ts:99](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L99)

Sets the horizontal position.

##### Since

0.5.0

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

```ts
Node.x
```

***

### y

#### Get Signature

```ts
get y(): number;
```

Defined in: [entities/node.ts:108](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L108)

Vertical position of the node (shorthand for `position.y`).

##### Since

0.5.0

##### Returns

`number`

#### Set Signature

```ts
set y(value: number): void;
```

Defined in: [entities/node.ts:117](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L117)

Sets the vertical position.

##### Since

0.5.0

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

```ts
Node.y
```

## Methods

### getPosition()

```ts
getPosition(): Vector2;
```

Defined in: [entities/node.ts:134](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L134)

Returns the node's current position.

#### Returns

[`Vector2`](../interfaces/Vector2.md)

The internal [Vector2](../interfaces/Vector2.md) reference with `x` and `y`.

#### Since

0.5.0

#### Example

```ts
const pos = node.getPosition();
console.log(`Node at (${pos.x}, ${pos.y})`);
```

#### Inherited from

```ts
Node.getPosition
```

***

### getSize()

```ts
getSize(): Demension;
```

Defined in: [entities/node.ts:151](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L151)

Returns the node's bounding dimensions.

#### Returns

[`Demension`](../interfaces/Demension.md)

The internal [Demension](../interfaces/Demension.md) reference with `width` and `height`.

#### Since

0.5.0

#### Example

```ts
const size = node.getSize();
console.log(`Node is ${size.width}×${size.height} pixels`);
```

#### Inherited from

```ts
Node.getSize
```

***

### render()

```ts
render(): Path2D | null;
```

Defined in: [core/renderer/objects/bitmap.ts:34](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/objects/bitmap.ts#L34)

Draws the node to the screen.

Called once per frame after [update](Entity.md#update). Subclasses
must implement this method to render sprites, shapes, text, or any
other visual representation.

#### Returns

`Path2D` \| `null`

#### Since

0.5.0

#### Example

```ts
render(ctx: RenderContext) {
  ctx.fillRect(this.x, this.y, this.size.width, this.size.height, "#ff0000");
}
```

#### Overrides

```ts
Node.render
```

***

### update()

```ts
update(): void;
```

Defined in: [core/renderer/objects/bitmap.ts:38](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/objects/bitmap.ts#L38)

Advances the node's state by one frame.

Called once per frame by the game loop. Subclasses must implement
this method to update position, animation, AI, or any other
per-frame logic.

#### Returns

`void`

#### Since

0.5.0

#### Example

```ts
update(dt: number) {
  this.x += this.velocity.x * dt;
  this.y += this.velocity.y * dt;
}
```

#### Overrides

```ts
Node.update
```

***

### setSize()

```ts
protected setSize(width: number, height: number): void;
```

Defined in: [entities/node.ts:168](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L168)

Sets the node's bounding dimensions.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `width` | `number` | New width in pixels. |
| `height` | `number` | New height in pixels. |

#### Returns

`void`

#### Since

0.5.0

#### Example

```ts
this.setSize(64, 64); // Resize to 64×64
```

#### Inherited from

```ts
Node.setSize
```
