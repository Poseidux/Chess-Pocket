
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

type ViewState = 'library' | 'play';

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

  // Helper to format objective text
  const formatObjective = (puzzle: Puzzle): string => {
    const depthText = puzzle.objective.depth;
    switch (puzzle.objective.type) {
      case 'mate':
        return `Mate in ${depthText}`;
      case 'win':
        return `Win in ${depthText}`;
      case 'promote':
        return `Promote in ${depthText}`;
      case 'stalemate':
        return `Stalemate in ${depthText}`;
      default:
        return `Objective: ${puzzle.objective.type}`;
    }
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

  // Library View
  if (viewState === 'library') {
    const puzzleCount = puzzles.length;
    const puzzleCountText = `${puzzleCount} puzzle${puzzleCount !== 1 ? 's' : ''}`;

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={[styles.header, Platform.OS === 'android' && { paddingTop: 48 }]}>
          <Text style={styles.headerTitle}>Pocket Puzzles</Text>
          <Text style={styles.headerSubtitle}>Sharpen your chess tactics</Text>
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
                  <Text style={styles.promotionButtonText}>♕ Queen</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.promotionButton}
                  onPress={() => handlePromotion('R')}
                >
                  <Text style={styles.promotionButtonText}>♖ Rook</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.promotionButton}
                  onPress={() => handlePromotion('B')}
                >
                  <Text style={styles.promotionButtonText}>♗ Bishop</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.promotionButton}
                  onPress={() => handlePromotion('N')}
                >
                  <Text style={styles.promotionButtonText}>♘ Knight</Text>
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
});
