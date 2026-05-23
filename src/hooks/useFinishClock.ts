'use client';

import { useEffect, useState } from 'react';
import { formatRemaining } from '@/lib/format-clock';

export function useFinishClock(finishAt: string | null, active: boolean) {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (active && finishAt) {
      id = setInterval(() => setNow(Date.now()), 1000);
    }
    return () => {
      if (id) clearInterval(id);
    };
  }, [active, finishAt]);

  const end = finishAt ? new Date(finishAt).getTime() : 0;
  const remaining = finishAt ? end - now : 0;
  const isExpired = Boolean(finishAt && active && remaining <= 0);

  return {
    display: finishAt && active ? formatRemaining(remaining) : '00 : 00 : 00',
    isExpired,
    tick: now,
  };
}
