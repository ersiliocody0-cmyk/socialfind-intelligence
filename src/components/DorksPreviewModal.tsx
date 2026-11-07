'use client';

import React, { useState } from 'react';
import { DorkQuery, ParsedIntent } from '@/types';
import { X, Copy, Check, ExternalLink, Terminal, Sparkles, HelpCircle } from 'lucide-react';

interface DorksPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  intent?: ParsedIntent;
  dorks: DorkQuery[];
}

export function DorksPreviewModal({ isOpen, onClose, intent, dorks }: DorksPreviewModalProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = async (dorkText: string, id: string) => {
    try {
      await navigator.clipboard.writeText(dorkText);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  };

  const handleOpenGoogle = (dorkText: string) => {
    const url = `https://www.google.com/search?q=${encodeURIComponent(dorkText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-2xl bg-[#0c0f16] border border-white/[0.12] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                Motor de Google Dorks Inteligente
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                  {dorks.length} Consultas Geradas
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Variações avançadas criadas automaticamente para descoberta pública no Facebook.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Intent Summary */}
          {intent && (
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Intenção Interpretada pela IA
                </span>
                <span className="text-xs font-mono text-cyan-400 font-medium">
                  {intent.detectedIntentLabel}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap text-xs text-zinc-300">
                <span className="text-zinc-500">Palavras-chave:</span>
                {intent.mainKeywords.map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-white/[0.06] text-white font-mono text-[11px]">
                    {kw}
                  </span>
                ))}
                {intent.location && (
                  <span className="px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-800/40 font-mono text-[11px]">
                    Localização: {intent.location}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Dork Variations List */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Consultas Dork Prontas para Execução
            </h3>

            {dorks.map((dork) => (
              <div
                key={dork.id}
                className="p-4 rounded-xl bg-black/40 border border-white/[0.08] hover:border-white/[0.16] transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">{dork.name}</span>
                    <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-800/30">
                      {dork.strategy}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopy(dork.dork, dork.id)}
                      className="px-2.5 py-1 rounded bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-[11px] font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition-all"
                    >
                      {copiedId === dork.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-zinc-400" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenGoogle(dork.dork)}
                      className="px-2.5 py-1 rounded bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/40 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5 transition-all"
                      title="Testar diretamente no Google"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Abrir no Google</span>
                    </button>
                  </div>
                </div>

                {/* The Dork Code Box */}
                <div className="p-3 rounded-lg bg-[#080a0f] border border-white/[0.06] font-mono text-xs text-cyan-300 break-all select-all">
                  {dork.dork}
                </div>

                {/* Explanation */}
                <p className="text-[11px] text-zinc-400 flex items-start gap-1.5 leading-relaxed">
                  <HelpCircle className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                  <span>{dork.explanation}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-zinc-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-xs font-medium text-white transition-all font-mono"
          >
            Fechar Janela
          </button>
        </div>
      </div>
    </div>
  );
}
