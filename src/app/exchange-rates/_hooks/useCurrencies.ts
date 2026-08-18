'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Currency } from '../_types';

export function useCurrencies() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrencies = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('currencies')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      setCurrencies(data as Currency[]);
    } catch {
      setCurrencies([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrencies();
    const channel = supabase
      .channel('public:currencies_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'currencies' }, () => {
        fetchCurrencies();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchCurrencies]);

  return { currencies, isLoading, refetch: fetchCurrencies };
}
