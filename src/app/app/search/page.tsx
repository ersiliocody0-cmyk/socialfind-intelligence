'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { TemporalFilter } from '@/components/TemporalFilter';
import { MetricsCards } from '@/components/MetricsCards';
import { PostCard } from '@/components/PostCard';
import { FacebookPageCard } from '@/components/FacebookPageCard';
import { DorksPreviewModal } from '@/components/DorksPreviewModal';
import { ResultDetailModal } from '@/components/ResultDetailModal';
import { PendingConfigNotice } from '@/components/PendingConfigNotice';
import { ActivityCharts } from '@/components/ActivityCharts';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { AnimatedSection } from '@/components/AnimatedSection';
import { StaggerList, StaggerItem } from '@/components/StaggerList';
import { 
  SkeletonMetrics, 
  SkeletonPostCard, 
  SkeletonPageCard, 
  SearchProgressBanner 
} from '@/components/SkeletonLoader';
import { 
  ContentType, 
  DateFilterOption, 
  DorkQuery, 
  ParsedIntent, 
  SearchResult, 
  FacebookPageGroup,
  SearchSummaryMetrics 
} from '@/types';
import { 
  Terminal, 
  Download, 
  ArrowUpDown, 
  Filter, 
  Search as SearchIcon,
  Globe,
  FileText,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { clsx } from 'clsx';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('7d'); // Default 7 days
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [pendingConfig, setPendingConfig] = useState(false);

  // Results & Pages State
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [pages, setPages] = useState<FacebookPageGroup[]>([]);
  const [metrics, setMetrics] = useState<SearchSummaryMetrics | null>(null);
  const [currentIntent, setCurrentIntent] = useState<ParsedIntent | null>(null);
  const [generatedDorks, setGeneratedDorks] = useState<DorkQuery[]>([]);
  const [favoritesMap, setFavoritesMap] = useState<Record<string, boolean>>({});

  // View Mode: 'posts' or 'pages'
  const [viewMode, setViewMode] = useState<'posts' | 'pages'>('posts');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  // Filter & Sort State
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'title'>('relevance');

  // Modals
  const [isDorksModalOpen, setIsDorksModalOpen] = useState(false);
  const [selectedResultForDetail, setSelectedResultForDetail] = useState<SearchResult | null>(null);

  // Load initial favorites from backend
  useEffect(() => {
    fetch('/api/favorites')
      .then((res) => res.json())
      .then((data) => {
        if (data.favorites) {
          const map: Record<string, boolean> = {};
          data.favorites.forEach((f: any) => {
            map[f.resultId] = true;
          });
          setFavoritesMap(map);
        }
      })
      .catch(() => {});
  }, []);

  // Trigger search if url query is present on mount
  useEffect(() => {
    if (initialQuery) {
      handleExecuteSearch(initialQuery, dateFilter);
    }
  }, [initialQuery]);

  // Apply in-memory filters & sorting whenever results, filter or sort changes
  useEffect(() => {
    let list = [...results];

    // Filter by content type
    if (contentTypeFilter !== 'all') {
      list = list.filter((r) => r.contentType === contentTypeFilter);
    }

    // Sort
    if (sortBy === 'relevance') {
      list.sort((a, b) => b.relevanceScore - a.relevanceScore);
    } else if (sortBy === 'date') {
      list.sort((a, b) => {
        const timeA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const timeB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return timeB - timeA;
      });
    } else if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredResults(list);
    setCurrentPage(1); // reset to page 1 on filter/sort change
  }, [results, contentTypeFilter, sortBy]);

  const handleExecuteSearch = async (searchQuery?: string, filterOverride?: DateFilterOption) => {
    const q = (searchQuery || query).trim();
    const activeFilter = filterOverride || dateFilter;

    if (!q) {
      toast.error('Por favor, introduza uma palavra-chave ou termo para pesquisar.');
      return;
    }

    setIsLoading(true);
    setPendingConfig(false);

    const startTime = Date.now();

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          dateFilter: activeFilter,
          customSettings: {
            demoModeEnabled: isDemoMode,
          },
        }),
      });

      // Ensure scanning feedback and skeletons are clearly visible for at least 750ms
      const elapsed = Date.now() - startTime;
      if (elapsed < 750) {
        await new Promise((resolve) => setTimeout(resolve, 750 - elapsed));
      }

      const data = await response.json();

      if (response.status === 428 || data.status === 'pending_config') {
        setPendingConfig(true);
        setCurrentIntent(data.intent || null);
        setGeneratedDorks(data.dorks || []);
        toast.info('Configuração de API pendente. Ative o modo demonstração ou configure credenciais.');
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar a pesquisa.');
      }

      setResults(data.results || []);
      setPages(data.pages || []);
      setMetrics(data.metrics || null);
      setCurrentIntent(data.intent || null);
      setGeneratedDorks(data.dorks || []);
      setIsDemoMode(Boolean(data.isDemo));
      setCurrentPage(1);

      toast.success(`Pesquisa concluída! Encontrados ${data.results?.length || 0} resultados em ${data.pages?.length || 0} páginas.`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Falha na pesquisa.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async (result: SearchResult) => {
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result }),
      });
      const data = await res.json();
      if (data.success) {
        setFavoritesMap((prev) => ({
          ...prev,
          [result.id]: data.isFavorite,
        }));
        if (data.isFavorite) {
          toast.success('Publicação guardada nos favoritos!');
        } else {
          toast.info('Removida dos favoritos.');
        }
      }
    } catch {
      toast.error('Não foi possível atualizar favoritos.');
    }
  };

  const handleExport = async (format: 'csv' | 'json' | 'markdown') => {
    if (results.length === 0) {
      toast.error('Não existem resultados para exportar.');
      return;
    }

    try {
      toast.loading(`A gerar ficheiro ${format.toUpperCase()}...`, { id: 'export' });
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format,
          results: filteredResults,
          query: query || 'pesquisa',
        }),
      });

      if (!res.ok) throw new Error('Falha na exportação');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `socialfind-${query.replace(/\s+/g, '_')}.${format === 'markdown' ? 'md' : format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`Ficheiro descarregado com sucesso!`, { id: 'export' });
    } catch {
      toast.error('Erro ao exportar dados.', { id: 'export' });
    }
  };

  // Pagination Computations
  const totalPostPages = Math.max(1, Math.ceil(filteredResults.length / pageSize));
  const totalPageGroups = Math.max(1, Math.ceil(pages.length / pageSize));
  const activeTotalPages = viewMode === 'posts' ? totalPostPages : totalPageGroups;

  const paginatedPosts = filteredResults.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const paginatedPages = pages.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <Header
        title="Motor de Descoberta SocialFind"
        subtitle="Construção inteligente de Google Dorks com filtragem temporal estrita"
        isDemo={isDemoMode}
      />

      <main className="p-3.5 sm:p-6 md:p-8 space-y-5 sm:space-y-6 max-w-7xl mx-auto w-full">
        {/* Central Search Card */}
        <section className="p-4 sm:p-6 rounded-2xl bg-[#0b0e14]/90 border border-white/[0.08] shadow-sm space-y-4 sm:space-y-5">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            onSearch={(q) => handleExecuteSearch(q)}
            isLoading={isLoading}
          />

          <TemporalFilter
            value={dateFilter}
            onChange={(newFilter) => {
              setDateFilter(newFilter);
              if (query.trim()) {
                handleExecuteSearch(query, newFilter);
              }
            }}
            disabled={isLoading}
          />

          {/* Dorks Intelligence Bar Preview */}
          {generatedDorks.length > 0 && (
            <div className="pt-2 flex items-center justify-between border-t border-white/[0.06] flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Estratégia Ativa:</span>
                <span className="text-white font-medium">{currentIntent?.detectedIntentLabel || 'Pesquisa Dork'}</span>
                <span className="text-zinc-600">|</span>
                <span className="text-cyan-400">{generatedDorks.length} Dorks Compilados</span>
              </div>

              <button
                type="button"
                onClick={() => setIsDorksModalOpen(true)}
                className="px-3 py-1 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/40 text-xs font-mono text-cyan-300 flex items-center gap-1.5 transition-all"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Inspecionar Dorks Gerados</span>
              </button>
            </div>
          )}
        </section>

        {/* Dynamic Scanning Progress Banner when Search is active */}
        {isLoading && <SearchProgressBanner />}

        {/* Pending Config Notice */}
        {pendingConfig && (
          <PendingConfigNotice
            onEnableDemo={() => {
              setIsDemoMode(true);
              setPendingConfig(false);
              handleExecuteSearch(query, dateFilter);
            }}
          />
        )}

        {/* Metrics Row or Skeleton Metrics */}
        {isLoading ? (
          <section>
            <SkeletonMetrics />
          </section>
        ) : metrics && !pendingConfig ? (
          <section>
            <MetricsCards metrics={metrics} isDemo={isDemoMode} />
          </section>
        ) : null}

        {/* Results View Controls: View Mode Tabs (Publicações vs Páginas) & Filters */}
        {results.length > 0 && !pendingConfig && !isLoading && (
          <section className="space-y-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/40 border border-white/[0.06]">
              {/* Left: View Mode Switcher (Publicações vs Páginas do Facebook) */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="flex items-center p-1 bg-black/50 border border-white/[0.08] rounded-xl w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('posts');
                      setCurrentPage(1);
                    }}
                    className={clsx(
                      'px-3.5 py-1.5 rounded-lg text-xs font-mono flex items-center justify-center gap-2 transition-all flex-1 sm:flex-initial',
                      viewMode === 'posts'
                        ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                        : 'text-zinc-400 hover:text-white'
                    )}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Publicações ({filteredResults.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('pages');
                      setCurrentPage(1);
                    }}
                    className={clsx(
                      'px-3.5 py-1.5 rounded-lg text-xs font-mono flex items-center justify-center gap-2 transition-all flex-1 sm:flex-initial',
                      viewMode === 'pages'
                        ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                        : 'text-zinc-400 hover:text-white'
                    )}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Páginas do Facebook ({pages.length})</span>
                  </button>
                </div>
              </div>

              {/* Middle: Content Type Chips (for posts) */}
              {viewMode === 'posts' && (
                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar text-xs font-mono">
                  <span className="text-zinc-500 uppercase text-[10px] mr-1 flex items-center gap-1">
                    <Filter className="w-3 h-3" /> Tipo:
                  </span>
                  {[
                    { id: 'all', label: 'Todos' },
                    { id: 'post', label: 'Posts' },
                    { id: 'group', label: 'Grupos' },
                    { id: 'video', label: 'Vídeos' },
                    { id: 'marketplace', label: 'Vendas' },
                  ].map((chip) => (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => setContentTypeFilter(chip.id)}
                      className={clsx(
                        'px-2.5 py-1 rounded-md transition-all whitespace-nowrap',
                        contentTypeFilter === chip.id
                          ? 'bg-white text-black font-semibold'
                          : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08]'
                      )}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Right: Sorting & Export */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                {viewMode === 'posts' && (
                  <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
                    <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-black/50 border border-white/[0.1] rounded-lg px-2.5 py-1 text-white text-xs outline-none focus:border-cyan-500/80"
                    >
                      <option value="relevance">Mais Relevantes</option>
                      <option value="date">Mais Recentes</option>
                      <option value="title">Ordem Alfabética</option>
                    </select>
                  </div>
                )}

                {/* Export Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleExport('csv')}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1 transition-all"
                    title="Exportar como CSV"
                  >
                    <Download className="w-3 h-3" />
                    <span>CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport('json')}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1 transition-all"
                    title="Exportar como JSON"
                  >
                    <span>JSON</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport('markdown')}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1 transition-all"
                    title="Exportar Relatório Markdown"
                  >
                    <span>MD</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Results Section: Loading Skeleton OR Posts OR Pages OR Empty */}
        <section className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((sk) => (
                <SkeletonPostCard key={sk} />
              ))}
            </div>
          ) : viewMode === 'pages' ? (
            /* ================= FACEBOOK PAGES VIEW ================= */
            paginatedPages.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
                  <span>
                    A mostrar <AnimatedNumber value={paginatedPages.length} /> páginas encontradas com atividade relevante
                  </span>
                  <span className="text-cyan-400">Página {currentPage} de {totalPageGroups}</span>
                </div>

                <StaggerList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" staggerDelay={0.05}>
                  {paginatedPages.map((pageGroup) => (
                    <StaggerItem key={pageGroup.id}>
                      <FacebookPageCard
                        page={pageGroup}
                        onOpenResultDetails={(r) => setSelectedResultForDetail(r)}
                      />
                    </StaggerItem>
                  ))}
                </StaggerList>
              </div>
            ) : results.length > 0 ? (
              <div className="p-8 rounded-xl bg-[#0b0e14] border border-white/[0.06] text-center text-xs text-zinc-400 font-mono">
                Nenhuma página agrupada para este filtro. Mude para a aba &quot;Publicações&quot;.
              </div>
            ) : null
          ) : (
            /* ================= POSTS VIEW ================= */
            paginatedPosts.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
                  <span>
                    A mostrar <AnimatedNumber value={paginatedPosts.length} /> de <AnimatedNumber value={filteredResults.length} /> publicações
                  </span>
                  <span className="text-cyan-400">Página {currentPage} de {totalPostPages}</span>
                </div>

                <StaggerList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" staggerDelay={0.05}>
                  {paginatedPosts.map((result) => (
                    <StaggerItem key={result.id}>
                      <PostCard
                        result={result}
                        isFavorite={Boolean(favoritesMap[result.id])}
                        onToggleFavorite={handleToggleFavorite}
                        onOpenDetails={(r) => setSelectedResultForDetail(r)}
                      />
                    </StaggerItem>
                  ))}
                </StaggerList>
              </div>
            ) : results.length === 0 && !isLoading && !pendingConfig ? (
              <div className="p-12 rounded-2xl bg-[#0b0e14]/50 border border-white/[0.06] text-center space-y-4 max-w-xl mx-auto my-6">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-cyan-400">
                  <SearchIcon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-white">Nenhuma pesquisa realizada</h3>
                  <p className="text-xs text-zinc-400">
                    Escreva o que procura no campo superior ou clique num dos exemplos rápidos para descobrir publicações no Facebook via Google Dorks.
                  </p>
                </div>
              </div>
            ) : null
          )}

          {/* Pagination Controls */}
          {activeTotalPages > 1 && !isLoading && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/40 border border-white/[0.06] text-xs font-mono flex-wrap gap-2">
              <span className="text-zinc-400">
                Página <span className="text-white font-bold">{currentPage}</span> de <span className="text-white font-bold">{activeTotalPages}</span>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 text-zinc-300 hover:text-white transition-all"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Anterior</span>
                </button>

                {Array.from({ length: activeTotalPages }, (_, i) => i + 1).map((num) => {
                  if (
                    num === 1 ||
                    num === activeTotalPages ||
                    (num >= currentPage - 1 && num <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setCurrentPage(num)}
                        className={clsx(
                          'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                          currentPage === num
                            ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                            : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08]'
                        )}
                      >
                        {num}
                      </button>
                    );
                  }
                  if (num === currentPage - 2 || num === currentPage + 2) {
                    return (
                      <span key={num} className="text-zinc-600 px-1">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, activeTotalPages))}
                  disabled={currentPage === activeTotalPages}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 text-zinc-300 hover:text-white transition-all"
                >
                  <span>Seguinte</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Analytics Charts Drawer */}
        {results.length > 0 && !pendingConfig && !isLoading && (
          <AnimatedSection className="pt-4 border-t border-white/[0.06]">
            <ActivityCharts results={results} />
          </AnimatedSection>
        )}
      </main>

      {/* Dorks Studio Modal */}
      <DorksPreviewModal
        isOpen={isDorksModalOpen}
        onClose={() => setIsDorksModalOpen(false)}
        intent={currentIntent || undefined}
        dorks={generatedDorks}
      />

      {/* Result Inspection Detail Modal */}
      <ResultDetailModal
        result={selectedResultForDetail}
        onClose={() => setSelectedResultForDetail(null)}
      />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 max-w-7xl mx-auto"><SkeletonMetrics /></div>}>
      <SearchPageContent />
    </Suspense>
  );
}
