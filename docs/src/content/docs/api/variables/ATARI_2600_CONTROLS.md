---
title: 'Variable: ATARI_2600_CONTROLS'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / ATARI\_2600\_CONTROLS

# Variable: ATARI\_2600\_CONTROLS

```ts
const ATARI_2600_CONTROLS: ControlScheme;
```

Defined in: [core/controls/schemes/atari2600.ts:41](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/schemes/atari2600.ts#L41)

Atari 2600 control scheme.

Physical layout (joystick):
```
    [STICK]
      |
    [FIRE]
```

Keyboard mapping:
- Joystick: WASD or Arrow keys
- Fire: X, J, or Space
- Reset: Enter
- Select: Shift

## Since

0.5.0

## Example

```ts
import { InputMapper, ATARI_2600_CONTROLS } from 'gamefoo';

const mapper = new InputMapper(input, ATARI_2600_CONTROLS);
if (mapper.isAction('FIRE')) player.shoot();
```
