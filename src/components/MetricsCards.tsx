'use client';

import React from 'react';
import { SearchSummaryMetrics } from '@/types';
import { Card3D } from './Card3D';
import { AnimatedNumber } from './AnimatedNumber';
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
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/20',
      borderColor: 'border-cyan-200 dark:border-cyan-800/30',
      description: 'Publicações indexadas no Facebook',
    },
    {
      label: 'Publicações Recentes',
      value: metrics.recentPostsCount,
      icon: Clock,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800/30',
      description: 'Detectadas nos últimos 7 dias',
    },
    {
      label: 'Últimas 24 Horas',
      value: metrics.last24hCount,
      icon: Flame,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20',
      borderColor: 'border-amber-200 dark:border-amber-800/30',
      description: 'Atividade em tempo real',
    },
    {
      label: 'Data Confirmada',
      value: metrics.confirmedDateCount,
      icon: ShieldCheck,
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/20',
      borderColor: 'border-cyan-200 dark:border-cyan-800/30',
      description: 'Carimbo temporal verificado',
    },
    {
      label: 'Alta Relevância',
      value: metrics.highRelevanceCount,
      icon: Target,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800/30',
      description: 'Correspondência superior a 80%',
    },
  ];

  return (
    <div className="w-full space-y-2">
      {isDemo && (
        <div className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-[11px] font-mono text-amber-800 dark:text-amber-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            MODO DEMONSTRAÇÃO ATIVO: Dados fictícios estruturados para teste imediato de interface e validação de fluxo.
          </span>
          <span className="uppercase text-[9px] px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-900/60 font-semibold text-amber-900 dark:text-amber-200">Demo Sandbox</span>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card3D key={idx} maxTilt={5} glare={false}>
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#0c0f15]/95 border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.18] transition-all relative overflow-hidden group shadow-sm h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                      {card.label}
                    </span>
                    <div className={`p-1.5 rounded-md ${card.bgColor} ${card.borderColor} border`}>
                      <Icon className={`w-3.5 h-3.5 ${card.color}`} />
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
                      <AnimatedNumber value={card.value} />
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-2 line-clamp-1">
                  {card.description}
                </p>
              </div>
            </Card3D>
          );
        })}
      </div>
    </div>
  );
}
