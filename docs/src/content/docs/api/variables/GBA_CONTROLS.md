---
title: 'Variable: GBA_CONTROLS'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / GBA\_CONTROLS

# Variable: GBA\_CONTROLS

```ts
const GBA_CONTROLS: ControlScheme;
```

Defined in: [core/controls/schemes/gba.ts:49](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/schemes/gba.ts#L49)

Game Boy Advance control scheme.

Physical layout:
```
  [L]                    [R]

                     [A]
  [D-PAD]         [B]

     [SELECT] [START]
```

Keyboard mapping:
- D-pad: WASD or Arrow keys
- A button: X or J
- B button: Z or K
- L shoulder: Q
- R shoulder: E
- Start: Enter
- Select: Shift

## Since

0.5.0

## Example

```ts
import { InputMapper, GBA_CONTROLS } from 'gamefoo';

const mapper = new InputMapper(input, GBA_CONTROLS);
if (mapper.isAction('A')) player.jump();
if (mapper.isAction('L')) player.prevWeapon();
if (mapper.isAction('R')) player.nextWeapon();
```
