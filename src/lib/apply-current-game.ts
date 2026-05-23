import { GameSetters } from '@/context/pusher-handlers';
import { GameType } from '@/types/game';

export interface CurrentGameResponse {
  active: boolean;
  session?: {
    id: string;
    finishAt: string;
    gameType: GameType;
    cardCount: number;
  };
  topBid?: { playerId: string; amount: number } | null;
}

export function applyCurrentGame(data: CurrentGameResponse, s: GameSetters) {
  if (!data.active || !data.session) return;
  s.setGameState('GAME');
  s.setSessionId(Date.now());
  s.setFinishAt(data.session.finishAt);
  s.setDbSessionId(data.session.id);
  s.setGameType(data.session.gameType);
  s.setCardCount(data.session.cardCount);
  if (data.topBid) {
    s.setPlayerId(data.topBid.playerId);
    s.setBetAmount(data.topBid.amount);
  }
  s.bumpBets();
}
