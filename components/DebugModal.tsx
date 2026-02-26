
import React from 'react';
import { Player, GameArchetype, GameGenre } from '../types';
import { GAME_ARCHETYPES } from '../constants';

interface Props {
  player: Player;
  selectedWorld: GameArchetype | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePlayer: (player: Player) => void;
  onUpdateWorld: (world: GameArchetype) => void;
  onSwitchGenre: (genre: GameGenre) => void;
}

export const DebugModal: React.FC<Props> = ({ 
  player, selectedWorld, isOpen, onClose, onUpdatePlayer, onUpdateWorld, onSwitchGenre 
}) => {
  if (!isOpen) return null;

  const addGold = (amount: number) => {
    onUpdatePlayer({ ...player, gold: player.gold + amount });
  };

  const healPlayer = () => {
    onUpdatePlayer({ ...player, health: player.maxHealth });
  };

  const levelUp = () => {
    onUpdatePlayer({ ...player, level: player.level + 1 });
  };

  const resetStats = () => {
    onUpdatePlayer({
        ...player,
        stats: { strength: 10, intelligence: 10, agility: 10, charisma: 10, luck: 10, soul: 10, merit: 0 }
    });
  };

  const maxStats = () => {
    onUpdatePlayer({
        ...player,
        stats: { strength: 999, intelligence: 999, agility: 999, charisma: 999, luck: 999, soul: 999, merit: 999999 }
    });
  };

  return (
    <div className="fixed inset-0 z-[250] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-4xl bg-neutral-950 border border-red-500/30 rounded-[3rem] p-12 shadow-[0_0_50px_rgba(239,68,68,0.2)] relative overflow-hidden flex flex-col md:flex-row gap-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
        
        {/* Left Side: Stats Cheats */}
        <div className="flex-grow space-y-8">
          <div className="flex justify-between items-center">
              <h3 className="text-3xl font-black text-red-500 uppercase tracking-tighter leading-none italic">Quantum <span className="text-white">Debugger</span></h3>
              <span className="mono text-[10px] font-black text-red-500/40 uppercase tracking-widest">Root_Access: Granted</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <button 
              onClick={() => addGold(1000000)}
              className="p-5 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl flex flex-col items-center gap-2 group hover:bg-yellow-500 hover:text-black transition-all"
            >
              <span className="text-xl">💰</span>
              <span className="mono text-[9px] font-black uppercase">Cheat Gold (+1M)</span>
            </button>

            <button 
              onClick={healPlayer}
              className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex flex-col items-center gap-2 group hover:bg-emerald-500 hover:text-black transition-all"
            >
              <span className="text-xl">💖</span>
              <span className="mono text-[9px] font-black uppercase">Full Integrity</span>
            </button>

            <button 
              onClick={levelUp}
              className="p-5 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex flex-col items-center gap-2 group hover:bg-blue-500 hover:text-black transition-all"
            >
              <span className="text-xl">🆙</span>
              <span className="mono text-[9px] font-black uppercase">Force Level Up</span>
            </button>

            <button 
              onClick={maxStats}
              className="p-5 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex flex-col items-center gap-2 group hover:bg-purple-500 hover:text-black transition-all"
            >
              <span className="text-xl">⚡</span>
              <span className="mono text-[9px] font-black uppercase">Max Out Stats</span>
            </button>

            <button 
              onClick={resetStats}
              className="p-5 bg-red-500/10 border border-red-500/30 rounded-2xl flex flex-col items-center gap-2 group hover:bg-red-500 hover:text-white transition-all"
            >
              <span className="text-xl">🔄</span>
              <span className="mono text-[9px] font-black uppercase">Reset Attributes</span>
            </button>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem]">
              <span className="block mono text-[9px] text-neutral-600 font-black uppercase mb-4 tracking-widest">System_Logs</span>
              <div className="h-32 overflow-y-auto custom-scrollbar mono text-[9px] text-red-400/60 space-y-1 font-bold">
                  <p>&gt; [INFO] Console session initialized...</p>
                  <p>&gt; [WARN] Reality tethering weakened.</p>
                  <p>&gt; [DEBUG] Player_Name: {player.name}</p>
                  <p>&gt; [DEBUG] Current_Genre: {selectedWorld?.genre}</p>
                  <p>&gt; [DEBUG] Current_World: {selectedWorld?.title}</p>
                  <p>&gt; [READY] Waiting for user command...</p>
              </div>
          </div>
        </div>

        {/* Right Side: Genre Switcher */}
        <div className="w-full md:w-72 space-y-6 shrink-0 border-l border-white/5 pl-10">
           <h4 className="mono text-[10px] font-black text-red-400 uppercase tracking-widest border-b border-red-400/20 pb-2">Dịch chuyển Genre</h4>
           <div className="flex flex-col gap-2">
              {Object.values(GameGenre).map((g, idx) => (
                <button
                  key={idx}
                  onClick={() => onSwitchGenre(g)}
                  className={`p-3 rounded-xl border text-left transition-all text-[9px] font-black uppercase tracking-tight ${
                    selectedWorld?.genre === g 
                    ? 'bg-red-500 border-red-500 text-black shadow-lg shadow-red-500/20' 
                    : 'bg-white/5 border-white/10 text-neutral-500 hover:border-red-500/50 hover:text-red-400'
                  }`}
                >
                  {g}
                </button>
              ))}
           </div>
           
           <div className="pt-4 mt-auto">
             <button onClick={onClose} className="w-full py-4 bg-white/10 hover:bg-white text-neutral-400 hover:text-black rounded-2xl mono text-[10px] font-black uppercase transition-all tracking-[0.2em] border border-white/10">
               Đóng [ESC]
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};
