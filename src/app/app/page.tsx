'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card3D } from '@/components/Card3D';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { 
  Search, 
  Terminal, 
  Bookmark, 
  History, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  Users,
  Compass,
  FileText,
  Gift
} from 'lucide-react';
import { SearchHistoryItem } from '@/types';
import { SkeletonHistoryRow } from '@/components/SkeletonLoader';
import { AnimatedSection } from '@/components/AnimatedSection';
import { StaggerList, StaggerItem } from '@/components/StaggerList';

export default function DashboardOverviewPage() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [favoritesCount, setFavoritesCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/history').then((res) => res.json()),
      fetch('/api/favorites').then((res) => res.json()),
    ])
      .then(([historyData, favoritesData]) => {
        if (historyData.history) setHistory(historyData.history);
        if (favoritesData.favorites) setFavoritesCount(favoritesData.favorites.length);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const trendingTopics = [
    { title: 'Samsung à venda', category: 'Eletrónica & Vendas', count: '142 posts recentes' },
    { title: 'iPhone 15 Pro usado', category: 'Smartphones', count: '89 posts recentes' },
    { title: 'Toyota Hilux para venda', category: 'Automóveis', count: '64 posts recentes' },
    { title: 'Casas para arrendar em Luanda', category: 'Imobiliário', count: '118 posts recentes' },
    { title: 'Pessoas a procurar emprego', category: 'Recrutamento', count: '76 posts recentes' },
    { title: 'Computadores portáteis usados', category: 'Informática', count: '95 posts recentes' },
  ];

  return (
    <>
      <Header
        title="Dashboard de Inteligência"
        subtitle="Visão geral de pesquisas, monitorização e atividade OSINT"
      />

      <main className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Hero Welcome Card */}
        <Card3D maxTilt={4} glare={true}>
          <div className="relative p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-[#0d111a] dark:via-[#090c12] dark:to-[#0d111a] border border-slate-700/60 dark:border-white/[0.1] overflow-hidden shadow-2xl text-white">
            <div className="absolute top-0 right-0 w-96 h-96 radial-glow pointer-events-none" />

            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Motor OSINT Aberto</span>
                <span className="text-zinc-600">|</span>
                <span className="text-emerald-400">100% Gratuito</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Descubra oportunidades no Facebook com precisão cirúrgica.
              </h2>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                O SocialFind Intelligence indexa e audita publicações públicas através de Google Dorks gerados dinamicamente. Agrupe por Páginas do Facebook, filtre por datas rigorosas e aceda sem bloqueios.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <Link
                  href="/app/search"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-black text-xs font-semibold font-mono uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:opacity-95 transition-all"
                >
                  <Search className="w-4 h-4" />
                  <span>Nova Pesquisa Inteligente</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>

                <Link
                  href="/app/dorks"
                  className="px-4 py-2.5 rounded-xl bg-white/[0.1] hover:bg-white/[0.18] border border-white/[0.15] text-xs font-mono text-zinc-200 hover:text-white transition-all flex items-center gap-2"
                >
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>Dorks Studio</span>
                </Link>
              </div>
            </div>
          </div>
        </Card3D>

        {/* Global Statistics Overview with Animated Numbers */}
        <StaggerList className="grid grid-cols-2 md:grid-cols-4 gap-4" staggerDelay={0.06}>
          <StaggerItem>
            <Card3D maxTilt={5} glare={false}>
              <div className="p-4 rounded-xl bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none space-y-1 h-full">
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-zinc-400">Total de Pesquisas</span>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  <AnimatedNumber value={history.length} />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">Registadas nesta sessão</p>
              </div>
            </Card3D>
          </StaggerItem>

          <StaggerItem>
            <Card3D maxTilt={5} glare={false}>
              <div className="p-4 rounded-xl bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none space-y-1 h-full">
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-zinc-400">Favoritos Guardados</span>
                <div className="text-2xl font-bold font-mono text-cyan-600 dark:text-cyan-400">
                  <AnimatedNumber value={favoritesCount} />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">Publicações arquivadas</p>
              </div>
            </Card3D>
          </StaggerItem>

          <StaggerItem>
            <Card3D maxTilt={5} glare={false}>
              <div className="p-4 rounded-xl bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none space-y-1 h-full">
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-zinc-400">Validação Temporal</span>
                <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  <AnimatedNumber value={100} suffix="%" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">Sem datas alucinadas</p>
              </div>
            </Card3D>
          </StaggerItem>

          <StaggerItem>
            <Card3D maxTilt={5} glare={false}>
              <div className="p-4 rounded-xl bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none space-y-1 h-full">
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-zinc-400">Plano Ativo</span>
                <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Gift className="w-5 h-5 text-emerald-600 dark:text-emerald-400 inline" />
                  <span>Gratuito</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">Acesso livre vitalício</p>
              </div>
            </Card3D>
          </StaggerItem>
        </StaggerList>

        {/* Trending Discovery Queries */}
        <AnimatedSection className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
                Modelos de Pesquisa em Tendência
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">Prontos para 1-Clique</span>
          </div>

          <StaggerList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" staggerDelay={0.05}>
            {trendingTopics.map((topic, i) => (
              <StaggerItem key={i}>
                <Card3D maxTilt={6} glare={false}>
                  <Link
                    href={`/app/search?q=${encodeURIComponent(topic.title)}`}
                    className="p-4 rounded-xl bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/[0.08] hover:border-cyan-500/50 shadow-sm dark:shadow-none transition-all flex items-center justify-between group h-full block"
                  >
                    <div className="space-y-1 truncate pr-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors truncate block">
                        {topic.title}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-zinc-400">
                        <span>{topic.category}</span>
                        <span>•</span>
                        <span className="text-emerald-600 dark:text-emerald-400">{topic.count}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 dark:text-zinc-500 dark:group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0" />
                  </Link>
                </Card3D>
              </StaggerItem>
            ))}
          </StaggerList>
        </AnimatedSection>

        {/* Recent Search Activity */}
        <AnimatedSection className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
                Atividade de Descoberta Recente
              </h3>
            </div>
            <Link href="/app/history" className="text-xs font-mono text-cyan-600 dark:text-cyan-400 hover:underline">
              Ver histórico completo →
            </Link>
          </div>

          {isLoading ? (
            <div className="rounded-xl bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/[0.08] divide-y divide-slate-200 dark:divide-white/[0.06] overflow-hidden shadow-sm">
              {[1, 2, 3].map((i) => (
                <SkeletonHistoryRow key={i} />
              ))}
            </div>
          ) : history.length > 0 ? (
            <StaggerList className="rounded-xl bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/[0.08] divide-y divide-slate-200 dark:divide-white/[0.06] overflow-hidden shadow-sm">
              {history.slice(0, 5).map((item) => (
                <StaggerItem key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/[0.06] text-slate-500 dark:text-zinc-400">
                      <Search className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">{item.query}</h4>
                      <p className="text-[10px] font-mono text-slate-500 dark:text-zinc-400">
                        Filtro: {item.dateFilter} • {item.resultsCount} resultados • {new Date(item.createdAt).toLocaleTimeString('pt-PT')}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/app/search?q=${encodeURIComponent(item.query)}`}
                    className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] text-xs font-mono text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1 border border-slate-200 dark:border-transparent"
                  >
                    <span>Repetir</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </StaggerItem>
              ))}
            </StaggerList>
          ) : (
            <div className="p-8 rounded-xl bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/[0.06] text-center text-xs text-slate-500 dark:text-zinc-400 space-y-2 shadow-sm">
              <Clock className="w-5 h-5 mx-auto text-slate-400 dark:text-zinc-400" />
              <p>Nenhuma pesquisa realizada ainda. Inicie a primeira busca para registar atividade.</p>
            </div>
          )}
        </AnimatedSection>
      </main>
    </>
  );
}
