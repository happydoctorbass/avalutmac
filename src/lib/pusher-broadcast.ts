import { getPusherServer } from '@/lib/pusher-server';
import { GAME_CHANNEL } from '@/lib/pusher';

export async function broadcast(event: string, data: object) {
  const server = getPusherServer();
  if (!server) {
    console.warn(`[Pusher] Skipping broadcast "${event}" — server not configured.`);
    return;
  }
  await server.trigger(GAME_CHANNEL, event, data);
}
