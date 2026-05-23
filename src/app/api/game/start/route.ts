import { NextResponse } from 'next/server';
import { broadcast } from '@/lib/pusher-broadcast';
import { GAME_EVENTS } from '@/lib/pusher';
import { finishAtFromMinutes } from '@/lib/format-clock';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const minutes = Number(body.durationMinutes) || 180;
    const finishAt = finishAtFromMinutes(minutes);
    const sessionId = Date.now().toString();

    await broadcast(GAME_EVENTS.TOGGLE_STATE, {
      state: 'GAME',
      cards: body.cards,
      playerId: body.playerId || '',
      betAmount: body.betAmount || 0,
      language: body.language,
      gameType: body.gameType,
      cardCount: body.cardCount,
      finishAt,
      sessionId,
    });

    if (body.playerId && body.betAmount) {
      await broadcast(GAME_EVENTS.NEW_BID, {
        id: Math.random().toString(36).substring(2, 9),
        playerId: body.playerId,
        amount: Number(body.betAmount),
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true, session: { id: sessionId, finishAt } });
  } catch (e) {
    console.error('START_ERROR', e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
