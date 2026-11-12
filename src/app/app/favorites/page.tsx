'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { FavoriteItem, SearchResult } from '@/types';
import { PostCard } from '@/components/PostCard';
import { ResultDetailModal } from '@/components/ResultDetailModal';
import { SkeletonPostCard } from '@/components/SkeletonLoader';
import { AnimatedSection } from '@/components/AnimatedSection';
import { StaggerList, StaggerItem } from '@/components/StaggerList';
import { Bookmark, Download, ExternalLink, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);

  const fetchFavorites = () => {
    setIsLoading(true);
    fetch('/api/favorites')
      .then((res) => res.json())
      .then((data) => {
        if (data.favorites) setFavorites(data.favorites);
      })
      .catch(() => toast.error('Erro ao carregar favoritos.'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (result: SearchResult) => {
    try {
      const res = await fetch(`/api/favorites?resultId=${result.id}`, { method: 'DELETE' });
      if (res.ok) {
        setFavorites((prev) => prev.filter((f) => f.resultId !== result.id));
        toast.info('Publicação removida dos favoritos.');
      }
    } catch {
      toast.error('Erro ao remover favorito.');
    }
  };

  const handleExportFavorites = async () => {
    if (favorites.length === 0) return;
    setIsExporting(true);
    try {
      const results = favorites.map((f) => f.result);
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: 'csv', results, query: 'favoritos' }),
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `socialfind-favoritos-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Favoritos exportados em CSV com sucesso.');
    } catch {
      toast.error('Erro ao exportar.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Header
        title="Publicações Guardadas & Favoritos"
        subtitle="Arquivo permanente de publicações descobertas para acompanhamento"
      />

      <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <AnimatedSection className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-semibold text-white tracking-tight">
              Favoritos ({favorites.length})
            </h2>
          </div>

          {favorites.length > 0 && (
            <button
              onClick={handleExportFavorites}
              disabled={isExporting}
              className="px-3.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] disabled:opacity-50 border border-white/[0.08] text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition-all"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  <span>A exportar...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar CSV</span>
                </>
              )}
            </button>
          )}
        </AnimatedSection>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonPostCard key={i} />
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <StaggerList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" staggerDelay={0.06}>
            {favorites.map((fav) => (
              <StaggerItem key={fav.id}>
                <PostCard
                  result={fav.result}
                  isFavorite={true}
                  onToggleFavorite={handleToggleFavorite}
                  onOpenDetails={(r) => setSelectedResult(r)}
                />
              </StaggerItem>
            ))}
          </StaggerList>
        ) : (
          <div className="p-12 rounded-2xl bg-[#0b0e14]/50 border border-white/[0.06] text-center space-y-3 max-w-md mx-auto my-8">
            <Bookmark className="w-6 h-6 mx-auto text-zinc-600" />
            <h3 className="text-sm font-semibold text-white">Nenhum favorito guardado</h3>
            <p className="text-xs text-zinc-500">
              Ao pesquisar, clique no ícone de marcador para arquivar publicações relevantes aqui.
            </p>
            <Link
              href="/app/search"
              className="inline-block px-4 py-2 rounded-lg bg-cyan-500 text-black text-xs font-mono font-semibold uppercase tracking-wider mt-2"
            >
              Ir para Pesquisa
            </Link>
          </div>
        )}
      </main>

      <ResultDetailModal
        result={selectedResult}
        onClose={() => setSelectedResult(null)}
      />
    </>
  );
}
