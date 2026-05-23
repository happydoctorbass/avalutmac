'use client';

import { useEffect, useState } from 'react';
import { formatRemaining } from '@/lib/format-clock';

export function useFinishClock(finishAt: string | null, active: boolean) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!active || !finishAt) return;
    const id = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [active, finishAt]);

  const end = finishAt ? new Date(finishAt).getTime() : 0;
  const remaining = finishAt ? end - Date.now() : 0;
  const isExpired = Boolean(finishAt && active && remaining <= 0);

  return {
    display: finishAt && active ? formatRemaining(remaining) : '00 : 00 : 00',
    isExpired,
    tick,
  };
}
