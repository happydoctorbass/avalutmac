'use client';

import { useGameSync } from '@/hooks/useGameSync';
import { Screensaver } from '@/components/screensaver/Screensaver';
import { GameBoard } from '@/components/game-board/GameBoard';

export default function Home() {
  const { gameState, sessionId } = useGameSync();

  return (
    <main className="relative w-full h-screen overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>
      {gameState === 'IDLE' ? <Screensaver /> : <GameBoard key={sessionId} />}
    </main>
  );
}
