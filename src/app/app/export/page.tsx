'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { FavoriteItem, SearchHistoryItem } from '@/types';
import { AnimatedSection } from '@/components/AnimatedSection';
import { StaggerList, StaggerItem } from '@/components/StaggerList';
import { FileDown, FileText, Database, Code, CheckCircle, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ExportPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'json' | 'markdown'>('csv');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetch('/api/favorites').then(r => r.json()).then(d => { if (d.favorites) setFavorites(d.favorites); });
    fetch('/api/history').then(r => r.json()).then(d => { if (d.history) setHistory(d.history); });
  }, []);

  const handleExportData = async (source: 'favorites') => {
    if (source === 'favorites' && favorites.length === 0) {
      toast.error('Não existem favoritos para exportar.');
      return;
    }

    setIsExporting(true);
    try {
      toast.loading('A preparar ficheiro estruturado...', { id: 'exp' });
      const results = favorites.map(f => f.result);
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format: selectedFormat,
          results,
          query: 'socialfind-export',
        }),
      });

      if (!res.ok) throw new Error('Falha no download');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `socialfind-export-${Date.now()}.${selectedFormat === 'markdown' ? 'md' : selectedFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Download concluído com sucesso!', { id: 'exp' });
    } catch {
      toast.error('Erro na exportação do ficheiro.', { id: 'exp' });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Header
        title="Centro de Exportação de Dados"
        subtitle="Extração estruturada de publicações e relatórios de inteligência"
      />

      <main className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
        {/* Format Selector */}
        <AnimatedSection className="p-6 rounded-2xl bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/[0.08] space-y-4 shadow-sm transition-colors duration-300">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileDown className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            <span>1. Escolha o Formato do Ficheiro</span>
          </h2>

          <StaggerList className="grid grid-cols-1 sm:grid-cols-3 gap-3" staggerDelay={0.06}>
            {[
              { id: 'csv', label: 'CSV (Planilha)', desc: 'Excel, Google Sheets, Pandas', icon: FileText },
              { id: 'json', label: 'JSON Estruturado', desc: 'Pipelines e APIs externas', icon: Code },
              { id: 'markdown', label: 'Markdown Relatório', desc: 'Documentação limpa para partilha', icon: Database },
            ].map((f) => {
              const Icon = f.icon;
              const isSelected = selectedFormat === f.id;
              return (
                <StaggerItem key={f.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedFormat(f.id as any)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-500 text-slate-950 dark:text-white shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                        : 'bg-slate-50 dark:bg-black/30 border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-zinc-500'}`} />
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">{f.label}</div>
                    <div className="text-[11px] text-slate-500 dark:text-zinc-500 mt-0.5">{f.desc}</div>
                  </button>
                </StaggerItem>
              );
            })}
          </StaggerList>
        </AnimatedSection>

        {/* Source Cards */}
        <AnimatedSection className="p-6 rounded-2xl bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/[0.08] space-y-4 shadow-sm transition-colors duration-300">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span>2. Selecione a Origem dos Dados</span>
          </h2>

          <div className="p-5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Publicações nos Favoritos</h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">
                Total de {favorites.length} publicações arquivadas com todas as notas e metadados.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleExportData('favorites')}
              disabled={favorites.length === 0 || isExporting}
              className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shrink-0 min-w-[170px] shadow-sm"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 text-slate-950 animate-spin" />
                  <span>A processar...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Descarregar ({favorites.length})</span>
                </>
              )}
            </button>
          </div>
        </AnimatedSection>

        {/* Schema Documentation Strip */}
        <AnimatedSection className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900/30 border border-slate-200 dark:border-white/[0.06] space-y-2 text-xs font-mono text-slate-600 dark:text-zinc-400 transition-colors duration-300">
          <span className="text-slate-900 dark:text-white font-semibold block mb-1">Campos incluídos no ficheiro exportado:</span>
          <p className="leading-relaxed">
            <code>Título</code>, <code>URL</code>, <code>Grupo_ou_Fonte</code>, <code>Tipo_Conteudo</code>, <code>Data_Publicacao</code>, <code>Confianca_Data</code>, <code>Relevancia</code>, <code>Excerto</code>.
          </p>
        </AnimatedSection>
      </main>
    </>
  );
}
