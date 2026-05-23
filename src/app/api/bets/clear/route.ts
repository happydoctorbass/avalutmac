import { NextResponse } from 'next/server';
import { broadcast } from '@/lib/pusher-broadcast';
import { GAME_EVENTS } from '@/lib/pusher';

export async function POST() {
  try {
    await broadcast(GAME_EVENTS.CLEAR_BETS, {});
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('CLEAR_BETS_ERROR', e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
