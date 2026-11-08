'use client';

import React from 'react';
import { SearchResult } from '@/types';
import { ConfidenceBadge, ContentTypeBadge } from './ui/Badge';
import { X, ExternalLink, ShieldCheck, Calendar, Info, Globe, Copy, Check, Search } from 'lucide-react';

interface ResultDetailModalProps {
  result: SearchResult | null;
  onClose: () => void;
}

export function ResultDetailModal({ result, onClose }: ResultDetailModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!result) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0c0f16] border border-white/[0.12] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                Auditoria de Descoberta & Metadados
              </h2>
              <p className="text-xs text-zinc-400">
                Verificação técnica de domínio, confiança temporal e autenticidade.
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Status Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <ContentTypeBadge type={result.contentType} />
            <ConfidenceBadge level={result.dateConfidence} />
            <div className="px-2.5 py-0.5 rounded bg-zinc-900 border border-white/[0.08] text-xs font-mono text-zinc-300">
              Score: <span className="text-cyan-400 font-bold">{result.relevanceScore}%</span>
            </div>
          </div>

          {/* Title & Excerpt */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-white">
              {result.title}
            </h3>
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] text-xs text-zinc-300 leading-relaxed">
              {result.description}
            </div>
          </div>

          {/* Technical Validation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            {/* Domain Verification */}
            <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-white/[0.06] space-y-1.5">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  Validação de Domínio
                </span>
                <span className="text-emerald-400 text-[10px] font-bold">100% Facebook</span>
              </div>
              <p className="text-zinc-300 truncate">{result.sourceDomain}</p>
            </div>

            {/* Date Audit */}
            <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-white/[0.06] space-y-1.5">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  Data Auditada
                </span>
                <span className="text-cyan-400 text-[10px]">
                  {result.publishedAt ? new Date(result.publishedAt).toLocaleDateString('pt-PT') : 'Não Confirmada'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                {result.dateConfidenceReason}
              </p>
            </div>
          </div>

          {/* Educational Note about Google Indexing vs Facebook Post Date */}
          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/30 text-xs text-zinc-300 space-y-1 leading-relaxed">
            <div className="flex items-center gap-1.5 text-cyan-400 font-semibold font-mono text-[11px]">
              <Info className="w-3.5 h-3.5" />
              Princípio de Transparência SocialFind:
            </div>
            <p className="text-[11px] text-zinc-400">
              A data de indexação pública do Google nem sempre corresponde ao segundo exato em que o autor publicou no Facebook. A SocialFind audita padrões de timestamp no excerto e na estrutura do URL para atribuir o nível de confiança, nunca inventando carimbos inexistentes.
            </p>
          </div>

          {/* Full URL */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              URL Original Normalizado
            </span>
            <div className="p-3 rounded-lg bg-[#07090d] border border-white/[0.06] flex items-center justify-between gap-3 text-xs font-mono text-cyan-300 break-all select-all">
              <span className="truncate">{result.url}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 p-1.5 rounded bg-white/[0.08] hover:bg-white/[0.14] text-zinc-300 hover:text-white transition-all"
                title="Copiar URL"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions with Direct & Fallback Links */}
        <div className="p-4 border-t border-white/[0.08] bg-zinc-950/40 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-medium text-white transition-all font-mono"
            >
              Fechar
            </button>

            {result.pageUrl && (
              <a
                href={result.pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition-all"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Página Oficial</span>
              </a>
            )}

            {result.searchFallbackUrl && (
              <a
                href={result.searchFallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-zinc-300 hover:text-cyan-300 flex items-center gap-1.5 transition-all"
                title="Pesquisar diretamente no Facebook caso o post original tenha sido arquivado"
              >
                <Search className="w-3.5 h-3.5 text-emerald-400" />
                <span>Buscar no Facebook</span>
              </a>
            )}
          </div>

          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-400 text-black text-xs font-semibold flex items-center gap-2 transition-all font-mono uppercase tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:opacity-95"
          >
            <span>Ver no Facebook</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
