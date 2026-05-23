export type Suit = '♠' | '♣' | '♥' | '♦';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface CardData {
  suit: Suit;
  rank: Rank;
  color: 'black' | 'red';
}

export type GameStatus = 'IDLE' | 'GAME';
export type GameLanguage = 'en' | 'zh';
export type GameType = 'BACCARAT_TRIPLE' | 'NIU_NIU_TRIPLE';

export interface ToggleStatePayload {
  state: GameStatus;
  cards?: CardData[];
  playerId?: string;
  betAmount?: number;
  language?: GameLanguage;
  gameType?: GameType;
  cardCount?: number;
  finishAt?: string | null;
  sessionId?: string | null;
  fontScale?: number;
}

export interface RevealCardPayload {
  index: number;
  card?: CardData;
}

export interface NewBidPayload {
  playerId: string;
  amount: number;
  id: string;
}

export interface BetRow {
  id: string;
  session_id: string;
  player_id: string;
  amount: number;
  created_at: string;
}
