import { pusherServer } from "@/lib/pusher-server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event, data } = body;

    // Отправляем сигнал в Pusher на канал 'casino-game-channel'
    await pusherServer.trigger("casino-game-channel", event, data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUSHER_ERROR:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}