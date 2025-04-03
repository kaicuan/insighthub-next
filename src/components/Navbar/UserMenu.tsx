'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import {
  RiArrowUpSLine as ArrowUpIcon,
  RiSettingsLine as SettingsIcon,
  RiLogoutBoxFill as SignOutIcon,
  RiSunLine as Sun,
  RiMoonFill as Moon
} from '@remixicon/react';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/context/ThemeContext';

export default function UserMenu() {
  const { theme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const userMenu = document.getElementById('user-menu');
      const isClickInsideDropdown = 
        (userMenu && userMenu.contains(event.target as Node)) ||
        (dropdownRef.current && dropdownRef.current.contains(event.target as Node));

      if (isDropdownOpen && !isClickInsideDropdown) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 p-2 rounded-full 
                  hover:bg-muted transition-colors"
        id="user-menu"
      >
        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
          <span className="text-secondary-foreground font-medium">
            JD
          </span>
        </div>
        <span className="hidden md:block text-muted-foreground">
          John Doe
        </span>
        <ArrowUpIcon
          className={`w-6 h-6 text-muted-foreground transition-transform ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isDropdownOpen && (
        <div 
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-52 bg-card border 
                    rounded-lg shadow-lg z-50"
        >
          {/* Theme Toggle */}
          <div className="p-2">
            <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-center p-2 
                          rounded-lg hover:bg-primary/5 transition-colors">
              {theme === 'dark' ? (
                <Moon className="text-muted-foreground" />
              ) : (
                <Sun className="text-muted-foreground" />
              )}
              <span className="text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>

            {/* Settings */}
            {/* <Link
              href="/#"
              className="grid grid-cols-[auto_1fr_auto] gap-2 items-center p-2 
                        w-full rounded-lg hover:bg-muted transition-colors"
            >
              <SettingsIcon className="text-muted-foreground" />
              <span className="text-muted-foreground">Settings</span>
              <ArrowUpIcon 
                className="w-4 h-4 text-muted-foreground rotate-90"
                aria-hidden="true"
              />
            </Link> */}
            
            {/* Sign Out */}
            <Link
              href="/"
              className="grid grid-cols-[auto_1fr_auto] gap-2 items-center p-2 
                        w-full rounded-lg hover:bg-destructive/20 transition-colors"
            >
              <SignOutIcon className="text-destructive" />
              <span className="text-destructive">Sign Out</span>
              <ArrowUpIcon 
                className="w-4 h-4 text-destructive rotate-90"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}