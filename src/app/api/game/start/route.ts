import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { broadcast } from '@/lib/pusher-broadcast';
import { GAME_EVENTS } from '@/lib/pusher';
import { finishAtFromMinutes } from '@/lib/format-clock';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const minutes = Number(body.durationMinutes) || 180;
    const finishAt = finishAtFromMinutes(minutes);
    const supabase = getSupabaseServer();
    const { data: session, error } = await supabase
      .from('game_sessions')
      .insert({
        status: 'active',
        start_at: new Date().toISOString(),
        finish_at: finishAt,
        game_type: body.gameType,
        card_count: body.cardCount,
      })
      .select()
      .single();
    if (error) throw error;
    await broadcast(GAME_EVENTS.TOGGLE_STATE, {
      state: 'GAME',
      cards: body.cards,
      playerId: body.playerId || '',
      betAmount: body.betAmount || 0,
      language: body.language,
      gameType: body.gameType,
      cardCount: body.cardCount,
      finishAt,
      dbSessionId: session.id,
    });
    return NextResponse.json({ success: true, session });
  } catch (e) {
    console.error('START_ERROR', e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
