---
title: 'Variable: PLAYDATE_CONTROLS'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / PLAYDATE\_CONTROLS

# Variable: PLAYDATE\_CONTROLS

```ts
const PLAYDATE_CONTROLS: ControlScheme;
```

Defined in: [core/controls/schemes/playdate.ts:51](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/schemes/playdate.ts#L51)

Playdate control scheme.

Physical layout:
```
  [D-PAD]     [SCREEN]    [CRANK]

     [MENU]          [B] [A]
```

The crank can be docked (hidden) or undocked. When undocked, it
provides continuous rotational input. Games can also detect
dock/undock events.

Keyboard mapping:
- D-pad: WASD or Arrow keys
- A button: X or J (right - confirm)
- B button: Z or K (left - cancel)
- Menu: Escape
- Crank: Q/E for rotate left/right (simulated)

## Since

0.5.0

## Example

```ts
import { InputMapper, PLAYDATE_CONTROLS } from 'gamefoo';

const mapper = new InputMapper(input, PLAYDATE_CONTROLS);
if (mapper.isAction('A')) player.confirm();
if (mapper.isAction('B')) player.back();
// Crank input would need special handling
```
