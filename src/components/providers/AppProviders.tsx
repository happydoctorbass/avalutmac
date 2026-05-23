'use client';

import { GameProvider } from '@/context/GameContext';
import { ReactNode } from 'react';

export function AppProviders({ children }: { children: ReactNode }) {
  return <GameProvider>{children}</GameProvider>;
}
