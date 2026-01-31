
import { useAsyncStorage } from './useAsyncStorage';
import { AppSettings } from '@/data/types';

const SETTINGS_KEY = 'app_settings';

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
  theme: 'auto',
};

/**
 * Hook for managing app settings
 */
export function useAppSettings() {
  const [settings, setSettings, loading] = useAsyncStorage<AppSettings>(
    SETTINGS_KEY,
    DEFAULT_SETTINGS
  );

  const updateSettings = async (updates: Partial<AppSettings>) => {
    console.log('useAppSettings: Updating settings:', updates);
    await setSettings({ ...settings, ...updates });
  };

  const setLastPlayedPuzzle = async (puzzleId: string) => {
    console.log('useAppSettings: Setting last played puzzle:', puzzleId);
    await updateSettings({ lastPlayedPuzzleId: puzzleId });
  };

  return {
    settings,
    updateSettings,
    setLastPlayedPuzzle,
    loading,
  };
}
