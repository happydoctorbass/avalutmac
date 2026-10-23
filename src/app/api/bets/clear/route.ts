import { NextResponse } from 'next/server';
import { broadcast } from '@/lib/pusher-broadcast';
import { GAME_EVENTS } from '@/lib/pusher';

export async function POST(req: Request) {
  try {
    let _eventId: string | undefined;
    try {
      const body = await req.json();
      _eventId = body?._eventId;
    } catch {
      // Empty body is valid
    }
    await broadcast(GAME_EVENTS.CLEAR_BETS, { _eventId });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('CLEAR_BETS_ERROR', e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
