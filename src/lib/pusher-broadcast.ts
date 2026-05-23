import { pusherServer } from '@/lib/pusher-server';
import { GAME_CHANNEL } from '@/lib/pusher';

export async function broadcast(event: string, data: object) {
  await pusherServer.trigger(GAME_CHANNEL, event, data);
}
