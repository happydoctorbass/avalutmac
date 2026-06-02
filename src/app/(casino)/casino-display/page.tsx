'use client';

import { MatchCarousel } from '../display/components/MatchCarousel';
import { useCasinoMatches } from '../hooks/useCasinoMatches';
import { motion } from 'framer-motion';

export default function CasinoDisplayPage() {
  const { matches, focusMatchId, settings, isConnected } = useCasinoMatches();

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background text-foreground">
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/logo/bg_main.svg')" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background/80" />

      {/* Logo */}
      <div className="absolute top-8 left-1/2 z-50 -translate-x-1/2">
        <motion.img
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          src="/logo/admiral.svg"
          alt="Admiral Casino"
          className="h-16 w-auto drop-shadow-[0_0_18px_rgba(245,158,11,0.25)] md:h-20"
        />
      </div>

      <div className="relative z-10 w-full">
        <MatchCarousel matches={matches} focusMatchId={focusMatchId} settings={settings} />
      </div>

      {/* Connection status */}
      <div className="pointer-events-none absolute bottom-4 z-50 w-full text-center text-xs opacity-50">
        <p className={isConnected ? 'text-green-500' : 'animate-pulse text-muted-foreground'}>
          {isConnected ? 'LIVE SYNC ACTIVE' : 'CONNECTING...'}
        </p>
      </div>
    </div>
  );
}
