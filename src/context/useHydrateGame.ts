'use client';

import { useEffect } from 'react';
import { applyCurrentGame, CurrentGameResponse } from '@/lib/apply-current-game';
import { GameSetters } from './pusher-handlers';

export function useHydrateGame(setters: GameSetters) {
  useEffect(() => {
    fetch('/api/game/current')
      .then((r) => r.json())
      .then((data: CurrentGameResponse) => applyCurrentGame(data, setters))
      .catch(() => {});
  }, [setters]);
}
