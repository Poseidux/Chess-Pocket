
import { BUILT_IN_PUZZLES } from './builtInPuzzles';
import { Puzzle, Filters, ObjectiveType } from './types';
import { validateAllPuzzles } from '@/utils/puzzleValidator';

// Cache validation results in dev mode
let validationCache: Set<string> | null = null;

/**
 * Get passing puzzle IDs in dev mode
 */
function getPassingPuzzleIds(): Set<string> {
  if (!__DEV__) {
    // In production, all puzzles are available
    return new Set(BUILT_IN_PUZZLES.map(p => p.id));
  }

  if (validationCache === null) {
    console.log('ContentStore: Running validation to filter puzzles in dev mode');
    const report = validateAllPuzzles(BUILT_IN_PUZZLES);
    validationCache = new Set(
      BUILT_IN_PUZZLES
        .filter(p => !report.failedPuzzles.some(f => f.puzzleId === p.id))
        .map(p => p.id)
    );
    console.log(`ContentStore: ${validationCache.size}/${BUILT_IN_PUZZLES.length} puzzles passed validation`);
  }

  return validationCache;
}

/**
 * ContentStore - Facade for accessing puzzle data
 * All puzzle data is bundled as TypeScript module exports (offline-first)
 * In dev mode, only shows puzzles that pass validation
 */
export const ContentStore = {
  /**
   * Get all available puzzles
   * In dev mode, filters to only passing puzzles
   */
  getAllPuzzles: (): Puzzle[] => {
    console.log('ContentStore: Fetching all puzzles');
    
    if (__DEV__) {
      const passingIds = getPassingPuzzleIds();
      return BUILT_IN_PUZZLES.filter(p => passingIds.has(p.id));
    }
    
    return BUILT_IN_PUZZLES;
  },

  /**
   * Get a specific puzzle by ID
   */
  getPuzzleById: (id: string): Puzzle | undefined => {
    console.log('ContentStore: Fetching puzzle by ID:', id);
    return BUILT_IN_PUZZLES.find(p => p.id === id);
  },

  /**
   * Get the daily puzzle based on the current date
   * Uses deterministic selection so the same puzzle appears for everyone on the same day
   */
  getDailyPuzzle: (date: Date): Puzzle => {
    console.log('ContentStore: Fetching daily puzzle for date:', date.toISOString());
    const availablePuzzles = ContentStore.getAllPuzzles();
    // Calculate days since epoch
    const daysSinceEpoch = Math.floor(date.getTime() / 86400000);
    // Use modulo to cycle through puzzles
    const puzzleIndex = daysSinceEpoch % availablePuzzles.length;
    return availablePuzzles[puzzleIndex];
  },

  /**
   * Apply filters to the puzzle list
   */
  applyFilters: (filters: Filters): Puzzle[] => {
    console.log('ContentStore: Applying filters:', filters);
    const allPuzzles = ContentStore.getAllPuzzles();
    
    return allPuzzles.filter(puzzle => {
      // Filter by size
      if (filters.size && filters.size.length > 0 && !filters.size.includes(puzzle.size)) {
        return false;
      }

      // Filter by difficulty
      if (filters.difficulty && filters.difficulty.length > 0 && !filters.difficulty.includes(puzzle.difficulty)) {
        return false;
      }

      // Filter by objective type
      if (filters.objectiveType && filters.objectiveType.length > 0 && !filters.objectiveType.includes(puzzle.objective.type)) {
        return false;
      }

      // Filter by pack
      if (filters.pack && filters.pack.length > 0 && !filters.pack.includes(puzzle.pack)) {
        return false;
      }

      return true;
    });
  },

  /**
   * Get all unique pack names
   */
  getAllPacks: (): string[] => {
    console.log('ContentStore: Fetching all pack names');
    const allPuzzles = ContentStore.getAllPuzzles();
    const packs = new Set(allPuzzles.map(p => p.pack));
    return Array.from(packs).sort();
  },

  /**
   * Get all unique objective types
   */
  getAllObjectiveTypes: (): ObjectiveType[] => {
    console.log('ContentStore: Fetching all objective types');
    const allPuzzles = ContentStore.getAllPuzzles();
    const types = new Set<ObjectiveType>();
    allPuzzles.forEach(p => types.add(p.objective.type));
    return Array.from(types).sort();
  },
};
