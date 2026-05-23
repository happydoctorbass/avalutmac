import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { broadcast } from '@/lib/pusher-broadcast';
import { GAME_EVENTS } from '@/lib/pusher';

export async function POST(req: Request) {
  try {
    const { playerId, amount, sessionId } = await req.json();
    if (!playerId?.trim() || !sessionId || amount == null) {
      return NextResponse.json({ error: 'Неверные данные' }, { status: 400 });
    }
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('bets')
      .insert({ session_id: sessionId, player_id: playerId.trim(), amount: Number(amount) })
      .select()
      .single();
    if (error) throw error;
    await broadcast(GAME_EVENTS.NEW_BID, {
      playerId: data.player_id,
      amount: data.amount,
      createdAt: data.created_at,
    });
    await broadcast(GAME_EVENTS.BETS_UPDATED, {});
    return NextResponse.json({ success: true, bet: data });
  } catch (e) {
    console.error('BETS_ERROR', e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
