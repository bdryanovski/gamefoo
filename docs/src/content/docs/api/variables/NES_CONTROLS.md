---
title: 'Variable: NES_CONTROLS'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / NES\_CONTROLS

# Variable: NES\_CONTROLS

```ts
const NES_CONTROLS: ControlScheme;
```

Defined in: [core/controls/schemes/nes.ts:42](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/schemes/nes.ts#L42)

NES control scheme.

Physical layout:
```
             [SELECT] [START]
  [D-PAD]              [B] [A]
```

Keyboard mapping:
- D-pad: WASD or Arrow keys
- A button: X or J (right button - jump/confirm)
- B button: Z or K (left button - run/cancel)
- Start: Enter
- Select: Shift

## Since

0.5.0

## Example

```ts
import { InputMapper, NES_CONTROLS } from 'gamefoo';

const mapper = new InputMapper(input, NES_CONTROLS);
if (mapper.isAction('A')) player.jump();
if (mapper.isAction('B')) player.run();
```
