'use client';

import { Match } from '@/types/match';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

function formatDateBishkek(bishkekDate: string, bishkekTime: string) {
  // bishkekDate format: YYYY-MM-DD
  const parts = bishkekDate.split('-');
  if (parts.length === 3) {
    const [, mm, dd] = parts;
    return `${dd}.${mm} ${bishkekTime}`;
  }
  return `${bishkekDate} ${bishkekTime}`;
}

function formatDateOriginal(raw: string) {
  if (raw.includes('T')) {
    const [d, t] = raw.split('T');
    const parts = d.split('-');
    if (parts.length === 3) {
      const [, mm, dd] = parts;
      return `${dd}.${mm} ${t.slice(0, 5)}`;
    }
  }
  return raw;
}

export function UpcomingMatchesCard({ onAdd }: { onAdd: (m: Match[]) => void }) {
  const [upcoming, setUpcoming] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      try {
        const res = await fetch('/api/casino/matches');
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        if (data.matches) {
          setUpcoming(data.matches);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
  }, []);

  if (loading) {
    return <div className="text-sm text-muted-foreground">Загрузка матчей ЧМ-2026...</div>;
  }

  if (upcoming.length === 0) {
    return <div className="text-sm text-muted-foreground">Нет доступных матчей.</div>;
  }

  return (
    <div className="space-y-4">
      <Button type="button" onClick={() => onAdd(upcoming)}>
        Добавить все предстоящие
      </Button>

      <div className="grid gap-2 sm:grid-cols-2 max-h-[400px] overflow-y-auto pr-2">
        {upcoming.map((m) => {
          const displayTime = m.bishkek 
            ? formatDateBishkek(m.bishkek.date_bishkek, m.bishkek.time_bishkek)
            : formatDateOriginal(m.time);

          return (
            <div
              key={m.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/20 px-3 py-2"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">
                  {m.team1} <span className="text-muted-foreground">vs</span> {m.team2}
                </div>
                <div className="text-xs text-muted-foreground">{displayTime}</div>
              </div>
              <Button type="button" size="sm" variant="secondary" onClick={() => onAdd([m])}>
                Добавить
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}