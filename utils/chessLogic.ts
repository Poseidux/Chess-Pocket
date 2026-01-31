
/**
 * Chess Engine - Standardized Implementation
 * 
 * COORDINATE CONVENTION:
 * - All squares are [x, y] where:
 *   - x increases to the right (0 = leftmost column)
 *   - y increases upward (0 = bottom row from White's perspective)
 *   - (0,0) is bottom-left from White's perspective
 * - If using 2D arrays, MUST be indexed as board[y][x]
 * 
 * RULES:
 * - No castling, no en-passant
 * - King: 1 step in any direction
 * - Queen/Rook/Bishop: sliding rays until blocked
 * - Knight: L-shape
 * - Pawn: forward 1 if empty, diagonal capture, optional 2-step from starting rank
 *   - White: forward = y+1, starting rank y==1
 *   - Black: forward = y-1, starting rank y==size-2
 *   - Promotion when reaching last rank (white y==size-1, black y==0)
 * - Checkmate: side to move is in check AND has no legal moves
 */

import { Piece, PieceType, PieceColor } from '@/data/types';

export type Coord = [number, number];

/**
 * Move interface matching LineMove structure
 */
export interface Move {
  from: Coord;
  to: Coord;
  promo?: 'Q' | 'R' | 'B' | 'N';
}

/**
 * Get piece at coordinates [x, y]
 */
export function getPieceAt(pieces: Piece[], x: number, y: number): Piece | undefined {
  return pieces.find(p => p.x === x && p.y === y);
}

/**
 * Check if coordinates are on board
 */
export function isOnBoard(x: number, y: number, size: number): boolean {
  return x >= 0 && x < size && y >= 0 && y < size;
}

/**
 * Generate pseudo-legal moves (without checking if king is left in check)
 * Returns Move objects with from/to coordinates
 */
export function generatePseudoLegalMoves(
  pieces: Piece[],
  size: number,
  side: PieceColor
): Move[] {
  const moves: Move[] = [];
  const friendlyPieces = pieces.filter(p => p.color === side);

  for (const piece of friendlyPieces) {
    const { x, y, type, color } = piece;
    const from: Coord = [x, y];

    if (type === 'K') {
      // King: 1 step in any direction
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (isOnBoard(nx, ny, size)) {
            const target = getPieceAt(pieces, nx, ny);
            if (!target || target.color !== color) {
              moves.push({ from, to: [nx, ny] });
            }
          }
        }
      }
    } else if (type === 'Q' || type === 'R' || type === 'B') {
      // Sliding pieces
      const directions: [number, number][] = [];
      if (type === 'Q' || type === 'R') {
        // Rook directions: horizontal (x changes) and vertical (y changes)
        directions.push([1, 0], [-1, 0], [0, 1], [0, -1]);
      }
      if (type === 'Q' || type === 'B') {
        // Bishop directions: diagonals (both x and y change)
        directions.push([1, 1], [-1, 1], [1, -1], [-1, -1]);
      }

      for (const [dx, dy] of directions) {
        let nx = x + dx;
        let ny = y + dy;
        while (isOnBoard(nx, ny, size)) {
          const target = getPieceAt(pieces, nx, ny);
          if (!target) {
            moves.push({ from, to: [nx, ny] });
          } else {
            if (target.color !== color) {
              moves.push({ from, to: [nx, ny] }); // Capture
            }
            break; // Blocked
          }
          nx += dx;
          ny += dy;
        }
      }
    } else if (type === 'N') {
      // Knight: L-shape
      const offsets: [number, number][] = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1],
      ];
      for (const [dx, dy] of offsets) {
        const nx = x + dx;
        const ny = y + dy;
        if (isOnBoard(nx, ny, size)) {
          const target = getPieceAt(pieces, nx, ny);
          if (!target || target.color !== color) {
            moves.push({ from, to: [nx, ny] });
          }
        }
      }
    } else if (type === 'P') {
      // Pawn moves
      const direction = color === 'w' ? 1 : -1; // White: y+1, Black: y-1
      const startRank = color === 'w' ? 1 : size - 2;
      const lastRank = color === 'w' ? size - 1 : 0;

      // Forward 1 step
      const ny1 = y + direction;
      if (isOnBoard(x, ny1, size) && !getPieceAt(pieces, x, ny1)) {
        if (ny1 === lastRank) {
          // Promotion
          moves.push({ from, to: [x, ny1], promo: 'Q' });
          moves.push({ from, to: [x, ny1], promo: 'R' });
          moves.push({ from, to: [x, ny1], promo: 'B' });
          moves.push({ from, to: [x, ny1], promo: 'N' });
        } else {
          moves.push({ from, to: [x, ny1] });
        }

        // Forward 2 steps from starting rank
        if (y === startRank) {
          const ny2 = y + 2 * direction;
          if (isOnBoard(x, ny2, size) && !getPieceAt(pieces, x, ny2)) {
            moves.push({ from, to: [x, ny2] });
          }
        }
      }

      // Diagonal captures
      for (const dx of [-1, 1]) {
        const nx = x + dx;
        const ny = y + direction;
        if (isOnBoard(nx, ny, size)) {
          const target = getPieceAt(pieces, nx, ny);
          if (target && target.color !== color) {
            if (ny === lastRank) {
              // Promotion
              moves.push({ from, to: [nx, ny], promo: 'Q' });
              moves.push({ from, to: [nx, ny], promo: 'R' });
              moves.push({ from, to: [nx, ny], promo: 'B' });
              moves.push({ from, to: [nx, ny], promo: 'N' });
            } else {
              moves.push({ from, to: [nx, ny] });
            }
          }
        }
      }
    }
  }

  return moves;
}

