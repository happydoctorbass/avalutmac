const LOCAL_GAME_STORAGE_KEY = 'avalut_local_game_events';

export function writeLocalGameEvent(event: string, data: Record<string, unknown>) {
  if (typeof window === 'undefined') return;

  const payload = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    event,
    data,
    createdAt: new Date().toISOString(),
  };

  const prev = (() => {
    try {
      const raw = window.localStorage.getItem(LOCAL_GAME_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  })();

  const next = [...prev, payload];
  window.localStorage.setItem(LOCAL_GAME_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('avalut-local-game-event', { detail: payload }));
}

export function subscribeLocalGameEvents(
  handler: (event: string, data: Record<string, unknown>) => void
) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const onCustom = (event: Event) => {
    const custom = event as CustomEvent<{ event: string; data: Record<string, unknown> }>;
    const detail = custom.detail;
    if (!detail) return;
    handler(detail.event, detail.data ?? {});
  };

  const onStorage = (event: StorageEvent) => {
    if (event.key !== LOCAL_GAME_STORAGE_KEY || !event.newValue) return;

    try {
      const list = JSON.parse(event.newValue) as Array<{ event: string; data: Record<string, unknown> }>;
      const last = list[list.length - 1];
      if (!last) return;
      handler(last.event, last.data ?? {});
    } catch {
      // ignore malformed payloads
    }
  };

  window.addEventListener('avalut-local-game-event', onCustom as EventListener);
  window.addEventListener('storage', onStorage);

  return () => {
    window.removeEventListener('avalut-local-game-event', onCustom as EventListener);
    window.removeEventListener('storage', onStorage);
  };
}
