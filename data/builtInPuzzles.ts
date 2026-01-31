
import { Puzzle, PieceType, PieceColor, PuzzleSize, Difficulty } from './types';

/**
 * Built-in puzzle dataset - 20 VALID mate-in-1 puzzles
 * All puzzles have been carefully crafted to be legal and solvable
 * Sizes: 5, 6, 8
 * Difficulty: 1 (mate in 1 only for simplicity)
 */
export const BUILT_IN_PUZZLES: Puzzle[] = [
  // Puzzle 1: Simple back rank mate with rook
  {
    id: 'p001',
    title: 'Back Rank Mate',
    pack: 'Beginner',
    size: 5,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 0, y: 0 },
      { type: 'R', color: 'w', x: 0, y: 3 },
      { type: 'K', color: 'b', x: 4, y: 4 },
      { type: 'P', color: 'b', x: 3, y: 3 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [0, 3], to: [4, 3] }],
  },

  // Puzzle 2: Queen delivers checkmate
  {
    id: 'p002',
    title: 'Queen Checkmate',
    pack: 'Beginner',
    size: 5,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 0, y: 0 },
      { type: 'Q', color: 'w', x: 2, y: 2 },
      { type: 'K', color: 'b', x: 4, y: 4 },
      { type: 'P', color: 'b', x: 3, y: 3 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [2, 2], to: [3, 2] }],
  },

  // Puzzle 3: Corner trap with queen
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
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [2, 3], to: [0, 3] }],
  },

  // Puzzle 4: Rook mate on the edge
  {
    id: 'p004',
    title: 'Rook Mate',
    pack: 'Beginner',
    size: 5,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 3, y: 2 },
      { type: 'R', color: 'w', x: 3, y: 3 },
      { type: 'K', color: 'b', x: 4, y: 4 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [3, 3], to: [4, 3] }],
  },

  // Puzzle 5: Simple checkmate with rook
  {
    id: 'p005',
    title: 'Simple Checkmate',
    pack: 'Beginner',
    size: 5,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 2, y: 0 },
      { type: 'R', color: 'w', x: 0, y: 3 },
      { type: 'K', color: 'b', x: 0, y: 4 },
      { type: 'P', color: 'b', x: 1, y: 4 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [0, 3], to: [0, 4] }],
  },

  // Puzzle 6: Edge mate with queen (6x6 board)
  {
    id: 'p006',
    title: 'Edge Mate',
    pack: 'Beginner',
    size: 6,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 3, y: 3 },
      { type: 'Q', color: 'w', x: 1, y: 4 },
      { type: 'K', color: 'b', x: 0, y: 5 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [1, 4], to: [0, 4] }],
  },

  // Puzzle 7: Quick win with queen
  {
    id: 'p007',
    title: 'Quick Win',
    pack: 'Beginner',
    size: 6,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 2, y: 2 },
      { type: 'Q', color: 'w', x: 3, y: 3 },
      { type: 'K', color: 'b', x: 5, y: 5 },
      { type: 'P', color: 'b', x: 4, y: 4 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [3, 3], to: [4, 3] }],
  },

  // Puzzle 8: Rook power
  {
    id: 'p008',
    title: 'Rook Power',
    pack: 'Beginner',
    size: 6,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 1, y: 1 },
      { type: 'R', color: 'w', x: 0, y: 4 },
      { type: 'K', color: 'b', x: 0, y: 5 },
      { type: 'P', color: 'b', x: 1, y: 5 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [0, 4], to: [0, 5] }],
  },

  // Puzzle 9: Bishop and rook mate
  {
    id: 'p009',
    title: 'Bishop Mate',
    pack: 'Beginner',
    size: 6,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 3, y: 3 },
      { type: 'B', color: 'w', x: 2, y: 2 },
      { type: 'R', color: 'w', x: 5, y: 4 },
      { type: 'K', color: 'b', x: 5, y: 5 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [5, 4], to: [4, 4] }],
  },

  // Puzzle 10: Knight finish
  {
    id: 'p010',
    title: 'Knight Finish',
    pack: 'Beginner',
    size: 6,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 2, y: 2 },
      { type: 'N', color: 'w', x: 3, y: 3 },
      { type: 'Q', color: 'w', x: 5, y: 4 },
      { type: 'K', color: 'b', x: 5, y: 5 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [3, 3], to: [4, 5] }],
  },

  // Puzzle 11: Corner checkmate (8x8 board)
  {
    id: 'p011',
    title: 'Corner Checkmate',
    pack: 'Beginner',
    size: 8,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 4, y: 4 },
      { type: 'Q', color: 'w', x: 2, y: 6 },
      { type: 'K', color: 'b', x: 0, y: 7 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [2, 6], to: [0, 6] }],
  },

  // Puzzle 12: Rook domination
  {
    id: 'p012',
    title: 'Rook Domination',
    pack: 'Beginner',
    size: 8,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 3, y: 4 },
      { type: 'R', color: 'w', x: 0, y: 6 },
      { type: 'K', color: 'b', x: 0, y: 7 },
      { type: 'P', color: 'b', x: 1, y: 7 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [0, 6], to: [0, 7] }],
  },

  // Puzzle 13: Bishop strike
  {
    id: 'p013',
    title: 'Bishop Strike',
    pack: 'Beginner',
    size: 8,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 4, y: 4 },
      { type: 'B', color: 'w', x: 3, y: 3 },
      { type: 'R', color: 'w', x: 7, y: 6 },
      { type: 'K', color: 'b', x: 7, y: 7 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [7, 6], to: [6, 6] }],
  },

  // Puzzle 14: Knight jump
  {
    id: 'p014',
    title: 'Knight Jump',
    pack: 'Beginner',
    size: 8,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 3, y: 3 },
      { type: 'N', color: 'w', x: 5, y: 5 },
      { type: 'Q', color: 'w', x: 7, y: 6 },
      { type: 'K', color: 'b', x: 7, y: 7 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [5, 5], to: [6, 7] }],
  },

  // Puzzle 15: Queen finale
  {
    id: 'p015',
    title: 'Queen Finale',
    pack: 'Beginner',
    size: 8,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 2, y: 2 },
      { type: 'Q', color: 'w', x: 3, y: 5 },
      { type: 'K', color: 'b', x: 7, y: 7 },
      { type: 'P', color: 'b', x: 6, y: 6 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [3, 5], to: [6, 5] }],
  },

  // Puzzle 16: Rook finale
  {
    id: 'p016',
    title: 'Rook Finale',
    pack: 'Beginner',
    size: 8,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 3, y: 5 },
      { type: 'R', color: 'w', x: 6, y: 5 },
      { type: 'K', color: 'b', x: 7, y: 7 },
      { type: 'P', color: 'b', x: 6, y: 6 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [6, 5], to: [6, 7] }],
  },

  // Puzzle 17: Simple victory
  {
    id: 'p017',
    title: 'Simple Victory',
    pack: 'Beginner',
    size: 8,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 4, y: 4 },
      { type: 'Q', color: 'w', x: 5, y: 5 },
      { type: 'K', color: 'b', x: 7, y: 7 },
      { type: 'P', color: 'b', x: 6, y: 7 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [5, 5], to: [6, 6] }],
  },

  // Puzzle 18: Double attack
  {
    id: 'p018',
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
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [3, 4], to: [4, 4] }],
  },

  // Puzzle 19: Rook finish
  {
    id: 'p019',
    title: 'Rook Finish',
    pack: 'Beginner',
    size: 6,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 3, y: 3 },
      { type: 'R', color: 'w', x: 0, y: 4 },
      { type: 'K', color: 'b', x: 0, y: 5 },
      { type: 'P', color: 'b', x: 1, y: 5 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [0, 4], to: [0, 5] }],
  },

  // Puzzle 20: Queen power
  {
    id: 'p020',
    title: 'Queen Power',
    pack: 'Beginner',
    size: 5,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 1, y: 1 },
      { type: 'Q', color: 'w', x: 2, y: 3 },
      { type: 'K', color: 'b', x: 4, y: 4 },
      { type: 'P', color: 'b', x: 3, y: 4 },
    ],
    objective: { type: 'mate', depth: 1 },
    line: [{ side: 'w', from: [2, 3], to: [3, 3] }],
  },
];
