'use client';

import { Match } from '@/types/match';
import { MatchRow } from './MatchRow';

export function MatchList({
  matches,
  focusMatchId,
  onFocus,
  onRemove,
  onUpdate,
}: {
  matches: Match[];
  focusMatchId: string | null;
  onFocus: (id: string | null) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Match>) => void;
}) {
  if (matches.length === 0) {
    return <div className="text-sm text-muted-foreground text-center py-8">Нет матчей</div>;
  }

  return (
    <div className="space-y-3">
      {matches.map((m) => (
        <MatchRow
          key={m.id}
          match={m}
          isFocused={focusMatchId === m.id}
          onFocus={() => onFocus(focusMatchId === m.id ? null : m.id)}
          onRemove={() => onRemove(m.id)}
          onUpdate={(patch) => onUpdate(m.id, patch)}
        />
      ))}
    </div>
  );
}

