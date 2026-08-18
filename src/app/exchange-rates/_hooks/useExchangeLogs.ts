'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ExchangeHistory, Profile } from '../_types';

export function useExchangeLogs() {
  const [logs, setLogs] = useState<ExchangeHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    try {
      const [historyRes, profilesRes] = await Promise.all([
        supabase
          .from('exchange_history')
          .select('*, currency:currencies(*)')
          .order('created_at', { ascending: false })
          .limit(100),
        supabase.from('profiles').select('id, full_name, role'),
      ]);

      if (historyRes.error) throw historyRes.error;

      const profilesMap = new Map<string, Profile>();
      if (profilesRes.data) {
        profilesRes.data.forEach((p) => {
          profilesMap.set(p.id, p as Profile);
        });
      }

      const populatedLogs: ExchangeHistory[] = ((historyRes.data as unknown as ExchangeHistory[]) || []).map((row) => ({
        ...row,
        profile: row.changed_by ? profilesMap.get(row.changed_by) : undefined,
      }));

      setLogs(populatedLogs);
    } catch {
      // Fallback empty if table not yet populated
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    const channel = supabase
      .channel('public:exchange_history_audit')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'exchange_history' }, () => {
        fetchLogs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLogs]);

  return { logs, isLoading, refetch: fetchLogs };
}
