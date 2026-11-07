import { describe, it, expect } from 'vitest';
import { DemoSearchProvider, getSearchProvider } from '../src/lib/search-providers';

describe('Search Providers & Orchestration Layer', () => {
  it('should generate structured demonstration data clearly flagged as demo', async () => {
    const demo = new DemoSearchProvider();
    expect(demo.isConfigured()).toBe(true);

    const items = await demo.search('site:facebook.com "Samsung à venda"', '7d');
    expect(items.length).toBeGreaterThan(0);
    
    for (const item of items) {
      expect(item.link).toContain('facebook.com');
      expect(item.isDemo).toBe(true);
      expect(item.snippet).toContain('Samsung à venda');
    }
  });

  it('should return pending_config status when demo is disabled and credentials are missing', () => {
    const { status, provider } = getSearchProvider({
      provider: 'google_cse',
      googleApiKey: '',
      googleCx: '',
      demoModeEnabled: false,
    });

    expect(status).toBe('pending_config');
    expect(provider.isConfigured()).toBe(false);
  });

  it('should activate demo mode when requested', () => {
    const { status, provider } = getSearchProvider({
      provider: 'demo',
      demoModeEnabled: true,
    });

    expect(status).toBe('demo');
    expect(provider.name).toContain('Modo Demonstração');
  });
});
