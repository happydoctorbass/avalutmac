import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = getSupabaseServer();
    const now = new Date().toISOString();
    const { data: rows, error } = await supabase
      .from('game_sessions')
      .select('id, status, finish_at, game_type, card_count, start_at')
      .in('status', ['active', 'GAME'])
      .gt('finish_at', now)
      .order('start_at', { ascending: false })
      .limit(1);
    if (error) throw error;
    const session = rows?.[0];
    if (!session) return NextResponse.json({ active: false });

    const { data: bets } = await supabase
      .from('bets')
      .select('player_id, amount')
      .eq('session_id', session.id)
      .order('amount', { ascending: false })
      .limit(1);

    const top = bets?.[0];
    return NextResponse.json({
      active: true,
      session: {
        id: session.id,
        finishAt: session.finish_at,
        gameType: session.game_type,
        cardCount: session.card_count,
      },
      topBid: top ? { playerId: top.player_id, amount: top.amount } : null,
    });
  } catch (e) {
    console.error('CURRENT_GAME_ERROR', e);
    return NextResponse.json({ active: false }, { status: 500 });
  }
}
