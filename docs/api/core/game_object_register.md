[**@dryanovski/gamefoo**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / core/game\_object\_register

# core/game\_object\_register

## Classes

### default

Defined in: [core/game\_object\_register.ts:3](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/game_object_register.ts#L3)

#### Constructors

##### Constructor

```ts
new default(): default;
```

###### Returns

[`default`](#default)

#### Methods

##### get()

```ts
get(id): GameObject | undefined;
```

Defined in: [core/game\_object\_register.ts:10](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/game_object_register.ts#L10)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

###### Returns

[`GameObject`](../types.md#gameobject) \| `undefined`

##### getAll()

```ts
getAll(_filter): GameObject[];
```

Defined in: [core/game\_object\_register.ts:18](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/game_object_register.ts#L18)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `_filter` | () => `true` |

###### Returns

[`GameObject`](../types.md#gameobject)[]

##### has()

```ts
has(id): boolean;
```

Defined in: [core/game\_object\_register.ts:14](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/game_object_register.ts#L14)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

###### Returns

`boolean`

##### register()

```ts
register(object): void;
```

Defined in: [core/game\_object\_register.ts:6](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/game_object_register.ts#L6)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `object` | [`GameObject`](../types.md#gameobject) |

###### Returns

`void`

##### renderAll()

```ts
renderAll(ctx): void;
```

Defined in: [core/game\_object\_register.ts:28](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/game_object_register.ts#L28)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | `CanvasRenderingContext2D` |

###### Returns

`void`

##### updateAll()

```ts
updateAll(deltaTime): void;
```

Defined in: [core/game\_object\_register.ts:22](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/core/game_object_register.ts#L22)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |

###### Returns

`void`
