
import React from 'react';
import { Player, getGenreMeta, GameGenre } from '../../types';

interface StatsGridProps {
  player: Player;
  genre?: GameGenre;
  isEditing: boolean;
  onUpdatePlayer: (player: Player) => void;
}

export const McStatsGrid: React.FC<StatsGridProps> = ({ player, genre, isEditing, onUpdatePlayer }) => {
  const meta = getGenreMeta(genre);
  const statsDef = meta.statsDef || [];

  const handleStatChange = (key: string, val: number) => {
    onUpdatePlayer({
      ...player,
      stats: {
        ...player.stats,
        [key]: val
      }
    });
  };
  
  const gridColsClass = 
    statsDef.length <= 3 ? 'lg:grid-cols-3' :
    statsDef.length === 4 ? 'lg:grid-cols-4' :
    'lg:grid-cols-4 xl:grid-cols-7';

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridColsClass} gap-1 mono`}>
      {statsDef.map((s, i) => {
        const value = (player.stats as any)[s.key] ?? 10;
        
        return (
          <div key={i} className={`${s.bg} border border-white/5 p-1.5 rounded-sm group hover:border-emerald-500/30 transition-all relative overflow-hidden`}>
            <div className="absolute top-0 right-0 p-0.5 opacity-10 text-[8px] font-black select-none uppercase tracking-widest z-0">
              {s.key.substring(0, 3).toUpperCase()}
            </div>
            
            <div className="relative z-10">
              <span className="block text-[7px] font-black text-neutral-500 uppercase mb-0.5 tracking-widest flex items-center gap-1">
                 {s.icon} {s.label}
              </span>
              <div className="flex items-baseline gap-1.5">
                {isEditing ? (
                  <input 
                    type="number"
                    value={value}
                    onChange={(e) => handleStatChange(s.key, parseInt(e.target.value) || 0)}
                    className={`w-20 bg-transparent text-2xl font-black ${s.color} tabular-nums outline-none`}
                  />
                ) : (
                  <span className={`text-2xl font-black ${s.color} tabular-nums group-hover:scale-105 transition-transform origin-left leading-none`}>
                    {value}
                  </span>
                )}
                <div className="h-0.5 flex-grow bg-white/5 rounded-full overflow-hidden self-center mb-1">
                   <div 
                    className={`h-full ${s.color.replace('text-', 'bg-')} rounded-full opacity-40 shadow-[0_0_10px_currentColor]`} 
                    style={{ width: `${Math.min(100, (value/150)*100)}%` }}
                   ></div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
