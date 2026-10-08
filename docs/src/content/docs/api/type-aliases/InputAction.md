---
title: 'Type Alias: InputAction'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / InputAction

# Type Alias: InputAction

```ts
type InputAction = 
  | "UP"
  | "DOWN"
  | "LEFT"
  | "RIGHT"
  | "PRIMARY"
  | "SECONDARY"
  | "TERTIARY"
  | "QUATERNARY"
  | "START"
  | "SELECT"
  | "MENU"
  | "L1"
  | "R1"
  | "L2"
  | "R2"
  | "L3"
  | "R3"
  | "C_UP"
  | "C_DOWN"
  | "C_LEFT"
  | "C_RIGHT";
```

Defined in: [core/controls/types.ts:32](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/types.ts#L32)

Standard input actions used across all control schemes.

These are semantic action names that abstract physical button/key presses.
Games should query these actions rather than raw keys for portability.

## Since

0.5.0

## Example

```ts
// Instead of checking raw keys:
if (input.isKeyDown('x')) player.jump();

// Check semantic actions:
if (mapper.isAction('PRIMARY')) player.jump();
// Or use console-specific alias:
if (mapper.isAction('A')) player.jump();
```
