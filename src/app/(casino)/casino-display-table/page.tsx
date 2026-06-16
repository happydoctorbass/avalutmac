'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Match, FlagSize } from '@/types/match';
import { useCasinoMatches } from '../hooks/useCasinoMatches';
import { mergeTableDisplay, safeInsetCss, computeTableRowFillScale } from '@/lib/table-display-settings';
import {
  getMatchStartMs,
  isMatchLive,
} from '@/lib/match-visibility';
import { heroTeamMaxPx, tableTeamMaxPx, useViewportWidth } from '../hooks/useViewportWidth';
import { CountryFlag } from '@/components/CountryFlag';
import { AutoShrinkText } from '../display/components/AutoShrinkText';
import { HARDCODED_MATCHES, HardcodedMatch } from '@/lib/hardcoded-matches';

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

function formatCountdownShort(ms: number) {
  if (ms <= 0) return 'SOON';

  const totalMin = Math.max(1, Math.floor(ms / 60000));
  const days = Math.floor(totalMin / 1440);
  const hours = Math.floor((totalMin % 1440) / 60);
  const mins = totalMin % 60;

  if (days > 0) return `IN ${days}D ${hours}H`;
  if (hours > 0) return `IN ${hours}H ${mins}M`;
  return `IN ${mins}M`;
}

const FINISHED_HIDE_AFTER_MS = 2 * 60 * 60 * 1000; // 2 hours

function getStartOrInfinity(m: HardcodedMatch) {
  return getMatchStartMs(m) ?? Number.POSITIVE_INFINITY;
}

