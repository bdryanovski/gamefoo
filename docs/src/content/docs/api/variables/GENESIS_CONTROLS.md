---
title: 'Variable: GENESIS_CONTROLS'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / GENESIS\_CONTROLS

# Variable: GENESIS\_CONTROLS

```ts
const GENESIS_CONTROLS: ControlScheme;
```

Defined in: [core/controls/schemes/genesis.ts:50](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/schemes/genesis.ts#L50)

Sega Genesis / Mega Drive control scheme (3-button).

Physical layout:
```
                  [START]
  [D-PAD]      [A] [B] [C]
```

Button conventions vary by game:
- Sonic: A/B/C all jump, some games use C for spin dash
- Fighting games: A = punch, B = kick, C = special
- Action games: A = jump, B = attack, C = special

Keyboard mapping:
- D-pad: WASD or Arrow keys
- A button: Z or K (leftmost)
- B button: X or J (middle)
- C button: C (rightmost)
- Start: Enter

## Since

0.5.0

## Example

```ts
import { InputMapper, GENESIS_CONTROLS } from 'gamefoo';

const mapper = new InputMapper(input, GENESIS_CONTROLS);
// Sonic-style: any button jumps
if (mapper.isAction('A') || mapper.isAction('B') || mapper.isAction('C')) {
  player.jump();
}
```
