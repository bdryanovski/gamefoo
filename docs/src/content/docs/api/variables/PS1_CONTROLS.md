---
title: 'Variable: PS1_CONTROLS'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / PS1\_CONTROLS

# Variable: PS1\_CONTROLS

```ts
const PS1_CONTROLS: ControlScheme;
```

Defined in: [core/controls/schemes/ps1.ts:57](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/schemes/ps1.ts#L57)

PlayStation control scheme.

Physical layout:
```
  [L2]  [L1]              [R1]  [R2]

             [SELECT] [START]
  [D-PAD]              [△]
                     [□]  [○]
                       [×]
```

Button conventions (Japanese vs Western differ):
- Japan: ○ = confirm, × = cancel
- West: × = confirm, ○ = cancel
This scheme uses Western conventions (× = PRIMARY/confirm).

Keyboard mapping:
- D-pad: WASD or Arrow keys
- Cross (×): X or J (confirm)
- Circle (○): Z or K (cancel)
- Square (□): C (attack)
- Triangle (△): V (menu/special)
- L1/R1: Q/E
- L2/R2: 1/2
- Start: Enter
- Select: Shift

## Since

0.5.0

## Example

```ts
import { InputMapper, PS1_CONTROLS } from 'gamefoo';

const mapper = new InputMapper(input, PS1_CONTROLS);
if (mapper.isAction('CROSS')) player.jump();      // or 'X'
if (mapper.isAction('SQUARE')) player.attack();
if (mapper.isAction('R1')) player.aim();
```
