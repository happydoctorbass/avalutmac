export type SportType = 'football' | 'tennis' | 'basketball' | 'hockey';

export interface Match {
  id: string;
  sportType: SportType;
  team1: string;
  team2: string;
  time: string;
  score?: string; // e.g. "2:1"
  winner?: string; // team name of the winner
  finished?: boolean; // true если матч уже сыгран
  guestBetMessage?: string; // "Гость с ID #1234 победил, сделав ставку"
  bishkek?: {
    date_bishkek: string;
    time_bishkek: string;
  };
}

export interface CasinoSettings {
  cardCount: number;
  cardScale: number;
  rotateInterval: number; // seconds between auto-rotation
  autoRotate: boolean;
  tableDisplay: TableDisplaySettings;
}

export type FlagSize = 'sm' | 'md' | 'lg' | 'xl';

export interface TableDisplaySettings {
  /** Column widths (%), should sum to ~100 */
  colDate: number;
  colTime: number;
  colMatch: number;
  colScore: number;
  colResult: number;
  /** Table typography & spacing */
  tableTeamFontScale: number;
  tableMetaFontScale: number;
  tableHeaderFontScale: number;
  tableCellPaddingScale: number;
  tableFlagSize: FlagSize;
  tableFlagScale: number;
  /** Hero (active match) block */
  heroTeamFontScale: number;
  heroFlagSize: FlagSize;
  heroFlagScale: number;
  heroCenterFontScale: number;
  heroBadgeFontScale: number;
  heroCountdownFontScale: number;
  heroPaddingScale: number;
  heroGapScale: number;
  /** Pagination */
  pageSize: number;
  pageIntervalSec: number;
  /** Layout */
  narrowBreakpoint: number;
  safeInsetScale: number;
  /** Auto-scale row content when fewer matches visible (fills empty space) */
  tableRowFillEnabled: boolean;
  /** Row count at fill scale 1.0 (e.g. 6 = designed for 6 rows) */
  tableRowFillBaseline: number;
  /** Max multiplier when very few rows */
  tableRowFillMaxScale: number;
}

export const DEFAULT_TABLE_DISPLAY: TableDisplaySettings = {
  colDate: 6,
  colTime: 7,
  colMatch: 62,
  colScore: 8,
  colResult: 17,
  tableTeamFontScale: 1.15,
  tableMetaFontScale: 1,
  tableHeaderFontScale: 1,
  tableCellPaddingScale: 0.65,
  tableFlagSize: 'md',
  tableFlagScale: 1.1,
  heroTeamFontScale: 1.1,
  heroFlagSize: 'xl',
  heroFlagScale: 1.25,
  heroCenterFontScale: 1,
  heroBadgeFontScale: 1,
  heroCountdownFontScale: 1,
  heroPaddingScale: 1,
  heroGapScale: 0.85,
  pageSize: 6,
  pageIntervalSec: 8,
  narrowBreakpoint: 768,
  safeInsetScale: 1,
  tableRowFillEnabled: true,
  tableRowFillBaseline: 6,
  tableRowFillMaxScale: 3,
};

export const DEFAULT_SETTINGS: CasinoSettings = {
  cardCount: 5,
  cardScale: 1.0,
  rotateInterval: 15,
  autoRotate: true,
  tableDisplay: { ...DEFAULT_TABLE_DISPLAY },
};
