import { useEffect, useState } from 'react';

/**
 * Hook that provides SSR-safe utilities
 */
export const useSSR = () => {
  const [isClient, setIsClient] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsLoaded(true);
  }, []);

  const safeWindow = typeof window !== 'undefined' ? window : undefined;
  const safeDocument = typeof document !== 'undefined' ? document : undefined;
  const safeLocalStorage = typeof window !== 'undefined' && window.localStorage ? window.localStorage : undefined;

  return {
    isClient,
    isServer: !isClient,
    isLoaded,
    canUseDOM: typeof window !== 'undefined',
    window: safeWindow,
    document: safeDocument,
    localStorage: safeLocalStorage,
  };
};

/**
 * Hook that only executes on client-side
 */
export const useClientEffect = (effect: React.EffectCallback, deps?: React.DependencyList) => {
  const { isClient } = useSSR();
  
  useEffect(() => {
    if (isClient) {
      return effect();
    }
  }, [isClient, ...(deps || [])]);
};

/**
 * Hook that provides safe localStorage access
 */
export const useSafeLocalStorage = (key: string, initialValue: any = null) => {
  const { localStorage, isClient } = useSSR();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (isClient && localStorage) {
      try {
        const item = localStorage.getItem(key);
        setValue(item ? JSON.parse(item) : initialValue);
      } catch (error) {
        console.warn('Error reading from localStorage:', error);
        setValue(initialValue);
      }
    }
  }, [key, isClient, localStorage, initialValue]);

  const setStoredValue = (newValue: any) => {
    try {
      setValue(newValue);
      if (isClient && localStorage) {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    } catch (error) {
      console.warn('Error writing to localStorage:', error);
    }
  };

  return [value, setStoredValue];
}; 