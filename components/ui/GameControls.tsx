'use client';

import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function GameControls() {
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const gameTick = useGameStore((state) => state.gameTick);
  const resetGame = useGameStore((state) => state.resetGame);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (!isPaused) {
      const tickInterval = 2000 / speed; // Base: 2 seconds per tick
      intervalRef.current = setInterval(() => {
        gameTick();
      }, tickInterval);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, speed, gameTick]);
  
  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir recommencer ? Toute progression sera perdue.')) {
      resetGame();
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      {/* Play/Pause */}
      <button
        onClick={() => setIsPaused(!isPaused)}
        className={`
          w-10 h-10 rounded-xl flex items-center justify-center text-lg
          transition-all duration-200 btn-press
          ${isPaused 
            ? 'bg-forest-500/30 border border-forest-400/50 text-forest-400' 
            : 'bg-lake-600/30 border border-lake-400/30 text-cream-100'
          }
        `}
        title={isPaused ? 'Reprendre' : 'Pause'}
      >
        {isPaused ? '▶️' : '⏸️'}
      </button>
      
      {/* Speed Control */}
      <div className="flex items-center gap-1 bg-lake-800/30 rounded-xl p-1">
        {[1, 2, 3].map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`
              w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold
              transition-all duration-200
              ${speed === s 
                ? 'bg-amber-500/30 text-amber-400' 
                : 'text-cream-300/50 hover:text-cream-100'
              }
            `}
          >
            {s}x
          </button>
        ))}
      </div>
      
      {/* Reset */}
      <button
        onClick={handleReset}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg
          bg-coral-600/20 border border-coral-500/30 text-coral-400
          hover:bg-coral-600/30 transition-all duration-200 btn-press"
        title="Recommencer"
      >
        🔄
      </button>
    </div>
  );
}
