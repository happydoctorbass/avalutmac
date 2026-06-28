import { Match } from '@/types/match';

export type HardcodedMatch = Match & { prize: string };

const rawMatches = [
  { date: '22.06', time: '01:00', team1: 'BEL', team2: 'IRN', prize: '5000 KGS' },
  { date: '23.06', time: '03:00', team1: 'FRA', team2: 'IRQ', prize: '5000 KGS' },
  { date: '24.06', time: '02:00', team1: 'ENG', team2: 'GHA', prize: '5000 KGS' },
  { date: '25.06', time: '01:00', team1: 'SUI', team2: 'CAN', prize: '5000 KGS' },
  { date: '25.06', time: '01:00', team1: 'BIH', team2: 'QAT', prize: '5000 KGS' },
  { date: '26.06', time: '02:00', team1: 'ECU', team2: 'GER', prize: '5000 KGS' },
  { date: '26.06', time: '02:00', team1: 'CUW', team2: 'CIV', prize: '5000 KGS' },
  { date: '26.06', time: '05:00', team1: 'JPN', team2: 'SWE', prize: '5000 KGS' },
  { date: '26.06', time: '05:00', team1: 'TUN', team2: 'NED', prize: '5000 KGS' },
  { date: '26.06', time: '08:00', team1: 'PAR', team2: 'AUS', prize: '5000 KGS' },
  { date: '26.06', time: '08:00', team1: 'TUR', team2: 'USA', prize: '5000 KGS' },
  { date: '27.06', time: '01:00', team1: 'NOR', team2: 'FRA', prize: '5000 KGS' },
  { date: '27.06', time: '01:00', team1: 'SEN', team2: 'IRQ', prize: '5000 KGS' },
  { date: '27.06', time: '06:00', team1: 'URU', team2: 'ESP', prize: '5000 KGS' },
  { date: '27.06', time: '06:00', team1: 'CPV', team2: 'KSA', prize: '5000 KGS' },
  { date: '27.06', time: '09:00', team1: 'NZL', team2: 'BEL', prize: '5000 KGS' },
  { date: '27.06', time: '09:00', team1: 'EGV', team2: 'IRN', prize: '5000 KGS' },
  { date: '28.06', time: '03:00', team1: 'PAN', team2: 'ENG', prize: '5000 KGS' },
  { date: '28.06', time: '03:00', team1: 'CRO', team2: 'GHA', prize: '5000 KGS' },
  { date: '28.06', time: '05:30', team1: 'COL', team2: 'POR', prize: '5000 KGS' },
  { date: '28.06', time: '05:30', team1: 'COD', team2: 'UZB', prize: '5000 KGS' },
  { date: '28.06', time: '08:00', team1: 'JOR', team2: 'ARG', prize: '5000 KGS' },
  { date: '28.06', time: '08:00', team1: 'ALG', team2: 'AUT', prize: '5000 KGS' },
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
