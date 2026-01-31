
import { Piece, PieceType, PieceColor, Turn } from '@/data/types';

export type Square = [number, number]; // [x, y] where x=column, y=row

/**
 * Get piece at a specific square [x, y]
 */
export function getPieceAt(pieces: Piece[], square: Square): Piece | undefined {
  return pieces.find(p => p.x === square[0] && p.y === square[1]);
}

/**
 * Check if a square [x, y] is on the board
 */
export function isValidSquare(square: Square, boardSize: number): boolean {
  const [x, y] = square;
  return x >= 0 && x < boardSize && y >= 0 && y < boardSize;
}

/**
 * Check if a square is attacked by a specific color
 */
export function isSquareAttacked(
  pieces: Piece[],
  square: Square,
  attackerColor: PieceColor,
  boardSize: number
): boolean {
  const attackers = pieces.filter(p => p.color === attackerColor);
  
  for (const attacker of attackers) {
    const moves = getLegalMovesForPiece(pieces, [attacker.x, attacker.y], boardSize, false);
    if (moves.some(m => m[0] === square[0] && m[1] === square[1])) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if a king is in check
 */
export function isKingInCheck(
  pieces: Piece[],
  kingColor: PieceColor,
  boardSize: number
): boolean {
  const king = pieces.find(p => p.type === 'K' && p.color === kingColor);
  if (!king) return false;
  
  const opponentColor: PieceColor = kingColor === 'w' ? 'b' : 'w';
  return isSquareAttacked(pieces, [king.x, king.y], opponentColor, boardSize);
}

/**
 * Get legal moves for a piece at a given square [x, y]
 */
export function getLegalMovesForPiece(
  pieces: Piece[],
  from: Square,
  boardSize: number,
  checkForCheck: boolean = true
): Square[] {
  const piece = getPieceAt(pieces, from);
  if (!piece) return [];
  
  let pseudoLegalMoves: Square[] = [];
  
  switch (piece.type) {
    case 'K':
      pseudoLegalMoves = getKingMoves(pieces, from, boardSize);
      break;
    case 'Q':
      pseudoLegalMoves = getQueenMoves(pieces, from, boardSize);
      break;
    case 'R':
      pseudoLegalMoves = getRookMoves(pieces, from, boardSize);
      break;
    case 'B':
      pseudoLegalMoves = getBishopMoves(pieces, from, boardSize);
      break;
    case 'N':
      pseudoLegalMoves = getKnightMoves(pieces, from, boardSize);
      break;
    case 'P':
      pseudoLegalMoves = getPawnMoves(pieces, from, boardSize);
      break;
  }
  
  // Filter out moves that would leave own king in check
  if (checkForCheck) {
    pseudoLegalMoves = pseudoLegalMoves.filter(to => {
      const newPieces = makeMove(pieces, from, to);
      return !isKingInCheck(newPieces, piece.color, boardSize);
    });
  }
  
  return pseudoLegalMoves;
}

/**
 * King moves: 1 step in any direction
 * Horizontal moves change x, vertical moves change y
 */
function getKingMoves(pieces: Piece[], from: Square, boardSize: number): Square[] {
  const [x, y] = from;
  const piece = getPieceAt(pieces, from);
  if (!piece) return [];
  
  // dx changes x (horizontal), dy changes y (vertical)
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1],
  ];
  
  const moves: Square[] = [];
  
  for (const [dx, dy] of directions) {
    const to: Square = [x + dx, y + dy];
    if (isValidSquare(to, boardSize)) {
      const targetPiece = getPieceAt(pieces, to);
      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push(to);
      }
    }
  }
  
  return moves;
}

/**
 * Queen moves: sliding in all 8 directions
 */
function getQueenMoves(pieces: Piece[], from: Square, boardSize: number): Square[] {
  return [...getRookMoves(pieces, from, boardSize), ...getBishopMoves(pieces, from, boardSize)];
}

/**
 * Rook moves: sliding horizontally and vertically
 * Horizontal: dx changes, dy=0
 * Vertical: dx=0, dy changes
 */
function getRookMoves(pieces: Piece[], from: Square, boardSize: number): Square[] {
  const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  return getSlidingMoves(pieces, from, directions, boardSize);
}

/**
 * Bishop moves: sliding diagonally
 * Diagonals: both dx and dy change
 */
function getBishopMoves(pieces: Piece[], from: Square, boardSize: number): Square[] {
  const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  return getSlidingMoves(pieces, from, directions, boardSize);
}

/**
 * Helper for sliding pieces (Queen, Rook, Bishop)
 * Directions are [dx, dy] where dx changes x, dy changes y
 */
function getSlidingMoves(
  pieces: Piece[],
  from: Square,
  directions: number[][],
  boardSize: number
): Square[] {
  const [x, y] = from;
  const piece = getPieceAt(pieces, from);
  if (!piece) return [];
  
  const moves: Square[] = [];
  
  for (const [dx, dy] of directions) {
    let nx = x + dx;
    let ny = y + dy;
    
    while (isValidSquare([nx, ny], boardSize)) {
      const targetPiece = getPieceAt(pieces, [nx, ny]);
      
      if (!targetPiece) {
        moves.push([nx, ny]);
      } else {
        if (targetPiece.color !== piece.color) {
          moves.push([nx, ny]);
        }
        break; // Blocked by piece
      }
      
      nx += dx;
      ny += dy;
    }
  }
  
  return moves;
}

