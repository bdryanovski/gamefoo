/**
 * UI Framework Demo
 *
 * Demonstrates the MenuSubSystem with full engine integration.
 *
 * Controls:
 * - Escape: Toggle menu open/close
 * - LEFT/RIGHT: Switch tabs (or change value in focused selector)
 * - UP/DOWN: Navigate within page
 * - X/J/Space (PRIMARY): Activate focused widget
 *
 * @since 0.5.0
 */

import { Engine, WebRenderer } from '../../src/index';
import { MonitorSystem } from '../../src/subsystems/monitor_system';
import {
  PICO8,
  TIC80,
  GAMEBOY,
  GBC,
  GBA,
  NES,
  SNES,
  C64,
  CGA,
  EGA,
  GENESIS,
  GAMEGEAR,
  ATARI_2600,
  NEO_GEO,
  PLAYDATE,
  type ColorPalette,
  type GeneratedPalette,
} from '../../src/core/palettes';
import {
  MenuSubSystem,
  DEFAULT_THEME,
  type AnyPalette,
} from '../../src/ui';

// ============================================================================
// Setup
// ============================================================================

const CANVAS_W = 320;
const CANVAS_H = 240;
const SCALE = 2;

const renderer = new WebRenderer('game', CANVAS_W, CANVAS_H, SCALE);

// ============================================================================
// Helper Functions
// ============================================================================

// Helper to check if palette has colors array
function hasColors(palette: AnyPalette): palette is ColorPalette {
  return 'colors' in palette && Array.isArray((palette as ColorPalette).colors);
}

// Helper to get displayable colors from any palette
function getPaletteColors(palette: AnyPalette): readonly string[] {
  if (hasColors(palette)) {
    return palette.colors;
  }
  // For GeneratedPalette, use commonColors or generate a sample
  const generated = palette as GeneratedPalette;
  if (generated.commonColors) {
    return generated.commonColors;
  }
  // Generate a basic color ramp
  const colors: string[] = [];
  const max = (1 << generated.bitsPerChannel) - 1;
  for (let i = 0; i <= max; i += Math.ceil(max / 7)) {
    colors.push(generated.generate(i, i, i)); // Grayscale ramp
  }
  return colors;
}

// ============================================================================
// Palettes
// ============================================================================

// All palettes (both ColorPalette and GeneratedPalette)
const palettes: AnyPalette[] = [
  // Fantasy Consoles
  PICO8,
  TIC80,
  // Nintendo
  GAMEBOY,
  GBC,
  GBA,
  NES,
  SNES,
  // Sega
  GENESIS,
  GAMEGEAR,
  // Atari
  ATARI_2600,
  // SNK
  NEO_GEO,
  // Home Computers
  C64,
  CGA,
  EGA,
  // Modern
  PLAYDATE,
];

// ============================================================================
// Game State (affected by menu settings)
// ============================================================================

const gameState = {
  activePalette: PICO8 as AnyPalette,
};

// ============================================================================
// Demo Rendering (shows palette info)
// ============================================================================

class DemoGame extends Engine {
  private _menuSubSystem: MenuSubSystem | null = null;

  setMenuSubSystem(menu: MenuSubSystem): void {
    this._menuSubSystem = menu;
  }

  override render(ctx: typeof renderer): void {
    const padding = 16;
    const lineHeight = 20;

    // Draw palette preview
    this.drawPalettePreview(ctx, padding);

    // Draw current settings info (from MenuSubSystem state)
    this.drawSettingsInfo(ctx, padding, lineHeight);
  }

  private drawPalettePreview(ctx: typeof renderer, padding: number): void {
    const palette = gameState.activePalette;
    const colors = getPaletteColors(palette);
    const swatchSize = 10;
    const cols = 8;

    // Draw palette name
    ctx.drawText(`Palette: ${palette.name}`, padding, padding, '#ffffff');

    // Draw color swatches
    for (let i = 0; i < colors.length && i < 32; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = padding + col * (swatchSize + 2);
      const y = padding + 14 + row * (swatchSize + 2);

      ctx.fillRect(x, y, swatchSize, swatchSize, colors[i]!);
      ctx.strokeRect(x, y, swatchSize, swatchSize, '#333333');
    }
  }

