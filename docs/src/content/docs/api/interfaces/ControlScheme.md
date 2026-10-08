---
title: 'Interface: ControlScheme'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / ControlScheme

# Interface: ControlScheme

Defined in: [core/controls/types.ts:174](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/types.ts#L174)

A complete control scheme with all action bindings and aliases.

Control schemes define how physical inputs map to game actions for a
specific console or input style. Each scheme includes:
- Bindings for all standard [InputAction](../type-aliases/InputAction.md) values
- Console-specific aliases (e.g., 'A' -> 'PRIMARY' for NES)

## Since

0.5.0

## Example

```ts
const myScheme: ControlScheme = {
  name: 'Custom',
  actions: {
    UP: { keys: ['w', 'arrowup'], gamepad: { button: 12 } },
    PRIMARY: { keys: ['space'], gamepad: { button: 0 } },
    // ... other actions
  },
  aliases: {
    JUMP: 'PRIMARY',
    FIRE: 'SECONDARY',
  },
};
```

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="actions"></a> `actions` | `readonly` | `Readonly`\<`Record`\<[`InputAction`](../type-aliases/InputAction.md), [`ActionBinding`](ActionBinding.md)\>\> | Action bindings for all standard input actions. Every [InputAction](../type-aliases/InputAction.md) must have a binding, even if empty (use `{ keys: [] }` for unsupported actions). | [core/controls/types.ts:188](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/types.ts#L188) |
| <a id="aliases"></a> `aliases` | `readonly` | `Readonly`\<`Record`\<`string`, [`InputAction`](../type-aliases/InputAction.md)\>\> | Console-specific button name aliases. Maps custom names to standard [InputAction](../type-aliases/InputAction.md) values, allowing games to use console-specific terminology. **Examples** **NES aliases** `aliases: { A: 'PRIMARY', // NES A button B: 'SECONDARY', // NES B button }` **PlayStation aliases** `aliases: { CROSS: 'PRIMARY', CIRCLE: 'SECONDARY', SQUARE: 'TERTIARY', TRIANGLE: 'QUATERNARY', }` | [core/controls/types.ts:214](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/types.ts#L214) |
| <a id="name"></a> `name` | `readonly` | `string` | Display name of the control scheme. **Example** ``'NES'`, `'PICO-8'`, `'Default (WASD)'`` | [core/controls/types.ts:180](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/types.ts#L180) |
