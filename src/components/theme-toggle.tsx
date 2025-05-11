'use client';

import { useTheme } from '@/context/ThemeContext';
import { Switch } from '@/components/ui/switch';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Switch
      checked={theme === 'dark'}
      onCheckedChange={() => toggleTheme()}
      className="ml-2"
    />
  );
}