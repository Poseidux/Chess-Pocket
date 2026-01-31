
import { Puzzle, Piece, Turn, LineMove } from '@/data/types';
import {
  makeMove,
  isKingInCheck,
  getLegalMovesForPiece,
  getPieceAt,
  isCheckmate,
  runChessLogicSelfTest,
  Square,
} from './chessLogic';
import { eq } from './coords';

export interface ValidationResult {
  puzzleId: string;
  passed: boolean;
  errors: string[];
  failingMoveIndex?: number;
  failingMoveLegalMoves?: Square[];
}

export interface ValidationReport {
  totalPuzzles: number;
  passedCount: number;
  failedCount: number;
  results: ValidationResult[];
  selfTestResult: { passed: boolean; message: string };
}

/**
 * Validates a single puzzle for correctness
 * Uses standardized [x,y] coordinates throughout
 */
export function validatePuzzle(puzzle: Puzzle): ValidationResult {
  const errors: string[] = [];
  let failingMoveIndex: number | undefined;
  let failingMoveLegalMoves: Square[] | undefined;

  console.log(`PuzzleValidator: Validating puzzle ${puzzle.id}`);

  // (a) Verify exactly one king per color
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

  // (b) Replay puzzle.line from initial position and verify each move is legal
  let currentPieces: Piece[] = JSON.parse(JSON.stringify(puzzle.pieces));
  let currentTurn: Turn = puzzle.turn;

  for (let i = 0; i < puzzle.line.length; i++) {
    const move = puzzle.line[i];

    // Verify move side matches current turn
    if (move.side !== currentTurn) {
      errors.push(
        `Move ${i}: Expected side ${currentTurn}, got ${move.side}`
      );
      failingMoveIndex = i;
      break;
    }

    // Verify piece exists at from square using [x,y] lookup
    const piece = getPieceAt(currentPieces, move.from);
    if (!piece) {
      errors.push(
        `Move ${i}: No piece at from square [${move.from[0]}, ${move.from[1]}]`
      );
      failingMoveIndex = i;
      break;
    }

    // Verify piece color matches side to move
    if (piece.color !== move.side) {
      errors.push(
        `Move ${i}: Piece at from square is ${piece.color}, expected ${move.side}`
      );
      failingMoveIndex = i;
      break;
    }

    // Get legal moves for this piece using [x,y] coordinates
    const legalMoves = getLegalMovesForPiece(
      currentPieces,
      move.from,
      puzzle.size,
      true
    );

    // Store legal moves for debugging
    failingMoveLegalMoves = legalMoves;

    // Verify the move is legal using eq helper
    const isLegal = legalMoves.some(m => eq(m, move.to));

    if (!isLegal) {
      errors.push(
        `Move ${i}: Move from [${move.from[0]}, ${move.from[1]}] to [${move.to[0]}, ${move.to[1]}] is not legal. Legal moves: ${JSON.stringify(legalMoves)}`
      );
      failingMoveIndex = i;
      break;
    }

    // Verify promotion if specified
    if (move.promo) {
      const promotionRank = piece.color === 'w' ? puzzle.size - 1 : 0;
      if (piece.type !== 'P') {
        errors.push(
          `Move ${i}: Promotion specified but piece is not a pawn (type: ${piece.type})`
        );
        failingMoveIndex = i;
        break;
      }
      if (move.to[1] !== promotionRank) {
        errors.push(
          `Move ${i}: Promotion specified but destination is not promotion rank (y: ${move.to[1]}, expected: ${promotionRank})`
        );
        failingMoveIndex = i;
        break;
      }
    }

    // Execute the move using standardized makeMove
    currentPieces = makeMove(currentPieces, move.from, move.to, move.promo);
    currentTurn = currentTurn === 'w' ? 'b' : 'w';
    
    // Clear failing move data if this move succeeded
    if (errors.length === 0) {
      failingMoveIndex = undefined;
      failingMoveLegalMoves = undefined;
    }
  }

  if (errors.length > 0) {
    return {
      puzzleId: puzzle.id,
      passed: false,
      errors,
      failingMoveIndex,
      failingMoveLegalMoves,
    };
  }

  // (c) After final ply, verify side-to-move is checkmated (for mate objectives)
  if (puzzle.objective.type === 'mate') {
    const kingColor = currentTurn;
    const isCheckmated = isCheckmate(currentPieces, kingColor, puzzle.size);

    if (!isCheckmated) {
      const isInCheck = isKingInCheck(currentPieces, kingColor, puzzle.size);
      
      if (!isInCheck) {
        errors.push(
          `Final position: King (${kingColor}) is not in check, but objective is mate`
        );
      } else {
        // Find which piece has legal moves
        const allPieces = currentPieces.filter(p => p.color === kingColor);
        for (const piece of allPieces) {
          const legalMoves = getLegalMovesForPiece(
            currentPieces,
            [piece.x, piece.y],
            puzzle.size,
            true
          );
          if (legalMoves.length > 0) {
            errors.push(
              `Final position: ${kingColor} ${piece.type} at [${piece.x}, ${piece.y}] has ${legalMoves.length} legal move(s): ${JSON.stringify(legalMoves)}, but should be checkmated`
            );
            break;
          }
        }
      }
    } else {
      console.log(`PuzzleValidator: Puzzle ${puzzle.id} passed validation`);
    }
  }

  return {
    puzzleId: puzzle.id,
    passed: errors.length === 0,
    errors,
    failingMoveIndex,
    failingMoveLegalMoves,
  };
}

/**
 * Validates all puzzles in a dataset
 */
export function validateAllPuzzles(puzzles: Puzzle[]): ValidationReport {
  console.log(`PuzzleValidator: Validating ${puzzles.length} puzzles`);

  // Run self-test first
  const selfTestResult = runChessLogicSelfTest();
  console.log(`PuzzleValidator: Self-test result: ${selfTestResult.message}`);

  const results: ValidationResult[] = [];
  let passedCount = 0;
  let failedCount = 0;

  for (const puzzle of puzzles) {
    const result = validatePuzzle(puzzle);
    results.push(result);

    if (result.passed) {
      passedCount++;
    } else {
      failedCount++;
      console.error(
        `PuzzleValidator: Puzzle ${puzzle.id} FAILED validation:`,
        result.errors
      );
      if (result.failingMoveIndex !== undefined) {
        console.error(
          `  Failing move index: ${result.failingMoveIndex}`
        );
        if (result.failingMoveLegalMoves) {
          console.error(
            `  Legal moves from from-square: ${JSON.stringify(result.failingMoveLegalMoves)}`
          );
        }
      }
    }
  }

  const report: ValidationReport = {
    totalPuzzles: puzzles.length,
    passedCount,
    failedCount,
    results,
    selfTestResult,
  };

  console.log(
    `PuzzleValidator: Validation complete. Passed: ${passedCount}, Failed: ${failedCount}`
  );

  return report;
}
