/**
 * UI Framework Demo
 *
 * Demonstrates the MenuSystem with keyboard-only navigation.
 *
 * Controls:
 * - Escape: Toggle menu open/close
 * - LEFT/RIGHT: Switch tabs
 * - UP/DOWN: Navigate within page
 * - X/J/Space (PRIMARY): Activate focused widget
 *
 * @since 0.5.0
 */

import { Engine, WebRenderer } from '../../src/index';
import {
  PICO8,
  TIC80,
  GAMEBOY,
  NES,
  C64,
  type ColorPalette,
} from '../../src/core/palettes';
import {
  MenuSystem,
  ControlsPage,
  GraphicsPage,
  AudioPage,
  PalettePage,
  DebugPage,
  QuitPage,
  DEFAULT_THEME,
  PIXEL_THEME,
  RETRO_GREEN_THEME,
  RETRO_AMBER_THEME,
  type UITheme,
} from '../../src/ui';

// ============================================================================
// Setup
// ============================================================================

const CANVAS_W = 320;
const CANVAS_H = 240;
const SCALE = 2;

const renderer = new WebRenderer('game', CANVAS_W, CANVAS_H, SCALE);
const engine = new Engine(renderer, { backgroundColor: '#1a1a2e' });

// ============================================================================
// Themes
// ============================================================================

const themes: UITheme[] = [
  DEFAULT_THEME,
  PIXEL_THEME,
  RETRO_GREEN_THEME,
  RETRO_AMBER_THEME,
];
let currentThemeIndex = 0;

// ============================================================================
// Palettes for PalettePage
// ============================================================================

const palettes: ColorPalette[] = [
  PICO8,
  TIC80,
  GAMEBOY,
  NES,
  C64,
];

// ============================================================================
// Menu System
// ============================================================================

const menuSystem = new MenuSystem({
  width: 220,
  height: 200,
  theme: themes[currentThemeIndex]!,
  overlayColor: '#000000',
});

// ============================================================================
// Register All Pages
// ============================================================================

// 1. Controls Page - Control scheme selection
menuSystem.registerPage(
  new ControlsPage({
    initialScheme: 'DEFAULT',
    onSchemeChange: (scheme, name) => {
      console.log('Control scheme changed to:', name, scheme.name);
    },
  }),
);

// 2. Graphics Page - Video settings
menuSystem.registerPage(
  new GraphicsPage({
    fullscreen: false,
    scale: SCALE,
    scales: [1, 2, 3, 4],
    vsync: true,
    showFps: false,
    onFullscreenChange: (value) => {
      console.log('Fullscreen:', value);
    },
    onScaleChange: (scale) => {
      console.log('Scale changed to:', scale);
    },
    onVsyncChange: (value) => {
      console.log('VSync:', value);
    },
    onShowFpsChange: (value) => {
      console.log('Show FPS:', value);
    },
  }),
);

// 3. Audio Page - Sound settings
menuSystem.registerPage(
  new AudioPage({
    masterVolume: 80,
    musicVolume: 70,
    sfxVolume: 100,
    muted: false,
    onMasterVolumeChange: (vol) => {
      console.log('Master volume:', vol);
    },
    onMusicVolumeChange: (vol) => {
      console.log('Music volume:', vol);
    },
    onSfxVolumeChange: (vol) => {
      console.log('SFX volume:', vol);
    },
    onMutedChange: (muted) => {
      console.log('Muted:', muted);
    },
  }),
);

// 4. Palette Page - Color palette viewer
menuSystem.registerPage(
  new PalettePage({
    palettes: palettes,
    selectedIndex: 0,
    onPaletteChange: (palette, index) => {
      console.log('Palette changed to:', palette.name, 'at index', index);
    },
  }),
);

// 5. Debug Page - Debug options
menuSystem.registerPage(
  new DebugPage({
    showFps: false,
    showMemory: false,
    showDrawCalls: false,
    showCollisions: false,
    showGrid: false,
    showBounds: false,
    onShowFpsChange: (value) => {
      console.log('Debug FPS:', value);
    },
    onShowMemoryChange: (value) => {
      console.log('Debug Memory:', value);
    },
    onShowDrawCallsChange: (value) => {
      console.log('Debug Draw Calls:', value);
    },
    onShowCollisionsChange: (value) => {
      console.log('Debug Collisions:', value);
    },
    onShowGridChange: (value) => {
      console.log('Debug Grid:', value);
    },
    onShowBoundsChange: (value) => {
      console.log('Debug Bounds:', value);
    },
    onResetStats: () => {
      console.log('Stats reset');
    },
  }),
);

// 6. Quit Page - Exit confirmation
menuSystem.registerPage(
  new QuitPage({
    message: 'Exit the demo?',
    onQuit: () => {
      console.log('User confirmed quit');
      menuSystem.hide();
      // In a real game, you might redirect or close the window
    },
    onCancel: () => {
      console.log('User cancelled quit');
      menuSystem.hide();
    },
  }),
);

// ============================================================================
// Engine Setup
// ============================================================================

engine.use(menuSystem);

engine.setup(() => {
  // Show menu immediately for demo
  menuSystem.show();
});
