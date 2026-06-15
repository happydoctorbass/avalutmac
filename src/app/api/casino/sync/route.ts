export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { broadcast } from '@/lib/pusher-broadcast';
import { DEFAULT_SETTINGS } from '@/types/match';

// Simple in-memory store for server-side initialization if needed
let globalMatches: any[] = [];
let globalFocusId: string | null = null;
let globalSettings: any = { ...DEFAULT_SETTINGS };
let globalIndex = 0;
// Версия состояния приходит от клиента (монотонная по времени) — пробрасываем её дальше
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
      if (typeof body.version === 'number') globalVersion = body.version;

      // НЕ отправляем массив матчей через Pusher, так как при добавлении "Все"
      // размер payload превышает лимит Pusher в 10 КБ, что вызывает ошибку 500.
      // Отправляем только пинг с версией. Клиенты сами заберут полное состояние через GET.
      await broadcast('casino-sync', {
        type: 'INVALIDATE',
        version: globalVersion,
        focusMatchId: globalFocusId,
        currentIndex: globalIndex,
        settings: globalSettings,
      });
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
