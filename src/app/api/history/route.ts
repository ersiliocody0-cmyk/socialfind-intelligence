import { NextRequest, NextResponse } from 'next/server';
import { StorageService } from '@/lib/storage';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const data = await StorageService.getSearchById(id);
      return NextResponse.json(data);
    }

    const history = await StorageService.getSearchHistory();
    return NextResponse.json({ history });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await StorageService.clearHistory();
    return NextResponse.json({ success: true, message: 'Histórico limpo com sucesso.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
