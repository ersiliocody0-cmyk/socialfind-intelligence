'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { SearchResult } from '@/types';

interface ActivityChartsProps {
  results: SearchResult[];
}

export function ActivityCharts({ results }: ActivityChartsProps) {
  if (!results || results.length === 0) return null;

  // 1. Group by content type
  const typeCounts: Record<string, number> = {};
  for (const r of results) {
    typeCounts[r.contentType] = (typeCounts[r.contentType] || 0) + 1;
  }

  const typeLabels: Record<string, string> = {
    post: 'Publicações',
    group: 'Grupos',
    page: 'Páginas',
    video: 'Vídeos',
    photo: 'Fotos',
    marketplace: 'Mercado',
    other: 'Outros',
  };

  const typeData = Object.entries(typeCounts).map(([key, count]) => ({
    name: typeLabels[key] || key,
    count,
  }));

  // 2. Group by confidence level
  const confCounts: Record<string, number> = {
    high: 0,
    medium: 0,
    low: 0,
    unconfirmed: 0,
  };

  for (const r of results) {
    confCounts[r.dateConfidence] = (confCounts[r.dateConfidence] || 0) + 1;
  }

  const confidenceData = [
    { name: 'Alta Confiança', value: confCounts.high, color: '#10b981' },
    { name: 'Média Confiança', value: confCounts.medium, color: '#f59e0b' },
    { name: 'Baixa Confiança', value: confCounts.low, color: '#f43f5e' },
    { name: 'Não Confirmada', value: confCounts.unconfirmed, color: '#71717a' },
  ].filter(d => d.value > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Chart 1: Content Type Distribution */}
      <div className="p-4 rounded-xl bg-[#0b0e14]/90 border border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            Distribuição por Formato
          </h4>
          <span className="text-[10px] font-mono text-cyan-400">Classificação IA</span>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0c0f16',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="count" fill="#00f0ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Date Confidence Breakdown */}
      <div className="p-4 rounded-xl bg-[#0b0e14]/90 border border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            Confiança Temporal dos Resultados
          </h4>
          <span className="text-[10px] font-mono text-emerald-400">Auditoria</span>
        </div>
        <div className="h-44 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={confidenceData}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={62}
                paddingAngle={4}
                dataKey="value"
              >
                {confidenceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0c0f16',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-3 flex-wrap text-[10px] font-mono">
          {confidenceData.map((d, i) => (
            <div key={i} className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
              <span>{d.name}: {d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
