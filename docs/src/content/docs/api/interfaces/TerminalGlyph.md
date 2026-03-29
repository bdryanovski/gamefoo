---
title: 'Interface: TerminalGlyph'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / TerminalGlyph

# Interface: TerminalGlyph

Defined in: [core/behaviours/terminal\_render.ts:19](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/terminal_render.ts#L19)

Describes the visual appearance of an entity in terminal mode.

## Since

0.4.0

## Example

```ts
const playerGlyph: TerminalGlyph = {
  char: "@",
  fg:   "#00ff00",
  bg:   "#000000",
};
```

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="bg"></a> `bg?` | `string` | Background colour as a CSS hex string. Defaults to `"#000000"` when not specified. | [core/behaviours/terminal\_render.ts:40](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/terminal_render.ts#L40) |
| <a id="char"></a> `char` | `string` | The Unicode character used to represent the entity. Single characters work well: `"@"` (player), `"E"` (enemy), `"#"` (wall). Block characters like `"█"` give solid appearance. | [core/behaviours/terminal\_render.ts:26](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/terminal_render.ts#L26) |
| <a id="fg"></a> `fg` | `string` | Foreground colour as a CSS hex string (e.g. `"#00ff00"`). Rendered as an ANSI truecolour foreground escape on terminal backends. | [core/behaviours/terminal\_render.ts:33](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/terminal_render.ts#L33) |
