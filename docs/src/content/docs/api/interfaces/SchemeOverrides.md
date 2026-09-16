---
title: 'Interface: SchemeOverrides'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / SchemeOverrides

# Interface: SchemeOverrides

Defined in: [core/controls/types.ts:264](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/types.ts#L264)

Options for customizing or extending an existing control scheme.

Used with [extendScheme](../functions/extendScheme.md) to create derived schemes with
modified bindings or additional aliases.

## Since

0.5.0

## Example

```ts
const overrides: SchemeOverrides = {
  name: 'NES (Custom)',
  actions: {
    PRIMARY: { keys: ['space', 'x'] },  // Override jump to include space
  },
  aliases: {
    JUMP: 'PRIMARY',  // Add custom alias
  },
};

const customScheme = extendScheme(NES_CONTROLS, overrides);
```

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="actions"></a> `actions?` | `Partial`\<`Record`\<[`InputAction`](../type-aliases/InputAction.md), `Partial`\<[`ActionBinding`](ActionBinding.md)\>\>\> | Partial action binding overrides. Only specified actions are modified; others remain unchanged. Within an action, only specified properties are overridden. | [core/controls/types.ts:271](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/types.ts#L271) |
| <a id="aliases"></a> `aliases?` | `Record`\<`string`, [`InputAction`](../type-aliases/InputAction.md)\> | Additional or replacement aliases. Merged with existing aliases (new values override existing keys). | [core/controls/types.ts:278](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/types.ts#L278) |
| <a id="name"></a> `name?` | `string` | New name for the derived scheme. If not provided, appends " (Custom)" to the base scheme name. | [core/controls/types.ts:285](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/types.ts#L285) |
