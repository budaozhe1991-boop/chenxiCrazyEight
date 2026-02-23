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
  Info,
  Home
} from 'lucide-react';
import { 
  CardData, 
  Suit, 
  GameStatus, 
  PlayerId, 
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
  showCornerOnHover?: boolean;
  className?: string;
  key?: React.Key;
}

const ZOOTOPIA_ANIMALS: Record<string, { name: string; image: string }> = {
  '2': { name: '闪电', image: 'https://picsum.photos/seed/sloth/200/300' },
  '3': { name: '芬尼克', image: 'https://picsum.photos/seed/fox2/200/300' },
  '4': { name: '豹警官', image: 'https://picsum.photos/seed/cheetah/200/300' },
  '5': { name: '牛局长', image: 'https://picsum.photos/seed/buffalo/200/300' },
  '6': { name: '羊市长', image: 'https://picsum.photos/seed/sheep/200/300' },
  '7': { name: '狮市长', image: 'https://picsum.photos/seed/lion/200/300' },
  '8': { name: '尼克', image: 'https://picsum.photos/seed/fox/200/300' },
  '9': { name: '朱迪', image: 'https://picsum.photos/seed/rabbit/200/300' },
  '10': { name: '志豪', image: 'https://picsum.photos/seed/gazelle/200/300' },
  'J': { name: '雅克斯', image: 'https://picsum.photos/seed/yak/200/300' },
  'Q': { name: '露露', image: 'https://picsum.photos/seed/shrew/200/300' },
  'K': { name: '大先生', image: 'https://picsum.photos/seed/mrbig/200/300' },
  'A': { name: '曼查斯', image: 'https://picsum.photos/seed/jaguar/200/300' },
};

