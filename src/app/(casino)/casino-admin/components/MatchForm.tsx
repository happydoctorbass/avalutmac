'use client';

import { useState } from 'react';
import { Match, SportType } from '@/types/match';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DateTimeField } from './DateTimeField';

export function MatchForm({ onAdd }: { onAdd: (m: Match) => void }) {
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [sportType, setSportType] = useState<SportType>('football');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!team1 || !team2 || !date || !time) return;
        onAdd({ id: Math.random().toString(36).substring(2, 9), team1, team2, time: `${date}T${time}`, sportType });
        setTeam1(''); setTeam2(''); setDate(''); setTime('');
      }}
      className="grid gap-4 sm:grid-cols-2"
    >
      <div className="grid gap-2">
        <Label>Команда 1</Label>
        <Input value={team1} onChange={(e) => setTeam1(e.target.value)} placeholder="Team A" />
      </div>
      <div className="grid gap-2">
        <Label>Команда 2</Label>
        <Input value={team2} onChange={(e) => setTeam2(e.target.value)} placeholder="Team B" />
      </div>
      <DateTimeField date={date} time={time} onDateChange={setDate} onTimeChange={setTime} />
      <div className="grid gap-2">
        <Label>Вид спорта</Label>
        <select
          value={sportType}
          onChange={(e) => setSportType(e.target.value as SportType)}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="football">Футбол</option>
          <option value="basketball">Баскетбол</option>
          <option value="tennis">Теннис</option>
          <option value="hockey">Хоккей</option>
        </select>
      </div>
      <Button className="sm:col-span-2" type="submit">Добавить матч</Button>
    </form>
  );
}

