
import { Puzzle } from './types';

// Built-in puzzle dataset - ~10 sample puzzles across different sizes and objectives
export const BUILT_IN_PUZZLES: Puzzle[] = [
  // 4x4 Puzzles
  {
    id: 'puzzle-001',
    title: 'Back Rank Mate',
    pack: 'Beginner Tactics',
    size: 4,
    difficulty: 1,
    objective: {
      type: 'Checkmate',
      description: 'White to move and checkmate in 1',
    },
    pieces: [
      { id: 'wk1', type: 'King', color: 'White', position: 'a1' },
      { id: 'wr1', type: 'Rook', color: 'White', position: 'a3' },
      { id: 'bk1', type: 'King', color: 'Black', position: 'd4' },
      { id: 'bp1', type: 'Pawn', color: 'Black', position: 'c4' },
    ],
    turn: 'White',
    solution: [
      [{ from: 'a3', to: 'd3' }], // Rd3#
    ],
  },
  {
    id: 'puzzle-002',
    title: 'Knight Fork',
    pack: 'Beginner Tactics',
    size: 4,
    difficulty: 2,
    objective: {
      type: 'WinMaterial',
      description: 'White to move and win the Queen',
      targetMaterial: [{ type: 'Queen', color: 'Black', count: 1 }],
    },
    pieces: [
      { id: 'wk1', type: 'King', color: 'White', position: 'a1' },
      { id: 'wn1', type: 'Knight', color: 'White', position: 'b2' },
      { id: 'bk1', type: 'King', color: 'Black', position: 'd4' },
      { id: 'bq1', type: 'Queen', color: 'Black', position: 'd2' },
    ],
    turn: 'White',
    solution: [
      [{ from: 'b2', to: 'c4' }], // Nc4 forks King and Queen
    ],
  },

  // 5x5 Puzzles
  {
    id: 'puzzle-003',
    title: 'Queen Sacrifice',
    pack: 'Intermediate Tactics',
    size: 5,
    difficulty: 3,
    objective: {
      type: 'Checkmate',
      description: 'White to move and checkmate in 2',
    },
    pieces: [
      { id: 'wk1', type: 'King', color: 'White', position: 'a1' },
      { id: 'wq1', type: 'Queen', color: 'White', position: 'c3' },
      { id: 'wr1', type: 'Rook', color: 'White', position: 'a4' },
      { id: 'bk1', type: 'King', color: 'Black', position: 'e5' },
      { id: 'bp1', type: 'Pawn', color: 'Black', position: 'd5' },
      { id: 'bp2', type: 'Pawn', color: 'Black', position: 'e4' },
    ],
    turn: 'White',
    solution: [
      [
        { from: 'c3', to: 'e5' }, // Qxe5+ (sacrifice)
        { from: 'a4', to: 'e4' }, // Re4#
      ],
    ],
  },
  {
    id: 'puzzle-004',
    title: 'Pawn Promotion',
    pack: 'Endgame Basics',
    size: 5,
    difficulty: 2,
    objective: {
      type: 'Promotion',
      description: 'White to move and promote the pawn',
    },
    pieces: [
      { id: 'wk1', type: 'King', color: 'White', position: 'c3' },
      { id: 'wp1', type: 'Pawn', color: 'White', position: 'd4' },
      { id: 'bk1', type: 'King', color: 'Black', position: 'e5' },
    ],
    turn: 'White',
    solution: [
      [
        { from: 'd4', to: 'd5' }, // d5
        { from: 'd5', to: 'd6' }, // d6 (assuming Black King moves)
      ],
    ],
  },

  // 6x6 Puzzles
  {
    id: 'puzzle-005',
    title: 'Double Check',
    pack: 'Advanced Tactics',
    size: 6,
    difficulty: 4,
    objective: {
      type: 'Checkmate',
      description: 'White to move and checkmate in 2',
    },
    pieces: [
      { id: 'wk1', type: 'King', color: 'White', position: 'a1' },
      { id: 'wb1', type: 'Bishop', color: 'White', position: 'c3' },
      { id: 'wn1', type: 'Knight', color: 'White', position: 'd4' },
      { id: 'bk1', type: 'King', color: 'Black', position: 'f6' },
      { id: 'bp1', type: 'Pawn', color: 'Black', position: 'e6' },
      { id: 'bp2', type: 'Pawn', color: 'Black', position: 'f5' },
    ],
    turn: 'White',
    solution: [
      [
        { from: 'd4', to: 'e6' }, // Nxe6+ (double check)
        { from: 'c3', to: 'f6' }, // Bxf6#
      ],
    ],
  },
  {
    id: 'puzzle-006',
    title: 'Rook Endgame',
    pack: 'Endgame Mastery',
    size: 6,
    difficulty: 3,
    objective: {
      type: 'Checkmate',
      description: 'White to move and checkmate in 3',
    },
    pieces: [
      { id: 'wk1', type: 'King', color: 'White', position: 'c2' },
      { id: 'wr1', type: 'Rook', color: 'White', position: 'a5' },
      { id: 'bk1', type: 'King', color: 'Black', position: 'f6' },
    ],
    turn: 'White',
    solution: [
      [
        { from: 'a5', to: 'f5' }, // Rf5+
        { from: 'f5', to: 'f4' }, // Rf4 (after Ke7)
        { from: 'c2', to: 'd3' }, // Kd3 (zugzwang)
      ],
    ],
  },

  // 8x8 Puzzles (Standard Chess Board)
  {
    id: 'puzzle-007',
    title: 'Smothered Mate',
    pack: 'Classic Patterns',
    size: 8,
    difficulty: 4,
    objective: {
      type: 'Checkmate',
      description: 'White to move and checkmate in 3',
    },
    pieces: [
      { id: 'wk1', type: 'King', color: 'White', position: 'e1' },
      { id: 'wq1', type: 'Queen', color: 'White', position: 'd4' },
      { id: 'wn1', type: 'Knight', color: 'White', position: 'f6' },
      { id: 'bk1', type: 'King', color: 'Black', position: 'h8' },
      { id: 'br1', type: 'Rook', color: 'Black', position: 'g8' },
      { id: 'bp1', type: 'Pawn', color: 'Black', position: 'g7' },
      { id: 'bp2', type: 'Pawn', color: 'Black', position: 'h7' },
    ],
    turn: 'White',
    solution: [
      [
        { from: 'd4', to: 'g7' }, // Qxg7+ (sacrifice)
        { from: 'f6', to: 'g7' }, // Nf7# (smothered mate)
      ],
    ],
  },
  {
    id: 'puzzle-008',
    title: 'Zugzwang',
    pack: 'Endgame Mastery',
    size: 8,
    difficulty: 5,
    objective: {
      type: 'Checkmate',
      description: 'White to move and win',
    },
    pieces: [
      { id: 'wk1', type: 'King', color: 'White', position: 'd6' },
      { id: 'wq1', type: 'Queen', color: 'White', position: 'c5' },
      { id: 'bk1', type: 'King', color: 'Black', position: 'e8' },
    ],
    turn: 'White',
    solution: [
      [
        { from: 'c5', to: 'c7' }, // Qc7 (zugzwang)
        { from: 'c7', to: 'c8' }, // Qc8#
      ],
    ],
  },
  {
    id: 'puzzle-009',
    title: 'Bishop Pair',
    pack: 'Advanced Tactics',
    size: 8,
    difficulty: 3,
    objective: {
      type: 'WinMaterial',
      description: 'White to move and win the Rook',
      targetMaterial: [{ type: 'Rook', color: 'Black', count: 1 }],
    },
    pieces: [
      { id: 'wk1', type: 'King', color: 'White', position: 'e1' },
      { id: 'wb1', type: 'Bishop', color: 'White', position: 'c4' },
      { id: 'wb2', type: 'Bishop', color: 'White', position: 'f4' },
      { id: 'bk1', type: 'King', color: 'Black', position: 'e8' },
      { id: 'br1', type: 'Rook', color: 'Black', position: 'h5' },
    ],
    turn: 'White',
    solution: [
      [
        { from: 'c4', to: 'f7' }, // Bf7+ (fork)
        { from: 'f4', to: 'h5' }, // Bxh5 (win Rook)
      ],
    ],
  },
  {
    id: 'puzzle-010',
    title: 'Defensive Resource',
    pack: 'Defense Training',
    size: 8,
    difficulty: 4,
    objective: {
      type: 'Draw',
      description: 'Black to move and force a draw',
    },
    pieces: [
      { id: 'wk1', type: 'King', color: 'White', position: 'a1' },
      { id: 'wq1', type: 'Queen', color: 'White', position: 'b3' },
      { id: 'bk1', type: 'King', color: 'Black', position: 'a8' },
      { id: 'br1', type: 'Rook', color: 'Black', position: 'h1' },
    ],
    turn: 'Black',
    solution: [
      [
        { from: 'h1', to: 'a1' }, // Ra1+ (perpetual check)
      ],
    ],
  },
];
