'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Card3D } from '@/components/Card3D';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { AnimatedSection } from '@/components/AnimatedSection';
import { StaggerList, StaggerItem } from '@/components/StaggerList';
import { User, ShieldCheck, Zap, Activity, Gift, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  return (
    <>
      <Header
        title="Perfil & Acesso Gratuito"
        subtitle="Gestão de conta e plano gratuito vitalício sem custos"
      />

      <main className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
        {/* User Card */}
        <AnimatedSection>
          <Card3D maxTilt={4} glare={false}>
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/[0.08] flex items-center justify-between flex-wrap gap-4 shadow-sm transition-colors duration-300">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1.5px] shadow-glow-cyan">
                  <div className="w-full h-full bg-slate-100 dark:bg-[#0a0d14] rounded-[14px] flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                    <User className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">Analista de Descoberta</h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-1">
                      <Gift className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      Plano Gratuito Vitalício
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono">user@socialfind.community</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                  Acesso Gratuito Ativo
                </span>
              </div>
            </div>
          </Card3D>
        </AnimatedSection>

        {/* Free Plan Announcement Banner */}
        <AnimatedSection className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-between flex-wrap gap-3 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
                Acesso Completo Sem Planos Pagos
              </h4>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Todas as ferramentas de Google Dorks, filtros temporais e agregação em Páginas do Facebook estão liberadas.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold px-2.5 py-1 rounded bg-white/80 dark:bg-black/40 border border-emerald-300 dark:border-emerald-800/40 shadow-sm">
            0€ / Sempre
          </span>
        </AnimatedSection>

        {/* Usage Stats with Number Animations */}
        <StaggerList className="grid grid-cols-1 md:grid-cols-3 gap-4" staggerDelay={0.06}>
          <StaggerItem>
            <Card3D maxTilt={5} glare={false}>
              <div className="p-5 rounded-xl bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/[0.08] space-y-2 h-full shadow-sm transition-colors duration-300">
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                  Pesquisas Realizadas
                </span>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  <AnimatedNumber value={18} /> <span className="text-xs text-emerald-600 dark:text-emerald-400 font-normal">/ Ilimitadas</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                  <div className="w-full h-full bg-emerald-500 dark:bg-emerald-400 rounded-full" />
                </div>
              </div>
            </Card3D>
          </StaggerItem>

          <StaggerItem>
            <Card3D maxTilt={5} glare={false}>
              <div className="p-5 rounded-xl bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/[0.08] space-y-2 h-full shadow-sm transition-colors duration-300">
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                  Operadores Dorks Compilados
                </span>
                <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  <AnimatedNumber value={92} />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">Variações automáticas sem custo</p>
              </div>
            </Card3D>
          </StaggerItem>

          <StaggerItem>
            <Card3D maxTilt={5} glare={false}>
              <div className="p-5 rounded-xl bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/[0.08] space-y-2 h-full shadow-sm transition-colors duration-300">
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                  Nível de Precisão
                </span>
                <div className="text-2xl font-bold font-mono text-cyan-600 dark:text-cyan-400">
                  <AnimatedNumber value={99.4} decimals={1} suffix="%" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">Exclusividade Facebook</p>
              </div>
            </Card3D>
          </StaggerItem>
        </StaggerList>
      </main>
    </>
  );
}
