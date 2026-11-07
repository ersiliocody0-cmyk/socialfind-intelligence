'use client';

import React from 'react';
import { SearchSummaryMetrics } from '@/types';
import { Layers, Clock, Flame, ShieldCheck, Target, Sparkles } from 'lucide-react';

interface MetricsCardsProps {
  metrics: SearchSummaryMetrics;
  isDemo?: boolean;
}

export function MetricsCards({ metrics, isDemo = false }: MetricsCardsProps) {
  const cards = [
    {
      label: 'Resultados Encontrados',
      value: metrics.totalResults,
      icon: Layers,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-950/20',
      borderColor: 'border-cyan-800/30',
      description: 'Publicações indexadas no Facebook',
    },
    {
      label: 'Publicações Recentes',
      value: metrics.recentPostsCount,
      icon: Clock,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/20',
      borderColor: 'border-emerald-800/30',
      description: 'Detectadas nos últimos 7 dias',
    },
    {
      label: 'Últimas 24 Horas',
      value: metrics.last24hCount,
      icon: Flame,
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/20',
      borderColor: 'border-amber-800/30',
      description: 'Atividade em tempo real',
    },
    {
      label: 'Data Confirmada',
      value: metrics.confirmedDateCount,
      icon: ShieldCheck,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-950/20',
      borderColor: 'border-cyan-800/30',
      description: 'Carimbo temporal verificado',
    },
    {
      label: 'Alta Relevância',
      value: metrics.highRelevanceCount,
      icon: Target,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/20',
      borderColor: 'border-emerald-800/30',
      description: 'Correspondência superior a 80%',
    },
  ];

  return (
    <div className="w-full space-y-2">
      {isDemo && (
        <div className="px-3 py-1.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-[11px] font-mono text-amber-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            MODO DEMONSTRAÇÃO ATIVO: Dados fictícios estruturados para teste imediato de interface e validação de fluxo.
          </span>
          <span className="uppercase text-[9px] px-1.5 py-0.5 rounded bg-amber-900/60 font-semibold">Demo Sandbox</span>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#0c0f15]/90 border border-white/[0.08] hover:border-white/[0.16] transition-all relative overflow-hidden group shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  {card.label}
                </span>
                <div className={`p-1.5 rounded-md ${card.bgColor} ${card.borderColor} border`}>
                  <Icon className={`w-3.5 h-3.5 ${card.color}`} />
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-white font-mono">
                  {card.value}
                </span>
              </div>

              <p className="text-[10px] text-zinc-400 mt-1 line-clamp-1">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
