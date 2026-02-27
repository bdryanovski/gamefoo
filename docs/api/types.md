[**@dryanovski/gamefoo**](README.md)

***

[@dryanovski/gamefoo](README.md) / types

# types

## Interfaces

### CollisionInfo

Defined in: [types.ts:15](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/types.ts#L15)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="other"></a> `other` | [`default`](entities/entity.md#abstract-default) | [types.ts:17](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/types.ts#L17) |
| <a id="othertags"></a> `otherTags` | `Set`\<`string`\> | [types.ts:19](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/types.ts#L19) |
| <a id="self"></a> `self` | [`default`](entities/entity.md#abstract-default) | [types.ts:16](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/types.ts#L16) |
| <a id="selftags"></a> `selfTags` | `Set`\<`string`\> | [types.ts:18](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/types.ts#L18) |

***

### Vector2

Defined in: [types.ts:4](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/types.ts#L4)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="x"></a> `x` | `number` | [types.ts:5](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/types.ts#L5) |
| <a id="y"></a> `y` | `number` | [types.ts:6](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/types.ts#L6) |

***

### WorldBounds

Defined in: [types.ts:22](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/types.ts#L22)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="height"></a> `height` | `number` | [types.ts:26](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/types.ts#L26) |
| <a id="width"></a> `width` | `number` | [types.ts:25](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/types.ts#L25) |
| <a id="x-1"></a> `x` | `number` | [types.ts:23](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/types.ts#L23) |
| <a id="y-1"></a> `y` | `number` | [types.ts:24](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/types.ts#L24) |

## Type Aliases

### ColliderShape

```ts
type ColliderShape = 
  | {
  height: number;
  offset?: Vector2;
  type: "aabb";
  width: number;
}
  | {
  offset?: Vector2;
  radius: number;
  type: "circle";
};
```

Defined in: [types.ts:11](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/types.ts#L11)

***

### GameObject

```ts
type GameObject = 
  | default
  | default;
```

Defined in: [types.ts:9](https://github.com/bdryanovski/gamefoo/blob/aa606312bb01e954d20d0f6e2f74378ccd4b5266/src/types.ts#L9)
