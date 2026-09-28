---
title: 'Interface: ObjectSystemConfig'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / ObjectSystemConfig

# Interface: ObjectSystemConfig

Defined in: [subsystems/object\_system.ts:12](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/object_system.ts#L12)

Configuration options for [ObjectSystem](../classes/ObjectSystem.md).

## Since

0.4.0

## Properties

| Property | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="depthsort"></a> `depthSort?` | `boolean` | `false` | When `true`, objects are Y-sorted (by `y` position ascending) before each render pass. Essential for isometric games where objects closer to the camera must draw on top. | [subsystems/object\_system.ts:20](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/object_system.ts#L20) |
