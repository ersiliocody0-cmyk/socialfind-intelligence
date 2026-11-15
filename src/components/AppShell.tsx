'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { useLenis } from '@/context/SmoothScrollProvider';

interface MobileMenuContextType {
  mobileOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

const MobileMenuContext = createContext<MobileMenuContextType>({
  mobileOpen: false,
  toggleMobileMenu: () => {},
  closeMobileMenu: () => {},
});

export const useMobileMenu = () => useContext(MobileMenuContext);

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { stop, start } = useLenis();

  const toggleMobileMenu = () => setMobileOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileOpen(false);

  // Pause Lenis smooth scroll while mobile menu is open to prevent scroll conflicts
  useEffect(() => {
    if (mobileOpen) {
      stop();
    } else {
      start();
    }
  }, [mobileOpen, stop, start]);

  return (
    <MobileMenuContext.Provider value={{ mobileOpen, toggleMobileMenu, closeMobileMenu }}>
      <div className="flex min-h-screen bg-slate-50 dark:bg-[#060709] text-slate-900 dark:text-white font-sans transition-colors duration-300">
        <Sidebar mobileOpen={mobileOpen} onCloseMobile={closeMobileMenu} />
        
        <div className="flex-1 flex flex-col min-h-screen relative pb-20 md:pb-0 w-full overflow-x-hidden">
          {children}
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <BottomNav />
      </div>
    </MobileMenuContext.Provider>
  );
}