/**
 * Knight moves: L-shape
 */
function getKnightMoves(pieces: Piece[], from: Square, boardSize: number): Square[] {
  const [x, y] = from;
  const piece = getPieceAt(pieces, from);
  if (!piece) return [];
  
  const offsets = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2],  [1, 2],  [2, -1],  [2, 1],
  ];
  
  const moves: Square[] = [];
  
  for (const [dx, dy] of offsets) {
    const to: Square = [x + dx, y + dy];
    if (isValidSquare(to, boardSize)) {
      const targetPiece = getPieceAt(pieces, to);
      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push(to);
      }
    }
  }
  
  return moves;
}

/**
 * Pawn moves: forward 1, diagonal capture, optional 2-step from starting rank
 * White pawns: y+1 (forward)
 * Black pawns: y-1 (forward)
 */
function getPawnMoves(pieces: Piece[], from: Square, boardSize: number): Square[] {
  const [x, y] = from;
  const piece = getPieceAt(pieces, from);
  if (!piece) return [];
  
  const moves: Square[] = [];
  const direction = piece.color === 'w' ? 1 : -1; // White: y+1, Black: y-1
  const startRank = piece.color === 'w' ? 1 : boardSize - 2;
  
  // Forward 1 square (vertical: y changes)
  const forward1: Square = [x, y + direction];
  if (isValidSquare(forward1, boardSize) && !getPieceAt(pieces, forward1)) {
    moves.push(forward1);
    
    // Forward 2 squares from starting rank
    if (y === startRank) {
      const forward2: Square = [x, y + 2 * direction];
      if (isValidSquare(forward2, boardSize) && !getPieceAt(pieces, forward2)) {
        moves.push(forward2);
      }
    }
  }
  
  // Diagonal captures (both x and y change)
  const captureOffsets = [[-1, direction], [1, direction]];
  for (const [dx, dy] of captureOffsets) {
    const to: Square = [x + dx, y + dy];
    if (isValidSquare(to, boardSize)) {
      const targetPiece = getPieceAt(pieces, to);
      if (targetPiece && targetPiece.color !== piece.color) {
        moves.push(to);
      }
    }
  }
  
  return moves;
}

/**
 * Make a move and return new piece array
 * from and to are [x, y] coordinates
 */
export function makeMove(
  pieces: Piece[],
  from: Square,
  to: Square,
  promo?: PieceType
): Piece[] {
  const piece = getPieceAt(pieces, from);
  if (!piece) return pieces;
  
  // Remove captured piece and moving piece
  let newPieces = pieces.filter(
    p => !(p.x === to[0] && p.y === to[1]) && !(p.x === from[0] && p.y === from[1])
  );
  
  // Determine final piece type (handle promotion)
  let finalType = piece.type;
  if (promo) {
    finalType = promo;
  }
  
  // Add moved piece at new position
  newPieces.push({
    ...piece,
    type: finalType,
    x: to[0],
    y: to[1],
  });
  
  return newPieces;
}

/**
 * Check if pawn is on promotion rank
 */
export function needsPromotion(piece: Piece, boardSize: number): boolean {
  if (piece.type !== 'P') return false;
  
  const promotionRank = piece.color === 'w' ? boardSize - 1 : 0;
  return piece.y === promotionRank;
}

/**
 * Get the square [x, y] of a king
 */
export function getKingSquare(pieces: Piece[], color: PieceColor): Square | null {
  const king = pieces.find(p => p.type === 'K' && p.color === color);
  return king ? [king.x, king.y] : null;
}

/**
 * Check if a side is checkmated
 */
export function isCheckmate(
  pieces: Piece[],
  kingColor: PieceColor,
  boardSize: number
): boolean {
  // Must be in check
  if (!isKingInCheck(pieces, kingColor, boardSize)) {
    return false;
  }
  
  // Check if any piece of this color has a legal move
  const colorPieces = pieces.filter(p => p.color === kingColor);
  for (const piece of colorPieces) {
    const legalMoves = getLegalMovesForPiece(pieces, [piece.x, piece.y], boardSize, true);
    if (legalMoves.length > 0) {
      return false; // Has at least one legal move, not checkmate
    }
  }
  
  return true; // In check and no legal moves = checkmate
}

/**
 * Dev self-test: Verify King moves on empty 8x8 board
 * King at [3,3] should have 8 legal moves including [2,3] and [3,2]
 */
