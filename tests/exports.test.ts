/**
 * Contract: public exports surface
 *
 * One test per exported name. Fails if a symbol is removed or renamed.
 * Add a new test here whenever a new export is added to src/index.ts.
 */
import { describe, expect, test } from 'bun:test';
import * as Gamefoo from '../src/index';

describe('exports — classes', () => {
  const classes = [
    'Asset',
    'Behaviour',
    'Camera',
    'Collidable',
    'Control',
    'DynamicEntity',
    'Engine',
    'EnhancedCamera',
    'Entity',
    'FontBitmap',
    'GameObjectRegister',
    'Grid',
    'GridDebugSystem',
    'HealthKit',
    'IconBitmap',
    'Input',
    'IntervalLoopDriver',
    'IsometricCameraSystem',
    'IsometricProjection',
    'MapGenerator',
    'Monitor',
    'MonitorSystem',
    'ObjectSystem',
    'PathFollower',
    'Pathfinder',
    'PerlinNoise',
    'Player',
    'RAFLoopDriver',
    'CameraSystem',
    'CollisionSystem',
    'Sprite',
    'SpriteRender',
    'StateMachine',
    'Text',
    'TerminalInputDriver',
    'TerminalRender',
    'TerminalRenderContext',
    'TileLayer',
    'TileMap',
    'TilemapSystem',
    'TileSet',
    'WebRenderer',
    'World',
  ] as const;

  for (const name of classes) {
    test(name, () => {
      expect(typeof (Gamefoo as Record<string, unknown>)[name]).toBe('function');
    });
  }
});

describe('exports — functions', () => {
  const fns = ['createBunLoop', 'createTerminalLoop', 'log'] as const;

  for (const name of fns) {
    test(name, () => {
      expect(typeof (Gamefoo as Record<string, unknown>)[name]).toBe('function');
    });
  }
});
