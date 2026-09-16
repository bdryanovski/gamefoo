---
title: 'Variable: DREAMCAST_CONTROLS'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / DREAMCAST\_CONTROLS

# Variable: DREAMCAST\_CONTROLS

```ts
const DREAMCAST_CONTROLS: ControlScheme;
```

Defined in: [core/controls/schemes/dreamcast.ts:52](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/schemes/dreamcast.ts#L52)

Sega Dreamcast control scheme.

Physical layout:
```
             [L]      [R]

  [D-PAD]              [Y]
           [STICK]  [X]   [B]
                       [A]
             [START]
```

Button layout is similar to Xbox (ABXY diamond with A at bottom).

Keyboard mapping:
- D-pad/Stick: WASD or Arrow keys
- A button: X or J (bottom)
- B button: C (right)
- X button: Z or K (left)
- Y button: V (top)
- L trigger: Q
- R trigger: E
- Start: Enter

## Since

0.5.0

## Example

```ts
import { InputMapper, DREAMCAST_CONTROLS } from 'gamefoo';

const mapper = new InputMapper(input, DREAMCAST_CONTROLS);
if (mapper.isAction('A')) player.jump();
if (mapper.isAction('R')) player.accelerate();
```
