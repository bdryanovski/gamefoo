---
title: 'Type Alias: IsoLayout'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / IsoLayout

# Type Alias: IsoLayout

```ts
type IsoLayout = "diamond" | "staggered";
```

Defined in: [core/grid/isometric\_types.ts:25](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric_types.ts#L25)

Layout mode for isometric tile placement.

- `"diamond"` — tiles form a rotated square (default, most common).
- `"staggered"` — tiles are placed in offset rows, like a brick wall.

## Since

0.4.0

## Example

```ts
const layout: IsoLayout = "diamond";
```
