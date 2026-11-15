'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Search, Terminal, Bookmark, User } from 'lucide-react';
import { clsx } from 'clsx';

export function BottomNav() {
  const pathname = usePathname();

  const items = [
    { name: 'Início', href: '/app', icon: Compass },
    { name: 'Pesquisa', href: '/app/search', icon: Search, primary: true },
    { name: 'Dorks', href: '/app/dorks', icon: Terminal },
    { name: 'Favoritos', href: '/app/favorites', icon: Bookmark },
    { name: 'Perfil', href: '/app/profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#07090d]/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/[0.1] px-2 py-1.5 safe-bottom shadow-[0_-4px_25px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.6)] transition-colors duration-300">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.primary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-4 relative group tap-transparent"
              >
                <div
                  className={clsx(
                    'w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform active:scale-95',
                    isActive
                      ? 'bg-gradient-to-tr from-cyan-500 to-emerald-400 text-black shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                      : 'bg-white dark:bg-[#121620] border border-cyan-500/50 text-cyan-600 dark:text-cyan-400 shadow-md'
                  )}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span
                  className={clsx(
                    'text-[10px] font-mono mt-1 font-medium',
                    isActive ? 'text-cyan-600 dark:text-cyan-400 font-bold' : 'text-slate-500 dark:text-zinc-400'
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-all tap-transparent',
                isActive 
                  ? 'text-cyan-600 dark:text-cyan-400 font-semibold' 
                  : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
              )}
            >
              <Icon className={clsx('w-4 h-4', isActive && 'stroke-[2.2]')} />
              <span className={clsx('text-[10px] font-mono mt-0.5', isActive && 'font-semibold text-slate-900 dark:text-white')}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
