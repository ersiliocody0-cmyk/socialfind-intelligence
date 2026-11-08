'use client';

import React, { useState } from 'react';
import { FacebookPageGroup, SearchResult } from '@/types';
import { Card3D } from './Card3D';
import { AnimatedNumber } from './AnimatedNumber';
import { 
  ExternalLink, 
  CheckCircle2, 
  Search, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  FileText,
  ShieldCheck
} from 'lucide-react';
import { clsx } from 'clsx';

interface FacebookPageCardProps {
  page: FacebookPageGroup;
  onOpenResultDetails?: (result: SearchResult) => void;
}

export function FacebookPageCard({ page, onOpenResultDetails }: FacebookPageCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card3D maxTilt={6}>
      <div className="group relative rounded-2xl bg-[#0c0f16]/95 border border-white/[0.08] hover:border-white/[0.22] transition-all duration-300 overflow-hidden shadow-sm hover:shadow-[0_12px_35px_rgba(0,0,0,0.6)] flex flex-col justify-between">
        {/* Top Accent Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-400 opacity-70 group-hover:opacity-100 transition-opacity" />

        <div className="p-5 space-y-4">
          {/* Header with Avatar & Page Details */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {/* 3D-styled Avatar */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1.5px] shadow-[0_0_15px_rgba(0,240,255,0.25)] shrink-0">
                <div className="w-full h-full bg-[#0a0d14] rounded-[10px] flex items-center justify-center text-white font-bold text-lg font-mono">
                  {page.avatarLetter}
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm md:text-base font-semibold text-white tracking-tight truncate group-hover:text-cyan-300 transition-colors">
                    {page.pageName}
                  </h3>
                  {page.isVerified && (
                    <span title="Página Verificada / Fonte Relevante" className="text-cyan-400 shrink-0">
                      <CheckCircle2 className="w-4 h-4 fill-cyan-400/20" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 font-mono truncate">{page.pageHandle}</p>
              </div>
            </div>

            {/* Posts Counter Pill */}
            <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-mono font-medium">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span><AnimatedNumber value={page.totalPostsFound} /> {page.totalPostsFound === 1 ? 'post' : 'posts'}</span>
            </div>
          </div>

          {/* Badges strip */}
          <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded-md bg-zinc-800/60 text-zinc-300 border border-white/[0.06]">
              {page.category}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Match: <AnimatedNumber value={page.relevanceScore} suffix="%" />
            </span>
          </div>

          {/* Excerpt Snippet */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] text-xs text-zinc-300 leading-relaxed line-clamp-2">
            {page.latestPostSnippet}
          </div>

          {/* Expandable Posts Toggle */}
          {page.posts.length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full py-1.5 px-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] text-[11px] font-mono text-zinc-400 hover:text-white flex items-center justify-between transition-colors"
              >
                <span>{isExpanded ? 'Ocultar publicações encontradas' : `Ver ${page.posts.length} publicações desta página`}</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {isExpanded && (
                <div className="mt-2.5 space-y-2 max-h-56 overflow-y-auto pr-1 animate-in fade-in duration-200">
                  {page.posts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => onOpenResultDetails?.(post)}
                      className="p-2.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/70 border border-white/[0.04] hover:border-cyan-500/30 transition-all cursor-pointer space-y-1"
                    >
                      <h4 className="text-xs font-medium text-white truncate hover:text-cyan-300">
                        {post.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400 line-clamp-1">{post.description}</p>
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-1">
                        <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('pt-PT') : 'Recente'}</span>
                        <span className="text-cyan-400">Match: {post.relevanceScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 pt-0 mt-2 space-y-2">
          {/* Guaranteed Working Primary Button: Visitar Página Oficial no Facebook */}
          <a
            href={page.pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-gradient-to-r hover:from-cyan-500 hover:to-emerald-400 hover:text-black border border-white/[0.1] hover:border-cyan-400 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 shadow-sm active:scale-[0.98] font-mono tracking-wider uppercase group/btn"
          >
            <span>Visitar Página Oficial</span>
            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </a>

          {/* Secondary Live Search Button */}
          <a
            href={page.searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-1.5 px-3 rounded-lg bg-transparent hover:bg-white/[0.04] text-[11px] font-mono text-zinc-400 hover:text-cyan-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Search className="w-3 h-3 text-cyan-400" />
            <span>Buscar publicações desta página no Facebook</span>
          </a>
        </div>
      </div>
    </Card3D>
  );
}
