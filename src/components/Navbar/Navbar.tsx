'use client';

import { useState} from 'react';
import Brand from '@/components/Brand';
import MobileMenu from '@/components/Navbar/MobileMenu';
import UserMenu from '@/components/Navbar/UserMenu';
import DesktopNavLinks from '@/components/Navbar/DekstopNavLink';
import MobileNavLink from '@/components/Navbar/MobileNavLink';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* <div className="sm:hidden flex items-center">
           <MobileMenu 
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
           />
          </div> */}

          <div className="flex items-center space-x-4 sm:space-x-0">
            <Brand />
          </div>

          {/* <div className="hidden sm:flex space-x-4 h-full">
            <DesktopNavLinks />
          </div> */}

          <UserMenu />
        </div>
      </div>

      <MobileNavLink
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </nav>
  );
}