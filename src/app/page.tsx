'use client';

import { GameProvider } from '@/context/GameContext';
import { useGameSync } from '@/hooks/useGameSync';
import { Screensaver } from '@/components/screensaver/Screensaver';
import { GameBoard } from '@/components/game-board/GameBoard';

function HomeContent() {
  const { gameState, sessionId } = useGameSync();

  return (
    <main className="relative w-full h-screen overflow-hidden" style={{ background: 'var(--bg-midnight)' }}>
      {gameState === 'IDLE' ? (
        <Screensaver />
      ) : (
        <GameBoard key={sessionId} />
      )}
    </main>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <HomeContent />
    </GameProvider>
  );
}
