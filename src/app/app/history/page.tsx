'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { SearchHistoryItem } from '@/types';
import { SkeletonHistoryRow } from '@/components/SkeletonLoader';
import { AnimatedSection } from '@/components/AnimatedSection';
import { StaggerList, StaggerItem } from '@/components/StaggerList';
import { 
  History, 
  Trash2, 
  Search, 
  ArrowRight, 
  Clock, 
  Layers, 
  Terminal,
  Calendar,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function HistoryPage() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);

  const fetchHistory = () => {
    setIsLoading(true);
    fetch('/api/history')
      .then((res) => res.json())
      .then((data) => {
        if (data.history) setHistory(data.history);
      })
      .catch(() => toast.error('Erro ao carregar histórico.'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClearHistory = async () => {
    if (!confirm('Tem a certeza que deseja limpar todo o histórico de pesquisas?')) return;
    setIsClearing(true);
    try {
      const res = await fetch('/api/history', { method: 'DELETE' });
      if (res.ok) {
        setHistory([]);
        toast.success('Histórico apagado com sucesso.');
      }
    } catch {
      toast.error('Erro ao limpar histórico.');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <>
      <Header
        title="Histórico de Auditoria"
        subtitle="Registo de consultas executadas, intenções e métricas de descoberta"
      />

      <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <AnimatedSection className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-semibold text-white tracking-tight">
              Consultas Registadas ({history.length})
            </h2>
          </div>

          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              disabled={isClearing}
              className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 disabled:opacity-50 border border-rose-800/40 text-xs font-mono text-rose-300 hover:text-white flex items-center gap-1.5 transition-all"
            >
              {isClearing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                  <span>A limpar...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Limpar Histórico</span>
                </>
              )}
            </button>
          )}
        </AnimatedSection>

        {isLoading ? (
          <div className="rounded-2xl bg-[#0b0e14] border border-white/[0.08] divide-y divide-white/[0.06] overflow-hidden shadow-sm">
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonHistoryRow key={i} />
            ))}
          </div>
        ) : history.length > 0 ? (
          <StaggerList className="rounded-2xl bg-[#0b0e14] border border-white/[0.08] divide-y divide-white/[0.06] overflow-hidden shadow-sm">
            {history.map((item) => (
              <StaggerItem
                key={item.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-white">{item.query}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                      {item.intent.detectedIntentLabel}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      Filtro: {item.dateFilter}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-zinc-400" />
                      {item.resultsCount} resultados
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      {new Date(item.createdAt).toLocaleString('pt-PT')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/app/search?q=${encodeURIComponent(item.query)}`}
                    className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-cyan-500 hover:text-black border border-white/[0.1] hover:border-cyan-400 text-xs font-mono uppercase tracking-wider text-white transition-all flex items-center gap-1.5"
                  >
                    <span>Repetir Pesquisa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </StaggerList>
        ) : (
          <div className="p-12 rounded-2xl bg-[#0b0e14]/50 border border-white/[0.06] text-center space-y-3 max-w-md mx-auto my-8">
            <Clock className="w-6 h-6 mx-auto text-zinc-600" />
            <h3 className="text-sm font-semibold text-white">Sem histórico registado</h3>
            <p className="text-xs text-zinc-500">
              As suas pesquisas e parâmetros de descoberta ficarão salvaguardados aqui para reanálise futura.
            </p>
            <Link
              href="/app/search"
              className="inline-block px-4 py-2 rounded-lg bg-cyan-500 text-black text-xs font-mono font-semibold uppercase tracking-wider mt-2"
            >
              Fazer Primeira Pesquisa
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
