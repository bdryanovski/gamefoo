---
title: 'Variable: C64_CONTROLS'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / C64\_CONTROLS

# Variable: C64\_CONTROLS

```ts
const C64_CONTROLS: ControlScheme;
```

Defined in: [core/controls/schemes/c64.ts:45](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/schemes/c64.ts#L45)

Commodore 64 control scheme.

Physical layout (joystick):
```
    [STICK]
      |
    [FIRE]
```

Many C64 games also supported keyboard controls as alternatives
or for additional functions. Common keyboard controls included
Q/A/O/P for directions and Space for fire.

Keyboard mapping:
- Joystick: WASD, Arrow keys, or Q/A/O/P (classic C64 style)
- Fire: X, J, Space, or Ctrl
- Run/Stop: Escape (pause equivalent)

## Since

0.5.0

## Example

```ts
import { InputMapper, C64_CONTROLS } from 'gamefoo';

const mapper = new InputMapper(input, C64_CONTROLS);
if (mapper.isAction('FIRE')) player.shoot();
```
