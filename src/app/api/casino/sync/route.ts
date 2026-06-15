import { NextResponse } from 'next/server';
import { broadcast } from '@/lib/pusher-broadcast';
import { DEFAULT_SETTINGS } from '@/types/match';

// Simple in-memory store for server-side initialization if needed
let globalMatches: any[] = [];
let globalFocusId: string | null = null;
let globalSettings: any = { ...DEFAULT_SETTINGS };
let globalIndex = 0;
// Монотонная версия состояния — нужна, чтобы клиенты игнорировали устаревшие эхо-сообщения
let globalVersion = 0;

function payload() {
  return {
    matches: globalMatches,
    focusMatchId: globalFocusId,
    settings: globalSettings,
    currentIndex: globalIndex,
    version: globalVersion,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.type === 'SYNC') {
      globalMatches = body.matches || [];
      globalFocusId = body.focusMatchId !== undefined ? body.focusMatchId : globalFocusId;
      globalSettings = body.settings ? { ...DEFAULT_SETTINGS, ...body.settings } : globalSettings;
      if (body.currentIndex !== undefined) globalIndex = body.currentIndex;
      globalVersion += 1;

      await broadcast('casino-sync', payload());
    }

    if (body.type === 'REQUEST_STATE') {
      return NextResponse.json({ success: true, ...payload() });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('SYNC_ERROR', e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(payload());
}
