'use client';

import { motion } from 'framer-motion';
import { Match } from '@/types/match';
import { useCasinoMatches } from '../hooks/useCasinoMatches';

function dateLabel(m: Match) {
  if (m.bishkek) {
    const parts = m.bishkek.date_bishkek.split('-');
    if (parts.length === 3) {
      const [, mm, dd] = parts;
      return `${dd}.${mm}`;
    }
    return m.bishkek.date_bishkek;
  }
  if (m.time?.includes('T')) {
    const [d] = m.time.split('T');
    const parts = d.split('-');
    if (parts.length === 3) {
      const [, mm, dd] = parts;
      return `${dd}.${mm}`;
    }
  }
  return '';
}

function timeLabel(m: Match) {
  if (m.bishkek?.time_bishkek) return m.bishkek.time_bishkek;
  if (m.time?.includes('T')) return m.time.split('T')[1]?.slice(0, 5) ?? m.time;
  return m.time ?? '';
}

export default function CasinoDisplayTablePage() {
  const { matches } = useCasinoMatches();

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
      <div className="relative z-50 mt-8 mb-6 shrink-0">
        <motion.img
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          src="/logo/admiral.svg"
          alt="Admiral Casino"
          className="h-16 w-auto drop-shadow-[0_0_18px_rgba(245,158,11,0.25)] md:h-20"
        />
      </div>

      {/* Table */}
      <div className="relative z-10 flex w-full flex-1 items-start justify-center overflow-hidden px-6 pb-10">
        {matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-24">
            <img
              src="/logo/main.svg"
              alt="Admiral"
              className="h-24 w-auto opacity-90 drop-shadow-[0_0_18px_rgba(197,160,89,0.45)]"
            />
            <span className="mt-6 animate-pulse text-lg font-bold tracking-[0.3em] text-amber-500">
              ОЖИДАНИЕ МАТЧЕЙ...
            </span>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-6xl overflow-hidden rounded-3xl border border-amber-500/30 bg-[hsl(222_47%_5%)]/90 shadow-[0_0_40px_rgba(245,158,11,0.12)] backdrop-blur-md"
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-amber-500/30 bg-amber-500/10 text-left text-sm font-bold uppercase tracking-[0.2em] text-amber-500">
                  <th className="px-6 py-4">Дата</th>
                  <th className="px-6 py-4">Время</th>
                  <th className="px-6 py-4">Матч</th>
                  <th className="px-6 py-4 text-center">Счёт</th>
                  <th className="px-6 py-4">Результат</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m, i) => {
                  const finished = Boolean(m.finished || m.score || m.winner);
                  return (
                    <tr
                      key={m.id}
                      className={`border-b border-border/40 text-foreground ${
                        i % 2 === 0 ? 'bg-white/[0.02]' : ''
                      } ${finished ? 'opacity-80' : ''}`}
                    >
                      <td className="whitespace-nowrap px-6 py-5 text-xl font-semibold text-muted-foreground">
                        {dateLabel(m)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-2xl font-black text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]">
                        {timeLabel(m)}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3 text-2xl font-black md:text-3xl">
                          <span>{m.team1}</span>
                          <span className="text-base font-bold text-muted-foreground">VS</span>
                          <span>{m.team2}</span>
                        </div>
                        {finished && (
                          <span className="mt-1 inline-block rounded-full border border-muted-foreground/40 bg-muted/40 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                            Завершён
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-center text-3xl font-black tracking-wider">
                        {m.score ?? '—'}
                      </td>
                      <td className="px-6 py-5">
                        {m.winner ? (
                          <span
                            className={`text-lg font-bold uppercase tracking-wide ${
                              m.winner === 'Ничья' ? 'text-muted-foreground' : 'text-amber-500'
                            }`}
                          >
                            {m.winner === 'Ничья' ? 'Ничья' : m.winner}
                          </span>
                        ) : (
                          <span className="text-lg font-semibold uppercase tracking-wide text-emerald-400">
                            Скоро
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  );
}