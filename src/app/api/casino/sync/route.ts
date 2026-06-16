export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { broadcast } from '@/lib/pusher-broadcast';
import { DEFAULT_SETTINGS } from '@/types/match';
import { mergeCasinoSettings } from '@/lib/table-display-settings';
import fs from 'fs/promises';
import path from 'path';

const STATE_FILE = path.join(process.cwd(), 'data', 'casino-board-state.json');

type BoardState = {
  matches: unknown[];
  focusMatchId: string | null;
  settings: typeof DEFAULT_SETTINGS;
  currentIndex: number;
  version: number;
};

let globalMatches: unknown[] = [];
let globalFocusId: string | null = null;
let globalSettings: typeof DEFAULT_SETTINGS = { ...DEFAULT_SETTINGS };
let globalIndex = 0;
let globalVersion = 0;

function payload(): BoardState {
  return {
    matches: globalMatches,
    focusMatchId: globalFocusId,
    settings: globalSettings,
    currentIndex: globalIndex,
    version: globalVersion,
  };
}

async function loadStateFromDisk() {
  try {
    const raw = await fs.readFile(STATE_FILE, 'utf8');
    const data = JSON.parse(raw) as Partial<BoardState>;
    globalMatches = Array.isArray(data.matches) ? data.matches : [];
    globalFocusId = data.focusMatchId ?? null;
    globalSettings = data.settings ? mergeCasinoSettings(data.settings) : { ...DEFAULT_SETTINGS };
    globalIndex = typeof data.currentIndex === 'number' ? data.currentIndex : 0;
    globalVersion = typeof data.version === 'number' ? data.version : 0;
  } catch {
    // Файл ещё не создан — оставляем значения по умолчанию
  }
}

async function saveStateToDisk() {
  await fs.mkdir(path.dirname(STATE_FILE), { recursive: true });
  await fs.writeFile(STATE_FILE, JSON.stringify(payload(), null, 2), 'utf8');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.type === 'SYNC') {
      await loadStateFromDisk();

      // Принимаем только более новую версию, чтобы старые запросы не откатывали состояние
      const incomingVersion = typeof body.version === 'number' ? body.version : 0;
      if (incomingVersion < globalVersion) {
        return NextResponse.json({ success: true, ignored: true, ...payload() });
      }

      globalMatches = body.matches !== undefined ? body.matches : globalMatches;
      globalFocusId = body.focusMatchId !== undefined ? body.focusMatchId : globalFocusId;
      globalSettings = body.settings ? mergeCasinoSettings(body.settings) : globalSettings;
      if (body.currentIndex !== undefined) globalIndex = body.currentIndex;
      globalVersion = incomingVersion;

      await saveStateToDisk();

      await broadcast('casino-sync', {
        type: 'INVALIDATE',
        version: globalVersion,
        focusMatchId: globalFocusId,
        currentIndex: globalIndex,
        settings: globalSettings,
      });

      return NextResponse.json({ success: true, ...payload() });
    }

    if (body.type === 'REQUEST_STATE') {
      await loadStateFromDisk();
      return NextResponse.json({ success: true, ...payload() });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('SYNC_ERROR', e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  await loadStateFromDisk();
  return NextResponse.json(payload());
}
