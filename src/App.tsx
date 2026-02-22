/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  RotateCcw, 
  User, 
  Cpu, 
  AlertCircle,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  CardData, 
  Suit, 
  GameStatus, 
  PlayerType, 
  GameState 
} from './types';
import { 
  createDeck, 
  canPlayCard, 
  SUIT_SYMBOLS, 
  SUIT_COLORS, 
  SUITS 
} from './constants';

interface CardProps {
  card?: CardData;
  onClick?: () => void;
  isFaceDown?: boolean;
  isPlayable?: boolean;
  className?: string;
  key?: React.Key;
}

const Card = ({ 
  card, 
  onClick, 
  isFaceDown = false, 
  isPlayable = false,
  className = "" 
}: CardProps) => {
  if (isFaceDown) {
    return (
      <motion.div
        layout
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`relative w-16 h-24 sm:w-24 sm:h-36 bg-indigo-800 rounded-lg border-2 border-white/30 shadow-lg flex items-center justify-center overflow-hidden ${className}`}
      >
        {/* 彩色花格背景 */}
        <div className="absolute inset-0 opacity-40" 
          style={{
            backgroundImage: `
              repeating-conic-gradient(#ff4e50 0% 25%, #f9d423 0% 50%) 
            `,
            backgroundSize: '20px 20px'
          }}
        />
        <div className="absolute inset-0 opacity-30" 
          style={{
            backgroundImage: `
              repeating-conic-gradient(transparent 0% 25%, #4facfe 0% 50%) 
            `,
            backgroundPosition: '10px 10px',
            backgroundSize: '20px 20px'
          }}
        />
        
        <div className="absolute inset-2 border-2 border-white/20 rounded-md flex items-center justify-center bg-indigo-900/40 backdrop-blur-[1px]">
          <span className="text-white font-black text-2xl sm:text-4xl drop-shadow-lg">T</span>
        </div>
      </motion.div>
    );
  }

  if (!card) return null;

  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={isPlayable ? { y: -10, scale: 1.05 } : {}}
      onClick={isPlayable ? onClick : undefined}
      className={`relative w-16 h-24 sm:w-24 sm:h-36 bg-white rounded-lg border-2 ${
        isPlayable ? 'border-yellow-400 cursor-pointer shadow-yellow-400/50' : 'border-slate-200'
      } shadow-xl flex flex-col p-0 select-none ${className}`}
    >
      <div className={`flex flex-col items-start leading-none pt-0.5 sm:pt-1 pl-1 sm:pl-1.5 ${SUIT_COLORS[card.suit]}`}>
        <span className="text-sm sm:text-lg font-bold">{card.rank}</span>
        <span className="text-[10px] sm:text-xs -mt-1">{SUIT_SYMBOLS[card.suit]}</span>
      </div>
      <div className={`flex-1 flex items-center justify-center text-2xl sm:text-5xl ${SUIT_COLORS[card.suit]}`}>
        {SUIT_SYMBOLS[card.suit]}
      </div>
      <div className={`flex flex-col items-end leading-none pb-0.5 sm:pb-1 pr-1 sm:pr-1.5 ${SUIT_COLORS[card.suit]}`}>
        <span className="text-sm sm:text-lg font-bold">{card.rank}</span>
        <span className="text-[10px] sm:text-xs -mt-1">{SUIT_SYMBOLS[card.suit]}</span>
      </div>
    </motion.div>
  );
};

