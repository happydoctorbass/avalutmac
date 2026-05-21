export type Suit = '♠' | '♣' | '♥' | '♦';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface CardData {
  suit: Suit;
  rank: Rank;
  color: 'black' | 'red';
}

export type GameStatus = 'IDLE' | 'GAME';

export interface ToggleStatePayload {
  state: GameStatus;
  cards?: CardData[];
  playerId?: string;
  betAmount?: number;
}

export interface RevealCardPayload {
  index: number;
  card?: CardData;
}
