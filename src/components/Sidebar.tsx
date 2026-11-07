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
  ChevronRight
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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/[0.08] bg-[#090b0f] flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-30">
      <div>
        {/* Brand Logo */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-white/[0.06]">
          <Link href="/app" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1px] shadow-glow-cyan transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#090b0f] rounded-[7px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-white flex items-center gap-1.5">
                SocialFind <span className="text-[10px] font-mono text-cyan-400 font-normal px-1 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">v1.0</span>
              </span>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono">Intelligence</p>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] uppercase font-mono tracking-wider text-zinc-400">
            Módulos de Descoberta
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all group',
                  isActive
                    ? 'bg-white/[0.08] text-white border border-white/[0.12] shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={clsx(
                      'w-4 h-4 transition-colors',
                      isActive ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-zinc-300'
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {item.highlight && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                )}
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400 opacity-80" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Engine Status */}
      <div className="p-4 border-t border-white/[0.06] space-y-3">
        <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/[0.06] text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-mono text-zinc-400">Motor Google Dorks</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Operacional
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Pesquisa indexada de fontes abertas sem dependência da API privada do Facebook.
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
            SaaS Enterprise
          </span>
          <Link href="/" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
            Landing <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
