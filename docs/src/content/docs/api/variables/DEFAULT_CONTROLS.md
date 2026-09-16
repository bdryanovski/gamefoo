---
title: 'Variable: DEFAULT_CONTROLS'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / DEFAULT\_CONTROLS

# Variable: DEFAULT\_CONTROLS

```ts
const DEFAULT_CONTROLS: ControlScheme;
```

Defined in: [core/controls/schemes/default.ts:39](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/schemes/default.ts#L39)

Default control scheme for PC gaming.

Layout:
- Movement: WASD or Arrow keys
- PRIMARY (action): X, J, or Space
- SECONDARY (cancel): Z, K
- START: Enter
- SELECT: Shift
- MENU: Escape

Gamepad mapping follows the W3C Standard Gamepad layout.

## Since

0.5.0

## Example

```ts
import { InputMapper, DEFAULT_CONTROLS } from 'gamefoo';

const mapper = new InputMapper(input, DEFAULT_CONTROLS);
if (mapper.isAction('PRIMARY')) player.jump();
```
