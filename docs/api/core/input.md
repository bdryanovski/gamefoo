[**@dryanovski/gamefoo**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / core/input

# core/input

## Classes

### default

Defined in: [core/input.ts:1](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/input.ts#L1)

#### Constructors

##### Constructor

```ts
new default(): default;
```

Defined in: [core/input.ts:6](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/input.ts#L6)

###### Returns

[`default`](#default)

#### Methods

##### getMousePosition()

```ts
getMousePosition(): {
  x: number;
  y: number;
};
```

Defined in: [core/input.ts:41](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/input.ts#L41)

###### Returns

```ts
{
  x: number;
  y: number;
}
```

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `x` | `number` | [core/input.ts:41](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/input.ts#L41) |
| `y` | `number` | [core/input.ts:41](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/input.ts#L41) |

##### getPressedKeys()

```ts
getPressedKeys(): Set<string>;
```

Defined in: [core/input.ts:33](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/input.ts#L33)

###### Returns

`Set`\<`string`\>

##### isKeyDown()

```ts
isKeyDown(key): boolean;
```

Defined in: [core/input.ts:29](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/input.ts#L29)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

###### Returns

`boolean`

##### isMouseButtonDown()

```ts
isMouseButtonDown(button): boolean;
```

Defined in: [core/input.ts:37](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/input.ts#L37)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `button` | `number` |

###### Returns

`boolean`

##### reset()

```ts
reset(): void;
```

Defined in: [core/input.ts:45](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/input.ts#L45)

###### Returns

`void`
