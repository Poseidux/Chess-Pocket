
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BUILT_IN_PUZZLES } from '@/data/builtInPuzzles';
import { PuzzleSize, Difficulty } from '@/data/types';
import { useAppSettings } from '@/hooks/useAppSettings';
import { usePuzzleProgress } from '@/hooks/usePuzzleProgress';
import * as Haptics from 'expo-haptics';

export default function PocketPuzzlesApp() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { settings, effectiveTheme } = useAppSettings();
  const { getProgress } = usePuzzleProgress();
  
  const [sizeFilter, setSizeFilter] = useState<PuzzleSize[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty[]>([]);

  const isDark = effectiveTheme === 'dark';
  const colors = {
    background: isDark ? '#0f172a' : '#f8fafc',
    card: isDark ? '#1e293b' : '#ffffff',
    text: isDark ? '#f1f5f9' : '#0f172a',
    textSecondary: isDark ? '#94a3b8' : '#64748b',
    border: isDark ? '#334155' : '#e2e8f0',
    primary: '#3b82f6',
    success: '#10b981',
  };

  const triggerHaptic = () => {
    if (settings.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePlayPuzzle = (puzzleId: string) => {
    console.log('User selected puzzle:', puzzleId);
    router.push(`/play?id=${puzzleId}`);
    triggerHaptic();
  };

  const toggleSizeFilter = (size: PuzzleSize) => {
    console.log('Toggling size filter:', size);
    const newFilter = sizeFilter.includes(size)
      ? sizeFilter.filter(s => s !== size)
      : [...sizeFilter, size];
    setSizeFilter(newFilter);
    triggerHaptic();
  };

  const toggleDifficultyFilter = (difficulty: Difficulty) => {
    console.log('Toggling difficulty filter:', difficulty);
    const newFilter = difficultyFilter.includes(difficulty)
      ? difficultyFilter.filter(d => d !== difficulty)
      : [...difficultyFilter, difficulty];
    setDifficultyFilter(newFilter);
    triggerHaptic();
  };

  const filteredPuzzles = BUILT_IN_PUZZLES.filter(puzzle => {
    const sizeMatch = sizeFilter.length === 0 || sizeFilter.includes(puzzle.size);
    const difficultyMatch = difficultyFilter.length === 0 || difficultyFilter.includes(puzzle.difficulty);
    return sizeMatch && difficultyMatch;
  });

  const formatMateText = (depth: number): string => {
    return `Checkmate in ${depth}`;
  };

  const puzzleCountText = `${filteredPuzzles.length} puzzle${filteredPuzzles.length !== 1 ? 's' : ''}`;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Pocket Puzzles</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Find the winning moves
        </Text>
      </View>

      <View style={[styles.filterSection, { borderBottomColor: colors.border }]}>
        <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Board Size</Text>
        <View style={styles.filterRow}>
          {([5, 6, 7, 8] as PuzzleSize[]).map(size => {
            const isActive = sizeFilter.includes(size);
            const sizeText = `${size}×${size}`;
            return (
              <TouchableOpacity
                key={size}
                style={[
                  styles.filterChip,
                  { backgroundColor: isActive ? colors.primary : colors.card, borderColor: colors.border },
                ]}
                onPress={() => toggleSizeFilter(size)}
              >
                <Text style={[styles.filterChipText, { color: isActive ? '#ffffff' : colors.text }]}>
                  {sizeText}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.filterLabel, { color: colors.textSecondary, marginTop: 12 }]}>
          Difficulty
        </Text>
        <View style={styles.filterRow}>
          {([1, 2, 3, 4, 5] as Difficulty[]).map(difficulty => {
            const isActive = difficultyFilter.includes(difficulty);
            const difficultyText = `${difficulty}`;
            return (
              <TouchableOpacity
                key={difficulty}
                style={[
                  styles.filterChip,
                  { backgroundColor: isActive ? colors.primary : colors.card, borderColor: colors.border },
                ]}
                onPress={() => toggleDifficultyFilter(difficulty)}
              >
                <Text style={[styles.filterChipText, { color: isActive ? '#ffffff' : colors.text }]}>
                  {difficultyText}
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
          const progress = getProgress(puzzle.id);
          const solved = progress.solved;
          const sizeText = `${puzzle.size}×${puzzle.size}`;
          const difficultyText = `Difficulty ${puzzle.difficulty}`;

          return (
            <TouchableOpacity
              key={puzzle.id}
              style={[styles.puzzleCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => handlePlayPuzzle(puzzle.id)}
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
                    {sizeText}
                  </Text>
                  <Text style={[styles.puzzleMeta, { color: colors.textSecondary }]}>•</Text>
                  <Text style={[styles.puzzleMeta, { color: colors.textSecondary }]}>
                    {difficultyText}
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
});
