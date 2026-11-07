'use client';

import React from 'react';
import { clsx } from 'clsx';
import { DateFilterOption } from '@/types';
import { Calendar, Clock, Flame } from 'lucide-react';

interface TemporalFilterProps {
  value: DateFilterOption;
  onChange: (filter: DateFilterOption) => void;
  disabled?: boolean;
}

const filterOptions: Array<{ id: DateFilterOption; label: string; short: string; badge?: string }> = [
  { id: '24h', label: 'Últimas 24 horas', short: '24h', badge: 'Urgente' },
  { id: '3d', label: 'Últimos 3 dias', short: '3 dias' },
  { id: '7d', label: 'Últimos 7 dias', short: '7 dias (Padrão)', badge: 'Recomendado' },
  { id: '14d', label: 'Últimos 14 dias', short: '14 dias' },
  { id: '30d', label: 'Últimos 30 dias', short: '30 dias' },
  { id: 'all', label: 'Qualquer data', short: 'Histórico Completo' },
];

export function TemporalFilter({ value, onChange, disabled }: TemporalFilterProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          Filtro Temporal Inteligente
        </label>
        <span className="text-[11px] text-zinc-400 font-mono">
          Operador Google: <code className="text-cyan-400 font-semibold">{value === 'all' ? 'Sem restrição temporal' : `after:${value}`}</code>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {filterOptions.map((opt) => {
          const isSelected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt.id)}
              className={clsx(
                'relative flex flex-col items-center justify-center p-2.5 rounded-lg border text-left transition-all group',
                isSelected
                  ? 'bg-cyan-950/30 border-cyan-500/60 text-white shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                  : 'bg-zinc-900/40 border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.04] hover:border-white/[0.12]',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <span className={clsx('text-xs font-medium font-mono', isSelected ? 'text-cyan-400' : 'text-zinc-300')}>
                {opt.label}
              </span>
              {opt.badge && (
                <span
                  className={clsx(
                    'mt-1 text-[9px] uppercase font-mono px-1.5 py-0.2 rounded',
                    isSelected ? 'bg-cyan-900/60 text-cyan-300' : 'bg-zinc-800 text-zinc-500 group-hover:text-zinc-400'
                  )}
                >
                  {opt.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
