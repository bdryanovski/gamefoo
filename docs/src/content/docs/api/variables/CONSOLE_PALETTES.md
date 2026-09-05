---
title: '~~Variable: CONSOLE_PALETTES~~'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / CONSOLE\_PALETTES

# ~~Variable: CONSOLE\_PALETTES~~

```ts
const CONSOLE_PALETTES: {
  ATARI_2600: NamedColorPalette<Atari2600Colors>;
  C64: NamedColorPalette<C64Colors>;
  CGA: NamedColorPalette<CgaColors>;
  CGA_FULL: NamedColorPalette<CgaFullColors>;
  EGA: NamedColorPalette<EgaColors>;
  EGA_64: NamedColorPalette<EgaColors>;
  GAMEBOY: NamedColorPalette<GameBoyColors>;
  GAMEGEAR: GeneratedPalette;
  GBA: GeneratedPalette;
  GBC: GeneratedPalette;
  GENESIS: GeneratedPalette;
  NEO_GEO: GeneratedPalette;
  NES: NamedColorPalette<NesColors>;
  PICO8: NamedColorPalette<Pico8Colors>;
  PLAYDATE: NamedColorPalette<PlaydateColors>;
  SNES: GeneratedPalette;
  TIC80: NamedColorPalette<Tic80Colors>;
};
```

