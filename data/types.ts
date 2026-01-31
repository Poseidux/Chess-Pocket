
// Core chess piece types
export type PieceType = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';
export type Color = 'w' | 'b';

// Piece on the board
export interface Piece {
  type: PieceType;
  color: Color;
  x: number;
  y: number;
}

// A single move in the solution line
export interface LineMove {
  side: Color;
  from: [number, number];
  to: [number, number];
  promo?: 'Q' | 'R' | 'B' | 'N'; // Promotion piece type
}

// Complete puzzle definition
export interface Puzzle {
  id: string;
  title: string;
  pack: string;
  size: 5 | 6 | 7 | 8;
  difficulty: 1 | 2 | 3 | 4 | 5;
  turn: Color; // Side to move first
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
