
// Core chess piece types
export type PieceType = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';
export type PieceColor = 'w' | 'b';
export type Color = PieceColor; // Legacy alias

// Piece on the board
export interface Piece {
  type: PieceType;
  color: PieceColor;
  x: number;
  y: number;
}

// A single move in the solution line
export interface LineMove {
  side: PieceColor;
  from: [number, number];
  to: [number, number];
  promo?: 'Q' | 'R' | 'B' | 'N'; // Promotion piece type
}

// Complete puzzle definition
export type PuzzleSize = 5 | 6 | 7 | 8;
export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface Puzzle {
  id: string;
  title: string;
  pack: string;
  size: PuzzleSize;
  difficulty: Difficulty;
  turn: PieceColor; // Side to move first
  pieces: Piece[];
  objective: {
    type: 'mate';
    depth: number;
  };
  line: LineMove[];
}

// App settings (stored in AsyncStorage)
export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  hapticsEnabled: boolean;
}

// Puzzle progress tracking
export interface PuzzleProgress {
  puzzleId: string;
  solved: boolean;
  attempts: number;
  lastAttemptDate?: string;
}

// Filters for puzzle library
export type ObjectiveType = 'mate';

export interface Filters {
  size?: PuzzleSize[];
  difficulty?: Difficulty[];
  objectiveType?: ObjectiveType[];
  pack?: string[];
}
