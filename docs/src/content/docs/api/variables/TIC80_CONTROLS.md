---
title: 'Variable: TIC80_CONTROLS'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / TIC80\_CONTROLS

# Variable: TIC80\_CONTROLS

```ts
const TIC80_CONTROLS: ControlScheme;
```

Defined in: [core/controls/schemes/tic80.ts:45](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/schemes/tic80.ts#L45)

TIC-80 control scheme.

Physical layout:
```
    [D-PAD]     [A] [B]
                [X] [Y]
```

Default keyboard mapping (Player 1):
- D-pad: Arrow keys (Up, Down, Left, Right)
- A button: Z
- B button: X
- X button: A
- Y button: S

## Since

0.5.0

## Example

```ts
import { InputMapper, TIC80_CONTROLS } from 'gamefoo';

const mapper = new InputMapper(input, TIC80_CONTROLS);
if (mapper.isAction('A')) player.jump();
if (mapper.isAction('B')) player.attack();
```
