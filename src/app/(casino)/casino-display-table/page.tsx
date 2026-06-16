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
import { TEAM_NAMES } from '@/lib/team-flags';

const DICT = {
  en: {
    promoBonus: "FIFA PROMO BONUS",
    betAndWin: "BET AND WIN",
    prize: (val: string) => `${val} or`,
    prize2: "$50 Lucky Chips",
    nextMatch: "NEXT MATCH",
    liveNow: "LIVE NOW",
    inTime: (h: number, m: number, d: number) => {
      if (d > 0) return `IN ${d}D ${h}H`;
      if (h > 0) return `IN ${h}H ${m}M`;
      return `IN ${m}M`;
    },
    soon: "SOON",
    date: "Date",
    time: "Time",
    match: "Match",
    vs: "VS",
    waiting: "WAITING FOR MATCHES..."
  },
  zh: {
    promoBonus: "FIFA 促销奖金",
    betAndWin: "投注赢大奖",
    prize: (val: string) => `${val.replace('KGS', '索姆')}或`,
    prize2: "50 美元幸运筹码",
    nextMatch: "下一场比赛即将开始",
    liveNow: "正在直播",
    inTime: (h: number, m: number, d: number) => {
      if (d > 0) return `${d}天${h}小时后`;
      if (h > 0) return `${h}小时${m}分钟后`;
      return `${m}分钟后`;
    },
    soon: "即将开始",
    date: "日期",
    time: "时间",
    match: "匹配",
    vs: "反对",
    waiting: "等待比赛..."
  }
};

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

