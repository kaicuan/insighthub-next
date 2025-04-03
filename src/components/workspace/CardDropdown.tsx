'use client';

import {
  RiShareLine as ShareIcon,
  RiInformationLine as InfoIcon,
  RiDeleteBinLine as DeleteIcon,
  RiMore2Fill as MoreIcon,
} from '@remixicon/react';
import { useState, useEffect, useRef } from 'react';

interface CardDropdownProps {
  dashboardId: string;
  onDelete?: () => void;
}

export default function CardDropdown({ dashboardId }: CardDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleButtonClick = (e: React.MouseEvent) => {
    setIsOpen(!isOpen);
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && 
          !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toggle Button */}
      <button 
        onClick={handleButtonClick}
        className="p-1 rounded-full hover:bg-muted transition-colors"
        aria-label="Dashboard actions"
      >
        <MoreIcon className="w-5 h-5 text-muted-foreground" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-card border rounded-lg shadow-lg z-10">
          <div className="p-2 space-y-1">
            <button className="flex items-center w-full p-2 
                              rounded-lg hover:bg-muted transition-colors">
              <ShareIcon className="w-4 h-4 mr-3" />
              Share
            </button>
            <button className="flex items-center w-full p-2 
                              rounded-lg hover:bg-muted transition-colors">
              <InfoIcon className="w-4 h-4 mr-3" />
              Detail
            </button>
            <button className="flex items-center w-full p-2 
                              rounded-lg hover:bg-destructive/20 transition-colors">
              <DeleteIcon className="w-4 h-4 mr-3 text-destructive" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}