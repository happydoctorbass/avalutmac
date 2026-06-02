'use client';

import { Match } from '@/types/match';
import { Trophy, Activity, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface MatchCardProps {
  match: Match;
  isFocused?: boolean;
}

function Shimmer() {
  return (
    <motion.div
      className="pointer-events-none absolute top-0 left-0 h-[200%] w-16 -rotate-45 bg-white/15 blur-md z-10"
      animate={{ x: [-160, 700] }}
      transition={{ repeat: Infinity, repeatDelay: 6, duration: 1.6, ease: 'easeInOut' }}
    />
  );
}

function CardShell({
  isFocused,
  className,
  children,
}: {
  isFocused: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={isFocused ? { boxShadow: '0 0 0px rgba(255,255,255,0)' } : false}
      animate={
        isFocused
          ? { boxShadow: ['0 0 0px rgba(255,255,255,0)', '0 0 40px rgba(245,158,11,0.6)', '0 0 15px rgba(245,158,11,0.3)'] }
          : false
      }
      transition={{ duration: 1 }}
      className={`relative overflow-hidden rounded-3xl border bg-[hsl(222_47%_5%)]/95 text-card-foreground backdrop-blur-md transition-all duration-500 ${
        isFocused
          ? 'border-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
          : 'border-border'
      } ${className ?? ''}`}
    >
      {/* Card background logo watermark */}
      <div
        className="pointer-events-none absolute inset-0 bg-center bg-no-repeat bg-contain opacity-[0.06]"
        style={{ backgroundImage: "url('/logo/main.svg')" }}
      />
      <Shimmer />
      <div className="relative z-20 flex h-full w-full flex-col items-center justify-center">
        {children}
      </div>
    </motion.div>
  );
}

export function MatchCard({ match, isFocused = false }: MatchCardProps) {
  const isPromo = match.id.startsWith('promo');
  const timeLabel = match.time?.includes?.('T') ? match.time.split('T')[1]?.slice(0, 5) || match.time : match.time;

  if (isPromo) {
    return (
      <CardShell isFocused={isFocused} className="w-[28rem] min-h-[16rem] p-6">
        <img src="/logo/main.svg" alt="Admiral" className="h-20 w-auto opacity-90 drop-shadow-[0_0_18px_rgba(197,160,89,0.45)]" />
        <span className="mt-4 animate-pulse text-sm font-bold tracking-[0.2em] text-amber-500">
          ОЖИДАНИЕ МАТЧЕЙ...
        </span>
      </CardShell>
    );
  }

  const SportIcon = match.sportType === 'football' ? Activity : match.sportType === 'basketball' ? Zap : Trophy;

  return (
    <CardShell isFocused={isFocused} className="w-[32rem] min-h-[16rem] p-8">
      <div className="absolute top-4 left-4 text-muted-foreground opacity-60">
        <SportIcon size={24} />
      </div>

      <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-amber-500">
        {match.sportType}
      </div>

      <div className="mt-2 flex w-full items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col items-start justify-center border-r border-border pr-4">
          <span className="w-full truncate text-right text-2xl font-black text-foreground" title={match.team1}>
            {match.team1}
          </span>
        </div>

        <div className="flex w-32 shrink-0 flex-col items-center justify-center">
          <span className="text-4xl font-black text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
            {timeLabel}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-end justify-center border-l border-border pl-4">
          <span className="w-full truncate text-left text-2xl font-black text-foreground" title={match.team2}>
            {match.team2}
          </span>
        </div>
      </div>
    </CardShell>
  );
}
