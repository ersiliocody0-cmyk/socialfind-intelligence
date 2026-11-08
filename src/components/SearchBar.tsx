'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Sparkles, ArrowRight, CornerDownLeft, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  onSearch: (q?: string) => void;
  isLoading?: boolean;
}

const SEARCH_EXAMPLES = [
  'Samsung à venda',
  'iPhone 15 Pro usado',
  'Toyota Hilux para venda',
  'Casas para arrendar em Luanda',
  'Pessoas a procurar emprego',
  'Computadores portáteis usados',
  'Publicações sobre oportunidades de negócio',
];

export function SearchBar({ query, onQueryChange, onSearch, isLoading = false }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleSelectExample = (example: string) => {
    onQueryChange(example);
    if (inputRef.current) {
      inputRef.current.focus();
    }
    onSearch(example);
  };

  return (
    <div className="w-full space-y-3">
      {/* Central Input Box */}
      <form onSubmit={handleSubmit} className="relative w-full">
        <div
          className={clsx(
            'relative flex items-center w-full rounded-xl bg-[#0d1017] border transition-all duration-300 p-1.5 shadow-lg',
            isFocused
              ? 'border-cyan-500/80 shadow-[0_0_25px_rgba(0,240,255,0.18)]'
              : 'border-white/[0.1] hover:border-white/[0.18]'
          )}
        >
          {/* Search Icon / Loader */}
          <div className="pl-4 pr-3 text-zinc-500">
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
            ) : (
              <Search className={clsx('w-5 h-5 transition-colors', isFocused ? 'text-cyan-400' : 'text-zinc-500')} />
            )}
          </div>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Que publicação estás à procura?"
            disabled={isLoading}
            className="w-full bg-transparent text-white placeholder-zinc-500 text-sm md:text-base outline-none pr-3 py-2 font-normal"
          />

          {/* Clear Button */}
          {query && !isLoading && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              className="p-1.5 mr-1 rounded-md text-zinc-500 hover:text-white hover:bg-white/[0.08] transition-colors"
              title="Limpar pesquisa"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Action Button with Enhanced Loader State */}
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className={clsx(
              'px-4 md:px-6 py-2.5 rounded-lg font-medium text-xs tracking-wider uppercase font-mono flex items-center gap-2 transition-all shrink-0 relative overflow-hidden',
              isLoading
                ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-black shadow-[0_0_25px_rgba(0,240,255,0.4)] cursor-wait'
                : query.trim()
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-black hover:opacity-95 shadow-[0_0_20px_rgba(0,240,255,0.3)] active:scale-95'
                : 'bg-white/[0.05] text-zinc-600 border border-white/[0.04] cursor-not-allowed'
            )}
          >
            {isLoading ? (
              <span className="flex items-center gap-2 font-semibold">
                <Loader2 className="w-4 h-4 text-black animate-spin" />
                <span>A Pesquisar...</span>
              </span>
            ) : (
              <>
                <span>Pesquisar</span>
                <CornerDownLeft className="w-3.5 h-3.5 opacity-70" />
              </>
            )}
          </button>
        </div>

        {/* Dynamic Scanning Line across the search bar when loading */}
        {isLoading && (
          <div className="absolute -bottom-[1px] left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-shimmer" />
        )}
      </form>

      {/* Suggested Quick Queries */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          Exemplos:
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {SEARCH_EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => handleSelectExample(ex)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-cyan-500/40 text-zinc-400 hover:text-white text-xs transition-all whitespace-nowrap"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
