import { describe, it, expect } from 'vitest';
import { 
  interpretSearchQuery, 
  getTemporalDateOperator, 
  generateFacebookDorks 
} from '../src/lib/dork-builder';

describe('Google Dorks Builder Engine', () => {
  it('should interpret Buy/Sell intent and location correctly', () => {
    const intent = interpretSearchQuery('Samsung à venda em Luanda');
    expect(intent.category).toBe('buy_sell');
    expect(intent.location).toBe('Luanda');
    expect(intent.mainKeywords).toContain('samsung');
    expect(intent.synonyms).toContain('vendo');
  });

  it('should interpret Job recruitment intent correctly', () => {
    const intent = interpretSearchQuery('Pessoas a procurar emprego');
    expect(intent.category).toBe('jobs');
    expect(intent.synonyms).toContain('vaga');
  });

  it('should interpret Real Estate intent correctly', () => {
    const intent = interpretSearchQuery('Casas para arrendar em Luanda');
    expect(intent.category).toBe('real_estate');
    expect(intent.location).toBe('Luanda');
    expect(intent.synonyms).toContain('arrendamento');
  });

  it('should construct correct temporal operators for all timeframes', () => {
    const fixedDate = new Date('2026-11-08T00:00:00Z');
    
    const op24h = getTemporalDateOperator('24h', fixedDate);
    expect(op24h.operator).toBe('after:2026-11-07');

    const op7d = getTemporalDateOperator('7d', fixedDate);
    expect(op7d.operator).toBe('after:2026-11-01');

    const opAll = getTemporalDateOperator('all', fixedDate);
    expect(opAll.operator).toBe('');
    expect(opAll.daysBack).toBeNull();
  });

  it('should generate multiple Facebook-specific Dork variations', () => {
    const { intent, dorks } = generateFacebookDorks('iPhone 15 Pro usado', '7d', new Date('2026-11-08T00:00:00Z'));
    
    expect(dorks.length).toBeGreaterThanOrEqual(4);
    
    // Check that every single dork targets facebook.com
    for (const dork of dorks) {
      expect(dork.dork).toContain('site:facebook.com');
      expect(dork.dork).toContain('after:2026-11-01');
    }

    // Check specific strategies exist
    const strategies = dorks.map(d => d.strategy);
    expect(strategies).toContain('exact_posts');
    expect(strategies).toContain('groups_discussions');
    expect(strategies).toContain('intent_keywords');
  });
});
