---
title: 'Variable: CONTROLLER_LEGEND'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / CONTROLLER\_LEGEND

# Variable: CONTROLLER\_LEGEND

```ts
const CONTROLLER_LEGEND: {
  GENERIC_RETRO: {
     A: 1;
     B: 0;
     DPAD_DOWN: 13;
     DPAD_LEFT: 14;
     DPAD_RIGHT: 15;
     DPAD_UP: 12;
     L: 4;
     R: 5;
     SELECT: 8;
     START: 9;
     X: 3;
     Y: 2;
  };
  NINTENDO: {
     A: 1;
     B: 0;
     DPAD_DOWN: 13;
     DPAD_LEFT: 14;
     DPAD_RIGHT: 15;
     DPAD_UP: 12;
     HOME: 16;
     L: 4;
     LEFT_STICK_CLICK: 10;
     MINUS: 8;
     PLUS: 9;
     R: 5;
     RIGHT_STICK_CLICK: 11;
     X: 3;
     Y: 2;
     ZL: 6;
     ZR: 7;
  };
  PLAYSTATION: {
     CIRCLE: 1;
     CROSS: 0;
     DPAD_DOWN: 13;
     DPAD_LEFT: 14;
     DPAD_RIGHT: 15;
     DPAD_UP: 12;
     L1: 4;
     L2: 6;
     L3: 10;
     OPTIONS: 9;
     PS_BUTTON: 16;
     R1: 5;
     R2: 7;
     R3: 11;
     SHARE: 8;
     SQUARE: 2;
     TRIANGLE: 3;
  };
  XBOX: {
     A: 0;
     B: 1;
     BACK: 8;
     DPAD_DOWN: 13;
     DPAD_LEFT: 14;
     DPAD_RIGHT: 15;
     DPAD_UP: 12;
     GUIDE: 16;
     LB: 4;
     LEFT_STICK_CLICK: 10;
     LT: 6;
     RB: 5;
     RIGHT_STICK_CLICK: 11;
     RT: 7;
     START: 9;
     X: 2;
     Y: 3;
  };
};
```

Defined in: [core/controls/gamepad\_mapping.ts:244](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L244)

Console controller to Standard Gamepad mapping legend.

