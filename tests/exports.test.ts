/**
 * Contract: public exports surface
 *
 * One test per exported name. Fails if a symbol is removed or renamed.
 * Add a new test here whenever a new export is added to src/index.ts.
 */
import { describe, expect, test } from 'vite-plus/test';
import * as Gamefoo from '../src/index';

describe('exports — classes', () => {
  const classes = [
    'Asset',
    'AudioLibrary',
    'AudioSystem',
    'Behaviour',
    'Camera',
    'Collidable',
    'Control',
    'DrawNode',
    'DynamicEntity',
    'Engine',
    'EnhancedCamera',
    'Entity',
    'FontBitmap',
    'FrameNode',
    'GameObjectRegister',
    'Grid',
    'HealthKit',
    'IconBitmap',
    'Input',
    'InputMapper',
    'InputSystem',
    'IntervalLoopDriver',
    'IsometricCameraSystem',
    'IsometricProjection',
    'LocalStorageBackend',
    'MapGenerator',
    'MapObjectBehaviour',
    'MapObjectBehaviourRegistry',
    'MemoryBackend',
    'MemoryStorage',
    'MonitorSystem',
    'MapSystem',
    'OutlineShader',
    'PathFollower',
    'Pathfinder',
    'PerlinNoise',
    'Player',
    'RAFLoopDriver',
    'CameraSystem',
    'CollisionSystem',
    'Shader',
    'ShaderHost',
    'ShaderStack',
    'GlowShader',
    'ParticleShader',
    'VignetteShader',
    'ScreenRegistry',
    'ScopedState',
    'ShaderSystem',
    'SoundHandle',
    'SoundSequence',
    'Sprite',
    'SpriteRender',
    'StateMachine',
    'StateStore',
    'StorageBackend',
    'Text',
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
  const fns = [
    'binding',
    'defineActions',
    'defineScheme',
    'extendScheme',
    'getButtonLabel',
    'getControlScheme',
    'getDefaultControls',
    'listControlSchemes',
    'log',
    'unassignedBinding',
  ] as const;

  for (const name of fns) {
    test(name, () => {
      expect(typeof (Gamefoo as Record<string, unknown>)[name]).toBe('function');
    });
  }
});
