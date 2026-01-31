
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Filters, PuzzleSize, Difficulty, ObjectiveType } from '@/data/types';
import { ContentStore } from '@/data/ContentStore';

interface FilterBarProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const sizes: PuzzleSize[] = [4, 5, 6, 8];
  const difficulties: Difficulty[] = [1, 2, 3, 4, 5];
  const objectiveTypes = ContentStore.getAllObjectiveTypes();
  const packs = ContentStore.getAllPacks();

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
    onFilterChange({ ...filters, difficulty: newDifficulties.length > 0 ? newDifficulties : undefined });
  };

  const toggleObjective = (objective: ObjectiveType) => {
    const currentObjectives = filters.objectiveType || [];
    const newObjectives = currentObjectives.includes(objective)
      ? currentObjectives.filter(o => o !== objective)
      : [...currentObjectives, objective];
    onFilterChange({ ...filters, objectiveType: newObjectives.length > 0 ? newObjectives : undefined });
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
    (filters.objectiveType && filters.objectiveType.length > 0) ||
    (filters.pack && filters.pack.length > 0);

  const formatObjectiveLabel = (type: ObjectiveType): string => {
    switch (type) {
      case 'mate': return 'Mate';
      case 'win': return 'Win';
      case 'promote': return 'Promote';
      case 'stalemate': return 'Stalemate';
      default: return type;
    }
  };

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
            const isActive = filters.size?.includes(size) || false;
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
            const isActive = filters.difficulty?.includes(difficulty) || false;
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

        <View style={styles.filterGroup}>
          <Text style={styles.groupLabel}>Objective:</Text>
          {objectiveTypes.map(objective => {
            const isActive = filters.objectiveType?.includes(objective) || false;
            const objectiveLabel = formatObjectiveLabel(objective);
            return (
              <TouchableOpacity
                key={objective}
                style={[styles.filterButton, isActive && styles.filterButtonActive]}
                onPress={() => toggleObjective(objective)}
              >
                <Text style={[styles.filterButtonText, isActive && styles.filterButtonTextActive]}>
                  {objectiveLabel}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.groupLabel}>Pack:</Text>
          {packs.map(pack => {
            const isActive = filters.pack?.includes(pack) || false;
            const packLabel = pack.length > 20 ? pack.substring(0, 17) + '...' : pack;
            return (
              <TouchableOpacity
                key={pack}
                style={[styles.filterButton, isActive && styles.filterButtonActive]}
                onPress={() => togglePack(pack)}
              >
                <Text style={[styles.filterButtonText, isActive && styles.filterButtonTextActive]}>
                  {packLabel}
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