function formatCountdownShort(ms: number, lang: 'en' | 'zh') {
  if (ms <= 0) return DICT[lang].soon;

  const totalMin = Math.max(1, Math.floor(ms / 60000));
  const days = Math.floor(totalMin / 1440);
  const hours = Math.floor((totalMin % 1440) / 60);
  const mins = totalMin % 60;

  return DICT[lang].inTime(hours, mins, days);
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
    paddingTop: `calc(clamp(0.15rem, 0.6vh, 0.5rem) * ${scale})`,
    paddingBottom: `calc(clamp(0.15rem, 0.6vh, 0.5rem) * ${scale})`,
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
  lang,
}: {
  name: string;
  maxPx: number;
  flagSize: FlagSize;
  flagScale: number;
  gapScale: number;
  lang: 'en' | 'zh';
}) {
  const gap = `calc(clamp(0.25rem, 0.8vw, 0.75rem) * ${gapScale})`;
  const displayName = TEAM_NAMES[name]?.[lang] ?? name;

  return (
    <div className="flex min-w-0 w-full flex-col items-center" style={{ gap }}>
      <CountryFlag team={name} size={flagSize} scale={flagScale} />
      <AnimatePresence mode="wait">
        <motion.div
          key={lang}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <AutoShrinkText
            text={displayName}
            maxPx={maxPx}
            minPx={12}
            className="min-w-0 w-full text-center font-black leading-none"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function TableTeamBlock({
  team,
  maxTeamPx,
  flagSize,
  flagScale,
  contentScale,
  lang,
  reverse = false,
}: {
  team: string;
  maxTeamPx: number;
  flagSize: FlagSize;
  flagScale: number;
  contentScale: number;
  lang: 'en' | 'zh';
  reverse?: boolean;
}) {
  const displayName = TEAM_NAMES[team]?.[lang] ?? team;
  return (
    <div
      className={`flex min-w-0 flex-1 items-center justify-center ${reverse ? 'flex-row-reverse' : 'flex-row'}`}
      style={{ gap: `calc(clamp(0.25rem, 0.8vw, 0.75rem) * ${contentScale})` }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={lang}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-w-0 flex-1 flex"
          style={{ justifyContent: reverse ? 'flex-start' : 'flex-end' }}
        >
          <AutoShrinkText
            text={displayName}
            maxPx={maxTeamPx}
            minPx={9}
            className={`min-w-0 font-black leading-none ${reverse ? 'text-left' : 'text-right'}`}
          />
        </motion.div>
      </AnimatePresence>
      <CountryFlag team={team} size={flagSize} scale={flagScale} className="shrink-0" />
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
  lang,
}: {
  team1: string;
  team2: string;
  finished: boolean;
  maxTeamPx: number;
  flagSize: FlagSize;
  flagScale: number;
  contentScale: number;
  lang: 'en' | 'zh';
}) {
  return (
    <div
      className="flex min-w-0 items-center justify-center w-full"
      style={{ gap: `calc(clamp(0.25rem, 1vw, 1rem) * ${contentScale})` }}
    >
      <TableTeamBlock
        team={team1}
        maxTeamPx={maxTeamPx}
        flagSize={flagSize}
        flagScale={flagScale}
        contentScale={contentScale}
        lang={lang}
      />
      <AnimatePresence mode="wait">
        <motion.span
          key={lang}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0 font-bold text-muted-foreground whitespace-nowrap"
          style={{
            paddingInline: `calc(clamp(0.1rem, 0.5vw, 0.4rem) * ${contentScale})`,
            fontSize: scaledFont(10, 1.5, 24, contentScale),
          }}
        >
          {DICT[lang].vs}
        </motion.span>
      </AnimatePresence>
      <TableTeamBlock
        team={team2}
        maxTeamPx={maxTeamPx}
        flagSize={flagSize}
        flagScale={flagScale}
        contentScale={contentScale}
        lang={lang}
        reverse
      />
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

  const [lang, setLang] = useState<'en' | 'zh'>('en');
  useEffect(() => {
    const id = setInterval(() => setLang((l) => (l === 'en' ? 'zh' : 'en')), 20000);
    return () => clearInterval(id);
  }, []);

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
  const countdownText = activeStart && !isLive ? formatCountdownShort(activeStart - now, lang) : '';

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
          <AnimatePresence mode="wait">
            <motion.span 
              key={lang}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 animate-pulse text-[clamp(0.75rem,2.5vw,1.125rem)] font-bold tracking-[0.25em] text-amber-500 sm:tracking-[0.3em]"
            >
              {DICT[lang].waiting}
            </motion.span>
          </AnimatePresence>
        </div>
      ) : (
        <div className="box-border flex min-h-0 w-full max-w-full flex-1 flex-col gap-[clamp(0.5rem,1.5vh,1.5rem)] overflow-hidden">
          {activeMatch && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMatch.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  boxShadow: ['0 0 10px rgba(245,158,11,0.1)', '0 0 25px rgba(245,158,11,0.3)', '0 0 10px rgba(245,158,11,0.1)']
                }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ 
                  opacity: { duration: 0.45, ease: 'easeOut' },
                  y: { duration: 0.45, ease: 'easeOut' },
                  boxShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                }}
                className="relative box-border w-full min-w-0 shrink-0 overflow-hidden rounded-[clamp(1rem,3vw,2.5rem)] border-2 border-amber-500/40 bg-[hsl(222_47%_4%)]/95"
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
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={lang}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center"
                      >
                        {isLive ? (
                          <span
                            className="mb-2 flex items-center gap-2 rounded-full bg-red-600 px-[clamp(0.75rem,2.5vw,1.5rem)] py-[clamp(0.35rem,0.8vh,0.5rem)] font-black uppercase tracking-[0.2em] text-white sm:tracking-[0.35em]"
                            style={{ fontSize: scaledFont(12, 2.2, 24, td.heroBadgeFontScale) }}
                          >
                            <span className="h-[clamp(0.4rem,1vw,0.75rem)] w-[clamp(0.4rem,1vw,0.75rem)] animate-pulse rounded-full bg-white" />
                            {DICT[lang].liveNow}
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
                            {DICT[lang].nextMatch} {countdownText && `| ${countdownText}`}
                          </motion.span>
                        )}
                        <span
                          className="whitespace-nowrap font-black uppercase tracking-[0.12em] text-foreground text-center"
                          style={{ fontSize: scaledFont(21, 4.5, 66, td.heroCenterFontScale * 0.675) }}
                        >
                          {DICT[lang].promoBonus}
                        </span>
                        <span
                          className="whitespace-nowrap font-black uppercase tracking-[0.12em] text-amber-400 mt-0.5 text-center"
                          style={{ fontSize: scaledFont(21, 4.5, 66, td.heroCenterFontScale * 0.675) }}
                        >
                          {DICT[lang].betAndWin}
                        </span>
                      </motion.div>
                    </AnimatePresence>
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
                        lang={lang}
                      />
                    </div>

                    <div
                      className="flex shrink-0 flex-col items-center justify-center scale-80"
                      style={{ paddingInline: `calc(clamp(0.15rem, 0.6vw, 1rem) * ${td.heroGapScale})` }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={lang}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col items-center justify-center relative"
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
                              className="whitespace-nowrap font-black leading-none bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent relative overflow-hidden"
                              style={{ fontSize: scaledFont(28, 7, 96, td.heroCenterFontScale) }}
                            >
                              {DICT[lang].prize(activeMatch.prize)}
                              {/* Shimmer effect overlay */}
                              <motion.div 
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-12"
                                animate={{ x: ['-150%', '150%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                                style={{ mixBlendMode: 'overlay' }}
                              />
                            </span>
                            <span
                              className="whitespace-nowrap font-black leading-none bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-200 bg-clip-text text-transparent mt-1 relative overflow-hidden"
                              style={{ fontSize: scaledFont(28, 7, 96, td.heroCenterFontScale) }}
                            >
                              {DICT[lang].prize2}
                              {/* Shimmer effect overlay */}
                              <motion.div 
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-12"
                                animate={{ x: ['-150%', '150%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                                style={{ mixBlendMode: 'overlay' }}
                              />
                            </span>
                          </motion.div>
                        </motion.div>
                      </AnimatePresence>
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
                        lang={lang}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {rest.length > 0 && (
            <motion.div 
              className="box-border flex min-h-0 w-full min-w-0 max-w-full flex-1 flex-col overflow-hidden rounded-[clamp(0.75rem,2vw,1.5rem)] border-2 border-amber-500/40 bg-[hsl(222_47%_5%)]/90 mb-2 mx-auto"
              animate={{ boxShadow: ['0 0 10px rgba(245,158,11,0.1)', '0 0 25px rgba(245,158,11,0.3)', '0 0 10px rgba(245,158,11,0.1)'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden overflow-x-auto">
                <table className="flex h-full min-h-0 w-full min-w-full flex-1 flex-col table-fixed border-collapse">
                  <colgroup>
                    <col style={{ width: '25%' }} />
                    <col style={{ width: '50%' }} />
                    <col style={{ width: '25%' }} />
                  </colgroup>
                  <thead className="shrink-0">
                    <tr className="table w-full table-fixed border-b-2 border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-500/15 uppercase text-amber-400">
                      {(['date', 'match', 'time'] as const).map((key) => (
                        <th
                          key={key}
                          className="font-black tracking-[0.06em] sm:tracking-[0.12em] text-[12px] sm:text-xs text-center"
                          style={rowPad}
                        >
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={lang}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              {DICT[lang][key]}
                            </motion.span>
                          </AnimatePresence>
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
                          <td className="min-w-0 align-middle" style={rowPad}>
                            <TableMatchCell
                              team1={m.team1}
                              team2={m.team2}
                              finished={finished}
                              maxTeamPx={rowTeamMaxPx}
                              flagSize={td.tableFlagSize}
                              flagScale={rowFlagScale}
                              contentScale={rowFillScale}
                              lang={lang}
                            />
                          </td>
                          <td
                            className="whitespace-nowrap align-middle text-center font-black text-amber-500"
                            style={{ ...rowPad, fontSize: scaledFont(11, 2.2, 36, rowMetaScale) }}
                          >
                            {timeLabel(m)}
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
            </motion.div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
