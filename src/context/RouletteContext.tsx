'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { RouletteBet } from '@/types/roulette';

interface RouletteContextValue {
  bets: RouletteBet[];
  isLoading: boolean;
}

const RouletteContext = createContext<RouletteContextValue | null>(null);

function normalizeBet(row: Record<string, unknown> | RouletteBet): RouletteBet {
  const r = row as Record<string, unknown>;
  const number = Number(r.number);
  const playerId = String(r.player_id ?? '');
  return {
    id: String(r.id ?? `${playerId}-${number}`),
    player_id: playerId,
    number,
    color: String(r.player_color ?? r.color ?? '#ef4444'),
    player_color: (r.player_color as string | null | undefined) ?? null,
    is_promo: Boolean(r.is_promo),
    created_at: String(r.created_at ?? r.updated_at ?? ''),
    updated_at: String(r.updated_at ?? ''),
  };
}

export function RouletteProvider({ children }: { children: ReactNode }) {
  const [bets, setBets] = useState<RouletteBet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBets = async () => {
      const { data, error } = await supabase
        .from('roulette_bets')
        .select('*')
        .order('updated_at', { ascending: false });

      if (!error && data) {
        setBets(data.map(normalizeBet));
      }
      setIsLoading(false);
    };

    fetchBets();

    const channel = supabase
      .channel('roulette_bets_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'roulette_bets' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBets((prev) => [normalizeBet(payload.new), ...prev]);
          } else if (payload.eventType === 'DELETE') {
            const oldRow = normalizeBet(payload.old);
            setBets((prev) =>
              prev.filter(
                (bet) =>
                  bet.id !== oldRow.id &&
                  !(bet.number === oldRow.number && bet.player_id === oldRow.player_id)
              )
            );
          } else if (payload.eventType === 'UPDATE') {
            const next = normalizeBet(payload.new);
            setBets((prev) =>
              prev.map((bet) =>
                bet.id === next.id || bet.number === next.number ? next : bet
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <RouletteContext.Provider value={{ bets, isLoading }}>
      {children}
    </RouletteContext.Provider>
  );
}

export function useRouletteContext() {
  const ctx = useContext(RouletteContext);
  if (!ctx) throw new Error('useRouletteContext must be used within RouletteProvider');
  return ctx;
}
