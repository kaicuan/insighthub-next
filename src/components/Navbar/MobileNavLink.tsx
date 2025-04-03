'use client';

import { useEffect, useRef } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { links } from '@/lib/navbar-links'

interface MobileNavLinkProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNavLink({ isOpen, onClose }: MobileNavLinkProps) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="sm:hidden absolute top-16 left-0 right-0 bg-card 
                border-b border-t border-border shadow-lg z-40"
    >
      <div className="px-4 py-3 space-y-4">
        <div>
          {links.map((link, i) => {
            return (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  "block mx-2 px-2 py-4 text-muted-foreground hover:text-primary",
                  {
                    "text-primary": pathname === link.href,
                    "border-t": i !== 0,
                  }
                )}
              >{link.name}</Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}