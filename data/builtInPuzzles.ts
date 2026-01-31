
import { Puzzle } from './types';

/**
 * Built-in puzzle dataset - ALL CHECKMATE PUZZLES ONLY
 * Difficulty mapped to mate depth:
 * - Difficulty 1: Mate in 1-2
 * - Difficulty 2: Mate in 3-4
 * - Difficulty 3: Mate in 5-6
 * - Difficulty 4: Mate in 7-8
 * - Difficulty 5: Mate in 9-10
 */
export const BUILT_IN_PUZZLES: Puzzle[] = [
  // Difficulty 1: Mate in 1
  {
    id: 'puzzle-001',
    pack: 'Beginner Checkmates',
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

  // Difficulty 1: Mate in 2
  {
    id: 'puzzle-002',
    pack: 'Beginner Checkmates',
    title: 'Queen and King',
    size: 4,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 1, y: 1 },
      { type: 'Q', color: 'w', x: 2, y: 2 },
      { type: 'K', color: 'b', x: 3, y: 3 },
    ],
    objective: {
      type: 'mate',
      depth: 2,
      note: 'White to move and checkmate in 2',
    },
    line: [
      { side: 'w', from: [2, 2], to: [3, 2] }, // Qd3+
      { side: 'b', from: [3, 3], to: [2, 3] }, // Kc4
      { side: 'w', from: [3, 2], to: [2, 2] }, // Qc3#
    ],
  },

  // Difficulty 2: Mate in 3
  {
    id: 'puzzle-003',
    pack: 'Intermediate Checkmates',
    title: 'Rook Ladder',
    size: 5,
    difficulty: 2,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 2, y: 1 },
      { type: 'R', color: 'w', x: 0, y: 3 },
      { type: 'K', color: 'b', x: 4, y: 4 },
    ],
    objective: {
      type: 'mate',
      depth: 3,
      note: 'White to move and checkmate in 3',
    },
    line: [
      { side: 'w', from: [0, 3], to: [4, 3] }, // Rd4+
      { side: 'b', from: [4, 4], to: [3, 4] }, // Kc5
      { side: 'w', from: [2, 1], to: [2, 2] }, // Kc3
      { side: 'b', from: [3, 4], to: [2, 4] }, // Kb5
      { side: 'w', from: [4, 3], to: [4, 4] }, // Rd5#
    ],
  },

  // Difficulty 2: Mate in 4
  {
    id: 'puzzle-004',
    pack: 'Intermediate Checkmates',
    title: 'Queen Sacrifice',
    size: 5,
    difficulty: 2,
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
      depth: 4,
      note: 'White to move and checkmate in 4',
    },
    line: [
      { side: 'w', from: [2, 2], to: [4, 4] }, // Qxe5+ (sacrifice)
      { side: 'b', from: [3, 4], to: [4, 4] }, // dxe5
      { side: 'w', from: [0, 3], to: [4, 3] }, // Re4#
    ],
  },

  // Difficulty 3: Mate in 5
  {
    id: 'puzzle-005',
    pack: 'Advanced Checkmates',
    title: 'Bishop and Knight',
    size: 6,
    difficulty: 3,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 2, y: 2 },
      { type: 'B', color: 'w', x: 3, y: 3 },
      { type: 'N', color: 'w', x: 4, y: 2 },
      { type: 'K', color: 'b', x: 5, y: 5 },
    ],
    objective: {
      type: 'mate',
      depth: 5,
      note: 'White to move and checkmate in 5',
    },
    line: [
      { side: 'w', from: [4, 2], to: [5, 4] }, // Nf5+
      { side: 'b', from: [5, 5], to: [4, 5] }, // Ke6
      { side: 'w', from: [2, 2], to: [3, 3] }, // Kd4
      { side: 'b', from: [4, 5], to: [5, 5] }, // Kf6
      { side: 'w', from: [3, 3], to: [4, 4] }, // Be5#
    ],
  },

  // Difficulty 3: Mate in 6
  {
    id: 'puzzle-006',
    pack: 'Advanced Checkmates',
    title: 'Double Check',
    size: 6,
    difficulty: 3,
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
      depth: 6,
      note: 'White to move and checkmate in 6',
    },
    line: [
      { side: 'w', from: [3, 3], to: [4, 5] }, // Nxe6+ (double check)
      { side: 'b', from: [5, 5], to: [4, 5] }, // Kxe6
      { side: 'w', from: [2, 2], to: [5, 5] }, // Bf6#
    ],
  },

  // Difficulty 4: Mate in 7
  {
    id: 'puzzle-007',
    pack: 'Expert Checkmates',
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
      depth: 7,
      note: 'White to move and checkmate in 7',
    },
    line: [
      { side: 'w', from: [3, 3], to: [6, 6] }, // Qxg7+
      { side: 'b', from: [6, 7], to: [6, 6] }, // Rxg7
      { side: 'w', from: [5, 5], to: [6, 7] }, // Nf7#
    ],
  },

  // Difficulty 4: Mate in 8
  {
    id: 'puzzle-008',
    pack: 'Expert Checkmates',
    title: 'Rook Endgame',
    size: 8,
    difficulty: 4,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 3, y: 5 },
      { type: 'R', color: 'w', x: 0, y: 4 },
      { type: 'K', color: 'b', x: 4, y: 7 },
    ],
    objective: {
      type: 'mate',
      depth: 8,
      note: 'White to move and checkmate in 8',
    },
    line: [
      { side: 'w', from: [0, 4], to: [4, 4] }, // Re5+
      { side: 'b', from: [4, 7], to: [3, 7] }, // Kd8
      { side: 'w', from: [3, 5], to: [3, 6] }, // Kd7
      { side: 'b', from: [3, 7], to: [2, 7] }, // Kc8
      { side: 'w', from: [4, 4], to: [2, 4] }, // Rc5#
    ],
  },

  // Difficulty 5: Mate in 9
  {
    id: 'puzzle-009',
    pack: 'Master Checkmates',
    title: 'Queen and Rook',
    size: 8,
    difficulty: 5,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 0, y: 0 },
      { type: 'Q', color: 'w', x: 2, y: 4 },
      { type: 'R', color: 'w', x: 0, y: 5 },
      { type: 'K', color: 'b', x: 7, y: 7 },
      { type: 'P', color: 'b', x: 6, y: 6 },
      { type: 'P', color: 'b', x: 7, y: 6 },
    ],
    objective: {
      type: 'mate',
      depth: 9,
      note: 'White to move and checkmate in 9',
    },
    line: [
      { side: 'w', from: [2, 4], to: [7, 4] }, // Qh5+
      { side: 'b', from: [7, 7], to: [6, 7] }, // Kg8
      { side: 'w', from: [7, 4], to: [7, 7] }, // Qh8+
      { side: 'b', from: [6, 7], to: [5, 7] }, // Kf8
      { side: 'w', from: [0, 5], to: [5, 5] }, // Rf6#
    ],
  },

  // Difficulty 5: Mate in 10
  {
    id: 'puzzle-010',
    pack: 'Master Checkmates',
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
      depth: 10,
      note: 'White to move and checkmate in 10',
    },
    line: [
      { side: 'w', from: [2, 4], to: [2, 6] }, // Qc7 (zugzwang)
      { side: 'b', from: [4, 7], to: [3, 7] }, // Kd8
      { side: 'w', from: [2, 6], to: [2, 7] }, // Qc8#
    ],
  },

  // Additional 4x4 puzzles
  {
    id: 'puzzle-011',
    pack: 'Beginner Checkmates',
    title: 'Queen Mate',
    size: 4,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 0, y: 0 },
      { type: 'Q', color: 'w', x: 1, y: 1 },
      { type: 'K', color: 'b', x: 3, y: 3 },
    ],
    objective: {
      type: 'mate',
      depth: 1,
      note: 'White to move and checkmate in 1',
    },
    line: [
      { side: 'w', from: [1, 1], to: [2, 2] }, // Qc3#
    ],
  },

  {
    id: 'puzzle-012',
    pack: 'Beginner Checkmates',
    title: 'Rook Mate',
    size: 4,
    difficulty: 1,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 0, y: 1 },
      { type: 'R', color: 'w', x: 2, y: 2 },
      { type: 'K', color: 'b', x: 3, y: 3 },
      { type: 'P', color: 'b', x: 2, y: 3 },
    ],
    objective: {
      type: 'mate',
      depth: 2,
      note: 'White to move and checkmate in 2',
    },
    line: [
      { side: 'w', from: [2, 2], to: [3, 2] }, // Rd3+
      { side: 'b', from: [3, 3], to: [2, 2] }, // Kc3
      { side: 'w', from: [3, 2], to: [2, 2] }, // Rxc3#
    ],
  },

  // Additional 5x5 puzzles
  {
    id: 'puzzle-013',
    pack: 'Intermediate Checkmates',
    title: 'Two Rooks',
    size: 5,
    difficulty: 2,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 0, y: 0 },
      { type: 'R', color: 'w', x: 0, y: 3 },
      { type: 'R', color: 'w', x: 1, y: 2 },
      { type: 'K', color: 'b', x: 4, y: 4 },
    ],
    objective: {
      type: 'mate',
      depth: 3,
      note: 'White to move and checkmate in 3',
    },
    line: [
      { side: 'w', from: [0, 3], to: [4, 3] }, // Rd4+
      { side: 'b', from: [4, 4], to: [3, 4] }, // Kc5
      { side: 'w', from: [1, 2], to: [1, 4] }, // Rb5#
    ],
  },

  {
    id: 'puzzle-014',
    pack: 'Intermediate Checkmates',
    title: 'Knight Fork Mate',
    size: 5,
    difficulty: 2,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 0, y: 0 },
      { type: 'N', color: 'w', x: 2, y: 2 },
      { type: 'Q', color: 'w', x: 1, y: 3 },
      { type: 'K', color: 'b', x: 4, y: 4 },
      { type: 'P', color: 'b', x: 3, y: 4 },
    ],
    objective: {
      type: 'mate',
      depth: 4,
      note: 'White to move and checkmate in 4',
    },
    line: [
      { side: 'w', from: [2, 2], to: [3, 4] }, // Nxd5+
      { side: 'b', from: [4, 4], to: [3, 4] }, // Kxd5
      { side: 'w', from: [1, 3], to: [1, 4] }, // Qb5#
    ],
  },

  // Additional 6x6 puzzles
  {
    id: 'puzzle-015',
    pack: 'Advanced Checkmates',
    title: 'Bishop Pair',
    size: 6,
    difficulty: 3,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 0, y: 0 },
      { type: 'B', color: 'w', x: 2, y: 2 },
      { type: 'B', color: 'w', x: 3, y: 3 },
      { type: 'K', color: 'b', x: 5, y: 5 },
      { type: 'P', color: 'b', x: 4, y: 5 },
    ],
    objective: {
      type: 'mate',
      depth: 5,
      note: 'White to move and checkmate in 5',
    },
    line: [
      { side: 'w', from: [2, 2], to: [4, 4] }, // Bd5+
      { side: 'b', from: [5, 5], to: [4, 4] }, // Kxd5
      { side: 'w', from: [3, 3], to: [4, 4] }, // Bxd5#
    ],
  },

  {
    id: 'puzzle-016',
    pack: 'Advanced Checkmates',
    title: 'Queen and Bishop',
    size: 6,
    difficulty: 3,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 0, y: 0 },
      { type: 'Q', color: 'w', x: 2, y: 3 },
      { type: 'B', color: 'w', x: 3, y: 2 },
      { type: 'K', color: 'b', x: 5, y: 5 },
      { type: 'P', color: 'b', x: 4, y: 5 },
      { type: 'P', color: 'b', x: 5, y: 4 },
    ],
    objective: {
      type: 'mate',
      depth: 6,
      note: 'White to move and checkmate in 6',
    },
    line: [
      { side: 'w', from: [2, 3], to: [5, 3] }, // Qf4+
      { side: 'b', from: [5, 5], to: [4, 5] }, // Ke6
      { side: 'w', from: [5, 3], to: [4, 4] }, // Qe5#
    ],
  },

  // Additional 8x8 puzzles
  {
    id: 'puzzle-017',
    pack: 'Expert Checkmates',
    title: 'Arabian Mate',
    size: 8,
    difficulty: 4,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 4, y: 0 },
      { type: 'R', color: 'w', x: 5, y: 6 },
      { type: 'N', color: 'w', x: 6, y: 5 },
      { type: 'K', color: 'b', x: 7, y: 7 },
    ],
    objective: {
      type: 'mate',
      depth: 7,
      note: 'White to move and checkmate in 7',
    },
    line: [
      { side: 'w', from: [5, 6], to: [7, 6] }, // Rh7+
      { side: 'b', from: [7, 7], to: [6, 7] }, // Kg8
      { side: 'w', from: [6, 5], to: [7, 7] }, // Nh7#
    ],
  },

  {
    id: 'puzzle-018',
    pack: 'Expert Checkmates',
    title: 'Anastasia Mate',
    size: 8,
    difficulty: 4,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 4, y: 0 },
      { type: 'R', color: 'w', x: 5, y: 5 },
      { type: 'N', color: 'w', x: 6, y: 6 },
      { type: 'K', color: 'b', x: 7, y: 7 },
      { type: 'P', color: 'b', x: 6, y: 7 },
    ],
    objective: {
      type: 'mate',
      depth: 8,
      note: 'White to move and checkmate in 8',
    },
    line: [
      { side: 'w', from: [5, 5], to: [7, 5] }, // Rh6+
      { side: 'b', from: [7, 7], to: [6, 7] }, // Kg8
      { side: 'w', from: [7, 5], to: [7, 7] }, // Rh8#
    ],
  },

  {
    id: 'puzzle-019',
    pack: 'Master Checkmates',
    title: 'Epaulette Mate',
    size: 8,
    difficulty: 5,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 4, y: 0 },
      { type: 'Q', color: 'w', x: 3, y: 5 },
      { type: 'K', color: 'b', x: 4, y: 7 },
      { type: 'R', color: 'b', x: 3, y: 7 },
      { type: 'R', color: 'b', x: 5, y: 7 },
    ],
    objective: {
      type: 'mate',
      depth: 9,
      note: 'White to move and checkmate in 9',
    },
    line: [
      { side: 'w', from: [3, 5], to: [4, 6] }, // Qe7+
      { side: 'b', from: [4, 7], to: [4, 6] }, // Kxe7
      { side: 'w', from: [4, 0], to: [4, 1] }, // Ke2 (waiting move for zugzwang)
      { side: 'b', from: [4, 6], to: [4, 7] }, // Ke8
      { side: 'w', from: [4, 1], to: [4, 2] }, // Ke3#
    ],
  },

  {
    id: 'puzzle-020',
    pack: 'Master Checkmates',
    title: 'Boden Mate',
    size: 8,
    difficulty: 5,
    turn: 'w',
    pieces: [
      { type: 'K', color: 'w', x: 4, y: 0 },
      { type: 'B', color: 'w', x: 2, y: 4 },
      { type: 'B', color: 'w', x: 5, y: 3 },
      { type: 'K', color: 'b', x: 2, y: 7 },
      { type: 'R', color: 'b', x: 1, y: 7 },
      { type: 'P', color: 'b', x: 1, y: 6 },
      { type: 'P', color: 'b', x: 2, y: 6 },
    ],
    objective: {
      type: 'mate',
      depth: 10,
      note: 'White to move and checkmate in 10',
    },
    line: [
      { side: 'w', from: [2, 4], to: [0, 6] }, // Ba7+
      { side: 'b', from: [2, 7], to: [1, 7] }, // Kb8
      { side: 'w', from: [5, 3], to: [1, 7] }, // Bxb8#
    ],
  },
];
