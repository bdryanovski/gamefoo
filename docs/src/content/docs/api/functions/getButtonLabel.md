---
title: 'Function: getButtonLabel()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / getButtonLabel

# Function: getButtonLabel()

```ts
function getButtonLabel(buttonIndex: number, style?: "XBOX" | "PLAYSTATION" | "PLAYSTATION_NAMES" | "NINTENDO" | "GENERIC"): string;
```

Defined in: [core/controls/gamepad\_mapping.ts:552](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L552)

Gets a human-readable label for a gamepad button.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `buttonIndex` | `number` | `undefined` | Standard Gamepad button index (0-16) |
| `style` | `"XBOX"` \| `"PLAYSTATION"` \| `"PLAYSTATION_NAMES"` \| `"NINTENDO"` \| `"GENERIC"` | `'GENERIC'` | Label style (XBOX, PLAYSTATION, NINTENDO, GENERIC) |

## Returns

`string`

Human-readable button label

## Since

0.5.0

## Example

```ts
getButtonLabel(0, 'XBOX');        // "A"
getButtonLabel(0, 'PLAYSTATION'); // "×"
getButtonLabel(0, 'NINTENDO');    // "B"
```
