import { ContentType, DateFilterOption, ParsedIntent, SearchResult, FacebookPageGroup } from '@/types';
import { evaluateResultDate } from './date-filter';

/**
 * Normalizes a Facebook URL to allow precise deduplication:
 * strips tracking parameters like fbclid, ref, etc.
 */
export function normalizeFacebookUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    // Remove typical tracking queries
    const paramsToRemove = ['fbclid', 'ref', 'hc_ref', '__tn__', 'hrc', 'paipv', 'eav', 'mibextid'];
    for (const param of paramsToRemove) {
      url.searchParams.delete(param);
    }
    // Clean hash
    url.hash = '';
    return url.toString().replace(/\/$/, '');
  } catch {
    return rawUrl.trim();
  }
}

/**
 * Validates that the domain belongs to Facebook
 */
export function isFacebookDomain(url: string): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    return (
      host === 'facebook.com' ||
      host === 'www.facebook.com' ||
      host === 'm.facebook.com' ||
      host === 'web.facebook.com' ||
      host.endsWith('.facebook.com')
    );
  } catch {
    return false;
  }
}

/**
 * Determines the content type from the Facebook URL structure and snippet
 */
export function classifyFacebookContentType(url: string, title: string, snippet: string): ContentType {
  const lowerUrl = url.toLowerCase();
  const lowerText = `${title} ${snippet}`.toLowerCase();

  if (lowerUrl.includes('/groups/')) {
    return 'group';
  }
  if (lowerUrl.includes('/watch') || lowerUrl.includes('/videos/') || lowerUrl.includes('/reel/')) {
    return 'video';
  }
  if (lowerUrl.includes('/photos/') || lowerUrl.includes('/photo.php')) {
    return 'photo';
  }
  if (lowerUrl.includes('/marketplace/')) {
    return 'marketplace';
  }
  if (
    lowerUrl.includes('/posts/') ||
    lowerUrl.includes('/permalink') ||
    lowerUrl.includes('/story.php') ||
    lowerText.includes('publicou uma atualização') ||
    lowerText.includes('escreveu uma publicação')
  ) {
    return 'post';
  }
  if (lowerUrl.includes('/pages/') || (!lowerUrl.includes('/profile.php') && !lowerUrl.includes('/posts/'))) {
    return 'page';
  }
  return 'other';
}

/**
 * Extracts author, page, or group name from title or snippet
 */