/**
 * Check if a square is attacked by a specific side
 */
export function isSquareAttacked(
  pieces: Piece[],
  size: number,
  target: Coord,
  bySide: PieceColor
): boolean {
  const [tx, ty] = target;
  
  // Generate all pseudo-legal moves for the attacking side
  const attackerMoves = generatePseudoLegalMoves(pieces, size, bySide);
  
  // Check if any move targets this square
  return attackerMoves.some(move => move.to[0] === tx && move.to[1] === ty);
}

/**
 * Check if a side's king is in check
 */
export function isInCheck(pieces: Piece[], size: number, side: PieceColor): boolean {
  const king = pieces.find(p => p.type === 'K' && p.color === side);
  if (!king) return false; // Should not happen in valid position

  const opponentSide: PieceColor = side === 'w' ? 'b' : 'w';
  return isSquareAttacked(pieces, size, [king.x, king.y], opponentSide);
}

/**
 * Apply a move and return new piece array
 * Handles captures and pawn promotion
 */
export function applyMove(pieces: Piece[], move: Move, size: number): Piece[] {
  const [fromX, fromY] = move.from;
  const [toX, toY] = move.to;
  
  const movingPiece = getPieceAt(pieces, fromX, fromY);
  if (!movingPiece) {
    console.warn('applyMove: No piece at from square', move);
    return pieces;
  }

  // Remove captured piece and moving piece
  let newPieces = pieces.filter(
    p => !(p.x === toX && p.y === toY) && !(p.x === fromX && p.y === fromY)
  );

  // Determine final piece type (handle promotion)
  let finalType = movingPiece.type;
  if (move.promo) {
    finalType = move.promo;
  } else if (movingPiece.type === 'P') {
    // Auto-promote to Queen if reaching last rank without explicit promo
    const lastRank = movingPiece.color === 'w' ? size - 1 : 0;
    if (toY === lastRank) {
      finalType = 'Q';
    }
  }

  // Add moved piece at new position
  newPieces.push({
    ...movingPiece,
    type: finalType,
    x: toX,
    y: toY,
  });

  return newPieces;
}

/**
 * Generate legal moves (filters pseudo-legal moves by checking king safety)
 */
export function generateLegalMoves(
  pieces: Piece[],
  size: number,
  side: PieceColor
): Move[] {
  const pseudoMoves = generatePseudoLegalMoves(pieces, size, side);
  const legalMoves: Move[] = [];

  for (const move of pseudoMoves) {
    const newPieces = applyMove(pieces, move, size);
    if (!isInCheck(newPieces, size, side)) {
      legalMoves.push(move);
    }
  }

  return legalMoves;
}

/**
 * Check if a side is in checkmate
 * Definition: side is in check AND has no legal moves
 */
export function isCheckmate(pieces: Piece[], size: number, side: PieceColor): boolean {
  return isInCheck(pieces, size, side) && generateLegalMoves(pieces, size, side).length === 0;
}

/**
 * Dev self-test suite (runs only in __DEV__)
 */
