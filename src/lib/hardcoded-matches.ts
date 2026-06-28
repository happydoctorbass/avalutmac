import { Match } from '@/types/match';

export type HardcodedMatch = Match & { prize: string };

const rawMatches = [
  { date: '29.06', time: '01:00', team1: 'RSA', team2: 'CAN', prize: '5000 KGS' },
  { date: '29.06', time: '23:00', team1: 'BRA', team2: 'JPN', prize: '5000 KGS' },
  { date: '30.06', time: '02:30', team1: 'GER', team2: 'PAR', prize: '5000 KGS' },
  { date: '30.06', time: '07:00', team1: 'NED', team2: 'MAR', prize: '5000 KGS' },
  { date: '30.06', time: '23:00', team1: 'CIV', team2: 'NOR', prize: '5000 KGS' },
  { date: '01.07', time: '03:00', team1: 'FRA', team2: 'SWE', prize: '5000 KGS' },
  { date: '01.07', time: '07:00', team1: 'MEX', team2: 'ECU', prize: '5000 KGS' },
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