export function extractAuthorOrGroup(title: string, url: string): string {
  // Common Facebook title patterns: "Grupo Exemplo | Facebook" or "Nome da Página - Publicações | Facebook"
  const cleanTitle = title.replace(/\s*\|\s*Facebook$/i, '').replace(/\s*-\s*Facebook$/i, '').trim();

  // If in group
  if (url.includes('/groups/')) {
    const match = url.match(/\/groups\/([^\/?#]+)/);
    if (match && match[1]) {
      const slug = decodeURIComponent(match[1]).replace(/[-_.]/g, ' ');
      return `Grupo: ${slug.charAt(0).toUpperCase() + slug.slice(1)}`;
    }
  }

  // Split on pipe or dash
  const segments = cleanTitle.split(/[|\-–—]/);
  if (segments.length > 0 && segments[0].trim().length > 2) {
    return segments[0].trim();
  }

  return 'Comunidade Facebook';
}

/**
 * Calculates a dynamic relevance score (0 - 100) based on query keywords and intent
 */
export function calculateRelevanceScore(
  title: string,
  snippet: string,
  url: string,
  intent: ParsedIntent
): number {
  const text = `${title} ${snippet} ${url}`.toLowerCase();
  let score = 50; // base score

  // Check main keywords match
  let matchedKeywords = 0;
  for (const kw of intent.mainKeywords) {
    if (text.includes(kw.toLowerCase())) {
      matchedKeywords++;
      score += 15;
    }
  }

  // Intent synonyms match
  for (const syn of intent.synonyms) {
    if (text.includes(syn.toLowerCase())) {
      score += 8;
      break;
    }
  }

  // Location match bonus
  if (intent.location && text.includes(intent.location.toLowerCase())) {
    score += 12;
  }

  // URL structure bonus: direct post or group gives higher confidence
  if (url.includes('/posts/') || url.includes('/permalink/') || url.includes('/groups/')) {
    score += 10;
  }

  // Penalize generic login or help pages
  if (url.includes('/login') || url.includes('/help') || url.includes('/policies')) {
    score -= 40;
  }

  // Clamp score between 10 and 99
  return Math.min(99, Math.max(15, score));
}

/**
 * Full Pipeline processor that ingests raw SERP results, validates domain,
 * evaluates date criteria, deduplicates, and structures into SearchResult objects
 */
export function processRawSearchResults(
  rawItems: Array<{
    title: string;
    link: string;
    snippet: string;
    pagemap?: any;
    date?: string;
  }>,
  searchId: string,
  intent: ParsedIntent,
  dateFilter: DateFilterOption,
  currentDate: Date = new Date()
): SearchResult[] {
  const seenUrls = new Set<string>();
  const results: SearchResult[] = [];

  for (const raw of rawItems) {
    // 1. Domain Validation: Exclusively Facebook
    if (!isFacebookDomain(raw.link)) {
      continue;
    }

    // 2. Normalize and Deduplicate
    const normalizedUrl = normalizeFacebookUrl(raw.link);
    if (seenUrls.has(normalizedUrl)) {
      continue;
    }
    seenUrls.add(normalizedUrl);

    // 3. Evaluate Date & Confidence
    const dateAnalysis = evaluateResultDate(
      raw.date,
      raw.snippet,
      normalizedUrl,
      dateFilter,
      currentDate
    );

    // 4. Exclude results that are confirmed to be strictly out of filter range
    if (!dateAnalysis.isWithinFilterRange) {
      continue;
    }

    // 5. Content classification
    const contentType = classifyFacebookContentType(normalizedUrl, raw.title, raw.snippet);

    // 6. Author or Group extraction
    const authorOrGroup = extractAuthorOrGroup(raw.title, normalizedUrl);

    // 7. Page URL extraction & guaranteed working fallbacks
    let pageUrl: string = 'https://www.facebook.com';
    let pageName = authorOrGroup.replace(/^Grupo:\s*/i, '').trim();

    if (normalizedUrl.includes('/groups/')) {
      const match = normalizedUrl.match(/https?:\/\/[^\/]+\/groups\/([^\/?#]+)/i);
      if (match && match[1]) {
        pageUrl = `https://www.facebook.com/groups/${match[1]}`;
      }
    } else if (normalizedUrl.includes('/pages/')) {
      const match = normalizedUrl.match(/https?:\/\/[^\/]+\/pages\/([^\/?#]+)/i);
      if (match && match[1]) {
        pageUrl = `https://www.facebook.com/pages/${match[1]}`;
      }
    } else if (normalizedUrl.includes('facebook.com/')) {
      const match = normalizedUrl.match(/https?:\/\/[^\/]+\/([a-zA-Z0-9._-]+)(?:\/.*)?$/);
      if (match && match[1] && !['search', 'watch', 'marketplace', 'groups', 'events', 'photo.php', 'permalink.php'].includes(match[1])) {
        pageUrl = `https://www.facebook.com/${match[1]}`;
      }
    }

    if (pageUrl === 'https://www.facebook.com' && pageName) {
      pageUrl = `https://www.facebook.com/search/pages/?q=${encodeURIComponent(pageName)}`;
    }

    // Direct live Facebook search fallback query for this item (guaranteed live results)
    const cleanSearchTerm = raw.title.replace(/\s*\|\s*Facebook$/i, '').trim() || intent.rawQuery;
    const searchFallbackUrl = `https://www.facebook.com/search/posts/?q=${encodeURIComponent(cleanSearchTerm)}`;

    // 8. Relevance scoring
    const relevanceScore = calculateRelevanceScore(raw.title, raw.snippet, normalizedUrl, intent);

    // Extract thumbnail if available in OpenGraph / pagemap
    let thumbnailUrl: string | undefined;
    if (raw.pagemap?.cse_image && raw.pagemap.cse_image[0]?.src) {
      thumbnailUrl = raw.pagemap.cse_image[0].src;
    } else if (raw.pagemap?.metatags && raw.pagemap.metatags[0]?.['og:image']) {
      thumbnailUrl = raw.pagemap.metatags[0]['og:image'];
    }

    results.push({
      id: `res-${Math.random().toString(36).substring(2, 11)}`,
      searchId,
      title: raw.title.replace(/\s*\|\s*Facebook$/i, '').trim(),
      description: raw.snippet,
      url: normalizedUrl,
      sourceDomain: 'facebook.com',
      authorOrGroup,
      pageName,
      pageUrl,
      searchFallbackUrl,
      isPageVerified: relevanceScore >= 80,
      publishedAt: dateAnalysis.publishedAt,
      indexedAt: dateAnalysis.indexedAt,
      dateConfidence: dateAnalysis.confidence,
      dateConfidenceReason: dateAnalysis.confidenceReason,
      relevanceScore,
      contentType,
      thumbnailUrl,
      locationIdentified: intent.location,
      createdAt: new Date().toISOString(),
    });
  }

  // Sort by relevance score descending by default
  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * Aggregates and structures search results in the form of Facebook Pages (Pages view)
 */
export function groupResultsByFacebookPage(results: SearchResult[]): FacebookPageGroup[] {
  const pageMap = new Map<string, FacebookPageGroup>();

  for (const res of results) {
    const pageName = res.pageName || res.authorOrGroup || 'Página do Facebook';
    const key = pageName.toLowerCase().trim();

    if (!pageMap.has(key)) {
      const pageHandle = pageName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '.')
        .replace(/\.+/g, '.')
        .replace(/^\.|\.$/g, '') || 'facebook.page';

      const avatarLetter = (pageName.replace(/^Grupo:\s*/i, '').trim()[0] || 'F').toUpperCase();

      // Category derivation
      let category = 'Geral';
      const textToTest = `${pageName} ${res.title} ${res.description}`.toLowerCase();
      if (/venda|compras|mercado|feira|loja|olx|preço|desapego/i.test(textToTest)) {
        category = 'Comércio & Vendas';
      } else if (/tecnologia|tech|computador|celular|iphone|samsung|informática/i.test(textToTest)) {
        category = 'Tecnologia & Gadgets';
      } else if (/emprego|vagas|oportunidades|trabalho|recrutamento/i.test(textToTest)) {
        category = 'Emprego & Carreiras';
      } else if (/imobili|casa|arrendar|apartamento|terreno/i.test(textToTest)) {
        category = 'Imobiliário';
      } else if (/auto|veiculos|carros|toyota|hilux|viaturas/i.test(textToTest)) {
        category = 'Automóvel';
      }

      pageMap.set(key, {
        id: `page-${Math.random().toString(36).substring(2, 10)}`,
        pageName: pageName.replace(/^Grupo:\s*/i, '').trim(),
        pageHandle: `@${pageHandle}`,
        pageUrl: res.pageUrl || `https://www.facebook.com/search/pages/?q=${encodeURIComponent(pageName)}`,
        searchUrl: res.searchFallbackUrl || `https://www.facebook.com/search/posts/?q=${encodeURIComponent(pageName)}`,
        category,
        isVerified: res.relevanceScore >= 80 || /oficial|comunidade|oficial/i.test(pageName),
        totalPostsFound: 0,
        relevanceScore: res.relevanceScore,
        avatarLetter,
        latestPostDate: res.publishedAt,
        latestPostSnippet: res.description,
        posts: [],
      });
    }

    const group = pageMap.get(key)!;
    group.totalPostsFound += 1;
    group.posts.push(res);
    if (res.relevanceScore > group.relevanceScore) {
      group.relevanceScore = res.relevanceScore;
    }
  }

  return Array.from(pageMap.values()).sort(
    (a, b) => b.totalPostsFound - a.totalPostsFound || b.relevanceScore - a.relevanceScore
  );
}
