export type DateFilterOption = '24h' | '3d' | '7d' | '14d' | '30d' | 'all';

export type DateConfidenceLevel = 'high' | 'medium' | 'low' | 'unconfirmed';

export type ContentType = 'post' | 'group' | 'page' | 'video' | 'photo' | 'marketplace' | 'other';

export type IntentCategory = 
  | 'buy_sell' 
  | 'jobs' 
  | 'real_estate' 
  | 'automotive' 
  | 'services' 
  | 'general';

export interface DorkQuery {
  id: string;
  name: string;
  dork: string;
  description: string;
  strategy: 'exact_posts' | 'groups_discussions' | 'intent_keywords' | 'recent_temporal' | 'broad_content';
  targetDomain: string;
  explanation: string;
}

export interface ParsedIntent {
  rawQuery: string;
  mainKeywords: string[];
  category: IntentCategory;
  actionVerb?: string;
  location?: string;
  detectedIntentLabel: string;
  synonyms: string[];
  excludedTerms: string[];
}

export interface SearchResult {
  id: string;
  searchId: string;
  title: string;
  description: string;
  url: string;
  sourceDomain: string;
  authorOrGroup?: string;
  pageName?: string;
  pageUrl?: string;
  searchFallbackUrl?: string;
  isPageVerified?: boolean;
  publishedAt: string | null;
  indexedAt: string | null;
  dateConfidence: DateConfidenceLevel;
  dateConfidenceReason: string;
  relevanceScore: number; // 0 - 100
  contentType: ContentType;
  thumbnailUrl?: string;
  locationIdentified?: string;
  dorkUsed?: string;
  isDemo?: boolean;
  createdAt: string;
}

export interface FacebookPageGroup {
  id: string;
  pageName: string;
  pageHandle: string;
  pageUrl: string;
  searchUrl: string;
  category: string;
  isVerified: boolean;
  totalPostsFound: number;
  relevanceScore: number;
  avatarLetter: string;
  latestPostDate: string | null;
  latestPostSnippet: string;
  posts: SearchResult[];
}

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export interface SearchSummaryMetrics {
  totalResults: number;
  recentPostsCount: number;
  last24hCount: number;
  confirmedDateCount: number;
  highRelevanceCount: number;
  averageRelevance: number;
}

export interface SearchHistoryItem {
  id: string;
  userId?: string;
  query: string;
  intent: ParsedIntent;
  dateFilter: DateFilterOption;
  generatedDorks: DorkQuery[];
  resultsCount: number;
  provider: string;
  createdAt: string;
}

export interface FavoriteItem {
  id: string;
  userId?: string;
  resultId: string;
  result: SearchResult;
  notes?: string;
  tags: string[];
  createdAt: string;
}

export interface SystemSettings {
  provider: 'demo' | 'google_cse' | 'serper';
  googleApiKey: string;
  googleCx: string;
  serperApiKey: string;
  strictDomainOnly: boolean;
  strictDateFilter: boolean;
  minRelevanceScore: number;
  demoModeEnabled: boolean;
}
