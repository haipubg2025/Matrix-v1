
import React, { useEffect, useState } from 'react';
import { GAME_ARCHETYPES } from '../constants';
import { dbService, SaveMetadata } from '../services/dbService';
import { Player } from '../types';

interface Props {
  player: Player;
  onStart: () => void;
  onContinue: () => void;
  onOpenSaveManager: () => void;
  onOpenSettings: () => void;
  onDebug: () => void;
}

const FALLBACK_BEAUTIES = [
  { name: "Lâm Nhã Thi", title: "Tần Phu Nhân", genre: "Đô Thị", color: "from-pink-500", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop" },
  { name: "Diệp Tử Yên", title: "Thần Y Trẻ Tuổi", genre: "Tu Tiên", color: "from-emerald-500", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop" },
  { name: "Tần Tuyết Dao", title: "CEO Băng Lãnh", genre: "Đô Thị", color: "from-blue-500", img: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=800&auto=format&fit=crop" },
  { name: "Thánh Nữ Dao Trì", title: "Thiên Kiêu", genre: "Tu Tiên", color: "from-purple-500", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop" },
  { name: "Mạn Ny", title: "Ảnh Hậu", genre: "Đô Thị", color: "from-rose-500", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop" },
  { name: "Hàn Tuyết", title: "Nữ Thần Băng Giá", genre: "Fantasy", color: "from-cyan-500", img: "https://images.unsplash.com/photo-1503104834685-7205e8607eb9?w=800&auto=format&fit=crop" },
  { name: "Tô Mỹ nhân", title: "Tiên Tử Hạ Giới", genre: "Tu Tiên", color: "from-yellow-500", img: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&auto=format&fit=crop" },
  { name: "Vương Yến", title: "Đệ Nhất Kiếm Hiệp", genre: "Võ Lâm", color: "from-red-500", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop" },
];

export const LandingView: React.FC<Props> = ({ player, onStart, onContinue, onOpenSaveManager, onOpenSettings, onDebug }) => {
  const [latestSave, setLatestSave] = useState<SaveMetadata | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const displayList = player.gallery.length > 0 
    ? player.gallery.map((img, idx) => ({
        name: `Thực Thể #${(idx + 1).toString().padStart(3, '0')}`,
        title: "Dữ liệu nạp từ bộ nhớ",
        genre: img.genre || "ARCHIVE",
        color: "from-emerald-500",
        img: img.url
      }))
    : FALLBACK_BEAUTIES;

  useEffect(() => {
    const checkSave = async () => {
      const latest = await dbService.getLatestSave();
      if (latest) setLatestSave(latest.data.metadata);
    };
    checkSave();
  }, []);

  // Fix: changed s.initialChoices.length to s.scenarios.length as initialChoices is not a property of SubScenario
  const totalScenarios = GAME_ARCHETYPES.reduce((acc, w) => 
    acc + w.subScenarios.reduce((sAcc, s) => sAcc + s.scenarios.length, 0), 0
  );

  return (
    <div className="absolute inset-0 bg-[#020202] flex flex-col md:flex-row animate-in fade-in duration-1000 overflow-hidden font-sans">
      
      {/* 1. DYNAMIC BACKGROUND EFFECTS */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px] animate-pulse delay-1000"></div>
        
        {/* Moving Grid Lines */}
        <div className="h-full w-full opacity-10 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>
        
        {/* Scanning Line Effect */}
        <div className="absolute left-0 w-full h-[1px] bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-scan"></div>
      </div>

      {/* 2. LEFT SIDEBAR: QUANTUM CONSOLE */}
      <div className="w-full md:w-[28rem] border-r border-white/10 bg-black/40 backdrop-blur-3xl p-10 flex flex-col justify-between relative z-20 shrink-0 shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
        
        <div className="space-y-12">
          {/* BRANDING AREA */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-emerald-500/5 rounded-2xl blur-xl group-hover:bg-emerald-500/10 transition-all duration-500"></div>
            <div className="relative flex items-center gap-5">
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-3xl font-black text-black shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-float">M</div>
              <div>
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">
                  <span className="text-emerald-500 text-glow">MATRIX</span>
                </h2>
                <div className="flex items-center gap-2 mt-3">
                   <div className="h-0.5 w-12 bg-emerald-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN NAV HUD */}
          <nav className="flex flex-col gap-4">
            <button 
              onClick={onStart} 
              className="group relative p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl text-left hover:border-emerald-500 hover:bg-emerald-500/10 transition-all overflow-hidden shadow-lg active:scale-95"
            >
              <div className="absolute left-0 top-0 w-1 h-full bg-emerald-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              <div className="flex justify-between items-center relative z-10">
                <div className="space-y-1">
                  <span className="mono text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400 block group-hover:text-white transition-colors">Khởi Chạy Vận Mệnh</span>
                  <span className="text-[9px] mono text-neutral-600 font-bold uppercase block">Kịch Bản Phân Nhánh: {totalScenarios.toLocaleString()}</span>
                </div>
                <span className="text-2xl opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">❯</span>
              </div>
              <div className="absolute right-[-10%] bottom-[-20%] text-6xl font-black text-emerald-500/5 rotate-12 pointer-events-none group-hover:text-emerald-500/10 transition-all">START</div>
            </button>

            <button 
              onClick={onContinue} 
              disabled={!latestSave} 
              className={`group relative p-5 bg-blue-500/5 border border-blue-500/20 rounded-2xl text-left transition-all overflow-hidden shadow-lg active:scale-95 ${latestSave ? 'hover:border-blue-400 hover:bg-blue-500/10' : 'opacity-20 grayscale cursor-not-allowed'}`}
            >
              <div className="absolute left-0 top-0 w-1 h-full bg-blue-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              <div className="flex justify-between items-center relative z-10">
                <div className="space-y-1">
                  <span className="mono text-[11px] font-black uppercase tracking-[0.2em] text-blue-400 block group-hover:text-white transition-colors">Tiếp Tục Thực Tại</span>
                  {latestSave ? (
                    <span className="text-[9px] mono text-blue-500/40 font-bold uppercase block truncate max-w-[15rem]">{latestSave.playerName} // Lượt {latestSave.turnCount}</span>
                  ) : (
                    <span className="text-[9px] mono text-neutral-700 font-bold uppercase block">Không tìm thấy tệp lưu</span>
                  )}
                </div>
                <span className="text-2xl opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">❯</span>
              </div>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={onOpenSaveManager} 
                className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-amber-500/10 hover:border-amber-500/50 transition-all text-center group active:scale-95 shadow-md"
              >
                <span className="block text-lg mb-1 group-hover:scale-110 transition-transform">💾</span>
                <span className="mono text-[9px] font-black text-neutral-500 group-hover:text-amber-400 uppercase tracking-widest">Dữ Liệu</span>
              </button>
              <button 
                onClick={onOpenSettings} 
                className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/40 transition-all text-center group active:scale-95 shadow-md"
              >
                <span className="block text-lg mb-1 group-hover:scale-110 transition-transform">⚙️</span>
                <span className="mono text-[9px] font-black text-neutral-500 group-hover:text-white uppercase tracking-widest">Cấu Hình</span>
              </button>
            </div>
          </nav>

          {/* SYSTEM METRICS BOX */}
          <div className="p-6 bg-black/40 border border-white/5 rounded-3xl relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-700">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/10"></div>
             <span className="text-[9px] mono text-emerald-500/40 font-black uppercase block mb-4 tracking-[0.3em] flex items-center gap-2">
                <div className="w-1 h-1 bg-emerald-500 animate-ping"></div>
                Trạng_Thái_Ma_Trận
             </span>
             <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] mono text-neutral-500 font-bold uppercase">Mỹ Nhân Đồ:</span>
                  <span className="text-xs font-black text-white mono">{player.gallery.length} Thực thể</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] mono text-neutral-500 font-bold uppercase">Linh Lực Lõi:</span>
                  <span className="text-xs font-black text-emerald-400 mono animate-pulse">STABLE</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-2">
                   <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" style={{width: '94%'}}></div>
                </div>
             </div>
          </div>
        </div>

        {/* VERSION & CONSOLE LINK */}
        <div className="flex justify-between items-center px-2">
           <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
              <span className="text-[10px] mono text-neutral-700 font-black uppercase tracking-widest italic">Matrix_OS v1 by Thích Ma Đạo</span>
           </div>
           <button 
            onClick={onDebug} 
            className="text-[10px] mono text-neutral-800 hover:text-red-500 transition-all uppercase font-black px-3 py-1 bg-white/[0.02] border border-white/5 rounded-md hover:bg-red-500/10 hover:border-red-500/30"
           >
            [#] CONSOLE
           </button>
        </div>
      </div>

      {/* 3. RIGHT AREA: BEAUTY GALLERY HOLOGRAM GRID */}
      <div className="flex-grow relative flex flex-col bg-[#050505]/40 overflow-hidden">
        {/* Header HUD - Minimalist */}
        <div className="p-10 pb-4 z-10 flex justify-between items-end relative shrink-0">
           <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 bg-emerald-500 text-black text-[8px] mono font-black uppercase tracking-[0.2em] rounded-sm">ACTIVE_SCAN</span>
                <h4 className="text-[11px] mono font-black text-emerald-500 uppercase tracking-[0.5em]">Mỹ Nhân Đồ // Archive_01</h4>
              </div>
              <h2 className="text-6xl font-black text-white uppercase tracking-tighter italic opacity-90 leading-none">PHÒNG_TRƯNG_BÀY</h2>
           </div>
           <div className="text-right flex flex-col items-end gap-3">
              <div className="px-4 py-2 bg-black/60 border border-white/5 rounded-xl backdrop-blur-md">
                 <span className="text-[10px] mono font-black text-emerald-400 uppercase tracking-widest italic">Mật Độ Bộ Nhớ: <span className="text-white">CAO</span></span>
              </div>
              <div className="flex gap-1.5">
                {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="w-1.5 h-1.5 bg-emerald-500/30 rounded-full animate-pulse" style={{animationDelay: `${i*150}ms`}}></div>)}
              </div>
           </div>
        </div>

        {/* Hologram Card Grid */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-10 pt-2 overscroll-contain">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-5 md:gap-6">
            {displayList.map((beauty, i) => (
              <div 
                key={i}
                className="relative group transition-all duration-700 hover:z-20 perspective-1000"
                style={{ 
                  animationDelay: `${i * 60}ms`,
                  animation: 'fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  opacity: 0
                }}
              >
                {/* 3D Tilt Effect Wrapper */}
                <div className="relative transition-all duration-700 group-hover:scale-110 group-hover:-translate-y-4">
                  
                  {/* Outer Glow */}
                  <div className={`absolute -inset-1 bg-gradient-to-t ${beauty.color} to-transparent blur-[20px] opacity-0 group-hover:opacity-60 transition-opacity duration-700`}></div>
                  
                  {/* Card Frame */}
                  <div className="relative aspect-[2/3] rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden shadow-2xl group-hover:border-emerald-500/50 transition-all duration-700">
                    
                    {/* Character Image */}
                    <img 
                      src={beauty.img} 
                      alt={beauty.name} 
                      className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-125 brightness-75 group-hover:brightness-100"
                    />
                    
                    {/* Holographic Scan Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-700">
                       <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#fff_2px,#fff_3px)]"></div>
                    </div>

                    {/* HUD Elements on Image */}
                    <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-[-10px] group-hover:translate-y-0">
                       <div className="flex flex-col gap-1">
                          <div className="w-6 h-0.5 bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                          <span className="text-[7px] mono font-black text-emerald-400 uppercase">IDENT_VERIFIED</span>
                       </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="absolute bottom-5 left-5 right-5 translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                       <div className="flex items-center gap-2 mb-2">
                          <span className="text-[7px] mono font-black text-black bg-emerald-500 px-1.5 py-0.5 rounded-sm uppercase tracking-tighter shadow-lg">
                            {beauty.genre}
                          </span>
                       </div>
                       <h3 className="text-[13px] font-black text-white uppercase tracking-tighter leading-tight group-hover:text-emerald-400 transition-colors drop-shadow-xl truncate">
                         {beauty.name}
                       </h3>
                       <p className="text-neutral-500 mono text-[8px] font-bold uppercase mt-1 tracking-widest truncate opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                         {beauty.title}
                       </p>
                    </div>

                    {/* Corner Borders */}
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-500/0 group-hover:border-emerald-500/40 rounded-tr-2xl transition-all duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-500/0 group-hover:border-emerald-500/40 rounded-bl-2xl transition-all duration-700"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-32"></div>
        </div>

        {/* DECORATIVE HUD BACKGROUND TEXT */}
        <div className="absolute bottom-10 right-10 flex flex-col items-end opacity-[0.03] pointer-events-none z-0 select-none">
           <span className="mono text-sm font-black text-emerald-500 uppercase tracking-[2em] mb-4 italic">GENESIS_PROTOCOL_ACTIVE</span>
           <span className="mono text-[250px] font-black text-white uppercase leading-none">MA_TRẬN</span>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .text-glow {
          text-shadow: 0 0 20px rgba(16, 185, 129, 0.6);
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.01);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </div>
  );
};
