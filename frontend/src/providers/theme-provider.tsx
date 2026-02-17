'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/use-theme-store';

/** Syncs the Zustand theme store with the <html> class. Mount once in layout. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return <>{children}</>;
}
