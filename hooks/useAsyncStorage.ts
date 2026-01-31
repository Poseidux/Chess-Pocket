
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Custom hook for AsyncStorage with automatic persistence
 */
export function useAsyncStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  // Load value from AsyncStorage on mount
  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        console.log('useAsyncStorage: Loading value for key:', key);
        const item = await AsyncStorage.getItem(key);
        if (item !== null) {
          const parsedValue = JSON.parse(item);
          console.log('useAsyncStorage: Loaded value:', parsedValue);
          setStoredValue(parsedValue);
        }
      } catch (error) {
        console.error('useAsyncStorage: Error loading value:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredValue();
  }, [key]);

  // Save value to AsyncStorage whenever it changes
  const setValue = useCallback(
    async (value: T | ((val: T) => T)) => {
      try {
        console.log('useAsyncStorage: Saving value for key:', key);
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
        console.log('useAsyncStorage: Value saved successfully');
      } catch (error) {
        console.error('useAsyncStorage: Error saving value:', error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue, loading] as const;
}
