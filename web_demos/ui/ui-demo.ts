/**
 * UI Framework Demo
 *
 * Demonstrates the MenuSystem with full engine integration.
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
  MenuSystem,
  MenuIntegration,
  DEFAULT_THEME,
  type GraphicsState,
  type AudioState,
} from '../../src/ui';

// ============================================================================
// Setup
// ============================================================================

const CANVAS_W = 320;
const CANVAS_H = 240;
const SCALE = 2;

const renderer = new WebRenderer('game', CANVAS_W, CANVAS_H, SCALE);

// ============================================================================
// Game State (affected by menu settings)
// ============================================================================

// Union type for both palette types
type AnyPalette = ColorPalette | GeneratedPalette;

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

const gameState = {
  // Current palette for rendering
  activePalette: PICO8 as AnyPalette,
  // Graphics settings (initialized from renderer)
  graphics: {
    scale: renderer.readGameScale(),
    width: CANVAS_W,
    height: CANVAS_H,
  } as GraphicsState,
  // Audio settings
  audio: {
    masterVolume: 100,
    musicVolume: 80,
    sfxVolume: 100,
    muted: false,
  } as AudioState,
  // Control scheme name
  controlScheme: 'DEFAULT' as string,
};

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
// Demo Rendering (shows palette info)
// ============================================================================

class DemoGame extends Engine {
  override render(ctx: typeof renderer): void {
    const padding = 16;
    const lineHeight = 20;

    // Draw palette preview
    this.drawPalettePreview(ctx, padding);

    // Draw current settings info
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
    let y = 75;

    ctx.drawText(`Controls: ${gameState.controlScheme}`, padding, y, '#aaaaaa');
    y += lineHeight;

    ctx.drawText(
      `Audio: ${gameState.audio.muted ? 'MUTED' : `${gameState.audio.masterVolume}%`}`,
      padding,
      y,
      '#aaaaaa',
    );
    y += lineHeight;

    ctx.drawText(`Scale: ${gameState.graphics.scale}x`, padding, y, '#aaaaaa');
    y += lineHeight;

    ctx.drawText(
      `Resolution: ${gameState.graphics.width}x${gameState.graphics.height}`,
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
// Menu System with Integration
// ============================================================================

const menuSystem = new MenuSystem({
  width: 220,
  height: 200,
  theme: DEFAULT_THEME,
  overlayColor: '#000000',
});

// Create integration that connects menu to game state
// Pass MonitorSystem so DebugPage can control it directly
const integration = new MenuIntegration(game, menuSystem, {
  palettes,
  initialPaletteIndex: 0,
  initialControlScheme: 'DEFAULT',
  initialGraphics: gameState.graphics,
  initialAudio: gameState.audio,
  monitorSystem,
});

// Set up callbacks to update game state when menu changes
integration.setCallbacks({
  onControlSchemeChange: (_scheme, name) => {
    gameState.controlScheme = name;
    console.log(`Control scheme changed to: ${name}`);
  },

  onPaletteChange: (palette, _index) => {
    gameState.activePalette = palette;
    console.log(`Palette changed to: ${palette.name}`);
  },

  onGraphicsChange: (state) => {
    gameState.graphics = state;
    console.log('Graphics changed:', state);

    // Apply resolution/scale changes to the renderer and engine
    renderer.resize(state.width, state.height, state.scale);
    game.resize(state.width, state.height);

    // Resize menu to fit new screen dimensions
    menuSystem.resize(state.width, state.height);
  },

  onAudioChange: (state) => {
    gameState.audio = state;
    console.log('Audio changed:', state);
  },

  onDebugChange: (state) => {
    // Debug state is managed by MonitorSystem directly
    console.log('Debug changed:', state);
  },

  onQuit: () => {
    console.log('Quit confirmed - closing menu');
    menuSystem.hide();
  },
});

// Register all pages (connected via integration)
integration.registerAllPages();

// Add menu system to engine
game.use(menuSystem);

// Start the game
game.setup(() => {
  console.log('UI Demo started');
  console.log('Press ESC to toggle menu');
});
