
// Core chess piece types
export type PieceType = 'Pawn' | 'Knight' | 'Bishop' | 'Rook' | 'Queen' | 'King';
export type PieceColor = 'White' | 'Black';
export type Square = string; // e.g., "a1", "h8", "d4"

// Piece on the board
export interface Piece {
  id: string;
  type: PieceType;
  color: PieceColor;
  position: Square;
}

// Objective types for puzzles
export type ObjectiveType = 'Checkmate' | 'WinMaterial' | 'Draw' | 'Stalemate' | 'Promotion' | 'Defense';

// Turn indicator
export type Turn = 'White' | 'Black';

// Objective definition
export interface Objective {
  type: ObjectiveType;
  description: string; // e.g., "White to move and checkmate in 2"
  targetMaterial?: { type: PieceType; color: PieceColor; count: number }[]; // For WinMaterial objectives
}

// A single move in the solution
export interface LineMove {
  from: Square;
  to: Square;
  promotion?: PieceType; // e.g., 'Queen' if a pawn promotes
}

// Complete puzzle definition
export interface Puzzle {
  id: string;
  title: string;
  pack: string; // e.g., "Beginner Tactics", "Endgame Mastery"
  size: 4 | 5 | 6 | 8; // Board size N x N
  difficulty: 1 | 2 | 3 | 4 | 5;
  objective: Objective;
  pieces: Piece[];
  turn: Turn; // Who is to move first
  solution: LineMove[][]; // Array of possible solution lines, each line is an array of moves
}

// Filter options for puzzle library
export interface Filters {
  size?: 4 | 5 | 6 | 8;
  objectiveType?: ObjectiveType;
  difficulty?: 1 | 2 | 3 | 4 | 5;
  pack?: string;
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
