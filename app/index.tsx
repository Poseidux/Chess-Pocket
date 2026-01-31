
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BUILT_IN_PUZZLES } from '@/data/builtInPuzzles';
import { Puzzle, Piece } from '@/data/types';
import { PieceIcon3D } from '@/components/PieceIcon';
import { useAppSettings } from '@/hooks/useAppSettings';
import * as Haptics from 'expo-haptics';

type ViewState = 'library' | 'play';

export default function PocketPuzzlesApp() {
  const colorScheme = useColorScheme();
  const { settings, effectiveTheme } = useAppSettings();
  
  const [viewState, setViewState] = useState<ViewState>('library');
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | null>(null);
  const [sizeFilter, setSizeFilter] = useState<(5 | 6 | 7 | 8)[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<(1 | 2 | 3 | 4 | 5)[]>([]);

  const isDark = effectiveTheme === 'dark';
  const colors = {
    background: isDark ? '#0f172a' : '#f8fafc',
    card: isDark ? '#1e293b' : '#ffffff',
    text: isDark ? '#f1f5f9' : '#0f172a',
    textSecondary: isDark ? '#94a3b8' : '#64748b',
    border: isDark ? '#334155' : '#e2e8f0',
    primary: '#3b82f6',
    success: '#10b981',
    lightSquare: isDark ? '#cbd5e1' : '#f1f5f9',
    darkSquare: isDark ? '#64748b' : '#94a3b8',
  };

  const triggerHaptic = () => {
    if (settings.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePlayPuzzle = (puzzle: Puzzle) => {
    console.log('User selected puzzle:', puzzle.id);
    setSelectedPuzzle(puzzle);
    setViewState('play');
    triggerHaptic();
  };

  const handleBackToLibrary = () => {
    console.log('Returning to library');
    setViewState('library');
    setSelectedPuzzle(null);
    triggerHaptic();
  };

  const toggleSizeFilter = (size: 5 | 6 | 7 | 8) => {
    console.log('Toggling size filter:', size);
    if (sizeFilter.includes(size)) {
      setSizeFilter(sizeFilter.filter(s => s !== size));
    } else {
      setSizeFilter([...sizeFilter, size]);
    }
    triggerHaptic();
  };

  const toggleDifficultyFilter = (difficulty: 1 | 2 | 3 | 4 | 5) => {
    console.log('Toggling difficulty filter:', difficulty);
    if (difficultyFilter.includes(difficulty)) {
      setDifficultyFilter(difficultyFilter.filter(d => d !== difficulty));
    } else {
      setDifficultyFilter([...difficultyFilter, difficulty]);
    }
    triggerHaptic();
  };

  const filteredPuzzles = BUILT_IN_PUZZLES.filter(puzzle => {
    const sizeMatch = sizeFilter.length === 0 || sizeFilter.includes(puzzle.size);
    const difficultyMatch = difficultyFilter.length === 0 || difficultyFilter.includes(puzzle.difficulty);
    return sizeMatch && difficultyMatch;
  });

  const formatMateText = (depth: number): string => {
    return `Mate in ${depth}`;
  };

  const formatSideToMove = (turn: 'w' | 'b'): string => {
    return turn === 'w' ? 'White to move' : 'Black to move';
  };

  // Library View
  if (viewState === 'library') {
    const puzzleCountText = `${filteredPuzzles.length} puzzle${filteredPuzzles.length !== 1 ? 's' : ''}`;

    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Pocket Puzzles</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Offline chess mate puzzles
          </Text>
        </View>

        <View style={[styles.filterSection, { borderBottomColor: colors.border }]}>
          <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Size</Text>
          <View style={styles.filterRow}>
            {[5, 6, 7, 8].map(size => {
              const isActive = sizeFilter.includes(size as 5 | 6 | 7 | 8);
              return (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.filterChip,
                    { backgroundColor: isActive ? colors.primary : colors.card, borderColor: colors.border },
                  ]}
                  onPress={() => toggleSizeFilter(size as 5 | 6 | 7 | 8)}
                >
                  <Text style={[styles.filterChipText, { color: isActive ? '#ffffff' : colors.text }]}>
                    {size}×{size}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.filterLabel, { color: colors.textSecondary, marginTop: 12 }]}>
            Difficulty
          </Text>
          <View style={styles.filterRow}>
            {[1, 2, 3, 4, 5].map(difficulty => {
              const isActive = difficultyFilter.includes(difficulty as 1 | 2 | 3 | 4 | 5);
              return (
                <TouchableOpacity
                  key={difficulty}
                  style={[
                    styles.filterChip,
                    { backgroundColor: isActive ? colors.primary : colors.card, borderColor: colors.border },
                  ]}
                  onPress={() => toggleDifficultyFilter(difficulty as 1 | 2 | 3 | 4 | 5)}
                >
                  <Text style={[styles.filterChipText, { color: isActive ? '#ffffff' : colors.text }]}>
                    {difficulty}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.resultsHeader}>
          <Text style={[styles.resultsText, { color: colors.textSecondary }]}>{puzzleCountText}</Text>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {filteredPuzzles.map(puzzle => {
            const mateText = formatMateText(puzzle.objective.depth);
            const solved = false;

            return (
              <TouchableOpacity
                key={puzzle.id}
                style={[styles.puzzleCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => handlePlayPuzzle(puzzle)}
              >
                <View style={styles.puzzleCardHeader}>
                  <View style={styles.puzzleCardTitleRow}>
                    <Text style={[styles.puzzleTitle, { color: colors.text }]}>{puzzle.title}</Text>
                    {solved && (
                      <View style={[styles.solvedBadge, { backgroundColor: colors.success }]}>
                        <Text style={styles.solvedBadgeText}>✓</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.puzzlePack, { color: colors.textSecondary }]}>{puzzle.pack}</Text>
                </View>

                <View style={styles.puzzleCardFooter}>
                  <View style={styles.puzzleMetaRow}>
                    <Text style={[styles.puzzleMeta, { color: colors.textSecondary }]}>
                      {puzzle.size}×{puzzle.size}
                    </Text>
                    <Text style={[styles.puzzleMeta, { color: colors.textSecondary }]}>•</Text>
                    <Text style={[styles.puzzleMeta, { color: colors.textSecondary }]}>
                      Difficulty {puzzle.difficulty}
                    </Text>
                  </View>
                  <Text style={[styles.puzzleObjective, { color: colors.primary }]}>{mateText}</Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {filteredPuzzles.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                No puzzles match your filters
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSizeFilter([]);
                  setDifficultyFilter([]);
                  triggerHaptic();
                }}
              >
                <Text style={[styles.emptyStateButton, { color: colors.primary }]}>Clear Filters</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Play View
  if (viewState === 'play' && selectedPuzzle) {
    const mateText = formatMateText(selectedPuzzle.objective.depth);
    const sideToMoveText = formatSideToMove(selectedPuzzle.turn);
    const screenWidth = Dimensions.get('window').width;
    const boardSize = Math.min(screenWidth - 32, 400);
    const squareSize = boardSize / selectedPuzzle.size;

    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.playHeader}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToLibrary}>
            <Text style={[styles.backButtonText, { color: colors.primary }]}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.playTitle, { color: colors.text }]}>{selectedPuzzle.title}</Text>
          <Text style={[styles.playSubtitle, { color: colors.textSecondary }]}>{mateText}</Text>
        </View>

        <ScrollView style={styles.playScrollView} contentContainerStyle={styles.playScrollContent}>
          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>{sideToMoveText}</Text>
          </View>

          <View style={[styles.board, { width: boardSize, height: boardSize }]}>
            {Array.from({ length: selectedPuzzle.size }).map((_, row) => (
              <View key={row} style={styles.boardRow}>
                {Array.from({ length: selectedPuzzle.size }).map((_, col) => {
                  const isLight = (row + col) % 2 === 0;
                  const squareColor = isLight ? colors.lightSquare : colors.darkSquare;
                  const displayRow = selectedPuzzle.size - 1 - row;
                  const piece = selectedPuzzle.pieces.find(p => p.x === col && p.y === displayRow);

                  return (
                    <View
                      key={col}
                      style={[
                        styles.square,
                        { width: squareSize, height: squareSize, backgroundColor: squareColor },
                      ]}
                    >
                      {piece && (
                        <View style={styles.pieceContainer}>
                          <PieceIcon3D type={piece.type} color={piece.color} size={squareSize} />
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            ))}
          </View>

          <View style={[styles.noteCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.noteText, { color: colors.textSecondary }]}>
              This is a display-only view. Piece movement will be implemented in a future update.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  puzzleCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  puzzleCardHeader: {
    marginBottom: 12,
  },
  puzzleCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  puzzleTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  solvedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  solvedBadgeText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '700',
  },
  puzzlePack: {
    fontSize: 14,
  },
  puzzleCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  puzzleMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  puzzleMeta: {
    fontSize: 14,
  },
  puzzleObjective: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    marginBottom: 16,
  },
  emptyStateButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  playHeader: {
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
  playTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  playSubtitle: {
    fontSize: 16,
  },
  playScrollView: {
    flex: 1,
  },
  playScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
  },
  board: {
    alignSelf: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  boardRow: {
    flexDirection: 'row',
  },
  square: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  noteText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
