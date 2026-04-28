import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../constants/schedule';

/**
 * Hook para manejo del tema (dark/light/system)
 * Encapsula toda la lógica de theming
 */
export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.THEME) || 'system';
    }
    return 'system';
  });

  const getSystemTheme = useCallback(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }, []);

  const applyTheme = useCallback((newTheme) => {
    const root = document.documentElement;
    const effectiveTheme = newTheme === 'system' ? getSystemTheme() : newTheme;
    
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [getSystemTheme]);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme, applyTheme]);

  // Listener para cambios del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]);

  return { theme, setTheme };
};
