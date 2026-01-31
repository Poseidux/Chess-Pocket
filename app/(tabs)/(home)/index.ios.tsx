
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
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

type ViewMode = 'library' | 'play';

export default function HomeScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('library');
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | null>(null);
  const [filters, setFilters] = useState<Filters>({});

  const { getProgress, loading: progressLoading } = usePuzzleProgress();
  const { setLastPlayedPuzzle } = useAppSettings();

  // Get filtered puzzles
  const puzzles = useMemo(() => {
    console.log('HomeScreen: Applying filters to puzzle list');
    return ContentStore.applyFilters(filters);
  }, [filters]);

  const handlePlayPuzzle = async (puzzle: Puzzle) => {
    console.log('HomeScreen: User selected puzzle:', puzzle.id);
    setSelectedPuzzle(puzzle);
    setViewMode('play');
    await setLastPlayedPuzzle(puzzle.id);
  };

  const handleBackToLibrary = () => {
    console.log('HomeScreen: Returning to library');
    setViewMode('library');
    setSelectedPuzzle(null);
  };

  const handleRestart = () => {
    console.log('HomeScreen: Restarting puzzle');
    // TODO: Implement puzzle restart logic
  };

  const handleUndo = () => {
    console.log('HomeScreen: Undo move');
    // TODO: Implement undo logic
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
  if (viewMode === 'library') {
    const puzzleCount = puzzles.length;
    const puzzleCountText = `${puzzleCount} puzzle${puzzleCount !== 1 ? 's' : ''}`;

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
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
  if (viewMode === 'play' && selectedPuzzle) {
    const turnText = selectedPuzzle.turn;
    const objectiveText = selectedPuzzle.objective.description;

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.playHeader}>
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
            <View style={styles.objectiveHeader}>
              <Text style={styles.objectiveLabel}>To Move:</Text>
              <Text style={styles.objectiveValue}>{turnText}</Text>
            </View>
            <Text style={styles.objectiveDescription}>{objectiveText}</Text>
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
    paddingBottom: 100,
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
    paddingBottom: 100,
  },
  objectiveCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  objectiveHeader: {
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
  objectiveDescription: {
    fontSize: 16,
    color: '#e2e8f0',
    fontStyle: 'italic',
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
