'use client';

import { Match, CasinoSettings, DEFAULT_SETTINGS } from '@/types/match';
import { mergeCasinoSettings } from '@/lib/table-display-settings';
import { filterActiveMatches } from '@/lib/match-visibility';
import { useEffect, useState, useCallback, useRef } from 'react';
import { type Channel } from 'pusher-js';
import { getPusherClient, GAME_CHANNEL } from '@/lib/pusher';

type SyncPayload = {
  matches?: Match[];
  focusMatchId?: string | null;
  settings?: CasinoSettings;
  currentIndex?: number;
  version?: number;
};

type UseCasinoMatchesOptions = {
  /** Периодический опрос сервера (мс). Для гостевых табло — 3–5 с. */
  pollIntervalMs?: number;
};

function applyPayload(
  data: SyncPayload,
  setters: {
    setMatches: (m: Match[]) => void;
    setFocusMatchId: (id: string | null) => void;
    setSettings: (s: CasinoSettings) => void;
    setCurrentIndex: (i: number) => void;
  },
) {
  if (data.matches) {
    setters.setMatches(data.matches);
    localStorage.setItem('casino_matches', JSON.stringify(data.matches));
  }
  if (data.focusMatchId !== undefined) setters.setFocusMatchId(data.focusMatchId);
  if (data.settings) setters.setSettings(mergeCasinoSettings(data.settings));
  if (data.currentIndex !== undefined) setters.setCurrentIndex(data.currentIndex);
}

function readCachedMatches(): Match[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('casino_matches');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : [];
    return filterActiveMatches(list);
  } catch {
    return [];
  }
}

