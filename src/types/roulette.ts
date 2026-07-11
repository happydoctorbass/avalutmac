export interface RouletteBet {
  id?: string;
  player_id: string;
  number: number;
  /** Chip color hex — stored as `player_color` in Supabase */
  color: string;
  player_color?: string | null;
  is_promo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Player {
  player_id: string;
  bets: RouletteBet[];
}

export interface RouletteCell {
  number: number;
  color: 'red' | 'black' | 'green';
  isAction: boolean; // 0, 8, 17, 23, 29
}

export const ACTION_NUMBERS = [0, 8, 17, 23, 29];

export const ROULETTE_NUMBERS: RouletteCell[] = [
  { number: 0, color: 'green', isAction: true },
  ...Array.from({ length: 36 }, (_, i) => {
    const num = i + 1;
    // Standard European Roulette colors
    const isRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(num);
    return {
      number: num,
      color: (isRed ? 'red' : 'black') as 'red' | 'black',
      isAction: ACTION_NUMBERS.includes(num)
    };
  })
];

export const CHIP_COLORS = [
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#f59e0b', // amber-500
  '#84cc16', // yellow-500
  '#22c55e', // lime-500
  '#10b981', // emerald-500
  '#06b6d4', // teal-500
  '#3b82f6', // cyan-500
  '#a855f7', // purple-500
  '#ec4899', // pink-500
];
