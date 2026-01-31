
import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Piece } from '@/data/types';
import { Square } from '@/utils/chessLogic';
import { PieceIcon } from './PieceIcon';
import { eq } from '@/utils/coords';

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
  // Grid is indexed as grid[displayRow][displayCol]
  // displayRow = size - 1 - y (flip y for display)
  // displayCol = x
  const grid: (Piece | null)[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));

  pieces.forEach(piece => {
    // Flip y coordinate for display (y=0 at bottom in chess, but top in UI)
    const displayRow = size - 1 - piece.y;
    const displayCol = piece.x;

    if (displayRow >= 0 && displayRow < size && displayCol >= 0 && displayCol < size) {
      grid[displayRow][displayCol] = piece;
    }
  });

  // Helper to check if a square is highlighted
  // Convert display coordinates (row, col) back to logical [x, y]
  const isSquareSelected = (row: number, col: number): boolean => {
    if (!selectedSquare) return false;
    const chessY = size - 1 - row;
    const chessX = col;
    return eq(selectedSquare, [chessX, chessY]);
  };

  const isSquareLegalMove = (row: number, col: number): boolean => {
    const chessY = size - 1 - row;
    const chessX = col;
    return legalMoves.some(m => eq(m, [chessX, chessY]));
  };

  const isSquareLastMoveFrom = (row: number, col: number): boolean => {
    if (!lastMove) return false;
    const chessY = size - 1 - row;
    const chessX = col;
    return eq(lastMove.from, [chessX, chessY]);
  };

  const isSquareLastMoveTo = (row: number, col: number): boolean => {
    if (!lastMove) return false;
    const chessY = size - 1 - row;
    const chessX = col;
    return eq(lastMove.to, [chessX, chessY]);
  };

  const isSquareCheckedKing = (row: number, col: number): boolean => {
    if (!checkedKingSquare) return false;
    const chessY = size - 1 - row;
    const chessX = col;
    return eq(checkedKingSquare, [chessX, chessY]);
  };

  // Convert display tap to logical [x, y] coordinates
  const handleSquarePress = (row: number, col: number) => {
    const chessY = size - 1 - row;
    const chessX = col;
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
