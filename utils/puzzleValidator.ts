
import { Puzzle, Piece, Turn, LineMove } from '@/data/types';
import {
  makeMove,
  isKingInCheck,
  getLegalMovesForPiece,
  getPieceAt,
} from './chessLogic';

export interface ValidationResult {
  puzzleId: string;
  passed: boolean;
  errors: string[];
}

export interface ValidationReport {
  totalPuzzles: number;
  passedCount: number;
  failedCount: number;
  results: ValidationResult[];
}

/**
 * Validates a single puzzle for correctness
 */
export function validatePuzzle(puzzle: Puzzle): ValidationResult {
  const errors: string[] = [];

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
      break;
    }

    // Verify piece exists at from square
    const piece = getPieceAt(currentPieces, move.from);
    if (!piece) {
      errors.push(
        `Move ${i}: No piece at from square [${move.from[0]}, ${move.from[1]}]`
      );
      break;
    }

    // Verify piece color matches side to move
    if (piece.color !== move.side) {
      errors.push(
        `Move ${i}: Piece at from square is ${piece.color}, expected ${move.side}`
      );
      break;
    }

    // Get legal moves for this piece
    const legalMoves = getLegalMovesForPiece(
      currentPieces,
      move.from,
      puzzle.size,
      true
    );

    // Verify the move is legal
    const isLegal = legalMoves.some(
      m => m[0] === move.to[0] && m[1] === move.to[1]
    );

    if (!isLegal) {
      errors.push(
        `Move ${i}: Move from [${move.from[0]}, ${move.from[1]}] to [${move.to[0]}, ${move.to[1]}] is not legal. Legal moves: ${JSON.stringify(legalMoves)}`
      );
      break;
    }

    // Verify promotion if specified
    if (move.promo) {
      const promotionRank = piece.color === 'w' ? puzzle.size - 1 : 0;
      if (piece.type !== 'P') {
        errors.push(
          `Move ${i}: Promotion specified but piece is not a pawn (type: ${piece.type})`
        );
        break;
      }
      if (move.to[1] !== promotionRank) {
        errors.push(
          `Move ${i}: Promotion specified but destination is not promotion rank (y: ${move.to[1]}, expected: ${promotionRank})`
        );
        break;
      }
    }

    // Execute the move
    currentPieces = makeMove(currentPieces, move.from, move.to, move.promo);
    currentTurn = currentTurn === 'w' ? 'b' : 'w';
  }

  if (errors.length > 0) {
    return { puzzleId: puzzle.id, passed: false, errors };
  }

  // (c) After final ply, verify side-to-move is checkmated (for mate objectives)
  if (puzzle.objective.type === 'mate') {
    const kingColor = currentTurn;
    const isInCheck = isKingInCheck(currentPieces, kingColor, puzzle.size);

    if (!isInCheck) {
      errors.push(
        `Final position: King (${kingColor}) is not in check, but objective is mate`
      );
    } else {
      // Verify king has no legal moves
      const allPieces = currentPieces.filter(p => p.color === kingColor);
      let hasLegalMove = false;

      for (const piece of allPieces) {
        const legalMoves = getLegalMovesForPiece(
          currentPieces,
          [piece.x, piece.y],
          puzzle.size,
          true
        );
        if (legalMoves.length > 0) {
          hasLegalMove = true;
          errors.push(
            `Final position: ${kingColor} ${piece.type} at [${piece.x}, ${piece.y}] has ${legalMoves.length} legal move(s), but should be checkmated`
          );
          break;
        }
      }

      if (!hasLegalMove && errors.length === 0) {
        console.log(`PuzzleValidator: Puzzle ${puzzle.id} passed validation`);
      }
    }
  }

  return {
    puzzleId: puzzle.id,
    passed: errors.length === 0,
    errors,
  };
}

/**
 * Validates all puzzles in a dataset
 */
export function validateAllPuzzles(puzzles: Puzzle[]): ValidationReport {
  console.log(`PuzzleValidator: Validating ${puzzles.length} puzzles`);

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
    }
  }

  const report: ValidationReport = {
    totalPuzzles: puzzles.length,
    passedCount,
    failedCount,
    results,
  };

  console.log(
    `PuzzleValidator: Validation complete. Passed: ${passedCount}, Failed: ${failedCount}`
  );

  return report;
}
