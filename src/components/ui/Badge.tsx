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
    default: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-zinc-800/80 dark:text-zinc-300 dark:border-zinc-700/60',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-300 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border-cyan-800/50 shadow-sm',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50 shadow-sm',
    amber: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50 shadow-sm',
    rose: 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/50',
    muted: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-zinc-900/60 dark:text-zinc-400 dark:border-white/[0.06]',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 rounded-full font-medium',
    md: 'text-xs px-2.5 py-1 rounded-full font-medium',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 border tracking-wide uppercase font-mono transition-colors duration-200',
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
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
        Alta Confiança
      </Badge>
    );
  }
  if (level === 'medium') {
    return (
      <Badge variant="amber">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400" />
        Média Confiança
      </Badge>
    );
  }
  if (level === 'low') {
    return (
      <Badge variant="rose">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-rose-400" />
        Baixa Confiança
      </Badge>
    );
  }
  return (
    <Badge variant="muted">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-zinc-500" />
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
