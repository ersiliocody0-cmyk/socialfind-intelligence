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
  Lock
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [heroQuery, setHeroQuery] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroQuery.trim()) {
      router.push(`/app/search?q=${encodeURIComponent(heroQuery.trim())}`);
    } else {
      router.push('/app/search');
    }
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
      <header className="relative z-20 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1px] shadow-glow-cyan">
            <div className="w-full h-full bg-[#07090d] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <span className="font-semibold text-base tracking-tight text-white flex items-center gap-2">
              SocialFind <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-800/40">SaaS</span>
            </span>
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono">Intelligence</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-zinc-400">
          <a href="#features" className="hover:text-cyan-400 transition-colors">Funcionalidades</a>
          <a href="#pipeline" className="hover:text-cyan-400 transition-colors">Pipeline 8 Etapas</a>
          <a href="#dorks" className="hover:text-cyan-400 transition-colors">Google Dorks</a>
          <a href="#pricing" className="hover:text-cyan-400 transition-colors">Planos</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/app/search"
            className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-medium text-white transition-all font-mono"
          >
            Demo Sandbox
          </Link>
          <Link
            href="/app"
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-400 text-black text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:opacity-95 font-mono uppercase tracking-wider"
          >
            <span>Entrar na App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
        {/* Micro Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-zinc-300 font-mono mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Motor de Busca de Fontes Abertas (OSINT)</span>
          <span className="text-zinc-600">|</span>
          <span className="text-cyan-400">Zero Graph API Bloqueios</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6">
          Descubra Publicações no Facebook{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
            através de Google Dorks
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 leading-relaxed mb-10 font-normal">
          Transforme linguagem natural em consultas avançadas de pesquisa. O SocialFind Intelligence localiza publicações públicas, grupos e anúncios no Facebook com filtros temporais rigorosos e auditoria de datas sem alucinações.
        </p>

        {/* Interactive Search Simulator in Hero */}
        <div className="max-w-3xl mx-auto mb-8">
          <form onSubmit={handleHeroSearch} className="relative">
            <div className="relative flex items-center p-2 rounded-2xl bg-[#0c0f16]/90 border border-white/[0.14] shadow-2xl focus-within:border-cyan-500/80 focus-within:shadow-[0_0_30px_rgba(0,240,255,0.2)] transition-all">
              <Search className="w-6 h-6 text-zinc-500 ml-3 mr-2 shrink-0" />
              <input
                type="text"
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                placeholder="Que publicação estás à procura? (Ex: Samsung à venda)"
                className="w-full bg-transparent text-white placeholder-zinc-500 text-sm sm:text-base outline-none py-2 font-normal"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-black text-xs font-semibold font-mono uppercase tracking-wider flex items-center gap-2 hover:opacity-95 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] shrink-0"
              >
                <span>Descobrir</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick tags */}
          <div className="flex items-center justify-center gap-2 flex-wrap mt-4 text-xs">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Testar:</span>
            {sampleTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => router.push(`/app/search?q=${encodeURIComponent(tag)}`)}
                className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-cyan-500/40 text-zinc-300 text-xs transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics Proof Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-white/[0.06]">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="text-2xl font-bold font-mono text-cyan-400">100%</div>
            <div className="text-xs text-zinc-400 mt-1">Domínios Facebook Validados</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="text-2xl font-bold font-mono text-emerald-400">&lt; 1.2s</div>
            <div className="text-xs text-zinc-400 mt-1">Tempo Médio de Descoberta</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="text-2xl font-bold font-mono text-amber-400">Zero</div>
            <div className="text-xs text-zinc-400 mt-1">Alucinações de Datas</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="text-2xl font-bold font-mono text-cyan-400">5+</div>
            <div className="text-xs text-zinc-400 mt-1">Estratégias Google Dorks</div>
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

      {/* Pricing / Tiers Section */}
      <section id="pricing" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.06]">
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/40 text-cyan-400 text-[11px] font-mono uppercase tracking-wider mb-3">
            Planos de Assinatura
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
            Estrutura Comercial SaaS
          </h2>
          <p className="text-xs text-zinc-400">
            Escalabilidade para investigadores individuais, agências de marketing e equipas de inteligência competitiva.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Starter */}
          <div className="p-6 rounded-2xl bg-[#0b0e14] border border-white/[0.08] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Starter</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white font-mono">0€</span>
                <span className="text-xs text-zinc-400">/ grátis para sempre</span>
              </div>
              <p className="text-xs text-zinc-400">
                Ideal para testar o potencial dos Google Dorks e pesquisas pontuais em modo demo.
              </p>
              <ul className="space-y-2.5 text-xs text-zinc-300 font-mono">
                <li className="flex items-center gap-2">✓ 25 pesquisas / dia</li>
                <li className="flex items-center gap-2">✓ Modo Demonstração Completo</li>
                <li className="flex items-center gap-2">✓ Histórico das últimas 24h</li>
              </ul>
            </div>
            <Link
              href="/app/search"
              className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-white text-center font-mono transition-all"
            >
              Começar Grátis
            </Link>
          </div>

          {/* Pro (Recommended) */}
          <div className="p-6 rounded-2xl bg-[#0e121a] border border-cyan-500/60 shadow-[0_0_30px_rgba(0,240,255,0.15)] flex flex-col justify-between space-y-6 relative">
            <div className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full bg-cyan-500 text-black text-[10px] font-mono font-bold uppercase tracking-wider">
              Recomendado
            </div>
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">Profissional</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white font-mono">29€</span>
                <span className="text-xs text-zinc-400">/ mês</span>
              </div>
              <p className="text-xs text-zinc-400">
                Para profissionais que precisam de descoberta comercial, recrutamento e monitorização competitiva.
              </p>
              <ul className="space-y-2.5 text-xs text-zinc-300 font-mono">
                <li className="flex items-center gap-2 text-cyan-300">✓ Pesquisas Ilimitadas via SERP</li>
                <li className="flex items-center gap-2">✓ Filtros Temporais 24h a 30d</li>
                <li className="flex items-center gap-2">✓ Exportação em CSV, JSON e Markdown</li>
                <li className="flex items-center gap-2">✓ Conexão com Google CSE próprio</li>
              </ul>
            </div>
            <Link
              href="/app/search"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-black text-xs font-semibold text-center font-mono uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:opacity-95"
            >
              Iniciar Plano Pro
            </Link>
          </div>

          {/* Enterprise */}
          <div className="p-6 rounded-2xl bg-[#0b0e14] border border-white/[0.08] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Enterprise</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white font-mono">99€</span>
                <span className="text-xs text-zinc-400">/ mês</span>
              </div>
              <p className="text-xs text-zinc-400">
                Grandes organizações com múltiplos analistas, auditoria compliance e endpoints dedicados.
              </p>
              <ul className="space-y-2.5 text-xs text-zinc-300 font-mono">
                <li className="flex items-center gap-2">✓ Múltiplos utilizadores de equipa</li>
                <li className="flex items-center gap-2">✓ Webhooks de alerta em tempo real</li>
                <li className="flex items-center gap-2">✓ Suporte prioritário 24/7</li>
                <li className="flex items-center gap-2">✓ SLA 99.9% garantido</li>
              </ul>
            </div>
            <Link
              href="/app/search"
              className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-white text-center font-mono transition-all"
            >
              Falar com Vendas
            </Link>
          </div>
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