Defined in: [core/palettes/index.ts:106](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/index.ts#L106)

Collection of all console palettes for easy access.

## Type Declaration

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-atari_2600"></a> `ATARI_2600` | [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`Atari2600Colors`](../interfaces/Atari2600Colors.md)\> | Atari 2600 128-color NTSC palette. Colors are organized by hue (16 hues) × luminance (8 levels). The first 8 colors are grayscale. **Since** 0.5.0 **Example** `// Array access const color = ATARI_2600.colors[64]; // Named access for common colors const bg = ATARI_2600.named.BLACK;` | [core/palettes/index.ts:112](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/index.ts#L112) |
| <a id="property-c64"></a> `C64` | [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`C64Colors`](../interfaces/C64Colors.md)\> | Commodore 64 16-color palette. Uses the widely-accepted "Pepto" palette values, which accurately represent the colors as displayed on period-correct monitors. **Since** 0.5.0 **Example** `// Classic C64 blue screen ctx.fillRect(0, 0, 320, 200, C64.named.BLUE); ctx.fillRect(10, 10, 300, 180, C64.named.LIGHT_BLUE); // Text in light blue on blue (iconic C64 look) ctx.drawText('READY.', 10, 10, C64.named.LIGHT_BLUE);` | [core/palettes/index.ts:129](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/index.ts#L129) |
| <a id="property-cga"></a> `CGA` | [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`CgaColors`](../interfaces/CgaColors.md)\> | CGA Mode 4, Palette 1, High Intensity (4 colors). This is the iconic CGA palette used in many classic DOS games. **Since** 0.5.0 **Example** `// Classic CGA look ctx.fillRect(0, 0, 320, 200, CGA.named.BLACK); ctx.fillRect(10, 10, 50, 50, CGA.named.CYAN); ctx.fillRect(70, 10, 50, 50, CGA.named.MAGENTA);` | [core/palettes/index.ts:130](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/index.ts#L130) |
| <a id="property-cga_full"></a> `CGA_FULL` | [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`CgaFullColors`](../interfaces/CgaFullColors.md)\> | Full CGA 16-color palette. **Since** 0.5.0 **Example** `// Access all 16 CGA colors for (let i = 0; i < CGA_FULL.colors.length; i++) { ctx.fillRect(i * 20, 0, 20, 20, CGA_FULL.colors[i]); }` | [core/palettes/index.ts:131](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/index.ts#L131) |
| <a id="property-ega"></a> `EGA` | [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`EgaColors`](../interfaces/EgaColors.md)\> | EGA default 16-color palette. This is the standard EGA palette that matches CGA colors. EGA could display any 16 colors from its 64-color space, but this default was used for CGA compatibility. **Since** 0.5.0 **Example** `// Draw with EGA colors ctx.fillRect(0, 0, 10, 10, EGA.named.LIGHT_BLUE); ctx.fillRect(10, 0, 10, 10, EGA.named.YELLOW);` | [core/palettes/index.ts:132](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/index.ts#L132) |
| <a id="property-ega_64"></a> `EGA_64` | [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`EgaColors`](../interfaces/EgaColors.md)\> | Full EGA 64-color palette. EGA uses 2 bits per channel (RGB), allowing 4 levels per channel and 64 total colors. Colors are ordered by RGB value. **Since** 0.5.0 **Example** `// Show all 64 EGA colors for (let i = 0; i < EGA_64.colors.length; i++) { const x = (i % 8) * 20; const y = Math.floor(i / 8) * 20; ctx.fillRect(x, y, 20, 20, EGA_64.colors[i]); }` | [core/palettes/index.ts:133](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/index.ts#L133) |
| <a id="property-gameboy"></a> `GAMEBOY` | [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`GameBoyColors`](../interfaces/GameBoyColors.md)\> | Original Game Boy (DMG) green-tinted palette. This represents the classic green colors of the original Game Boy's LCD display. **Since** 0.5.0 **Example** `// Array access (darkest to lightest) const darkest = GAMEBOY.colors[0]; const lightest = GAMEBOY.colors[3]; // Named access const bg = GAMEBOY.named.LIGHTEST; const fg = GAMEBOY.named.DARKEST;` | [core/palettes/index.ts:115](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/index.ts#L115) |
| <a id="property-gamegear"></a> `GAMEGEAR` | [`GeneratedPalette`](../interfaces/GeneratedPalette.md) | Sega Game Gear 12-bit RGB generated palette. The Game Gear uses 4 bits per color channel (0-15), resulting in 4,096 possible colors. Use the `generate()` function to create any color in the Game Gear color space. **Since** 0.5.0 **Example** `// Generate specific colors const red = GAMEGEAR.generate(15, 0, 0); // Full red const green = GAMEGEAR.generate(0, 15, 0); // Full green const blue = GAMEGEAR.generate(0, 0, 15); // Full blue const white = GAMEGEAR.generate(15, 15, 15); // White // Medium brightness const midRed = GAMEGEAR.generate(8, 0, 0); // Random Game Gear color const r = Math.floor(Math.random() * 16); const g = Math.floor(Math.random() * 16); const b = Math.floor(Math.random() * 16); const random = GAMEGEAR.generate(r, g, b);` | [core/palettes/index.ts:123](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/index.ts#L123) |
| <a id="property-gba"></a> `GBA` | [`GeneratedPalette`](../interfaces/GeneratedPalette.md) | GBA 15-bit RGB generated palette. The GBA uses 5 bits per color channel (0-31), resulting in 32,768 possible colors (same as SNES). **Since** 0.5.0 **Example** `// Generate specific colors const red = GBA.generate(31, 0, 0); const green = GBA.generate(0, 31, 0); // GBA screen has slightly different gamma // Colors appear more washed out on real hardware` | [core/palettes/index.ts:117](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/index.ts#L117) |
| <a id="property-gbc"></a> `GBC` | [`GeneratedPalette`](../interfaces/GeneratedPalette.md) | GBC 15-bit RGB generated palette. The GBC uses 5 bits per color channel (0-31), resulting in 32,768 possible colors. **Since** 0.5.0 **Example** `// Generate specific colors const red = GBC.generate(31, 0, 0); const green = GBC.generate(0, 31, 0);` | [core/palettes/index.ts:116](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/index.ts#L116) |
| <a id="property-genesis"></a> `GENESIS` | [`GeneratedPalette`](../interfaces/GeneratedPalette.md) | Sega Genesis / Mega Drive 9-bit RGB generated palette. The Genesis uses 3 bits per color channel (0-7), resulting in 512 possible colors. Use the `generate()` function to create any color in the Genesis color space. **Since** 0.5.0 **Example** `// Generate specific colors const red = GENESIS.generate(7, 0, 0); // Full red const green = GENESIS.generate(0, 7, 0); // Full green const blue = GENESIS.generate(0, 0, 7); // Full blue const white = GENESIS.generate(7, 7, 7); // White // Sonic blue const sonicBlue = GENESIS.generate(0, 4, 7); // Random Genesis color const r = Math.floor(Math.random() * 8); const g = Math.floor(Math.random() * 8); const b = Math.floor(Math.random() * 8); const random = GENESIS.generate(r, g, b);` | [core/palettes/index.ts:122](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/index.ts#L122) |
| <a id="property-neo_geo"></a> `NEO_GEO` | [`GeneratedPalette`](../interfaces/GeneratedPalette.md) | Neo Geo 15-bit RGB generated palette. Uses 5 bits per color channel (0-31), resulting in 32,768 colors. The Neo Geo's "dark bit" for shadow effects is not modeled here. **Since** 0.5.0 **Example** `// Generate specific colors const red = NEO_GEO.generate(31, 0, 0); const fatalFuryBlue = NEO_GEO.generate(8, 16, 31);` | [core/palettes/index.ts:126](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/index.ts#L126) |
| <a id="property-nes"></a> `NES` | [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`NesColors`](../interfaces/NesColors.md)\> | NES 54-color palette (FCEUX-based). Colors are organized by hue and brightness level. The full 64-entry PPU palette includes duplicates and "blacker than black" colors that are omitted here. **Since** 0.5.0 **Example** `// Array access const marioRed = NES.colors[6]; // Named access for common colors const sky = NES.named.LIGHT_BLUE; const grass = NES.named.GREEN;` | [core/palettes/index.ts:118](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/index.ts#L118) |
| <a id="property-pico8"></a> `PICO8` | [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`Pico8Colors`](../interfaces/Pico8Colors.md)\> | PICO-8 16-color palette. **Since** 0.5.0 **Example** `// Array access const red = PICO8.colors[8]; // Named access const red2 = PICO8.named.RED; // Use in rendering ctx.fillRect(0, 0, 10, 10, PICO8.named.DARK_BLUE);` | [core/palettes/index.ts:108](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/index.ts#L108) |
| <a id="property-playdate"></a> `PLAYDATE` | [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`PlaydateColors`](../interfaces/PlaydateColors.md)\> | Playdate 1-bit (2-color) palette. The Playdate's display only shows black and white. Grayscale effects are achieved through dithering. **Since** 0.5.0 **Example** `// Simple black and white ctx.fillRect(0, 0, 100, 100, PLAYDATE.named.BLACK); ctx.fillRect(100, 0, 100, 100, PLAYDATE.named.WHITE);` | [core/palettes/index.ts:136](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/index.ts#L136) |
| <a id="property-snes"></a> `SNES` | [`GeneratedPalette`](../interfaces/GeneratedPalette.md) | SNES 15-bit RGB generated palette. The SNES uses 5 bits per color channel (0-31), resulting in 32,768 possible colors. Use the `generate()` function to create any color in the SNES color space. **Since** 0.5.0 **Example** `// Generate specific colors const red = SNES.generate(31, 0, 0); // Full red const green = SNES.generate(0, 31, 0); // Full green const blue = SNES.generate(0, 0, 31); // Full blue const white = SNES.generate(31, 31, 31); // White // Medium gray const gray = SNES.generate(16, 16, 16); // Random SNES color const r = Math.floor(Math.random() * 32); const g = Math.floor(Math.random() * 32); const b = Math.floor(Math.random() * 32); const random = SNES.generate(r, g, b);` | [core/palettes/index.ts:119](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/index.ts#L119) |
| <a id="property-tic80"></a> `TIC80` | [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`Tic80Colors`](../interfaces/Tic80Colors.md)\> | TIC-80 / Sweetie 16 color palette. **Since** 0.5.0 **Example** `// Array access const red = TIC80.colors[2]; // Named access const red2 = TIC80.named.RED;` | [core/palettes/index.ts:109](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/index.ts#L109) |

## Since

0.5.0

## Deprecated

Use [CONSOLES](CONSOLES.md) from 'gamefoo' for unified console access.

## Example

```ts
// Iterate over all palettes
for (const [name, palette] of Object.entries(CONSOLE_PALETTES)) {
  console.log(`${name}: ${paletteSize(palette)} colors`);
}

// Access by key
const pico8 = CONSOLE_PALETTES.PICO8;
```
