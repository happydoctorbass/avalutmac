'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Match } from '@/types/match';
import { useCasinoMatches } from '../hooks/useCasinoMatches';

function getStartMs(m: Match): number | null {
  if (m.bishkek?.date_bishkek && m.bishkek?.time_bishkek) {
    const [Y, Mo, D] = m.bishkek.date_bishkek.split('-').map(Number);
    const [H, Mi] = m.bishkek.time_bishkek.split(':').map(Number);
    if ([Y, Mo, D, H, Mi].every((n) => !Number.isNaN(n))) {
      return Date.UTC(Y, Mo - 1, D, H, Mi) - 6 * 3600 * 1000;
    }
  }
  return null;
}

function dateLabel(m: Match) {
  if (m.bishkek) {
    const parts = m.bishkek.date_bishkek.split('-');
    if (parts.length === 3) {
      const [, mm, dd] = parts;
      return `${dd}.${mm}`;
    }
    return m.bishkek.date_bishkek;
  }
  return '';
}

function timeLabel(m: Match) {
  return m.bishkek?.time_bishkek ?? (m.time?.includes('T') ? m.time.split('T')[1]?.slice(0, 5) : m.time) ?? '';
}

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}

function formatCountdown(ms: number) {
  if (ms <= 0) return 'Starting soon';

  const totalMin = Math.max(1, Math.floor(ms / 60000));
  const days = Math.floor(totalMin / 1440);
  const hours = Math.floor((totalMin % 1440) / 60);
  const mins = totalMin % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(plural(days, 'day', 'days'));
  if (hours > 0) parts.push(plural(hours, 'hour', 'hours'));
  if (mins > 0) parts.push(plural(mins, 'minute', 'minutes'));

  if (parts.length === 0) return 'Starting soon';
  if (parts.length === 1) return `in ${parts[0]}`;
  if (parts.length === 2) return `in ${parts[0]} and ${parts[1]}`;
  return `in ${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
}

const LIVE_WINDOW_MS = 130 * 60 * 1000;
const PAGE_SIZE = 6;
const PAGE_INTERVAL_MS = 8000;

const MAX_TEAM_PX = 88;
const MIN_TEAM_PX = 28;

function HeroTeamName({ name, align }: { name: string; align: 'left' | 'right' }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState(MAX_TEAM_PX);

  useLayoutEffect(() => {
    setSize(MAX_TEAM_PX);
  }, [name]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.scrollWidth > el.clientWidth + 2 && size > MIN_TEAM_PX) {
      setSize((s) => s - 2);
    }
  }, [size, name]);

  return (
    <span
      ref={ref}
      className={`block w-full overflow-hidden whitespace-nowrap font-black leading-none text-foreground ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
      style={{ fontSize: `${size}px` }}
      title={name}
    >
      {name}
    </span>
  );
}

