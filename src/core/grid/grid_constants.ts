/**
 * 4-directional offsets (cardinal). @internal
 */
export const DIR_4: ReadonlyArray<[number, number]> = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
];

/**
 * 8-directional offsets (cardinal + diagonal). @internal
 */
export const DIR_8: ReadonlyArray<[number, number]> = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
];
