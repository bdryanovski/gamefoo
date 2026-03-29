---
title: 'Type Alias: HeuristicName'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / HeuristicName

# Type Alias: HeuristicName

```ts
type HeuristicName = "manhattan" | "euclidean" | "chebyshev";
```

Defined in: [core/utils/pathfinding\_types.ts:28](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/pathfinding_types.ts#L28)

Heuristic function name for A* distance estimation.

- `"manhattan"` — `|dx| + |dy|`. Best for 4-directional movement.
- `"euclidean"` — `sqrt(dx² + dy²)`. Best for 8-directional or
  free movement.
- `"chebyshev"` — `max(|dx|, |dy|)`. Best for 8-directional with
  uniform diagonal cost.

## Since

0.4.0

## Example

```ts
const h: HeuristicName = "manhattan";
```