export function runChessLogicSelfTest(): { passed: boolean; errors: string[] } {
  if (!__DEV__) return { passed: true, errors: [] };

  console.log('--- Running Chess Logic Self-Test ---');
  const errors: string[] = [];
  const size = 8;

  // Test 1: King at [3,3] has 8 legal moves on empty board
  let testPieces: Piece[] = [
    { type: 'K', color: 'w', x: 3, y: 3 },
  ];
  let kingMoves = generateLegalMoves(testPieces, size, 'w');
  if (kingMoves.length !== 8) {
    errors.push(`Test 1 FAILED: King at [3,3] should have 8 moves, got ${kingMoves.length}`);
  }
  if (!kingMoves.some(m => m.to[0] === 2 && m.to[1] === 3)) {
    errors.push(`Test 1 FAILED: King at [3,3] missing move to [2,3]`);
  }
  if (!kingMoves.some(m => m.to[0] === 3 && m.to[1] === 2)) {
    errors.push(`Test 1 FAILED: King at [3,3] missing move to [3,2]`);
  }

  // Test 2: Rook at [0,0] has 14 pseudo moves on empty 8x8
  testPieces = [{ type: 'R', color: 'w', x: 0, y: 0 }];
  let rookPseudoMoves = generatePseudoLegalMoves(testPieces, size, 'w');
  if (rookPseudoMoves.length !== 14) {
    errors.push(`Test 2 FAILED: Rook at [0,0] should have 14 pseudo moves, got ${rookPseudoMoves.length}`);
  }

  // Test 3: White pawn forward direction (y+1)
  testPieces = [{ type: 'P', color: 'w', x: 0, y: 1 }];
  let whitePawnMoves = generatePseudoLegalMoves(testPieces, size, 'w');
  const hasWhiteForward1 = whitePawnMoves.some(m => m.to[0] === 0 && m.to[1] === 2);
  const hasWhiteForward2 = whitePawnMoves.some(m => m.to[0] === 0 && m.to[1] === 3);
  if (!hasWhiteForward1 || !hasWhiteForward2) {
    errors.push(`Test 3 FAILED: White pawn at [0,1] should move to [0,2] and [0,3]`);
  }

  // Test 4: Black pawn forward direction (y-1)
  testPieces = [{ type: 'P', color: 'b', x: 0, y: 6 }];
  let blackPawnMoves = generatePseudoLegalMoves(testPieces, size, 'b');
  const hasBlackForward1 = blackPawnMoves.some(m => m.to[0] === 0 && m.to[1] === 5);
  const hasBlackForward2 = blackPawnMoves.some(m => m.to[0] === 0 && m.to[1] === 4);
  if (!hasBlackForward1 || !hasBlackForward2) {
    errors.push(`Test 4 FAILED: Black pawn at [0,6] should move to [0,5] and [0,4]`);
  }

  // Test 5: Simple mate-in-1 position
  // White King at [0,0], White Rook at [0,6], Black King at [7,7]
  // White plays Rook to [7,6] for checkmate
  testPieces = [
    { type: 'K', color: 'w', x: 0, y: 0 },
    { type: 'R', color: 'w', x: 0, y: 6 },
    { type: 'K', color: 'b', x: 7, y: 7 },
  ];
  const mateMove: Move = { from: [0, 6], to: [7, 6] };
  const afterMate = applyMove(testPieces, mateMove, size);
  if (!isCheckmate(afterMate, size, 'b')) {
    errors.push(`Test 5 FAILED: Simple mate-in-1 not recognized as checkmate`);
  }

  const passed = errors.length === 0;
  if (passed) {
    console.log('--- Chess Logic Self-Test PASSED ---');
  } else {
    console.error('--- Chess Logic Self-Test FAILED ---');
    errors.forEach(err => console.error(err));
  }

  return { passed, errors };
}

// Legacy compatibility exports (for existing code)
export type Square = Coord;

export function getLegalMovesForPiece(
  pieces: Piece[],
  from: Square,
  boardSize: number,
  checkForCheck: boolean = true
): Square[] {
  const [x, y] = from;
  const piece = getPieceAt(pieces, x, y);
  if (!piece) return [];

  if (checkForCheck) {
    const legalMoves = generateLegalMoves(pieces, boardSize, piece.color);
    return legalMoves
      .filter(m => m.from[0] === x && m.from[1] === y)
      .map(m => m.to);
  } else {
    const pseudoMoves = generatePseudoLegalMoves(pieces, boardSize, piece.color);
    return pseudoMoves
      .filter(m => m.from[0] === x && m.from[1] === y)
      .map(m => m.to);
  }
}

export function makeMove(
  pieces: Piece[],
  from: Square,
  to: Square,
  promo?: PieceType
): Piece[] {
  return applyMove(pieces, { from, to, promo }, 8);
}

export function isKingInCheck(
  pieces: Piece[],
  kingColor: PieceColor,
  boardSize: number
): boolean {
  return isInCheck(pieces, boardSize, kingColor);
}

export function getKingSquare(pieces: Piece[], color: PieceColor): Square | null {
  const king = pieces.find(p => p.type === 'K' && p.color === color);
  return king ? [king.x, king.y] : null;
}

export function needsPromotion(piece: Piece, boardSize: number): boolean {
  if (piece.type !== 'P') return false;
  const promotionRank = piece.color === 'w' ? boardSize - 1 : 0;
  return piece.y === promotionRank;
}

export function isValidSquare(square: Square, boardSize: number): boolean {
  return isOnBoard(square[0], square[1], boardSize);
}
