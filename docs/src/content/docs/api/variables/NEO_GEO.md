---
title: 'Variable: NEO_GEO'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / NEO\_GEO

# Variable: NEO\_GEO

```ts
const NEO_GEO: GeneratedPalette;
```

Defined in: [core/palettes/neogeo.ts:33](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/neogeo.ts#L33)

Neo Geo 15-bit RGB generated palette.

Uses 5 bits per color channel (0-31), resulting in 32,768 colors.
The Neo Geo's "dark bit" for shadow effects is not modeled here.

## Since

0.5.0

## Example

```ts
// Generate specific colors
const red = NEO_GEO.generate(31, 0, 0);
const fatalFuryBlue = NEO_GEO.generate(8, 16, 31);
```
