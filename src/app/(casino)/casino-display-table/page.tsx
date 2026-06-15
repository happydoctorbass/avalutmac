'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Match } from '@/types/match';
import { useCasinoMatches } from '../hooks/useCasinoMatches';

// Бишкек = UTC+6. По полям bishkek получаем абсолютное время старта матча.
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

function formatCountdown(ms: number) {
  if (ms <= 0) return '';
  const totalMin = Math.floor(ms / 60000);
  const days = Math.floor(totalMin / 1440);
  const hours = Math.floor((totalMin % 1440) / 60);
  const mins = totalMin % 60;
  if (days > 0) return `in ${days}d ${hours}h`;
  if (hours > 0) return `in ${hours}h ${mins}m`;
  return `in ${mins}m`;
}

const LIVE_WINDOW_MS = 130 * 60 * 1000; // ~2 часа 10 минут — матч считается «идёт сейчас»
const PAGE_SIZE = 6;
const PAGE_INTERVAL_MS = 8000;

export default function CasinoDisplayTablePage() {
  const { matches } = useCasinoMatches();

  // Текущее время — обновляем периодически, чтобы акцент и обратный отсчёт менялись сами
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(id);
  }, []);

  // Определяем активный матч: идущий сейчас, иначе ближайший предстоящий
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

  // Авто-листание оставшихся матчей
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

  return (
    <div className="relative flex h-screen w-full flex-col items-center overflow-hidden bg-background text-foreground">
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/logo/bg_main.svg')" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background/80" />
      <div className="pointer-events-none absolute inset-0 z-30 shadow-[inset_0_0_220px_70px_rgba(0,0,0,0.85)]" />

      {/* Logo */}
      <div className="relative z-50 mt-6 mb-4 shrink-0">
        <motion.img
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          src="/logo/admiral.svg"
          alt="Admiral Casino"
          className="h-14 w-auto drop-shadow-[0_0_18px_rgba(245,158,11,0.25)] md:h-16"
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
        <div className="relative z-10 flex w-full max-w-6xl flex-1 flex-col gap-5 overflow-hidden px-6 pb-8">
          {/* Hero — активный матч */}
          {activeMatch && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMatch.id}
                initial={{ opacity: 0, scale: 0.97, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -10 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative overflow-hidden rounded-[2.5rem] border-2 border-amber-500/70 bg-[hsl(222_47%_5%)]/95 p-12 shadow-[0_0_80px_rgba(245,158,11,0.4)] backdrop-blur-md"
              >
                <div
                  className="pointer-events-none absolute inset-0 bg-center bg-no-repeat bg-contain opacity-[0.08]"
                  style={{ backgroundImage: "url('/logo/main.svg')" }}
                />
                <div className="relative z-10 flex flex-col items-center">
                  {isLive ? (
                    <span className="mb-6 flex items-center gap-3 rounded-full bg-red-600/90 px-6 py-2 text-lg font-black uppercase tracking-[0.3em] text-white shadow-[0_0_30px_rgba(220,38,38,0.7)]">
                      <span className="h-3 w-3 animate-pulse rounded-full bg-white" />
                      Live now
                    </span>
                  ) : (
                    <span className="mb-6 rounded-full border-2 border-amber-500/60 bg-amber-500/15 px-6 py-2 text-lg font-black uppercase tracking-[0.3em] text-amber-400">
                      Next match
                    </span>
                  )}

                  <div className="flex w-full items-center justify-between gap-8">
                    <div className="flex flex-1 items-center justify-end text-right">
                      <span className="text-5xl font-black leading-tight tracking-tight md:text-[80px]">{activeMatch.team1}</span>
                    </div>

                    <div className="flex shrink-0 flex-col items-center px-8">
                      {activeMatch.score ? (
                        <span className="text-6xl font-black tracking-wider text-foreground drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] md:text-[100px]">
                          {activeMatch.score}
                        </span>
                      ) : (
                        <span className="text-6xl font-black text-amber-500 drop-shadow-[0_0_24px_rgba(245,158,11,0.7)] md:text-[100px]">
                          {timeLabel(activeMatch)}
                        </span>
                      )}
                      <span className="mt-4 text-sm font-bold uppercase tracking-[0.4em] text-muted-foreground md:text-xl">
                        {dateLabel(activeMatch)}
                      </span>
                    </div>

                    <div className="flex flex-1 items-center justify-start text-left">
                      <span className="text-5xl font-black leading-tight tracking-tight md:text-[80px]">{activeMatch.team2}</span>
                    </div>
                  </div>

                  {!isLive && activeStart && (
                    <span className="mt-8 text-xl font-black uppercase tracking-[0.25em] text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                      {formatCountdown(activeStart - now)}
                    </span>
                  )}
                  {activeMatch.winner && (
                    <span className="mt-6 text-xl font-black uppercase tracking-[0.3em] text-amber-500">
                      {activeMatch.winner === 'Ничья' ? 'Draw' : `Winner: ${activeMatch.winner}`}
                    </span>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Остальные матчи — авто-листание */}
          {rest.length > 0 && (
            <div className="mb-8 flex min-h-0 flex-col overflow-hidden rounded-3xl border border-border bg-[hsl(222_47%_5%)]/80 backdrop-blur-md">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-amber-500/30 bg-amber-500/10 text-left text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Time</th>
                    <th className="px-6 py-3">Match</th>
                    <th className="px-6 py-3 text-center">Score</th>
                    <th className="px-6 py-3">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((m, i) => {
                    const finished = Boolean(m.finished || m.score || m.winner);
                    return (
                      <motion.tr
                        key={`${page}-${m.id}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.04 }}
                        className={`border-b border-border/40 ${finished ? 'opacity-70' : ''}`}
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-lg font-semibold text-muted-foreground">
                          {dateLabel(m)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-xl font-black text-amber-500">
                          {timeLabel(m)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xl font-black md:text-2xl">
                            {m.team1} <span className="text-sm font-bold text-muted-foreground">VS</span> {m.team2}
                          </span>
                          {finished && (
                            <span className="ml-2 rounded-full border border-muted-foreground/40 bg-muted/40 px-2 py-0.5 align-middle text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                              Finished
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-2xl font-black tracking-wider">
                          {m.score ?? '—'}
                        </td>
                        <td className="px-6 py-4">
                          {m.winner ? (
                            <span
                              className={`text-base font-bold uppercase tracking-wide ${
                                m.winner === 'Ничья' ? 'text-muted-foreground' : 'text-amber-500'
                              }`}
                            >
                              {m.winner === 'Ничья' ? 'Draw' : m.winner}
                            </span>
                          ) : (
                            <span className="text-base font-semibold uppercase tracking-wide text-emerald-400">Soon</span>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Индикатор страниц */}
              {pageCount > 1 && (
                <div className="mt-auto flex items-center justify-center gap-2 py-4">
                  {Array.from({ length: pageCount }).map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === page ? 'w-6 bg-amber-500' : 'w-2 bg-muted-foreground/40'
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