import { NextResponse } from 'next/server';
import { broadcast } from '@/lib/pusher-broadcast';
import { GAME_EVENTS } from '@/lib/pusher';

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();
    // Supabase has been removed; just broadcast the STOP event.
    await broadcast(GAME_EVENTS.TOGGLE_STATE, { state: 'IDLE', sessionId });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('STOP_ERROR', e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
