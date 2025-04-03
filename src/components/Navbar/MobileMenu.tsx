'use client'

import {
  RiMenuLine as MenuIcon,
  RiCloseLine as CloseIcon
} from "@remixicon/react";

interface MobileMenuProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function MobileMenu({ isOpen, onClick }: MobileMenuProps) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-full hover:bg-muted transition-colors"
    >
      {isOpen ? (
        <CloseIcon className="w-6 h-6 text-muted-foreground" />
      ) : (
        <MenuIcon className="w-6 h-6 text-muted-foreground" />
      )}
    </button>
  );
}