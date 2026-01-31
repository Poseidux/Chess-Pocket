
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ContentStore } from '@/data/ContentStore';
import { Puzzle, Filters } from '@/data/types';
import { usePuzzleProgress } from '@/hooks/usePuzzleProgress';
import { useAppSettings } from '@/hooks/useAppSettings';
import { PuzzleCard } from '@/components/PuzzleCard';
import { FilterBar } from '@/components/FilterBar';
import { ChessBoard } from '@/components/ChessBoard';
import { IconSymbol } from '@/components/IconSymbol';

type ViewState = 'library' | 'play';

export default function PocketPuzzlesApp() {
  const [viewState, setViewState] = useState<ViewState>('library');
  const [selectedPuzzleId, setSelectedPuzzleId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({});

  const { getProgress, loading: progressLoading } = usePuzzleProgress();
  const { setLastPlayedPuzzle } = useAppSettings();

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
  };

  const handleRestart = () => {
    console.log('PocketPuzzlesApp: Restarting puzzle');
    // TODO: Implement puzzle restart logic
  };

  const handleUndo = () => {
    console.log('PocketPuzzlesApp: Undo move');
    // TODO: Implement undo logic
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
  if (viewState === 'play' && selectedPuzzle) {
    const sideToMoveText = formatSideToMove(selectedPuzzle.turn);
    const objectiveText = formatObjective(selectedPuzzle);
    const noteText = selectedPuzzle.objective.note || '';

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
            {noteText ? (
              <Text style={styles.objectiveNote}>{noteText}</Text>
            ) : null}
          </View>

          <View style={styles.boardContainer}>
            <ChessBoard size={selectedPuzzle.size} pieces={selectedPuzzle.pieces} />
          </View>

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

            <TouchableOpacity style={styles.controlButton} onPress={handleUndo}>
              <IconSymbol
                ios_icon_name="arrow.uturn.backward"
                android_material_icon_name="undo"
                size={20}
                color="#f1f5f9"
              />
              <Text style={styles.controlButtonText}>Undo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.hintCard}>
            <Text style={styles.hintText}>
              Tap on a piece to select it, then tap on a destination square to move.
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
  controlButtonText: {
    fontSize: 16,
    color: '#f1f5f9',
    fontWeight: '600',
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
});
