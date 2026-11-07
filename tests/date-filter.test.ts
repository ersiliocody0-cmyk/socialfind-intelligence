import { describe, it, expect } from 'vitest';
import { extractDateFromSnippet, evaluateResultDate } from '../src/lib/date-filter';

describe('Intelligent Date Filter & Anti-Hallucination Engine', () => {
  const refDate = new Date('2026-11-08T12:00:00Z');

  it('should extract relative dates from Portuguese snippets', () => {
    const resHours = extractDateFromSnippet('há 4 horas — Vendo Samsung em Luanda', refDate);
    expect(resHours.isRelative).toBe(true);
    expect(resHours.date).not.toBeNull();
    const diffHours = (refDate.getTime() - resHours.date!.getTime()) / (1000 * 60 * 60);
    expect(Math.round(diffHours)).toBe(4);

    const resDays = extractDateFromSnippet('há 2 dias — Oferta imperdível', refDate);
    expect(resDays.isRelative).toBe(true);
    const diffDays = (refDate.getTime() - resDays.date!.getTime()) / (1000 * 60 * 60 * 24);
    expect(Math.round(diffDays)).toBe(2);
  });

  it('should extract explicit dates accurately', () => {
    const resIso = extractDateFromSnippet('Publicado em 2026-11-01 no Facebook', refDate);
    expect(resIso.date).not.toBeNull();
    expect(resIso.date!.getFullYear()).toBe(2026);
    expect(resIso.date!.getMonth()).toBe(10); // November is index 10
    expect(resIso.date!.getDate()).toBe(1);
  });

  it('should return unconfirmed when no date is present (NEVER hallucinate)', () => {
    const resEmpty = evaluateResultDate(
      null,
      'Vendo computador portátil usado em excelente estado. Contactar por mensagem privada.',
      'https://www.facebook.com/groups/feira/posts/123456789/',
      '7d',
      refDate
    );

    expect(resEmpty.publishedAt).toBeNull();
    expect(resEmpty.confidence).toBe('unconfirmed');
    expect(resEmpty.confidenceReason).toContain('Sem carimbo temporal identificável');
  });

  it('should classify high confidence for verified direct post permalinks within range', () => {
    const resHigh = evaluateResultDate(
      'há 2 dias',
      'Atenção pessoal, tenho iPhone 15 Pro para venda',
      'https://www.facebook.com/groups/vendas/posts/9988776655/',
      '7d',
      refDate
    );

    expect(resHigh.confidence).toBe('high');
    expect(resHigh.isWithinFilterRange).toBe(true);
  });

  it('should reject results that exceed strict temporal limits', () => {
    // 5 days ago snippet when user selected 24h filter
    const resOutdated = evaluateResultDate(
      'há 5 dias',
      'Antigo anúncio de venda',
      'https://www.facebook.com/groups/vendas/posts/11223344/',
      '24h',
      refDate
    );

    expect(resOutdated.isWithinFilterRange).toBe(false);
  });
});
