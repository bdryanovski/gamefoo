---
title: 'Interface: TerminalRenderConfig'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / TerminalRenderConfig

# Interface: TerminalRenderConfig

Defined in: [core/renderer/terminal\_renderer.ts:9](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L9)

Configuration for [TerminalRenderContext](../classes/TerminalRenderContext.md).

## Since

0.4.0

## Properties

| Property | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="cellheight"></a> `cellHeight?` | `number` | `8` | Number of game-world pixels per character row. Terminal characters are typically about 2× taller than wide, so set `cellHeight = cellWidth * 2` to preserve visual aspect ratio. **Since** 0.4.0 | [core/renderer/terminal\_renderer.ts:48](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L48) |
| <a id="cellwidth"></a> `cellWidth?` | `number` | `8` | Number of game-world pixels per character column. Used to map floating-point game coordinates to integer cell indices: `col = floor(worldX / cellWidth)`. **Since** 0.4.0 | [core/renderer/terminal\_renderer.ts:37](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L37) |
| <a id="cols"></a> `cols` | `number` | `undefined` | Number of character columns (terminal width). Read from `process.stdout.columns` or specify explicitly. **Since** 0.4.0 | [core/renderer/terminal\_renderer.ts:17](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L17) |
| <a id="defaultbg"></a> `defaultBg?` | `string` | `"#000000"` | Default background colour for blank cells (hex string). **Since** 0.4.0 | [core/renderer/terminal\_renderer.ts:56](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L56) |
| <a id="defaultfg"></a> `defaultFg?` | `string` | `"#ffffff"` | Default foreground colour for text (hex string). **Since** 0.4.0 | [core/renderer/terminal\_renderer.ts:64](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L64) |
| <a id="rows"></a> `rows` | `number` | `undefined` | Number of character rows (terminal height). Read from `process.stdout.rows` or specify explicitly. **Since** 0.4.0 | [core/renderer/terminal\_renderer.ts:26](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/terminal_renderer.ts#L26) |
