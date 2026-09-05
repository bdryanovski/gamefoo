---
title: 'Variable: PSP_CONTROLS'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / PSP\_CONTROLS

# Variable: PSP\_CONTROLS

```ts
const PSP_CONTROLS: ControlScheme;
```

Defined in: [core/controls/schemes/psp.ts:51](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/schemes/psp.ts#L51)

PSP control scheme.

Physical layout:
```
  [L]                          [R]

  [D-PAD]    [SCREEN]      [△]
                         [□]  [○]
  [ANALOG]                 [×]

         [SELECT]  [START]
```

Keyboard mapping:
- D-pad/Analog: WASD or Arrow keys
- Cross (×): X or J
- Circle (○): Z or K
- Square (□): C
- Triangle (△): V
- L/R: Q/E
- Start: Enter
- Select: Shift

## Since

0.5.0

## Example

```ts
import { InputMapper, PSP_CONTROLS } from 'gamefoo';

const mapper = new InputMapper(input, PSP_CONTROLS);
if (mapper.isAction('CROSS')) player.confirm();
if (mapper.isAction('L')) camera.rotateLeft();
```
