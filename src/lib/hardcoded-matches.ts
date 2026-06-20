import { Match } from '@/types/match';

export type HardcodedMatch = Match & { prize: string };

const rawMatches = [
  { date: '22.06', time: '01:00', team1: 'BEL', team2: 'IRN', prize: '5000 KGS' },
  { date: '23.06', time: '03:00', team1: 'FRA', team2: 'IRQ', prize: '5000 KGS' },
  { date: '24.06', time: '02:00', team1: 'ENG', team2: 'GHA', prize: '5000 KGS' },
  { date: '25.06', time: '01:00', team1: 'SUI', team2: 'CAN', prize: '10000 KGS' },
  { date: '25.06', time: '01:00', team1: 'BIH', team2: 'QAT', prize: '10000 KGS' },
  { date: '26.06', time: '02:00', team1: 'ECU', team2: 'GER', prize: '10000 KGS' },
  { date: '26.06', time: '02:00', team1: 'CUW', team2: 'CIV', prize: '10000 KGS' },
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
