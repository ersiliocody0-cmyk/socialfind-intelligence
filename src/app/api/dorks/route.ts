import { NextRequest, NextResponse } from 'next/server';
import { generateFacebookDorks } from '@/lib/dork-builder';
import { DateFilterOption } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = (body.query || '').trim();
    const dateFilter: DateFilterOption = body.dateFilter || '7d';

    if (!query) {
      return NextResponse.json({ error: 'A consulta é obrigatória.' }, { status: 400 });
    }

    const { intent, dorks } = generateFacebookDorks(query, dateFilter);

    return NextResponse.json({
      success: true,
      query,
      dateFilter,
      intent,
      dorks,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
