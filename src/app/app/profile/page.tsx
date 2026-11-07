'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { User, ShieldCheck, Zap, Key, Activity, Sparkles } from 'lucide-react';

export default function ProfilePage() {
  return (
    <>
      <Header
        title="Perfil & Subscrição SaaS"
        subtitle="Gestão de conta, consumo de cotas e limites do plano"
      />

      <main className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
        {/* User Card */}
        <div className="p-6 rounded-2xl bg-[#0b0e14] border border-white/[0.08] flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1px] shadow-glow-cyan">
              <div className="w-full h-full bg-[#0a0d14] rounded-[15px] flex items-center justify-center text-cyan-400">
                <User className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white">Analista de Inteligência</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                  Plano Pro
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">analyst@socialfind.intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Sessão Ativa
            </span>
          </div>
        </div>

        {/* Quota & Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-[#0b0e14] border border-white/[0.08] space-y-2">
            <span className="text-[10px] font-mono uppercase text-zinc-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Pesquisas Hoje
            </span>
            <div className="text-2xl font-bold font-mono text-white">18 <span className="text-xs text-zinc-400 font-normal">/ 500</span></div>
            <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div className="w-[3.6%] h-full bg-cyan-400 rounded-full" />
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#0b0e14] border border-white/[0.08] space-y-2">
            <span className="text-[10px] font-mono uppercase text-zinc-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              Operadores Dorks Compilados
            </span>
            <div className="text-2xl font-bold font-mono text-emerald-400">92</div>
            <p className="text-[11px] text-zinc-400 font-mono">Variações automáticas</p>
          </div>

          <div className="p-5 rounded-xl bg-[#0b0e14] border border-white/[0.08] space-y-2">
            <span className="text-[10px] font-mono uppercase text-zinc-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Nível de Precisão
            </span>
            <div className="text-2xl font-bold font-mono text-cyan-400">99.4%</div>
            <p className="text-[11px] text-zinc-400 font-mono">Exclusividade Facebook</p>
          </div>
        </div>
      </main>
    </>
  );
}
