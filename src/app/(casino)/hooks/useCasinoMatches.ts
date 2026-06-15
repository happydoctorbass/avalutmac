'use client';

import { Match, CasinoSettings, DEFAULT_SETTINGS } from '@/types/match';
import { mergeCasinoSettings } from '@/lib/table-display-settings';
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
    return Array.isArray(parsed) ? parsed : [];
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

  const ref = useRef({ matches, focusMatchId, settings, currentIndex });
  ref.current = { matches, focusMatchId, settings, currentIndex };

  const lastVersionRef = useRef<number>(-1);
  const fetchSeqRef = useRef(0);

  const setters = { setMatches, setFocusMatchId, setSettings, setCurrentIndex };

  const fetchFromServer = useCallback(async (force = false) => {
    const seq = ++fetchSeqRef.current;

    try {
      const res = await fetch(`/api/casino/sync?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();

      if (seq !== fetchSeqRef.current) return;

      const serverVersion = typeof data.version === 'number' ? data.version : 0;
      if (!force && serverVersion <= lastVersionRef.current) return;

      lastVersionRef.current = serverVersion;
      applyPayload(data, setters);
    } catch (e) {
      console.log('Failed to fetch casino state', e);
    }
  }, []);

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
          if (typeof data.version === 'number' && data.version <= lastVersionRef.current) return;
          fetchFromServer(true);
          return;
        }

        if (typeof data.version === 'number') {
          if (data.version <= lastVersionRef.current) return;
          lastVersionRef.current = data.version;
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
    };
  }, [fetchFromServer, pollIntervalMs]);

  const syncState = useCallback(
    async (opts: {
      matches?: Match[];
      focusMatchId?: string | null;
      settings?: CasinoSettings;
      currentIndex?: number;
    }) => {
      const cur = ref.current;
      const finalMatches = opts.matches ?? cur.matches;
      const finalFocus = opts.focusMatchId !== undefined ? opts.focusMatchId : cur.focusMatchId;
      const finalSettings = opts.settings ?? cur.settings;
      const finalIndex = opts.currentIndex !== undefined ? opts.currentIndex : cur.currentIndex;

      const version = Math.max(lastVersionRef.current + 1, Date.now());
      lastVersionRef.current = version;

      fetchSeqRef.current += 1;

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
        const res = await fetch('/api/casino/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'SYNC',
            matches: finalMatches,
            focusMatchId: finalFocus,
            settings: finalSettings,
            currentIndex: finalIndex,
            version,
          }),
        });

        const data = await res.json();
        if (data.success && !data.ignored && typeof data.version === 'number' && data.version >= version) {
          lastVersionRef.current = data.version;
        }
      } catch (e) {
        console.error('Failed to sync state', e);
      }
    },
    [],
  );

  const addMatch = (match: Match) => syncState({ matches: [...ref.current.matches, match] });
  const addMatches = (newOnes: Match[]) => syncState({ matches: [...ref.current.matches, ...newOnes] });

  const addMatchesUnique = (newOnes: Match[]) => {
    const seen = new Set(ref.current.matches.map((m) => m.id));
    const merged = [...ref.current.matches];
    for (const m of newOnes) {
      if (!seen.has(m.id)) {
        seen.add(m.id);
        merged.push(m);
      }
    }
    return syncState({ matches: merged });
  };

  const setMatchesBulk = (next: Match[]) => syncState({ matches: next });
  const clearMatches = () => syncState({ matches: [], focusMatchId: null });

  const removeMatch = (id: string) =>
    syncState({
      matches: ref.current.matches.filter((m) => m.id !== id),
      focusMatchId: ref.current.focusMatchId === id ? null : ref.current.focusMatchId,
    });

  const setFocus = (id: string | null) => syncState({ focusMatchId: id });

  const updateMatch = (id: string, patch: Partial<Match>) =>
    syncState({ matches: ref.current.matches.map((m) => (m.id === id ? { ...m, ...patch } : m)) });

  const updateSettings = (newSettings: CasinoSettings) => syncState({ settings: newSettings });

  const goToIndex = (index: number) => syncState({ currentIndex: index, focusMatchId: null });
  const nextCard = () => syncState({ currentIndex: ref.current.currentIndex + 1, focusMatchId: null });
  const prevCard = () => syncState({ currentIndex: ref.current.currentIndex - 1, focusMatchId: null });

  return {
    matches,
    focusMatchId,
    settings,
    currentIndex,
    isConnected,
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
    goToIndex,
    nextCard,
    prevCard,
  };
}
