---
title: 'Variable: FAMICOM_CONTROLS'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / FAMICOM\_CONTROLS

# Variable: FAMICOM\_CONTROLS

```ts
const FAMICOM_CONTROLS: ControlScheme;
```

Defined in: [core/controls/schemes/famicom.ts:37](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/schemes/famicom.ts#L37)

Famicom control scheme.

Physical layout (same as NES):
```
             [SELECT] [START]
  [D-PAD]              [B] [A]
```

Note: Famicom Player 2 controller had a microphone instead of Start/Select,
but this scheme represents the standard Player 1 controller.

Keyboard mapping:
- D-pad: WASD or Arrow keys
- A button: X or J
- B button: Z or K
- Start: Enter
- Select: Shift

## Since

0.5.0