const SuitPicker = ({ onSelect }: { onSelect: (suit: Suit) => void }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
      >
        <h2 className="text-2xl font-bold mb-6 text-slate-800">选择新的花色</h2>
        <div className="grid grid-cols-2 gap-4">
          {SUITS.map((suit) => (
            <button
              key={suit}
              onClick={() => onSelect(suit)}
              className={`p-6 rounded-2xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all flex flex-col items-center gap-2 group`}
            >
              <span className={`text-4xl ${SUIT_COLORS[suit]}`}>{SUIT_SYMBOLS[suit]}</span>
              <span className="text-sm font-medium text-slate-600 uppercase tracking-wider group-hover:text-indigo-600">
                {suit === 'hearts' ? '红心' : suit === 'diamonds' ? '方块' : suit === 'clubs' ? '梅花' : '黑桃'}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const GameOverModal = ({ winner, onRestart }: { winner: PlayerType | null; onRestart: () => void }) => {
  const isPlayerWinner = winner === 'player';
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-10 max-w-sm w-full shadow-2xl text-center"
      >
        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${
          isPlayerWinner ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-600'
        }`}>
          <Trophy size={40} />
        </div>
        <h2 className="text-3xl font-black mb-2 text-slate-800">
          {isPlayerWinner ? '恭喜获胜！' : '遗憾落败'}
        </h2>
        <p className="text-slate-500 mb-8">
          {isPlayerWinner ? '你打败了 AI，成为了 8 点之王！' : 'AI 这次更胜一筹，再接再厉。'}
        </p>
        <button
          onClick={onRestart}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
        >
          <RotateCcw size={20} />
          再玩一局
        </button>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [state, setState] = useState<GameState>({
    deck: [],
    playerHand: [],
    aiHand: [],
    discardPile: [],
    currentTurn: 'player',
    wildSuit: null,
    status: 'waiting',
    winner: null,
    lastAction: '欢迎来到 陈熙超级疯狂 8 点！'
  });

  const [pendingEight, setPendingEight] = useState<boolean>(false);

  // Initialize game
  const initGame = useCallback(() => {
    const fullDeck = createDeck();
    const playerHand = fullDeck.splice(0, 8);
    const aiHand = fullDeck.splice(0, 8);
    
    // Ensure first discard is not an 8
    let firstDiscardIndex = 0;
    while (fullDeck[firstDiscardIndex].rank === '8') {
      firstDiscardIndex++;
    }
    const discardPile = [fullDeck.splice(firstDiscardIndex, 1)[0]];

    setState({
      deck: fullDeck,
      playerHand,
      aiHand,
      discardPile,
      currentTurn: 'player',
      wildSuit: null,
      status: 'playing',
      winner: null,
      lastAction: '游戏开始！你的回合。'
    });
    setPendingEight(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const topCard = state.discardPile.length > 0 ? state.discardPile[state.discardPile.length - 1] : null;

  // AI Turn Logic
  useEffect(() => {
    if (state.status === 'playing' && state.currentTurn === 'ai' && topCard) {
      const timer = setTimeout(() => {
        handleAiTurn();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.status, state.currentTurn, topCard]);

  const handleAiTurn = () => {
    if (!topCard) return;
    const playableCards = state.aiHand.filter(card => canPlayCard(card, topCard, state.wildSuit));
    
    // 降低难度逻辑：30% 的概率 AI 即使有牌也会选择摸牌（犯错）
    const makeMistake = Math.random() < 0.3;

    if (playableCards.length > 0 && !makeMistake) {
      // 随机选择一张可出的牌，而不是优先不出 8
      const cardToPlay = playableCards[Math.floor(Math.random() * playableCards.length)];
      playCard('ai', cardToPlay);
    } else if (state.deck.length > 0) {
      drawCard('ai');
    } else if (playableCards.length > 0) {
      // 如果摸牌堆空了，但手上有牌，AI 还是得强制出牌（防止死锁）
      const cardToPlay = playableCards[Math.floor(Math.random() * playableCards.length)];
      playCard('ai', cardToPlay);
    } else {
      // Skip turn if no deck and no playable cards
      setState(prev => ({
        ...prev,
        currentTurn: 'player',
        lastAction: 'AI 无牌可出且摸牌堆为空，跳过回合。'
      }));
    }
  };

  const playCard = (player: PlayerType, card: CardData) => {
    const isEight = card.rank === '8';
    
    setState(prev => {
      const handKey = player === 'player' ? 'playerHand' : 'aiHand';
      const newHand = prev[handKey].filter(c => c.id !== card.id);
      const isGameOver = newHand.length === 0;

      // If AI plays an 8, pick a random suit
      let newWildSuit = null;
      if (isEight && player === 'ai') {
        const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
        newWildSuit = suits[Math.floor(Math.random() * suits.length)];
      }

      return {
        ...prev,
        [handKey]: newHand,
        discardPile: [...prev.discardPile, card],
        wildSuit: isEight ? (player === 'ai' ? newWildSuit : prev.wildSuit) : null,
        currentTurn: isEight && player === 'player' ? 'player' : (player === 'player' ? 'ai' : 'player'),
        status: isGameOver ? 'game_over' : (isEight && player === 'player' ? 'picking_suit' : 'playing'),
        winner: isGameOver ? player : null,
        lastAction: `${player === 'player' ? '你' : 'AI'} 打出了 ${card.rank}${SUIT_SYMBOLS[card.suit]}${isEight && player === 'ai' ? `，并指定了 ${newWildSuit}` : ''}`
      };
    });

    if (isEight && player === 'player') {
      setPendingEight(true);
    }
  };

  const drawCard = (player: PlayerType) => {
    if (state.deck.length === 0) return;

    setState(prev => {
      const newDeck = [...prev.deck];
      const drawnCard = newDeck.pop()!;
      const handKey = player === 'player' ? 'playerHand' : 'aiHand';
      
      // Check if drawn card is playable immediately
      const canPlayImmediately = canPlayCard(drawnCard, topCard, state.wildSuit);
      
      return {
        ...prev,
        deck: newDeck,
        [handKey]: [...prev[handKey], drawnCard],
        lastAction: `${player === 'player' ? '你' : 'AI'} 摸了一张牌。`,
        // In some rules, you can play immediately, but let's keep it simple: draw ends turn unless specified
        currentTurn: player === 'player' ? 'ai' : 'player'
      };
    });
  };

  const handleSuitSelect = (suit: Suit) => {
    setState(prev => ({
      ...prev,
      wildSuit: suit,
      status: 'playing',
      currentTurn: 'ai',
      lastAction: `你指定了 ${suit === 'hearts' ? '红心' : suit === 'diamonds' ? '方块' : suit === 'clubs' ? '梅花' : '黑桃'}`
    }));
    setPendingEight(false);
  };

  return (
    <div className="min-h-screen bg-[#1a472a] text-white font-sans selection:bg-indigo-500/30 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="p-4 sm:p-6 flex items-center justify-between border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="font-black text-xl">8</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-none">陈熙超级疯狂 8 点</h1>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">简单模式</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={initGame}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="重新开始"
          >
            <RotateCcw size={24} />
          </button>
        </div>
      </header>

      {/* Game Board */}
      <main className="flex-1 relative p-4 sm:p-8 flex flex-col items-center justify-between gap-8 max-w-7xl mx-auto w-full">
        
        {/* AI Area */}
        <div className="w-full flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-black/30 rounded-full border border-white/10">
            <Cpu size={18} className={state.currentTurn === 'ai' ? 'text-indigo-400 animate-pulse' : 'text-slate-400'} />
            <span className="text-sm font-bold uppercase tracking-wider">AI 对手</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-xs">{state.aiHand.length} 张牌</span>
          </div>
          
          <div className="flex justify-center -space-x-8 sm:-space-x-12 h-24 sm:h-36">
            {state.aiHand.map((card, i) => (
              <Card key={card.id} isFaceDown className="z-0" />
            ))}
          </div>
        </div>

        {/* Center Area (Deck & Discard) */}
        <div className="flex items-center gap-8 sm:gap-16">
          {/* Draw Pile */}
          <div className="flex flex-col items-center gap-2">
            <div 
              onClick={() => state.currentTurn === 'player' && state.status === 'playing' && drawCard('player')}
              className={`relative group ${state.currentTurn === 'player' && state.status === 'playing' ? 'cursor-pointer' : 'opacity-50'}`}
            >
              <Card isFaceDown className="shadow-2xl" />
              {state.deck.length > 0 && (
                <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white/20">
                  {state.deck.length}
                </div>
              )}
              {state.currentTurn === 'player' && state.status === 'playing' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-indigo-300 uppercase tracking-widest"
                >
                  点击摸牌
                </motion.div>
              )}
            </div>
          </div>

          {/* Discard Pile */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <AnimatePresence mode="popLayout">
                {topCard && (
                  <Card 
                    key={topCard.id} 
                    card={topCard} 
                    className="shadow-2xl ring-4 ring-white/10"
                  />
                )}
              </AnimatePresence>
              {state.wildSuit && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-indigo-500"
                >
                  <span className={`text-2xl ${SUIT_COLORS[state.wildSuit]}`}>
                    {SUIT_SYMBOLS[state.wildSuit]}
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Player Area */}
        <div className="w-full flex flex-col items-center gap-6">
          <div className="flex items-center gap-3 px-4 py-2 bg-black/30 rounded-full border border-white/10">
            <User size={18} className={state.currentTurn === 'player' ? 'text-indigo-400 animate-pulse' : 'text-slate-400'} />
            <span className="text-sm font-bold uppercase tracking-wider">你的手牌</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-xs">{state.playerHand.length} 张牌</span>
          </div>

          <div className="flex justify-center -space-x-8 sm:-space-x-12 h-28 sm:h-40 px-10 w-full overflow-x-auto no-scrollbar pb-4">
            {state.playerHand.map((card) => (
              <Card 
                key={card.id} 
                card={card} 
                className="hover:z-50 transition-all"
                isPlayable={state.currentTurn === 'player' && state.status === 'playing' && !!topCard && canPlayCard(card, topCard, state.wildSuit)}
                onClick={() => playCard('player', card)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="p-4 bg-black/40 border-t border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-indigo-200">
            <Info size={18} />
            <p className="text-sm font-medium">{state.lastAction}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
              state.currentTurn === 'player' 
                ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' 
                : 'bg-white/5 border-white/10 text-white/40'
            }`}>
              {state.currentTurn === 'player' ? '你的回合' : 'AI 回合中...'}
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {state.status === 'picking_suit' && (
          <SuitPicker onSelect={handleSuitSelect} />
        )}
        {state.status === 'game_over' && (
          <GameOverModal winner={state.winner} onRestart={initGame} />
        )}
      </AnimatePresence>
    </div>
  );
}
