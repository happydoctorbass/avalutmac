'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Match } from '@/types/match';
import { useCasinoMatches } from '../hooks/useCasinoMatches';
import { AdminGuard } from '../casino-admin/components/AdminGuard';
import { Button } from '@/components/ui/button';
import {
  CalendarClock,
  ExternalLink,
  ListPlus,
  Plus,
  Trash2,
  Trophy,
} from 'lucide-react';

function dateLabel(m: Match) {
  if (m.bishkek) {
    const parts = m.bishkek.date_bishkek.split('-');
    if (parts.length === 3) {
      const [, mm, dd] = parts;
      return `${dd}.${mm}`;
    }
    return m.bishkek.date_bishkek;
  }
  return '—';
}

function timeLabel(m: Match) {
  return m.bishkek?.time_bishkek ?? '—';
}

function CasinoTableContent() {
  const { matches: boardMatches, addMatch, removeMatch, addMatchesUnique, clearMatches } = useCasinoMatches();

  const [catalog, setCatalog] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'finished'>('all');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/casino/matches');
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        if (data.matches) setCatalog(data.matches);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const boardIds = useMemo(() => new Set(boardMatches.map((m) => m.id)), [boardMatches]);

  const upcoming = useMemo(() => catalog.filter((m) => !m.finished), [catalog]);
  const finished = useMemo(() => catalog.filter((m) => m.finished), [catalog]);

  const visible = filter === 'upcoming' ? upcoming : filter === 'finished' ? finished : catalog;

  const onBoardCount = catalog.filter((m) => boardIds.has(m.id)).length;

  const toggle = (m: Match) => {
    if (boardIds.has(m.id)) removeMatch(m.id);
    else addMatch(m);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background accents */}
      <div
        className="pointer-events-none fixed inset-0 bg-cover bg-center opacity-[0.18]"
        style={{ backgroundImage: "url('/logo/bg_main.svg')" }}
      />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />

      <div className="relative mx-auto max-w-6xl p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <img
              src="/logo/admiral.svg"
              alt="Admiral Casino"
              className="h-12 w-auto drop-shadow-[0_0_14px_rgba(245,158,11,0.25)]"
            />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Таблица матчей · ЧМ-2026</h1>
              <p className="text-sm text-muted-foreground">
                Управляйте табло из таблицы — добавляйте и убирайте матчи.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-border bg-muted/30 px-4 py-2 text-sm">
              <span className="font-semibold text-amber-500">{boardMatches.length}</span>
              <span className="text-muted-foreground">на табло</span>
            </div>
            <Link href="/casino-display" target="_blank">
              <Button variant="ghost" size="sm" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Табло (карточки)
              </Button>
            </Link>
            <Link href="/casino-display-table" target="_blank">
              <Button variant="ghost" size="sm" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Табло (таблица)
              </Button>
            </Link>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-sm">
          <Button className="gap-2" onClick={() => addMatchesUnique(catalog)}>
            <ListPlus className="h-4 w-4" />
            Добавить все
          </Button>
          <Button variant="secondary" className="gap-2" onClick={() => addMatchesUnique(upcoming)}>
            <CalendarClock className="h-4 w-4" />
            Добавить предстоящие
          </Button>
          <Button variant="secondary" className="gap-2" onClick={() => addMatchesUnique(finished)}>
            <Trophy className="h-4 w-4" />
            Добавить прошедшие
          </Button>
          <div className="ml-auto" />
          <Button
            variant="destructive"
            className="gap-2"
            onClick={() => clearMatches()}
            disabled={boardMatches.length === 0}
          >
            <Trash2 className="h-4 w-4" />
            Убрать все
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2">
          {([
            ['all', `Все (${catalog.length})`],
            ['upcoming', `Предстоящие (${upcoming.length})`],
            ['finished', `Прошедшие (${finished.length})`],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-amber-500 text-black'
                  : 'border border-border bg-muted/20 text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
          <span className="ml-auto text-sm text-muted-foreground">
            Совпадений на табло: <span className="font-semibold text-amber-500">{onBoardCount}</span>
          </span>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-sm">
          {loading ? (
            <div className="p-10 text-center text-sm text-muted-foreground">Загрузка матчей ЧМ-2026...</div>
          ) : visible.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">Нет матчей в этой категории.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 font-semibold">Дата</th>
                    <th className="px-4 py-3 font-semibold">Время (Бишкек)</th>
                    <th className="px-4 py-3 font-semibold">Матч</th>
                    <th className="px-4 py-3 font-semibold">Статус</th>
                    <th className="px-4 py-3 font-semibold">Счёт</th>
                    <th className="px-4 py-3 font-semibold">Победитель</th>
                    <th className="px-4 py-3 text-right font-semibold">Действие</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((m) => {
                    const onBoard = boardIds.has(m.id);
                    return (
                      <tr
                        key={m.id}
                        className={`border-b border-border/50 transition-colors ${
                          onBoard ? 'bg-amber-500/5' : 'hover:bg-muted/20'
                        }`}
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{dateLabel(m)}</td>
                        <td className="whitespace-nowrap px-4 py-3 font-semibold text-amber-500">{timeLabel(m)}</td>
                        <td className="px-4 py-3">
                          <span className="font-semibold">{m.team1}</span>
                          <span className="mx-1.5 text-muted-foreground">vs</span>
                          <span className="font-semibold">{m.team2}</span>
                        </td>
                        <td className="px-4 py-3">
                          {m.finished ? (
                            <span className="rounded-full border border-muted-foreground/40 bg-muted/40 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                              Завершён
                            </span>
                          ) : (
                            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                              Предстоит
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-black tracking-wider">
                          {m.score ?? '—'}
                        </td>
                        <td className="px-4 py-3">
                          {m.winner ? (
                            <span className={m.winner === 'Ничья' ? 'text-muted-foreground' : 'text-amber-500'}>
                              {m.winner}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            size="sm"
                            variant={onBoard ? 'destructive' : 'secondary'}
                            className="gap-1.5"
                            onClick={() => toggle(m)}
                          >
                            {onBoard ? (
                              <>
                                <Trash2 className="h-3.5 w-3.5" />
                                Убрать
                              </>
                            ) : (
                              <>
                                <Plus className="h-3.5 w-3.5" />
                                Добавить
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CasinoTablePage() {
  return (
    <AdminGuard>
      <CasinoTableContent />
    </AdminGuard>
  );
}