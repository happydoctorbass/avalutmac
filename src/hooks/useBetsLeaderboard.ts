'use client';

import { useCallback, useEffect, useState } from 'react';
import { BetRow } from '@/types/game';

export function useBetsLeaderboard(sessionId: string | null, version: number) {
  const [bets, setBets] = useState<BetRow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBets = useCallback(() => {
    if (!sessionId) return Promise.resolve();
    return fetch(`/api/bets/list?sessionId=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json())
      .then((d) => setBets(d.bets ?? []))
      .catch(() => setBets([]));
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) { setBets([]); return; }
    setLoading(true);
    fetchBets().finally(() => setLoading(false));
  }, [sessionId, version, fetchBets]);

  useEffect(() => {
    if (!sessionId) return;
    const id = setInterval(() => { fetchBets(); }, 4000);
    return () => clearInterval(id);
  }, [sessionId, fetchBets]);

  return { bets, loading };
}
