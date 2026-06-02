export type SportType = 'football' | 'tennis' | 'basketball' | 'hockey';

export interface Match {
  id: string;
  sportType: SportType;
  team1: string;
  team2: string;
  time: string;
}
