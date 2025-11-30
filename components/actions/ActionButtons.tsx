'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { ACTION_COSTS } from '@/types/game';

interface ActionButtonProps {
  name: string;
  description: string;
  detailedDescription: string;
  icon: string;
  energyCost: number;
  budgetCost: number;
  onClick: () => void;
  disabled?: boolean;
  locked?: boolean;
  lockReason?: string;
  special?: boolean;
  impacts: string[];
}

function ActionButton({
  name,
  description,
  detailedDescription,
  icon,
  energyCost,
  budgetCost,
  onClick,
  disabled = false,
  locked = false,
  lockReason,
  special = false,
  impacts,
}: ActionButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const resources = useGameStore((state) => state.resources);
  
  const canAfford = resources.energy >= energyCost && resources.budget >= budgetCost;
  const isDisabled = disabled || locked || !canAfford;
  
  return (
    <div className="relative">
      <button
        onClick={onClick}
        disabled={isDisabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative group p-3 rounded-xl text-left transition-all duration-200 w-full
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
      
      {/* Tooltip on Hover */}
      {isHovered && !locked && (
        <div className="absolute bottom-full left-0 right-0 mb-2 z-[100] animate-slide-up">
          <div className="bg-lake-900/95 backdrop-blur-md border border-lake-500/30 rounded-xl p-3 shadow-xl">
            <p className="text-cream-100 text-xs leading-relaxed mb-2">
              {detailedDescription}
            </p>
            <div className="border-t border-lake-600/30 pt-2 mt-2">
              <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-wide mb-1">
                Effets sur le jeu
              </p>
              <ul className="space-y-1">
                {impacts.map((impact, index) => (
                  <li key={index} className="text-[10px] text-cream-300/70 flex items-start gap-1.5">
                    <span className="text-forest-400 mt-0.5">→</span>
                    <span>{impact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Arrow */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-lake-900/95 border-r border-b border-lake-500/30 transform rotate-45" />
        </div>
      )}
    </div>
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
          detailedDescription="Les canards heureux sont en meilleure santé et se reproduisent plus facilement. Un nourrissage régulier est essentiel pour maintenir une population épanouie."
          icon="🍞"
          energyCost={ACTION_COSTS.feedDucks.energy}
          budgetCost={ACTION_COSTS.feedDucks.budget}
          onClick={feedDucks}
          impacts={[
            "Bonheur des canards +15",
            "Santé des canards +5",
            "Améliore le score de bien-être global"
          ]}
        />
        
        {/* Clean Lake */}
        <ActionButton
          name="Nettoyer Lac"
          description="Retire la pollution"
          detailedDescription="La pollution affecte tous les habitants du lac. Un nettoyage régulier améliore la qualité de l'eau et la santé de tout l'écosystème."
          icon="🧹"
          energyCost={ACTION_COSTS.cleanLake.energy}
          budgetCost={ACTION_COSTS.cleanLake.budget}
          onClick={cleanLake}
          impacts={[
            "Plastique -15%, Déchets -10%",
            "Pureté de l'eau +10 (libellules)",
            "Réduit les pénalités de santé sur tous les animaux"
          ]}
        />
        
        {/* Build Nesting Area */}
        <ActionButton
          name="Construire Nichoir"
          description="Augmente population"
          detailedDescription="Les nichoirs offrent un habitat sûr pour la reproduction des canards. Plus de nichoirs = plus de canards = un écosystème plus vivant !"
          icon="🏠"
          energyCost={ACTION_COSTS.buildNestingArea.energy}
          budgetCost={ACTION_COSTS.buildNestingArea.budget}
          onClick={buildNestingArea}
          impacts={[
            "Population de canards +2",
            "Bonheur des canards +10",
            "Bonus passif de bonheur grâce aux nichoirs"
          ]}
        />
        
        {/* Research Medicine */}
        <ActionButton
          name="Rechercher Médecine"
          description="Débloque les soins"
          detailedDescription="Investir dans la recherche médicale vous permettra de soigner les animaux malades. Un investissement unique mais crucial pour la survie à long terme."
          icon="🔬"
          energyCost={ACTION_COSTS.researchMedicine.energy}
          budgetCost={ACTION_COSTS.researchMedicine.budget}
          onClick={researchMedicine}
          disabled={research.medicine}
          special={!research.medicine}
          impacts={[
            "Débloque l'action 'Soigner Animaux'",
            "Permet de restaurer rapidement la santé",
            "Recherche permanente (une seule fois)"
          ]}
        />
        
        {/* Heal */}
        <ActionButton
          name="Soigner Animaux"
          description="Restaure la santé"
          detailedDescription="Administre des soins à tous les animaux du sanctuaire. Essentiel quand la pollution ou les conditions difficiles ont affaibli vos protégés."
          icon="💊"
          energyCost={ACTION_COSTS.heal.energy}
          budgetCost={ACTION_COSTS.heal.budget}
          onClick={heal}
          locked={!research.medicine}
          lockReason="Recherche requise"
          impacts={[
            "Santé de tous les animaux +20",
            "Canards, poissons et libellules soignés",
            "Améliore rapidement le bien-être global"
          ]}
        />
        
        {/* Upgrade Filtration */}
        <ActionButton
          name={`Filtration Niv.${filtrationLevel + 1}`}
          description="Réduit la pollution"
          detailedDescription="Améliorer le système de filtration réduit automatiquement la pollution au fil du temps. Un investissement rentable sur le long terme !"
          icon="🔧"
          energyCost={ACTION_COSTS.upgradeFiltration.energy}
          budgetCost={ACTION_COSTS.upgradeFiltration.budget}
          onClick={upgradeFiltration}
          disabled={filtrationLevel >= 5}
          special={filtrationLevel < 5}
          impacts={[
            `Niveau de filtration → ${filtrationLevel + 1}/5`,
            "Réduction passive de pollution accrue",
            "Moins de nettoyages manuels nécessaires"
          ]}
        />
        
        {/* Plant Vegetation */}
        <ActionButton
          name="Planter Végétation"
          description="Augmente l'oxygène"
          detailedDescription="Les plantes aquatiques produisent de l'oxygène vital pour les poissons et améliorent naturellement la qualité de l'eau pour tout l'écosystème."
          icon="🌱"
          energyCost={ACTION_COSTS.plantVegetation.energy}
          budgetCost={ACTION_COSTS.plantVegetation.budget}
          onClick={plantVegetation}
          impacts={[
            "Couverture végétale +10%",
            "Production d'oxygène +8",
            "Bonus de santé passif pour tous les animaux"
          ]}
        />
        
        {/* Stock Fish */}
        <ActionButton
          name="Ajouter Poissons"
          description="Nouvelles espèces"
          detailedDescription="Introduire de nouvelles espèces de poissons augmente la biodiversité du lac. Un écosystème diversifié est plus résilient et plus beau à observer !"
          icon="🐟"
          energyCost={ACTION_COSTS.stockFish.energy}
          budgetCost={ACTION_COSTS.stockFish.budget}
          onClick={stockFish}
          impacts={[
            "Population de poissons +5",
            "Diversité des espèces +1",
            "Améliore le score de biodiversité"
          ]}
        />
      </div>
    </div>
  );
}
