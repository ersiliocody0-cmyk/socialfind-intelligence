'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Sliders, Activity, Search } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  isDemo?: boolean;
}

export function Header({ title = 'Painel de Controlo', subtitle = 'Inteligência de Descoberta no Facebook via Google Dorks', isDemo = true }: HeaderProps) {
  return (
    <header className="h-16 border-b border-white/[0.08] bg-[#07090c]/80 backdrop-blur-md sticky top-0 z-20 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
            {title}
          </h1>
          <p className="text-[11px] text-zinc-400 font-normal">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Search Shortcut */}
        <Link
          href="/app/search"
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-zinc-400 hover:text-white hover:border-white/[0.15] transition-all"
        >
          <Search className="w-3.5 h-3.5 text-zinc-400" />
          <span>Pesquisa rápida</span>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-white/[0.08]">⌘K</kbd>
        </Link>

        {/* Engine Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-white/[0.08] text-xs font-mono">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-zinc-400 text-[11px]">Motor:</span>
          {isDemo ? (
            <span className="inline-flex items-center gap-1.5 text-amber-400 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Modo Demo
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-emerald-400 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live SERP
            </span>
          )}
        </div>

        {/* Settings button */}
        <Link
          href="/app/settings"
          title="Configurações de Provedor e API"
          className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/[0.15] transition-all"
        >
          <Sliders className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
}
