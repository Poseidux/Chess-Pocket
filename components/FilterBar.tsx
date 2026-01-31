
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Filters, PuzzleSize, Difficulty } from '@/data/types';
import { ContentStore } from '@/data/ContentStore';

interface FilterBarProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const allPacks = ContentStore.getAllPacks();

  const toggleSize = (size: PuzzleSize) => {
    const currentSizes = filters.size || [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter(s => s !== size)
      : [...currentSizes, size];
    onFilterChange({ ...filters, size: newSizes.length > 0 ? newSizes : undefined });
  };

  const toggleDifficulty = (difficulty: Difficulty) => {
    const currentDifficulties = filters.difficulty || [];
    const newDifficulties = currentDifficulties.includes(difficulty)
      ? currentDifficulties.filter(d => d !== difficulty)
      : [...currentDifficulties, difficulty];
    onFilterChange({
      ...filters,
      difficulty: newDifficulties.length > 0 ? newDifficulties : undefined,
    });
  };

  const togglePack = (pack: string) => {
    const currentPacks = filters.pack || [];
    const newPacks = currentPacks.includes(pack)
      ? currentPacks.filter(p => p !== pack)
      : [...currentPacks, pack];
    onFilterChange({ ...filters, pack: newPacks.length > 0 ? newPacks : undefined });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters =
    (filters.size && filters.size.length > 0) ||
    (filters.difficulty && filters.difficulty.length > 0) ||
    (filters.pack && filters.pack.length > 0);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Size Filters */}
        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Size:</Text>
          {([4, 5, 6, 8] as PuzzleSize[]).map(size => {
            const sizeText = `${size}x${size}`;
            const isActive = filters.size?.includes(size);
            return (
              <TouchableOpacity
                key={size}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => toggleSize(size)}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {sizeText}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Difficulty Filters */}
        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Difficulty:</Text>
          {([1, 2, 3, 4, 5] as Difficulty[]).map(difficulty => {
            const isActive = filters.difficulty?.includes(difficulty);
            const stars = '★'.repeat(difficulty);
            return (
              <TouchableOpacity
                key={difficulty}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => toggleDifficulty(difficulty)}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {stars}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Pack Filters */}
        {allPacks.length > 1 && (
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Pack:</Text>
            {allPacks.map(pack => {
              const isActive = filters.pack?.includes(pack);
              return (
                <TouchableOpacity
                  key={pack}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => togglePack(pack)}
                >
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                    {pack}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Clear All Button */}
        {hasActiveFilters && (
          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  chipActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  chipText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#7f1d1d',
    borderWidth: 1,
    borderColor: '#991b1b',
  },
  clearButtonText: {
    fontSize: 14,
    color: '#fca5a5',
    fontWeight: '600',
  },
});
