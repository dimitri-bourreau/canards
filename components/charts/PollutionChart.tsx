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

export default function PollutionChart() {
  const history = useGameStore((state) => state.history);
  const pollution = useGameStore((state) => state.pollution);
  
  const labels = history.length > 0 
    ? history.map((_, i) => `${i + 1}`)
    : ['Début'];
  
  // Determine color based on pollution level
  const getColor = (level: number) => {
    if (level < 30) return '#66bb6a'; // Vert - Bon
    if (level < 60) return '#ffca28'; // Jaune - Attention
    return '#ef5350'; // Rouge - Danger
  };
  
  const currentColor = getColor(pollution.overall);
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Pollution',
        data: history.length > 0 ? history.map((h) => h.pollution) : [pollution.overall],
        borderColor: currentColor,
        backgroundColor: `${currentColor}20`,
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointBackgroundColor: currentColor,
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
  
  const getStatus = (level: number) => {
    if (level < 30) return { text: 'Propre', emoji: '✨' };
    if (level < 60) return { text: 'Modéré', emoji: '⚠️' };
    return { text: 'Critique', emoji: '🚨' };
  };
  
  const status = getStatus(pollution.overall);
  
  return (
    <div className={`chart-container rounded-2xl p-4 h-full ${pollution.overall >= 60 ? 'alert-pulse' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${currentColor}30` }}
          >
            <span className="text-lg">{status.emoji}</span>
          </div>
          <h3 className="font-display font-semibold text-cream-100 text-sm">
            Pollution
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span 
            className="text-2xl font-display font-bold"
            style={{ color: currentColor }}
          >
            {Math.round(pollution.overall)}
          </span>
          <span className="text-xs text-cream-300/60">%</span>
        </div>
      </div>
      <div className="h-24">
        <Line data={data} options={options} />
      </div>
      <div className="mt-2 flex justify-between text-xs text-cream-300/50">
        <span>Plastique : {Math.round(pollution.plastic)}%</span>
        <span>Déchets : {Math.round(pollution.waste)}%</span>
      </div>
    </div>
  );
}
