'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';

interface TooltipProps {
  title: string;
  description: string;
  gainInfo?: string;
  autoGain?: string;
  children: React.ReactNode;
}

function ResourceTooltip({ title, description, gainInfo, autoGain, children }: TooltipProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      {isHovered && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 animate-slide-up">
          <div className="bg-lake-900/95 backdrop-blur-md border border-lake-500/30 rounded-xl p-3 shadow-xl min-w-[220px]">
            <h4 className="text-amber-400 font-display font-bold text-sm mb-1">{title}</h4>
            <p className="text-cream-100 text-xs leading-relaxed mb-2">
              {description}
            </p>
            {(gainInfo || autoGain) && (
              <div className="border-t border-lake-600/30 pt-2 mt-2 space-y-1">
                {gainInfo && (
                  <div className="flex items-start gap-1.5 text-[10px]">
                    <span className="text-forest-400">💡</span>
                    <span className="text-cream-300/70">{gainInfo}</span>
                  </div>
                )}
                {autoGain && (
                  <div className="flex items-start gap-1.5 text-[10px]">
                    <span className="text-cyan-400">⚡</span>
                    <span className="text-cream-300/70">{autoGain}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Arrow */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-lake-900/95 border-l border-t border-lake-500/30 transform rotate-45" />
        </div>
      )}
    </div>
  );
}

export default function ResourceBar() {
  const resources = useGameStore((state) => state.resources);
  const day = useGameStore((state) => state.day);
  const filtrationLevel = useGameStore((state) => state.filtrationLevel);
  const getMetrics = useGameStore((state) => state.getMetrics);
  
  const metrics = getMetrics();
  
  return (
    <div className="glass rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
      {/* Day Counter */}
      <ResourceTooltip
        title="Jour"
        description="Le temps qui passe dans votre sanctuaire. Chaque jour représente 10 cycles de jeu."
        gainInfo="Le jour avance automatiquement tant que le jeu n'est pas en pause."
        autoGain="1 jour = 10 cycles (environ 20 secondes en vitesse 1x)"
      >
        <div className="flex items-center gap-3 cursor-help">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <span className="text-xl">☀️</span>
          </div>
          <div>
            <div className="text-[10px] text-cream-300/50 uppercase tracking-wide">Jour</div>
            <div className="text-xl font-display font-bold text-amber-400">{day}</div>
          </div>
        </div>
      </ResourceTooltip>
      
      {/* Energy */}
      <ResourceTooltip
        title="Énergie"
        description="Ressource nécessaire pour effectuer des actions. Représente l'effort de votre équipe de bénévoles."
        gainInfo="Se régénère automatiquement avec le temps. Attendez ou réduisez vos actions pour récupérer."
        autoGain="+5 énergie par cycle (toutes les 2 secondes en 1x)"
      >
        <div className="flex items-center gap-2 cursor-help">
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
      </ResourceTooltip>
      
      {/* Budget */}
      <ResourceTooltip
        title="Budget"
        description="Vos fonds pour acheter des équipements, nourriture et améliorations. Provient des dons du public."
        gainInfo="Augmente grâce aux dons automatiques. Un écosystème en bonne santé attire plus de visiteurs !"
        autoGain="+3€ par cycle grâce aux dons des visiteurs"
      >
        <div className="flex items-center gap-2 cursor-help">
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
      </ResourceTooltip>
      
      {/* Filtration Level */}
      <ResourceTooltip
        title="Filtration"
        description="Niveau de votre système de filtration d'eau. Réduit automatiquement la pollution au fil du temps."
        gainInfo="Améliorez avec l'action 'Filtration' (coût: ⚡50 💰75). Maximum niveau 5."
        autoGain={`Niveau ${filtrationLevel} = -${(filtrationLevel * 0.5).toFixed(1)}% pollution par cycle`}
      >
        <div className="flex items-center gap-2 cursor-help">
          <div className="w-8 h-8 rounded-lg bg-forest-500/20 flex items-center justify-center">
            <span className="text-lg">🔧</span>
          </div>
          <div>
            <div className="text-[10px] text-cream-300/50 uppercase tracking-wide">Filtration</div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <div 
                  key={i}
                  className={`w-2 h-4 rounded-sm transition-colors ${
                    i < filtrationLevel ? 'bg-forest-400' : 'bg-lake-700/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </ResourceTooltip>
      
      {/* Ecosystem Health */}
      <ResourceTooltip
        title="Santé de l'Écosystème"
        description="Score global représentant l'équilibre de votre sanctuaire. Combine bien-être animal, biodiversité et pollution."
        gainInfo="Améliorez en prenant soin des animaux, en augmentant la biodiversité et en réduisant la pollution."
        autoGain="Calculé : 40% bien-être + 30% biodiversité + 30% (100 - pollution)"
      >
        <div className="flex items-center gap-2 ml-auto cursor-help">
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
      </ResourceTooltip>
    </div>
  );
}
