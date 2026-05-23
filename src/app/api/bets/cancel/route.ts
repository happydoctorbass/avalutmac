import { NextResponse } from 'next/server';
import { broadcast } from '@/lib/pusher-broadcast';
import { GAME_EVENTS } from '@/lib/pusher';

export async function POST(req: Request) {
  try {
    const { betId, sessionId } = await req.json();
    if (!betId || !sessionId) {
      return NextResponse.json({ error: 'Неверные данные' }, { status: 400 });
    }
    
    await broadcast(GAME_EVENTS.CANCEL_BID, {
      betId,
      sessionId
    });
    
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('CANCEL_BID_ERROR', e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
