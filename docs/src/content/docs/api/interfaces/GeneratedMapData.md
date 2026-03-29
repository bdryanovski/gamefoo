---
title: 'Interface: GeneratedMapData'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / GeneratedMapData

# Interface: GeneratedMapData

Defined in: [core/utils/map\_generator\_types.ts:140](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/map_generator_types.ts#L140)

Output of [MapGenerator.generateTileData](../classes/MapGenerator.md#generatetiledata).

## Since

0.4.0

## Example

```ts
const result: GeneratedMapData = generator.generateTileData();
console.log(result.data.length);           // cols * rows
console.log(result.walkableMap[0]!.length); // cols
```

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="data"></a> `data` | `number`[] | Flat row-major tile ID array (length = cols × rows). | [core/utils/map\_generator\_types.ts:142](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/map_generator_types.ts#L142) |
| <a id="walkablemap"></a> `walkableMap` | `boolean`[][] | 2D walkability map indexed `[row][col]`. | [core/utils/map\_generator\_types.ts:144](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/map_generator_types.ts#L144) |
