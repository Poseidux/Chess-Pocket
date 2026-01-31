
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Piece } from '@/data/types';

interface ChessBoardProps {
  size: 4 | 5 | 6 | 8;
  pieces: Piece[];
}

// Helper to convert square notation (e.g., "a1") to row/col indices
function squareToIndices(square: string, boardSize: number): { row: number; col: number } {
  const file = square.charCodeAt(0) - 'a'.charCodeAt(0); // a=0, b=1, etc.
  const rank = parseInt(square[1], 10) - 1; // 1=0, 2=1, etc.
  return {
    row: boardSize - 1 - rank, // Flip vertically (rank 1 at bottom)
    col: file,
  };
}

// Helper to get piece symbol
function getPieceSymbol(piece: Piece): string {
  const symbols: Record<string, { White: string; Black: string }> = {
    King: { White: '♔', Black: '♚' },
    Queen: { White: '♕', Black: '♛' },
    Rook: { White: '♖', Black: '♜' },
    Bishop: { White: '♗', Black: '♝' },
    Knight: { White: '♘', Black: '♞' },
    Pawn: { White: '♙', Black: '♟' },
  };
  return symbols[piece.type][piece.color];
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
    const indices = squareToIndices(piece.position, size);
    if (indices.row >= 0 && indices.row < size && indices.col >= 0 && indices.col < size) {
      grid[indices.row][indices.col] = piece;
    }
  });

  return (
    <View style={[styles.board, { width: boardWidth, height: boardWidth }]}>
      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((piece, colIndex) => {
            const isLight = (rowIndex + colIndex) % 2 === 0;
            const squareColor = isLight ? '#f0d9b5' : '#b58863';
            const pieceSymbol = piece ? getPieceSymbol(piece) : '';

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
