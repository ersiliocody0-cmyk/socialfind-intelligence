import { NextRequest, NextResponse } from 'next/server';
import { StorageService } from '@/lib/storage';

export async function GET() {
  try {
    const favorites = await StorageService.getFavorites();
    return NextResponse.json({ favorites });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { result, notes, tags } = body;

    if (!result || !result.id) {
      return NextResponse.json({ error: 'Resultado inválido.' }, { status: 400 });
    }

    const isFav = await StorageService.toggleFavorite(result, notes, tags);
    return NextResponse.json({ success: true, isFavorite: isFav });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const resultId = searchParams.get('resultId');

    if (!resultId) {
      return NextResponse.json({ error: 'resultId obrigatório.' }, { status: 400 });
    }

    await StorageService.removeFavorite(resultId);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
