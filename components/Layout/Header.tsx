
import React, { useEffect } from 'react';
import { GameTime, Player } from '../../types';

interface HeaderProps {
  player: Player;
  gameTime: string;
  currentLocation?: string;
  isSaving: boolean;
  modals: any;
  setModals: (m: any) => void;
  handleBack: () => void;
  view: string;
  isDebugActive: boolean;
  onManualSave: () => void;
  onDebug: () => void;
  onRetry?: () => void;
  isLoading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  player, gameTime, currentLocation, isSaving, modals, setModals, handleBack, view, isDebugActive, onManualSave, onDebug, onRetry, isLoading 
}) => {
  const isPlaying = view === 'playing';
  const isSubSelect = view === 'sub-select';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Only trigger handleBack if we are playing and NO modals are open
        const anyModalOpen = Object.values(modals).some(v => v === true);
        if (isPlaying && !anyModalOpen) {
          handleBack();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, handleBack, modals]);

  const navButtons = [
    {id: 'identity', label: 'MC', color: 'emerald', key: 'F1', borderColor: 'border-emerald-500/30', activeColor: 'bg-emerald-500', textColor: 'text-emerald-400'},
    {id: 'harem', label: 'Harem', color: 'pink', key: 'F2', borderColor: 'border-pink-500/30', activeColor: 'bg-pink-500', textColor: 'text-pink-400'},
    {id: 'family', label: 'Family', color: 'orange', key: 'F3', borderColor: 'border-orange-500/30', activeColor: 'bg-orange-500', textColor: 'text-orange-400'},
    {id: 'social', label: 'Social', color: 'cyan', key: 'F4', borderColor: 'border-cyan-500/30', activeColor: 'bg-cyan-400', textColor: 'text-cyan-400'},
    {id: 'codex', label: 'Codex', color: 'amber', key: 'F5', borderColor: 'border-amber-500/30', activeColor: 'bg-amber-500', textColor: 'text-amber-400'},
    {id: 'library', label: 'Library', color: 'indigo', key: 'F6', borderColor: 'border-indigo-500/30', activeColor: 'bg-indigo-500', textColor: 'text-indigo-400'}
  ];

  return (
    <header className="border-b border-white/5 bg-black/60 backdrop-blur-2xl shrink-0 z-50">
      <div className="w-full px-8 h-20 flex items-center justify-between">
        <div className={`flex items-center gap-4 transition-opacity duration-500 ${isPlaying || isSubSelect ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center font-black text-black shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-transform hover:scale-105 cursor-pointer overflow-hidden border border-white/10">
            {player.avatar ? (
              <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-xl">
                {player.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-black tracking-[0.2em] uppercase text-white leading-none mb-1">{player.name}</h1>
            {isPlaying && (
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] mono text-emerald-500/80 font-black uppercase tracking-widest">{gameTime}</span>
                 </div>
                 {currentLocation && (
                   <div className="flex items-center gap-2 border-l border-white/10 pl-3">
                      <span className="text-[10px] mono text-neutral-400 font-black uppercase tracking-widest">📍 {currentLocation}</span>
                   </div>
                 )}
              </div>
            )}
            {isSubSelect && <span className="text-[10px] mono text-neutral-500 font-black uppercase tracking-widest">Thiết lập vận mệnh</span>}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isSubSelect && (
            <button onClick={() => setModals({ ...modals, customIdentity: true })} className="px-6 py-2 bg-emerald-500 text-black font-black uppercase text-xs rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <span>✨</span> Tự Chọn Thân Phận
            </button>
          )}

          {isPlaying && (
            <>
              <div className="flex flex-col items-end mr-4">
                {isSaving && (
                  <div className="flex items-center gap-2 text-emerald-500/50 mono text-[8px] font-black uppercase tracking-widest animate-pulse">
                    <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                    Đang Lưu...
                  </div>
                )}
              </div>
              <nav className="flex items-center gap-2 mr-4 border-r border-white/10 pr-4">
                {navButtons.map(btn => (
                  <button 
                    key={btn.id}
                    onClick={() => setModals({ ...modals, [btn.id]: !modals[btn.id] })}
                    className={`px-3 py-2 rounded-xl border mono text-[9px] font-black uppercase transition-all duration-300 ${modals[btn.id] ? `${btn.activeColor} text-black border-transparent` : `bg-white/5 ${btn.textColor} ${btn.borderColor} hover:bg-${btn.color}-500/10`}`}
                  >
                    {btn.label} <span className="opacity-40 ml-1">[{btn.key}]</span>
                  </button>
                ))}
              </nav>
              
              <div className="flex items-center gap-2 mr-4">
                {isDebugActive && (
                  <button 
                    onClick={() => setModals({ ...modals, debug: true })}
                    className="px-4 py-2 bg-red-600/20 border border-red-600/40 text-red-500 hover:bg-red-600 hover:text-white rounded-xl mono text-[9px] font-black uppercase transition-all shadow-[0_0_10px_rgba(220,38,38,0.1)] group/dbg"
                  >
                    Debug <span className="opacity-40 group-hover/dbg:opacity-100 ml-1">⚙</span>
                  </button>
                )}
                <button 
                  onClick={() => onManualSave()}
                  className="px-4 py-2 bg-emerald-500 text-black rounded-xl mono text-[9px] font-black uppercase hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  Lưu
                </button>
                <button onClick={() => setModals({ ...modals, history: true })} className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 rounded-xl mono text-[9px] font-black uppercase hover:bg-cyan-400 hover:text-black transition-all">Lịch Sử</button>
                <button onClick={() => setModals({ ...modals, settings: true })} className="px-4 py-2 bg-neutral-800/40 border border-white/10 text-neutral-400 rounded-xl mono text-[9px] font-black uppercase hover:bg-white hover:text-black transition-all">Cài Đặt</button>
              </div>
            </>
          )}
          
          <div className="flex items-center gap-2">
            {isPlaying && (
              <button 
                onClick={onRetry} 
                disabled={isLoading}
                className="text-[10px] mono uppercase font-black px-6 py-2 rounded-xl transition-all border border-amber-500/40 bg-amber-500/5 text-amber-500 hover:bg-amber-500 hover:text-black shadow-lg disabled:opacity-30 disabled:pointer-events-none"
              >
                <span>🔄</span> Tải Lại
              </button>
            )}
            <button onClick={handleBack} className={`text-[10px] mono uppercase font-black px-6 py-2 rounded-xl transition-all border shadow-lg ${isPlaying ? 'text-red-500 border-red-500/40 bg-red-500/5 hover:bg-red-500 hover:text-black' : 'text-white/60 border-white/20 bg-white/5 hover:bg-white/10'}`}>
              {isPlaying ? 'Thoát [ESC]' : '← Quay Lại'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
