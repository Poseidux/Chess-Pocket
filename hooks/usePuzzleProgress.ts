
import { useAsyncStorage } from './useAsyncStorage';
import { PuzzleProgress } from '@/data/types';

const PROGRESS_KEY = 'puzzle_progress';

/**
 * Hook for managing puzzle progress (solved status, attempts)
 */
export function usePuzzleProgress() {
  const [progressMap, setProgressMap, loading] = useAsyncStorage<Record<string, PuzzleProgress>>(
    PROGRESS_KEY,
    {}
  );

  const getProgress = (puzzleId: string): PuzzleProgress => {
    const progressValue = progressMap[puzzleId] || {
      puzzleId,
      solved: false,
      attempts: 0,
    };
    return progressValue;
  };

  const markSolved = async (puzzleId: string) => {
    console.log('usePuzzleProgress: Marking puzzle as solved:', puzzleId);
    const current = getProgress(puzzleId);
    await setProgressMap({
      ...progressMap,
      [puzzleId]: {
        ...current,
        solved: true,
        lastAttemptDate: new Date().toISOString(),
      },
    });
  };

  const incrementAttempts = async (puzzleId: string) => {
    console.log('usePuzzleProgress: Incrementing attempts for puzzle:', puzzleId);
    const current = getProgress(puzzleId);
    await setProgressMap({
      ...progressMap,
      [puzzleId]: {
        ...current,
        attempts: current.attempts + 1,
        lastAttemptDate: new Date().toISOString(),
      },
    });
  };

  const resetProgress = async (puzzleId: string) => {
    console.log('usePuzzleProgress: Resetting progress for puzzle:', puzzleId);
    await setProgressMap({
      ...progressMap,
      [puzzleId]: {
        puzzleId,
        solved: false,
        attempts: 0,
      },
    });
  };

  return {
    getProgress,
    markSolved,
    incrementAttempts,
    resetProgress,
    loading,
  };
}
