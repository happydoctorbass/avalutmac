import { Match } from '@/types/match';

export type HardcodedMatch = Match & { prize: string };

const rawMatches = [
  { date: '16.06', time: '01:00', team1: 'BEL', team2: 'EGV', prize: '5000 KGS' },
  { date: '17.06', time: '01:00', team1: 'FRA', team2: 'SEN', prize: '5000 KGS' },
  { date: '18.06', time: '02:00', team1: 'ENG', team2: 'CRO', prize: '5000 KGS' },
  { date: '19.06', time: '01:00', team1: 'SUI', team2: 'BIH', prize: '5000 KGS' },
  { date: '20.06', time: '01:00', team1: 'USA', team2: 'AUS', prize: '5000 KGS' },
  { date: '21.06', time: '02:00', team1: 'GER', team2: 'CIV', prize: '5000 KGS' },
  { date: '22.06', time: '01:00', team1: 'BEL', team2: 'IRN', prize: '5000 KGS' },
  { date: '23.06', time: '03:00', team1: 'FRA', team2: 'IRQ', prize: '5000 KGS' },
  { date: '24.06', time: '02:00', team1: 'ENG', team2: 'GHA', prize: '5000 KGS' },
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
