'use client';

import { useGameContext } from '@/context/GameContext';

export function useGameSync() {
  return useGameContext();
}
