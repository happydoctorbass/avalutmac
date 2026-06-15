'use client';

import { Match } from '@/types/match';
import { motion } from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';

interface MatchCardProps {
  match: Match;
  isFocused?: boolean;
}

const MAX_NAME_PX = 28;
const MIN_NAME_PX = 12;

function TeamNames({ team1, team2, timeLabel }: { team1: string; team2: string; timeLabel: string }) {
  const ref1 = useRef<HTMLSpanElement>(null);
  const ref2 = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState(MAX_NAME_PX);

  useLayoutEffect(() => {
    setSize(MAX_NAME_PX);
  }, [team1, team2]);

  useLayoutEffect(() => {
    const a = ref1.current;
    const b = ref2.current;
    if (!a || !b) return;
    const overflow = a.scrollWidth > a.clientWidth + 1 || b.scrollWidth > b.clientWidth + 1;
    if (overflow && size > MIN_NAME_PX) {
      setSize((s) => s - 1);
    }
  }, [size, team1, team2]);

  return (
    <div className="mt-2 flex w-full items-center justify-between gap-4">
      <div className="flex min-w-0 flex-1 flex-col items-end justify-center border-r border-border pr-4">
        <span
          ref={ref1}
          className="block w-full overflow-hidden whitespace-nowrap text-right font-black leading-tight text-foreground"
          style={{ fontSize: `${size}px` }}
          title={team1}
        >
          {team1}
        </span>
      </div>

      <div className="flex w-32 shrink-0 flex-col items-center justify-center">
        <span className="text-4xl font-black text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
          {timeLabel}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-start justify-center border-l border-border pl-4">
        <span
          ref={ref2}
          className="block w-full overflow-hidden whitespace-nowrap text-left font-black leading-tight text-foreground"
          style={{ fontSize: `${size}px` }}
          title={team2}
        >
          {team2}
        </span>
      </div>
    </div>
  );
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
  const timeLabel = match.bishkek?.time_bishkek || (match.time?.includes?.('T') ? match.time.split('T')[1]?.slice(0, 5) || match.time : match.time);

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

  const hasResult = Boolean(match.score || match.winner);
  const isFinished = Boolean(match.finished || hasResult);

  return (
    <CardShell isFocused={isFocused} className="w-[32rem] min-h-[16rem] p-8">
      <div className="mb-4 flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-amber-500">
        <span>{match.sportType}</span>
        {isFinished && (
          <span className="rounded-full border border-muted-foreground/40 bg-muted/40 px-3 py-0.5 text-[11px] font-bold tracking-[0.2em] text-muted-foreground">
            ЗАВЕРШЁН
          </span>
        )}
      </div>

      <div className={isFinished ? 'w-full opacity-70 saturate-[0.85] transition' : 'w-full'}>
        <TeamNames team1={match.team1} team2={match.team2} timeLabel={timeLabel} />
      </div>

      {hasResult && (
        <div className="mt-5 flex w-full flex-col items-center gap-1 border-t border-border pt-4">
          {match.score && (
            <div className="text-3xl font-black tracking-wider text-foreground drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]">
              {match.score}
            </div>
          )}
          {match.winner && (
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-amber-500">
              {match.winner === 'Ничья' ? (
                <span>Ничья</span>
              ) : (
                <span>Победитель: {match.winner}</span>
              )}
            </div>
          )}
          {match.guestBetMessage && (
            <div className="mt-2 text-xs font-medium tracking-wide text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
              {match.guestBetMessage}
            </div>
          )}
        </div>
      )}
    </CardShell>
  );
}
