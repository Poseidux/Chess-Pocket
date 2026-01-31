
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
