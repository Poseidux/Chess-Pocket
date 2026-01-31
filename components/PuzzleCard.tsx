
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
  const difficultyStars = '★'.repeat(puzzle.difficulty) + '☆'.repeat(5 - puzzle.difficulty);
  const sizeLabel = `${puzzle.size}×${puzzle.size}`;
  const objectiveLabel = puzzle.objective.type;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.title}>{puzzle.title}</Text>
        {solved && (
          <View style={styles.solvedBadge}>
            <IconSymbol
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check-circle"
              size={20}
              color="#4ade80"
            />
          </View>
        )}
      </View>

      <Text style={styles.pack}>{puzzle.pack}</Text>

      <View style={styles.metadata}>
        <View style={styles.metadataItem}>
          <Text style={styles.metadataLabel}>Size:</Text>
          <Text style={styles.metadataValue}>{sizeLabel}</Text>
        </View>

        <View style={styles.metadataItem}>
          <Text style={styles.metadataLabel}>Difficulty:</Text>
          <Text style={styles.metadataValue}>{difficultyStars}</Text>
        </View>

        <View style={styles.metadataItem}>
          <Text style={styles.metadataLabel}>Objective:</Text>
          <Text style={styles.metadataValue}>{objectiveLabel}</Text>
        </View>
      </View>

      <Text style={styles.description}>{puzzle.objective.description}</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    color: '#94a3b8',
    marginBottom: 12,
  },
  metadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 12,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metadataLabel: {
    fontSize: 13,
    color: '#64748b',
    marginRight: 4,
  },
  metadataValue: {
    fontSize: 13,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#e2e8f0',
    fontStyle: 'italic',
  },
});
