'use client';

import { PlayerList } from '@/components/roulette/PlayerList';

export default function RouletteDisplayPage() {
  return (
    <div className="w-full h-screen p-8 flex justify-center">
      <div className="w-full max-w-5xl h-full">
        <PlayerList />
      </div>
    </div>
  );
}
