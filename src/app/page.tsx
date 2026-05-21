'use client';

import { useGameSync } from '@/hooks/useGameSync';
import { Screensaver } from '@/components/screensaver/Screensaver';
import { GameBoard } from '@/components/game-board/GameBoard';

export default function Home() {
  const { gameState } = useGameSync();

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {gameState === 'IDLE' ? (
        <Screensaver />
      ) : (
        <GameBoard />
      )}
    </main>
  );
}