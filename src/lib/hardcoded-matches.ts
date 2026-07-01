import { Match } from '@/types/match';

export type HardcodedMatch = Match & { prize: string };

const rawMatches = [
  { date: '01.07', time: '22:00', team1: 'ENG', team2: 'COD', prize: '5000 KGS' },
  { date: '02.07', time: '03:00', team1: 'USA', team2: 'BIH', prize: '5000 KGS' },
  { date: '02.07', time: '02:00', team1: 'BEL', team2: 'SEN', prize: '5000 KGS' },
  { date: '03.07', time: '05:00', team1: 'POR', team2: 'CRO', prize: '5000 KGS' },
  { date: '03.07', time: '01:00', team1: 'ESP', team2: 'AUT', prize: '5000 KGS' },
  { date: '03.07', time: '09:00', team1: 'SUI', team2: 'ALG', prize: '5000 KGS' },
  { date: '04.07', time: '04:00', team1: 'ARG', team2: 'CPV', prize: '5000 KGS' },
  { date: '04.07', time: '07:30', team1: 'COL', team2: 'GHA', prize: '5000 KGS' },
  { date: '04.07', time: '00:00', team1: 'AUS', team2: 'EGV', prize: '5000 KGS' },
  { date: '05.07', time: '03:00', team1: 'PAR', team2: 'FRA', prize: '5000 KGS' },
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
