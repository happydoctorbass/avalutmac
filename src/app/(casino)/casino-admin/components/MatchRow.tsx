'use client';

import { useState } from 'react';
import { Match } from '@/types/match';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  const [score, setScore] = useState(match.score || '');
  const [winner, setWinner] = useState(match.winner || '');

  return (
    <div className={`rounded-xl border p-4 ${isFocused ? 'border-primary/50 bg-muted/30' : 'border-border'}`}>
      {isEditing ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <Input value={team1} onChange={(e) => setTeam1(e.target.value)} />
          <Input value={team2} onChange={(e) => setTeam2(e.target.value)} />
          <div className="grid gap-3 sm:col-span-3 sm:grid-cols-2">
            <DateTimeField date={date} time={time} onDateChange={setDate} onTimeChange={setTime} />
          </div>
          <div className="grid gap-3 sm:col-span-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Счёт (напр. 2:1)</Label>
              <Input value={score} onChange={(e) => setScore(e.target.value)} placeholder="2:1" />
            </div>
            <div className="grid gap-2">
              <Label>Победитель</Label>
              <select
                value={winner}
                onChange={(e) => setWinner(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">— не определён —</option>
                <option value={team1}>{team1 || 'Команда 1'}</option>
                <option value={team2}>{team2 || 'Команда 2'}</option>
                <option value="Ничья">Ничья</option>
              </select>
            </div>
          </div>
          <div className="sm:col-span-3 flex flex-wrap gap-2 justify-end">
            <Button
              size="sm"
              onClick={() => {
                const nextTime = date && time ? `${date}T${time}` : match.time;
                onUpdate({ team1, team2, time: nextTime, score: score.trim(), winner });
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
                setScore(match.score || '');
                setWinner(match.winner || '');
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
            {(match.score || match.winner) && (
              <div className="mt-1 text-sm font-semibold text-amber-500">
                {match.score ? `Счёт ${match.score}` : ''}
                {match.score && match.winner ? ' · ' : ''}
                {match.winner ? `Победитель: ${match.winner}` : ''}
              </div>
            )}
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