function isHiddenFinished(m: HardcodedMatch, now: number) {
  const start = getMatchStartMs(m);
  if (start === null) return false;
  return now > start + FINISHED_HIDE_AFTER_MS;
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

function cellPad(scale: number) {
  return {
    paddingLeft: `calc(clamp(0.25rem, 0.8vw, 1.25rem) * ${scale})`,
    paddingRight: `calc(clamp(0.25rem, 0.8vw, 1.25rem) * ${scale})`,
    paddingTop: `calc(clamp(0.25rem, 1vh, 0.75rem) * ${scale})`,
    paddingBottom: `calc(clamp(0.25rem, 1vh, 0.75rem) * ${scale})`,
  };
}

function scaledFont(min: number, vwFactor: number, max: number, scale: number) {
  return `clamp(${min * scale}px, ${vwFactor * scale}vw, ${max * scale}px)`;
}

function HeroTeamName({
  name,
  maxPx,
  flagSize,
  flagScale,
  gapScale,
}: {
  name: string;
  maxPx: number;
  flagSize: FlagSize;
  flagScale: number;
  gapScale: number;
}) {
  const gap = `calc(clamp(0.25rem, 0.8vw, 0.75rem) * ${gapScale})`;

  return (
    <div className="flex min-w-0 w-full flex-col items-center" style={{ gap }}>
      <CountryFlag team={name} size={flagSize} scale={flagScale} />
      <AutoShrinkText
        text={name}
        maxPx={maxPx}
        minPx={12}
        className="min-w-0 w-full text-center font-black leading-none"
      />
    </div>
  );
}

function TableTeamBlock({
  team,
  maxTeamPx,
  flagSize,
  flagScale,
  contentScale,
}: {
  team: string;
  maxTeamPx: number;
  flagSize: FlagSize;
  flagScale: number;
  contentScale: number;
}) {
  return (
    <div
      className="flex min-w-0 flex-1 flex-col items-center"
      style={{ gap: `calc(clamp(0.1rem, 0.35vw, 0.3rem) * ${contentScale})` }}
    >
      <CountryFlag team={team} size={flagSize} scale={flagScale} className="shrink-0" />
      <AutoShrinkText
        text={team}
        maxPx={maxTeamPx}
        minPx={9}
        className="min-w-0 w-full text-center font-black leading-none"
      />
    </div>
  );
}

function TableMatchCell({
  team1,
  team2,
  finished,
  maxTeamPx,
  flagSize,
  flagScale,
  contentScale,
}: {
  team1: string;
  team2: string;
  finished: boolean;
  maxTeamPx: number;
  flagSize: FlagSize;
  flagScale: number;
  contentScale: number;
}) {
  return (
    <div
      className="flex min-w-0 items-center justify-center"
      style={{ gap: `calc(clamp(0.15rem, 0.5vw, 0.4rem) * ${contentScale})` }}
    >
      <TableTeamBlock
        team={team1}
        maxTeamPx={maxTeamPx}
        flagSize={flagSize}
        flagScale={flagScale}
        contentScale={contentScale}
      />
      <span
        className="shrink-0 font-bold text-muted-foreground"
        style={{
          paddingInline: `calc(clamp(0.05rem, 0.25vw, 0.2rem) * ${contentScale})`,
          fontSize: scaledFont(8, 1, 16, contentScale),
        }}
      >
        VS
      </span>
      <TableTeamBlock
        team={team2}
        maxTeamPx={maxTeamPx}
        flagSize={flagSize}
        flagScale={flagScale}
        contentScale={contentScale}
      />
      {finished && (
        <span
          className="ml-0.5 hidden shrink-0 rounded-full border border-muted-foreground/30 bg-muted/30 font-bold uppercase tracking-wider text-muted-foreground sm:inline"
          style={{
            padding: `calc(0.125rem * ${contentScale}) calc(0.25rem * ${contentScale})`,
            fontSize: scaledFont(7, 0.8, 10, contentScale),
          }}
        >
          FT
        </span>
      )}
    </div>
  );
}

export default function CasinoDisplayTablePage() {
  const { settings } = useCasinoMatches({ pollIntervalMs: 4000 });
  const td = mergeTableDisplay(settings.tableDisplay);
  const vw = useViewportWidth();
  const heroMaxPx = heroTeamMaxPx(vw) * td.heroTeamFontScale;
  const teamMaxPx = tableTeamMaxPx(vw) * td.tableTeamFontScale;
  const pageSize = td.pageSize;
  const pageIntervalMs = td.pageIntervalSec * 1000;

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const matches = useMemo(() => {
    // Filter finished and sort by nearest start time (soonest first)
    return HARDCODED_MATCHES
      .filter((m) => !isHiddenFinished(m, now))
      .slice()
      .sort((a, b) => {
        const sa = getStartOrInfinity(a);
        const sb = getStartOrInfinity(b);
        if (sa !== sb) return sa - sb;
        return a.id.localeCompare(b.id);
      });
  }, [now]);

  const { activeId, isLive, activeStart } = useMemo(() => {
    const withStart = matches
      .map((m) => ({ m, start: getMatchStartMs(m) }))
      .filter((x): x is { m: HardcodedMatch; start: number } => x.start !== null);

    const live = withStart
      .filter((x) => isMatchLive(x.m, now))
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

  const pageCount = Math.max(1, Math.ceil(rest.length / 9));
  const [page, setPage] = useState(0);
  useEffect(() => {
    if (pageCount <= 1) {
      setPage(0);
      return;
    }
    const id = setInterval(() => setPage((p) => (p + 1) % pageCount), pageIntervalMs);
    return () => clearInterval(id);
  }, [pageCount, pageIntervalMs]);
  useEffect(() => {
    if (page >= pageCount) setPage(0);
  }, [page, pageCount]);

  const pageRows = rest.slice(page * 9, page * 9 + 9);
  const countdownText = activeStart && !isLive ? formatCountdownShort(activeStart - now) : '';

  const rowFillScale = computeTableRowFillScale(pageRows.length, td);
  const rowTeamMaxPx = teamMaxPx * rowFillScale;
  const rowMetaScale = td.tableMetaFontScale * rowFillScale;
  const rowHeaderScale = td.tableHeaderFontScale * rowFillScale;
  const rowFlagScale = td.tableFlagScale * rowFillScale;
  const rowPad = cellPad(td.tableCellPaddingScale * rowFillScale);

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] w-full max-w-[100vw] overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/logo/bg_main.svg')" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background/90" />

      <div
        className="relative z-10 box-border flex h-full min-h-0 w-full flex-col items-center overflow-hidden"
        style={{ padding: safeInsetCss(td) }}
      >
        <div className="mb-[clamp(0.35rem,1vh,0.75rem)] shrink-0">
          <motion.img
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            src="/logo/admiral.svg"
            alt="Admiral Casino"
            className="h-[clamp(2.5rem,6vw,4rem)] w-auto"
          />
        </div>

      {matches.length === 0 ? (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-2">
          <img
            src="/logo/main.svg"
            alt="Admiral"
            className="h-[clamp(4rem,12vw,6rem)] w-auto opacity-90"
          />
          <span className="mt-6 animate-pulse text-[clamp(0.75rem,2.5vw,1.125rem)] font-bold tracking-[0.25em] text-amber-500 sm:tracking-[0.3em]">
            WAITING FOR MATCHES...
          </span>
        </div>
      ) : (
        <div className="box-border flex min-h-0 w-full max-w-full flex-1 flex-col gap-[clamp(0.5rem,1.5vh,1.5rem)] overflow-hidden">
          {activeMatch && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMatch.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="relative box-border w-full min-w-0 shrink-0 overflow-hidden rounded-[clamp(1rem,3vw,2.5rem)] border-2 border-amber-500/60 bg-[hsl(222_47%_4%)]/95"
                style={{
                  paddingLeft: `calc(clamp(0.75rem, 2.5vw, 2.5rem) * ${td.heroPaddingScale})`,
                  paddingRight: `calc(clamp(0.75rem, 2.5vw, 2.5rem) * ${td.heroPaddingScale})`,
                  paddingTop: `calc(clamp(1rem, 3vh, 2.5rem) * ${td.heroPaddingScale})`,
                  paddingBottom: `calc(clamp(1rem, 3vh, 2.5rem) * ${td.heroPaddingScale})`,
                }}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-80" />
                <div
                  className="pointer-events-none absolute inset-0 bg-center bg-no-repeat bg-contain opacity-[0.05]"
                  style={{ backgroundImage: "url('/logo/main.svg')" }}
                />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="flex flex-col items-center mb-[clamp(0.5rem,1.5vh,1rem)]">
                    {isLive ? (
                      <span
                        className="mb-2 flex items-center gap-2 rounded-full bg-red-600 px-[clamp(0.75rem,2.5vw,1.5rem)] py-[clamp(0.35rem,0.8vh,0.5rem)] font-black uppercase tracking-[0.2em] text-white sm:tracking-[0.35em]"
                        style={{ fontSize: scaledFont(12, 2.2, 24, td.heroBadgeFontScale) }}
                      >
                        <span className="h-[clamp(0.4rem,1vw,0.75rem)] w-[clamp(0.4rem,1vw,0.75rem)] animate-pulse rounded-full bg-white" />
                        LIVE NOW
                      </span>
                    ) : (
                      <motion.span
                        className="mb-2 rounded-full border border-amber-500/50 bg-amber-500/10 px-[clamp(0.75rem,2.5vw,1.5rem)] py-[clamp(0.35rem,0.8vh,0.5rem)] font-black uppercase tracking-[0.2em] text-amber-400 sm:tracking-[0.35em]"
                        style={{ fontSize: scaledFont(12, 2.2, 24, td.heroBadgeFontScale) }}
                        animate={{ 
                          opacity: [0.8, 1, 0.8], 
                          boxShadow: [
                            '0 0 0px rgba(245,158,11,0)',
                            '0 0 15px rgba(245,158,11,0.3)',
                            '0 0 0px rgba(245,158,11,0)'
                          ]
                        }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        NEXT MATCH {countdownText && `| ${countdownText}`}
                      </motion.span>
                    )}
                    <span
                      className="whitespace-nowrap font-black uppercase tracking-[0.12em] text-foreground"
                      style={{ fontSize: scaledFont(21, 4.5, 66, td.heroCenterFontScale * 0.675) }}
                    >
                      FIFA PROMO BONUS
                    </span>
                    <span
                      className="whitespace-nowrap font-black uppercase tracking-[0.12em] text-amber-400 mt-0.5"
                      style={{ fontSize: scaledFont(21, 4.5, 66, td.heroCenterFontScale * 0.675) }}
                    >
                      BET AND WIN
                    </span>
                  </div>

                  <div
                    className="flex w-full min-w-0 items-center"
                    style={{ gap: `calc(clamp(0.25rem, 1.2vw, 1.5rem) * ${td.heroGapScale})` }}
                  >
                    <div
                      className="flex min-w-0 flex-1 border-r border-amber-500/20"
                      style={{ paddingRight: `calc(clamp(0.25rem, 1vw, 1.25rem) * ${td.heroGapScale})` }}
                    >
                      <HeroTeamName
                        name={activeMatch.team1}
                        maxPx={heroMaxPx}
                        flagSize={td.heroFlagSize}
                        flagScale={td.heroFlagScale}
                        gapScale={td.heroGapScale}
                      />
                    </div>

                    <div
                      className="flex shrink-0 flex-col items-center justify-center scale-80"
                      style={{ paddingInline: `calc(clamp(0.15rem, 0.6vw, 1rem) * ${td.heroGapScale})` }}
                    >
                      <motion.div
                        className="flex flex-col items-center justify-center relative"
                        animate={{ 
                          scale: [1, 1.02, 1],
                          filter: [
                            'drop-shadow(0 0 10px rgba(250,204,21,0.4))',
                            'drop-shadow(0 0 25px rgba(250,204,21,0.8))',
                            'drop-shadow(0 0 10px rgba(250,204,21,0.4))'
                          ]
                        }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <span
                          className="whitespace-nowrap font-black leading-none bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent"
                          style={{ fontSize: scaledFont(28, 7, 96, td.heroCenterFontScale) }}
                        >
                          {activeMatch.prize} or
                        </span>
                        <span
                          className="whitespace-nowrap font-black leading-none bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-200 bg-clip-text text-transparent mt-1"
                          style={{ fontSize: scaledFont(28, 7, 96, td.heroCenterFontScale) }}
                        >
                          $50 Lucky Chips
                        </span>
                        
                        {/* Shimmer effect overlay */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                          animate={{ x: ['-150%', '150%'] }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                          style={{ mixBlendMode: 'overlay' }}
                        />
                      </motion.div>
                    </div>

                    <div
                      className="flex min-w-0 flex-1 border-l border-amber-500/20"
                      style={{ paddingLeft: `calc(clamp(0.25rem, 1vw, 1.25rem) * ${td.heroGapScale})` }}
                    >
                      <HeroTeamName
                        name={activeMatch.team2}
                        maxPx={heroMaxPx}
                        flagSize={td.heroFlagSize}
                        flagScale={td.heroFlagScale}
                        gapScale={td.heroGapScale}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {rest.length > 0 && (
            <div className="box-border flex min-h-0 w-full min-w-0 max-w-full flex-1 flex-col overflow-hidden rounded-[clamp(0.75rem,2vw,1.5rem)] border border-amber-500/25 bg-[hsl(222_47%_5%)]/90 mb-2 mx-auto">
              <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden overflow-x-auto">
                <table className="flex h-full min-h-0 w-full min-w-full flex-1 flex-col table-fixed border-collapse">
                  <colgroup>
                    <col style={{ width: `${td.colDate}%` }} />
                    <col style={{ width: `${td.colTime}%` }} />
                    <col style={{ width: `${td.colMatch}%` }} />
                    <col style={{ width: `${td.colScore}%` }} />
                    <col style={{ width: `${td.colResult}%` }} />
                  </colgroup>
                  <thead className="shrink-0">
                    <tr className="table w-full table-fixed border-b-2 border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-500/15 uppercase text-amber-400">
                      {(['Date', 'Time', 'Match', 'Score', 'Result'] as const).map((label) => (
                        <th
                          key={label}
                          className="font-black tracking-[0.06em] sm:tracking-[0.12em] text-[12px] sm:text-xs text-center"
                          style={rowPad}
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <motion.tbody
                    className="flex min-h-0 flex-1 flex-col"
                    initial="hidden"
                    animate="show"
                    variants={{
                      hidden: {},
                      show: {
                        transition: { staggerChildren: 0.045, delayChildren: 0.02 },
                      },
                    }}
                    key={page}
                  >
                    {pageRows.map((m, i) => {
                      const finished = Boolean(m.finished || m.score || m.winner);
                      return (
                        <motion.tr
                          key={`${page}-${m.id}`}
                          variants={{
                            hidden: { opacity: 0, x: -10 },
                            show: { opacity: 1, x: 0, transition: { duration: 0.28, ease: 'easeOut' } },
                          }}
                          className={`table w-full table-fixed flex-1 border-b border-white/5 ${
                            i % 2 === 0 ? 'bg-white/[0.02]' : ''
                          } ${finished ? 'opacity-75' : ''}`}
                        >
                          <td
                            className="whitespace-nowrap align-middle text-center font-semibold text-muted-foreground"
                            style={{ ...rowPad, fontSize: scaledFont(9, 1.8, 30, rowMetaScale) }}
                          >
                            {dateLabel(m)}
                          </td>
                          <td
                            className="whitespace-nowrap align-middle text-center font-black text-amber-500"
                            style={{ ...rowPad, fontSize: scaledFont(11, 2.2, 36, rowMetaScale) }}
                          >
                            {timeLabel(m)}
                          </td>
                          <td className="min-w-0 align-middle" style={rowPad}>
                            <TableMatchCell
                              team1={m.team1}
                              team2={m.team2}
                              finished={finished}
                              maxTeamPx={rowTeamMaxPx}
                              flagSize={td.tableFlagSize}
                              flagScale={rowFlagScale}
                              contentScale={rowFillScale}
                            />
                          </td>
                          <td
                            className="whitespace-nowrap align-middle text-center font-black leading-none"
                            style={{ ...rowPad, fontSize: scaledFont(12, 2.8, 48, rowMetaScale) }}
                          >
                            {m.score ?? '—'}
                          </td>
                          <td className="min-w-0 align-middle text-center" style={rowPad}>
                            {m.winner ? (
                              <span
                                className={`block truncate text-center font-bold uppercase ${
                                  m.winner === 'Ничья' ? 'text-muted-foreground' : 'text-amber-400'
                                }`}
                                style={{ fontSize: scaledFont(9, 1.8, 30, rowMetaScale) }}
                                title={m.winner === 'Ничья' ? 'Draw' : m.winner}
                              >
                                {m.winner === 'Ничья' ? 'Draw' : m.winner}
                              </span>
                            ) : (
                              <span
                                className="font-semibold uppercase text-emerald-400"
                                style={{ fontSize: scaledFont(9, 1.8, 30, rowMetaScale) }}
                              >
                                Soon
                              </span>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </motion.tbody>
                </table>
              </div>

              {pageCount > 1 && (
                <div className="flex shrink-0 items-center justify-center gap-2.5 py-[clamp(0.35rem,1vh,0.75rem)]">
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
    </div>
  );
}
