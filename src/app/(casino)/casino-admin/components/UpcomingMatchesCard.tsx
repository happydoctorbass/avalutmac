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

function MatchRow({ m, onAdd }: { m: Match; onAdd: (m: Match[]) => void }) {
  const displayTime = m.bishkek
    ? formatDateBishkek(m.bishkek.date_bishkek, m.bishkek.time_bishkek)
    : formatDateOriginal(m.time);

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/20 px-3 py-2">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">
          {m.team1} <span className="text-muted-foreground">vs</span> {m.team2}
        </div>
        <div className="text-xs text-muted-foreground">{displayTime}</div>
        {m.finished && (
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs">
            {m.score && <span className="font-bold text-foreground">{m.score}</span>}
            {m.winner && (
              <span className="text-amber-500">
                {m.winner === 'Ничья' ? 'Ничья' : `Победитель: ${m.winner}`}
              </span>
            )}
          </div>
        )}
      </div>
      <Button type="button" size="sm" variant="secondary" onClick={() => onAdd([m])}>
        Добавить
      </Button>
    </div>
  );
}

export function UpcomingMatchesCard({ onAdd }: { onAdd: (m: Match[]) => void }) {
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      try {
        const res = await fetch('/api/casino/matches');
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        if (data.matches) {
          setAllMatches(data.matches);
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

  const upcoming = allMatches.filter((m) => !m.finished);
  const finished = allMatches.filter((m) => m.finished);

  if (allMatches.length === 0) {
    return <div className="text-sm text-muted-foreground">Нет доступных матчей.</div>;
  }

  return (
    <div className="space-y-8">
      {/* Предстоящие матчи */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Предстоящие ({upcoming.length})
          </h3>
          {upcoming.length > 0 && (
            <Button type="button" size="sm" onClick={() => onAdd(upcoming)}>
              Добавить все предстоящие
            </Button>
          )}
        </div>
        {upcoming.length === 0 ? (
          <div className="text-sm text-muted-foreground">Нет предстоящих матчей.</div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 max-h-[400px] overflow-y-auto pr-2">
            {upcoming.map((m) => (
              <MatchRow key={m.id} m={m} onAdd={onAdd} />
            ))}
          </div>
        )}
      </div>

      {/* Прошедшие матчи */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Прошедшие — результаты ({finished.length})
          </h3>
          {finished.length > 0 && (
            <Button type="button" size="sm" variant="secondary" onClick={() => onAdd(finished)}>
              Добавить все прошедшие
            </Button>
          )}
        </div>
        {finished.length === 0 ? (
          <div className="text-sm text-muted-foreground">Нет прошедших матчей.</div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 max-h-[400px] overflow-y-auto pr-2">
            {finished.map((m) => (
              <MatchRow key={m.id} m={m} onAdd={onAdd} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}