'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, Key, Sparkles, Sliders, ArrowRight } from 'lucide-react';

interface PendingConfigNoticeProps {
  onEnableDemo?: () => void;
}

export function PendingConfigNotice({ onEnableDemo }: PendingConfigNoticeProps) {
  return (
    <div className="w-full max-w-2xl mx-auto my-8 p-6 rounded-2xl bg-[#0e1118] border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.08)] space-y-5">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-800/40 text-amber-400 shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-white tracking-tight">
            Configuração de Motor de Pesquisa Pendente
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Nenhuma chave de API de pesquisa SERP em tempo real foi detetada e o Modo Demonstração está desligado. O SocialFind Intelligence não simula resultados falsos sem consentimento explícito.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {/* Option 1: Configure Real API */}
        <Link
          href="/app/settings"
          className="p-4 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-white/[0.08] hover:border-white/[0.2] transition-all flex flex-col justify-between group"
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                Configurar Chaves de API
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Adicione as suas credenciais do Google Programmable Search (CSE) ou Serper.dev para efetuar pesquisas reais em tempo real.
            </p>
          </div>
          <span className="mt-3 text-[10px] font-mono uppercase tracking-wider text-cyan-400">
            Abrir Configurações →
          </span>
        </Link>

        {/* Option 2: Enable Demo Mode */}
        <button
          type="button"
          onClick={onEnableDemo}
          className="p-4 rounded-xl bg-amber-950/20 hover:bg-amber-950/40 border border-amber-800/30 hover:border-amber-600/50 transition-all flex flex-col justify-between text-left group"
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Ativar Modo Demonstração
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-500 group-hover:text-amber-300 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Explore toda a experiência, filtros temporais e métricas com dados fictícios de teste claramente identificados.
            </p>
          </div>
          <span className="mt-3 text-[10px] font-mono uppercase tracking-wider text-amber-400">
            Ativar Sandbox Demo →
          </span>
        </button>
      </div>
    </div>
  );
}
