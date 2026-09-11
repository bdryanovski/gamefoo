---
title: 'Variable: CONSOLES'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / CONSOLES

# Variable: CONSOLES

```ts
const CONSOLES: {
  ATARI_2600: {
     name: "Atari 2600";
     palette: NamedColorPalette<Atari2600Colors>;
     resolution: {
        height: 192;
        width: 160;
     };
  };
  ATARI_5200: {
     name: "Atari 5200";
     palette: NamedColorPalette<Atari2600Colors>;
     resolution: {
        height: 192;
        width: 320;
     };
  };
  ATARI_7800: {
     name: "Atari 7800";
     palette: NamedColorPalette<Atari2600Colors>;
     resolution: {
        height: 240;
        width: 320;
     };
  };
  C64: {
     name: "Commodore 64";
     palette: NamedColorPalette<C64Colors>;
     resolution: {
        height: 200;
        width: 320;
     };
  };
  CGA: {
     name: "IBM CGA";
     palette: NamedColorPalette<CgaColors>;
     resolution: {
        height: 200;
        width: 320;
     };
  };
  CGA_FULL: {
     name: "IBM CGA (Full)";
     palette: NamedColorPalette<CgaFullColors>;
     resolution: {
        height: 200;
        width: 320;
     };
  };
  DREAMCAST: {
     name: "Sega Dreamcast";
     palette: GeneratedPalette;
     resolution: {
        height: 480;
        width: 640;
     };
  };
  EGA: {
     name: "IBM EGA";
     palette: NamedColorPalette<EgaColors>;
     resolution: {
        height: 350;
        width: 640;
     };
  };
  EGA_64: {
     name: "IBM EGA (64-color)";
     palette: NamedColorPalette<EgaColors>;
     resolution: {
        height: 350;
        width: 640;
     };
  };
  FAMICOM: {
     name: "Nintendo Famicom";
     palette: NamedColorPalette<NesColors>;
     resolution: {
        height: 240;
        width: 256;
     };
  };
  GAMEBOY: {
     name: "Game Boy";
     palette: NamedColorPalette<GameBoyColors>;
     resolution: {
        height: 144;
        width: 160;
     };
  };
  GAMEGEAR: {
     name: "Sega Game Gear";
     palette: GeneratedPalette;
     resolution: {
        height: 144;
        width: 160;
     };
  };
  GBA: {
     name: "Game Boy Advance";
     palette: GeneratedPalette;
     resolution: {
        height: 160;
        width: 240;
     };
  };
  GBC: {
     name: "Game Boy Color";
     palette: GeneratedPalette;
     resolution: {
        height: 144;
        width: 160;
     };
  };
  GENESIS: {
     name: "Sega Genesis / Mega Drive";
     palette: GeneratedPalette;
     resolution: {
        height: 224;
        width: 320;
     };
  };
  MEGADRIVE: {
     name: "Sega Mega Drive";
     palette: GeneratedPalette;
     resolution: {
        height: 224;
        width: 320;
     };
  };
  N3DS: {
     name: "Nintendo 3DS";
     palette: GeneratedPalette;
     resolution: {
        height: 240;
        width: 400;
     };
  };
  N64: {
     name: "Nintendo 64";
     palette: GeneratedPalette;
     resolution: {
        height: 240;
        width: 320;
     };
  };
  NDS: {
     name: "Nintendo DS";
     palette: GeneratedPalette;
     resolution: {
        height: 192;
        width: 256;
     };
  };
  NEO_GEO: {
     name: "SNK Neo Geo";
     palette: GeneratedPalette;
     resolution: {
        height: 224;
        width: 320;
     };
  };
  NES: {
     name: "Nintendo Entertainment System";
     palette: NamedColorPalette<NesColors>;
     resolution: {
        height: 240;
        width: 256;
     };
  };
  PICO8: {
     name: "PICO-8";
     palette: NamedColorPalette<Pico8Colors>;
     resolution: {
        height: 128;
        width: 128;
     };
  };
  PLAYDATE: {
     name: "Playdate";
     palette: NamedColorPalette<PlaydateColors>;
     resolution: {
        height: 240;
        width: 400;
     };
  };
  PS1: {
     name: "Sony PlayStation";
     palette: GeneratedPalette;
     resolution: {
        height: 240;
        width: 320;
     };
  };
  PSP: {
     name: "Sony PSP";
     palette: GeneratedPalette;
     resolution: {
        height: 272;
        width: 480;
     };
  };
  SNES: {
     name: "Super Nintendo";
     palette: GeneratedPalette;
     resolution: {
        height: 224;
        width: 256;
     };
  };
  SWITCH: {
     name: "Nintendo Switch";
     palette: GeneratedPalette;
     resolution: {
        height: 720;
        width: 1280;
     };
  };
  TIC80: {
     name: "TIC-80";
     palette: NamedColorPalette<Tic80Colors>;
     resolution: {
        height: 136;
        width: 240;
     };
  };
};
```

