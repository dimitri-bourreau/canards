'use client';

import { useGameStore } from '@/store/gameStore';
import { ACTION_COSTS } from '@/types/game';

interface ActionButtonProps {
  name: string;
  description: string;
  icon: string;
  energyCost: number;
  budgetCost: number;
  onClick: () => void;
  disabled?: boolean;
  locked?: boolean;
  lockReason?: string;
  special?: boolean;
}

function ActionButton({
  name,
  description,
  icon,
  energyCost,
  budgetCost,
  onClick,
  disabled = false,
  locked = false,
  lockReason,
  special = false,
}: ActionButtonProps) {
  const resources = useGameStore((state) => state.resources);
  
  const canAfford = resources.energy >= energyCost && resources.budget >= budgetCost;
  const isDisabled = disabled || locked || !canAfford;
  
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        relative group p-3 rounded-xl text-left transition-all duration-200
        ${isDisabled 
          ? 'bg-lake-800/30 cursor-not-allowed opacity-60' 
          : special
            ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 hover:from-amber-500/30 hover:to-amber-600/20 border border-amber-500/30'
            : 'bg-lake-700/30 hover:bg-lake-600/40 border border-lake-500/20 hover:border-lake-400/30'
        }
        btn-press card-glow
      `}
    >
      {/* Lock Overlay */}
      {locked && (
        <div className="absolute inset-0 bg-lake-900/80 rounded-xl flex items-center justify-center backdrop-blur-sm z-10">
          <div className="text-center">
            <span className="text-2xl">🔒</span>
            <p className="text-[10px] text-cream-300/60 mt-1">{lockReason}</p>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="flex items-start gap-3">
        <div className={`
          w-10 h-10 rounded-lg flex items-center justify-center text-xl
          ${special ? 'bg-amber-500/20' : 'bg-lake-600/30'}
          group-hover:scale-110 transition-transform duration-200
        `}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-semibold text-cream-100 text-sm truncate">
            {name}
          </h4>
          <p className="text-[10px] text-cream-300/50 line-clamp-1">
            {description}
          </p>
        </div>
      </div>
      
      {/* Cost */}
      <div className="flex items-center gap-3 mt-2 pt-2 border-t border-lake-600/20">
        <div className={`flex items-center gap-1 text-xs ${resources.energy >= energyCost ? 'text-cyan-400' : 'text-coral-400'}`}>
          <span>⚡</span>
          <span className="font-mono">{energyCost}</span>
        </div>
        <div className={`flex items-center gap-1 text-xs ${resources.budget >= budgetCost ? 'text-amber-400' : 'text-coral-400'}`}>
          <span>💰</span>
          <span className="font-mono">{budgetCost}</span>
        </div>
      </div>
      
      {/* Hover glow */}
      {!isDisabled && (
        <div className={`
          absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
          ${special ? 'bg-amber-400/5' : 'bg-lake-400/5'}
        `} />
      )}
    </button>
  );
}

export default function ActionButtons() {
  const {
    feedDucks,
    cleanLake,
    buildNestingArea,
    researchMedicine,
    heal,
    upgradeFiltration,
    plantVegetation,
    stockFish,
    research,
    filtrationLevel,
  } = useGameStore();
  
  return (
    <div className="glass rounded-2xl p-4">
      <h2 className="font-display font-bold text-cream-100 text-lg mb-4 flex items-center gap-2">
        <span className="text-amber-400">⚙️</span>
        Actions
      </h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Feed Ducks */}
        <ActionButton
          name="Nourrir Canards"
          description="Augmente le bonheur"
          icon="🍞"
          energyCost={ACTION_COSTS.feedDucks.energy}
          budgetCost={ACTION_COSTS.feedDucks.budget}
          onClick={feedDucks}
        />
        
        {/* Clean Lake */}
        <ActionButton
          name="Nettoyer Lac"
          description="Retire la pollution"
          icon="🧹"
          energyCost={ACTION_COSTS.cleanLake.energy}
          budgetCost={ACTION_COSTS.cleanLake.budget}
          onClick={cleanLake}
        />
        
        {/* Build Nesting Area */}
        <ActionButton
          name="Construire Nichoir"
          description="Augmente population"
          icon="🏠"
          energyCost={ACTION_COSTS.buildNestingArea.energy}
          budgetCost={ACTION_COSTS.buildNestingArea.budget}
          onClick={buildNestingArea}
        />
        
        {/* Research Medicine */}
        <ActionButton
          name="Rechercher Médecine"
          description="Débloque les soins"
          icon="🔬"
          energyCost={ACTION_COSTS.researchMedicine.energy}
          budgetCost={ACTION_COSTS.researchMedicine.budget}
          onClick={researchMedicine}
          disabled={research.medicine}
          special={!research.medicine}
        />
        
        {/* Heal */}
        <ActionButton
          name="Soigner Animaux"
          description="Restaure la santé"
          icon="💊"
          energyCost={ACTION_COSTS.heal.energy}
          budgetCost={ACTION_COSTS.heal.budget}
          onClick={heal}
          locked={!research.medicine}
          lockReason="Recherche requise"
        />
        
        {/* Upgrade Filtration */}
        <ActionButton
          name={`Filtration Niv.${filtrationLevel + 1}`}
          description="Réduit la pollution"
          icon="🔧"
          energyCost={ACTION_COSTS.upgradeFiltration.energy}
          budgetCost={ACTION_COSTS.upgradeFiltration.budget}
          onClick={upgradeFiltration}
          disabled={filtrationLevel >= 5}
          special={filtrationLevel < 5}
        />
        
        {/* Plant Vegetation */}
        <ActionButton
          name="Planter Végétation"
          description="Augmente l'oxygène"
          icon="🌱"
          energyCost={ACTION_COSTS.plantVegetation.energy}
          budgetCost={ACTION_COSTS.plantVegetation.budget}
          onClick={plantVegetation}
        />
        
        {/* Stock Fish */}
        <ActionButton
          name="Ajouter Poissons"
          description="Nouvelles espèces"
          icon="🐟"
          energyCost={ACTION_COSTS.stockFish.energy}
          budgetCost={ACTION_COSTS.stockFish.budget}
          onClick={stockFish}
        />
      </div>
    </div>
  );
}
