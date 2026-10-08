---
title: 'Function: unassignedBinding()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / unassignedBinding

# Function: unassignedBinding()

```ts
function unassignedBinding(): ActionBinding;
```

Defined in: [core/controls/scheme\_builder.ts:107](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/scheme_builder.ts#L107)

Creates an unassigned binding for actions not supported by a console.

Use this for buttons/actions that don't exist on a particular controller.
Convenience alias for `binding([])`.

## Returns

[`ActionBinding`](../interfaces/ActionBinding.md)

An ActionBinding with empty keys and no gamepad binding

## Since

0.5.0

## Example

```ts
// NES doesn't have shoulder buttons
const scheme = {
  L1: unassignedBinding(),
  R1: unassignedBinding(),
  // ...
};
```
