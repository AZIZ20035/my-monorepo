'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/use-theme-store';

export function useTheme() {
  const { theme, toggle, setTheme } = useThemeStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);
  }, [isDark]);

  return { theme, isDark, toggle, setTheme };
}
