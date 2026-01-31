
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Filters } from '@/data/types';

interface FilterBarProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const sizes: Array<4 | 5 | 6 | 8> = [4, 5, 6, 8];
  const difficulties: Array<1 | 2 | 3 | 4 | 5> = [1, 2, 3, 4, 5];

  const toggleSize = (size: 4 | 5 | 6 | 8) => {
    const newSize = filters.size === size ? undefined : size;
    onFilterChange({ ...filters, size: newSize });
  };

  const toggleDifficulty = (difficulty: 1 | 2 | 3 | 4 | 5) => {
    const newDifficulty = filters.difficulty === difficulty ? undefined : difficulty;
    onFilterChange({ ...filters, difficulty: newDifficulty });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = filters.size !== undefined || filters.difficulty !== undefined;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Filters</Text>
        {hasActiveFilters && (
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearButton}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.filterGroup}>
          <Text style={styles.groupLabel}>Size:</Text>
          {sizes.map(size => {
            const isActive = filters.size === size;
            const sizeLabel = `${size}×${size}`;
            return (
              <TouchableOpacity
                key={size}
                style={[styles.filterButton, isActive && styles.filterButtonActive]}
                onPress={() => toggleSize(size)}
              >
                <Text style={[styles.filterButtonText, isActive && styles.filterButtonTextActive]}>
                  {sizeLabel}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.groupLabel}>Difficulty:</Text>
          {difficulties.map(difficulty => {
            const isActive = filters.difficulty === difficulty;
            const difficultyLabel = '★'.repeat(difficulty);
            return (
              <TouchableOpacity
                key={difficulty}
                style={[styles.filterButton, isActive && styles.filterButtonActive]}
                onPress={() => toggleDifficulty(difficulty)}
              >
                <Text style={[styles.filterButtonText, isActive && styles.filterButtonTextActive]}>
                  {difficultyLabel}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  clearButton: {
    fontSize: 14,
    color: '#60a5fa',
    fontWeight: '600',
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  groupLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginRight: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#334155',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#3b82f6',
  },
  filterButtonText: {
    fontSize: 13,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
});
