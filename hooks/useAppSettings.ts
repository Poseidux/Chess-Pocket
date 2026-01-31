
import { useAsyncStorage } from './useAsyncStorage';
import { AppSettings } from '@/data/types';
import { useColorScheme } from 'react-native';

const SETTINGS_KEY = 'app_settings';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'auto',
  hapticsEnabled: true,
};

/**
 * Hook for managing app settings (theme and haptics only)
 */
export function useAppSettings() {
  const systemColorScheme = useColorScheme();
  const [settings, setSettings, loading] = useAsyncStorage<AppSettings>(
    SETTINGS_KEY,
    DEFAULT_SETTINGS
  );

  const updateSettings = async (updates: Partial<AppSettings>) => {
    console.log('useAppSettings: Updating settings:', updates);
    await setSettings({ ...settings, ...updates });
  };

  const getEffectiveTheme = (): 'light' | 'dark' => {
    if (settings.theme === 'auto') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return settings.theme;
  };

  return {
    settings,
    updateSettings,
    loading,
    effectiveTheme: getEffectiveTheme(),
  };
}
