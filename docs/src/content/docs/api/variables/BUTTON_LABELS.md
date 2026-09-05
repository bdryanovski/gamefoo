---
title: 'Variable: BUTTON_LABELS'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / BUTTON\_LABELS

# Variable: BUTTON\_LABELS

```ts
const BUTTON_LABELS: {
  GENERIC: Record<number, string>;
  NINTENDO: Record<number, string>;
  PLAYSTATION: Record<number, string>;
  PLAYSTATION_NAMES: Record<number, string>;
  XBOX: Record<number, string>;
};
```

Defined in: [core/controls/gamepad\_mapping.ts:412](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L412)

Console-specific button labels for UI display.

Use these labels when showing controller prompts to users.

## Type Declaration

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-generic"></a> `GENERIC` | `Record`\<`number`, `string`\> | Generic labels (positional) | [core/controls/gamepad\_mapping.ts:508](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L508) |
| <a id="property-nintendo"></a> `NINTENDO` | `Record`\<`number`, `string`\> | Nintendo button labels | [core/controls/gamepad\_mapping.ts:485](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L485) |
| <a id="property-playstation"></a> `PLAYSTATION` | `Record`\<`number`, `string`\> | PlayStation button labels (using symbols) | [core/controls/gamepad\_mapping.ts:439](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L439) |
| <a id="property-playstation_names"></a> `PLAYSTATION_NAMES` | `Record`\<`number`, `string`\> | PlayStation button labels (using names) | [core/controls/gamepad\_mapping.ts:462](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L462) |
| <a id="property-xbox"></a> `XBOX` | `Record`\<`number`, `string`\> | Xbox button labels | [core/controls/gamepad\_mapping.ts:416](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L416) |

## Since

0.5.0

## Example

```ts
const label = BUTTON_LABELS.PLAYSTATION[0]; // "×"
const prompt = `Press ${label} to jump`;
```
