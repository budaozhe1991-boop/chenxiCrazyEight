export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface CardData {
  id: string;
  suit: Suit;
  rank: Rank;
}

export type GameStatus = 'waiting' | 'playing' | 'picking_suit' | 'game_over';
export type PlayerId = 'player' | 'ai1' | 'ai2' | 'ai3';

export interface GameState {
  deck: CardData[];
  playerHand: CardData[];
  aiHands: Record<string, CardData[]>;
  discardPile: CardData[];
  currentTurn: PlayerId;
  wildSuit: Suit | null;
  status: GameStatus;
  winner: PlayerId | null;
  lastAction: string;
  playerCount: 2 | 4;
}
