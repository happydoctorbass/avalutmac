'use client';

import { Match, SportType } from '@/types/match';
import { Button } from '@/components/ui/button';

const SPORTS: SportType[] = ['football', 'basketball', 'tennis', 'hockey'];
let counter = 0;

function randomMatch(): Match {
  counter += 1;
  const sport = SPORTS[Math.floor(Math.random() * SPORTS.length)];
  const d = new Date(Date.now() + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));
  const date = d.toISOString().slice(0, 10);
  const hh = String(Math.floor(Math.random() * 24)).padStart(2, '0');
  const mm = ['00', '15', '30', '45'][Math.floor(Math.random() * 4)];
  return {
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    sportType: sport,
    team1: `Команда ${counter * 2 - 1}`,
    team2: `Команда ${counter * 2}`,
    time: `${date}T${hh}:${mm}`,
  };
}

export function TestDataCard({ onAdd }: { onAdd: (m: Match[]) => void }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button type="button" variant="secondary" onClick={() => onAdd([randomMatch()])}>
        + 1 случайный матч
      </Button>
      <Button type="button" variant="secondary" onClick={() => onAdd(Array.from({ length: 5 }, randomMatch))}>
        + 5 случайных
      </Button>
    </div>
  );
}
