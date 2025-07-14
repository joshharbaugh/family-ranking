'use client';

import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/app/store/theme-store';
import { useUserStore } from '@/app/store/user-store';

export function ThemeToggle() {
  const { theme, toggleTheme, updateFirebaseTheme } = useThemeStore();
  const { user } = useUserStore();

  // Update both local state and Firebase
  function handleToggleTheme() {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    toggleTheme();

    // Update Firebase if user is authenticated
    if (user?.uid) {
      updateFirebaseTheme(user.uid, newTheme);
    }
  }

  return (
    <button
      onClick={handleToggleTheme}
      aria-label="Toggle theme"
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
    >
      {theme === "dark" ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
}
