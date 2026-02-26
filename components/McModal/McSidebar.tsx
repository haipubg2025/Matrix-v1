
import React from 'react';
import { Player } from '../../types';
import { MC_PERSONALITIES } from '../../constants/personalities';

interface McSidebarProps {
  player: Player;
  onAvatarClick: () => void;
  onGalleryClick: () => void;
  isEditing: boolean;
  onUpdatePlayer: (player: Player) => void;
}

export const McSidebar: React.FC<McSidebarProps> = ({ player, onAvatarClick, onGalleryClick, isEditing, onUpdatePlayer }) => {
  const handleChange = (field: keyof Player, value: any) => {
    onUpdatePlayer({ ...player, [field]: value });
  };

  return (
    <div className="w-full md:w-72 border-r border-white/10 bg-black/40 p-1 flex flex-col shrink-0 overflow-y-auto custom-scrollbar relative z-20 mono">
      <div className="relative group mb-1.5 w-full aspect-[2/3] rounded-sm border-2 border-emerald-500/20 bg-emerald-500/5 overflow-hidden shrink-0 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
        {player.avatar ? (
          <img src={player.avatar} alt={player.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-1000" />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-emerald-500/10">
            <span className="text-5xl mb-1 italic font-black">∅</span>
            <span className="text-[7px] font-black uppercase tracking-[0.2em]">Source_Empty</span>
          </div>
        )}
        
        <div onClick={onAvatarClick} className="absolute inset-0 bg-emerald-500/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer z-20 transition-opacity backdrop-blur-sm">
            <span className="text-black font-black text-[9px] uppercase tracking-[0.2em] bg-white px-2 py-1">UPLOAD_IDENTITY_SOURCE</span>
        </div>
        <button onClick={onGalleryClick} className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/80 border border-white/10 rounded-sm text-[9px] font-black uppercase text-white z-30 whitespace-nowrap shadow-xl hover:bg-emerald-500 hover:text-black transition-colors">
          THƯ VIỆN ẢNH
        </button>
      </div>

      <div className="space-y-1 px-1">
        <div className="text-center pb-2 border-b border-white/5">
          {isEditing ? (
            <div className="space-y-1">
              <input 
                value={player.title || ''} 
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full bg-white/5 border border-emerald-500/30 text-emerald-500 text-[10px] font-black uppercase text-center focus:border-emerald-500 outline-none rounded-sm px-1"
                placeholder="Danh hiệu"
              />
            </div>
          ) : (
            <>
              <p className="text-[8px] text-emerald-500/60 font-black uppercase mt-1 tracking-[0.2em]">{player.title || 'Người Vô Danh'}</p>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-1 py-1.5">

          <div className="col-span-2 flex flex-col bg-white/[0.03] p-1.5 rounded-sm border border-white/5">
            <span className="text-[7px] text-emerald-600 font-black uppercase tracking-widest">Tính cách đặc trưng</span>
            {isEditing ? (
              <div className="flex flex-wrap gap-1 mt-1 max-h-48 overflow-y-auto custom-scrollbar p-1 bg-black/20 rounded-sm">
                {MC_PERSONALITIES.map((p) => {
                  const current = (player.personality || "").split('+').map(s => s.trim()).filter(Boolean);
                  const isSelected = current.includes(p);
                  return (
                    <button
                      key={p}
                      onClick={() => {
                        const next = isSelected 
                          ? current.filter(item => item !== p)
                          : [...current, p];
                        onUpdatePlayer({ ...player, personality: next.join(' + ') });
                      }}
                      className={`px-2 py-1 rounded-sm text-[9px] font-black uppercase transition-all border ${
                        isSelected 
                          ? 'bg-emerald-500 text-black border-emerald-400' 
                          : 'bg-white/5 text-emerald-500/40 border-white/10 hover:border-emerald-500/40'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1 mt-1">
                {player.personality ? player.personality.split('+').map((p, i) => (
                  <span key={i} className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-sm text-[8px] text-emerald-400 font-black uppercase">
                    {p.trim()}
                  </span>
                )) : <span className="text-[8px] text-neutral-700 italic">Trống</span>}
              </div>
            )}
          </div>
        </div>

        <div className="py-1">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-sm relative overflow-hidden group hover:border-emerald-500 transition-colors shadow-inner">
            <div className="absolute top-0 right-0 p-0.5 opacity-10 text-[6px] font-black uppercase">Origin_Matrix</div>
            <span className="text-[7px] text-emerald-500 font-black uppercase tracking-widest block mb-1">Gia Thế / Nguồn Gốc</span>
            {isEditing ? (
              <textarea 
                value={player.lineage || ''} 
                onChange={(e) => handleChange('lineage', e.target.value)}
                className="w-full bg-transparent text-[11px] text-white font-black leading-snug italic outline-none resize-none"
                rows={2}
              />
            ) : (
              <p className="text-[11px] text-white font-black leading-snug italic">
                {player.lineage || "Thân phận ẩn danh trong Ma Trận Thực Tại"}
              </p>
            )}
          </div>
        </div>

        {(player.spiritRoot || player.physique || isEditing) && (
          <div className="grid grid-cols-1 gap-1 py-1 mt-1">
            {(player.spiritRoot || isEditing) && (
              <div className="flex flex-col bg-cyan-500/5 p-1.5 rounded-sm border border-cyan-500/20">
                <span className="text-[7px] text-cyan-500 font-black uppercase tracking-widest">❂ Linh Căn / Thiên Phú</span>
                {isEditing ? (
                  <input 
                    value={player.spiritRoot || ''} 
                    onChange={(e) => handleChange('spiritRoot', e.target.value)}
                    className="bg-transparent text-[11px] font-black text-white outline-none w-full uppercase"
                  />
                ) : (
                  <span className="text-[11px] font-black text-white uppercase tracking-tight italic truncate">{player.spiritRoot}</span>
                )}
              </div>
            )}
            {(player.physique || isEditing) && (
              <div className="flex flex-col bg-purple-500/5 p-1.5 rounded-sm border border-purple-500/20 mt-1">
                <span className="text-[7px] text-purple-500 font-black uppercase tracking-widest">🧬 Thể Chất / Huyết Mạch</span>
                {isEditing ? (
                  <input 
                    value={player.physique || ''} 
                    onChange={(e) => handleChange('physique', e.target.value)}
                    className="bg-transparent text-[11px] font-black text-white outline-none w-full uppercase"
                  />
                ) : (
                  <span className="text-[11px] font-black text-white uppercase tracking-tight italic truncate">{player.physique}</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
