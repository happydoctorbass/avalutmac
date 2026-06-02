import { NextResponse } from 'next/server';
import { broadcast } from '@/lib/pusher-broadcast';

// Simple in-memory store for server-side initialization if needed
let globalMatches: any[] = [];
let globalFocusId: string | null = null;
let globalSettings = { cardCount: 5, cardScale: 1.0 };

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (body.type === 'SYNC') {
      globalMatches = body.matches || [];
      globalFocusId = body.focusMatchId !== undefined ? body.focusMatchId : globalFocusId;
      globalSettings = body.settings || globalSettings;
      
      await broadcast('casino-sync', {
        matches: globalMatches,
        focusMatchId: globalFocusId,
        settings: globalSettings
      });
    }

    if (body.type === 'REQUEST_STATE') {
      return NextResponse.json({ success: true, matches: globalMatches, focusMatchId: globalFocusId, settings: globalSettings });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('SYNC_ERROR', e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
export async function GET() {
  return NextResponse.json({ matches: globalMatches, focusMatchId: globalFocusId, settings: globalSettings });
}