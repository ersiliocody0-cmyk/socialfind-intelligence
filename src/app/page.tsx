'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Search, 
  Terminal, 
  ShieldCheck, 
  Clock, 
  Filter, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  ChevronRight,
  ExternalLink,
  Flame,
  Globe2,
  Lock,
  Zap,
  Globe,
  Gift,
  Loader2,
  Menu,
  X
} from 'lucide-react';
import { CyberGlobe3D } from '@/components/CyberGlobe3D';
import { Card3D } from '@/components/Card3D';
import { AnimatedNumber } from '@/components/AnimatedNumber';

export default function LandingPage() {
  const router = useRouter();
  const [heroQuery, setHeroQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    const term = heroQuery.trim() || 'Samsung à venda';
    router.push(`/app/search?q=${encodeURIComponent(term)}`);
  };

  const sampleTags = [
    'Samsung à venda',
    'iPhone 15 Pro usado',
    'Toyota Hilux para venda',
    'Casas para arrendar em Luanda',
    'Pessoas a procurar emprego',
  ];

  return (
    <div className="relative min-h-screen bg-[#060709] text-white overflow-hidden swiss-grid">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] radial-glow pointer-events-none" />

      {/* Navigation Header */}
      <header className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1px] shadow-glow-cyan">
            <div className="w-full h-full bg-[#07090d] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <span className="font-semibold text-base tracking-tight text-white flex items-center gap-2">
              SocialFind <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-800/40">v1.0</span>
            </span>
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono">Intelligence</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-zinc-400">
          <a href="#features" className="hover:text-cyan-400 transition-colors">Funcionalidades</a>
          <a href="#pipeline" className="hover:text-cyan-400 transition-colors">Pipeline 8 Etapas</a>
          <a href="#dorks" className="hover:text-cyan-400 transition-colors">Google Dorks</a>
          <a href="#free-access" className="hover:text-cyan-400 transition-colors">Plano Gratuito</a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/app/search"
            className="hidden sm:inline-flex px-3.5 sm:px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-medium text-white transition-all font-mono"
          >
            Demo Sandbox
          </Link>
          <Link
            href="/app"
            className="px-3.5 sm:px-5 py-2 sm:py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-400 text-black text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:opacity-95 font-mono uppercase tracking-wider tap-transparent"
          >
            <span>Entrar na App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors ml-1"
            title="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-30 bg-[#060709]/95 backdrop-blur-xl border-b border-white/[0.1] p-6 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3 text-sm font-mono uppercase tracking-wider text-zinc-300">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-colors"
            >
              Funcionalidades
            </a>
            <a
              href="#pipeline"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-colors"
            >
              Pipeline 8 Etapas
            </a>
            <a
              href="#dorks"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-colors"
            >
              Google Dorks
            </a>
            <a
              href="#free-access"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-300 transition-colors"
            >
              Plano 100% Gratuito
            </a>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-16 sm:pb-20 text-center">
        {/* 3D Cyber Globe Interactive Centerpiece */}
        <div className="w-full max-w-[240px] sm:max-w-[340px] h-[200px] sm:h-[280px] mx-auto mb-2 relative">
          <CyberGlobe3D size={280} className="w-full h-full" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#060709] via-transparent to-transparent" />
        </div>

        {/* Micro Pill */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] sm:text-xs text-zinc-300 font-mono mb-5 sm:mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Motor OSINT Aberto</span>
          <span className="text-zinc-600">|</span>
          <span className="text-emerald-400">100% Gratuito Vitalício</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-5 sm:mb-6">
          Descubra Publicações no Facebook{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
            através de Google Dorks
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-zinc-400 leading-relaxed mb-6 sm:mb-8 font-normal px-2">
          Transforme linguagem natural em consultas avançadas de pesquisa. O SocialFind localiza publicações públicas, páginas e grupos no Facebook com agrupamento em páginas, filtros temporais rigorosos e auditoria técnica.
        </p>

        {/* Interactive Search Simulator in Hero */}
        <div className="max-w-3xl mx-auto mb-8 px-1">
          <form onSubmit={handleHeroSearch} className="relative">
            <div className="relative flex items-center p-1.5 sm:p-2 rounded-2xl bg-[#0c0f16]/90 border border-white/[0.14] shadow-2xl focus-within:border-cyan-500/80 focus-within:shadow-[0_0_30px_rgba(0,240,255,0.2)] transition-all">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-500 ml-2.5 sm:ml-3 mr-1.5 sm:mr-2 shrink-0" />
              <input
                type="text"
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                placeholder="Que publicação estás à procura? (Ex: Samsung à venda)"
                className="w-full bg-transparent text-white placeholder-zinc-500 text-xs sm:text-sm md:text-base outline-none py-2 font-normal"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-black text-xs font-semibold font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 hover:opacity-95 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] shrink-0 min-h-[42px] tap-transparent"
              >
                {isSearching ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-4 h-4 text-black animate-spin" />
                    <span className="hidden sm:inline">A Abrir...</span>
                  </span>
                ) : (
                  <>
                    <span>Descobrir</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick tags */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap mt-3.5 text-xs">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Testar:</span>
            {sampleTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setIsSearching(true);
                  router.push(`/app/search?q=${encodeURIComponent(tag)}`);
                }}
                className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] active:bg-cyan-500/20 border border-white/[0.06] hover:border-cyan-500/40 text-zinc-300 text-xs transition-all tap-transparent"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics Proof Strip with Number Animations */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-white/[0.06]">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="text-2xl font-bold font-mono text-cyan-400">
              <AnimatedNumber value={100} suffix="%" />
            </div>
            <div className="text-xs text-zinc-400 mt-1">Domínios Facebook Validados</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="text-2xl font-bold font-mono text-emerald-400">
              <AnimatedNumber value={1.2} decimals={1} prefix="< " suffix="s" />
            </div>
            <div className="text-xs text-zinc-400 mt-1">Tempo Médio de Resposta</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="text-2xl font-bold font-mono text-amber-400">
              <AnimatedNumber value={0} prefix="" suffix="€ Grátis" />
            </div>
            <div className="text-xs text-zinc-400 mt-1">Acesso 100% Livre de Custos</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="text-2xl font-bold font-mono text-cyan-400">
              <AnimatedNumber value={5} suffix=" Estratégias" />
            </div>
            <div className="text-xs text-zinc-400 mt-1">Compiladores Google Dorks</div>
          </div>
        </div>
      </section>

      {/* The 8-Step Pipeline Section */}
      <section id="pipeline" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/40 text-cyan-400 text-[11px] font-mono uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" />
            Arquitetura de Processamento
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-3">
            O Fluxo das 8 Etapas de Descoberta
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Como o SocialFind Intelligence transforma uma simples palavra-chave num relatório verificado de publicações públicas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Input Natural', desc: 'O utilizador introduz qualquer termo ou intenção (ex: "Samsung à venda").' },
            { step: '02', title: 'Interpretação IA', desc: 'Identifica categoria, palavras-chave, localização e intenção de compra/venda.' },
            { step: '03', title: 'Construção Dorks', desc: 'Gera consultas avançadas combinando inurl:posts, permalinks e operadores temporais.' },
            { step: '04', title: 'Pesquisa SERP', desc: 'Envia as consultas ao motor de pesquisa compatível sem violar limites de API privada.' },
            { step: '05', title: 'Recolha Bruta', desc: 'Recebe títulos, excertos, URLs indexados, datas públicas e metadados.' },
            { step: '06', title: 'Filtragem Rígida', desc: 'Garante domínio facebook.com exclusivo, elimina duplicados e audita carimbos temporais.' },
            { step: '07', title: 'Apresentação', desc: 'Organiza em dashboard interativo com indicadores de confiança e relevância.' },
            { step: '08', title: 'Interação Direta', desc: 'Permite abrir o post original no Facebook, favoritar, copiar link e exportar.' },
          ].map((item) => (
            <div
              key={item.step}
              className="p-5 rounded-xl bg-[#0b0e14] border border-white/[0.08] hover:border-cyan-500/40 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 font-bold">{item.step}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-cyan-400 transition-colors" />
              </div>
              <h3 className="text-sm font-semibold text-white">{item.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dorks Engine Feature Highlights */}
      <section id="dorks" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.06]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-[11px] font-mono uppercase tracking-wider">
              <Terminal className="w-3.5 h-3.5" />
              Google Dorks Automatizados
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Pesquisa avançada para quem não sabe o que é um Dork.
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              O utilizador comum não precisa de memorizar sintaxes como <code className="text-cyan-400 font-mono">site:facebook.com (inurl:posts) after:2026-11-01</code>. O nosso motor constrói e testa dezenas de combinações em microssegundos.
            </p>

            <ul className="space-y-3 text-xs text-zinc-300 font-mono">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Segmentação precisa por Grupos Públicos vs Páginas vs Vídeos</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Filtro temporal nativo do Google (24h, 3d, 7d, 14d, 30d)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Auditoria transparente entre data de indexação vs publicação</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Botão direto: VER PUBLICAÇÃO ORIGINAL no Facebook</span>
              </li>
            </ul>

            <Link
              href="/app/search"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold font-mono uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,240,255,0.25)]"
            >
              <span>Experimentar Pesquisa Agora</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Code Showcase Preview */}
          <div className="rounded-2xl bg-[#090b10] border border-white/[0.12] p-5 shadow-2xl font-mono text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] text-zinc-500 ml-2">dork_engine.ts</span>
              </div>
              <span className="text-[10px] text-cyan-400">Compilação Dinâmica</span>
            </div>

            <div className="space-y-3 text-[11px] leading-relaxed text-zinc-300">
              <p className="text-zinc-500">// 1. Exemplo de Dork gerado para posts diretos:</p>
              <div className="p-3 rounded-lg bg-black/60 border border-white/[0.06] text-cyan-300 break-all select-all">
                site:facebook.com (inurl:posts OR inurl:permalink) "Samsung" "à venda" after:2026-11-01
              </div>

              <p className="text-zinc-500">// 2. Dork para grupos comunitários:</p>
              <div className="p-3 rounded-lg bg-black/60 border border-white/[0.06] text-emerald-300 break-all select-all">
                site:facebook.com/groups "Samsung" (vendo OR venda OR preco) "Luanda" after:2026-11-01
              </div>

              <p className="text-zinc-500">// 3. Dork para transmissões em vídeo e reels:</p>
              <div className="p-3 rounded-lg bg-black/60 border border-white/[0.06] text-amber-300 break-all select-all">
                site:facebook.com (inurl:watch OR inurl:reel) "Samsung" after:2026-11-01
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 100% Free Access Section (No Paid Tiers) */}
      <section id="free-access" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.06]">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-[11px] font-mono uppercase tracking-wider mb-3">
            <Gift className="w-3.5 h-3.5" />
            Acesso 100% Gratuito
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
            Plano Gratuito Vitalício
          </h2>
          <p className="text-xs text-zinc-400">
            Acesso completo a todas as capacidades do SocialFind sem custos, sem cartões de crédito e sem planos pagos.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card3D maxTilt={5}>
            <div className="p-8 rounded-3xl bg-[#0c0f16]/95 border border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.15)] relative overflow-hidden space-y-8">
              {/* Top pill */}
              <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/[0.08] pb-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    Acesso Aberto & Irrestrito
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-extrabold text-white font-mono">0€</span>
                    <span className="text-xs text-zinc-400 font-mono">/ totalmente grátis para sempre</span>
                  </div>
                </div>

                <div className="px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Nenhum Plano Pago</span>
                </div>
              </div>

              {/* Grid of included capabilities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-zinc-300">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Motor Avançado Google Dorks Completo</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Agrupamento em Páginas do Facebook</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Filtros Temporais Estritos (24h a 30 dias)</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Exportação em CSV, JSON e Markdown</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Links com Validação e Fallback Facebook</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Modo Demonstração + Conexão SERP Própria</span>
                </div>
              </div>

              {/* Big CTA Button */}
              <Link
                href="/app/search"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-black text-sm font-bold text-center font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(0,240,255,0.35)] hover:opacity-95 active:scale-[0.99]"
              >
                <span>Aceder Agora Gratuitamente</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Card3D>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] max-w-7xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
        <div className="flex items-center gap-2">
          <span>SocialFind Intelligence © 2026.</span>
          <span>Todos os direitos reservados.</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/app" className="hover:text-cyan-400 transition-colors">Plataforma</Link>
          <Link href="/app/dorks" className="hover:text-cyan-400 transition-colors">Dorks Studio</Link>
          <Link href="/app/settings" className="hover:text-cyan-400 transition-colors">Configurações</Link>
        </div>
      </footer>
    </div>
  );
}
