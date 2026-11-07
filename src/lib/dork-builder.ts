import { DateFilterOption, DorkQuery, IntentCategory, ParsedIntent } from '@/types';

// Common geographical references for Portuguese / International queries
const KNOWN_LOCATIONS = [
  'luanda', 'benguela', 'huambo', 'lubango', 'angola',
  'lisboa', 'porto', 'coimbra', 'braga', 'faro', 'portugal',
  'maputo', 'matola', 'beira', 'mocambique', 'moçambique',
  'sao paulo', 'são paulo', 'rio de janeiro', 'brasil', 'curitiba'
];

/**
 * Intelligent parser that extracts intent, categories, locations and keywords
 */
export function interpretSearchQuery(query: string): ParsedIntent {
  const clean = query.trim().toLowerCase();
  const words = clean.split(/\s+/).filter(Boolean);

  let category: IntentCategory = 'general';
  let detectedIntentLabel = 'Pesquisa Geral no Facebook';
  let actionVerb: string | undefined;
  const synonyms: string[] = [];
  const excludedTerms: string[] = ['site:facebook.com'];

  // Detect location
  let location: string | undefined;
  for (const loc of KNOWN_LOCATIONS) {
    if (clean.includes(loc)) {
      location = loc.charAt(0).toUpperCase() + loc.slice(1);
      break;
    }
  }

  // Detect Buy / Sell Intent
  if (/venda|vendo|vender|comprar|compro|preço|preco|usado|novo|custo|barato|valor/i.test(clean)) {
    category = 'buy_sell';
    detectedIntentLabel = 'Comércio e Vendas / Marketplace';
    actionVerb = 'Venda / Compra';
    synonyms.push('vendo', 'venda', 'preço', 'disponível', 'negociável');
  } 
  // Detect Real Estate
  else if (/arrendar|aluguel|alugar|apartamento|vivenda|quarto|casa|moradia|t1|t2|t3|imobiliária/i.test(clean)) {
    category = 'real_estate';
    detectedIntentLabel = 'Imobiliário e Arrendamento';
    actionVerb = 'Arrendar / Comprar Imóvel';
    synonyms.push('arrendamento', 'aluga-se', 'vivenda', 'apartamento', 'disponível');
  }
  // Detect Jobs / Recruitment
  else if (/emprego|vaga|recrutamento|precisa-se|trabalho|currículo|curriculo|estágio|estagio|oportunidade/i.test(clean)) {
    category = 'jobs';
    detectedIntentLabel = 'Emprego e Oportunidades';
    actionVerb = 'Recrutamento / Emprego';
    synonyms.push('vaga', 'recrutamento', 'precisa-se', 'candidatura', 'oportunidade');
  }
  // Detect Automotive
  else if (/carro|viatura|automóvel|automovel|veículo|hilux|toyota|moto|mota|carrinha/i.test(clean)) {
    category = 'automotive';
    detectedIntentLabel = 'Veículos e Automóveis';
    actionVerb = 'Veículos Automóveis';
    synonyms.push('viatura', 'carro', 'à venda', 'quilómetros', 'km');
  }
  // Detect Services
  else if (/serviço|servico|reparação|freelance|técnico|aulas|transporte/i.test(clean)) {
    category = 'services';
    detectedIntentLabel = 'Prestação de Serviços';
    actionVerb = 'Serviços Especializados';
    synonyms.push('serviço', 'contacto', 'orçamento');
  }

  // Clean core keywords (strip stop words and action words)
  const stopWords = new Set([
    'a', 'o', 'as', 'os', 'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na',
    'nos', 'nas', 'para', 'por', 'com', 'um', 'uma', 'uns', 'umas', 'que', 'e',
    'à', 'ao', 'aos', 'às', 'sobre', 'estás', 'estas', 'está', 'procura'
  ]);

  const mainKeywords = words.filter(w => !stopWords.has(w) && w.length > 1);

  return {
    rawQuery: query,
    mainKeywords,
    category,
    actionVerb,
    location,
    detectedIntentLabel,
    synonyms,
    excludedTerms,
  };
}

/**
 * Calculates date operator string like "after:2026-11-01" based on current date
 */
export function getTemporalDateOperator(filter: DateFilterOption, baseDate: Date = new Date()): { operator: string; daysBack: number | null } {
  if (filter === 'all') {
    return { operator: '', daysBack: null };
  }

  const daysMap: Record<DateFilterOption, number | null> = {
    '24h': 1,
    '3d': 3,
    '7d': 7,
    '14d': 14,
    '30d': 30,
    'all': null,
  };

  const days = daysMap[filter] || 7;
  const targetDate = new Date(baseDate.getTime() - days * 24 * 60 * 60 * 1000);
  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');

  return {
    operator: `after:${year}-${month}-${day}`,
    daysBack: days,
  };
}

