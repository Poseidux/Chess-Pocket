
import { Puzzle } from './types';

// Built-in puzzle dataset - ~10 sample puzzles across different sizes and objectives
export const BUILT_IN_PUZZLES: Puzzle[] = [
  // 4x4 Puzzles
  {
    id: 'puzzle-001',
    pack: 'Beginner Tactics',
    title: 'Back Rank Mate',
    size: 4,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 0, y: 0 },
      { type: 'R', color: 'w', x: 0, y: 2 },
      { type: 'K', color: 'b', x: 3, y: 3 },
      { type: 'P', color: 'b', x: 2, y: 3 },
    ],
    objective: {
      type: 'mate',
      depth: 1,
      note: 'White to move and checkmate in 1',
    },
    line: [
      { side: 'w', from: [0, 2], to: [3, 2] }, // Rd3#
    ],
  },
  {
    id: 'puzzle-002',
    pack: 'Beginner Tactics',
    title: 'Knight Fork',
    size: 4,
    difficulty: 2,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 0, y: 0 },
      { type: 'N', color: 'w', x: 1, y: 1 },
      { type: 'K', color: 'b', x: 3, y: 3 },
      { type: 'Q', color: 'b', x: 3, y: 1 },
    ],
    objective: {
      type: 'win',
      depth: 1,
      note: 'White to move and win the Queen',
    },
    line: [
      { side: 'w', from: [1, 1], to: [2, 3] }, // Nc4 forks King and Queen
    ],
  },

  // 5x5 Puzzles
  {
    id: 'puzzle-003',
    pack: 'Intermediate Tactics',
    title: 'Queen Sacrifice',
    size: 5,
    difficulty: 3,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 0, y: 0 },
      { type: 'Q', color: 'w', x: 2, y: 2 },
      { type: 'R', color: 'w', x: 0, y: 3 },
      { type: 'K', color: 'b', x: 4, y: 4 },
      { type: 'P', color: 'b', x: 3, y: 4 },
      { type: 'P', color: 'b', x: 4, y: 3 },
    ],
    objective: {
      type: 'mate',
      depth: 2,
      note: 'White to move and checkmate in 2',
    },
    line: [
      { side: 'w', from: [2, 2], to: [4, 4] }, // Qxe5+ (sacrifice)
      { side: 'b', from: [3, 4], to: [4, 4] }, // dxe5
      { side: 'w', from: [0, 3], to: [4, 3] }, // Re4#
    ],
  },
  {
    id: 'puzzle-004',
    pack: 'Endgame Basics',
    title: 'Pawn Promotion',
    size: 5,
    difficulty: 2,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 2, y: 2 },
      { type: 'P', color: 'w', x: 3, y: 3 },
      { type: 'K', color: 'b', x: 4, y: 4 },
    ],
    objective: {
      type: 'promote',
      depth: 3,
      note: 'White to move and promote the pawn',
    },
    line: [
      { side: 'w', from: [3, 3], to: [3, 4] }, // d5
      { side: 'b', from: [4, 4], to: [3, 4] }, // Kxd5
      { side: 'w', from: [2, 2], to: [2, 3] }, // Kc4
    ],
  },

  // 6x6 Puzzles
  {
    id: 'puzzle-005',
    pack: 'Advanced Tactics',
    title: 'Double Check',
    size: 6,
    difficulty: 4,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 0, y: 0 },
      { type: 'B', color: 'w', x: 2, y: 2 },
      { type: 'N', color: 'w', x: 3, y: 3 },
      { type: 'K', color: 'b', x: 5, y: 5 },
      { type: 'P', color: 'b', x: 4, y: 5 },
      { type: 'P', color: 'b', x: 5, y: 4 },
    ],
    objective: {
      type: 'mate',
      depth: 2,
      note: 'White to move and checkmate in 2',
    },
    line: [
      { side: 'w', from: [3, 3], to: [4, 5] }, // Nxe6+ (double check)
      { side: 'b', from: [5, 5], to: [4, 5] }, // Kxe6
      { side: 'w', from: [2, 2], to: [5, 5] }, // Bf6#
    ],
  },
  {
    id: 'puzzle-006',
    pack: 'Endgame Mastery',
    title: 'Rook Endgame',
    size: 6,
    difficulty: 3,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 2, y: 1 },
      { type: 'R', color: 'w', x: 0, y: 4 },
      { type: 'K', color: 'b', x: 5, y: 5 },
    ],
    objective: {
      type: 'mate',
      depth: 3,
      note: 'White to move and checkmate in 3',
    },
    line: [
      { side: 'w', from: [0, 4], to: [5, 4] }, // Rf5+
      { side: 'b', from: [5, 5], to: [4, 5] }, // Ke6
      { side: 'w', from: [5, 4], to: [5, 3] }, // Rf4
    ],
  },

  // 8x8 Puzzles (Standard Chess Board)
  {
    id: 'puzzle-007',
    pack: 'Classic Patterns',
    title: 'Smothered Mate',
    size: 8,
    difficulty: 4,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 4, y: 0 },
      { type: 'Q', color: 'w', x: 3, y: 3 },
      { type: 'N', color: 'w', x: 5, y: 5 },
      { type: 'K', color: 'b', x: 7, y: 7 },
      { type: 'R', color: 'b', x: 6, y: 7 },
      { type: 'P', color: 'b', x: 6, y: 6 },
      { type: 'P', color: 'b', x: 7, y: 6 },
    ],
    objective: {
      type: 'mate',
      depth: 2,
      note: 'White to move and checkmate in 2',
    },
    line: [
      { side: 'w', from: [3, 3], to: [6, 6] }, // Qxg7+
      { side: 'b', from: [6, 7], to: [6, 6] }, // Rxg7
      { side: 'w', from: [5, 5], to: [6, 7] }, // Nf7#
    ],
  },
  {
    id: 'puzzle-008',
    pack: 'Endgame Mastery',
    title: 'Zugzwang',
    size: 8,
    difficulty: 5,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 3, y: 5 },
      { type: 'Q', color: 'w', x: 2, y: 4 },
      { type: 'K', color: 'b', x: 4, y: 7 },
    ],
    objective: {
      type: 'mate',
      depth: 2,
      note: 'White to move and win',
    },
    line: [
      { side: 'w', from: [2, 4], to: [2, 6] }, // Qc7 (zugzwang)
      { side: 'b', from: [4, 7], to: [3, 7] }, // Kd8
      { side: 'w', from: [2, 6], to: [2, 7] }, // Qc8#
    ],
  },
  {
    id: 'puzzle-009',
    pack: 'Advanced Tactics',
    title: 'Bishop Pair',
    size: 8,
    difficulty: 3,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 4, y: 0 },
      { type: 'B', color: 'w', x: 2, y: 3 },
      { type: 'B', color: 'w', x: 5, y: 3 },
      { type: 'K', color: 'b', x: 4, y: 7 },
      { type: 'R', color: 'b', x: 7, y: 4 },
    ],
    objective: {
      type: 'win',
      depth: 2,
      note: 'White to move and win the Rook',
    },
    line: [
      { side: 'w', from: [2, 3], to: [5, 6] }, // Bf7+
      { side: 'b', from: [4, 7], to: [5, 7] }, // Kf8
      { side: 'w', from: [5, 3], to: [7, 4] }, // Bxh5
    ],
  },
  {
    id: 'puzzle-010',
    pack: 'Defense Training',
    title: 'Defensive Resource',
    size: 8,
    difficulty: 4,
    turn: 'b',
    pieces: [
      { type: 'K', color: 'w', x: 0, y: 0 },
      { type: 'Q', color: 'w', x: 1, y: 2 },
      { type: 'K', color: 'b', x: 0, y: 7 },
      { type: 'R', color: 'b', x: 7, y: 0 },
    ],
    objective: {
      type: 'stalemate',
      depth: 1,
      note: 'Black to move and force a draw',
    },
    line: [
      { side: 'b', from: [7, 0], to: [0, 0] }, // Ra1+ (perpetual check)
    ],
  },
];
