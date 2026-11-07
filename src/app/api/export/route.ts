import { NextRequest, NextResponse } from 'next/server';
import { SearchResult } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { format = 'csv', results = [], query = 'pesquisa' } = body as {
      format: 'csv' | 'json' | 'markdown';
      results: SearchResult[];
      query: string;
    };

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json({ error: 'Nenhum resultado fornecido para exportação.' }, { status: 400 });
    }

    if (format === 'json') {
      return new NextResponse(JSON.stringify(results, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="socialfind-${encodeURIComponent(query)}-${Date.now()}.json"`,
        },
      });
    }

    if (format === 'markdown') {
      let md = `# Relatório de Pesquisa SocialFind Intelligence\n\n`;
      md += `**Consulta**: ${query}\n`;
      md += `**Data da Extração**: ${new Date().toLocaleString('pt-PT')}\n`;
      md += `**Total de Resultados**: ${results.length}\n\n`;
      md += `---\n\n`;

      results.forEach((r, idx) => {
        md += `### ${idx + 1}. ${r.title}\n`;
        md += `- **URL Original**: [Abrir no Facebook](${r.url})\n`;
        md += `- **Fonte / Grupo**: ${r.authorOrGroup || 'Comunidade'}\n`;
        md += `- **Tipo de Conteúdo**: ${r.contentType}\n`;
        md += `- **Data**: ${r.publishedAt ? new Date(r.publishedAt).toLocaleDateString('pt-PT') : 'Não Confirmada'} (Confiança: ${r.dateConfidence})\n`;
        md += `- **Relevância**: ${r.relevanceScore}%\n`;
        md += `- **Excerto**: ${r.description}\n\n`;
      });

      return new NextResponse(md, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Content-Disposition': `attachment; filename="socialfind-${encodeURIComponent(query)}-${Date.now()}.md"`,
        },
      });
    }

    // Default: CSV
    const headers = ['Título', 'URL', 'Grupo_ou_Fonte', 'Tipo_Conteudo', 'Data_Publicacao', 'Confianca_Data', 'Relevancia', 'Excerto'];
    const escapeCsv = (str: string | null | undefined) => {
      if (!str) return '""';
      return `"${str.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
    };

    const rows = results.map(r => [
      escapeCsv(r.title),
      escapeCsv(r.url),
      escapeCsv(r.authorOrGroup),
      escapeCsv(r.contentType),
      escapeCsv(r.publishedAt ? new Date(r.publishedAt).toLocaleDateString('pt-PT') : 'Nao_Confirmada'),
      escapeCsv(r.dateConfidence),
      escapeCsv(`${r.relevanceScore}%`),
      escapeCsv(r.description),
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="socialfind-${encodeURIComponent(query)}-${Date.now()}.csv"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
