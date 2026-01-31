
import { Piece, PieceType, PieceColor, Turn } from '@/data/types';

export type Square = [number, number];

/**
 * Get piece at a specific square
 */
export function getPieceAt(pieces: Piece[], square: Square): Piece | undefined {
  return pieces.find(p => p.x === square[0] && p.y === square[1]);
}

/**
 * Check if a square is on the board
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
 * Get legal moves for a piece at a given square
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
 */
function getKingMoves(pieces: Piece[], from: Square, boardSize: number): Square[] {
  const [x, y] = from;
  const piece = getPieceAt(pieces, from);
  if (!piece) return [];
  
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
 */
function getRookMoves(pieces: Piece[], from: Square, boardSize: number): Square[] {
  const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  return getSlidingMoves(pieces, from, directions, boardSize);
}

/**
 * Bishop moves: sliding diagonally
 */
function getBishopMoves(pieces: Piece[], from: Square, boardSize: number): Square[] {
  const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  return getSlidingMoves(pieces, from, directions, boardSize);
}

/**
 * Helper for sliding pieces (Queen, Rook, Bishop)
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
 */
function getPawnMoves(pieces: Piece[], from: Square, boardSize: number): Square[] {
  const [x, y] = from;
  const piece = getPieceAt(pieces, from);
  if (!piece) return [];
  
  const moves: Square[] = [];
  const direction = piece.color === 'w' ? 1 : -1;
  const startRank = piece.color === 'w' ? 1 : boardSize - 2;
  
  // Forward 1 square
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
  
  // Diagonal captures
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
  
  // Check for pawn promotion
  const isPromotion =
    piece.type === 'P' &&
    ((piece.color === 'w' && to[1] === pieces.length - 1) ||
     (piece.color === 'b' && to[1] === 0));
  
  const finalType = isPromotion && promo ? promo : piece.type;
  
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
 * Get the square of a king
 */
export function getKingSquare(pieces: Piece[], color: PieceColor): Square | null {
  const king = pieces.find(p => p.type === 'K' && p.color === color);
  return king ? [king.x, king.y] : null;
}
