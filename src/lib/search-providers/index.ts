import { DateFilterOption } from '@/types';

export interface RawSERPItem {
  title: string;
  link: string;
  snippet: string;
  pagemap?: any;
  date?: string;
  isDemo?: boolean;
}

export interface ISearchProvider {
  name: string;
  isConfigured(): boolean;
  search(dork: string, filter: DateFilterOption): Promise<RawSERPItem[]>;
}

/**
 * Google Programmable Search Engine (Custom Search JSON API) Provider
 */
export class GoogleCSEProvider implements ISearchProvider {
  name = 'Google Programmable Search (CSE)';
  private apiKey: string;
  private cx: string;

  constructor(apiKey?: string, cx?: string) {
    this.apiKey = apiKey || process.env.GOOGLE_SEARCH_API_KEY || '';
    this.cx = cx || process.env.GOOGLE_SEARCH_ENGINE_ID || '';
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.cx);
  }

  async search(dork: string, filter: DateFilterOption): Promise<RawSERPItem[]> {
    if (!this.isConfigured()) {
      throw new Error('Google Programmable Search não configurado. Forneça GOOGLE_SEARCH_API_KEY e GOOGLE_SEARCH_ENGINE_ID.');
    }

    // Google CSE date restriction parameter (d[number], w[number], m[number])
    let dateRestrict = '';
    if (filter === '24h') dateRestrict = '&dateRestrict=d1';
    else if (filter === '3d') dateRestrict = '&dateRestrict=d3';
    else if (filter === '7d') dateRestrict = '&dateRestrict=w1';
    else if (filter === '14d') dateRestrict = '&dateRestrict=w2';
    else if (filter === '30d') dateRestrict = '&dateRestrict=m1';

    const endpoint = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(this.apiKey)}&cx=${encodeURIComponent(this.cx)}&q=${encodeURIComponent(dork)}${dateRestrict}&num=10`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Erro na API Google CSE (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const items = data.items || [];

    return items.map((item: any) => ({
      title: item.title || '',
      link: item.link || '',
      snippet: item.snippet || '',
      pagemap: item.pagemap,
      date: item.pagemap?.metatags?.[0]?.['article:published_time'] || item.snippet,
      isDemo: false,
    }));
  }
}

/**
 * Serper.dev Google SERP API Provider
 */
export class SerperProvider implements ISearchProvider {
  name = 'Serper Google API';
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.SERPER_API_KEY || '';
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  async search(dork: string, filter: DateFilterOption): Promise<RawSERPItem[]> {
    if (!this.isConfigured()) {
      throw new Error('Serper API não configurada. Forneça SERPER_API_KEY.');
    }

    let tbs = '';
    if (filter === '24h') tbs = 'qdr:d';
    else if (filter === '3d') tbs = 'qdr:d3';
    else if (filter === '7d') tbs = 'qdr:w';
    else if (filter === '14d') tbs = 'qdr:w2';
    else if (filter === '30d') tbs = 'qdr:m';

    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: dork,
        num: 10,
        tbs: tbs || undefined,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Erro na API Serper (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const organic = data.organic || [];

    return organic.map((item: any) => ({
      title: item.title || '',
      link: item.link || '',
      snippet: item.snippet || '',
      date: item.date || item.snippet,
      isDemo: false,
    }));
  }
}

/**
 * Intelligent Realistic Demonstration Provider
 * Clearly marks every result as demonstration data.
 */
export class DemoSearchProvider implements ISearchProvider {
  name = 'Modo Demonstração (Dados Fictícios Identificados)';

  isConfigured(): boolean {
    return true;
  }

  async search(dork: string, filter: DateFilterOption): Promise<RawSERPItem[]> {
    // Extract keywords from the dork
    const queryTerm = dork.replace(/site:[^\s]+/g, '').replace(/inurl:[^\s]+/g, '').replace(/after:[^\s]+/g, '').replace(/["()OR]/g, '').trim();
    const baseTerm = queryTerm || 'Item em Destaque';

    // Generate realistic timestamps respecting the active filter
    const now = new Date();
    const offsetsInHours = [2, 5, 14, 26, 48, 72, 96, 120];

    // Build guaranteed-valid Facebook search URLs so users never encounter "publicação não existe"
    const encodedTerm = encodeURIComponent(baseTerm);
    const fbSearchUrl = `https://www.facebook.com/search/posts/?q=${encodedTerm}`;
    const fbMarketplaceUrl = `https://www.facebook.com/marketplace/search/?query=${encodedTerm}`;
    const fbPagesUrl = `https://www.facebook.com/search/pages/?q=${encodedTerm}`;

    const mockPosts: RawSERPItem[] = [
      {
        title: `${baseTerm} - Em excelente estado com garantia | Vendas & Negócios`,
        link: fbSearchUrl,
        snippet: `há 4 horas — Atenção pessoal, estou a disponibilizar ${baseTerm}. Acompanha caixa original, carregador e todos os acessórios. Contacto direto no WhatsApp ou mensagem privada. Preço negociável para entrega rápida.`,
        date: 'há 4 horas',
        isDemo: true,
      },
      {
        title: `Oportunidade urgente: ${baseTerm} disponível para entrega | Mercado Livre & Desapegos`,
        link: fbMarketplaceUrl,
        snippet: `há 1 dia — Vendo ${baseTerm} como novo, pouco tempo de uso. Motivo: aquisição de modelo recente. Localização: Centro da Cidade. Interessados por favor enviar mensagem com proposta.`,
        date: 'há 1 dia',
        isDemo: true,
      },
      {
        title: `Publicação na Página Oficial: Informações e Valores sobre ${baseTerm}`,
        link: `https://www.facebook.com/search/posts/?q=${encodedTerm}&filters=rp_creation_time%3Asub_past_7_days`,
        snippet: `há 2 dias — Quem estiver à procura de ${baseTerm}, ainda temos 3 unidades em stock com garantia de 6 meses. Emitimos fatura. Envio disponível para várias províncias.`,
        date: 'há 2 dias',
        isDemo: true,
      },
      {
        title: `Vídeo demonstrativo do produto: ${baseTerm} em funcionamento`,
        link: `https://www.facebook.com/search/videos/?q=${encodedTerm}`,
        snippet: `há 3 dias — Teste completo e análise do ${baseTerm}. Para orçamentos, encomendas ou questões comerciais, consulte o link na descrição ou comente abaixo.`,
        date: 'há 3 dias',
        isDemo: true,
      },
      {
        title: `Grande Saldão de Fim de Semana: ${baseTerm} e outros artigos`,
        link: fbSearchUrl,
        snippet: `há 5 dias — Excelente oportunidade para quem procura ${baseTerm}. Aberto a propostas razoáveis. Entrega em mãos em local seguro e público.`,
        date: 'há 5 dias',
        isDemo: true,
      },
      {
        title: `Anúncio verificado: ${baseTerm} original com recibo`,
        link: fbMarketplaceUrl,
        snippet: `há 6 dias — Disponibilizo ${baseTerm}. Totalmente funcional, sem marcas de uso acentuadas. Pagamento seguro por transferência ou numerário.`,
        date: 'há 6 dias',
        isDemo: true,
      },
      {
        title: `Página de Discussão & Comunidade: Avaliações reais de ${baseTerm}`,
        link: fbPagesUrl,
        snippet: `há 1 semana — Publicação comunitária com debate sobre ${baseTerm}, comparação de preços de mercado e fornecedores recomendados pela comunidade.`,
        date: 'há 1 semana',
        isDemo: true,
      },
    ];

    // Filter results if strict filter like 24h is active
    if (filter === '24h') {
      return mockPosts.slice(0, 2);
    }
    if (filter === '3d') {
      return mockPosts.slice(0, 4);
    }
    return mockPosts;
  }
}

