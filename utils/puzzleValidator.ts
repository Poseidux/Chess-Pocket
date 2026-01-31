
/**
 * Puzzle Validator
 * 
 * Validates puzzles by replaying the solution line and checking:
 * 1. Each move is legal according to chessLogic
 * 2. Final position is checkmate (for mate objectives)
 * 
 * Uses ONLY exported functions from chessLogic - no duplicated logic
 */

import { Puzzle, Piece, PieceColor, LineMove } from '@/data/types';
import {
  getPieceAt,
  generateLegalMoves,
  applyMove,
  isCheckmate,
  runChessLogicSelfTest,
  Move,
} from './chessLogic';

export interface ValidationResult {
  puzzleId: string;
  passed: boolean;
  errors: string[];
  failingMoveIndex?: number;
  failingMoveFrom?: [number, number];
  failingMoveTo?: [number, number];
  failingMoveLegalMoves?: Move[];
}

export interface ValidationReport {
  selfTest: { passed: boolean; errors: string[] };
  totalPuzzles: number;
  passedPuzzles: number;
  failedPuzzles: ValidationResult[];
}

/**
 * Validate a single puzzle
 */
function validatePuzzle(puzzle: Puzzle): ValidationResult {
  const errors: string[] = [];
  let failingMoveIndex: number | undefined;
  let failingMoveFrom: [number, number] | undefined;
  let failingMoveTo: [number, number] | undefined;
  let failingMoveLegalMoves: Move[] | undefined;

  // Verify exactly one king per color
  const whiteKings = puzzle.pieces.filter(p => p.type === 'K' && p.color === 'w');
  const blackKings = puzzle.pieces.filter(p => p.type === 'K' && p.color === 'b');

  if (whiteKings.length !== 1) {
    errors.push(`Expected 1 white king, found ${whiteKings.length}`);
  }
  if (blackKings.length !== 1) {
    errors.push(`Expected 1 black king, found ${blackKings.length}`);
  }

  if (errors.length > 0) {
    return { puzzleId: puzzle.id, passed: false, errors };
  }

  // Replay puzzle line from initial position
  let currentPieces: Piece[] = JSON.parse(JSON.stringify(puzzle.pieces));
  let currentSide: PieceColor = puzzle.turn;

  for (let i = 0; i < puzzle.line.length; i++) {
    const lineMove = puzzle.line[i];

    // Verify move side matches current turn
    if (lineMove.side !== currentSide) {
      errors.push(`Move ${i}: Expected side ${currentSide}, got ${lineMove.side}`);
      failingMoveIndex = i;
      failingMoveFrom = lineMove.from;
      failingMoveTo = lineMove.to;
      break;
    }

    // Verify piece exists at from square
    const piece = getPieceAt(currentPieces, lineMove.from[0], lineMove.from[1]);
    if (!piece) {
      errors.push(`Move ${i}: No piece at from square [${lineMove.from[0]}, ${lineMove.from[1]}]`);
      failingMoveIndex = i;
      failingMoveFrom = lineMove.from;
      failingMoveTo = lineMove.to;
      break;
    }

    // Verify piece color matches side to move
    if (piece.color !== lineMove.side) {
      errors.push(`Move ${i}: Piece at from square is ${piece.color}, expected ${lineMove.side}`);
      failingMoveIndex = i;
      failingMoveFrom = lineMove.from;
      failingMoveTo = lineMove.to;
      break;
    }

    // Get all legal moves for this side
    const legalMoves = generateLegalMoves(currentPieces, puzzle.size, currentSide);
    
    // Filter to moves from this specific square
    const legalMovesFromSquare = legalMoves.filter(
      m => m.from[0] === lineMove.from[0] && m.from[1] === lineMove.from[1]
    );

    // Check if this specific move is legal
    const isMoveLegal = legalMoves.some(
      m =>
        m.from[0] === lineMove.from[0] &&
        m.from[1] === lineMove.from[1] &&
        m.to[0] === lineMove.to[0] &&
        m.to[1] === lineMove.to[1] &&
        (m.promo === lineMove.promo || (!m.promo && !lineMove.promo))
    );

    if (!isMoveLegal) {
      errors.push(
        `Move ${i}: Illegal move from [${lineMove.from[0]}, ${lineMove.from[1]}] to [${lineMove.to[0]}, ${lineMove.to[1]}]`
      );
      failingMoveIndex = i;
      failingMoveFrom = lineMove.from;
      failingMoveTo = lineMove.to;
      failingMoveLegalMoves = legalMovesFromSquare;
      break;
    }

    // Apply the move
    const move: Move = {
      from: lineMove.from,
      to: lineMove.to,
      promo: lineMove.promo,
    };
    currentPieces = applyMove(currentPieces, move, puzzle.size);
    currentSide = currentSide === 'w' ? 'b' : 'w';
  }

  if (errors.length > 0) {
    return {
      puzzleId: puzzle.id,
      passed: false,
      errors,
      failingMoveIndex,
      failingMoveFrom,
      failingMoveTo,
      failingMoveLegalMoves,
    };
  }

  // After all moves, verify checkmate for mate objectives
  if (puzzle.objective.type === 'mate') {
    if (!isCheckmate(currentPieces, puzzle.size, currentSide)) {
      errors.push(`Final position: ${currentSide} is not in checkmate`);
    }
  }

  return {
    puzzleId: puzzle.id,
    passed: errors.length === 0,
    errors,
  };
}

/**
 * Validate all puzzles
 */
export function validateAllPuzzles(puzzles: Puzzle[]): ValidationReport {
  console.log(`PuzzleValidator: Validating ${puzzles.length} puzzles`);

  // Run self-test first
  const selfTestResult = runChessLogicSelfTest();

  const failedPuzzles: ValidationResult[] = [];
  let passedCount = 0;

  for (const puzzle of puzzles) {
    const result = validatePuzzle(puzzle);
    
    if (result.passed) {
      passedCount++;
      console.log(`PuzzleValidator: ✓ Puzzle ${puzzle.id} passed`);
    } else {
      failedPuzzles.push(result);
      console.error(`PuzzleValidator: ✗ Puzzle ${puzzle.id} FAILED:`);
      result.errors.forEach(err => console.error(`  - ${err}`));
      if (result.failingMoveIndex !== undefined) {
        console.error(`  Failing move index: ${result.failingMoveIndex}`);
        console.error(`  From: [${result.failingMoveFrom?.[0]}, ${result.failingMoveFrom?.[1]}]`);
        console.error(`  To: [${result.failingMoveTo?.[0]}, ${result.failingMoveTo?.[1]}]`);
        if (result.failingMoveLegalMoves) {
          console.error(`  Legal moves from that square:`, result.failingMoveLegalMoves);
        }
      }
    }
  }

  console.log(`PuzzleValidator: Complete. Passed: ${passedCount}/${puzzles.length}`);

  return {
    selfTest: selfTestResult,
    totalPuzzles: puzzles.length,
    passedPuzzles: passedCount,
    failedPuzzles,
  };
}
