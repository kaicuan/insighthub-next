'use client';

import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      {/* Hidden checkbox */}
      <input
        type="checkbox"
        className="sr-only"
        checked={theme === 'dark'}
        onChange={toggleTheme}
      />

      {/* Track */}
      <div className="w-10 h-6 bg-border rounded-full p-1 transition-colors flex items-center">
        {/* Thumb */}
        <div
          className={`
            ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}
            flex items-center justify-center
            w-4 h-4 bg-background rounded-full
            transition-transform duration-300
            transform
          `}
        >
        </div>
      </div>
    </label>
  );
}