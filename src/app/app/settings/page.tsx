'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { AnimatedSection } from '@/components/AnimatedSection';
import { 
  Sliders, 
  Key, 
  ShieldCheck, 
  Sparkles, 
  Save, 
  Check, 
  ExternalLink,
  Info,
  Server,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [provider, setProvider] = useState<'demo' | 'google_cse' | 'serper'>('demo');
  const [demoMode, setDemoMode] = useState(true);
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [googleCx, setGoogleCx] = useState('');
  const [serperApiKey, setSerperApiKey] = useState('');
  const [strictDomain, setStrictDomain] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('socialfind_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.provider) setProvider(parsed.provider);
        if (parsed.demoMode !== undefined) setDemoMode(parsed.demoMode);
        if (parsed.googleApiKey) setGoogleApiKey(parsed.googleApiKey);
        if (parsed.googleCx) setGoogleCx(parsed.googleCx);
        if (parsed.serperApiKey) setSerperApiKey(parsed.serperApiKey);
        if (parsed.strictDomain !== undefined) setStrictDomain(parsed.strictDomain);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      try {
        const settings = {
          provider,
          demoMode,
          googleApiKey,
          googleCx,
          serperApiKey,
          strictDomain,
        };
        localStorage.setItem('socialfind_settings', JSON.stringify(settings));
        toast.success('Configurações guardadas com sucesso!');
      } catch {
        toast.error('Erro ao guardar configurações.');
      } finally {
        setIsSaving(false);
      }
    }, 400);
  };

  return (
    <>
      <Header
        title="Configurações do Sistema"
        subtitle="Gestão de credenciais SERP, modo demonstração e políticas de privacidade"
      />

      <main className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
        {/* SERP Engine Selection */}
        <AnimatedSection className="p-6 rounded-2xl bg-[#0b0e14] border border-white/[0.08] space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>Provedor de Pesquisa SERP Ativo</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Selecione o mecanismo responsável pela recolha de resultados indexados do Google.
              </p>
            </div>

            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-zinc-900 border border-white/[0.06] text-zinc-300">
              Ambiente Seguro
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'demo', label: 'Modo Demonstração', desc: 'Dados fictícios estruturados', badge: 'Sem API' },
              { id: 'google_cse', label: 'Google CSE', desc: 'Programmable Search Engine', badge: 'Oficial Google' },
              { id: 'serper', label: 'Serper.dev', desc: 'Google SERP API em tempo real', badge: 'Alta Velocidade' },
            ].map((p) => {
              const isSelected = provider === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProvider(p.id as any)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-cyan-950/30 border-cyan-500/80 text-white shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                      : 'bg-black/30 border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white">{p.label}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                      {p.badge}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-500">{p.desc}</div>
                </button>
              );
            })}
          </div>

          {/* Provider Specific Credentials Form */}
          {provider === 'google_cse' && (
            <div className="p-5 rounded-xl bg-black/40 border border-white/[0.06] space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5 text-white font-medium">
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  Credenciais Google Custom Search JSON API
                </span>
                <a
                  href="https://programmablesearchengine.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1"
                >
                  Obter no Google <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-mono">GOOGLE_SEARCH_API_KEY</label>
                  <input
                    type="password"
                    value={googleApiKey}
                    onChange={(e) => setGoogleApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full p-2.5 rounded-lg bg-zinc-900 border border-white/[0.1] text-white font-mono text-xs outline-none focus:border-cyan-500/80"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400 font-mono">GOOGLE_SEARCH_ENGINE_ID (CX)</label>
                  <input
                    type="text"
                    value={googleCx}
                    onChange={(e) => setGoogleCx(e.target.value)}
                    placeholder="0123456789:abcdef"
                    className="w-full p-2.5 rounded-lg bg-zinc-900 border border-white/[0.1] text-white font-mono text-xs outline-none focus:border-cyan-500/80"
                  />
                </div>
              </div>
            </div>
          )}

          {provider === 'serper' && (
            <div className="p-5 rounded-xl bg-black/40 border border-white/[0.06] space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5 text-white font-medium">
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  Credenciais Serper.dev Google API
                </span>
                <a
                  href="https://serper.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1"
                >
                  Obter Chave Serper <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-zinc-400 font-mono">SERPER_API_KEY</label>
                <input
                  type="password"
                  value={serperApiKey}
                  onChange={(e) => setSerperApiKey(e.target.value)}
                  placeholder="Inserir chave Serper..."
                  className="w-full p-2.5 rounded-lg bg-zinc-900 border border-white/[0.1] text-white font-mono text-xs outline-none focus:border-cyan-500/80"
                />
              </div>
            </div>
          )}

          {provider === 'demo' && (
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/30 text-xs text-zinc-300 space-y-1">
              <span className="font-semibold text-amber-300 flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Modo Demonstração Habilitado
              </span>
              <p className="text-[11px] text-zinc-400">
                Todas as pesquisas utilizarão dados fictícios inteligentes baseados na consulta e filtros do utilizador para testar a experiência sem consumir créditos de API.
              </p>
            </div>
          )}
        </AnimatedSection>

        {/* Global Security & Filtering Policies */}
        <AnimatedSection className="p-6 rounded-2xl bg-[#0b0e14] border border-white/[0.08] space-y-4">
          <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Políticas de Filtragem e Conformidade</span>
          </h2>

          <div className="divide-y divide-white/[0.06] text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="text-white font-medium block">Domínio facebook.com Exclusivo</span>
                <span className="text-zinc-400 text-[11px]">Elimina automaticamente qualquer link fora do ecossistema público do Facebook.</span>
              </div>
              <input
                type="checkbox"
                checked={strictDomain}
                onChange={(e) => setStrictDomain(e.target.checked)}
                className="w-4 h-4 accent-cyan-400"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="text-white font-medium block">Permitir Fallback em Modo Demonstração</span>
                <span className="text-zinc-400 text-[11px]">Se a API falhar ou estiver sem créditos, alternar temporariamente para demo identificada.</span>
              </div>
              <input
                type="checkbox"
                checked={demoMode}
                onChange={(e) => setDemoMode(e.target.checked)}
                className="w-4 h-4 accent-cyan-400"
              />
            </div>
          </div>
        </AnimatedSection>

        {/* Save Bar */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 disabled:opacity-50 text-black text-xs font-semibold font-mono uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:opacity-95 transition-all"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 text-black animate-spin" />
                <span>A guardar...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar Configurações</span>
              </>
            )}
          </button>
        </div>
      </main>
    </>
  );
}
