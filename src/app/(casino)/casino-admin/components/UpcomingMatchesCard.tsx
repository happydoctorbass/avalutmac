'use client';

import { Match, SportType } from '@/types/match';
import { Button } from '@/components/ui/button';

// 10 сборных — предстоящие матчи (ЧМ-2026)
const UPCOMING: { team1: string; team2: string; time: string; sportType: SportType }[] = [
  { team1: 'Аргентина', team2: 'Франция', time: '2026-06-11T21:00', sportType: 'football' },
  { team1: 'Бразилия', team2: 'Англия', time: '2026-06-12T22:00', sportType: 'football' },
  { team1: 'Испания', team2: 'Германия', time: '2026-06-13T21:00', sportType: 'football' },
  { team1: 'Португалия', team2: 'Нидерланды', time: '2026-06-14T22:00', sportType: 'football' },
  { team1: 'Хорватия', team2: 'Бельгия', time: '2026-06-15T21:00', sportType: 'football' },
];

function makeMatch(src: (typeof UPCOMING)[number]): Match {
  return {
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    sportType: src.sportType,
    team1: src.team1,
    team2: src.team2,
    time: src.time,
  };
}

function formatDate(raw: string) {
  const [d, t] = raw.split('T');
  const [, mm, dd] = d.split('-');
  return `${dd}.${mm} ${t}`;
}

export function UpcomingMatchesCard({ onAdd }: { onAdd: (m: Match[]) => void }) {
  return (
    <div className="space-y-4">
      <Button type="button" onClick={() => onAdd(UPCOMING.map(makeMatch))}>
        Добавить все предстоящие
      </Button>

      <div className="grid gap-2 sm:grid-cols-2">
        {UPCOMING.map((m) => (
          <div
            key={`${m.team1}-${m.team2}`}
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/20 px-3 py-2"
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">
                {m.team1} <span className="text-muted-foreground">vs</span> {m.team2}
              </div>
              <div className="text-xs text-muted-foreground">{formatDate(m.time)}</div>
            </div>
            <Button type="button" size="sm" variant="secondary" onClick={() => onAdd([makeMatch(m)])}>
              Добавить
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
