'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ExchangeRate } from '../_types';
import { INITIAL_FALLBACK_RATES } from '../_lib/constants';

export function useRates() {
  const [rates, setRates] = useState<ExchangeRate[]>(INITIAL_FALLBACK_RATES);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  const fetchRates = useCallback(async () => {
    try {
      const { data, error: err } = await supabase
        .from('exchange_rates')
        .select('*, currency:currencies(*)')
        .order('updated_at', { ascending: false });

      if (err) throw err;
      if (data && data.length > 0) {
        const sorted = (data as unknown as ExchangeRate[])
          .filter((r) => r.currency?.is_active !== false)
          .sort((a, b) => (a.currency?.position ?? 99) - (b.currency?.position ?? 99));
        setRates(sorted);
        setLastUpdated(new Date());
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки курсов');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUpdate = useCallback((newRow: Partial<ExchangeRate> & { currency_id?: string; id?: string }) => {
    const buyPriceNum = newRow.buy_price !== undefined && newRow.buy_price !== null ? Number(newRow.buy_price) : undefined;
    const sellPriceNum = newRow.sell_price !== undefined && newRow.sell_price !== null ? Number(newRow.sell_price) : undefined;

    setRates((prev) => {
      const targetId = newRow.currency_id || newRow.id;
      const index = prev.findIndex((r) => r.currency_id === targetId || r.id === targetId);
      if (index === -1) {
        // If not found in current list, fetch full data with joined currency info
        fetchRates();
        return prev;
      }
      return prev.map((item, idx) => {
        if (idx !== index) return item;
        return {
          ...item,
          buy_price: buyPriceNum !== undefined && !isNaN(buyPriceNum) ? buyPriceNum : item.buy_price,
          sell_price: sellPriceNum !== undefined && !isNaN(sellPriceNum) ? sellPriceNum : item.sell_price,
          updated_at: newRow.updated_at ?? new Date().toISOString(),
          updated_by: newRow.updated_by !== undefined ? newRow.updated_by : item.updated_by,
        };
      });
    });
    setLastUpdated(new Date());
  }, [fetchRates]);

  useEffect(() => {
    fetchRates();
    const channel = supabase
      .channel('public:exchange_rates_board')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'exchange_rates' }, (payload) => {
        if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
          handleUpdate(payload.new as Partial<ExchangeRate>);
        } else if (payload.eventType === 'DELETE') {
          fetchRates();
        }
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRates, handleUpdate]);

  return { rates, isLoading, isConnected, lastUpdated, error, refetch: fetchRates };
}
