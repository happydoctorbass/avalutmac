import PusherServer from 'pusher';

let instance: PusherServer | null = null;
let warnedMissingKeys = false;

export function getPusherServer(): PusherServer | null {
  const appId = process.env.PUSHER_APP_ID;
  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const secret = process.env.PUSHER_SECRET;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

  if (!appId || !key || !secret || !cluster) {
    if (!warnedMissingKeys) {
      console.warn(
        '[Pusher] Server credentials missing — pusherServer not initialized.'
      );
      warnedMissingKeys = true;
    }
    return null;
  }

  if (!instance) {
    instance = new PusherServer({
      appId,
      key,
      secret,
      cluster,
      useTLS: true,
    });
  }

  return instance;
}

/** @deprecated Prefer getPusherServer() — kept for existing imports */
export const pusherServer = {
  trigger: async (channel: string, event: string, data: unknown) => {
    const server = getPusherServer();
    if (!server) return;
    return server.trigger(channel, event, data);
  },
};
