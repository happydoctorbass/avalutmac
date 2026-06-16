'use client';

import { Match } from '@/types/match';
import { Button } from '@/components/ui/button';
import { ListPlus, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

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

type MatchCatalogTableProps = {
  boardMatches: Match[];
  onAdd: (m: Match) => void;
  onRemove: (id: string) => void;
  onAddMany: (matches: Match[]) => void;
  onClear: () => void;
};

export function MatchCatalogTable({
  boardMatches,
  onAdd,
  onRemove,
  onAddMany,
  onClear,
}: MatchCatalogTableProps) {
  const [catalog, setCatalog] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

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
  const onBoardCount = catalog.filter((m) => boardIds.has(m.id)).length;

  const toggle = (m: Match) => {
    if (boardIds.has(m.id)) onRemove(m.id);
    else onAdd(m);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button className="gap-2" onClick={() => onAddMany(catalog)} disabled={catalog.length === 0}>
          <ListPlus className="h-4 w-4" />
          Добавить все предстоящие
        </Button>
        <div className="ml-auto" />
        <Button
          variant="destructive"
          className="gap-2"
          onClick={() => onClear()}
          disabled={boardMatches.length === 0}
        >
          <Trash2 className="h-4 w-4" />
          Убрать все с табло
        </Button>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          В каталоге: <strong className="text-foreground">{catalog.length}</strong> предстоящих
        </span>
        <span>
          На табло: <strong className="text-amber-500">{onBoardCount}</strong> / {boardMatches.length}
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        {loading ? (
          <div className="p-10 text-center text-sm text-muted-foreground">Загрузка матчей ЧМ-2026...</div>
        ) : catalog.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">Нет предстоящих матчей в каталоге.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Дата</th>
                  <th className="px-4 py-3 font-semibold">Время</th>
                  <th className="px-4 py-3 font-semibold">Матч</th>
                  <th className="px-4 py-3 text-right font-semibold">Табло</th>
                </tr>
              </thead>
              <tbody>
                {catalog.map((m) => {
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
  );
}
