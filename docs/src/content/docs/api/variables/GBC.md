---
title: 'Variable: GBC'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / GBC

# Variable: GBC

```ts
const GBC: GeneratedPalette;
```

Defined in: [core/palettes/gbc.ts:30](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/gbc.ts#L30)

GBC 15-bit RGB generated palette.

The GBC uses 5 bits per color channel (0-31), resulting in
32,768 possible colors.

## Since

0.5.0

## Example

```ts
// Generate specific colors
const red = GBC.generate(31, 0, 0);
const green = GBC.generate(0, 31, 0);
```
