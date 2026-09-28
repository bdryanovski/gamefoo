---
title: 'Variable: NDS_CONTROLS'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / NDS\_CONTROLS

# Variable: NDS\_CONTROLS

```ts
const NDS_CONTROLS: ControlScheme;
```

Defined in: [core/controls/schemes/nds.ts:55](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/schemes/nds.ts#L55)

Nintendo DS control scheme.

Physical layout:
```
  [L]                    [R]

  [D-PAD]    [SCREEN]   [X]
                      [Y] [A]
                        [B]

         [SELECT] [START]
```

Button layout matches SNES/GBA conventions with Nintendo's
standard A=confirm, B=cancel pattern.

Keyboard mapping:
- D-pad: WASD or Arrow keys
- A button: X or J (right)
- B button: Z or K (bottom)
- X button: C (top)
- Y button: V (left)
- L/R: Q/E
- Start: Enter
- Select: Shift

## Since

0.5.0

## Example

```ts
import { InputMapper, NDS_CONTROLS } from 'gamefoo';

const mapper = new InputMapper(input, NDS_CONTROLS);
if (mapper.isAction('A')) player.confirm();
if (mapper.isAction('B')) player.back();
if (mapper.isAction('Y')) player.openMenu();
```
