import { Match } from '@/types/match';

/** Live window after kickoff (minutes × ms) — same as display board */
export const LIVE_WINDOW_MS = 130 * 60 * 1000;

export function getMatchStartMs(m: Match): number | null {
  if (m.bishkek?.date_bishkek && m.bishkek?.time_bishkek) {
    const [Y, Mo, D] = m.bishkek.date_bishkek.split('-').map(Number);
    const [H, Mi] = m.bishkek.time_bishkek.split(':').map(Number);
    if ([Y, Mo, D, H, Mi].every((n) => !Number.isNaN(n))) {
      return Date.UTC(Y, Mo - 1, D, H, Mi) - 6 * 3600 * 1000;
    }
  }
  return null;
}

export function isMatchFinished(m: Match, now = Date.now()): boolean {
  if (m.finished || m.score || m.winner) return true;
  const start = getMatchStartMs(m);
  if (start !== null && now > start + LIVE_WINDOW_MS) return true;
  return false;
}

export function isMatchLive(m: Match, now = Date.now()): boolean {
  const start = getMatchStartMs(m);
  if (start === null) return false;
  return now >= start && now <= start + LIVE_WINDOW_MS;
}

/** Live now or scheduled in the future */
export function isMatchActive(m: Match, now = Date.now()): boolean {
  if (isMatchFinished(m, now)) return false;
  const start = getMatchStartMs(m);
  if (start === null) return !m.finished && !m.score;
  return now <= start + LIVE_WINDOW_MS;
}

export function filterActiveMatches(matches: Match[], now = Date.now()): Match[] {
  return matches.filter((m) => isMatchActive(m, now));
}
