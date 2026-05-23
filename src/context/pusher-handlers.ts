import { GAME_EVENTS } from '@/lib/pusher';
import { ToggleStatePayload, RevealCardPayload, NewBidPayload, GameLanguage, BetRow } from '@/types/game';
import { triggerWinConfetti } from '@/lib/confetti-helper';

const ALL_REVEALED = [true, true, true, true, true] as const;

export type GameSetters = {
  setGameState: (s: 'IDLE' | 'GAME') => void;
  setRevealedCards: (v: boolean[] | ((p: boolean[]) => boolean[])) => void;
  setCards: (v: CardData[] | ((p: CardData[]) => CardData[])) => void;
  setSessionId: (n: string) => void;
  setPlayerId: (s: string) => void;
  setBetAmount: (n: number) => void;
  setLanguage: (l: GameLanguage) => void;
  setGameType: (t: import('@/types/game').GameType) => void;
  setCardCount: (n: number) => void;
  setFinishAt: (s: string | null) => void;
  addBet: (b: BetRow) => void;
  removeBet: (id: string) => void;
  clearBets: () => void;
};

type CardData = import('@/types/game').CardData;

export function createPusherHandlers(s: GameSetters) {
  const onToggle = (d: ToggleStatePayload) => {
    s.setGameState(d.state);
    s.setRevealedCards([false, false, false, false, false]);
    if (d.state === 'IDLE') {
      s.setCards([]);
      s.setPlayerId('');
      s.setBetAmount(0);
      s.setFinishAt(null);
      s.setSessionId('');
    } else {
      s.setSessionId(d.sessionId || Date.now().toString());
      if (d.cards) s.setCards(d.cards);
      if (d.playerId) s.setPlayerId(d.playerId);
      if (d.betAmount !== undefined) s.setBetAmount(d.betAmount);
      if (d.language) s.setLanguage(d.language);
      if (d.gameType) s.setGameType(d.gameType);
      if (d.cardCount) s.setCardCount(d.cardCount);
      if (d.finishAt) s.setFinishAt(d.finishAt);
    }
  };

  const onReveal = (d: RevealCardPayload) => {
    s.setRevealedCards((p) => { const n = [...p]; n[d.index] = true; return n; });
    if (d.card) s.setCards((p) => { const n = [...p]; n[d.index] = d.card!; return n; });
  };

  const onBid = (d: NewBidPayload) => {
    s.setPlayerId(d.playerId);
    s.setBetAmount(d.amount);
    s.addBet({
      id: d.id,
      session_id: 'local',
      player_id: d.playerId,
      amount: d.amount,
      created_at: new Date().toISOString(),
    });
  };

  const onCancelBid = (d: { betId: string }) => {
    s.removeBet(d.betId);
  };

  return {
    [GAME_EVENTS.TOGGLE_STATE]: onToggle,
    [GAME_EVENTS.REVEAL_CARD]: onReveal,
    [GAME_EVENTS.REVEAL_ALL]: () => s.setRevealedCards([...ALL_REVEALED]),
    [GAME_EVENTS.CELEBRATE]: () => triggerWinConfetti(),
    [GAME_EVENTS.UPDATE_LANG]: (d: { language: GameLanguage }) => s.setLanguage(d.language),
    [GAME_EVENTS.NEW_BID]: onBid,
    [GAME_EVENTS.CANCEL_BID]: onCancelBid,
  };
}
