'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useGameStore } from '@/store/gameStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function BiodiversityChart() {
  const history = useGameStore((state) => state.history);
  const ducks = useGameStore((state) => state.ducks);
  const fish = useGameStore((state) => state.fish);
  const dragonflies = useGameStore((state) => state.dragonflies);
  
  // Calculate current biodiversity score
  const currentBiodiversity = Math.round(
    Math.min(ducks.population, 20) / 20 * 25 +
    Math.min(fish.population, 50) / 50 * 25 +
    Math.min(fish.diversity, 10) / 10 * 25 +
    Math.min(dragonflies.population, 30) / 30 * 25
  );
  
  const labels = history.length > 0 
    ? history.map((_, i) => `${i + 1}`)
    : ['Début'];
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Biodiversité',
        data: history.length > 0 ? history.map((h) => h.biodiversity) : [currentBiodiversity],
        borderColor: '#26c6da',
        backgroundColor: 'rgba(38, 198, 218, 0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointBackgroundColor: '#26c6da',
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(2, 30, 25, 0.9)',
        titleColor: '#ffcc4d',
        bodyColor: '#fdf9f3',
        borderColor: 'rgba(13, 122, 97, 0.5)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(13, 122, 97, 0.15)',
        },
        ticks: {
          color: 'rgba(253, 249, 243, 0.5)',
          font: {
            size: 10,
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };
  
  // Count total species
  const totalSpecies = 1 + fish.diversity + 1; // Canards (1 espèce) + Espèces de poissons + Libellules (1 espèce)
  
  return (
    <div className="chart-container rounded-2xl p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <span className="text-lg">🌿</span>
          </div>
          <h3 className="font-display font-semibold text-cream-100 text-sm">
            Biodiversité
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-display font-bold text-cyan-400">
            {totalSpecies}
          </span>
          <span className="text-xs text-cream-300/60">espèces</span>
        </div>
      </div>
      <div className="h-24">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
