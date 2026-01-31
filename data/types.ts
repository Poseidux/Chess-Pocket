
// Core chess piece types
export type PieceType = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';
export type PieceColor = 'w' | 'b';
export type Turn = 'w' | 'b';
export type PuzzleSize = 4 | 5 | 6 | 8;
export type Difficulty = 1 | 2 | 3 | 4 | 5;
export type ObjectiveType = 'mate' | 'win' | 'promote' | 'stalemate';

// Piece on the board
export interface Piece {
  type: PieceType;
  color: PieceColor;
  x: number;
  y: number;
}

// Objective definition
export interface Objective {
  type: ObjectiveType;
  depth: number; // e.g., mate in 2, win in 1
  note?: string;
}

// A single move in the solution line
export interface LineMove {
  side: Turn;
  from: [number, number];
  to: [number, number];
  promo?: 'Q' | 'R' | 'B' | 'N'; // Promotion piece type
}

// Complete puzzle definition
export interface Puzzle {
  id: string;
  pack: string;
  title: string;
  size: PuzzleSize;
  difficulty: Difficulty;
  turn: Turn; // Side to move first
  pieces: Piece[];
  objective: Objective;
  line: LineMove[]; // Flat array of moves for the solution
}

// Filter options for puzzle library
export interface Filters {
  size?: PuzzleSize[];
  difficulty?: Difficulty[];
  objectiveType?: ObjectiveType[];
  pack?: string[];
}

// User progress tracking (stored in AsyncStorage)
export interface PuzzleProgress {
  puzzleId: string;
  solved: boolean;
  attempts: number;
  lastAttemptDate?: string; // ISO 8601 format
}

// App settings (stored in AsyncStorage)
export interface AppSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  lastPlayedPuzzleId?: string;
}
