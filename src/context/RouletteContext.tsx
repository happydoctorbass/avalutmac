'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { RouletteBet } from '@/types/roulette';

interface RouletteContextValue {
  bets: RouletteBet[];
  isLoading: boolean;
}

const RouletteContext = createContext<RouletteContextValue | null>(null);

export function RouletteProvider({ children }: { children: ReactNode }) {
  const [bets, setBets] = useState<RouletteBet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const fetchBets = async () => {
      const { data, error } = await supabase
        .from('roulette_bets')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setBets(data);
      }
      setIsLoading(false);
    };

    fetchBets();

    // Subscribe to changes
    const channel = supabase
      .channel('roulette_bets_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'roulette_bets' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBets((prev) => [payload.new as RouletteBet, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setBets((prev) => prev.filter((bet) => bet.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setBets((prev) => prev.map((bet) => bet.id === payload.new.id ? (payload.new as RouletteBet) : bet));
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
