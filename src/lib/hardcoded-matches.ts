import { Match } from '@/types/match';

export type HardcodedMatch = Match & { prize: string };

const rawMatches = [
  { date: '04.07', time: '00:00', team1: 'AUS', team2: 'EGV', prize: '5000 KGS' },
  { date: '04.07', time: '04:00', team1: 'ARG', team2: 'CPV', prize: '5000 KGS' },
  { date: '04.07', time: '07:30', team1: 'COL', team2: 'GHA', prize: '5000 KGS' },
  { date: '04.07', time: '23:00', team1: 'CAN', team2: 'MAR', prize: '5000 KGS' },
  { date: '06.07', time: '02:00', team1: 'BRA', team2: 'NOR', prize: '5000 KGS' },
  { date: '06.07', time: '06:00', team1: 'MEX', team2: 'ENG', prize: '5000 KGS' },
  { date: '07.07', time: '01:00', team1: 'POR', team2: 'ESP', prize: '5000 KGS' },
  { date: '07.07', time: '06:00', team1: 'USA', team2: 'BEL', prize: '5000 KGS' },
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
