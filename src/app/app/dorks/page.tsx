'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { generateFacebookDorks } from '@/lib/dork-builder';
import { DateFilterOption, DorkQuery, ParsedIntent } from '@/types';
import { AnimatedSection } from '@/components/AnimatedSection';
import { StaggerList, StaggerItem } from '@/components/StaggerList';
import { 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Search, 
  HelpCircle, 
  Zap,
  Code
} from 'lucide-react';
import { toast } from 'sonner';

export default function DorksStudioPage() {
  const [query, setQuery] = useState('Samsung à venda');
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('7d');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { intent, dorks } = generateFacebookDorks(query, dateFilter);

  const handleCopy = async (dorkText: string, id: string) => {
    try {
      await navigator.clipboard.writeText(dorkText);
      setCopiedId(id);
      toast.success('Dork copiado para a área de transferência!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Erro ao copiar.');
    }
  };

  const handleOpenGoogle = (dorkText: string) => {
    const url = `https://www.google.com/search?q=${encodeURIComponent(dorkText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <Header
        title="Dorks Intelligence Studio"
        subtitle="Laboratório de engenharia reversa e compilação de operadores Google"
      />

      <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Studio Controls Card */}
        <AnimatedSection className="p-6 rounded-2xl bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/[0.08] space-y-5 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
              Compilador Interativo de Google Dorks
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-mono uppercase text-slate-500 dark:text-zinc-400">
                Termo de Pesquisa
              </label>
              <div className="flex items-center p-2 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/[0.1] focus-within:border-cyan-500/80">
                <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 ml-2 mr-2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Introduza a expressão para dissecar..."
                  className="w-full bg-transparent text-sm text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-slate-500 dark:text-zinc-400">
                Filtro Temporal (Operador after)
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/[0.1] text-xs font-mono text-slate-900 dark:text-white outline-none focus:border-cyan-500/80 shadow-sm"
              >
                <option value="24h">Últimas 24 horas</option>
                <option value="3d">Últimos 3 dias</option>
                <option value="7d">Últimos 7 dias (Padrão)</option>
                <option value="14d">Últimos 14 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="all">Qualquer data (Sem after)</option>
              </select>
            </div>
          </div>
        </AnimatedSection>

        {/* Parsed Intent Intelligence Summary */}
        <AnimatedSection className="p-5 rounded-xl bg-slate-50 dark:bg-zinc-900/40 border border-slate-200 dark:border-white/[0.06] space-y-3 shadow-sm transition-colors duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
              Análise Semântica de Intenção
            </span>
            <span className="text-xs font-mono text-cyan-700 dark:text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/40">
              {intent.detectedIntentLabel}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-white dark:bg-black/30 border border-slate-200 dark:border-white/[0.04]">
              <span className="text-slate-500 dark:text-zinc-500 block mb-1">Palavras-chave Extraídas:</span>
              <span className="text-slate-900 dark:text-white font-medium">{intent.mainKeywords.join(', ') || 'N/A'}</span>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-black/30 border border-slate-200 dark:border-white/[0.04]">
              <span className="text-slate-500 dark:text-zinc-500 block mb-1">Localização Identificada:</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-medium">{intent.location || 'Global / Não especificada'}</span>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-black/30 border border-slate-200 dark:border-white/[0.04]">
              <span className="text-slate-500 dark:text-zinc-500 block mb-1">Sinónimos Automáticos:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{intent.synonyms.slice(0, 3).join(', ') || 'N/A'}</span>
            </div>
          </div>
        </AnimatedSection>

        {/* Dorks Variations Output */}
        <AnimatedSection className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Code className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
              <span>Consultas Google Dorks Compiladas ({dorks.length})</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-500">Prontas para execução direta</span>
          </div>

          <StaggerList className="space-y-4" staggerDelay={0.06}>
            {dorks.map((dork) => (
              <StaggerItem
                key={dork.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/[0.08] hover:border-cyan-300 dark:hover:border-white/[0.18] transition-all space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{dork.name}</span>
                    <span className="text-[10px] font-mono text-cyan-700 dark:text-cyan-400 px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/40">
                      {dork.strategy}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(dork.dork, dork.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.12] border border-slate-200 dark:border-white/[0.08] text-xs font-mono text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      {copiedId === dork.id ? <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === dork.id ? 'Copiado!' : 'Copiar Dork'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenGoogle(dork.dork)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 border border-cyan-200 dark:border-cyan-800/40 text-xs font-mono text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Testar no Google</span>
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-200 dark:border-white/[0.06] font-mono text-xs text-cyan-800 dark:text-cyan-300 break-all select-all">
                  {dork.dork}
                </div>

                <p className="text-xs text-slate-600 dark:text-zinc-400 flex items-start gap-2 leading-relaxed">
                  <HelpCircle className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0 mt-0.5" />
                  <span>{dork.explanation}</span>
                </p>
              </StaggerItem>
            ))}
          </StaggerList>
        </AnimatedSection>
      </main>
    </>
  );
}
