import { Match } from '@/types/match';

export type HardcodedMatch = Match & { prize: string };

const rawMatches = [
  { date: '10.07', time: '02:00', team1: 'FRA', team2: 'MAR', prize: '5000 KGS' },
  { date: '11.07', time: '01:00', team1: 'ESP', team2: 'BEL', prize: '5000 KGS' },
  { date: '12.07', time: '03:00', team1: 'NOR', team2: 'ENG', prize: '5000 KGS' },
  { date: '12.07', time: '07:00', team1: 'ARG', team2: 'SUI', prize: '5000 KGS' },
];

export const HARDCODED_MATCHES: HardcodedMatch[] = rawMatches.map((m, i) => {
  const [day, month] = m.date.split('.');
  const date_bishkek = `2026-${month}-${day}`;
  return {
    id: `hardcoded-${i}`,
    sportType: 'football',
    team1: m.team1,
    team2: m.team2,
    time: `${date_bishkek}T${m.time}:00`,
    bishkek: {
      date_bishkek,
      time_bishkek: m.time,
    },
    prize: m.prize,
  };
});
