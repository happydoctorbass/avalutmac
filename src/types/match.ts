export type SportType = 'football' | 'tennis' | 'basketball' | 'hockey';

export interface Match {
  id: string;
  sportType: SportType;
  team1: string;
  team2: string;
  time: string;
  score?: string; // e.g. "2:1"
  winner?: string; // team name of the winner
}

export interface CasinoSettings {
  cardCount: number;
  cardScale: number;
  rotateInterval: number; // seconds between auto-rotation
  autoRotate: boolean;
}

export const DEFAULT_SETTINGS: CasinoSettings = {
  cardCount: 5,
  cardScale: 1.0,
  rotateInterval: 15,
  autoRotate: true,
};
