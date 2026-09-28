---
title: 'Variable: N64_CONTROLS'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / N64\_CONTROLS

# Variable: N64\_CONTROLS

```ts
const N64_CONTROLS: ControlScheme;
```

Defined in: [core/controls/schemes/n64.ts:56](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/schemes/n64.ts#L56)

N64 control scheme.

Physical layout:
```
  [L]                        [R]

  [D-PAD]              [C-UP]
         [STICK] [C-LEFT][C-RIGHT]
                       [C-DOWN]
             [B]  [A]
           [Z]
     [START]
```

The N64 controller can be held in different ways:
- Left grip + middle: D-pad + Z + L + B + A
- Middle + right: Stick + Z + R + B + A + C-buttons (most common)

Keyboard mapping (middle + right grip style):
- Analog stick: WASD
- A button: X or J
- B button: Z or K
- C-buttons: I/K/J/L (arrow cluster) or Numpad
- Z trigger: Space
- L/R shoulders: Q/E
- Start: Enter

## Since

0.5.0

## Example

```ts
import { InputMapper, N64_CONTROLS } from 'gamefoo';

const mapper = new InputMapper(input, N64_CONTROLS);
if (mapper.isAction('A')) player.jump();
if (mapper.isAction('Z')) player.aim();
if (mapper.isAction('C_UP')) camera.lookUp();
```