/**
 * Factory helper to get active search provider
 */
export function getSearchProvider(customSettings?: {
  provider?: 'demo' | 'google_cse' | 'serper';
  googleApiKey?: string;
  googleCx?: string;
  serperApiKey?: string;
  demoModeEnabled?: boolean;
}): { provider: ISearchProvider; status: 'active' | 'demo' | 'pending_config' } {
  const chosen = customSettings?.provider || (process.env.SERP_PROVIDER as any) || 'demo';
  const demoEnabled = customSettings?.demoModeEnabled ?? (process.env.ENABLE_DEMO_FALLBACK !== 'false');

  if (chosen === 'google_cse') {
    const cse = new GoogleCSEProvider(customSettings?.googleApiKey, customSettings?.googleCx);
    if (cse.isConfigured()) {
      return { provider: cse, status: 'active' };
    }
  }

  if (chosen === 'serper') {
    const serper = new SerperProvider(customSettings?.serperApiKey);
    if (serper.isConfigured()) {
      return { provider: serper, status: 'active' };
    }
  }

  // If live provider failed or was demo, check demo preference
  if (demoEnabled || chosen === 'demo') {
    return { provider: new DemoSearchProvider(), status: 'demo' };
  }

  // Explicit Pending Configuration State
  return {
    provider: {
      name: 'Nenhum Provedor Configurado',
      isConfigured: () => false,
      search: async () => {
        throw new Error('Nenhuma API de pesquisa configurada e o Modo Demonstração está desativado. Vá a Configurações para adicionar uma chave Google CSE ou Serper.');
      },
    },
    status: 'pending_config',
  };
}
