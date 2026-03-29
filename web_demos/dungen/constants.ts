export const CANVAS_W = 800;
export const CANVAS_H = 600;

export const TILE = {
  CORNER_TL: 0,
  CORNER_TR: 5,
  CORNER_BL: 40,
  CORNER_BR: 45,
  WALL_INNER: 3,
  WALL_LEFT: 0,
  WALL_TOP: 1,
  WALL_RIGHT: 5,
  WALL_BOTTOM: 41,
  WALL_CORNER_BL: 40,
  WALL_CORNER_BR: 45,
  WALL_ANGLE_TL: 50,
  WALL_ANGLE_TR: 53,
  GROUND_0: 6,
  GROUND_1: 7,
  GROUND_2: 8,
  GROUND_3: 17,
  CHEST_0: 84,
  CHEST_1: 83,
  FIRE_0: 90,
  FIRE_1: 91,
  FIRE_2: 92,
} as const;

export const GROUNDS = [
  TILE.GROUND_0,
  TILE.GROUND_0,
  TILE.GROUND_0,
  TILE.GROUND_1,
  TILE.GROUND_2,
  TILE.GROUND_3,
];

export const TILE_SIZE = 16;

export const DASH_SPEED = 500;
export const DASH_DURATION = 0.25;
export const DASH_COOLDOWN = 0.8;

export const MAP_COLS = 100; //Math.floor(CANVAS_W / TILE_SIZE); // 50
export const MAP_ROWS = 80; //Math.floor(CANVAS_H / TILE_SIZE); // 37

// seed
export let SEED = 44;

// fog
export const VIS_UNSEEN = 0;
export const VIS_SEEN = 1;
export const VIS_VISIBLE = 2;
export const VIEW_RADIUS = 6;

// minimap
export const MINIMAP_SCALE = 2;
export const MINIMAP_PADDING = 8;
