import { NextRequest, NextResponse } from 'next/server';
import { generateFacebookDorks } from '@/lib/dork-builder';
import { getSearchProvider, RawSERPItem } from '@/lib/search-providers';
import { processRawSearchResults, groupResultsByFacebookPage } from '@/lib/result-processor';
import { StorageService } from '@/lib/storage';
import { DateFilterOption, SearchHistoryItem, SearchSummaryMetrics } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = (body.query || '').trim();
    const dateFilter: DateFilterOption = body.dateFilter || '7d';
    const customSettings = body.customSettings;

    if (!query) {
      return NextResponse.json({ error: 'A consulta de pesquisa é obrigatória.' }, { status: 400 });
    }

    // 1. Dorks Engine Generation
    const { intent, dorks } = generateFacebookDorks(query, dateFilter);

    // 2. Select Search Provider
    const { provider, status: providerStatus } = getSearchProvider(customSettings);

    // If no provider is configured and demo is off, return pending configuration status
    if (providerStatus === 'pending_config') {
      return NextResponse.json({
        success: false,
        status: 'pending_config',
        message: 'Nenhum fornecedor de pesquisa SERP configurado e o Modo Demonstração está inativo.',
        intent,
        dorks,
        instructions: {
          googleCse: 'Configure GOOGLE_SEARCH_API_KEY e GOOGLE_SEARCH_ENGINE_ID no painel de configurações ou em .env.local',
          serper: 'Configure SERPER_API_KEY no painel de configurações',
          demoMode: 'Ative o Modo Demonstração para testar com dados fictícios identificados.',
        },
      }, { status: 428 });
    }

    // 3. Execute Search with Primary Dorks
    let rawItems: RawSERPItem[] = [];
    const searchId = `search-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // Use primary posts dork and group dork to collect relevant items
    const primaryDork = dorks[0].dork;
    try {
      const items = await provider.search(primaryDork, dateFilter);
      rawItems.push(...items);
    } catch (err: any) {
      console.error('Primary dork search failed:', err.message);
      // If live API throws error and fallback is allowed
      if (customSettings?.demoModeEnabled !== false) {
        const { provider: demoProv } = getSearchProvider({ provider: 'demo' });
        const fallbackItems = await demoProv.search(primaryDork, dateFilter);
        rawItems.push(...fallbackItems);
      } else {
        throw err;
      }
    }

    // Also run second dork (groups) if available and items count is low
    if (rawItems.length < 5 && dorks.length > 1) {
      try {
        const secondaryItems = await provider.search(dorks[1].dork, dateFilter);
        rawItems.push(...secondaryItems);
      } catch {
        // Continue with collected items
      }
    }

    // 4. Processing Pipeline: Domain check, Date evaluation, Deduplication, Relevance
    const processedResults = processRawSearchResults(rawItems, searchId, intent, dateFilter);

    // 5. Compute Top Summary Metrics & Aggregate into Facebook Pages
    const pages = groupResultsByFacebookPage(processedResults);

    const now = new Date();
    const oneDayAgoMs = 24 * 60 * 60 * 1000;
    const sevenDaysAgoMs = 7 * 24 * 60 * 60 * 1000;

    let recentPostsCount = 0;
    let last24hCount = 0;
    let confirmedDateCount = 0;
    let highRelevanceCount = 0;
    let totalScore = 0;

    for (const res of processedResults) {
      totalScore += res.relevanceScore;
      if (res.relevanceScore >= 80) highRelevanceCount++;
      if (res.dateConfidence === 'high') confirmedDateCount++;

      if (res.publishedAt) {
        const pDate = new Date(res.publishedAt).getTime();
        const diff = now.getTime() - pDate;
        if (diff <= oneDayAgoMs) last24hCount++;
        if (diff <= sevenDaysAgoMs) recentPostsCount++;
      }
    }

    const metrics: SearchSummaryMetrics = {
      totalResults: processedResults.length,
      recentPostsCount,
      last24hCount,
      confirmedDateCount,
      highRelevanceCount,
      averageRelevance: processedResults.length > 0 ? Math.round(totalScore / processedResults.length) : 0,
    };

    // 6. Save in Search History
    const historyItem: SearchHistoryItem = {
      id: searchId,
      query,
      intent,
      dateFilter,
      generatedDorks: dorks,
      resultsCount: processedResults.length,
      provider: provider.name,
      createdAt: new Date().toISOString(),
    };

    await StorageService.saveSearch(historyItem, processedResults);

    return NextResponse.json({
      success: true,
      searchId,
      intent,
      dorks,
      results: processedResults,
      pages,
      metrics,
      providerName: provider.name,
      isDemo: providerStatus === 'demo' || processedResults.some(r => r.isDemo),
    });
  } catch (err: any) {
    console.error('Search API Route Error:', err);
    return NextResponse.json({
      error: err.message || 'Ocorreu um erro ao executar a pesquisa inteligente.',
    }, { status: 500 });
  }
}
