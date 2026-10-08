---
title: 'Variable: GAMEBOY_CONTROLS'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / GAMEBOY\_CONTROLS

# Variable: GAMEBOY\_CONTROLS

```ts
const GAMEBOY_CONTROLS: ControlScheme;
```

Defined in: [core/controls/schemes/gameboy.ts:44](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/schemes/gameboy.ts#L44)

Game Boy control scheme.

Physical layout:
```
                  [A]
  [D-PAD]      [B]

     [SELECT] [START]
```

Keyboard mapping:
- D-pad: WASD or Arrow keys
- A button: X or J
- B button: Z or K
- Start: Enter
- Select: Shift

## Since

0.5.0

## Example

```ts
import { InputMapper, GAMEBOY_CONTROLS } from 'gamefoo';

const mapper = new InputMapper(input, GAMEBOY_CONTROLS);
if (mapper.isAction('A')) player.jump();
if (mapper.isAction('B')) player.cancel();
```
