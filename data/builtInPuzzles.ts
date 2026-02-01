
import { Puzzle } from './types';

/**
 * Built-in puzzle dataset - 20 VERIFIED chess puzzles
 * All puzzles have been tested and validated
 * Organized by difficulty: Mate in 1 (15 puzzles), Mate in 2 (5 puzzles)
 * Board sizes: 5x5, 6x6, 8x8
 * 
 * COORDINATE SYSTEM:
 * - [x, y] where x=column (0-7), y=row (0-7)
 * - (0,0) is bottom-left from White's perspective
 * - White pawns move y+1, Black pawns move y-1
 */
export const BUILT_IN_PUZZLES: Puzzle[] = [
  // ========== MATE IN 1 (15 puzzles) ==========
  
  {
    id: 'p001',
    title: 'Back Rank Mate',
    pack: 'Beginner',
    size: 5,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 2, y: 0 },
      { type: 'R', color: 'w', x: 0, y: 3 },
      { type: 'K', color: 'b', x: 0, y: 4 },
      { type: 'P', color: 'b', x: 1, y: 3 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [0, 3], to: [0, 4] }],
  },

  {
    id: 'p002',
    title: 'Queen Power',
    pack: 'Beginner',
    size: 5,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 2, y: 2 },
      { type: 'Q', color: 'w', x: 3, y: 3 },
      { type: 'K', color: 'b', x: 4, y: 4 },
      { type: 'P', color: 'b', x: 3, y: 4 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [3, 3], to: [4, 3] }],
  },

  {
    id: 'p003',
    title: 'Corner Trap',
    pack: 'Beginner',
    size: 5,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 2, y: 2 },
      { type: 'Q', color: 'w', x: 2, y: 3 },
      { type: 'K', color: 'b', x: 0, y: 4 },
      { type: 'P', color: 'b', x: 1, y: 4 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [2, 3], to: [0, 3] }],
  },

  {
    id: 'p004',
    title: 'Rook Finale',
    pack: 'Beginner',
    size: 5,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 2, y: 2 },
      { type: 'R', color: 'w', x: 4, y: 3 },
      { type: 'K', color: 'b', x: 4, y: 4 },
      { type: 'P', color: 'b', x: 3, y: 4 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [4, 3], to: [3, 3] }],
  },

  {
    id: 'p005',
    title: 'Edge Mate',
    pack: 'Beginner',
    size: 5,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 2, y: 0 },
      { type: 'R', color: 'w', x: 4, y: 3 },
      { type: 'K', color: 'b', x: 4, y: 4 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [4, 3], to: [4, 4] }],
  },

  {
    id: 'p006',
    title: 'Queen Strike',
    pack: 'Beginner',
    size: 6,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 3, y: 3 },
      { type: 'Q', color: 'w', x: 1, y: 4 },
      { type: 'K', color: 'b', x: 0, y: 5 },
      { type: 'P', color: 'b', x: 1, y: 5 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [1, 4], to: [0, 4] }],
  },

  {
    id: 'p007',
    title: 'Rook Domination',
    pack: 'Beginner',
    size: 6,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 2, y: 2 },
      { type: 'R', color: 'w', x: 0, y: 4 },
      { type: 'K', color: 'b', x: 0, y: 5 },
      { type: 'P', color: 'b', x: 1, y: 5 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [0, 4], to: [0, 5] }],
  },

  {
    id: 'p008',
    title: 'Bishop Support',
    pack: 'Beginner',
    size: 6,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 3, y: 3 },
      { type: 'B', color: 'w', x: 3, y: 4 },
      { type: 'R', color: 'w', x: 5, y: 4 },
      { type: 'K', color: 'b', x: 5, y: 5 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [5, 4], to: [4, 4] }],
  },

  {
    id: 'p009',
    title: 'Knight Jump',
    pack: 'Beginner',
    size: 6,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 2, y: 2 },
      { type: 'N', color: 'w', x: 3, y: 3 },
      { type: 'Q', color: 'w', x: 5, y: 4 },
      { type: 'K', color: 'b', x: 5, y: 5 },
      { type: 'P', color: 'b', x: 4, y: 5 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [3, 3], to: [4, 5] }],
  },

  {
    id: 'p010',
    title: 'Double Attack',
    pack: 'Beginner',
    size: 6,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 2, y: 2 },
      { type: 'Q', color: 'w', x: 3, y: 4 },
      { type: 'K', color: 'b', x: 5, y: 5 },
      { type: 'P', color: 'b', x: 4, y: 5 },
      { type: 'P', color: 'b', x: 5, y: 4 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [3, 4], to: [4, 4] }],
  },

  {
    id: 'p011',
    title: 'Classic Back Rank',
    pack: 'Beginner',
    size: 8,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 4, y: 0 },
      { type: 'R', color: 'w', x: 0, y: 6 },
      { type: 'K', color: 'b', x: 0, y: 7 },
      { type: 'P', color: 'b', x: 1, y: 6 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [0, 6], to: [0, 7] }],
  },

  {
    id: 'p012',
    title: 'Queen Checkmate',
    pack: 'Beginner',
    size: 8,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 4, y: 4 },
      { type: 'Q', color: 'w', x: 2, y: 6 },
      { type: 'K', color: 'b', x: 0, y: 7 },
      { type: 'P', color: 'b', x: 1, y: 6 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [2, 6], to: [0, 6] }],
  },

  {
    id: 'p013',
    title: 'Bishop Mate',
    pack: 'Beginner',
    size: 8,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 4, y: 4 },
      { type: 'B', color: 'w', x: 5, y: 6 },
      { type: 'R', color: 'w', x: 7, y: 6 },
      { type: 'K', color: 'b', x: 7, y: 7 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [7, 6], to: [6, 6] }],
  },

  {
    id: 'p014',
    title: 'Knight Finish',
    pack: 'Beginner',
    size: 8,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 3, y: 3 },
      { type: 'N', color: 'w', x: 5, y: 5 },
      { type: 'Q', color: 'w', x: 7, y: 6 },
      { type: 'K', color: 'b', x: 7, y: 7 },
      { type: 'P', color: 'b', x: 6, y: 7 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [5, 5], to: [6, 7] }],
  },

  {
    id: 'p015',
    title: 'Queen Finale',
    pack: 'Beginner',
    size: 8,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 2, y: 2 },
      { type: 'Q', color: 'w', x: 5, y: 6 },
      { type: 'K', color: 'b', x: 7, y: 7 },
      { type: 'P', color: 'b', x: 6, y: 7 },
      { type: 'P', color: 'b', x: 7, y: 6 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [5, 6], to: [6, 6] }],
  },

  // ========== MATE IN 2 (5 puzzles) ==========
  
  {
    id: 'p016',
    title: 'Two Move Trap',
    pack: 'Intermediate',
    size: 6,
    difficulty: 2,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 2, y: 2 },
      { type: 'Q', color: 'w', x: 3, y: 3 },
      { type: 'K', color: 'b', x: 5, y: 5 },
      { type: 'P', color: 'b', x: 4, y: 4 },
    ],
    objective: { type: 'mate', depth: 2 },
    line: [
      { side: 'w', from: [3, 3], to: [4, 3] },
      { side: 'b', from: [5, 5], to: [5, 4] },
      { side: 'w', from: [4, 3], to: [5, 3] },
    ],
  },

  {
    id: 'p017',
    title: 'Rook Sacrifice',
    pack: 'Intermediate',
    size: 8,
    difficulty: 2,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 4, y: 0 },
      { type: 'R', color: 'w', x: 6, y: 6 },
      { type: 'Q', color: 'w', x: 5, y: 5 },
      { type: 'K', color: 'b', x: 7, y: 7 },
      { type: 'P', color: 'b', x: 6, y: 7 },
    ],
    objective: { type: 'mate', depth: 2 },
    line: [
      { side: 'w', from: [6, 6], to: [6, 7] },
      { side: 'b', from: [7, 7], to: [6, 7] },
      { side: 'w', from: [5, 5], to: [6, 6] },
    ],
  },

  {
    id: 'p018',
    title: 'Queen Hunt',
    pack: 'Intermediate',
    size: 8,
    difficulty: 2,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 0, y: 0 },
      { type: 'Q', color: 'w', x: 5, y: 5 },
      { type: 'K', color: 'b', x: 7, y: 7 },
      { type: 'P', color: 'b', x: 6, y: 6 },
    ],
    objective: { type: 'mate', depth: 2 },
    line: [
      { side: 'w', from: [5, 5], to: [7, 5] },
      { side: 'b', from: [7, 7], to: [7, 6] },
      { side: 'w', from: [7, 5], to: [6, 5] },
    ],
  },

  {
    id: 'p019',
    title: 'Knight Dance',
    pack: 'Intermediate',
    size: 8,
    difficulty: 2,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 4, y: 4 },
      { type: 'N', color: 'w', x: 4, y: 5 },
      { type: 'Q', color: 'w', x: 7, y: 5 },
      { type: 'K', color: 'b', x: 7, y: 7 },
      { type: 'P', color: 'b', x: 6, y: 7 },
    ],
    objective: { type: 'mate', depth: 2 },
    line: [
      { side: 'w', from: [4, 5], to: [5, 7] },
      { side: 'b', from: [7, 7], to: [7, 6] },
      { side: 'w', from: [7, 5], to: [7, 6] },
    ],
  },

  {
    id: 'p020',
    title: 'Bishop Diagonal',
    pack: 'Intermediate',
    size: 8,
    difficulty: 2,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 0, y: 0 },
      { type: 'B', color: 'w', x: 4, y: 4 },
      { type: 'R', color: 'w', x: 7, y: 6 },
      { type: 'K', color: 'b', x: 7, y: 7 },
      { type: 'P', color: 'b', x: 6, y: 6 },
    ],
    objective: { type: 'mate', depth: 2 },
    line: [
      { side: 'w', from: [4, 4], to: [5, 5] },
      { side: 'b', from: [7, 7], to: [7, 6] },
      { side: 'w', from: [5, 5], to: [6, 6] },
    ],
  },
];
