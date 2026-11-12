'use client';

import React, { createContext, useContext, useState } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

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

  const toggleMobileMenu = () => setMobileOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <MobileMenuContext.Provider value={{ mobileOpen, toggleMobileMenu, closeMobileMenu }}>
      <div className="flex h-screen bg-[#060709] text-white overflow-hidden font-sans">
        <Sidebar mobileOpen={mobileOpen} onCloseMobile={closeMobileMenu} />
        
        <div className="flex-1 flex flex-col h-screen overflow-y-auto relative pb-20 md:pb-0">
          {children}
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <BottomNav />
      </div>
    </MobileMenuContext.Provider>
  );
}
