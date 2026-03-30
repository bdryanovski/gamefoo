---
title: 'Interface: TerminalCell'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / TerminalCell

# Interface: TerminalCell

Defined in: [core/renderer/type.ts:347](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L347)

A single terminal character cell.

Used internally by [TerminalRenderContext](../classes/TerminalRenderContext.md) for double-buffering.

## Since

0.4.0

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="bg"></a> `bg` | `string` | Background colour as a hex string (`#rrggbb`). | [core/renderer/type.ts:353](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L353) |
| <a id="char"></a> `char` | `string` | The character occupying this cell. | [core/renderer/type.ts:349](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L349) |
| <a id="fg"></a> `fg` | `string` | Foreground colour as a hex string (`#rrggbb`). | [core/renderer/type.ts:351](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/type.ts#L351) |