export function runChessLogicSelfTest(): { passed: boolean; message: string } {
  const size = 8;
  const whiteKing: Piece = { type: 'K', color: 'w', x: 3, y: 3 };
  const pieces: Piece[] = [whiteKing];
  
  const legalMoves = getLegalMovesForPiece(pieces, [3, 3], size, false);
  
  // Expected 8 moves for a king in the center of an empty board
  const expectedMoves: Square[] = [
    [2, 2], [3, 2], [4, 2],
    [2, 3],         [4, 3],
    [2, 4], [3, 4], [4, 4],
  ];
  
  if (legalMoves.length !== 8) {
    return {
      passed: false,
      message: `King self-test FAILED: Expected 8 moves, got ${legalMoves.length}. Moves: ${JSON.stringify(legalMoves)}`,
    };
  }
  
  // Check for specific required moves
  const has_2_3 = legalMoves.some(m => m[0] === 2 && m[1] === 3);
  const has_3_2 = legalMoves.some(m => m[0] === 3 && m[1] === 2);
  
  if (!has_2_3 || !has_3_2) {
    return {
      passed: false,
      message: `King self-test FAILED: Missing required moves [2,3] or [3,2]. Moves: ${JSON.stringify(legalMoves)}`,
    };
  }
  
  // Verify all expected moves are present
  for (const expected of expectedMoves) {
    const found = legalMoves.some(m => m[0] === expected[0] && m[1] === expected[1]);
    if (!found) {
      return {
        passed: false,
        message: `King self-test FAILED: Missing expected move [${expected[0]},${expected[1]}]. Moves: ${JSON.stringify(legalMoves)}`,
      };
    }
  }
  
  return {
    passed: true,
    message: 'King self-test PASSED: All 8 moves correct including [2,3] and [3,2]',
  };
}
</write file>

<write file="utils/puzzleValidator.ts">
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

    // Verify piece exists at from square
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

    // Get legal moves for this piece
    const legalMoves = getLegalMovesForPiece(
      currentPieces,
      move.from,
      puzzle.size,
      true
    );

    // Store legal moves for debugging
    failingMoveLegalMoves = legalMoves;

    // Verify the move is legal
    const isLegal = legalMoves.some(
      m => m[0] === move.to[0] && m[1] === move.to[1]
    );

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

    // Execute the move using the standardized applyMove
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
            `  Legal moves for that position: ${JSON.stringify(result.failingMoveLegalMoves)}`
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
</write file>

Now I need to update the ChessBoard component to ensure the coordinate conversion is correct:

<write file="components/ChessBoard.tsx">
import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Piece } from '@/data/types';
import { Square } from '@/utils/chessLogic';
import { PieceIcon } from './PieceIcon';

interface ChessBoardProps {
  size: 4 | 5 | 6 | 8;
  pieces: Piece[];
  selectedSquare: Square | null;
  legalMoves: Square[];
  lastMove: { from: Square; to: Square } | null;
  checkedKingSquare: Square | null;
  onSquarePress: (square: Square) => void;
}

