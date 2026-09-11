---
title: 'Variable: SNES_CONTROLS'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / SNES\_CONTROLS

# Variable: SNES\_CONTROLS

```ts
const SNES_CONTROLS: ControlScheme;
```

Defined in: [core/controls/schemes/snes.ts:50](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/schemes/snes.ts#L50)

SNES control scheme.

Physical layout:
```
       [L]                    [R]
             [SELECT] [START]
  [D-PAD]              [Y] [X]
                       [B] [A]
```

Keyboard mapping:
- D-pad: WASD or Arrow keys
- A button: X or J (bottom right)
- B button: Z or K (bottom left)
- X button: C (top right)
- Y button: V (top left)
- L shoulder: Q
- R shoulder: E
- Start: Enter
- Select: Shift

## Since

0.5.0

## Example

```ts
import { InputMapper, SNES_CONTROLS } from 'gamefoo';

const mapper = new InputMapper(input, SNES_CONTROLS);
if (mapper.isAction('A')) player.jump();
if (mapper.isAction('Y')) player.attack();
if (mapper.isAction('L')) camera.rotateLeft();
```
