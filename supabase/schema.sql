-- SocialFind Intelligence - Supabase Database Schema
-- Production Ready Migration for PostgreSQL / Supabase

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'analyst')),
  plan TEXT DEFAULT 'pro' CHECK (plan IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SEARCHES TABLE
CREATE TABLE IF NOT EXISTS public.searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  intent TEXT,
  generated_dorks JSONB NOT NULL DEFAULT '[]'::jsonb,
  date_filter TEXT NOT NULL DEFAULT '7d' CHECK (date_filter IN ('24h', '3d', '7d', '14d', '30d', 'all')),
  results_count INT DEFAULT 0,
  provider TEXT DEFAULT 'google_cse',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SEARCH_RESULTS TABLE
CREATE TABLE IF NOT EXISTS public.search_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_id UUID REFERENCES public.searches(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  source_domain TEXT NOT NULL DEFAULT 'facebook.com',
  author_or_group TEXT,
  published_at TIMESTAMPTZ,
  indexed_at TIMESTAMPTZ,
  date_confidence TEXT NOT NULL DEFAULT 'medium' CHECK (date_confidence IN ('high', 'medium', 'low', 'unconfirmed')),
  date_confidence_reason TEXT,
  relevance_score INT NOT NULL DEFAULT 85 CHECK (relevance_score BETWEEN 0 AND 100),
  content_type TEXT NOT NULL DEFAULT 'post' CHECK (content_type IN ('post', 'group', 'page', 'video', 'photo', 'marketplace', 'other')),
  thumbnail_url TEXT,
  location_identified TEXT,
  raw_metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FAVORITES TABLE
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  result_id UUID REFERENCES public.search_results(id) ON DELETE CASCADE,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, result_id)
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_searches_user_id ON public.searches(user_id);
CREATE INDEX IF NOT EXISTS idx_searches_created_at ON public.searches(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_results_search_id ON public.search_results(search_id);
CREATE INDEX IF NOT EXISTS idx_search_results_url ON public.search_results(url);
CREATE INDEX IF NOT EXISTS idx_search_results_confidence ON public.search_results(date_confidence);
CREATE INDEX IF NOT EXISTS idx_search_results_relevance ON public.search_results(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can manage their searches" ON public.searches FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view results from their searches" ON public.search_results FOR SELECT USING (
  search_id IN (SELECT id FROM public.searches WHERE user_id = auth.uid())
);
CREATE POLICY "Users can manage their favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);
