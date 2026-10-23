import { getPusherServer } from '@/lib/pusher-server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event, data } = body;

    const server = getPusherServer();
    if (!server) {
      return NextResponse.json({
        success: true,
        localOnly: true,
        message: 'Pusher not configured — handled via BroadcastChannel locally',
      });
    }

    try {
      await server.trigger('casino-game-channel', event, data);
    } catch (pusherErr) {
      console.warn('PUSHER_TRIGGER_WARN:', pusherErr);
      return NextResponse.json({
        success: true,
        localOnly: true,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUSHER_ERROR:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
