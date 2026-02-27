[**@dryanovski/gamefoo**](../../README.md)

***

[@dryanovski/gamefoo](../../README.md) / core/fonts/font\_bitmap

# core/fonts/font\_bitmap

## Classes

### default

Defined in: [core/fonts/font\_bitmap.ts:17](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/fonts/font_bitmap.ts#L17)

#### Accessors

##### metadata

###### Get Signature

```ts
get metadata(): 
  | {
  chars: string;
  data: Record<string, number[]>;
  height: number;
  name: string;
  spacing: number;
  width: number;
}
  | null;
```

Defined in: [core/fonts/font\_bitmap.ts:40](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/fonts/font_bitmap.ts#L40)

###### Returns

  \| \{
  `chars`: `string`;
  `data`: `Record`\<`string`, `number`[]\>;
  `height`: `number`;
  `name`: `string`;
  `spacing`: `number`;
  `width`: `number`;
\}
  \| `null`

#### Constructors

##### Constructor

```ts
new default(name): default;
```

Defined in: [core/fonts/font\_bitmap.ts:26](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/fonts/font_bitmap.ts#L26)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

###### Returns

[`default`](#default)

#### Methods

##### getChar()

```ts
getChar(char): number[] | null;
```

Defined in: [core/fonts/font\_bitmap.ts:44](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/fonts/font_bitmap.ts#L44)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `char` | `string` |

###### Returns

`number`[] \| `null`

##### getTextWidth()

```ts
getTextWidth(text): number;
```

Defined in: [core/fonts/font\_bitmap.ts:48](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/fonts/font_bitmap.ts#L48)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |

###### Returns

`number`

##### renderChar()

```ts
renderChar(
   char, 
   x, 
   y, 
   ctx): void;
```

Defined in: [core/fonts/font\_bitmap.ts:52](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/fonts/font_bitmap.ts#L52)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `char` | `string` |
| `x` | `number` |
| `y` | `number` |
| `ctx` | `CanvasRenderingContext2D` |

###### Returns

`void`

##### renderText()

```ts
renderText(
   text, 
   x, 
   y, 
   ctx): void;
```

Defined in: [core/fonts/font\_bitmap.ts:67](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/fonts/font_bitmap.ts#L67)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |
| `x` | `number` |
| `y` | `number` |
| `ctx` | `CanvasRenderingContext2D` |

###### Returns

`void`

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="name"></a> `name` | `readonly` | `string` | [core/fonts/font\_bitmap.ts:18](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/fonts/font_bitmap.ts#L18) |
