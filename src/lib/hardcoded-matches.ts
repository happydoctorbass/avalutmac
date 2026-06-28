import { Match } from '@/types/match';

export type HardcodedMatch = Match & { prize: string };

const rawMatches = [
  { date: '29.06', time: '01:00', team1: 'CAN', team2: 'RSA', prize: '5000 KGS' },
  { date: '29.06', time: '23:00', team1: 'BRA', team2: 'SWE', prize: '5000 KGS' },
  { date: '30.06', time: '02:30', team1: 'GER', team2: 'MEX', prize: '5000 KGS' },
  { date: '30.06', time: '07:00', team1: 'NED', team2: 'SCO', prize: '5000 KGS' },
  { date: '30.06', time: '23:00', team1: 'FRA', team2: 'PAR', prize: '5000 KGS' },
  { date: '01.07', time: '04:00', team1: 'CIV', team2: 'NOR', prize: '5000 KGS' },
  { date: '01.07', time: '07:00', team1: 'CZE', team2: 'TUR', prize: '5000 KGS' },
  { date: '01.07', time: '22:00', team1: 'ENG', team2: 'USA', prize: '5000 KGS' },
  { date: '02.07', time: '03:00', team1: 'AUS', team2: 'ESP', prize: '5000 KGS' },
  { date: '02.07', time: '07:00', team1: 'BEL', team2: 'ARG', prize: '5000 KGS' },
  { date: '02.07', time: '23:00', team1: 'URU', team2: 'JOR', prize: '5000 KGS' },
  { date: '03.07', time: '05:00', team1: 'POR', team2: 'CRO', prize: '5000 KGS' },
  { date: '03.07', time: '09:00', team1: 'SUI', team2: 'EGV', prize: '5000 KGS' },
  { date: '03.07', time: '23:00', team1: 'ECU', team2: 'IRN', prize: '5000 KGS' },
  { date: '04.07', time: '04:00', team1: 'ALG', team2: 'CPV', prize: '5000 KGS' },
  { date: '04.07', time: '08:30', team1: 'UZB', team2: 'SEN', prize: '5000 KGS' },
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
