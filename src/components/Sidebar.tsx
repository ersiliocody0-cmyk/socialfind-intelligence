'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { 
  Compass, 
  Search, 
  Terminal, 
  History, 
  Bookmark, 
  FileDown, 
  Sliders, 
  User, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  ChevronRight,
  X
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/app', icon: Compass },
  { name: 'Nova Pesquisa', href: '/app/search', icon: Search, highlight: true },
  { name: 'Dorks Studio', href: '/app/dorks', icon: Terminal },
  { name: 'Histórico', href: '/app/history', icon: History },
  { name: 'Favoritos', href: '/app/favorites', icon: Bookmark },
  { name: 'Exportação', href: '/app/export', icon: FileDown },
  { name: 'Configurações', href: '/app/settings', icon: Sliders },
  { name: 'Perfil', href: '/app/profile', icon: User },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Brand Logo & Mobile Close Button */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200 dark:border-white/[0.06]">
          <Link 
            href="/app" 
            onClick={() => onCloseMobile?.()}
            className="flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1px] shadow-glow-cyan transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-white dark:bg-[#090b0f] rounded-[7px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                SocialFind <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-normal px-1 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/40">v1.0</span>
              </span>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-zinc-400 font-mono">Intelligence</p>
            </div>
          </Link>

          {/* Close button for mobile drawer */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-2 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors"
            title="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-zinc-500">
            Módulos de Descoberta
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onCloseMobile?.()}
                className={clsx(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all group tap-transparent',
                  isActive
                    ? 'bg-slate-100 text-slate-950 border border-slate-200 shadow-sm dark:bg-white/[0.08] dark:text-white dark:border-white/[0.12]'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/[0.04]'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={clsx(
                      'w-4 h-4 transition-colors',
                      isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 group-hover:text-slate-700 dark:text-zinc-500 dark:group-hover:text-zinc-300'
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {item.highlight && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
                )}
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 opacity-80" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Engine Status */}
      <div className="p-4 border-t border-slate-200 dark:border-white/[0.06] space-y-3">
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/[0.06] text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-mono text-slate-600 dark:text-zinc-400">Motor Google Dorks</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              Operacional
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
            Pesquisa indexada de fontes abertas sem dependência da API privada do Facebook.
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 px-1">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            Plano Gratuito
          </span>
          <Link href="/" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1">
            Landing <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#090b0f] flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-30 transition-colors duration-300">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Slide-Over) */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          />

          {/* Drawer content panel */}
          <aside 
            data-lenis-prevent
            className="relative w-72 max-w-[85vw] h-full bg-white dark:bg-[#090b0f] border-r border-slate-200 dark:border-white/[0.1] shadow-2xl flex flex-col justify-between select-none z-10 animate-in slide-in-from-left duration-250 transition-colors duration-300"
          >
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