export default function CasinoDisplayTablePage() {
  const { matches } = useCasinoMatches();

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const { activeId, isLive, activeStart } = useMemo(() => {
    const withStart = matches
      .map((m) => ({ m, start: getStartMs(m) }))
      .filter((x): x is { m: Match; start: number } => x.start !== null);

    const live = withStart
      .filter((x) => now >= x.start && now <= x.start + LIVE_WINDOW_MS)
      .sort((a, b) => a.start - b.start)[0];

    const next = withStart
      .filter((x) => x.start > now)
      .sort((a, b) => a.start - b.start)[0];

    const chosen = live ?? next;
    return {
      activeId: chosen?.m.id ?? null,
      isLive: Boolean(live),
      activeStart: chosen?.start ?? null,
    };
  }, [matches, now]);

  const activeMatch = matches.find((m) => m.id === activeId) ?? null;
  const rest = matches.filter((m) => m.id !== activeId);

  const pageCount = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
  const [page, setPage] = useState(0);
  useEffect(() => {
    if (pageCount <= 1) {
      setPage(0);
      return;
    }
    const id = setInterval(() => setPage((p) => (p + 1) % pageCount), PAGE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [pageCount]);
  useEffect(() => {
    if (page >= pageCount) setPage(0);
  }, [page, pageCount]);

  const pageRows = rest.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const countdownText = activeStart && !isLive ? formatCountdown(activeStart - now) : '';

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-x-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/logo/bg_main.svg')" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background/90" />
      <div className="pointer-events-none absolute inset-0 z-30 shadow-[inset_0_0_180px_60px_rgba(0,0,0,0.8)]" />

      <div className="relative z-50 mt-5 mb-3 shrink-0">
        <motion.img
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          src="/logo/admiral.svg"
          alt="Admiral Casino"
          className="h-14 w-auto drop-shadow-[0_0_18px_rgba(245,158,11,0.3)] md:h-16"
        />
      </div>

      {matches.length === 0 ? (
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
          <img
            src="/logo/main.svg"
            alt="Admiral"
            className="h-24 w-auto opacity-90 drop-shadow-[0_0_18px_rgba(197,160,89,0.45)]"
          />
          <span className="mt-6 animate-pulse text-lg font-bold tracking-[0.3em] text-amber-500">
            WAITING FOR MATCHES...
          </span>
        </div>
      ) : (
        <div className="relative z-10 flex w-full flex-col gap-6 px-3 pb-6 md:px-6 md:gap-8">
          {activeMatch && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMatch.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="relative w-full overflow-hidden rounded-[2rem] border-2 border-amber-500/60 bg-[hsl(222_47%_4%)]/95 px-4 py-10 shadow-[0_0_100px_rgba(245,158,11,0.25),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl md:rounded-[2.5rem] md:px-10 md:py-12"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-80" />
                <div
                  className="pointer-events-none absolute inset-0 bg-center bg-no-repeat bg-contain opacity-[0.05]"
                  style={{ backgroundImage: "url('/logo/main.svg')" }}
                />

                <div className="relative z-10 flex flex-col items-center">
                  {isLive ? (
                    <span className="mb-5 flex items-center gap-3 rounded-full bg-red-600 px-7 py-2.5 text-xl font-black uppercase tracking-[0.35em] text-white shadow-[0_0_40px_rgba(220,38,38,0.65)] md:text-2xl">
                      <span className="h-3.5 w-3.5 animate-pulse rounded-full bg-white" />
                      Live now
                    </span>
                  ) : (
                    <span className="mb-5 rounded-full border border-amber-500/50 bg-amber-500/10 px-7 py-2.5 text-xl font-black uppercase tracking-[0.35em] text-amber-400 md:text-2xl">
                      Next match
                    </span>
                  )}

                  <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-8">
                    <div className="min-w-0 border-r border-amber-500/20 pr-3 md:pr-8">
                      <HeroTeamName name={activeMatch.team1} align="right" />
                    </div>

                    <div className="flex shrink-0 flex-col items-center px-2 md:px-6">
                      {activeMatch.score ? (
                        <span className="whitespace-nowrap text-6xl font-black tracking-wider text-foreground drop-shadow-[0_0_24px_rgba(255,255,255,0.35)] md:text-8xl xl:text-[120px]">
                          {activeMatch.score}
                        </span>
                      ) : (
                        <span className="whitespace-nowrap text-6xl font-black text-amber-500 drop-shadow-[0_0_28px_rgba(245,158,11,0.75)] md:text-8xl xl:text-[120px]">
                          {timeLabel(activeMatch)}
                        </span>
                      )}
                      <span className="mt-2 whitespace-nowrap text-base font-bold uppercase tracking-[0.45em] text-muted-foreground md:text-2xl">
                        {dateLabel(activeMatch)}
                      </span>
                    </div>

                    <div className="min-w-0 border-l border-amber-500/20 pl-3 md:pl-8">
                      <HeroTeamName name={activeMatch.team2} align="left" />
                    </div>
                  </div>

                  {!isLive && countdownText && (
                    <motion.p
                      animate={{ opacity: [0.55, 1, 0.55], scale: [0.98, 1.02, 0.98] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="mt-8 text-center text-2xl font-black uppercase tracking-[0.12em] text-emerald-400 drop-shadow-[0_0_16px_rgba(52,211,153,0.45)] md:text-4xl xl:text-5xl"
                    >
                      {countdownText}
                    </motion.p>
                  )}

                  {activeMatch.winner && (
                    <p className="mt-5 text-xl font-black uppercase tracking-[0.25em] text-amber-500 md:text-2xl">
                      {activeMatch.winner === 'Ничья' ? 'Draw' : `Winner: ${activeMatch.winner}`}
                    </p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {rest.length > 0 && (
            <div className="w-full overflow-hidden rounded-2xl border border-amber-500/25 bg-[hsl(222_47%_5%)]/90 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-md md:rounded-3xl">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-500/15 text-left uppercase text-amber-400">
                    <th className="px-5 py-5 text-2xl font-black tracking-[0.15em] md:px-8 md:py-6 md:text-4xl">Date</th>
                    <th className="px-5 py-5 text-2xl font-black tracking-[0.15em] md:px-8 md:py-6 md:text-4xl">Time</th>
                    <th className="px-5 py-5 text-2xl font-black tracking-[0.15em] md:px-8 md:py-6 md:text-4xl">Match</th>
                    <th className="px-5 py-5 text-center text-2xl font-black tracking-[0.15em] md:px-8 md:py-6 md:text-4xl">Score</th>
                    <th className="px-5 py-5 text-2xl font-black tracking-[0.15em] md:px-8 md:py-6 md:text-4xl">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((m, i) => {
                    const finished = Boolean(m.finished || m.score || m.winner);
                    return (
                      <motion.tr
                        key={`${page}-${m.id}`}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.03 }}
                        className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''} ${
                          finished ? 'opacity-75' : ''
                        }`}
                      >
                        <td className="whitespace-nowrap px-5 py-4 text-xl font-semibold text-muted-foreground md:px-8 md:py-5 md:text-3xl">
                          {dateLabel(m)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-2xl font-black text-amber-500 md:px-8 md:py-5 md:text-4xl">
                          {timeLabel(m)}
                        </td>
                        <td className="px-5 py-4 md:px-8 md:py-5">
                          <span className="whitespace-nowrap text-2xl font-black md:text-4xl">
                            {m.team1}{' '}
                            <span className="mx-1 text-lg font-bold text-muted-foreground md:text-2xl">VS</span>{' '}
                            {m.team2}
                          </span>
                          {finished && (
                            <span className="ml-2 inline-block rounded-full border border-muted-foreground/30 bg-muted/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground md:text-xs">
                              Finished
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-center text-3xl font-black md:px-8 md:py-5 md:text-5xl">
                          {m.score ?? '—'}
                        </td>
                        <td className="px-5 py-4 md:px-8 md:py-5">
                          {m.winner ? (
                            <span
                              className={`text-xl font-bold uppercase md:text-3xl ${
                                m.winner === 'Ничья' ? 'text-muted-foreground' : 'text-amber-400'
                              }`}
                            >
                              {m.winner === 'Ничья' ? 'Draw' : m.winner}
                            </span>
                          ) : (
                            <span className="text-xl font-semibold uppercase text-emerald-400 md:text-3xl">Soon</span>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>

              {pageCount > 1 && (
                <div className="flex items-center justify-center gap-2.5 py-5">
                  {Array.from({ length: pageCount }).map((_, idx) => (
                    <span
                      key={idx}
                      className={`rounded-full transition-all duration-300 ${
                        idx === page ? 'h-2.5 w-8 bg-amber-500' : 'h-2.5 w-2.5 bg-muted-foreground/35'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