/**
 * Generates an array of Google Dorks tailored for Facebook indexed public content
 */
export function generateFacebookDorks(
  query: string,
  dateFilter: DateFilterOption = '7d',
  currentDate: Date = new Date()
): { intent: ParsedIntent; dorks: DorkQuery[] } {
  const intent = interpretSearchQuery(query);
  const { operator: dateOp } = getTemporalDateOperator(dateFilter, currentDate);

  const keywordsJoined = intent.mainKeywords.map(k => `"${k}"`).join(' ');
  const rawClean = query.replace(/["']/g, '').trim();
  const locationTag = intent.location ? ` "${intent.location}"` : '';

  const dorks: DorkQuery[] = [];

  // 1. Direct Post & Permalink Targeting (Highest accuracy for actual status updates & posts)
  const dork1 = [
    'site:facebook.com',
    '(inurl:posts OR inurl:permalink OR inurl:story.php)',
    `"${rawClean}"`,
    dateOp,
  ].filter(Boolean).join(' ');

  dorks.push({
    id: 'dork-posts',
    name: 'Publicações Diretas & Permalinks',
    dork: dork1,
    description: 'Filtra especificamente URLs com padrões de publicações públicas do Facebook.',
    strategy: 'exact_posts',
    targetDomain: 'facebook.com',
    explanation: 'Utiliza operadores inurl:posts e inurl:permalink para evitar páginas estáticas e capturar posts reais.',
  });

  // 2. Public Groups & Discussions Dork
  const dork2 = [
    'site:facebook.com/groups',
    keywordsJoined,
    locationTag,
    dateOp,
  ].filter(Boolean).join(' ');

  dorks.push({
    id: 'dork-groups',
    name: 'Grupos Públicos & Comunidades',
    dork: dork2,
    description: 'Procura em grupos públicos onde decorrem conversas e negociações comunitárias.',
    strategy: 'groups_discussions',
    targetDomain: 'facebook.com/groups',
    explanation: 'Foca a pesquisa na estrutura de diretório /groups/ onde ocorrem 70% das publicações públicas de compra, venda e anúncios.',
  });

  // 3. Intent-Driven Synonym Expansion (Matches commercial keywords or recruitment phrases)
  let synonymGroup = '';
  if (intent.category === 'buy_sell') {
    synonymGroup = '("vendo" OR "venda" OR "preço" OR "valor" OR "disponível")';
  } else if (intent.category === 'jobs') {
    synonymGroup = '("vaga" OR "recrutamento" OR "oportunidade" OR "precisa-se")';
  } else if (intent.category === 'real_estate') {
    synonymGroup = '("arrendamento" OR "aluga-se" OR "preço" OR "disponível")';
  } else if (intent.category === 'automotive') {
    synonymGroup = '("à venda" OR "vendo" OR "km" OR "negociável")';
  } else {
    synonymGroup = '("publicação" OR "informações" OR "contacto")';
  }

  const dork3 = [
    'site:facebook.com',
    keywordsJoined,
    synonymGroup,
    locationTag,
    dateOp,
  ].filter(Boolean).join(' ');

  dorks.push({
    id: 'dork-intent',
    name: 'Expansão Semântica de Intenção',
    dork: dork3,
    description: 'Amplia a descoberta através de palavras-chave contextuais e sinónimos comuns.',
    strategy: 'intent_keywords',
    targetDomain: 'facebook.com',
    explanation: 'Combina termos da pesquisa com palavras-chave de intenção identificadas pela IA para capturar variações linguísticas.',
  });

  // 4. Temporal Priority Dork (Explicit after operator with broad match)
  if (dateOp) {
    const dork4 = `site:facebook.com "${rawClean}" ${dateOp}`;
    dorks.push({
      id: 'dork-temporal',
      name: 'Filtro Temporal Rigoroso',
      dork: dork4,
      description: 'Prioriza estritamente os resultados indexados dentro da janela temporal selecionada.',
      strategy: 'recent_temporal',
      targetDomain: 'facebook.com',
      explanation: `Aplica o operador cronológico nativo do Google (${dateOp}) para excluir publicações antigas.`,
    });
  }

  // 5. Video / Reels / Visual Media Content Dork
  const dork5 = [
    'site:facebook.com',
    '(inurl:watch OR inurl:videos OR inurl:reel)',
    keywordsJoined,
    dateOp,
  ].filter(Boolean).join(' ');

  dorks.push({
    id: 'dork-media',
    name: 'Vídeos & Conteúdo Multimédia',
    dork: dork5,
    description: 'Encontra vídeos e transmissões públicas associadas à pesquisa.',
    strategy: 'broad_content',
    targetDomain: 'facebook.com',
    explanation: 'Isola transmissões de vídeo e Reels públicos no Facebook.',
  });

  return { intent, dorks };
}
