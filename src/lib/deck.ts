export type Suit = '♠' | '♣' | '♥' | '♦';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface CardData {
  suit: Suit;
  rank: Rank;
  color: 'black' | 'red';
}

export const createDeck = (): CardData[] => {
  const suits: Suit[] = ['♠', '♣', '♥', '♦'];
  const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck: CardData[] = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({
        suit,
        rank,
        color: (suit === '♥' || suit === '♦') ? 'red' : 'black'
      });
    }
  }
  return deck;
};

export const getRandomCards = (count: number): CardData[] => {
  const deck = createDeck();
  return deck.sort(() => Math.random() - 0.5).slice(0, count);
};