---
title: 'Variable: NEO_GEO_CONTROLS'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / NEO\_GEO\_CONTROLS

# Variable: NEO\_GEO\_CONTROLS

```ts
const NEO_GEO_CONTROLS: ControlScheme;
```

Defined in: [core/controls/schemes/neo\_geo.ts:50](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/schemes/neo_geo.ts#L50)

Neo Geo control scheme.

Physical layout (arcade stick style):
```
                  [SELECT] [START]
  [JOYSTICK]        [A] [B] [C] [D]
```

Button conventions:
- Fighting games: A = light punch, B = light kick, C = heavy punch, D = heavy kick
- Run-and-gun: A = shoot, B = jump, C = bomb/special, D = varies

Keyboard mapping:
- Joystick: WASD or Arrow keys
- A button: Z or K (light attack)
- B button: X or J (light attack alt)
- C button: C (heavy attack)
- D button: V (heavy attack alt)
- Start: Enter
- Select: Shift

## Since

0.5.0

## Example

```ts
import { InputMapper, NEO_GEO_CONTROLS } from 'gamefoo';

const mapper = new InputMapper(input, NEO_GEO_CONTROLS);
// Fighting game style
if (mapper.isAction('A')) player.lightPunch();
if (mapper.isAction('C')) player.heavyPunch();
```
