'use client';

import React from 'react';
import { Sparkles, Cpu, Layers } from 'lucide-react';

export function SkeletonMetrics() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 w-full">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="p-3.5 rounded-xl bg-[#0c0f15]/90 border border-white/[0.08] relative overflow-hidden animate-shimmer"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-16 h-3 bg-white/[0.08] rounded" />
            <div className="w-6 h-6 rounded-md bg-white/[0.06]" />
          </div>
          <div className="w-12 h-7 bg-white/[0.12] rounded my-1" />
          <div className="w-24 h-2.5 bg-white/[0.05] rounded mt-2" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonPostCard() {
  return (
    <div className="rounded-xl bg-[#0b0e14]/90 border border-white/[0.08] p-4 flex flex-col justify-between space-y-4 animate-shimmer relative overflow-hidden shadow-sm">
      <div className="space-y-3">
        {/* Header badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-20 h-5 rounded-full bg-white/[0.08]" />
            <div className="w-16 h-5 rounded-full bg-white/[0.06]" />
          </div>
          <div className="w-14 h-5 rounded bg-white/[0.06]" />
        </div>

        {/* Author / Group */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-white/[0.06]" />
          <div className="w-32 h-3.5 rounded bg-white/[0.06]" />
        </div>

        {/* Title */}
        <div className="space-y-1.5 pt-1">
          <div className="w-full h-4 rounded bg-white/[0.1]" />
          <div className="w-3/4 h-4 rounded bg-white/[0.08]" />
        </div>

        {/* Snippet lines */}
        <div className="space-y-1.5 pt-1">
          <div className="w-full h-3 rounded bg-white/[0.05]" />
          <div className="w-5/6 h-3 rounded bg-white/[0.05]" />
          <div className="w-4/6 h-3 rounded bg-white/[0.05]" />
        </div>
      </div>

      {/* Footer */}
      <div className="space-y-3 pt-2 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div className="w-24 h-3 rounded bg-white/[0.05]" />
          <div className="w-16 h-3 rounded bg-white/[0.05]" />
        </div>
        <div className="w-full h-9 rounded-lg bg-white/[0.08]" />
      </div>
    </div>
  );
}

export function SkeletonPageCard() {
  return (
    <div className="rounded-2xl bg-[#0c0f16]/90 border border-white/[0.08] p-5 flex flex-col justify-between space-y-4 animate-shimmer relative overflow-hidden">
      <div className="space-y-3">
        {/* Avatar and Info */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/[0.1] shrink-0" />
          <div className="space-y-1.5 flex-1">
            <div className="w-3/4 h-4 rounded bg-white/[0.12]" />
            <div className="w-1/2 h-3 rounded bg-white/[0.06]" />
          </div>
        </div>

        {/* Category & Stats */}
        <div className="flex items-center gap-2 pt-2">
          <div className="w-20 h-5 rounded-full bg-white/[0.06]" />
          <div className="w-24 h-5 rounded-full bg-white/[0.06]" />
        </div>

        {/* Post snippet */}
        <div className="p-3 rounded-lg bg-white/[0.03] space-y-1.5">
          <div className="w-full h-3 rounded bg-white/[0.06]" />
          <div className="w-4/5 h-3 rounded bg-white/[0.06]" />
        </div>
      </div>

      {/* Action button */}
      <div className="w-full h-10 rounded-xl bg-white/[0.08]" />
    </div>
  );
}

export function SearchProgressBanner() {
  return (
    <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-zinc-900/60 to-emerald-950/40 border border-cyan-500/30 shadow-[0_0_20px_rgba(0,240,255,0.12)] space-y-3 animate-in fade-in duration-300">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
          <Cpu className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
          <span className="font-semibold uppercase tracking-wider">A Processar Consulta em Tempo Real</span>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          A compilar operadores e páginas Facebook
        </span>
      </div>

      {/* Animated Scan Line */}
      <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden relative">
        <div className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-400 rounded-full animate-shimmer w-full" />
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
        <span>1. Compilação Dorks</span>
        <span className="text-cyan-400">2. Estruturação em Páginas</span>
        <span>3. Validação de Links</span>
      </div>
    </div>
  );
}
