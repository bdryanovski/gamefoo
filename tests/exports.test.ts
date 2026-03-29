/**
 * API contract test: public exports surface
 *
 * Verifies that every symbol declared in src/index.ts is exported and
 * resolves to the expected kind (class constructor / function / object).
 *
 * This test intentionally imports from the source barrel so it catches
 * regressions caused by accidentally removing or renaming an export.
 */
import { describe, expect, test } from 'bun:test';
import * as Gamefoo from '../src/index';

describe('Public exports — existence', () => {
  // ── Classes (constructors) ────────────────────────────────────────

  const classes = [
    'Asset',
    'Behaviour',
    'Collidable',
    'Control',
    'HealthKit',
    'PathFollower',
    'SpriteRender',
    'TerminalRender',
    'Camera',
    'Engine',
    'EnhancedCamera',
    'FontBitmap',
    'GameObjectRegister',
    'Grid',
    'IsometricProjection',
    'IconBitmap',
    'Input',
    'TerminalInputDriver',
    'IntervalLoopDriver',
    'RAFLoopDriver',
    'TerminalRenderContext',
    'WebRenderer',
    'Sprite',
    'StateMachine',
    'TileLayer',
    'TileMap',
    'TilemapSystem',
    'TileSet',
    'MapGenerator',
    'Pathfinder',
    'PerlinNoise',
    'World',
    'GridDebugSystem',
    'Monitor',
    'DynamicEntity',
    'Entity',
    'Player',
    'Text',
    'CameraSystem',
    'CollisionSystem',
    'IsometricCameraSystem',
    'MonitorSystem',
    'ObjectSystem',
  ] as const;

  for (const name of classes) {
    test(`${name} is exported as a constructor`, () => {
      const exported = (Gamefoo as Record<string, unknown>)[name];
      expect(exported).toBeDefined();
      expect(typeof exported).toBe('function');
    });
  }

  // ── Functions ─────────────────────────────────────────────────────

  const functions = ['createBunLoop', 'createTerminalLoop', 'log'] as const;

  for (const name of functions) {
    test(`${name} is exported as a function`, () => {
      const exported = (Gamefoo as Record<string, unknown>)[name];
      expect(exported).toBeDefined();
      expect(typeof exported).toBe('function');
    });
  }
});
