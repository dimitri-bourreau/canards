'use client';

interface PlantCardProps {
  health: number;
  oxygenProduction: number;
  coverage: number;
}

export default function PlantCard({ health, oxygenProduction, coverage }: PlantCardProps) {
  return (
    <div className="glass rounded-2xl p-4 card-glow transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-forest-500/20 flex items-center justify-center text-2xl animate-sway">
            🌿
          </div>
          <div>
            <h3 className="font-display font-bold text-cream-100 text-lg">
              Plantes Aquatiques
            </h3>
            <p className="text-xs text-cream-300/50">Producteurs d'oxygène</p>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Health */}
        <div className="text-center p-2 rounded-xl bg-lake-800/30">
          <div className="text-lg mb-1">🌱</div>
          <div className="text-lg font-display font-bold text-forest-400">
            {Math.round(health)}%
          </div>
          <div className="text-[10px] text-cream-300/50 uppercase">Santé</div>
        </div>
        
        {/* Oxygen */}
        <div className="text-center p-2 rounded-xl bg-lake-800/30">
          <div className="text-lg mb-1">💨</div>
          <div className="text-lg font-display font-bold text-cyan-400">
            {Math.round(oxygenProduction)}
          </div>
          <div className="text-[10px] text-cream-300/50 uppercase">O₂</div>
        </div>
        
        {/* Coverage */}
        <div className="text-center p-2 rounded-xl bg-lake-800/30">
          <div className="text-lg mb-1">📐</div>
          <div className="text-lg font-display font-bold text-amber-400">
            {Math.round(coverage)}%
          </div>
          <div className="text-[10px] text-cream-300/50 uppercase">Surface</div>
        </div>
      </div>
      
      {/* Coverage Visual Bar */}
      <div className="mt-3">
        <div className="h-2 bg-lake-800/50 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-forest-600 to-forest-400"
            style={{ 
              width: `${coverage}%`,
              boxShadow: '0 0 10px rgba(76, 175, 80, 0.4)',
            }}
          />
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-cream-300/40">
          <span>Couverture du lac</span>
          <span>{coverage}%</span>
        </div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute -bottom-2 -right-2 w-20 h-20 rounded-full bg-forest-500 opacity-10 blur-xl group-hover:opacity-20 transition-opacity" />
    </div>
  );
}
