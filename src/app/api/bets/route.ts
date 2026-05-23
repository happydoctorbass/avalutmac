import { NextResponse } from 'next/server';
import { broadcast } from '@/lib/pusher-broadcast';
import { GAME_EVENTS } from '@/lib/pusher';

export async function POST(req: Request) {
  try {
    const { playerId, amount, sessionId } = await req.json();
    if (!playerId?.trim() || !sessionId || amount == null) {
      return NextResponse.json({ error: 'Неверные данные' }, { status: 400 });
    }
    const bet = {
      id: Math.random().toString(36).substring(2, 9),
      session_id: sessionId,
      player_id: playerId.trim(),
      amount: Number(amount),
      created_at: new Date().toISOString(),
    };
    await broadcast(GAME_EVENTS.NEW_BID, {
      id: bet.id,
      playerId: bet.player_id,
      amount: bet.amount,
      createdAt: bet.created_at,
    });
    return NextResponse.json({ success: true, bet });
  } catch (e) {
    console.error('BETS_ERROR', e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
