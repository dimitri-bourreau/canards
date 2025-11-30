'use client';

import dynamic from 'next/dynamic';
import { useGameStore } from '@/store/gameStore';
import WelfareChart from './charts/WelfareChart';
import BiodiversityChart from './charts/BiodiversityChart';
import PollutionChart from './charts/PollutionChart';
import AnimalCard from './animals/AnimalCard';
import PlantCard from './animals/PlantCard';
import ActionButtons from './actions/ActionButtons';
import ResourceBar from './ui/ResourceBar';
import GameControls from './ui/GameControls';
import Notifications from './ui/Notifications';

// Dynamic import for Three.js component to avoid SSR issues
const IsometricLake = dynamic(() => import('./lake/IsometricLake'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-2xl glass flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-2 animate-float">🏞️</div>
        <p className="text-cream-300/50 text-sm">Chargement du lac...</p>
      </div>
    </div>
  ),
});

export default function Dashboard() {
  const ducks = useGameStore((state) => state.ducks);
  const fish = useGameStore((state) => state.fish);
  const dragonflies = useGameStore((state) => state.dragonflies);
  const plants = useGameStore((state) => state.plants);
  
  return (
    <div className="min-h-screen p-4 lg:p-6">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lake-500 to-lake-700 flex items-center justify-center text-2xl shadow-lg">
            🦆
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl lg:text-3xl text-cream-100">
              <span className="gradient-text">Canards</span>
            </h1>
            <p className="text-xs text-cream-300/50">
              Restaurer • Protéger • Chérir
            </p>
          </div>
        </div>
        <GameControls />
      </header>
      
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        <div className="lg:w-3/4 space-y-4 lg:space-y-6">
          <ResourceBar />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <WelfareChart />
            <BiodiversityChart />
            <PollutionChart />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnimalCard
              name="Canards"
              emoji="🦆"
              population={ducks.population}
              health={ducks.health}
              happiness={ducks.happiness}
              extraStat={{
                label: 'Nichoirs',
                value: `${ducks.nestingAreas}`,
                icon: '🏠',
              }}
              accentColor="#f5d742"
              description="Résidents du lac"
            />
            <AnimalCard
              name="Poissons"
              emoji="🐟"
              population={fish.population}
              health={fish.health}
              happiness={fish.happiness}
              extraStat={{
                label: 'Espèces',
                value: `${fish.diversity}`,
                icon: '🌈',
              }}
              accentColor="#70a1ff"
              description="Diversité aquatique"
            />
            <AnimalCard
              name="Libellules"
              emoji="🪰"
              population={dragonflies.population}
              health={dragonflies.health}
              happiness={dragonflies.happiness}
              extraStat={{
                label: 'Pureté eau',
                value: dragonflies.waterPurity,
                icon: '💧',
              }}
              accentColor="#4fc3f7"
              description="Indicateurs de pureté"
            />
            <PlantCard
              health={plants.health}
              oxygenProduction={plants.oxygenProduction}
              coverage={plants.coverage}
            />
          </div>
          
          <ActionButtons />
        </div>
        
        <div className="lg:w-1/4 h-[400px] lg:h-auto lg:min-h-[600px]">
          <IsometricLake />
        </div>
      </div>
      
      <Notifications />
      
      <footer className="mt-8 text-center text-xs text-cream-300/30">
        <p>Canards • Un jeu sur le soin, pas l'exploitation 💚</p>
      </footer>
    </div>
  );
}