Defined in: [core/consoles/index.ts:73](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L73)

All supported console definitions.

Console names are unified across resolution and palette access.
Names follow the pattern: BRAND_MODEL or just MODEL for fantasy consoles.

## Type Declaration

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-atari_2600"></a> `ATARI_2600` | \{ `name`: `"Atari 2600"`; `palette`: [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`Atari2600Colors`](../interfaces/Atari2600Colors.md)\>; `resolution`: \{ `height`: `192`; `width`: `160`; \}; \} | - | [core/consoles/index.ts:87](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L87) |
| `ATARI_2600.name` | `"Atari 2600"` | `'Atari 2600'` | [core/consoles/index.ts:88](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L88) |
| `ATARI_2600.palette` | [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`Atari2600Colors`](../interfaces/Atari2600Colors.md)\> | `ATARI_2600` | [core/consoles/index.ts:90](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L90) |
| `ATARI_2600.resolution` | \{ `height`: `192`; `width`: `160`; \} | - | [core/consoles/index.ts:89](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L89) |
| `ATARI_2600.resolution.height` | `192` | `192` | [core/consoles/index.ts:89](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L89) |
| `ATARI_2600.resolution.width` | `160` | `160` | [core/consoles/index.ts:89](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L89) |
| <a id="property-atari_5200"></a> `ATARI_5200` | \{ `name`: `"Atari 5200"`; `palette`: [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`Atari2600Colors`](../interfaces/Atari2600Colors.md)\>; `resolution`: \{ `height`: `192`; `width`: `320`; \}; \} | - | [core/consoles/index.ts:92](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L92) |
| `ATARI_5200.name` | `"Atari 5200"` | `'Atari 5200'` | [core/consoles/index.ts:93](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L93) |
| `ATARI_5200.palette` | [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`Atari2600Colors`](../interfaces/Atari2600Colors.md)\> | `ATARI_2600` | [core/consoles/index.ts:95](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L95) |
| `ATARI_5200.resolution` | \{ `height`: `192`; `width`: `320`; \} | - | [core/consoles/index.ts:94](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L94) |
| `ATARI_5200.resolution.height` | `192` | `192` | [core/consoles/index.ts:94](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L94) |
| `ATARI_5200.resolution.width` | `320` | `320` | [core/consoles/index.ts:94](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L94) |
| <a id="property-atari_7800"></a> `ATARI_7800` | \{ `name`: `"Atari 7800"`; `palette`: [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`Atari2600Colors`](../interfaces/Atari2600Colors.md)\>; `resolution`: \{ `height`: `240`; `width`: `320`; \}; \} | - | [core/consoles/index.ts:97](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L97) |
| `ATARI_7800.name` | `"Atari 7800"` | `'Atari 7800'` | [core/consoles/index.ts:98](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L98) |
| `ATARI_7800.palette` | [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`Atari2600Colors`](../interfaces/Atari2600Colors.md)\> | `ATARI_2600` | [core/consoles/index.ts:100](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L100) |
| `ATARI_7800.resolution` | \{ `height`: `240`; `width`: `320`; \} | - | [core/consoles/index.ts:99](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L99) |
| `ATARI_7800.resolution.height` | `240` | `240` | [core/consoles/index.ts:99](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L99) |
| `ATARI_7800.resolution.width` | `320` | `320` | [core/consoles/index.ts:99](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L99) |
| <a id="property-c64"></a> `C64` | \{ `name`: `"Commodore 64"`; `palette`: [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`C64Colors`](../interfaces/C64Colors.md)\>; `resolution`: \{ `height`: `200`; `width`: `320`; \}; \} | - | [core/consoles/index.ts:197](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L197) |
| `C64.name` | `"Commodore 64"` | `'Commodore 64'` | [core/consoles/index.ts:198](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L198) |
| `C64.palette` | [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`C64Colors`](../interfaces/C64Colors.md)\> | `C64` | [core/consoles/index.ts:200](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L200) |
| `C64.resolution` | \{ `height`: `200`; `width`: `320`; \} | - | [core/consoles/index.ts:199](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L199) |
| `C64.resolution.height` | `200` | `200` | [core/consoles/index.ts:199](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L199) |
| `C64.resolution.width` | `320` | `320` | [core/consoles/index.ts:199](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L199) |
| <a id="property-cga"></a> `CGA` | \{ `name`: `"IBM CGA"`; `palette`: [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`CgaColors`](../interfaces/CgaColors.md)\>; `resolution`: \{ `height`: `200`; `width`: `320`; \}; \} | - | [core/consoles/index.ts:202](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L202) |
| `CGA.name` | `"IBM CGA"` | `'IBM CGA'` | [core/consoles/index.ts:203](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L203) |
| `CGA.palette` | [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`CgaColors`](../interfaces/CgaColors.md)\> | `CGA` | [core/consoles/index.ts:205](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L205) |
| `CGA.resolution` | \{ `height`: `200`; `width`: `320`; \} | - | [core/consoles/index.ts:204](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L204) |
| `CGA.resolution.height` | `200` | `200` | [core/consoles/index.ts:204](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L204) |
| `CGA.resolution.width` | `320` | `320` | [core/consoles/index.ts:204](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L204) |
| <a id="property-cga_full"></a> `CGA_FULL` | \{ `name`: `"IBM CGA (Full)"`; `palette`: [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`CgaFullColors`](../interfaces/CgaFullColors.md)\>; `resolution`: \{ `height`: `200`; `width`: `320`; \}; \} | - | [core/consoles/index.ts:207](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L207) |
| `CGA_FULL.name` | `"IBM CGA (Full)"` | `'IBM CGA (Full)'` | [core/consoles/index.ts:208](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L208) |
| `CGA_FULL.palette` | [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`CgaFullColors`](../interfaces/CgaFullColors.md)\> | `CGA_FULL` | [core/consoles/index.ts:210](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L210) |
| `CGA_FULL.resolution` | \{ `height`: `200`; `width`: `320`; \} | - | [core/consoles/index.ts:209](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L209) |
| `CGA_FULL.resolution.height` | `200` | `200` | [core/consoles/index.ts:209](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L209) |
| `CGA_FULL.resolution.width` | `320` | `320` | [core/consoles/index.ts:209](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L209) |
| <a id="property-dreamcast"></a> `DREAMCAST` | \{ `name`: `"Sega Dreamcast"`; `palette`: [`GeneratedPalette`](../interfaces/GeneratedPalette.md); `resolution`: \{ `height`: `480`; `width`: `640`; \}; \} | - | [core/consoles/index.ts:171](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L171) |
| `DREAMCAST.name` | `"Sega Dreamcast"` | `'Sega Dreamcast'` | [core/consoles/index.ts:172](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L172) |
| `DREAMCAST.palette` | [`GeneratedPalette`](../interfaces/GeneratedPalette.md) | `GENESIS` | [core/consoles/index.ts:174](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L174) |
| `DREAMCAST.resolution` | \{ `height`: `480`; `width`: `640`; \} | - | [core/consoles/index.ts:173](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L173) |
| `DREAMCAST.resolution.height` | `480` | `480` | [core/consoles/index.ts:173](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L173) |
| `DREAMCAST.resolution.width` | `640` | `640` | [core/consoles/index.ts:173](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L173) |
| <a id="property-ega"></a> `EGA` | \{ `name`: `"IBM EGA"`; `palette`: [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`EgaColors`](../interfaces/EgaColors.md)\>; `resolution`: \{ `height`: `350`; `width`: `640`; \}; \} | - | [core/consoles/index.ts:212](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L212) |
| `EGA.name` | `"IBM EGA"` | `'IBM EGA'` | [core/consoles/index.ts:213](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L213) |
| `EGA.palette` | [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`EgaColors`](../interfaces/EgaColors.md)\> | `EGA` | [core/consoles/index.ts:215](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L215) |
| `EGA.resolution` | \{ `height`: `350`; `width`: `640`; \} | - | [core/consoles/index.ts:214](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L214) |
| `EGA.resolution.height` | `350` | `350` | [core/consoles/index.ts:214](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L214) |
| `EGA.resolution.width` | `640` | `640` | [core/consoles/index.ts:214](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L214) |
| <a id="property-ega_64"></a> `EGA_64` | \{ `name`: `"IBM EGA (64-color)"`; `palette`: [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`EgaColors`](../interfaces/EgaColors.md)\>; `resolution`: \{ `height`: `350`; `width`: `640`; \}; \} | - | [core/consoles/index.ts:217](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L217) |
| `EGA_64.name` | `"IBM EGA (64-color)"` | `'IBM EGA (64-color)'` | [core/consoles/index.ts:218](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L218) |
| `EGA_64.palette` | [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`EgaColors`](../interfaces/EgaColors.md)\> | `EGA_64` | [core/consoles/index.ts:220](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L220) |
| `EGA_64.resolution` | \{ `height`: `350`; `width`: `640`; \} | - | [core/consoles/index.ts:219](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L219) |
| `EGA_64.resolution.height` | `350` | `350` | [core/consoles/index.ts:219](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L219) |
| `EGA_64.resolution.width` | `640` | `640` | [core/consoles/index.ts:219](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L219) |
| <a id="property-famicom"></a> `FAMICOM` | \{ `name`: `"Nintendo Famicom"`; `palette`: [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`NesColors`](../interfaces/NesColors.md)\>; `resolution`: \{ `height`: `240`; `width`: `256`; \}; \} | - | [core/consoles/index.ts:109](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L109) |
| `FAMICOM.name` | `"Nintendo Famicom"` | `'Nintendo Famicom'` | [core/consoles/index.ts:110](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L110) |
| `FAMICOM.palette` | [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`NesColors`](../interfaces/NesColors.md)\> | `NES` | [core/consoles/index.ts:112](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L112) |
| `FAMICOM.resolution` | \{ `height`: `240`; `width`: `256`; \} | - | [core/consoles/index.ts:111](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L111) |
| `FAMICOM.resolution.height` | `240` | `240` | [core/consoles/index.ts:111](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L111) |
| `FAMICOM.resolution.width` | `256` | `256` | [core/consoles/index.ts:111](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L111) |
| <a id="property-gameboy"></a> `GAMEBOY` | \{ `name`: `"Game Boy"`; `palette`: [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`GameBoyColors`](../interfaces/GameBoyColors.md)\>; `resolution`: \{ `height`: `144`; `width`: `160`; \}; \} | - | [core/consoles/index.ts:119](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L119) |
| `GAMEBOY.name` | `"Game Boy"` | `'Game Boy'` | [core/consoles/index.ts:120](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L120) |
| `GAMEBOY.palette` | [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`GameBoyColors`](../interfaces/GameBoyColors.md)\> | `GAMEBOY` | [core/consoles/index.ts:122](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L122) |
| `GAMEBOY.resolution` | \{ `height`: `144`; `width`: `160`; \} | - | [core/consoles/index.ts:121](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L121) |
| `GAMEBOY.resolution.height` | `144` | `144` | [core/consoles/index.ts:121](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L121) |
| `GAMEBOY.resolution.width` | `160` | `160` | [core/consoles/index.ts:121](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L121) |
| <a id="property-gamegear"></a> `GAMEGEAR` | \{ `name`: `"Sega Game Gear"`; `palette`: [`GeneratedPalette`](../interfaces/GeneratedPalette.md); `resolution`: \{ `height`: `144`; `width`: `160`; \}; \} | - | [core/consoles/index.ts:166](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L166) |
| `GAMEGEAR.name` | `"Sega Game Gear"` | `'Sega Game Gear'` | [core/consoles/index.ts:167](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L167) |
| `GAMEGEAR.palette` | [`GeneratedPalette`](../interfaces/GeneratedPalette.md) | `GAMEGEAR` | [core/consoles/index.ts:169](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L169) |
| `GAMEGEAR.resolution` | \{ `height`: `144`; `width`: `160`; \} | - | [core/consoles/index.ts:168](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L168) |
| `GAMEGEAR.resolution.height` | `144` | `144` | [core/consoles/index.ts:168](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L168) |
| `GAMEGEAR.resolution.width` | `160` | `160` | [core/consoles/index.ts:168](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L168) |
| <a id="property-gba"></a> `GBA` | \{ `name`: `"Game Boy Advance"`; `palette`: [`GeneratedPalette`](../interfaces/GeneratedPalette.md); `resolution`: \{ `height`: `160`; `width`: `240`; \}; \} | - | [core/consoles/index.ts:129](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L129) |
| `GBA.name` | `"Game Boy Advance"` | `'Game Boy Advance'` | [core/consoles/index.ts:130](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L130) |
| `GBA.palette` | [`GeneratedPalette`](../interfaces/GeneratedPalette.md) | `GBA` | [core/consoles/index.ts:132](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L132) |
| `GBA.resolution` | \{ `height`: `160`; `width`: `240`; \} | - | [core/consoles/index.ts:131](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L131) |
| `GBA.resolution.height` | `160` | `160` | [core/consoles/index.ts:131](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L131) |
| `GBA.resolution.width` | `240` | `240` | [core/consoles/index.ts:131](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L131) |
| <a id="property-gbc"></a> `GBC` | \{ `name`: `"Game Boy Color"`; `palette`: [`GeneratedPalette`](../interfaces/GeneratedPalette.md); `resolution`: \{ `height`: `144`; `width`: `160`; \}; \} | - | [core/consoles/index.ts:124](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L124) |
| `GBC.name` | `"Game Boy Color"` | `'Game Boy Color'` | [core/consoles/index.ts:125](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L125) |
| `GBC.palette` | [`GeneratedPalette`](../interfaces/GeneratedPalette.md) | `GBC` | [core/consoles/index.ts:127](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L127) |
| `GBC.resolution` | \{ `height`: `144`; `width`: `160`; \} | - | [core/consoles/index.ts:126](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L126) |
| `GBC.resolution.height` | `144` | `144` | [core/consoles/index.ts:126](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L126) |
| `GBC.resolution.width` | `160` | `160` | [core/consoles/index.ts:126](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L126) |
| <a id="property-genesis"></a> `GENESIS` | \{ `name`: `"Sega Genesis / Mega Drive"`; `palette`: [`GeneratedPalette`](../interfaces/GeneratedPalette.md); `resolution`: \{ `height`: `224`; `width`: `320`; \}; \} | - | [core/consoles/index.ts:156](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L156) |
| `GENESIS.name` | `"Sega Genesis / Mega Drive"` | `'Sega Genesis / Mega Drive'` | [core/consoles/index.ts:157](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L157) |
| `GENESIS.palette` | [`GeneratedPalette`](../interfaces/GeneratedPalette.md) | `GENESIS` | [core/consoles/index.ts:159](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L159) |
| `GENESIS.resolution` | \{ `height`: `224`; `width`: `320`; \} | - | [core/consoles/index.ts:158](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L158) |
| `GENESIS.resolution.height` | `224` | `224` | [core/consoles/index.ts:158](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L158) |
| `GENESIS.resolution.width` | `320` | `320` | [core/consoles/index.ts:158](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L158) |
| <a id="property-megadrive"></a> `MEGADRIVE` | \{ `name`: `"Sega Mega Drive"`; `palette`: [`GeneratedPalette`](../interfaces/GeneratedPalette.md); `resolution`: \{ `height`: `224`; `width`: `320`; \}; \} | - | [core/consoles/index.ts:161](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L161) |
| `MEGADRIVE.name` | `"Sega Mega Drive"` | `'Sega Mega Drive'` | [core/consoles/index.ts:162](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L162) |
| `MEGADRIVE.palette` | [`GeneratedPalette`](../interfaces/GeneratedPalette.md) | `GENESIS` | [core/consoles/index.ts:164](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L164) |
| `MEGADRIVE.resolution` | \{ `height`: `224`; `width`: `320`; \} | - | [core/consoles/index.ts:163](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L163) |
| `MEGADRIVE.resolution.height` | `224` | `224` | [core/consoles/index.ts:163](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L163) |
| `MEGADRIVE.resolution.width` | `320` | `320` | [core/consoles/index.ts:163](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L163) |
| <a id="property-n3ds"></a> `N3DS` | \{ `name`: `"Nintendo 3DS"`; `palette`: [`GeneratedPalette`](../interfaces/GeneratedPalette.md); `resolution`: \{ `height`: `240`; `width`: `400`; \}; \} | - | [core/consoles/index.ts:144](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L144) |
| `N3DS.name` | `"Nintendo 3DS"` | `'Nintendo 3DS'` | [core/consoles/index.ts:145](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L145) |
| `N3DS.palette` | [`GeneratedPalette`](../interfaces/GeneratedPalette.md) | `GBA` | [core/consoles/index.ts:147](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L147) |
| `N3DS.resolution` | \{ `height`: `240`; `width`: `400`; \} | - | [core/consoles/index.ts:146](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L146) |
| `N3DS.resolution.height` | `240` | `240` | [core/consoles/index.ts:146](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L146) |
| `N3DS.resolution.width` | `400` | `400` | [core/consoles/index.ts:146](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L146) |
| <a id="property-n64"></a> `N64` | \{ `name`: `"Nintendo 64"`; `palette`: [`GeneratedPalette`](../interfaces/GeneratedPalette.md); `resolution`: \{ `height`: `240`; `width`: `320`; \}; \} | - | [core/consoles/index.ts:134](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L134) |
| `N64.name` | `"Nintendo 64"` | `'Nintendo 64'` | [core/consoles/index.ts:135](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L135) |
| `N64.palette` | [`GeneratedPalette`](../interfaces/GeneratedPalette.md) | `SNES` | [core/consoles/index.ts:137](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L137) |
| `N64.resolution` | \{ `height`: `240`; `width`: `320`; \} | - | [core/consoles/index.ts:136](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L136) |
| `N64.resolution.height` | `240` | `240` | [core/consoles/index.ts:136](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L136) |
| `N64.resolution.width` | `320` | `320` | [core/consoles/index.ts:136](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L136) |
| <a id="property-nds"></a> `NDS` | \{ `name`: `"Nintendo DS"`; `palette`: [`GeneratedPalette`](../interfaces/GeneratedPalette.md); `resolution`: \{ `height`: `192`; `width`: `256`; \}; \} | - | [core/consoles/index.ts:139](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L139) |
| `NDS.name` | `"Nintendo DS"` | `'Nintendo DS'` | [core/consoles/index.ts:140](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L140) |
| `NDS.palette` | [`GeneratedPalette`](../interfaces/GeneratedPalette.md) | `GBA` | [core/consoles/index.ts:142](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L142) |
| `NDS.resolution` | \{ `height`: `192`; `width`: `256`; \} | - | [core/consoles/index.ts:141](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L141) |
| `NDS.resolution.height` | `192` | `192` | [core/consoles/index.ts:141](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L141) |
| `NDS.resolution.width` | `256` | `256` | [core/consoles/index.ts:141](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L141) |
| <a id="property-neo_geo"></a> `NEO_GEO` | \{ `name`: `"SNK Neo Geo"`; `palette`: [`GeneratedPalette`](../interfaces/GeneratedPalette.md); `resolution`: \{ `height`: `224`; `width`: `320`; \}; \} | - | [core/consoles/index.ts:190](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L190) |
| `NEO_GEO.name` | `"SNK Neo Geo"` | `'SNK Neo Geo'` | [core/consoles/index.ts:191](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L191) |
| `NEO_GEO.palette` | [`GeneratedPalette`](../interfaces/GeneratedPalette.md) | `NEO_GEO` | [core/consoles/index.ts:193](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L193) |
| `NEO_GEO.resolution` | \{ `height`: `224`; `width`: `320`; \} | - | [core/consoles/index.ts:192](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L192) |
| `NEO_GEO.resolution.height` | `224` | `224` | [core/consoles/index.ts:192](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L192) |
| `NEO_GEO.resolution.width` | `320` | `320` | [core/consoles/index.ts:192](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L192) |
| <a id="property-nes"></a> `NES` | \{ `name`: `"Nintendo Entertainment System"`; `palette`: [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`NesColors`](../interfaces/NesColors.md)\>; `resolution`: \{ `height`: `240`; `width`: `256`; \}; \} | - | [core/consoles/index.ts:104](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L104) |
| `NES.name` | `"Nintendo Entertainment System"` | `'Nintendo Entertainment System'` | [core/consoles/index.ts:105](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L105) |
| `NES.palette` | [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`NesColors`](../interfaces/NesColors.md)\> | `NES` | [core/consoles/index.ts:107](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L107) |
| `NES.resolution` | \{ `height`: `240`; `width`: `256`; \} | - | [core/consoles/index.ts:106](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L106) |
| `NES.resolution.height` | `240` | `240` | [core/consoles/index.ts:106](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L106) |
| `NES.resolution.width` | `256` | `256` | [core/consoles/index.ts:106](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L106) |
| <a id="property-pico8"></a> `PICO8` | \{ `name`: `"PICO-8"`; `palette`: [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`Pico8Colors`](../interfaces/Pico8Colors.md)\>; `resolution`: \{ `height`: `128`; `width`: `128`; \}; \} | - | [core/consoles/index.ts:75](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L75) |
| `PICO8.name` | `"PICO-8"` | `'PICO-8'` | [core/consoles/index.ts:76](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L76) |
| `PICO8.palette` | [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`Pico8Colors`](../interfaces/Pico8Colors.md)\> | `PICO8` | [core/consoles/index.ts:78](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L78) |
| `PICO8.resolution` | \{ `height`: `128`; `width`: `128`; \} | - | [core/consoles/index.ts:77](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L77) |
| `PICO8.resolution.height` | `128` | `128` | [core/consoles/index.ts:77](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L77) |
| `PICO8.resolution.width` | `128` | `128` | [core/consoles/index.ts:77](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L77) |
| <a id="property-playdate"></a> `PLAYDATE` | \{ `name`: `"Playdate"`; `palette`: [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`PlaydateColors`](../interfaces/PlaydateColors.md)\>; `resolution`: \{ `height`: `240`; `width`: `400`; \}; \} | - | [core/consoles/index.ts:224](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L224) |
| `PLAYDATE.name` | `"Playdate"` | `'Playdate'` | [core/consoles/index.ts:225](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L225) |
| `PLAYDATE.palette` | [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`PlaydateColors`](../interfaces/PlaydateColors.md)\> | `PLAYDATE` | [core/consoles/index.ts:227](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L227) |
| `PLAYDATE.resolution` | \{ `height`: `240`; `width`: `400`; \} | - | [core/consoles/index.ts:226](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L226) |
| `PLAYDATE.resolution.height` | `240` | `240` | [core/consoles/index.ts:226](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L226) |
| `PLAYDATE.resolution.width` | `400` | `400` | [core/consoles/index.ts:226](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L226) |
| <a id="property-ps1"></a> `PS1` | \{ `name`: `"Sony PlayStation"`; `palette`: [`GeneratedPalette`](../interfaces/GeneratedPalette.md); `resolution`: \{ `height`: `240`; `width`: `320`; \}; \} | - | [core/consoles/index.ts:178](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L178) |
| `PS1.name` | `"Sony PlayStation"` | `'Sony PlayStation'` | [core/consoles/index.ts:179](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L179) |
| `PS1.palette` | [`GeneratedPalette`](../interfaces/GeneratedPalette.md) | `SNES` | [core/consoles/index.ts:181](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L181) |
| `PS1.resolution` | \{ `height`: `240`; `width`: `320`; \} | - | [core/consoles/index.ts:180](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L180) |
| `PS1.resolution.height` | `240` | `240` | [core/consoles/index.ts:180](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L180) |
| `PS1.resolution.width` | `320` | `320` | [core/consoles/index.ts:180](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L180) |
| <a id="property-psp"></a> `PSP` | \{ `name`: `"Sony PSP"`; `palette`: [`GeneratedPalette`](../interfaces/GeneratedPalette.md); `resolution`: \{ `height`: `272`; `width`: `480`; \}; \} | - | [core/consoles/index.ts:183](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L183) |
| `PSP.name` | `"Sony PSP"` | `'Sony PSP'` | [core/consoles/index.ts:184](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L184) |
| `PSP.palette` | [`GeneratedPalette`](../interfaces/GeneratedPalette.md) | `SNES` | [core/consoles/index.ts:186](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L186) |
| `PSP.resolution` | \{ `height`: `272`; `width`: `480`; \} | - | [core/consoles/index.ts:185](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L185) |
| `PSP.resolution.height` | `272` | `272` | [core/consoles/index.ts:185](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L185) |
| `PSP.resolution.width` | `480` | `480` | [core/consoles/index.ts:185](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L185) |
| <a id="property-snes"></a> `SNES` | \{ `name`: `"Super Nintendo"`; `palette`: [`GeneratedPalette`](../interfaces/GeneratedPalette.md); `resolution`: \{ `height`: `224`; `width`: `256`; \}; \} | - | [core/consoles/index.ts:114](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L114) |
| `SNES.name` | `"Super Nintendo"` | `'Super Nintendo'` | [core/consoles/index.ts:115](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L115) |
| `SNES.palette` | [`GeneratedPalette`](../interfaces/GeneratedPalette.md) | `SNES` | [core/consoles/index.ts:117](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L117) |
| `SNES.resolution` | \{ `height`: `224`; `width`: `256`; \} | - | [core/consoles/index.ts:116](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L116) |
| `SNES.resolution.height` | `224` | `224` | [core/consoles/index.ts:116](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L116) |
| `SNES.resolution.width` | `256` | `256` | [core/consoles/index.ts:116](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L116) |
| <a id="property-switch"></a> `SWITCH` | \{ `name`: `"Nintendo Switch"`; `palette`: [`GeneratedPalette`](../interfaces/GeneratedPalette.md); `resolution`: \{ `height`: `720`; `width`: `1280`; \}; \} | - | [core/consoles/index.ts:149](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L149) |
| `SWITCH.name` | `"Nintendo Switch"` | `'Nintendo Switch'` | [core/consoles/index.ts:150](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L150) |
| `SWITCH.palette` | [`GeneratedPalette`](../interfaces/GeneratedPalette.md) | `SNES` | [core/consoles/index.ts:152](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L152) |
| `SWITCH.resolution` | \{ `height`: `720`; `width`: `1280`; \} | - | [core/consoles/index.ts:151](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L151) |
| `SWITCH.resolution.height` | `720` | `720` | [core/consoles/index.ts:151](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L151) |
| `SWITCH.resolution.width` | `1280` | `1280` | [core/consoles/index.ts:151](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L151) |
| <a id="property-tic80"></a> `TIC80` | \{ `name`: `"TIC-80"`; `palette`: [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`Tic80Colors`](../interfaces/Tic80Colors.md)\>; `resolution`: \{ `height`: `136`; `width`: `240`; \}; \} | - | [core/consoles/index.ts:80](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L80) |
| `TIC80.name` | `"TIC-80"` | `'TIC-80'` | [core/consoles/index.ts:81](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L81) |
| `TIC80.palette` | [`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`Tic80Colors`](../interfaces/Tic80Colors.md)\> | `TIC80` | [core/consoles/index.ts:83](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L83) |
| `TIC80.resolution` | \{ `height`: `136`; `width`: `240`; \} | - | [core/consoles/index.ts:82](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L82) |
| `TIC80.resolution.height` | `136` | `136` | [core/consoles/index.ts:82](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L82) |
| `TIC80.resolution.width` | `240` | `240` | [core/consoles/index.ts:82](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L82) |

## Since

0.5.0