const Card = ({ 
  card, 
  onClick, 
  isFaceDown = false, 
  isPlayable = false,
  showCornerOnHover = false,
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
        
        <div className="absolute inset-2 border-2 border-white/20 rounded-md flex flex-col items-center justify-center bg-indigo-900/40 backdrop-blur-[1px]">
          <span className="text-white font-black text-lg sm:text-2xl drop-shadow-lg leading-tight">陈</span>
          <span className="text-white font-black text-lg sm:text-2xl drop-shadow-lg leading-tight">熙</span>
        </div>
      </motion.div>
    );
  }

  if (!card) return null;

  const animal = ZOOTOPIA_ANIMALS[card.rank];

  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={isPlayable ? { y: -10, scale: 1.05 } : {}}
      onClick={isPlayable ? onClick : undefined}
      className={`relative group w-16 h-24 sm:w-24 sm:h-36 bg-white rounded-lg border-2 ${
        isPlayable ? 'border-yellow-400 cursor-pointer shadow-yellow-400/50' : 'border-slate-200'
      } shadow-xl flex flex-col p-0 select-none ${className}`}
    >
      <div className={`flex flex-col items-start leading-none pt-0.5 sm:pt-1 pl-1 sm:pl-1.5 ${SUIT_COLORS[card.suit]} z-10`}>
        <span className="text-sm sm:text-lg font-bold font-mono">{card.rank}</span>
        <span className="text-[10px] sm:text-xs -mt-1">{SUIT_SYMBOLS[card.suit]}</span>
      </div>
      
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {animal && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <img 
              src={animal.image} 
              alt={animal.name}
              className="w-full h-full object-cover opacity-90"
              referrerPolicy="no-referrer"
            />
            {/* 移除背景渐变和名字，让画面更干净 */}
          </div>
        )}
      </div>

      <div className={`flex flex-col items-end leading-none pb-0.5 sm:pb-1 pr-1 sm:pr-1.5 ${SUIT_COLORS[card.suit]} z-10 transition-opacity duration-200 ${showCornerOnHover ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
        <span className="text-sm sm:text-lg font-bold font-mono">{card.rank}</span>
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

const GameOverModal = ({ winner, onRestart }: { winner: PlayerId | null; onRestart: () => void }) => {
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
          {isPlayerWinner ? '恭喜获胜！' : '游戏结束'}
        </h2>
        <p className="text-slate-500 mb-8">
          {isPlayerWinner ? '你成为了 8 点之王！' : `${winner} 获得了胜利，再接再厉。`}
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

const GameStartModal = ({ onStart }: { onStart: (count: 2 | 4) => void }) => {
  const [playerCount, setPlayerCount] = useState<2 | 4>(2);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center overflow-hidden">
      {/* Zootopia Background Image for Full Screen */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2144&auto=format&fit=crop" 
          alt="Zootopia City" 
          className="w-full h-full object-cover opacity-20"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/60 to-white" />
      </div>

      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center max-w-lg w-full px-6"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: -6 }}
            transition={{ type: 'spring', damping: 12, delay: 0.2 }}
            className="w-20 h-20 sm:w-24 sm:h-24 bg-yellow-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-yellow-500/30 mb-4 border-4 border-white"
          >
            <span className="font-black text-4xl sm:text-5xl text-white drop-shadow-md">8</span>
          </motion.div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-800 tracking-tighter text-center leading-none">
            陈熙超级疯狂 8 点
          </h1>
          <div className="mt-4 px-4 py-1.5 bg-indigo-600 text-white text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] rounded-full shadow-lg shadow-indigo-200">
            Zootopia Edition
          </div>
        </div>

        <div className="w-full space-y-8 mb-10">
          <div className="flex flex-col gap-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">选择游戏模式</label>
            <div className="flex gap-4">
              <button
                onClick={() => setPlayerCount(2)}
                className={`flex-1 py-4 rounded-2xl font-black text-lg transition-all border-4 ${
                  playerCount === 2 
                    ? 'bg-orange-500 border-orange-500 text-white shadow-2xl shadow-orange-500/40 scale-105' 
                    : 'bg-white border-slate-100 text-slate-300 hover:border-orange-200'
                }`}
              >
                2 人对战
              </button>
              <button
                onClick={() => setPlayerCount(4)}
                className={`flex-1 py-4 rounded-2xl font-black text-lg transition-all border-4 ${
                  playerCount === 4 
                    ? 'bg-orange-500 border-orange-500 text-white shadow-2xl shadow-orange-500/40 scale-105' 
                    : 'bg-white border-slate-100 text-slate-300 hover:border-orange-200'
                }`}
              >
                4 人混战
              </button>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-[2rem] p-6 sm:p-8 border border-slate-100 shadow-xl">
            <h2 className="text-lg font-black text-slate-800 mb-5 flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Info size={18} className="text-orange-600" />
              </div>
              游戏规则
            </h2>
            <ul className="space-y-4 text-slate-600 text-sm sm:text-base font-medium leading-relaxed">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-black shadow-md">1</span>
                <span>每人起始 8 张牌，率先出完牌获胜。</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-black shadow-md">2</span>
                <span>出牌需与弃牌堆顶<b>花色</b>或<b>数字</b>相同。</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-black shadow-md">3</span>
                <span><b>数字 8 是万能牌！</b> 可随时打出并指定新花色。</span>
              </li>
            </ul>
          </div>
        </div>

        <button
          onClick={() => onStart(playerCount)}
          className="w-full py-6 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-[2rem] font-black text-xl sm:text-2xl shadow-2xl shadow-orange-500/40 transition-all active:scale-95 flex items-center justify-center gap-4 group"
        >
          立即开始
          <ChevronRight size={28} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [state, setState] = useState<GameState>({
    deck: [],
    playerHand: [],
    aiHands: {},
    discardPile: [],
    currentTurn: 'player',
    wildSuit: null,
    status: 'waiting',
    winner: null,
    lastAction: '欢迎来到 陈熙超级疯狂 8 点！',
    playerCount: 2
  });

  const [pendingEight, setPendingEight] = useState<boolean>(false);

  // Initialize game
  const initGame = useCallback((count: 2 | 4 = 2) => {
    const fullDeck = createDeck();
    const playerHand = fullDeck.splice(0, 8);
    const aiHands: Record<string, CardData[]> = {};
    
    const aiCount = count - 1;
    for (let i = 1; i <= aiCount; i++) {
      aiHands[`ai${i}`] = fullDeck.splice(0, 8);
    }
    
    // Ensure first discard is not an 8
    let firstDiscardIndex = 0;
    while (fullDeck[firstDiscardIndex].rank === '8') {
      firstDiscardIndex++;
    }
    const discardPile = [fullDeck.splice(firstDiscardIndex, 1)[0]];

    setState({
      deck: fullDeck,
      playerHand,
      aiHands,
      discardPile,
      currentTurn: 'player',
      wildSuit: null,
      status: 'playing',
      winner: null,
      lastAction: '游戏开始！你的回合。',
      playerCount: count
    });
    setPendingEight(false);
  }, []);

  const goHome = useCallback(() => {
    setState(prev => ({ ...prev, status: 'waiting' }));
  }, []);

  // 移除自动开始，改为由开始按钮触发
  // useEffect(() => {
  //   initGame();
  // }, [initGame]);

  const topCard = state.discardPile.length > 0 ? state.discardPile[state.discardPile.length - 1] : null;

  // AI Turn Logic
  useEffect(() => {
    if (state.status === 'playing' && state.currentTurn.startsWith('ai') && topCard) {
      const timer = setTimeout(() => {
        handleAiTurn(state.currentTurn);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.status, state.currentTurn, topCard]);

  const getNextTurn = (current: PlayerId, count: 2 | 4): PlayerId => {
    if (count === 2) {
      return current === 'player' ? 'ai1' : 'player';
    } else {
      const order: PlayerId[] = ['player', 'ai1', 'ai2', 'ai3'];
      const currentIndex = order.indexOf(current);
      return order[(currentIndex + 1) % 4];
    }
  };

  const handleAiTurn = (aiId: PlayerId) => {
    if (!topCard) return;
    const aiHand = state.aiHands[aiId];
    if (!aiHand) return;

    const playableCards = aiHand.filter(card => canPlayCard(card, topCard, state.wildSuit));
    
    // 降低难度逻辑：30% 的概率 AI 即使有牌也会选择摸牌（犯错）
    const makeMistake = Math.random() < 0.3;

    if (playableCards.length > 0 && !makeMistake) {
      const cardToPlay = playableCards[Math.floor(Math.random() * playableCards.length)];
      playCard(aiId, cardToPlay);
    } else if (state.deck.length > 0) {
      drawCard(aiId);
    } else if (playableCards.length > 0) {
      const cardToPlay = playableCards[Math.floor(Math.random() * playableCards.length)];
      playCard(aiId, cardToPlay);
    } else {
      setState(prev => ({
        ...prev,
        currentTurn: getNextTurn(aiId, prev.playerCount),
        lastAction: `${aiId} 无牌可出且摸牌堆为空，跳过回合。`
      }));
    }
  };

  const playCard = (playerId: PlayerId, card: CardData) => {
    const isEight = card.rank === '8';
    
    setState(prev => {
      let newHand: CardData[];
      let newAiHands = { ...prev.aiHands };

      if (playerId === 'player') {
        newHand = prev.playerHand.filter(c => c.id !== card.id);
      } else {
        newHand = prev.aiHands[playerId].filter(c => c.id !== card.id);
        newAiHands[playerId] = newHand;
      }

      const isGameOver = newHand.length === 0;

      // If AI plays an 8, pick a random suit
      let newWildSuit = null;
      if (isEight && playerId.startsWith('ai')) {
        const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
        newWildSuit = suits[Math.floor(Math.random() * suits.length)];
      }

      const nextTurn = isEight && playerId === 'player' ? 'player' : getNextTurn(playerId, prev.playerCount);

      return {
        ...prev,
        playerHand: playerId === 'player' ? newHand : prev.playerHand,
        aiHands: newAiHands,
        discardPile: [...prev.discardPile, card],
        wildSuit: isEight ? (playerId.startsWith('ai') ? newWildSuit : prev.wildSuit) : null,
        currentTurn: nextTurn,
        status: isGameOver ? 'game_over' : (isEight && playerId === 'player' ? 'picking_suit' : 'playing'),
        winner: isGameOver ? playerId : null,
        lastAction: `${playerId === 'player' ? '你' : playerId} 打出了 ${card.rank}${SUIT_SYMBOLS[card.suit]}${isEight && playerId.startsWith('ai') ? `，并指定了 ${newWildSuit}` : ''}`
      };
    });

    if (isEight && playerId === 'player') {
      setPendingEight(true);
    }
  };

  const drawCard = (playerId: PlayerId) => {
    if (state.deck.length === 0) {
      setState(prev => ({
        ...prev,
        currentTurn: getNextTurn(playerId, prev.playerCount),
        lastAction: `${playerId === 'player' ? '你' : playerId} 摸不到牌，跳过回合。`
      }));
      return;
    }

    setState(prev => {
      const newDeck = [...prev.deck];
      const drawnCard = newDeck.pop()!;
      
      let newPlayerHand = prev.playerHand;
      let newAiHands = { ...prev.aiHands };

      if (playerId === 'player') {
        newPlayerHand = [...prev.playerHand, drawnCard];
      } else {
        newAiHands[playerId] = [...prev.aiHands[playerId], drawnCard];
      }
      
      return {
        ...prev,
        deck: newDeck,
        playerHand: newPlayerHand,
        aiHands: newAiHands,
        currentTurn: getNextTurn(playerId, prev.playerCount),
        lastAction: `${playerId === 'player' ? '你' : playerId} 摸了一张牌。`
      };
    });
  };

  const handleSuitSelect = (suit: Suit) => {
    setState(prev => ({
      ...prev,
      wildSuit: suit,
      status: 'playing',
      currentTurn: getNextTurn('player', prev.playerCount),
      lastAction: `你指定了 ${suit === 'hearts' ? '红心' : suit === 'diamonds' ? '方块' : suit === 'clubs' ? '梅花' : '黑桃'}`
    }));
    setPendingEight(false);
  };

  const AiPlayerArea = ({ 
    id, 
    hand, 
    isCurrentTurn, 
    label, 
    orientation = 'horizontal' 
  }: { 
    id: string, 
    hand: CardData[], 
    isCurrentTurn: boolean, 
    label: string,
    orientation?: 'horizontal' | 'vertical'
  }) => {
    return (
      <div className={`flex flex-col items-center gap-2 ${orientation === 'vertical' ? 'h-full justify-center' : 'w-full'}`}>
        <div className="flex items-center gap-2 px-3 py-1 bg-black/30 rounded-full border border-white/10">
          <Cpu size={14} className={isCurrentTurn ? 'text-indigo-400 animate-pulse' : 'text-slate-400'} />
          <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
          <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">{hand.length} 张</span>
        </div>
        
        <div className={`flex justify-center ${orientation === 'vertical' ? 'flex-col -space-y-16 sm:-space-y-24' : '-space-x-8 sm:-space-x-12'} h-24 sm:h-36`}>
          {hand.map((card) => (
            <Card key={card.id} isFaceDown className={`z-0 ${orientation === 'vertical' ? 'scale-50 sm:scale-75' : 'scale-75 sm:scale-90'} origin-center`} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative text-white font-sans selection:bg-indigo-500/30 overflow-hidden flex flex-col">
      {/* Zootopia Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2144&auto=format&fit=crop" 
          alt="Zootopia Background" 
          className="w-full h-full object-cover scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/20 via-black/40 to-black/90 backdrop-blur-[2px]" />
      </div>

      {/* Header Removed as per request */}
      
      {/* Game Board */}
      <main className="flex-1 relative p-2 sm:p-4 flex flex-col items-center justify-between max-w-7xl mx-auto w-full z-10 overflow-y-auto no-scrollbar">
        
        {/* Top AI Area */}
        <div className="w-full h-32 sm:h-44 flex justify-center items-center shrink-0">
          {state.playerCount === 2 ? (
            <AiPlayerArea 
              id="ai1" 
              hand={state.aiHands.ai1 || []} 
              isCurrentTurn={state.currentTurn === 'ai1'} 
              label="AI 对手" 
            />
          ) : (
            <AiPlayerArea 
              id="ai2" 
              hand={state.aiHands.ai2 || []} 
              isCurrentTurn={state.currentTurn === 'ai2'} 
              label="AI 2" 
            />
          )}
        </div>

        {/* Middle Area with Side AIs and Center Deck */}
        <div className="flex-1 w-full flex items-center justify-between gap-2 sm:gap-8">
          {/* Left AI */}
          <div className="w-20 sm:w-32 flex justify-center">
            {state.playerCount === 4 && (
              <AiPlayerArea 
                id="ai1" 
                hand={state.aiHands.ai1 || []} 
                isCurrentTurn={state.currentTurn === 'ai1'} 
                label="AI 1" 
                orientation="vertical"
              />
            )}
          </div>

          {/* Center Area (Deck & Discard) */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-16 shrink-0 my-4">
            {/* Draw Pile */}
            <div className="flex flex-col items-center gap-2">
              <div 
                onClick={() => state.currentTurn === 'player' && state.status === 'playing' && drawCard('player')}
                className={`relative group ${state.currentTurn === 'player' && state.status === 'playing' ? 'cursor-pointer' : 'opacity-50'}`}
              >
                <Card isFaceDown className="shadow-2xl scale-90 sm:scale-100" />
                {state.deck.length > 0 && (
                  <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white/20">
                    {state.deck.length}
                  </div>
                )}
                {state.currentTurn === 'player' && state.status === 'playing' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-indigo-300 uppercase tracking-widest"
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
                      className="shadow-2xl ring-4 ring-white/10 scale-90 sm:scale-100"
                    />
                  )}
                </AnimatePresence>
                {state.wildSuit && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-4 -right-4 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-indigo-500"
                  >
                    <span className={`text-xl sm:text-2xl ${SUIT_COLORS[state.wildSuit]}`}>
                      {SUIT_SYMBOLS[state.wildSuit]}
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Right AI */}
          <div className="w-20 sm:w-32 flex justify-center">
            {state.playerCount === 4 && (
              <AiPlayerArea 
                id="ai3" 
                hand={state.aiHands.ai3 || []} 
                isCurrentTurn={state.currentTurn === 'ai3'} 
                label="AI 3" 
                orientation="vertical"
              />
            )}
          </div>
        </div>

        {/* Player Area */}
        <div className="w-full flex flex-col items-center gap-2 sm:gap-4 pb-6 h-48 sm:h-64 justify-end shrink-0">
          <div className="flex items-center gap-3 px-4 py-1.5 bg-black/30 rounded-full border border-white/10">
            <User size={16} className={state.currentTurn === 'player' ? 'text-indigo-400 animate-pulse' : 'text-slate-400'} />
            <span className="text-xs font-bold uppercase tracking-wider">你的手牌</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">{state.playerHand.length} 张</span>
          </div>

          <div className="w-full overflow-x-auto no-scrollbar px-10 pb-4">
            <div className="flex justify-center min-w-max mx-auto -space-x-6 sm:-space-x-10 h-40 sm:h-52 items-center">
              {state.playerHand.map((card) => (
                <Card 
                  key={card.id} 
                  card={card} 
                  className="hover:z-50 transition-all scale-90 sm:scale-100"
                  showCornerOnHover={true}
                  isPlayable={state.currentTurn === 'player' && state.status === 'playing' && !!topCard && canPlayCard(card, topCard, state.wildSuit)}
                  onClick={() => playCard('player', card)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="relative z-10 h-14 sm:h-16 bg-black/60 border-t border-white/10 backdrop-blur-md flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-indigo-200 min-w-0 flex-1">
            <Info size={18} className="shrink-0" />
            <p className="text-xs sm:text-sm font-medium truncate">{state.lastAction}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
              state.currentTurn === 'player' 
                ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' 
                : 'bg-white/5 border-white/10 text-white/40'
            }`}>
              {state.currentTurn === 'player' ? '你的回合' : 'AI 回合中...'}
            </div>
            
            <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
              <button 
                onClick={goHome}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
                title="回到首页"
              >
                <Home size={18} />
              </button>
              <div className="w-px h-4 bg-white/10 mx-1" />
              <button 
                onClick={() => initGame(state.playerCount)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
                title="重新开始"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {state.status === 'waiting' && (
          <GameStartModal onStart={initGame} />
        )}
        {state.status === 'picking_suit' && (
          <SuitPicker onSelect={handleSuitSelect} />
        )}
        {state.status === 'game_over' && (
          <GameOverModal winner={state.winner} onRestart={() => initGame(state.playerCount)} />
        )}
      </AnimatePresence>
    </div>
  );
}
