'use client';

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  color: string;
  icon?: string;
}

function StatBar({ label, value, max = 100, color, icon }: StatBarProps) {
  const percentage = (value / max) * 100;
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span className="text-cream-300/70 flex items-center gap-1">
          {icon && <span>{icon}</span>}
          {label}
        </span>
        <span className="font-mono text-cream-100">{Math.round(value)}</span>
      </div>
      <div className="h-1.5 bg-lake-800/50 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}50`,
          }}
        />
      </div>
    </div>
  );
}

interface AnimalCardProps {
  name: string;
  emoji: string;
  population: number;
  health: number;
  happiness: number;
  extraStat?: { label: string; value: number | string; icon?: string };
  accentColor: string;
  description: string;
}

export default function AnimalCard({
  name,
  emoji,
  population,
  health,
  happiness,
  extraStat,
  accentColor,
  description,
}: AnimalCardProps) {
  return (
    <div className="glass rounded-2xl p-4 card-glow transition-all duration-300 hover:scale-[1.02] group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl animate-float"
            style={{ backgroundColor: `${accentColor}20` }}
          >
            {emoji}
          </div>
          <div>
            <h3 className="font-display font-bold text-cream-100 text-lg">
              {name}
            </h3>
            <p className="text-xs text-cream-300/50">{description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-display font-bold text-cream-100">
            {population}
          </div>
          <div className="text-[10px] text-cream-300/50 uppercase tracking-wide">
            population
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="space-y-2">
        <StatBar 
          label="Santé" 
          value={health} 
          color="#66bb6a"
          icon="❤️"
        />
        <StatBar 
          label="Bonheur" 
          value={happiness} 
          color="#ffca28"
          icon="😊"
        />
        {extraStat && typeof extraStat.value === 'number' && (
          <StatBar 
            label={extraStat.label} 
            value={extraStat.value} 
            color={accentColor}
            icon={extraStat.icon}
          />
        )}
        {extraStat && typeof extraStat.value === 'string' && (
          <div className="flex justify-between items-center text-xs pt-1">
            <span className="text-cream-300/70 flex items-center gap-1">
              {extraStat.icon && <span>{extraStat.icon}</span>}
              {extraStat.label}
            </span>
            <span className="font-mono text-cream-100 font-bold" style={{ color: accentColor }}>
              {extraStat.value}
            </span>
          </div>
        )}
      </div>
      
      {/* Decorative element */}
      <div 
        className="absolute -bottom-1 -right-1 w-16 h-16 rounded-full opacity-10 blur-xl group-hover:opacity-20 transition-opacity"
        style={{ backgroundColor: accentColor }}
      />
    </div>
  );
}
