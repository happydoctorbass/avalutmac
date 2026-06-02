'use client';

import { Match } from '@/types/match';
import { useEffect, useState, useCallback } from 'react';
import { getPusherClient, GAME_CHANNEL } from '@/lib/pusher';

export function useCasinoMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [focusMatchId, setFocusMatchId] = useState<string | null>(null);
  const [settings, setSettings] = useState({ cardCount: 5, cardScale: 1.0 });
  const [isConnected, setIsConnected] = useState(false);

  const fetchInitialState = async () => {
    try {
      const res = await fetch('/api/casino/sync');
      const data = await res.json();
      if (data.matches) setMatches(data.matches);
      if (data.focusMatchId !== undefined) setFocusMatchId(data.focusMatchId);
      if (data.settings) setSettings(data.settings);
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
    
    channel.bind('casino-sync', (data: { matches: Match[], focusMatchId: string | null, settings: any }) => {
      setMatches(data.matches);
      setFocusMatchId(data.focusMatchId);
      if (data.settings) setSettings(data.settings);
      localStorage.setItem('casino_matches', JSON.stringify(data.matches));
    });

    return () => {
      channel.unbind('casino-sync');
      pusher.unsubscribe(GAME_CHANNEL);
    };
  }, []);

  const syncState = useCallback(async (newMatches: Match[], newFocus: string | null, newSettings?: any) => {
    const finalSettings = newSettings || settings;
    setMatches(newMatches);
    setFocusMatchId(newFocus);
    setSettings(finalSettings);
    await fetch('/api/casino/sync', {
      method: 'POST',
      body: JSON.stringify({ type: 'SYNC', matches: newMatches, focusMatchId: newFocus, settings: finalSettings })
    });
  }, [settings]);

  const addMatch = (match: Match) => {
    syncState([...matches, match], focusMatchId);
  };

  const addMatches = (newOnes: Match[]) => {
    syncState([...matches, ...newOnes], focusMatchId);
  };

  const removeMatch = (id: string) => {
    syncState(matches.filter(m => m.id !== id), focusMatchId === id ? null : focusMatchId);
  };

  const setFocus = (id: string | null) => {
    syncState(matches, id);
  };

  const updateMatch = (id: string, patch: Partial<Match>) => {
    syncState(matches.map((m) => (m.id === id ? { ...m, ...patch } : m)), focusMatchId);
  };

  const updateSettings = (newSettings: { cardCount: number, cardScale: number }) => {
    syncState(matches, focusMatchId, newSettings);
  };

  return { matches, focusMatchId, settings, isConnected, addMatch, addMatches, removeMatch, setFocus, updateMatch, updateSettings };
}
