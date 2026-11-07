import React from 'react';
import { clsx } from 'clsx';
import { DateConfidenceLevel, ContentType } from '@/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'muted';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  const variantStyles = {
    default: 'bg-zinc-800/80 text-zinc-300 border-zinc-700/60',
    cyan: 'bg-cyan-950/40 text-cyan-400 border-cyan-800/50 shadow-[0_0_10px_rgba(0,240,255,0.15)]',
    emerald: 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50 shadow-[0_0_10px_rgba(16,185,129,0.15)]',
    amber: 'bg-amber-950/40 text-amber-400 border-amber-800/50 shadow-[0_0_10px_rgba(245,158,11,0.15)]',
    rose: 'bg-rose-950/40 text-rose-400 border-rose-800/50',
    muted: 'bg-zinc-900/60 text-zinc-400 border-white/[0.06]',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 rounded-full font-medium',
    md: 'text-xs px-2.5 py-1 rounded-full font-medium',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 border tracking-wide uppercase font-mono',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}

export function ConfidenceBadge({ level }: { level: DateConfidenceLevel }) {
  if (level === 'high') {
    return (
      <Badge variant="emerald">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Alta Confiança
      </Badge>
    );
  }
  if (level === 'medium') {
    return (
      <Badge variant="amber">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        Média Confiança
      </Badge>
    );
  }
  if (level === 'low') {
    return (
      <Badge variant="rose">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
        Baixa Confiança
      </Badge>
    );
  }
  return (
    <Badge variant="muted">
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
      Data Não Confirmada
    </Badge>
  );
}

export function ContentTypeBadge({ type }: { type: ContentType }) {
  const map: Record<ContentType, { label: string; variant: 'cyan' | 'default' | 'emerald' | 'amber' }> = {
    post: { label: 'Publicação', variant: 'cyan' },
    group: { label: 'Grupo Público', variant: 'default' },
    page: { label: 'Página Pública', variant: 'default' },
    video: { label: 'Vídeo / Reel', variant: 'emerald' },
    photo: { label: 'Fotografia', variant: 'amber' },
    marketplace: { label: 'Vendas / Mercado', variant: 'cyan' },
    other: { label: 'Conteúdo Público', variant: 'default' },
  };

  const conf = map[type] || map.other;
  return <Badge variant={conf.variant}>{conf.label}</Badge>;
}
