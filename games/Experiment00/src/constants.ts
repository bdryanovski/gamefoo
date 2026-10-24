// The Experiment00 project uses 20×16 screens of 16px tiles → a
// 320×256 screen, up-scaled ×3 for display (960×768).
export const SCREEN_W = 320;
export const SCREEN_H = 256;
export const SCALE = 3;
// Screen tile size (px). Portal `spawn` cells are authored in grid col/row
// and converted to pixels with this.
export const BLOCK_SIZE = 16;
// Time a door takes to open (seconds). The `portal_open` cue is a 12s WAV
// played at quadruple rate so it finishes in this window; the pie-fill badge
// above the door tracks the same clock and completes as the door opens.
export const PORTAL_OPEN_SECONDS = 3;
// The player draws on this z-level; layers above it (e.g. the `pillars`
// layer at level 3) occlude it, so keep it below them.
export const PLAYER_LEVEL = 3;

// Screen-cut transition timing (seconds): the room collapses to dark over
// `OUT`, the screen swaps at the covered midpoint, then the new room reopens
// over `IN`.
export const TRANSITION_OUT = 0.42;
export const TRANSITION_IN = 0.5;
