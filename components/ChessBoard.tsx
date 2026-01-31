
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Piece, PieceType, PieceColor } from '@/data/types';

interface ChessBoardProps {
  size: 4 | 5 | 6 | 8;
  pieces: Piece[];
}

// Helper to get piece symbol
function getPieceSymbol(type: PieceType, color: PieceColor): string {
  const symbols: Record<PieceType, { w: string; b: string }> = {
    K: { w: '♔', b: '♚' },
    Q: { w: '♕', b: '♛' },
    R: { w: '♖', b: '♜' },
    B: { w: '♗', b: '♝' },
    N: { w: '♘', b: '♞' },
    P: { w: '♙', b: '♟' },
  };
  return symbols[type][color];
}

export function ChessBoard({ size, pieces }: ChessBoardProps) {
  const screenWidth = Dimensions.get('window').width;
  const boardPadding = 32;
  const boardWidth = Math.min(screenWidth - boardPadding, 400);
  const squareSize = boardWidth / size;

  // Create a 2D grid to place pieces
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

  return (
    <View style={[styles.board, { width: boardWidth, height: boardWidth }]}>
      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((piece, colIndex) => {
            const isLight = (rowIndex + colIndex) % 2 === 0;
            const squareColor = isLight ? '#f0d9b5' : '#b58863';
            const pieceSymbol = piece ? getPieceSymbol(piece.type, piece.color) : '';

            return (
              <View
                key={colIndex}
                style={[
                  styles.square,
                  { width: squareSize, height: squareSize, backgroundColor: squareColor },
                ]}
              >
                {pieceSymbol ? (
                  <Text style={[styles.piece, { fontSize: squareSize * 0.7 }]}>
                    {pieceSymbol}
                  </Text>
                ) : null}
              </View>
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
  piece: {
    fontWeight: 'bold',
  },
});
