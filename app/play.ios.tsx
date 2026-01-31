
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Animated,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChessBoard } from '@/components/ChessBoard';
import { ContentStore } from '@/data/ContentStore';
import { Piece, PieceColor, LineMove } from '@/data/types';
import { Square, generateLegalMoves, applyMove, isInCheck, isCheckmate } from '@/utils/chessLogic';
import { useAppSettings } from '@/hooks/useAppSettings';
import { usePuzzleProgress } from '@/hooks/usePuzzleProgress';
import * as Haptics from 'expo-haptics';
import { eq } from '@/utils/coords';

interface GameState {
  pieces: Piece[];
  currentSide: PieceColor;
  lineIndex: number;
  history: {
    pieces: Piece[];
    currentSide: PieceColor;
    lineIndex: number;
  }[];
}

interface MoveHistoryEntry {
  moveNumber: number;
  whiteMove?: string;
  blackMove?: string;
}

export default function PlayScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { settings, effectiveTheme } = useAppSettings();
  const { getProgress, markSolved, incrementAttempts } = usePuzzleProgress();

  const puzzleId = params.id as string;
  const puzzle = ContentStore.getPuzzleById(puzzleId);

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [checkedKingSquare, setCheckedKingSquare] = useState<Square | null>(null);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'info' | 'success' | 'error'>('info');
  const [showSolvedModal, setShowSolvedModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showMoveHistory, setShowMoveHistory] = useState(false);
  const [moveHistory, setMoveHistory] = useState<MoveHistoryEntry[]>([]);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const isDark = effectiveTheme === 'dark';
  const colors = {
    background: isDark ? '#0f172a' : '#f8fafc',
    card: isDark ? '#1e293b' : '#ffffff',
    text: isDark ? '#f1f5f9' : '#0f172a',
    textSecondary: isDark ? '#94a3b8' : '#64748b',
    border: isDark ? '#334155' : '#e2e8f0',
    primary: '#3b82f6',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
  };

  useEffect(() => {
    if (puzzle) {
      console.log('PlayScreen: Initializing puzzle', puzzle.id);
      initializeGame();
    }
  }, [puzzle]);

  useEffect(() => {
    if (gameState) {
      updateCheckedKingSquare();
      updateMoveHistory();
    }
  }, [gameState]);

  const initializeGame = () => {
    if (!puzzle) return;

    const initialState: GameState = {
      pieces: JSON.parse(JSON.stringify(puzzle.pieces)),
      currentSide: puzzle.turn,
      lineIndex: 0,
      history: [],
    };

    setGameState(initialState);
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setMessage('');
    setShowSolvedModal(false);
    setShowHint(false);
    setMoveHistory([]);
    
    const sideText = puzzle.turn === 'w' ? 'White' : 'Black';
    setMessage(`${sideText} to move`);
    setMessageType('info');
  };

  const updateCheckedKingSquare = () => {
    if (!gameState || !puzzle) return;

    if (isInCheck(gameState.pieces, puzzle.size, gameState.currentSide)) {
      const king = gameState.pieces.find(
        p => p.type === 'K' && p.color === gameState.currentSide
      );
      if (king) {
        setCheckedKingSquare([king.x, king.y]);
        return;
      }
    }
    setCheckedKingSquare(null);
  };

  const updateMoveHistory = () => {
    if (!gameState || !puzzle) return;

    const history: MoveHistoryEntry[] = [];
    let moveNumber = 1;
    
    for (let i = 0; i < gameState.lineIndex; i++) {
      const move = puzzle.line[i];
      const moveText = formatMove(move);
      
      if (move.side === 'w') {
        history.push({ moveNumber, whiteMove: moveText });
      } else {
        if (history.length > 0 && history[history.length - 1].moveNumber === moveNumber) {
          history[history.length - 1].blackMove = moveText;
          moveNumber++;
        } else {
          history.push({ moveNumber, blackMove: moveText });
          moveNumber++;
        }
      }
    }
    
    setMoveHistory(history);
  };

  const formatMove = (move: LineMove): string => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const fromFile = files[move.from[0]];
    const fromRank = move.from[1] + 1;
    const toFile = files[move.to[0]];
    const toRank = move.to[1] + 1;
    
    let moveText = `${fromFile}${fromRank}-${toFile}${toRank}`;
    if (move.promo) {
      moveText += `=${move.promo}`;
    }
    return moveText;
  };

  const getHint = (): string => {
    if (!gameState || !puzzle) return '';
    
    if (gameState.lineIndex >= puzzle.line.length) {
      return 'Puzzle complete!';
    }
    
    const nextMove = puzzle.line[gameState.lineIndex];
    if (nextMove.side !== gameState.currentSide) {
      return 'Wait for opponent move';
    }
    
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const fromFile = files[nextMove.from[0]];
    const fromRank = nextMove.from[1] + 1;
    const toFile = files[nextMove.to[0]];
    const toRank = nextMove.to[1] + 1;
    
    const piece = gameState.pieces.find(p => p.x === nextMove.from[0] && p.y === nextMove.from[1]);
    const pieceName = piece ? getPieceName(piece.type) : 'Piece';
    
    return `Try moving ${pieceName} from ${fromFile}${fromRank} to ${toFile}${toRank}`;
  };

  const getPieceName = (type: string): string => {
    const names: Record<string, string> = {
      'K': 'King',
      'Q': 'Queen',
      'R': 'Rook',
      'B': 'Bishop',
      'N': 'Knight',
      'P': 'Pawn',
    };
    return names[type] || type;
  };

  const triggerHaptic = (type: 'select' | 'move' | 'error' | 'success') => {
    if (!settings.hapticsEnabled) return;

    switch (type) {
      case 'select':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'move':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'error':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
    }
  };

  const shakeBoard = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleSquarePress = (square: Square) => {
    if (!gameState || !puzzle || isProcessing) return;

    console.log('User tapped square:', square);

    const piece = gameState.pieces.find(p => p.x === square[0] && p.y === square[1]);

    if (!selectedSquare) {
      if (piece && piece.color === gameState.currentSide) {
        console.log('Selecting piece:', piece.type, piece.color);
        setSelectedSquare(square);
        
        const legal = generateLegalMoves(gameState.pieces, puzzle.size, gameState.currentSide)
          .filter(m => eq(m.from, square))
          .map(m => m.to);
        
        setLegalMoves(legal);
        triggerHaptic('select');
      }
      return;
    }

    if (eq(selectedSquare, square)) {
      console.log('Deselecting piece');
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    if (piece && piece.color === gameState.currentSide) {
      console.log('Switching selection to:', piece.type, piece.color);
      setSelectedSquare(square);
      
      const legal = generateLegalMoves(gameState.pieces, puzzle.size, gameState.currentSide)
        .filter(m => eq(m.from, square))
        .map(m => m.to);
      
      setLegalMoves(legal);
      triggerHaptic('select');
      return;
    }

    const isLegalDest = legalMoves.some(m => eq(m, square));
    if (!isLegalDest) {
      console.log('Illegal move attempt');
      triggerHaptic('error');
      return;
    }

    attemptMove(selectedSquare, square);
  };

  const attemptMove = (from: Square, to: Square) => {
    if (!gameState || !puzzle) return;

    console.log('Attempting move from', from, 'to', to);

    if (gameState.lineIndex >= puzzle.line.length) {
      console.log('Already at end of puzzle line');
      return;
    }

    const expectedMove = puzzle.line[gameState.lineIndex];

    const matchesFrom = eq(from, expectedMove.from);
    const matchesTo = eq(to, expectedMove.to);
    const matchesSide = gameState.currentSide === expectedMove.side;

    if (!matchesFrom || !matchesTo || !matchesSide) {
      console.log('Wrong move! Expected:', expectedMove, 'Got:', { from, to, side: gameState.currentSide });
      
      triggerHaptic('error');
      shakeBoard();
      setMessage('Try again!');
      setMessageType('error');
      setSelectedSquare(null);
      setLegalMoves([]);
      
      incrementAttempts(puzzle.id);
      return;
    }

    console.log('Correct move!');
    executeMove(from, to, expectedMove.promo);
  };

  const executeMove = (from: Square, to: Square, promo?: 'Q' | 'R' | 'B' | 'N') => {
    if (!gameState || !puzzle) return;

    setIsProcessing(true);

    const newHistory = [
      ...gameState.history,
      {
        pieces: JSON.parse(JSON.stringify(gameState.pieces)),
        currentSide: gameState.currentSide,
        lineIndex: gameState.lineIndex,
      },
    ];

    const newPieces = applyMove(
      gameState.pieces,
      { from, to, promo },
      puzzle.size
    );

    const newSide: PieceColor = gameState.currentSide === 'w' ? 'b' : 'w';
    const newLineIndex = gameState.lineIndex + 1;

    setGameState({
      pieces: newPieces,
      currentSide: newSide,
      lineIndex: newLineIndex,
      history: newHistory,
    });

    setLastMove({ from, to });
    setSelectedSquare(null);
    setLegalMoves([]);
    triggerHaptic('move');

    if (newLineIndex >= puzzle.line.length) {
      console.log('Puzzle line complete!');
      
      setTimeout(() => {
        const opponentInCheckmate = isCheckmate(newPieces, puzzle.size, newSide);
        
        if (opponentInCheckmate) {
          console.log('Checkmate verified! Puzzle solved!');
          setMessage('Solved!');
          setMessageType('success');
          triggerHaptic('success');
          setShowSolvedModal(true);
          markSolved(puzzle.id);
        } else {
          console.log('Warning: Puzzle line complete but not checkmate');
          setMessage('Puzzle complete');
          setMessageType('success');
        }
        setIsProcessing(false);
      }, 300);
      return;
    }

    const nextMove = puzzle.line[newLineIndex];
    if (nextMove.side !== gameState.currentSide) {
      console.log('Auto-playing opponent reply');
      setMessage('Opponent is thinking...');
      setMessageType('info');

      setTimeout(() => {
        autoPlayOpponentMove(newPieces, newSide, newLineIndex, newHistory);
      }, 300);
    } else {
      const sideText = newSide === 'w' ? 'White' : 'Black';
      setMessage(`${sideText} to move`);
      setMessageType('info');
      setIsProcessing(false);
    }
  };

  const autoPlayOpponentMove = (
    pieces: Piece[],
    side: PieceColor,
    lineIndex: number,
    history: GameState['history']
  ) => {
    if (!puzzle) return;

    const opponentMove = puzzle.line[lineIndex];
    console.log('Auto-playing opponent move:', opponentMove);

    const newPieces = applyMove(
      pieces,
      {
        from: opponentMove.from,
        to: opponentMove.to,
        promo: opponentMove.promo,
      },
      puzzle.size
    );

    const newSide: PieceColor = side === 'w' ? 'b' : 'w';
    const newLineIndex = lineIndex + 1;

    const newHistory = [
      ...history,
      {
        pieces: JSON.parse(JSON.stringify(pieces)),
        currentSide: side,
        lineIndex,
      },
    ];

    setGameState({
      pieces: newPieces,
      currentSide: newSide,
      lineIndex: newLineIndex,
      history: newHistory,
    });

    setLastMove({ from: opponentMove.from, to: opponentMove.to });
    triggerHaptic('move');

    if (newLineIndex >= puzzle.line.length) {
      console.log('Puzzle line complete after opponent move!');
      
      setTimeout(() => {
        const opponentInCheckmate = isCheckmate(newPieces, puzzle.size, newSide);
        
        if (opponentInCheckmate) {
          console.log('Checkmate verified! Puzzle solved!');
          setMessage('Solved!');
          setMessageType('success');
          triggerHaptic('success');
          setShowSolvedModal(true);
          markSolved(puzzle.id);
        } else {
          console.log('Warning: Puzzle line complete but not checkmate');
          setMessage('Puzzle complete');
          setMessageType('success');
        }
        setIsProcessing(false);
      }, 300);
    } else {
      const sideText = newSide === 'w' ? 'White' : 'Black';
      setMessage(`${sideText} to move`);
      setMessageType('info');
      setIsProcessing(false);
    }
  };

  const handleUndo = () => {
    if (!gameState || gameState.history.length === 0) return;

    console.log('Undoing move');
    const previousState = gameState.history[gameState.history.length - 1];
    const newHistory = gameState.history.slice(0, -1);

    setGameState({
      ...previousState,
      history: newHistory,
    });

    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setMessage('');
    triggerHaptic('select');
  };

  const handleRestart = () => {
    console.log('Restarting puzzle');
    initializeGame();
    triggerHaptic('select');
  };

  const handleBack = () => {
    console.log('Returning to library');
    router.back();
  };

  const handleShowHint = () => {
    console.log('User requested hint');
    setShowHint(true);
    triggerHaptic('select');
  };

  const handleToggleMoveHistory = () => {
    console.log('User toggled move history');
    setShowMoveHistory(!showMoveHistory);
    triggerHaptic('select');
  };

  if (!puzzle) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>Puzzle not found</Text>
          <TouchableOpacity onPress={handleBack}>
            <Text style={[styles.backButtonText, { color: colors.primary }]}>← Back to Library</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!gameState) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading puzzle...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const progress = getProgress(puzzle.id);
  const mateText = `Mate in ${puzzle.objective.depth}`;
  const hintText = getHint();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.puzzleTitle, { color: colors.text }]}>{puzzle.title}</Text>
          <Text style={[styles.puzzleSubtitle, { color: colors.textSecondary }]}>{mateText}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {message && (
          <View
            style={[
              styles.messageCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              messageType === 'success' && { borderColor: colors.success },
              messageType === 'error' && { borderColor: colors.error },
            ]}
          >
            <Text
              style={[
                styles.messageText,
                { color: colors.text },
                messageType === 'success' && { color: colors.success },
                messageType === 'error' && { color: colors.error },
              ]}
            >
              {message}
            </Text>
          </View>
        )}

        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          <ChessBoard
            size={puzzle.size}
            pieces={gameState.pieces}
            selectedSquare={selectedSquare}
            legalMoves={legalMoves}
            lastMove={lastMove}
            checkedKingSquare={checkedKingSquare}
            onSquarePress={handleSquarePress}
          />
        </Animated.View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[
              styles.controlButton,
              { backgroundColor: colors.card, borderColor: colors.border },
              gameState.history.length === 0 && styles.controlButtonDisabled,
            ]}
            onPress={handleUndo}
            disabled={gameState.history.length === 0}
          >
            <Text style={[styles.controlButtonText, { color: colors.text }]}>Undo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={handleRestart}
          >
            <Text style={[styles.controlButtonText, { color: colors.text }]}>Restart</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featureButtons}>
          <TouchableOpacity
            style={[styles.featureButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={handleShowHint}
          >
            <Text style={[styles.featureButtonText, { color: colors.warning }]}>💡 Hint</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.featureButton,
              { backgroundColor: colors.card, borderColor: colors.border },
              showMoveHistory && { borderColor: colors.primary },
            ]}
            onPress={handleToggleMoveHistory}
          >
            <Text style={[styles.featureButtonText, { color: colors.text }]}>
              📜 History {showMoveHistory ? '▼' : '▶'}
            </Text>
          </TouchableOpacity>
        </View>

        {showHint && (
          <View style={[styles.hintCard, { backgroundColor: colors.card, borderColor: colors.warning }]}>
            <Text style={[styles.hintTitle, { color: colors.warning }]}>💡 Hint</Text>
            <Text style={[styles.hintText, { color: colors.text }]}>{hintText}</Text>
            <TouchableOpacity
              style={[styles.hintCloseButton, { backgroundColor: colors.background }]}
              onPress={() => setShowHint(false)}
            >
              <Text style={[styles.hintCloseButtonText, { color: colors.text }]}>Close</Text>
            </TouchableOpacity>
          </View>
        )}

        {showMoveHistory && (
          <View style={[styles.historyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.historyTitle, { color: colors.text }]}>Move History</Text>
            {moveHistory.length === 0 ? (
              <Text style={[styles.historyEmpty, { color: colors.textSecondary }]}>
                No moves yet
              </Text>
            ) : (
              <View style={styles.historyList}>
                {moveHistory.map((entry, index) => (
                  <View key={index} style={styles.historyRow}>
                    <Text style={[styles.historyMoveNumber, { color: colors.textSecondary }]}>
                      {entry.moveNumber}.
                    </Text>
                    <Text style={[styles.historyMove, { color: colors.text }]}>
                      {entry.whiteMove || '...'}
                    </Text>
                    <Text style={[styles.historyMove, { color: colors.text }]}>
                      {entry.blackMove || ''}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {progress.solved && (
          <View style={[styles.solvedBanner, { backgroundColor: colors.success }]}>
            <Text style={styles.solvedBannerText}>✓ Solved</Text>
          </View>
        )}
      </ScrollView>

      <Modal visible={showSolvedModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.success }]}>🎉 Puzzle Solved!</Text>
            <Text style={[styles.modalText, { color: colors.text }]}>
              You completed {puzzle.title}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={() => {
                  setShowSolvedModal(false);
                  handleRestart();
                }}
              >
                <Text style={styles.modalButtonText}>Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}
                onPress={() => {
                  setShowSolvedModal(false);
                  handleBack();
                }}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Back to Library</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerInfo: {
    marginBottom: 8,
  },
  puzzleTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  puzzleSubtitle: {
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  messageCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  controlButton: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  controlButtonDisabled: {
    opacity: 0.5,
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  featureButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  featureButton: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  featureButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  hintCard: {
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 2,
  },
  hintTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  hintText: {
    fontSize: 16,
    marginBottom: 12,
  },
  hintCloseButton: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  hintCloseButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  historyCard: {
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  historyEmpty: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 8,
  },
  historyList: {
    gap: 8,
  },
  historyRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 4,
  },
  historyMoveNumber: {
    fontSize: 14,
    fontWeight: '600',
    width: 30,
  },
  historyMove: {
    fontSize: 14,
    flex: 1,
  },
  solvedBanner: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  solvedBannerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    gap: 12,
  },
  modalButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
