[**@dryanovski/gamefoo**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / core/sprite

# core/sprite

## Classes

### default

Defined in: [core/sprite.ts:7](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/sprite.ts#L7)

#### Constructors

##### Constructor

```ts
new default(
   image, 
   width, 
   height, 
   animations?): default;
```

Defined in: [core/sprite.ts:15](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/sprite.ts#L15)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `image` | `HTMLImageElement` |
| `width` | `number` |
| `height` | `number` |
| `animations?` | `Record`\<`string`, `AnimationDefinition`\> |

###### Returns

[`default`](#default)

#### Methods

##### getFrameRect()

```ts
getFrameRect(frame): {
  height: number;
  width: number;
  x: number;
  y: number;
};
```

Defined in: [core/sprite.ts:29](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/sprite.ts#L29)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `frame` | `number` |

###### Returns

```ts
{
  height: number;
  width: number;
  x: number;
  y: number;
}
```

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [core/sprite.ts:33](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/sprite.ts#L33) |
| `width` | `number` | [core/sprite.ts:32](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/sprite.ts#L32) |
| `x` | `number` | [core/sprite.ts:30](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/sprite.ts#L30) |
| `y` | `number` | [core/sprite.ts:31](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/sprite.ts#L31) |

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="animations"></a> `animations` | `readonly` | `Map`\<`string`, `AnimationDefinition`\> | [core/sprite.ts:13](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/sprite.ts#L13) |
| <a id="columns"></a> `columns` | `readonly` | `number` | [core/sprite.ts:11](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/sprite.ts#L11) |
| <a id="height"></a> `height` | `readonly` | `number` | [core/sprite.ts:10](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/sprite.ts#L10) |
| <a id="image"></a> `image` | `readonly` | `HTMLImageElement` | [core/sprite.ts:8](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/sprite.ts#L8) |
| <a id="rows"></a> `rows` | `readonly` | `number` | [core/sprite.ts:12](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/sprite.ts#L12) |
| <a id="width"></a> `width` | `readonly` | `number` | [core/sprite.ts:9](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/sprite.ts#L9) |
