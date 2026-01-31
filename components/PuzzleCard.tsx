
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Puzzle } from '@/data/types';
import { IconSymbol } from './IconSymbol';

interface PuzzleCardProps {
  puzzle: Puzzle;
  solved: boolean;
  onPress: () => void;
}

export function PuzzleCard({ puzzle, solved, onPress }: PuzzleCardProps) {
  const formatObjective = (): string => {
    const depthText = puzzle.objective.depth;
    return `Mate in ${depthText}`;
  };

  const objectiveText = formatObjective();
  const sizeText = `${puzzle.size}×${puzzle.size}`;
  const difficultyStars = '★'.repeat(puzzle.difficulty);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{puzzle.title}</Text>
          {solved && (
            <View style={styles.solvedBadge}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={16}
                color="#10b981"
              />
            </View>
          )}
        </View>
        <Text style={styles.pack}>{puzzle.pack}</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Size:</Text>
          <Text style={styles.detailValue}>{sizeText}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Difficulty:</Text>
          <Text style={styles.detailValue}>{difficultyStars}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Objective:</Text>
          <Text style={styles.detailValue}>{objectiveText}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  header: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
    flex: 1,
  },
  solvedBadge: {
    marginLeft: 8,
  },
  pack: {
    fontSize: 14,
    color: '#64748b',
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#e2e8f0',
    fontWeight: '600',
  },
});