  private drawSettingsInfo(ctx: typeof renderer, padding: number, lineHeight: number): void {
    const menu = this._menuSubSystem;
    if (!menu) return;

    let y = 75;

    // Read state directly from MenuSubSystem
    ctx.drawText(`Controls: ${menu.controlScheme}`, padding, y, '#aaaaaa');
    y += lineHeight;

    const audio = menu.audio;
    ctx.drawText(
      `Audio: ${audio.muted ? 'MUTED' : `${audio.masterVolume}%`}`,
      padding,
      y,
      '#aaaaaa',
    );
    y += lineHeight;

    const graphics = menu.graphics;
    ctx.drawText(`Scale: ${graphics.scale}x`, padding, y, '#aaaaaa');
    y += lineHeight;

    ctx.drawText(
      `Resolution: ${graphics.width}x${graphics.height}`,
      padding,
      y,
      '#aaaaaa',
    );
    y += lineHeight + 8;

    ctx.drawText('Press ESC to open menu', padding, y, '#666666');
  }
}

// ============================================================================
// Engine Setup
// ============================================================================

// Create our custom game engine
const game = new DemoGame(renderer, { backgroundColor: '#1a1a2e' });

// Create MonitorSystem for debug overlays (FPS, grid, etc.)
const monitorSystem = new MonitorSystem({
  showFps: false,
  showGraph: false,
  showMemory: false,
  showGrid: false,
  gridSize: 'none',
});

// Add MonitorSystem to engine
game.use(monitorSystem);

// ============================================================================
// Menu SubSystem - Simple Engine Integration
// ============================================================================

// Create MenuSubSystem - one line to get full menu integration!
const menuSubSystem = new MenuSubSystem({
  width: 220,
  height: 200,
  theme: DEFAULT_THEME,
  palettes,
  initialPaletteIndex: 0,
  initialControlScheme: 'DEFAULT',
  monitorSystem, // Connect debug controls to MonitorSystem
});

// Set up callbacks for custom handling
menuSubSystem.onPaletteChange = (palette, _index) => {
  gameState.activePalette = palette;
  console.log(`Palette changed to: ${palette.name}`);
};

menuSubSystem.onControlSchemeChange = (_scheme, name) => {
  console.log(`Control scheme changed to: ${name}`);
};

menuSubSystem.onAudioChange = (state) => {
  console.log('Audio changed:', state);
  // Here you would connect to your audio system:
  // audioManager.setMasterVolume(state.masterVolume / 100);
  // audioManager.setMuted(state.muted);
};

menuSubSystem.onGraphicsChange = (state) => {
  console.log('Graphics changed:', state);
  // Graphics changes are automatically applied by MenuSubSystem!
};

menuSubSystem.onDebugChange = (state) => {
  console.log('Debug changed:', state);
  // Debug changes are automatically applied to MonitorSystem!
};

menuSubSystem.onQuit = () => {
  console.log('Quit confirmed - closing menu');
  menuSubSystem.hide();
};

menuSubSystem.onShow = () => {
  console.log('Menu opened');
};

menuSubSystem.onHide = () => {
  console.log('Menu closed');
};

// Add menu system to engine - that's it!
game.use(menuSubSystem);

// Give game access to menu for reading state
game.setMenuSubSystem(menuSubSystem);

// Start the game
game.setup(() => {
  console.log('UI Demo started');
  console.log('Press ESC to toggle menu');
  console.log('');
  console.log('MenuSubSystem provides:');
  console.log('  - Auto graphics resize on resolution/scale change');
  console.log('  - Auto debug overlay control via MonitorSystem');
  console.log('  - State accessors (graphics, audio, controls, debug)');
  console.log('  - Callbacks for custom integration');
});