This documents how physical buttons on various console controllers
map to the W3C Standard Gamepad indices.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-generic_retro"></a> `GENERIC_RETRO` | \{ `A`: `1`; `B`: `0`; `DPAD_DOWN`: `13`; `DPAD_LEFT`: `14`; `DPAD_RIGHT`: `15`; `DPAD_UP`: `12`; `L`: `4`; `R`: `5`; `SELECT`: `8`; `START`: `9`; `X`: `3`; `Y`: `2`; \} | - | Generic / 8BitDo style controllers Many retro-style USB controllers follow the SNES layout mapped to standard gamepad positions. `[L:4] [R:5] [Select:8] [Start:9] [↑:12] [X:3] [←:14][→:15] [Y:2] [A:1] [↓:13] [B:0]` | [core/controls/gamepad\_mapping.ts:383](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L383) |
| `GENERIC_RETRO.A` | `1` | `1` | - | [core/controls/gamepad\_mapping.ts:385](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L385) |
| `GENERIC_RETRO.B` | `0` | `0` | - | [core/controls/gamepad\_mapping.ts:384](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L384) |
| `GENERIC_RETRO.DPAD_DOWN` | `13` | `13` | - | [core/controls/gamepad\_mapping.ts:393](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L393) |
| `GENERIC_RETRO.DPAD_LEFT` | `14` | `14` | - | [core/controls/gamepad\_mapping.ts:394](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L394) |
| `GENERIC_RETRO.DPAD_RIGHT` | `15` | `15` | - | [core/controls/gamepad\_mapping.ts:395](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L395) |
| `GENERIC_RETRO.DPAD_UP` | `12` | `12` | - | [core/controls/gamepad\_mapping.ts:392](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L392) |
| `GENERIC_RETRO.L` | `4` | `4` | - | [core/controls/gamepad\_mapping.ts:388](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L388) |
| `GENERIC_RETRO.R` | `5` | `5` | - | [core/controls/gamepad\_mapping.ts:389](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L389) |
| `GENERIC_RETRO.SELECT` | `8` | `8` | - | [core/controls/gamepad\_mapping.ts:390](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L390) |
| `GENERIC_RETRO.START` | `9` | `9` | - | [core/controls/gamepad\_mapping.ts:391](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L391) |
| `GENERIC_RETRO.X` | `3` | `3` | - | [core/controls/gamepad\_mapping.ts:387](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L387) |
| `GENERIC_RETRO.Y` | `2` | `2` | - | [core/controls/gamepad\_mapping.ts:386](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L386) |
| <a id="property-nintendo"></a> `NINTENDO` | \{ `A`: `1`; `B`: `0`; `DPAD_DOWN`: `13`; `DPAD_LEFT`: `14`; `DPAD_RIGHT`: `15`; `DPAD_UP`: `12`; `HOME`: `16`; `L`: `4`; `LEFT_STICK_CLICK`: `10`; `MINUS`: `8`; `PLUS`: `9`; `R`: `5`; `RIGHT_STICK_CLICK`: `11`; `X`: `3`; `Y`: `2`; `ZL`: `6`; `ZR`: `7`; \} | - | Nintendo Switch Pro Controller Note: Nintendo uses opposite A/B and X/Y positions compared to Xbox. The Standard Gamepad maps positionally, so Nintendo's A is button 1. `[ZL:6] [ZR:7] [L:4] [R:5] [-:8] [Home:16] [+:9] [↑:12] [X:3] [←:14][→:15] [L3:10] [R3:11] [Y:2] [A:1] [↓:13] [B:0] [Left Stick] [Right Stick] Axes: 0,1 Axes: 2,3` Physical to Standard mapping: - Nintendo B (bottom) → Standard 0 (A position) - Nintendo A (right) → Standard 1 (B position) - Nintendo Y (left) → Standard 2 (X position) - Nintendo X (top) → Standard 3 (Y position) | [core/controls/gamepad\_mapping.ts:347](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L347) |
| `NINTENDO.A` | `1` | `1` | - | [core/controls/gamepad\_mapping.ts:349](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L349) |
| `NINTENDO.B` | `0` | `0` | - | [core/controls/gamepad\_mapping.ts:348](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L348) |
| `NINTENDO.DPAD_DOWN` | `13` | `13` | - | [core/controls/gamepad\_mapping.ts:361](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L361) |
| `NINTENDO.DPAD_LEFT` | `14` | `14` | - | [core/controls/gamepad\_mapping.ts:362](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L362) |
| `NINTENDO.DPAD_RIGHT` | `15` | `15` | - | [core/controls/gamepad\_mapping.ts:363](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L363) |
| `NINTENDO.DPAD_UP` | `12` | `12` | - | [core/controls/gamepad\_mapping.ts:360](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L360) |
| `NINTENDO.HOME` | `16` | `16` | - | [core/controls/gamepad\_mapping.ts:364](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L364) |
| `NINTENDO.L` | `4` | `4` | - | [core/controls/gamepad\_mapping.ts:352](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L352) |
| `NINTENDO.LEFT_STICK_CLICK` | `10` | `10` | - | [core/controls/gamepad\_mapping.ts:358](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L358) |
| `NINTENDO.MINUS` | `8` | `8` | - | [core/controls/gamepad\_mapping.ts:356](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L356) |
| `NINTENDO.PLUS` | `9` | `9` | - | [core/controls/gamepad\_mapping.ts:357](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L357) |
| `NINTENDO.R` | `5` | `5` | - | [core/controls/gamepad\_mapping.ts:353](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L353) |
| `NINTENDO.RIGHT_STICK_CLICK` | `11` | `11` | - | [core/controls/gamepad\_mapping.ts:359](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L359) |
| `NINTENDO.X` | `3` | `3` | - | [core/controls/gamepad\_mapping.ts:351](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L351) |
| `NINTENDO.Y` | `2` | `2` | - | [core/controls/gamepad\_mapping.ts:350](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L350) |
| `NINTENDO.ZL` | `6` | `6` | - | [core/controls/gamepad\_mapping.ts:354](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L354) |
| `NINTENDO.ZR` | `7` | `7` | - | [core/controls/gamepad\_mapping.ts:355](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L355) |
| <a id="property-playstation"></a> `PLAYSTATION` | \{ `CIRCLE`: `1`; `CROSS`: `0`; `DPAD_DOWN`: `13`; `DPAD_LEFT`: `14`; `DPAD_RIGHT`: `15`; `DPAD_UP`: `12`; `L1`: `4`; `L2`: `6`; `L3`: `10`; `OPTIONS`: `9`; `PS_BUTTON`: `16`; `R1`: `5`; `R2`: `7`; `R3`: `11`; `SHARE`: `8`; `SQUARE`: `2`; `TRIANGLE`: `3`; \} | - | PlayStation Controller (DualShock / DualSense) `[L2:6] [R2:7] [L1:4] [R1:5] [Share:8] [PS:16] [Options:9] [↑:12] [△:3] [←:14][→:15] [L3:10] [R3:11] [□:2] [○:1] [↓:13] [×:0] [Left Stick] [Right Stick] Axes: 0,1 Axes: 2,3` | [core/controls/gamepad\_mapping.ts:301](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L301) |
| `PLAYSTATION.CIRCLE` | `1` | `1` | - | [core/controls/gamepad\_mapping.ts:303](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L303) |
| `PLAYSTATION.CROSS` | `0` | `0` | - | [core/controls/gamepad\_mapping.ts:302](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L302) |
| `PLAYSTATION.DPAD_DOWN` | `13` | `13` | - | [core/controls/gamepad\_mapping.ts:315](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L315) |
| `PLAYSTATION.DPAD_LEFT` | `14` | `14` | - | [core/controls/gamepad\_mapping.ts:316](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L316) |
| `PLAYSTATION.DPAD_RIGHT` | `15` | `15` | - | [core/controls/gamepad\_mapping.ts:317](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L317) |
| `PLAYSTATION.DPAD_UP` | `12` | `12` | - | [core/controls/gamepad\_mapping.ts:314](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L314) |
| `PLAYSTATION.L1` | `4` | `4` | - | [core/controls/gamepad\_mapping.ts:306](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L306) |
| `PLAYSTATION.L2` | `6` | `6` | - | [core/controls/gamepad\_mapping.ts:308](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L308) |
| `PLAYSTATION.L3` | `10` | `10` | - | [core/controls/gamepad\_mapping.ts:312](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L312) |
| `PLAYSTATION.OPTIONS` | `9` | `9` | - | [core/controls/gamepad\_mapping.ts:311](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L311) |
| `PLAYSTATION.PS_BUTTON` | `16` | `16` | - | [core/controls/gamepad\_mapping.ts:318](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L318) |
| `PLAYSTATION.R1` | `5` | `5` | - | [core/controls/gamepad\_mapping.ts:307](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L307) |
| `PLAYSTATION.R2` | `7` | `7` | - | [core/controls/gamepad\_mapping.ts:309](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L309) |
| `PLAYSTATION.R3` | `11` | `11` | - | [core/controls/gamepad\_mapping.ts:313](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L313) |
| `PLAYSTATION.SHARE` | `8` | `8` | - | [core/controls/gamepad\_mapping.ts:310](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L310) |
| `PLAYSTATION.SQUARE` | `2` | `2` | - | [core/controls/gamepad\_mapping.ts:304](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L304) |
| `PLAYSTATION.TRIANGLE` | `3` | `3` | - | [core/controls/gamepad\_mapping.ts:305](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L305) |
| <a id="property-xbox"></a> `XBOX` | \{ `A`: `0`; `B`: `1`; `BACK`: `8`; `DPAD_DOWN`: `13`; `DPAD_LEFT`: `14`; `DPAD_RIGHT`: `15`; `DPAD_UP`: `12`; `GUIDE`: `16`; `LB`: `4`; `LEFT_STICK_CLICK`: `10`; `LT`: `6`; `RB`: `5`; `RIGHT_STICK_CLICK`: `11`; `RT`: `7`; `START`: `9`; `X`: `2`; `Y`: `3`; \} | - | Xbox Controller (Standard Reference) The W3C Standard Gamepad is based on Xbox layout. `[LT:6] [RT:7] [LB:4] [RB:5] [Back:8] [Guide:16] [Start:9] [↑:12] [Y:3] [←:14][→:15] [L3:10] [R3:11] [X:2] [B:1] [↓:13] [A:0] [Left Stick] [Right Stick] Axes: 0,1 Axes: 2,3` | [core/controls/gamepad\_mapping.ts:264](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L264) |
| `XBOX.A` | `0` | `0` | - | [core/controls/gamepad\_mapping.ts:265](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L265) |
| `XBOX.B` | `1` | `1` | - | [core/controls/gamepad\_mapping.ts:266](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L266) |
| `XBOX.BACK` | `8` | `8` | - | [core/controls/gamepad\_mapping.ts:273](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L273) |
| `XBOX.DPAD_DOWN` | `13` | `13` | - | [core/controls/gamepad\_mapping.ts:278](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L278) |
| `XBOX.DPAD_LEFT` | `14` | `14` | - | [core/controls/gamepad\_mapping.ts:279](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L279) |
| `XBOX.DPAD_RIGHT` | `15` | `15` | - | [core/controls/gamepad\_mapping.ts:280](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L280) |
| `XBOX.DPAD_UP` | `12` | `12` | - | [core/controls/gamepad\_mapping.ts:277](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L277) |
| `XBOX.GUIDE` | `16` | `16` | - | [core/controls/gamepad\_mapping.ts:281](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L281) |
| `XBOX.LB` | `4` | `4` | - | [core/controls/gamepad\_mapping.ts:269](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L269) |
| `XBOX.LEFT_STICK_CLICK` | `10` | `10` | - | [core/controls/gamepad\_mapping.ts:275](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L275) |
| `XBOX.LT` | `6` | `6` | - | [core/controls/gamepad\_mapping.ts:271](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L271) |
| `XBOX.RB` | `5` | `5` | - | [core/controls/gamepad\_mapping.ts:270](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L270) |
| `XBOX.RIGHT_STICK_CLICK` | `11` | `11` | - | [core/controls/gamepad\_mapping.ts:276](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L276) |
| `XBOX.RT` | `7` | `7` | - | [core/controls/gamepad\_mapping.ts:272](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L272) |
| `XBOX.START` | `9` | `9` | - | [core/controls/gamepad\_mapping.ts:274](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L274) |
| `XBOX.X` | `2` | `2` | - | [core/controls/gamepad\_mapping.ts:267](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L267) |
| `XBOX.Y` | `3` | `3` | - | [core/controls/gamepad\_mapping.ts:268](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L268) |

## Since

0.5.0
