import { NextResponse } from 'next/server';
import { broadcast } from '@/lib/pusher-broadcast';
import { GAME_EVENTS } from '@/lib/pusher';

export async function POST() {
  try {
    await broadcast(GAME_EVENTS.REVEAL_ALL, {});
    await broadcast(GAME_EVENTS.CELEBRATE, {});
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('AUTOFINISH_ERROR', e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
