'use client';

import { Match, CasinoSettings, DEFAULT_SETTINGS } from '@/types/match';
import { useEffect, useState, useCallback, useRef } from 'react';
import { getPusherClient, GAME_CHANNEL } from '@/lib/pusher';

export function useCasinoMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [focusMatchId, setFocusMatchId] = useState<string | null>(null);
  const [settings, setSettings] = useState<CasinoSettings>({ ...DEFAULT_SETTINGS });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  // Keep latest values for callbacks/timers without re-binding
  const ref = useRef({ matches, focusMatchId, settings, currentIndex });
  ref.current = { matches, focusMatchId, settings, currentIndex };

  // Последняя применённая версия состояния (для отсечения устаревших эхо-сообщений)
  const lastVersionRef = useRef<number>(-1);

  const fetchInitialState = async () => {
    try {
      const res = await fetch('/api/casino/sync');
      const data = await res.json();
      if (typeof data.version === 'number') lastVersionRef.current = data.version;
      if (data.matches) setMatches(data.matches);
      if (data.focusMatchId !== undefined) setFocusMatchId(data.focusMatchId);
      if (data.settings) setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
      if (data.currentIndex !== undefined) setCurrentIndex(data.currentIndex);
    } catch (e) {
      console.log('Failed to fetch initial state', e);
    }
  };

  useEffect(() => {
    fetchInitialState();

    const pusher = getPusherClient();
    if (!pusher) return;

    const channel = pusher.subscribe(GAME_CHANNEL);
    channel.bind('pusher:subscription_succeeded', () => setIsConnected(true));
    channel.bind('pusher:subscription_error', () => setIsConnected(false));

    channel.bind(
      'casino-sync',
      (data: {
        matches: Match[];
        focusMatchId: string | null;
        settings: CasinoSettings;
        currentIndex?: number;
        version?: number;
      }) => {
        // Игнорируем устаревшие сообщения, пришедшие не по порядку
        if (typeof data.version === 'number') {
          if (data.version <= lastVersionRef.current) return;
          lastVersionRef.current = data.version;
        }
        setMatches(data.matches);
        setFocusMatchId(data.focusMatchId);
        if (data.settings) setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
        if (data.currentIndex !== undefined) setCurrentIndex(data.currentIndex);
        localStorage.setItem('casino_matches', JSON.stringify(data.matches));
      },
    );

    return () => {
      channel.unbind('casino-sync');
      pusher.unsubscribe(GAME_CHANNEL);
    };
  }, []);

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

      // Монотонная версия на клиенте (по часам), строго возрастающая.
      // Сразу помечаем её как применённую, чтобы устаревшие эхо-сообщения не затирали свежее состояние.
      const version = Math.max(lastVersionRef.current + 1, Date.now());
      lastVersionRef.current = version;

      setMatches(finalMatches);
      setFocusMatchId(finalFocus);
      setSettings(finalSettings);
      setCurrentIndex(finalIndex);

      // Сразу обновляем ref, чтобы следующие синхронные вызовы (например, быстрое нажатие кнопок)
      // видели актуальное состояние ещё до того, как React завершит рендер.
      ref.current = {
        matches: finalMatches,
        focusMatchId: finalFocus,
        settings: finalSettings,
        currentIndex: finalIndex,
      };

      await fetch('/api/casino/sync', {
        method: 'POST',
        body: JSON.stringify({
          type: 'SYNC',
          matches: finalMatches,
          focusMatchId: finalFocus,
          settings: finalSettings,
          currentIndex: finalIndex,
          version,
        }),
      });
    },
    [],
  );

  const addMatch = (match: Match) => syncState({ matches: [...ref.current.matches, match] });
  const addMatches = (newOnes: Match[]) => syncState({ matches: [...ref.current.matches, ...newOnes] });

  // Добавить матчи без дублей (мерж по id на основе актуального состояния)
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

  // Заменить весь список матчей одним вызовом (без гонок при массовых операциях)
  const setMatchesBulk = (next: Match[]) => syncState({ matches: next });

  // Полная очистка табло
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
