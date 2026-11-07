import { DateConfidenceLevel, DateFilterOption } from '@/types';

export interface DateAnalysisResult {
  publishedAt: string | null; // ISO string or null
  indexedAt: string | null;   // ISO string or null
  confidence: DateConfidenceLevel;
  confidenceReason: string;
  isWithinFilterRange: boolean;
  daysDifference: number | null;
}

const MONTHS_MAP: Record<string, number> = {
  // Portuguese
  'jan': 0, 'janeiro': 0,
  'fev': 1, 'fevereiro': 1,
  'mar': 2, 'março': 2, 'marco': 2,
  'abr': 3, 'abril': 3,
  'mai': 4, 'maio': 4,
  'jun': 5, 'junho': 5,
  'jul': 6, 'julho': 6,
  'ago': 7, 'agosto': 7,
  'set': 8, 'setembro': 8,
  'out': 9, 'outubro': 9,
  'nov': 10, 'novembro': 10,
  'dez': 11, 'dezembro': 11,
  // English
  'feb': 1, 'apr': 3, 'may': 4, 'aug': 7, 'sep': 8, 'oct': 9, 'dec': 11,
};

/**
 * Parses snippet text or Google SERP snippet to extract potential date indications
 */
export function extractDateFromSnippet(text: string, referenceDate: Date = new Date()): { date: Date | null; isRelative: boolean } {
  if (!text) return { date: null, isRelative: false };
  const lower = text.toLowerCase();

  // 1. Relative Portuguese/English patterns: "há X horas", "há X dias", "X hours ago", "X days ago"
  const relativeHours = lower.match(/(?:há|ha)\s+(\d+)\s+(?:hora|horas|h)|(\d+)\s+(?:hours?|hrs?)\s+ago/i);
  if (relativeHours) {
    const hours = parseInt(relativeHours[1] || relativeHours[2], 10);
    const date = new Date(referenceDate.getTime() - hours * 60 * 60 * 1000);
    return { date, isRelative: true };
  }

  const relativeDays = lower.match(/(?:há|ha)\s+(\d+)\s+(?:dia|dias|d)|(\d+)\s+(?:days?)\s+ago/i);
  if (relativeDays) {
    const days = parseInt(relativeDays[1] || relativeDays[2], 10);
    const date = new Date(referenceDate.getTime() - days * 24 * 60 * 60 * 1000);
    return { date, isRelative: true };
  }

  const relativeWeeks = lower.match(/(?:há|ha)\s+(\d+)\s+(?:semana|semanas)|(\d+)\s+(?:weeks?)\s+ago/i);
  if (relativeWeeks) {
    const weeks = parseInt(relativeWeeks[1] || relativeWeeks[2], 10);
    const date = new Date(referenceDate.getTime() - weeks * 7 * 24 * 60 * 60 * 1000);
    return { date, isRelative: true };
  }

  if (/(?:ontem|yesterday)/i.test(lower)) {
    const date = new Date(referenceDate.getTime() - 24 * 60 * 60 * 1000);
    return { date, isRelative: true };
  }

  if (/(?:hoje|today)/i.test(lower)) {
    return { date: new Date(referenceDate.getTime()), isRelative: true };
  }

  // 2. Formatted date: "24 de out. de 2026", "24 de outubro de 2026", "24/10/2026", "2026-10-24"
  const isoMatch = lower.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const d = new Date(parseInt(isoMatch[1], 10), parseInt(isoMatch[2], 10) - 1, parseInt(isoMatch[3], 10));
    if (!isNaN(d.getTime())) return { date: d, isRelative: false };
  }

  const slashMatch = lower.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (slashMatch) {
    const d = new Date(parseInt(slashMatch[3], 10), parseInt(slashMatch[2], 10) - 1, parseInt(slashMatch[1], 10));
    if (!isNaN(d.getTime())) return { date: d, isRelative: false };
  }

  const textDateMatch = lower.match(/(\d{1,2})\s+(?:de\s+)?([a-zçã]+)(?:\.?\s+de\s+|\s+)(\d{4})/i);
  if (textDateMatch) {
    const day = parseInt(textDateMatch[1], 10);
    const monthKey = textDateMatch[2].replace('.', '').trim();
    const year = parseInt(textDateMatch[3], 10);
    const monthIndex = MONTHS_MAP[monthKey];
    if (monthIndex !== undefined) {
      const d = new Date(year, monthIndex, day);
      if (!isNaN(d.getTime())) return { date: d, isRelative: false };
    }
  }

  return { date: null, isRelative: false };
}

/**
 * Analyzes the temporal validity and date confidence of a search result.
 * Conforms to strict rule: NEVER hallucinate publication dates.
 */
export function evaluateResultDate(
  rawSnippetDate: string | null | undefined,
  snippet: string,
  url: string,
  filter: DateFilterOption,
  currentDate: Date = new Date()
): DateAnalysisResult {
  // Try extracting date from explicit SERP date string first, then fallback to snippet scanning
  let parsed = rawSnippetDate ? extractDateFromSnippet(rawSnippetDate, currentDate) : { date: null, isRelative: false };

  if (!parsed.date) {
    parsed = extractDateFromSnippet(snippet, currentDate);
  }

  const maxDaysAllowed: Record<DateFilterOption, number | null> = {
    '24h': 1,
    '3d': 3,
    '7d': 7,
    '14d': 14,
    '30d': 30,
    'all': null,
  };

  const limitDays = maxDaysAllowed[filter];

  // Case 1: No verifiable date was found
  if (!parsed.date) {
    return {
      publishedAt: null,
      indexedAt: null,
      confidence: 'unconfirmed',
      confidenceReason: 'Sem carimbo temporal identificável no excerto indexado pelo Google.',
      // If user selected "all", we keep it. If strict range selected, we include with low confidence flag
      // so user can evaluate, but mark as unconfirmed.
      isWithinFilterRange: filter === 'all' || filter === '30d' || filter === '7d',
      daysDifference: null,
    };
  }

  const dateDiffMs = currentDate.getTime() - parsed.date.getTime();
  const daysDifference = Math.max(0, Math.floor(dateDiffMs / (24 * 60 * 60 * 1000)));

  // Post permalinks with recent relative dates have highest confidence
  const isDirectPostUrl = /\/(?:posts|permalink|story\.php)\b/.test(url);

  let confidence: DateConfidenceLevel = 'medium';
  let confidenceReason = '';

  if (isDirectPostUrl && parsed.isRelative && daysDifference <= 7) {
    confidence = 'high';
    confidenceReason = `Data recente confirmada via excerto direto do post (${daysDifference === 0 ? 'Hoje' : `há ${daysDifference} dia(s)`}).`;
  } else if (parsed.isRelative) {
    confidence = 'medium';
    confidenceReason = 'Data relativa identificada na indexação do Google, sujeita a confirmação no Facebook.';
  } else if (daysDifference > 60) {
    confidence = 'low';
    confidenceReason = `Publicação ou indexação detectada com mais de ${daysDifference} dias.`;
  } else {
    confidence = 'medium';
    confidenceReason = 'Data identificada nos metadados da pesquisa.';
  }

  const isWithinFilterRange = limitDays === null ? true : daysDifference <= limitDays;

  return {
    publishedAt: parsed.date.toISOString(),
    indexedAt: new Date().toISOString(),
    confidence,
    confidenceReason,
    isWithinFilterRange,
    daysDifference,
  };
}
