
import { Puzzle } from './types';

/**
 * Built-in puzzle dataset - 10 sample mate puzzles
 * Sizes: 5, 6, 7, 8
 * Difficulties: 1-5
 */
export const BUILT_IN_PUZZLES: Puzzle[] = [
  // Puzzle 1: Size 5, Difficulty 1
  {
    id: 'puzzle-001',
    title: 'Back Rank Mate',
    pack: 'Beginner',
    size: 5,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 0, y: 0 },
      { type: 'R', color: 'w', x: 0, y: 3 },
      { type: 'K', color: 'b', x: 4, y: 4 },
      { type: 'P', color: 'b', x: 3, y: 4 },
    ],
    objective: {
      type: 'mate',
      depth: 1,
    },
    line: [
      { side: 'w', from: [0, 3], to: [4, 3] },
    ],
  },

  // Puzzle 2: Size 5, Difficulty 2
  {
    id: 'puzzle-002',
    title: 'Queen Mate',
    pack: 'Beginner',
    size: 5,
    difficulty: 2,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 1, y: 1 },
      { type: 'Q', color: 'w', x: 2, y: 2 },
      { type: 'K', color: 'b', x: 4, y: 4 },
    ],
    objective: {
      type: 'mate',
      depth: 2,
    },
    line: [
      { side: 'w', from: [2, 2], to: [4, 2] },
      { side: 'b', from: [4, 4], to: [3, 4] },
      { side: 'w', from: [4, 2], to: [3, 2] },
    ],
  },

  // Puzzle 3: Size 6, Difficulty 2
  {
    id: 'puzzle-003',
    title: 'Rook Ladder',
    pack: 'Intermediate',
    size: 6,
    difficulty: 2,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 2, y: 1 },
      { type: 'R', color: 'w', x: 0, y: 4 },
      { type: 'K', color: 'b', x: 5, y: 5 },
    ],
    objective: {
      type: 'mate',
      depth: 2,
    },
    line: [
      { side: 'w', from: [0, 4], to: [5, 4] },
      { side: 'b', from: [5, 5], to: [4, 5] },
      { side: 'w', from: [5, 4], to: [5, 5] },
    ],
  },

  // Puzzle 4: Size 6, Difficulty 3
  {
    id: 'puzzle-004',
    title: 'Bishop Pair',
    pack: 'Intermediate',
    size: 6,
    difficulty: 3,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 0, y: 0 },
      { type: 'B', color: 'w', x: 2, y: 2 },
      { type: 'B', color: 'w', x: 3, y: 3 },
      { type: 'K', color: 'b', x: 5, y: 5 },
    ],
    objective: {
      type: 'mate',
      depth: 2,
    },
    line: [
      { side: 'w', from: [2, 2], to: [4, 4] },
      { side: 'b', from: [5, 5], to: [4, 4] },
      { side: 'w', from: [3, 3], to: [4, 4] },
    ],
  },

  // Puzzle 5: Size 7, Difficulty 3
  {
    id: 'puzzle-005',
    title: 'Knight Fork',
    pack: 'Advanced',
    size: 7,
    difficulty: 3,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 2, y: 2 },
      { type: 'N', color: 'w', x: 4, y: 3 },
      { type: 'Q', color: 'w', x: 1, y: 4 },
      { type: 'K', color: 'b', x: 6, y: 6 },
    ],
    objective: {
      type: 'mate',
      depth: 2,
    },
    line: [
      { side: 'w', from: [4, 3], to: [5, 5] },
      { side: 'b', from: [6, 6], to: [5, 5] },
      { side: 'w', from: [1, 4], to: [1, 6] },
    ],
  },

  // Puzzle 6: Size 7, Difficulty 4
  {
    id: 'puzzle-006',
    title: 'Double Check',
    pack: 'Advanced',
    size: 7,
    difficulty: 4,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 0, y: 0 },
      { type: 'B', color: 'w', x: 3, y: 3 },
      { type: 'N', color: 'w', x: 4, y: 4 },
      { type: 'K', color: 'b', x: 6, y: 6 },
      { type: 'P', color: 'b', x: 5, y: 6 },
    ],
    objective: {
      type: 'mate',
      depth: 2,
    },
    line: [
      { side: 'w', from: [4, 4], to: [5, 6] },
      { side: 'b', from: [6, 6], to: [5, 6] },
      { side: 'w', from: [3, 3], to: [6, 6] },
    ],
  },

  // Puzzle 7: Size 8, Difficulty 4
  {
    id: 'puzzle-007',
    title: 'Smothered Mate',
    pack: 'Expert',
    size: 8,
    difficulty: 4,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 4, y: 0 },
      { type: 'Q', color: 'w', x: 3, y: 4 },
      { type: 'N', color: 'w', x: 5, y: 5 },
      { type: 'K', color: 'b', x: 7, y: 7 },
      { type: 'R', color: 'b', x: 6, y: 7 },
      { type: 'P', color: 'b', x: 6, y: 6 },
    ],
    objective: {
      type: 'mate',
      depth: 2,
    },
    line: [
      { side: 'w', from: [3, 4], to: [6, 7] },
      { side: 'b', from: [6, 7], to: [6, 7] },
      { side: 'w', from: [5, 5], to: [6, 7] },
    ],
  },

  // Puzzle 8: Size 8, Difficulty 5
  {
    id: 'puzzle-008',
    title: 'Rook Endgame',
    pack: 'Expert',
    size: 8,
    difficulty: 5,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 3, y: 5 },
      { type: 'R', color: 'w', x: 0, y: 4 },
      { type: 'K', color: 'b', x: 5, y: 7 },
    ],
    objective: {
      type: 'mate',
      depth: 3,
    },
    line: [
      { side: 'w', from: [0, 4], to: [5, 4] },
      { side: 'b', from: [5, 7], to: [4, 7] },
      { side: 'w', from: [3, 5], to: [4, 6] },
      { side: 'b', from: [4, 7], to: [3, 7] },
      { side: 'w', from: [5, 4], to: [3, 4] },
    ],
  },

  // Puzzle 9: Size 8, Difficulty 5
  {
    id: 'puzzle-009',
    title: 'Queen Sacrifice',
    pack: 'Master',
    size: 8,
    difficulty: 5,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 0, y: 0 },
      { type: 'Q', color: 'w', x: 2, y: 5 },
      { type: 'R', color: 'w', x: 0, y: 6 },
      { type: 'K', color: 'b', x: 7, y: 7 },
      { type: 'P', color: 'b', x: 6, y: 6 },
    ],
    objective: {
      type: 'mate',
      depth: 3,
    },
    line: [
      { side: 'w', from: [2, 5], to: [7, 5] },
      { side: 'b', from: [7, 7], to: [6, 7] },
      { side: 'w', from: [7, 5], to: [7, 7] },
      { side: 'b', from: [6, 7], to: [5, 7] },
      { side: 'w', from: [0, 6], to: [5, 6] },
    ],
  },

  // Puzzle 10: Size 7, Difficulty 5
  {
    id: 'puzzle-010',
    title: 'Zugzwang',
    pack: 'Master',
    size: 7,
    difficulty: 5,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 3, y: 4 },
      { type: 'Q', color: 'w', x: 2, y: 3 },
      { type: 'K', color: 'b', x: 5, y: 6 },
    ],
    objective: {
      type: 'mate',
      depth: 2,
    },
    line: [
      { side: 'w', from: [2, 3], to: [2, 5] },
      { side: 'b', from: [5, 6], to: [4, 6] },
      { side: 'w', from: [2, 5], to: [2, 6] },
    ],
  },
];
