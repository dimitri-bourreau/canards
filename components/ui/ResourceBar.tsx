'use client';

import { useGameStore } from '@/store/gameStore';

export default function ResourceBar() {
  const resources = useGameStore((state) => state.resources);
  const day = useGameStore((state) => state.day);
  const filtrationLevel = useGameStore((state) => state.filtrationLevel);
  const getMetrics = useGameStore((state) => state.getMetrics);
  
  const metrics = getMetrics();
  
  return (
    <div className="glass rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
      {/* Day Counter */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
          <span className="text-xl">☀️</span>
        </div>
        <div>
          <div className="text-[10px] text-cream-300/50 uppercase tracking-wide">Jour</div>
          <div className="text-xl font-display font-bold text-amber-400">{day}</div>
        </div>
      </div>
      
      {/* Energy */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
          <span className="text-lg">⚡</span>
        </div>
        <div>
          <div className="text-[10px] text-cream-300/50 uppercase tracking-wide">Énergie</div>
          <div className="flex items-center gap-1">
            <span className="text-lg font-display font-bold text-cyan-400">
              {Math.round(resources.energy)}
            </span>
            <span className="text-xs text-cream-300/40">/ {resources.maxEnergy}</span>
          </div>
        </div>
        {/* Energy bar */}
        <div className="w-20 h-2 bg-lake-800/50 rounded-full overflow-hidden ml-1">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-300"
            style={{ width: `${(resources.energy / resources.maxEnergy) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Budget */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
          <span className="text-lg">💰</span>
        </div>
        <div>
          <div className="text-[10px] text-cream-300/50 uppercase tracking-wide">Budget</div>
          <div className="text-lg font-display font-bold text-amber-400">
            {Math.round(resources.budget)}€
          </div>
        </div>
      </div>
      
      {/* Filtration Level */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-forest-500/20 flex items-center justify-center">
          <span className="text-lg">🔧</span>
        </div>
        <div>
          <div className="text-[10px] text-cream-300/50 uppercase tracking-wide">Filtration</div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <div 
                key={i}
                className={`w-2 h-4 rounded-sm ${
                  i < filtrationLevel ? 'bg-forest-400' : 'bg-lake-700/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Ecosystem Health */}
      <div className="flex items-center gap-2 ml-auto">
        <div>
          <div className="text-[10px] text-cream-300/50 uppercase tracking-wide text-right">Écosystème</div>
          <div className="text-lg font-display font-bold gradient-text">
            {metrics.ecosystemHealth}%
          </div>
        </div>
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{
            backgroundColor: metrics.ecosystemHealth > 70 
              ? 'rgba(102, 187, 106, 0.2)' 
              : metrics.ecosystemHealth > 40 
                ? 'rgba(255, 202, 40, 0.2)'
                : 'rgba(239, 83, 80, 0.2)',
          }}
        >
          {metrics.ecosystemHealth > 70 ? '🌟' : metrics.ecosystemHealth > 40 ? '🌤️' : '⛈️'}
        </div>
      </div>
    </div>
  );
}
