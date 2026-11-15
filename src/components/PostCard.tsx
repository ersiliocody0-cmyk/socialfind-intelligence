'use client';

import React, { useState } from 'react';
import { SearchResult } from '@/types';
import { ConfidenceBadge, ContentTypeBadge } from './ui/Badge';
import { Card3D } from './Card3D';
import { AnimatedNumber } from './AnimatedNumber';
import { 
  ExternalLink, 
  Bookmark, 
  Share2, 
  Check, 
  Clock, 
  Users, 
  Info,
  Search,
  CheckCircle2
} from 'lucide-react';
import { clsx } from 'clsx';

interface PostCardProps {
  result: SearchResult;
  isFavorite?: boolean;
  onToggleFavorite?: (result: SearchResult) => void;
  onOpenDetails?: (result: SearchResult) => void;
}

export function PostCard({ result, isFavorite = false, onToggleFavorite, onOpenDetails }: PostCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(result);
    }
  };

  // Format date display
  const formattedDate = result.publishedAt
    ? new Date(result.publishedAt).toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Data Não Confirmada';

  return (
    <Card3D maxTilt={6}>
      <div className="group relative rounded-xl bg-white dark:bg-[#0b0e14]/95 border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.22] transition-all duration-200 overflow-hidden shadow-sm hover:shadow-lg dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.55)] flex flex-col justify-between h-full text-slate-900 dark:text-white">
        {/* Top Header Information */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <ContentTypeBadge type={result.contentType} />
              <ConfidenceBadge level={result.dateConfidence} />
            </div>

            <div className="flex items-center gap-1.5">
              {/* Relevance Indicator with Animated Counter */}
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/[0.06] text-[11px] font-mono text-slate-700 dark:text-zinc-300"
                title={`Pontuação de Relevância: ${result.relevanceScore}%`}
              >
                <span className="text-slate-400 dark:text-zinc-400">Match:</span>
                <span
                  className={clsx(
                    'font-semibold',
                    result.relevanceScore >= 80 ? 'text-emerald-600 dark:text-emerald-400' : result.relevanceScore >= 60 ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-600 dark:text-zinc-400'
                  )}
                >
                  <AnimatedNumber value={result.relevanceScore} suffix="%" />
                </span>
              </div>

              {/* Favorite button */}
              <button
                type="button"
                onClick={handleFavorite}
                className={clsx(
                  'p-1.5 rounded-lg border transition-all',
                  isFavorite
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/60 text-rose-600 dark:text-rose-400 shadow-sm'
                    : 'bg-slate-100 dark:bg-zinc-900/60 border-slate-200 dark:border-white/[0.06] text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300'
                )}
                title={isFavorite ? 'Remover dos favoritos' : 'Guardar nos favoritos'}
              >
                <Bookmark className={clsx('w-3.5 h-3.5', isFavorite && 'fill-rose-500 text-rose-500')} />
              </button>

              {/* Copy button */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/[0.06] text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 transition-all"
                title="Copiar link original"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Source / Page / Group Name with direct Page Link */}
          {result.authorOrGroup && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400 font-medium">
              <Users className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400 shrink-0" />
              {result.pageUrl ? (
                <a
                  href={result.pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate hover:text-cyan-600 dark:hover:text-cyan-400 hover:underline transition-colors flex items-center gap-1"
                  title="Visitar Página / Grupo Oficial no Facebook"
                >
                  <span className="text-slate-800 dark:text-zinc-200 font-semibold">{result.authorOrGroup}</span>
                  {result.isPageVerified && <CheckCircle2 className="w-3 h-3 text-cyan-600 dark:text-cyan-400 inline shrink-0" />}
                </a>
              ) : (
                <span className="truncate text-slate-800 dark:text-zinc-200">{result.authorOrGroup}</span>
              )}
              {result.locationIdentified && (
                <span className="text-[10px] text-cyan-700 dark:text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800/40">
                  {result.locationIdentified}
                </span>
              )}
            </div>
          )}

          {/* Post Title */}
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight leading-snug line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
            {result.title}
          </h3>

          {/* Post Excerpt Snippet */}
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
            {result.description}
          </p>
        </div>

        {/* Footer Details & Primary Action */}
        <div className="p-4 pt-0 mt-2 space-y-2.5">
          {/* Date / Time and Audit */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 font-mono border-t border-slate-200 dark:border-white/[0.06] pt-3">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
              <span className={result.publishedAt ? 'text-slate-700 dark:text-zinc-300' : 'text-slate-400 dark:text-zinc-400 italic'}>
                {formattedDate}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onOpenDetails?.(result)}
              className="flex items-center gap-1 text-slate-500 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-[11px]"
            >
              <Info className="w-3 h-3" />
              <span>Auditoria</span>
            </button>
          </div>

          {/* Primary Action Button: Link Direto */}
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-lg bg-slate-100 hover:bg-cyan-500 hover:text-black border border-slate-200 hover:border-cyan-400 dark:bg-white/[0.06] dark:hover:bg-cyan-500 dark:hover:text-black dark:border-white/[0.1] dark:hover:border-cyan-400 text-xs font-semibold text-slate-800 dark:text-white flex items-center justify-center gap-2 transition-all duration-200 shadow-sm active:scale-[0.98] font-mono tracking-wider uppercase group/btn"
          >
            <span>Ver Publicação no Facebook</span>
            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </a>

          {/* Fallback Action Button: Buscar Publicação no Facebook */}
          {result.searchFallbackUrl && (
            <a
              href={result.searchFallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-1 px-2 text-[10px] font-mono text-slate-500 hover:text-cyan-600 dark:text-zinc-500 dark:hover:text-cyan-300 flex items-center justify-center gap-1 transition-colors"
              title="Se a publicação estiver oculta ou privada, este link pesquisa diretamente na barra do Facebook"
            >
              <Search className="w-2.5 h-2.5 text-cyan-600 dark:text-cyan-400" />
              <span>Post privado ou inacessível? Pesquisar no Facebook</span>
            </a>
          )}
        </div>
      </div>
    </Card3D>
  );
}
