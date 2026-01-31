
/**
 * Coordinate system helpers
 * Convention: [x, y] where x = column (0..N-1), y = row (0..N-1)
 * White's perspective: [0,0] is bottom-left (a1 in standard chess)
 */

export type Coord = [number, number];

/**
 * Check if coordinates are on the board
 */
export function isOnBoard(x: number, y: number, size: number): boolean {
  return x >= 0 && x < size && y >= 0 && y < size;
}

/**
 * Generate a unique key for coordinates
 */
export function key([x, y]: Coord): string {
  return `${x},${y}`;
}

/**
 * Compare two coordinate arrays for equality
 */
export function eq(a: Coord, b: Coord): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

/**
 * Parse a key back to coordinates
 */
export function parseKey(k: string): Coord {
  const [x, y] = k.split(',').map(Number);
  return [x, y];
}