export function ChessBoard({
  size,
  pieces,
  selectedSquare,
  legalMoves,
  lastMove,
  checkedKingSquare,
  onSquarePress,
}: ChessBoardProps) {
  const screenWidth = Dimensions.get('window').width;
  const boardPadding = 32;
  const boardWidth = Math.min(screenWidth - boardPadding, 400);
  const squareSize = boardWidth / size;

  // Create a 2D grid to place pieces
  // Grid is indexed as grid[row][col] where row 0 is top of screen
  // We need to map chess coordinates [x,y] to display coordinates
  // Chess: (0,0) = bottom-left, x=column, y=row
  // Display: (0,0) = top-left, row increases downward
  const grid: (Piece | null)[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));

  pieces.forEach(piece => {
    // piece.x = column (0 to size-1, left to right)
    // piece.y = row (0 to size-1, bottom to top in chess)
    // Display row: 0 = top, size-1 = bottom
    // Chess y=0 should map to display row size-1 (bottom)
    // Chess y=size-1 should map to display row 0 (top)
    const displayRow = size - 1 - piece.y;
    const displayCol = piece.x;

    if (displayRow >= 0 && displayRow < size && displayCol >= 0 && displayCol < size) {
      grid[displayRow][displayCol] = piece;
    }
  });

  // Helper to check if a square is highlighted
  // Input: display row/col, need to convert to chess [x,y]
  const isSquareSelected = (row: number, col: number): boolean => {
    if (!selectedSquare) return false;
    const chessX = col;
    const chessY = size - 1 - row;
    return selectedSquare[0] === chessX && selectedSquare[1] === chessY;
  };

  const isSquareLegalMove = (row: number, col: number): boolean => {
    const chessX = col;
    const chessY = size - 1 - row;
    return legalMoves.some(m => m[0] === chessX && m[1] === chessY);
  };

  const isSquareLastMoveFrom = (row: number, col: number): boolean => {
    if (!lastMove) return false;
    const chessX = col;
    const chessY = size - 1 - row;
    return lastMove.from[0] === chessX && lastMove.from[1] === chessY;
  };

  const isSquareLastMoveTo = (row: number, col: number): boolean => {
    if (!lastMove) return false;
    const chessX = col;
    const chessY = size - 1 - row;
    return lastMove.to[0] === chessX && lastMove.to[1] === chessY;
  };

  const isSquareCheckedKing = (row: number, col: number): boolean => {
    if (!checkedKingSquare) return false;
    const chessX = col;
    const chessY = size - 1 - row;
    return checkedKingSquare[0] === chessX && checkedKingSquare[1] === chessY;
  };

  const handleSquarePress = (row: number, col: number) => {
    // Convert display coordinates to chess coordinates [x, y]
    const chessX = col;
    const chessY = size - 1 - row;
    onSquarePress([chessX, chessY]);
  };

  return (
    <View style={[styles.board, { width: boardWidth, height: boardWidth }]}>
      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((piece, colIndex) => {
            const isLight = (rowIndex + colIndex) % 2 === 0;
            const baseColor = isLight ? '#f0d9b5' : '#b58863';

            const selected = isSquareSelected(rowIndex, colIndex);
            const legalMove = isSquareLegalMove(rowIndex, colIndex);
            const lastMoveFrom = isSquareLastMoveFrom(rowIndex, colIndex);
            const lastMoveTo = isSquareLastMoveTo(rowIndex, colIndex);
            const checkedKing = isSquareCheckedKing(rowIndex, colIndex);

            let backgroundColor = baseColor;
            if (selected) {
              backgroundColor = '#baca44';
            } else if (lastMoveFrom || lastMoveTo) {
              backgroundColor = isLight ? '#cdd26a' : '#aaa23a';
            }

            return (
              <TouchableOpacity
                key={colIndex}
                style={[
                  styles.square,
                  { width: squareSize, height: squareSize, backgroundColor },
                  checkedKing && styles.checkedKingSquare,
                ]}
                onPress={() => handleSquarePress(rowIndex, colIndex)}
                activeOpacity={0.7}
              >
                {piece ? (
                  <PieceIcon type={piece.type} color={piece.color} size={squareSize} />
                ) : null}
                {legalMove && (
                  <View
                    style={[
                      styles.legalMoveDot,
                      {
                        width: squareSize * 0.3,
                        height: squareSize * 0.3,
                        borderRadius: squareSize * 0.15,
                      },
                      piece && styles.legalMoveCapture,
                    ]}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    borderWidth: 2,
    borderColor: '#334155',
    borderRadius: 8,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  square: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  legalMoveDot: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  legalMoveCapture: {
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: 'rgba(0, 0, 0, 0.3)',
  },
  checkedKingSquare: {
    borderWidth: 3,
    borderColor: '#ef4444',
  },
});
</write file>

Now I need to update the main app file to display the enhanced debug information. Let me read the current app/index.tsx to see how the debug panel is implemented:Now I need to update the debug panel to show the enhanced validation information including self-test results and detailed failing move information:

<write file="app/index.tsx">
import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Modal,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ContentStore } from '@/data/ContentStore';
import { Puzzle, Filters, Piece, Turn, LineMove } from '@/data/types';
import { usePuzzleProgress } from '@/hooks/usePuzzleProgress';
import { useAppSettings } from '@/hooks/useAppSettings';
import { PuzzleCard } from '@/components/PuzzleCard';
import { FilterBar } from '@/components/FilterBar';
import { ChessBoard } from '@/components/ChessBoard';
import { IconSymbol } from '@/components/IconSymbol';
import {
  Square,
  getPieceAt,
  getLegalMovesForPiece,
  makeMove,
  isKingInCheck,
  getKingSquare,
  needsPromotion,
} from '@/utils/chessLogic';
import { validateAllPuzzles, ValidationReport } from '@/utils/puzzleValidator';
import { BUILT_IN_PUZZLES } from '@/data/builtInPuzzles';

type ViewState = 'library' | 'play' | 'debug';

interface GameState {
  pieces: Piece[];
  turn: Turn;
  selectedSquare: Square | null;
  legalMoves: Square[];
  lastMove: { from: Square; to: Square } | null;
  lineIndex: number;
  isSolved: boolean;
  history: HistoryEntry[];
}

interface HistoryEntry {
  pieces: Piece[];
  turn: Turn;
  lastMove: { from: Square; to: Square } | null;
  lineIndex: number;
}

export default function PocketPuzzlesApp() {
  const [viewState, setViewState] = useState<ViewState>('library');
  const [selectedPuzzleId, setSelectedPuzzleId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({});
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);

  // Game state
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showSolvedModal, setShowSolvedModal] = useState(false);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [pendingPromotion, setPendingPromotion] = useState<{
    from: Square;
    to: Square;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Animation for board shake
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const { getProgress, markSolved, incrementAttempts, loading: progressLoading } = usePuzzleProgress();
  const { settings, setLastPlayedPuzzle } = useAppSettings();

  // Run validator in dev mode on app start
  useEffect(() => {
    if (__DEV__) {
      console.log('PocketPuzzlesApp: Running puzzle validator in dev mode');
      const report = validateAllPuzzles(BUILT_IN_PUZZLES);
      setValidationReport(report);

      if (report.failedCount > 0) {
        console.error(
          `PocketPuzzlesApp: ${report.failedCount} puzzle(s) failed validation. Check Debug panel for details.`
        );
      } else {
        console.log('PocketPuzzlesApp: All puzzles passed validation ✓');
      }
    }
  }, []);

  // Get filtered puzzles
  const puzzles = useMemo(() => {
    console.log('PocketPuzzlesApp: Applying filters to puzzle list');
    return ContentStore.applyFilters(filters);
  }, [filters]);

  // Get selected puzzle
  const selectedPuzzle = useMemo(() => {
    if (!selectedPuzzleId) return null;
    return ContentStore.getPuzzleById(selectedPuzzleId);
  }, [selectedPuzzleId]);

  // Initialize game state when puzzle is selected
  useEffect(() => {
    if (selectedPuzzle && viewState === 'play') {
      console.log('PocketPuzzlesApp: Initializing game state for puzzle:', selectedPuzzle.id);
      initializeGameState(selectedPuzzle);
    }
  }, [selectedPuzzle, viewState]);

  const initializeGameState = (puzzle: Puzzle) => {
    setGameState({
      pieces: JSON.parse(JSON.stringify(puzzle.pieces)),
      turn: puzzle.turn,
      selectedSquare: null,
      legalMoves: [],
      lastMove: null,
      lineIndex: 0,
      isSolved: false,
      history: [],
    });
    setShowSolvedModal(false);
    setErrorMessage(null);
  };

  const handlePlayPuzzle = async (puzzle: Puzzle) => {
    console.log('PocketPuzzlesApp: User selected puzzle:', puzzle.id);
    setSelectedPuzzleId(puzzle.id);
    setViewState('play');
    await setLastPlayedPuzzle(puzzle.id);
  };

  const handleBackToLibrary = () => {
    console.log('PocketPuzzlesApp: Returning to library');
    setViewState('library');
    setSelectedPuzzleId(null);
    setGameState(null);
  };

  const handleRestart = async () => {
    console.log('PocketPuzzlesApp: Restarting puzzle');
    if (selectedPuzzle) {
      await incrementAttempts(selectedPuzzle.id);
      initializeGameState(selectedPuzzle);
      triggerHaptic('light');
    }
  };

  const handleUndo = () => {
    console.log('PocketPuzzlesApp: Undo move');
    if (!gameState || gameState.history.length === 0) {
      console.log('PocketPuzzlesApp: No history to undo');
      return;
    }

    const lastEntry = gameState.history[gameState.history.length - 1];
    setGameState({
      ...lastEntry,
      history: gameState.history.slice(0, -1),
      selectedSquare: null,
      legalMoves: [],
      isSolved: false,
    });
    setShowSolvedModal(false);
    setErrorMessage(null);
    triggerHaptic('light');
  };

  const handleSquarePress = (square: Square) => {
    if (!gameState || !selectedPuzzle || gameState.isSolved) return;

    console.log('PocketPuzzlesApp: Square pressed:', square);

    const piece = getPieceAt(gameState.pieces, square);

    // If no piece is selected
    if (!gameState.selectedSquare) {
      // Select piece if it matches the side to move
      if (piece && piece.color === gameState.turn) {
        const legalMoves = getLegalMovesForPiece(
          gameState.pieces,
          square,
          selectedPuzzle.size,
          true
        );
        console.log('PocketPuzzlesApp: Selected piece, legal moves:', legalMoves.length);
        setGameState({
          ...gameState,
          selectedSquare: square,
          legalMoves,
        });
        triggerHaptic('light');
      } else {
        console.log('PocketPuzzlesApp: Cannot select piece (wrong color or no piece)');
        triggerHaptic('error');
      }
      return;
    }

    // If a piece is already selected
    const selectedPiece = getPieceAt(gameState.pieces, gameState.selectedSquare);
    if (!selectedPiece) return;

    // If clicking the same square, deselect
    if (square[0] === gameState.selectedSquare[0] && square[1] === gameState.selectedSquare[1]) {
      console.log('PocketPuzzlesApp: Deselecting piece');
      setGameState({
        ...gameState,
        selectedSquare: null,
        legalMoves: [],
      });
      return;
    }

    // If clicking another piece of the same color, select it instead
    if (piece && piece.color === gameState.turn) {
      const legalMoves = getLegalMovesForPiece(
        gameState.pieces,
        square,
        selectedPuzzle.size,
        true
      );
      console.log('PocketPuzzlesApp: Switched selection, legal moves:', legalMoves.length);
      setGameState({
        ...gameState,
        selectedSquare: square,
        legalMoves,
      });
      triggerHaptic('light');
      return;
    }

    // Check if the move is legal
    const isLegal = gameState.legalMoves.some(m => m[0] === square[0] && m[1] === square[1]);
    if (!isLegal) {
      console.log('PocketPuzzlesApp: Illegal move');
      setErrorMessage('Illegal move');
      shakeBoard();
      triggerHaptic('error');
      setTimeout(() => setErrorMessage(null), 1500);
      return;
    }

    // Check if pawn needs promotion
    const movedPiece = getPieceAt(gameState.pieces, gameState.selectedSquare);
    if (movedPiece && movedPiece.type === 'P') {
      const promotionRank = movedPiece.color === 'w' ? selectedPuzzle.size - 1 : 0;
      if (square[1] === promotionRank) {
        console.log('PocketPuzzlesApp: Pawn promotion required');
        setPendingPromotion({ from: gameState.selectedSquare, to: square });
        setShowPromotionModal(true);
        return;
      }
    }

    // Execute the move
    executeMove(gameState.selectedSquare, square);
  };

  const executeMove = (from: Square, to: Square, promo?: 'Q' | 'R' | 'B' | 'N') => {
    if (!gameState || !selectedPuzzle) return;

    console.log('PocketPuzzlesApp: Executing move from', from, 'to', to, 'promo:', promo);

    // Check if move matches the puzzle line
    const expectedMove = selectedPuzzle.line[gameState.lineIndex];
    const moveMatches =
      expectedMove &&
      expectedMove.side === gameState.turn &&
      expectedMove.from[0] === from[0] &&
      expectedMove.from[1] === from[1] &&
      expectedMove.to[0] === to[0] &&
      expectedMove.to[1] === to[1] &&
      (expectedMove.promo === promo || (!expectedMove.promo && !promo));

    if (!moveMatches) {
      console.log('PocketPuzzlesApp: Move does not match puzzle line');
      setErrorMessage('Try again');
      shakeBoard();
      triggerHaptic('error');
      setTimeout(() => setErrorMessage(null), 1500);

      // Reset on wrong move if specified
      if (selectedPuzzle.resetOnWrong) {
        console.log('PocketPuzzlesApp: Resetting puzzle due to wrong move');
        setTimeout(() => {
          incrementAttempts(selectedPuzzle.id);
          initializeGameState(selectedPuzzle);
        }, 1000);
      } else {
        setGameState({
          ...gameState,
          selectedSquare: null,
          legalMoves: [],
        });
      }
      return;
    }

    // Move is correct - execute it
    const newPieces = makeMove(gameState.pieces, from, to, promo);
    const newTurn: Turn = gameState.turn === 'w' ? 'b' : 'w';
    const newLineIndex = gameState.lineIndex + 1;

    // Save to history
    const newHistory: HistoryEntry[] = [
      ...gameState.history,
      {
        pieces: gameState.pieces,
        turn: gameState.turn,
        lastMove: gameState.lastMove,
        lineIndex: gameState.lineIndex,
      },
    ];

    setGameState({
      pieces: newPieces,
      turn: newTurn,
      selectedSquare: null,
      legalMoves: [],
      lastMove: { from, to },
      lineIndex: newLineIndex,
      isSolved: false,
      history: newHistory,
    });

    triggerHaptic('light');
    console.log('PocketPuzzlesApp: Move executed, new lineIndex:', newLineIndex);

    // Check if puzzle is solved
    if (newLineIndex >= selectedPuzzle.line.length) {
      console.log('PocketPuzzlesApp: Puzzle solved!');
      setTimeout(() => {
        setGameState(prev => (prev ? { ...prev, isSolved: true } : null));
        setShowSolvedModal(true);
        markSolved(selectedPuzzle.id);
        triggerHaptic('success');
      }, 300);
      return;
    }

    // Auto-play opponent move if next move is opponent's
    const nextMove = selectedPuzzle.line[newLineIndex];
    if (nextMove && nextMove.side !== gameState.turn) {
      console.log('PocketPuzzlesApp: Auto-playing opponent move');
      setTimeout(() => {
        autoPlayMove(newPieces, newTurn, nextMove, newLineIndex, newHistory);
      }, 300);
    }
  };

  const autoPlayMove = (
    pieces: Piece[],
    turn: Turn,
    move: LineMove,
    lineIndex: number,
    history: HistoryEntry[]
  ) => {
    if (!selectedPuzzle) return;

    console.log('PocketPuzzlesApp: Auto-playing move:', move);

    const newPieces = makeMove(pieces, move.from, move.to, move.promo);
    const newTurn: Turn = turn === 'w' ? 'b' : 'w';
    const newLineIndex = lineIndex + 1;

    const newHistory: HistoryEntry[] = [
      ...history,
      {
        pieces,
        turn,
        lastMove: { from: move.from, to: move.to },
        lineIndex,
      },
    ];

    setGameState({
      pieces: newPieces,
      turn: newTurn,
      selectedSquare: null,
      legalMoves: [],
      lastMove: { from: move.from, to: move.to },
      lineIndex: newLineIndex,
      isSolved: false,
      history: newHistory,
    });

    triggerHaptic('light');

    // Check if puzzle is solved after auto-play
    if (newLineIndex >= selectedPuzzle.line.length) {
      console.log('PocketPuzzlesApp: Puzzle solved after auto-play!');
      setTimeout(() => {
        setGameState(prev => (prev ? { ...prev, isSolved: true } : null));
        setShowSolvedModal(true);
        markSolved(selectedPuzzle.id);
        triggerHaptic('success');
      }, 300);
    }
  };

  const handlePromotion = (promoType: 'Q' | 'R' | 'B' | 'N') => {
    console.log('PocketPuzzlesApp: Promotion selected:', promoType);
    setShowPromotionModal(false);
    if (pendingPromotion) {
      executeMove(pendingPromotion.from, pendingPromotion.to, promoType);
      setPendingPromotion(null);
    }
  };

  const shakeBoard = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const triggerHaptic = (type: 'light' | 'error' | 'success') => {
    if (!settings.hapticsEnabled) return;

    switch (type) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'error':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
    }
  };

  const handleNextPuzzle = () => {
    console.log('PocketPuzzlesApp: Next puzzle');
    setShowSolvedModal(false);
    const currentIndex = puzzles.findIndex(p => p.id === selectedPuzzleId);
    if (currentIndex >= 0 && currentIndex < puzzles.length - 1) {
      const nextPuzzle = puzzles[currentIndex + 1];
      handlePlayPuzzle(nextPuzzle);
    } else {
      handleBackToLibrary();
    }
  };

  // Helper to format objective text (always "Mate in X")
  const formatObjective = (puzzle: Puzzle): string => {
    const depthText = puzzle.objective.depth;
    return `Mate in ${depthText}`;
  };

  // Helper to format side to move
  const formatSideToMove = (turn: 'w' | 'b'): string => {
    return turn === 'w' ? 'White' : 'Black';
  };

  // Get checked king square
  const checkedKingSquare = useMemo(() => {
    if (!gameState || !selectedPuzzle) return null;
    const isInCheck = isKingInCheck(gameState.pieces, gameState.turn, selectedPuzzle.size);
    if (isInCheck) {
      return getKingSquare(gameState.pieces, gameState.turn);
    }
    return null;
  }, [gameState, selectedPuzzle]);

  if (progressLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading puzzles...</Text>
      </View>
    );
  }

  // Debug View
  if (viewState === 'debug' && validationReport) {
    const passedText = `${validationReport.passedCount} passed`;
    const failedText = `${validationReport.failedCount} failed`;
    const totalText = `${validationReport.totalPuzzles} total`;
    const selfTestPassed = validationReport.selfTestResult.passed;
    const selfTestMessage = validationReport.selfTestResult.message;

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={[styles.header, Platform.OS === 'android' && { paddingTop: 48 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => setViewState('library')}>
            <IconSymbol
              ios_icon_name="chevron.left"
              android_material_icon_name="arrow-back"
              size={24}
              color="#f1f5f9"
            />
            <Text style={styles.backButtonText}>Library</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Debug: Puzzle Validator</Text>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.debugCard}>
            <Text style={styles.debugTitle}>Self-Test Result</Text>
            <Text style={[styles.debugText, { color: selfTestPassed ? '#10b981' : '#ef4444' }]}>
              {selfTestMessage}
            </Text>
          </View>

          <View style={styles.debugCard}>
            <Text style={styles.debugTitle}>Validation Summary</Text>
            <Text style={styles.debugText}>{totalText}</Text>
            <Text style={[styles.debugText, { color: '#10b981' }]}>{passedText}</Text>
            <Text style={[styles.debugText, { color: '#ef4444' }]}>{failedText}</Text>
          </View>

          {validationReport.results
            .filter(r => !r.passed)
            .map(result => {
              const failingMoveText = result.failingMoveIndex !== undefined
                ? `Failing move index: ${result.failingMoveIndex}`
                : '';
              const legalMovesText = result.failingMoveLegalMoves
                ? `Legal moves: ${JSON.stringify(result.failingMoveLegalMoves)}`
                : '';

              return (
                <View key={result.puzzleId} style={styles.errorCard}>
                  <Text style={styles.errorTitle}>Puzzle: {result.puzzleId}</Text>
                  {result.errors.map((error, index) => (
                    <Text key={index} style={styles.errorText}>
                      • {error}
                    </Text>
                  ))}
                  {failingMoveText ? (
                    <Text style={styles.errorDetailText}>{failingMoveText}</Text>
                  ) : null}
                  {legalMovesText ? (
                    <Text style={styles.errorDetailText}>{legalMovesText}</Text>
                  ) : null}
                </View>
              );
            })}

          {validationReport.failedCount === 0 && (
            <View style={styles.successCard}>
              <Text style={styles.successText}>✓ All puzzles passed validation!</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Library View
  if (viewState === 'library') {
    const puzzleCount = puzzles.length;
    const puzzleCountText = `${puzzleCount} puzzle${puzzleCount !== 1 ? 's' : ''}`;

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={[styles.header, Platform.OS === 'android' && { paddingTop: 48 }]}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>Pocket Puzzles</Text>
              <Text style={styles.headerSubtitle}>Checkmate challenges</Text>
            </View>
            {__DEV__ && validationReport && (
              <TouchableOpacity
                style={styles.debugButton}
                onPress={() => setViewState('debug')}
              >
                <IconSymbol
                  ios_icon_name="wrench.fill"
                  android_material_icon_name="settings"
                  size={20}
                  color="#f1f5f9"
                />
                <Text style={styles.debugButtonText}>Debug</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <FilterBar filters={filters} onFilterChange={setFilters} />

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>{puzzleCountText}</Text>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {puzzles.map(puzzle => {
            const progress = getProgress(puzzle.id);
            return (
              <PuzzleCard
                key={puzzle.id}
                puzzle={puzzle}
                solved={progress.solved}
                onPress={() => handlePlayPuzzle(puzzle)}
              />
            );
          })}

          {puzzles.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No puzzles match your filters</Text>
              <TouchableOpacity onPress={() => setFilters({})}>
                <Text style={styles.emptyStateButton}>Clear Filters</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Play View
  if (viewState === 'play' && selectedPuzzle && gameState) {
    const sideToMoveText = formatSideToMove(gameState.turn);
    const objectiveText = formatObjective(selectedPuzzle);
    const noteText = selectedPuzzle.objective.note || '';
    const canUndo = gameState.history.length > 0;

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={[styles.playHeader, Platform.OS === 'android' && { paddingTop: 48 }]}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToLibrary}>
            <IconSymbol
              ios_icon_name="chevron.left"
              android_material_icon_name="arrow-back"
              size={24}
              color="#f1f5f9"
            />
            <Text style={styles.backButtonText}>Library</Text>
          </TouchableOpacity>

          <View style={styles.playHeaderInfo}>
            <Text style={styles.playTitle}>{selectedPuzzle.title}</Text>
            <Text style={styles.playPack}>{selectedPuzzle.pack}</Text>
          </View>
        </View>

        <ScrollView style={styles.playScrollView} contentContainerStyle={styles.playScrollContent}>
          <View style={styles.objectiveCard}>
            <View style={styles.objectiveRow}>
              <Text style={styles.objectiveLabel}>Side to move:</Text>
              <Text style={styles.objectiveValue}>{sideToMoveText}</Text>
            </View>
            <View style={styles.objectiveRow}>
              <Text style={styles.objectiveLabel}>Objective:</Text>
              <Text style={styles.objectiveValue}>{objectiveText}</Text>
            </View>
            {noteText ? <Text style={styles.objectiveNote}>{noteText}</Text> : null}
          </View>

          <Animated.View
            style={[
              styles.boardContainer,
              { transform: [{ translateX: shakeAnimation }] },
            ]}
          >
            <ChessBoard
              size={selectedPuzzle.size}
              pieces={gameState.pieces}
              selectedSquare={gameState.selectedSquare}
              legalMoves={gameState.legalMoves}
              lastMove={gameState.lastMove}
              checkedKingSquare={checkedKingSquare}
              onSquarePress={handleSquarePress}
            />
          </Animated.View>

          {errorMessage && (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlButton} onPress={handleRestart}>
              <IconSymbol
                ios_icon_name="arrow.clockwise"
                android_material_icon_name="refresh"
                size={20}
                color="#f1f5f9"
              />
              <Text style={styles.controlButtonText}>Restart</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, !canUndo && styles.controlButtonDisabled]}
              onPress={handleUndo}
              disabled={!canUndo}
            >
              <IconSymbol
                ios_icon_name="arrow.uturn.backward"
                android_material_icon_name="undo"
                size={20}
                color={canUndo ? '#f1f5f9' : '#64748b'}
              />
              <Text
                style={[
                  styles.controlButtonText,
                  !canUndo && styles.controlButtonTextDisabled,
                ]}
              >
                Undo
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.hintCard}>
            <Text style={styles.hintText}>
              Tap on a piece to select it, then tap on a destination square to move.
            </Text>
          </View>
        </ScrollView>

        {/* Solved Modal */}
        <Modal
          visible={showSolvedModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSolvedModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Puzzle Solved! 🎉</Text>
              <Text style={styles.modalText}>
                Congratulations! You completed the puzzle.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleBackToLibrary}
                >
                  <Text style={styles.modalButtonText}>Back to Library</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={handleNextPuzzle}
                >
                  <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>
                    Next Puzzle
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Promotion Modal */}
        <Modal
          visible={showPromotionModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPromotionModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Promote Pawn</Text>
              <Text style={styles.modalText}>Choose a piece:</Text>
              <View style={styles.promotionButtons}>
                <TouchableOpacity
                  style={styles.promotionButton}
                  onPress={() => handlePromotion('Q')}
                >
                  <Text style={styles.promotionButtonText}>Queen</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.promotionButton}
                  onPress={() => handlePromotion('R')}
                >
                  <Text style={styles.promotionButtonText}>Rook</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.promotionButton}
                  onPress={() => handlePromotion('B')}
                >
                  <Text style={styles.promotionButtonText}>Bishop</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.promotionButton}
                  onPress={() => handlePromotion('N')}
                >
                  <Text style={styles.promotionButtonText}>Knight</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#94a3b8',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
  },
  debugButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  debugButtonText: {
    fontSize: 14,
    color: '#f1f5f9',
    fontWeight: '600',
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 16,
  },
  emptyStateButton: {
    fontSize: 16,
    color: '#60a5fa',
    fontWeight: '600',
  },
  playHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#f1f5f9',
    marginLeft: 4,
    fontWeight: '600',
  },
  playHeaderInfo: {
    marginLeft: 28,
  },
  playTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 2,
  },
  playPack: {
    fontSize: 14,
    color: '#94a3b8',
  },
  playScrollView: {
    flex: 1,
  },
  playScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  objectiveCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  objectiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  objectiveLabel: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 8,
  },
  objectiveValue: {
    fontSize: 16,
    color: '#f1f5f9',
    fontWeight: '700',
  },
  objectiveNote: {
    fontSize: 14,
    color: '#e2e8f0',
    fontStyle: 'italic',
    marginTop: 4,
  },
  boardContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  errorCard: {
    backgroundColor: '#7f1d1d',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#991b1b',
  },
  errorText: {
    fontSize: 16,
    color: '#fca5a5',
    textAlign: 'center',
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  controlButtonDisabled: {
    backgroundColor: '#1e293b',
  },
  controlButtonText: {
    fontSize: 16,
    color: '#f1f5f9',
    fontWeight: '600',
  },
  controlButtonTextDisabled: {
    color: '#64748b',
  },
  hintCard: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  hintText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#334155',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#3b82f6',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#f1f5f9',
    fontWeight: '600',
  },
  modalButtonTextPrimary: {
    color: '#ffffff',
  },
  promotionButtons: {
    gap: 12,
  },
  promotionButton: {
    backgroundColor: '#334155',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  promotionButtonText: {
    fontSize: 18,
    color: '#f1f5f9',
    fontWeight: '600',
  },
  debugCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  debugTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 12,
  },
  debugText: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 4,
  },
  successCard: {
    backgroundColor: '#064e3b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  successText: {
    fontSize: 18,
    color: '#10b981',
    fontWeight: '700',
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fca5a5',
    marginBottom: 8,
  },
  errorDetailText: {
    fontSize: 12,
    color: '#fca5a5',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
