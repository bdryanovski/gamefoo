---
title: 'Variable: PICO8_CONTROLS'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / PICO8\_CONTROLS

# Variable: PICO8\_CONTROLS

```ts
const PICO8_CONTROLS: ControlScheme;
```

Defined in: [core/controls/schemes/pico8.ts:42](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/schemes/pico8.ts#L42)

PICO-8 control scheme.

Physical layout:
```
    [D-PAD]     [O] [X]
```

Keyboard mapping:
- D-pad: Arrow keys (or S/F/E/D for Player 2)
- O button: Z or C or N
- X button: X or V or M

## Since

0.5.0

## Example

```ts
import { InputMapper, PICO8_CONTROLS } from 'gamefoo';

const mapper = new InputMapper(input, PICO8_CONTROLS);
if (mapper.isAction('O')) player.jump();  // Console-specific alias
if (mapper.isAction('X')) player.shoot(); // Console-specific alias
```
