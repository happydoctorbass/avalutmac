import { NextResponse } from 'next/server';
import { broadcast } from '@/lib/pusher-broadcast';
import { GAME_EVENTS } from '@/lib/pusher';

export async function POST(req: Request) {
  try {
    let revealEventId: string | undefined;
    let celebrateEventId: string | undefined;
    try {
      const body = await req.json();
      revealEventId = body?.revealEventId;
      celebrateEventId = body?.celebrateEventId;
    } catch {
      // Empty body is valid
    }
    await broadcast(GAME_EVENTS.REVEAL_ALL, { _eventId: revealEventId });
    await broadcast(GAME_EVENTS.CELEBRATE, { _eventId: celebrateEventId });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('AUTOFINISH_ERROR', e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