export function useCasinoMatches(options?: UseCasinoMatchesOptions) {
  const pollIntervalMs = options?.pollIntervalMs;

  const [matches, setMatches] = useState<Match[]>(() => readCachedMatches());
  const [focusMatchId, setFocusMatchId] = useState<string | null>(null);
  const [settings, setSettings] = useState<CasinoSettings>({ ...DEFAULT_SETTINGS });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const ref = useRef({ matches, focusMatchId, settings, currentIndex });
  ref.current = { matches, focusMatchId, settings, currentIndex };

  const lastVersionRef = useRef<number>(-1);
  const fetchSeqRef = useRef(0);
  const isHydratedRef = useRef(false);
  const settingsSyncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSettingsRef = useRef<CasinoSettings | null>(null);

  const setters = { setMatches, setFocusMatchId, setSettings, setCurrentIndex };

  const postSync = useCallback(async (body: Record<string, unknown>) => {
    const version = Math.max(lastVersionRef.current + 1, Date.now());
    lastVersionRef.current = version;
    fetchSeqRef.current += 1;

    const res = await fetch('/api/casino/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, version }),
    });

    const data = await res.json();
    if (data.success && !data.ignored && typeof data.version === 'number' && data.version >= version) {
      lastVersionRef.current = data.version;
    }
    return data;
  }, []);

  const pruneAndMaybeSync = useCallback(
    async (incoming: Match[]) => {
      const pruned = filterActiveMatches(incoming);
      const focusOk =
        ref.current.focusMatchId && pruned.some((m) => m.id === ref.current.focusMatchId)
          ? ref.current.focusMatchId
          : null;

      setMatches(pruned);
      setFocusMatchId(focusOk);
      ref.current = { ...ref.current, matches: pruned, focusMatchId: focusOk };
      localStorage.setItem('casino_matches', JSON.stringify(pruned));

      if (pruned.length !== incoming.length && isHydratedRef.current) {
        await postSync({
          type: 'SYNC',
          matches: pruned,
          focusMatchId: focusOk,
        });
      }
    },
    [postSync],
  );

  const fetchFromServer = useCallback(
    async (force = false) => {
      const seq = ++fetchSeqRef.current;

      try {
        const res = await fetch(`/api/casino/sync?t=${Date.now()}`, { cache: 'no-store' });
        const data = await res.json();

        if (seq !== fetchSeqRef.current) return;

        const serverVersion = typeof data.version === 'number' ? data.version : 0;
        if (!force && serverVersion <= lastVersionRef.current) return;

        lastVersionRef.current = serverVersion;

        if (data.matches) {
          const pruned = filterActiveMatches(data.matches);
          applyPayload({ ...data, matches: pruned }, setters);
          ref.current = {
            ...ref.current,
            matches: pruned,
            focusMatchId:
              ref.current.focusMatchId && pruned.some((m) => m.id === data.focusMatchId)
                ? data.focusMatchId
                : null,
          };

          if (pruned.length !== data.matches.length) {
            await postSync({
              type: 'SYNC',
              matches: pruned,
              focusMatchId: ref.current.focusMatchId,
            });
          }
        } else {
          applyPayload(data, setters);
        }

        isHydratedRef.current = true;
        setIsHydrated(true);
      } catch (e) {
        console.log('Failed to fetch casino state', e);
      }
    },
    [postSync],
  );

  const flushSettingsSync = useCallback(async () => {
    if (!isHydratedRef.current || !pendingSettingsRef.current) return;
    const nextSettings = pendingSettingsRef.current;
    pendingSettingsRef.current = null;

    try {
      const data = await postSync({ type: 'SYNC', settings: nextSettings });
      if (data.success && !data.ignored) {
        applyPayload(data, setters);
        ref.current = {
          ...ref.current,
          matches: data.matches ? filterActiveMatches(data.matches) : ref.current.matches,
          settings: data.settings ? mergeCasinoSettings(data.settings) : ref.current.settings,
          focusMatchId: data.focusMatchId ?? ref.current.focusMatchId,
          currentIndex: data.currentIndex ?? ref.current.currentIndex,
        };
      }
    } catch (e) {
      console.error('Failed to sync settings', e);
    }
  }, [postSync]);

  useEffect(() => {
    fetchFromServer();

    const pusher = getPusherClient();
    let channel: Channel | null = null;

    if (pusher) {
      channel = pusher.subscribe(GAME_CHANNEL);
      channel.bind('pusher:subscription_succeeded', () => setIsConnected(true));
      channel.bind('pusher:subscription_error', () => setIsConnected(false));

      channel.bind('casino-sync', (data: SyncPayload & { type?: string }) => {
        if (data.type === 'INVALIDATE') {
          fetchFromServer(true);
          return;
        }

        if (typeof data.version === 'number') {
          if (data.version <= lastVersionRef.current) return;
          lastVersionRef.current = data.version;
        }

        if (data.matches) {
          void pruneAndMaybeSync(data.matches);
        }
        applyPayload(data, setters);
      });
    }

    const onVisible = () => {
      if (document.visibilityState === 'visible') fetchFromServer(true);
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);

    let pollId: ReturnType<typeof setInterval> | undefined;
    if (pollIntervalMs && pollIntervalMs > 0) {
      pollId = setInterval(() => fetchFromServer(), pollIntervalMs);
    }

    return () => {
      if (channel) {
        channel.unbind('casino-sync');
        pusher?.unsubscribe(GAME_CHANNEL);
      }
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
      if (pollId) clearInterval(pollId);
      if (settingsSyncTimerRef.current) clearTimeout(settingsSyncTimerRef.current);
    };
  }, [fetchFromServer, pollIntervalMs, pruneAndMaybeSync]);

  const syncState = useCallback(
    async (opts: {
      matches?: Match[];
      focusMatchId?: string | null;
      settings?: CasinoSettings;
      currentIndex?: number;
    }) => {
      if (!isHydratedRef.current) {
        await fetchFromServer(true);
      }

      const cur = ref.current;
      const finalMatches =
        opts.matches !== undefined ? filterActiveMatches(opts.matches) : cur.matches;
      const finalFocus = opts.focusMatchId !== undefined ? opts.focusMatchId : cur.focusMatchId;
      const finalSettings = opts.settings ?? cur.settings;
      const finalIndex = opts.currentIndex !== undefined ? opts.currentIndex : cur.currentIndex;

      setMatches(finalMatches);
      setFocusMatchId(finalFocus);
      setSettings(finalSettings);
      setCurrentIndex(finalIndex);

      ref.current = {
        matches: finalMatches,
        focusMatchId: finalFocus,
        settings: finalSettings,
        currentIndex: finalIndex,
      };

      localStorage.setItem('casino_matches', JSON.stringify(finalMatches));

      try {
        const data = await postSync({
          type: 'SYNC',
          matches: finalMatches,
          focusMatchId: finalFocus,
          settings: finalSettings,
          currentIndex: finalIndex,
        });
        if (data.success && !data.ignored) {
          applyPayload(data, setters);
        }
      } catch (e) {
        console.error('Failed to sync state', e);
      }
    },
    [fetchFromServer, postSync],
  );

  const addMatch = (match: Match) => {
    if (!filterActiveMatches([match]).length) return;
    syncState({ matches: [...ref.current.matches, match] });
  };

  const addMatches = (newOnes: Match[]) =>
    syncState({ matches: [...ref.current.matches, ...filterActiveMatches(newOnes)] });

  const addMatchesUnique = (newOnes: Match[]) => {
    const seen = new Set(ref.current.matches.map((m) => m.id));
    const merged = [...ref.current.matches];
    for (const m of filterActiveMatches(newOnes)) {
      if (!seen.has(m.id)) {
        seen.add(m.id);
        merged.push(m);
      }
    }
    return syncState({ matches: merged });
  };

  const setMatchesBulk = (next: Match[]) => syncState({ matches: filterActiveMatches(next) });
  const clearMatches = () => syncState({ matches: [], focusMatchId: null });

  const removeMatch = (id: string) =>
    syncState({
      matches: ref.current.matches.filter((m) => m.id !== id),
      focusMatchId: ref.current.focusMatchId === id ? null : ref.current.focusMatchId,
    });

  const setFocus = (id: string | null) => syncState({ focusMatchId: id });

  const updateMatch = (id: string, patch: Partial<Match>) =>
    syncState({
      matches: ref.current.matches.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    });

  const updateSettings = useCallback(
    (newSettings: CasinoSettings) => {
      const merged = mergeCasinoSettings(newSettings);
      setSettings(merged);
      ref.current = { ...ref.current, settings: merged };
      pendingSettingsRef.current = merged;

      if (!isHydratedRef.current) return;

      if (settingsSyncTimerRef.current) clearTimeout(settingsSyncTimerRef.current);
      settingsSyncTimerRef.current = setTimeout(() => {
        void flushSettingsSync();
      }, 350);
    },
    [flushSettingsSync],
  );

  return {
    matches: filterActiveMatches(matches),
    focusMatchId,
    settings,
    currentIndex,
    isConnected,
    isHydrated,
    refetch: () => fetchFromServer(true),
    addMatch,
    addMatches,
    addMatchesUnique,
    setMatchesBulk,
    clearMatches,
    removeMatch,
    setFocus,
    updateMatch,
    updateSettings,
  };
}
