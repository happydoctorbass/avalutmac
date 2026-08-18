'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Profile } from '../_types';

export function useCashiers() {
  const [cashiers, setCashiers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCashiers = useCallback(async () => {
    try {
      let { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        const refreshed = await supabase.auth.refreshSession();
        session = refreshed.data.session;
      }
      const token = session?.access_token;

      if (token) {
        const res = await fetch('/api/exchange-rates/users', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setCashiers(json.data);
          return;
        }
      }

      // Fallback: direct query through Supabase client with RLS policy
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setCashiers(data as Profile[]);
      }
    } catch (err) {
      console.warn('useCashiers fetch error, attempting direct query:', err);
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (data) setCashiers(data as Profile[]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCashiers();
  }, [fetchCashiers]);

  return { cashiers, isLoading, refetch: fetchCashiers };
}
