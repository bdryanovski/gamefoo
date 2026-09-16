---
title: 'Variable: GAMEGEAR_CONTROLS'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / GAMEGEAR\_CONTROLS

# Variable: GAMEGEAR\_CONTROLS

```ts
const GAMEGEAR_CONTROLS: ControlScheme;
```

Defined in: [core/controls/schemes/gamegear.ts:43](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/schemes/gamegear.ts#L43)

Sega Game Gear control scheme.

Physical layout:
```
  [D-PAD]     [SCREEN]     [1] [2]

             [START]
```

Keyboard mapping:
- D-pad: WASD or Arrow keys
- Button 1: X or J (left)
- Button 2: Z or K (right)
- Start: Enter

## Since

0.5.0

## Example

```ts
import { InputMapper, GAMEGEAR_CONTROLS } from 'gamefoo';

const mapper = new InputMapper(input, GAMEGEAR_CONTROLS);
if (mapper.isAction('1')) player.jump();
if (mapper.isAction('2')) player.attack();
```
