import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { broadcast } from '@/lib/pusher-broadcast';
import { GAME_EVENTS } from '@/lib/pusher';

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();
    if (sessionId) {
      const supabase = getSupabaseServer();
      await supabase.from('game_sessions').update({ status: 'ended' }).eq('id', sessionId);
    }
    await broadcast(GAME_EVENTS.TOGGLE_STATE, { state: 'IDLE' });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('STOP_ERROR', e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
