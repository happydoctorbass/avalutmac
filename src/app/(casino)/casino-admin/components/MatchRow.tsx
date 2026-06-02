'use client';

import { useState } from 'react';
import { Match } from '@/types/match';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DateTimeField } from './DateTimeField';

function formatMatchTime(raw: string) {
  if (!raw) return '';
  if (raw.includes('T')) {
    const [d, t] = raw.split('T');
    const [yyyy, mm, dd] = d.split('-');
    return `${dd}.${mm} ${t.slice(0, 5)}`;
  }
  return raw;
}

export function MatchRow({
  match,
  isFocused,
  onFocus,
  onRemove,
  onUpdate,
}: {
  match: Match;
  isFocused: boolean;
  onFocus: () => void;
  onRemove: () => void;
  onUpdate: (patch: Partial<Match>) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [team1, setTeam1] = useState(match.team1);
  const [team2, setTeam2] = useState(match.team2);
  const [date, setDate] = useState(match.time.includes('T') ? match.time.split('T')[0] : '');
  const [time, setTime] = useState(match.time.includes('T') ? match.time.split('T')[1]?.slice(0, 5) || '' : match.time);

  return (
    <div className={`rounded-xl border p-4 ${isFocused ? 'border-primary/50 bg-muted/30' : 'border-border'}`}>
      {isEditing ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <Input value={team1} onChange={(e) => setTeam1(e.target.value)} />
          <Input value={team2} onChange={(e) => setTeam2(e.target.value)} />
          <div className="grid gap-3 sm:col-span-3 sm:grid-cols-2">
            <DateTimeField date={date} time={time} onDateChange={setDate} onTimeChange={setTime} />
          </div>
          <div className="sm:col-span-3 flex flex-wrap gap-2 justify-end">
            <Button
              size="sm"
              onClick={() => {
                const nextTime = date && time ? `${date}T${time}` : match.time;
                onUpdate({ team1, team2, time: nextTime });
                setIsEditing(false);
              }}
            >
              Сохранить
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setTeam1(match.team1);
                setTeam2(match.team2);
                setDate(match.time.includes('T') ? match.time.split('T')[0] : '');
                setTime(match.time.includes('T') ? match.time.split('T')[1]?.slice(0, 5) || '' : match.time);
                setIsEditing(false);
              }}
            >
              Отмена
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm text-muted-foreground uppercase tracking-wider">{match.sportType}</div>
            <div className="font-semibold truncate max-w-[60vw]">{match.team1} vs {match.team2}</div>
            <div className="text-sm text-muted-foreground">{formatMatchTime(match.time)}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant={isFocused ? 'secondary' : 'default'} onClick={onFocus}>
              {isFocused ? 'Снять фокус' : 'Вывести в центр'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
              Редактировать
            </Button>
            <Button size="sm" variant="destructive" onClick={onRemove}>
              Удалить
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

