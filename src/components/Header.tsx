'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Sliders, Activity, Search, Menu } from 'lucide-react';
import { useMobileMenu } from './AppShell';
import { ThemeToggle } from '@/context/ThemeContext';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  isDemo?: boolean;
  onMenuToggle?: () => void;
}

export function Header({ 
  title = 'Painel de Controlo', 
  subtitle = 'Inteligência de Descoberta no Facebook via Google Dorks', 
  isDemo = true,
  onMenuToggle
}: HeaderProps) {
  const { toggleMobileMenu } = useMobileMenu();
  const handleMenuClick = onMenuToggle || toggleMobileMenu;

  return (
    <header className="h-16 border-b border-slate-200 dark:border-white/[0.08] bg-white/85 dark:bg-[#07090c]/80 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          type="button"
          onClick={handleMenuClick}
          className="md:hidden p-2 -ml-1 rounded-lg text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors shrink-0 tap-transparent"
          title="Abrir Menu de Navegação"
          aria-label="Abrir Menu"
        >
          <Menu className="w-5 h-5 text-slate-900 dark:text-white" />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 truncate">
            {title}
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-normal truncate hidden sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Search Shortcut - Desktop only */}
        <Link
          href="/app/search"
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-xs text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/[0.15] transition-all"
        >
          <Search className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
          <span>Pesquisa rápida</span>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-300 dark:border-white/[0.08]">⌘K</kbd>
        </Link>

        {/* Engine Status Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-900/80 border border-slate-200 dark:border-white/[0.08] text-xs font-mono">
          <Activity className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span className="text-slate-500 dark:text-zinc-400 text-[11px] hidden sm:inline">Motor:</span>
          {isDemo ? (
            <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
              <span className="hidden xs:inline">Modo </span>Demo
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              Live
            </span>
          )}
        </div>

        {/* Light/Dark Mode Theme Switcher */}
        <ThemeToggle />

        {/* Settings button */}
        <Link
          href="/app/settings"
          title="Configurações de Provedor e API"
          className="p-2 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/[0.15] transition-all"
        >
          <Sliders className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
}
