import { describe, expect, test } from 'vite-plus/test';
import {
  CONTROL_SCHEMES,
  STANDARD_ACTIONS,
  getControlScheme,
  getDefaultControls,
  listControlSchemes,
} from '../src/index';

describe('control presets', () => {
  test('every preset defines all standard actions with valid aliases and directions', () => {
    const expected = [...STANDARD_ACTIONS].sort();

    for (const scheme of Object.values(CONTROL_SCHEMES)) {
      expect(Object.keys(scheme.actions).sort()).toEqual(expected);

      for (const [alias, action] of Object.entries(scheme.aliases ?? {})) {
        expect(Object.hasOwn(scheme.actions, action), `${scheme.name}: ${alias}`).toBe(true);
      }

      for (const action of Object.values(scheme.directions ?? {})) {
        expect(Object.hasOwn(scheme.actions, action), `${scheme.name}: ${action}`).toBe(true);
      }
    }
  });

  test('preserves representative console bindings', () => {
    expect(CONTROL_SCHEMES.NES.actions.PRIMARY).toEqual({
      keys: ['x', 'j'],
      gamepad: { button: 0 },
    });
    expect(CONTROL_SCHEMES.NES.actions.TERTIARY).toEqual({ keys: [] });

    expect(CONTROL_SCHEMES.TIC80.actions.UP).toEqual({
      keys: ['arrowup'],
      gamepad: { button: 12 },
    });

    expect(CONTROL_SCHEMES.C64.actions.UP?.keys).toEqual(['w', 'arrowup', 'q']);
    expect(CONTROL_SCHEMES.C64.actions.LEFT?.keys).toEqual(['a', 'arrowleft', 'o']);

    expect(CONTROL_SCHEMES.DREAMCAST.actions.UP?.gamepad).toEqual({
      axis: 1,
      axisDirection: -1,
    });
    expect(CONTROL_SCHEMES.N64.actions.L2).toEqual({
      keys: ['z', 'space'],
      gamepad: { button: 6 },
    });
    expect(CONTROL_SCHEMES.N64.actions.C_UP).toEqual({
      keys: ['i'],
      gamepad: { button: 3 },
    });

    expect(CONTROL_SCHEMES.PLAYDATE.actions.START).toEqual({ keys: [] });
    expect(CONTROL_SCHEMES.PLAYDATE.actions.MENU).toEqual({
      keys: ['escape'],
      gamepad: { button: 16 },
    });
  });

  test('preserves console aliases', () => {
    expect(CONTROL_SCHEMES.NES.aliases?.A).toBe('PRIMARY');
    expect(CONTROL_SCHEMES.PICO8.aliases?.O).toBe('PRIMARY');
    expect(CONTROL_SCHEMES.PS1.aliases?.CROSS).toBe('PRIMARY');
    expect(CONTROL_SCHEMES.SNES.aliases?.ATTACK).toBe('QUATERNARY');
  });

  test('lookup helpers use the preset registry', () => {
    expect(getControlScheme('NES')).toBe(CONTROL_SCHEMES.NES);
    expect(listControlSchemes()).toContain('MEGADRIVE');
    expect(getDefaultControls('NES')).toBe(CONTROL_SCHEMES.NES);
  });
});
