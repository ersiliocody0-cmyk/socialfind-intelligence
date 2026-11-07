import { describe, it, expect } from 'vitest';
import { 
  isFacebookDomain, 
  normalizeFacebookUrl, 
  classifyFacebookContentType, 
  processRawSearchResults 
} from '../src/lib/result-processor';
import { interpretSearchQuery } from '../src/lib/dork-builder';

describe('Result Filtering & Processing Pipeline', () => {
  it('should validate only Facebook domains and reject foreign sites', () => {
    expect(isFacebookDomain('https://www.facebook.com/groups/test/posts/123')).toBe(true);
    expect(isFacebookDomain('https://m.facebook.com/story.php?id=456')).toBe(true);
    expect(isFacebookDomain('https://facebook.com/photo.php')).toBe(true);
    
    // External sites must be rejected
    expect(isFacebookDomain('https://g1.globo.com/noticia/facebook-novo.html')).toBe(false);
    expect(isFacebookDomain('https://twitter.com/facebook/status/123')).toBe(false);
    expect(isFacebookDomain('https://spamsite.xyz/facebook-login')).toBe(false);
  });

  it('should normalize and deduplicate URLs by removing tracking parameters', () => {
    const dirty1 = 'https://www.facebook.com/groups/feira/posts/100/?fbclid=IwAR2948172&ref=share';
    const dirty2 = 'https://www.facebook.com/groups/feira/posts/100/?__tn__=R';

    expect(normalizeFacebookUrl(dirty1)).toBe('https://www.facebook.com/groups/feira/posts/100');
    expect(normalizeFacebookUrl(dirty2)).toBe('https://www.facebook.com/groups/feira/posts/100');
    expect(normalizeFacebookUrl(dirty1)).toBe(normalizeFacebookUrl(dirty2));
  });

  it('should correctly classify Facebook content types', () => {
    expect(classifyFacebookContentType('https://www.facebook.com/groups/tecnologia/posts/123', '', '')).toBe('group');
    expect(classifyFacebookContentType('https://www.facebook.com/watch/?v=987654', '', '')).toBe('video');
    expect(classifyFacebookContentType('https://www.facebook.com/marketplace/item/555444', '', '')).toBe('marketplace');
    expect(classifyFacebookContentType('https://www.facebook.com/permalink.php?story_fbid=11', '', '')).toBe('post');
  });

  it('should process, deduplicate, filter, and score raw search items', () => {
    const rawItems = [
      {
        title: 'Toyota Hilux para venda em Luanda | Facebook',
        link: 'https://www.facebook.com/groups/carros.luanda/posts/888/?fbclid=abc',
        snippet: 'há 1 dia — Vendo Toyota Hilux em perfeito estado, motor selado, ar condicionado funcional.',
      },
      // Duplicate of above with different tracker
      {
        title: 'Toyota Hilux para venda em Luanda | Facebook',
        link: 'https://www.facebook.com/groups/carros.luanda/posts/888/?ref=bookmarks',
        snippet: 'há 1 dia — Vendo Toyota Hilux em perfeito estado...',
      },
      // External site (must be ignored)
      {
        title: 'Notícia sobre Facebook',
        link: 'https://jornaldeangola.ao/noticia/mercado',
        snippet: 'Notícia de jornal sobre o Facebook...',
      },
      {
        title: 'Toyota Hilux 2022 Automática | Facebook',
        link: 'https://www.facebook.com/groups/auto.mercado/posts/999/',
        snippet: 'há 3 dias — Toyota Hilux para venda urgente.',
      },
    ];

    const intent = interpretSearchQuery('Toyota Hilux para venda');
    const processed = processRawSearchResults(rawItems, 'search-test-1', intent, '7d');

    // Should contain exactly 2 unique items (1 duplicate discarded, 1 external discarded)
    expect(processed.length).toBe(2);
    expect(processed[0].sourceDomain).toBe('facebook.com');
    expect(processed[0].relevanceScore).toBeGreaterThanOrEqual(70);
  });
});
