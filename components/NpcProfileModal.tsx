
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Relationship, GameGenre, Player } from '../types';
import { NpcSidebarBio, NpcSocialColumn, renderSafeText } from './NpcProfileBase';
import { NpcPhysicalColumn, NpcPrivateWidget, NpcFashionWidget, NpcPhysiologyWidget } from './NpcProfileAnatomy';
import { 
  NpcRelationshipDashboard, 
  NpcPsychologyWidget, 
  NpcOpinionWidget, 
  NpcImpressionWidget, 
  NpcSecretsWidget, 
  NpcLogsWidget 
} from './NpcProfileMental';
import { uploadImage, fetchCloudinaryImages } from '../services/uploadService';

interface Props {
  npc: Relationship | null;
  player: Player;
  isOpen: boolean;
  genre?: GameGenre;
  onClose: () => void;
  onUpdateNpc: (npc: Relationship) => void;
  onSwitchNpc: (npc: Relationship) => void;
}

export const NpcProfileModal: React.FC<Props> = ({ npc, player, isOpen, genre, onClose, onUpdateNpc, onSwitchNpc }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);
  const [cloudinaryGallery, setCloudinaryGallery] = useState<string[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  
  const handlePrev = useCallback(() => {
    if (!npc || player.relationships.length <= 1) return;
    const currentIndex = player.relationships.findIndex(r => r.id === npc.id);
    const prevIndex = (currentIndex - 1 + player.relationships.length) % player.relationships.length;
    onSwitchNpc(player.relationships[prevIndex]);
  }, [npc, player.relationships, onSwitchNpc]);

  const handleNext = useCallback(() => {
    if (!npc || player.relationships.length <= 1) return;
    const currentIndex = player.relationships.findIndex(r => r.id === npc.id);
    const nextIndex = (currentIndex + 1) % player.relationships.length;
    onSwitchNpc(player.relationships[nextIndex]);
  }, [npc, player.relationships, onSwitchNpc]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !npc) return null;

  const handleOpenGallery = async () => {
    setShowGalleryPicker(true);
    setIsLoadingGallery(true);
    const images = await fetchCloudinaryImages();
    setCloudinaryGallery(images);
    setIsLoadingGallery(false);
  };

  // SỬ DỤNG STRICT CHECK ĐỂ ĐẢM BẢO NPC CHƯA GẶP KHÔNG BỊ LỘ THÔNG TIN
  const isHarem = (npc.affinity || 0) >= 600;
  const themeColor = isHarem ? 'pink' : 'cyan';

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (field: keyof Relationship, value: any) => {
    if (npc) onUpdateNpc({ ...npc, [field]: value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && npc) {
      try {
        setIsUploading(true);
        const imageUrl = await uploadImage(file);
        onUpdateNpc({ ...npc, avatar: imageUrl });
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Upload thất bại. Vui lòng kiểm tra cấu hình Cloudinary.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const selectFromGallery = (img: string) => {
    onUpdateNpc({ ...npc, avatar: img });
    setShowGalleryPicker(false);
  };

  // --- GIAO DIỆN CHO NPC ĐÃ GẶP (ĐẦY ĐỦ THÔNG TIN) ---
  return (
    <div className="fixed inset-0 z-[250] bg-[#010101] flex flex-col animate-in fade-in duration-200 overflow-hidden mono">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

      {isUploading && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
          <span className="text-emerald-500 font-black uppercase tracking-[0.4em] text-xs animate-pulse">Uploading_To_Cloudinary...</span>
        </div>
      )}

      <div className={`flex justify-between items-center px-4 py-2 border-b border-white/10 bg-${themeColor}-500/[0.06] backdrop-blur-3xl shrink-0`}>
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full bg-${themeColor}-500 shadow-[0_0_8px_currentColor] animate-pulse`}></div>
          
          {/* NAVIGATION BUTTONS */}
          <div className="flex items-center gap-1 mr-2">
            <button onClick={handlePrev} className={`w-7 h-7 flex items-center justify-center bg-white/5 hover:bg-${themeColor}-500/20 border border-white/10 rounded-full transition-all text-neutral-400 hover:text-${themeColor}-400`}>
              ❮
            </button>
            <button onClick={handleNext} className={`w-7 h-7 flex items-center justify-center bg-white/5 hover:bg-${themeColor}-500/20 border border-white/10 rounded-full transition-all text-neutral-400 hover:text-${themeColor}-400`}>
              ❯
            </button>
          </div>

          <div className="flex items-baseline">
            {isEditing ? (
              <input 
                value={npc.name} 
                onChange={(e) => handleChange('name', e.target.value)}
                className={`bg-transparent text-base font-black text-${themeColor}-400 tracking-tight uppercase outline-none border-b border-${themeColor}-500/30 focus:border-${themeColor}-500`}
              />
            ) : (
              <h2 className={`text-base font-black text-${themeColor}-400 tracking-tight uppercase`}>
                HỒ SƠ THỰC THỂ // {npc.name}
              </h2>
            )}
            {/* THÔNG TIN CHI TIẾT SAU TÊN */}
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/10 h-4">
               {isEditing ? (
                 <>
                   <select 
                     value={npc.gender} 
                     onChange={(e) => handleChange('gender', e.target.value)}
                     className={`bg-transparent text-[11px] font-black outline-none ${npc.gender === 'Nữ' ? 'text-pink-500' : 'text-blue-500'}`}
                   >
                     <option value="Nam" className="bg-neutral-900">Nam</option>
                     <option value="Nữ" className="bg-neutral-900">Nữ</option>
                     <option value="Khác" className="bg-neutral-900">Khác</option>
                   </select>
                   <input 
                     type="number"
                     value={npc.age} 
                     onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
                     className="bg-transparent text-[10px] font-black text-white outline-none w-12 border-b border-white/10"
                   />
                   <input 
                     value={npc.birthday || ''} 
                     onChange={(e) => handleChange('birthday', e.target.value)}
                     className="bg-transparent text-[9px] mono font-bold text-neutral-500 uppercase outline-none w-20 border-b border-white/10"
                   />
                 </>
               ) : (
                 <>
                   <span className={`text-[11px] font-black ${npc.gender === 'Nữ' ? 'text-pink-500' : 'text-blue-500'}`}>
                      {npc.gender === 'Nữ' ? '♀' : '♂'}
                   </span>
                   <span className="text-[10px] font-black text-white/70 uppercase">
                      {npc.age} Tuổi
                   </span>
                   <span className="text-[9px] mono font-bold text-neutral-500 uppercase tracking-tighter">
                      [{npc.birthday}]
                   </span>
                 </>
               )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
           {/* NHÃN NPC - QUẢN LÝ TRẠNG THÁI & PHÂN LOẠI */}
           <div className="hidden md:flex items-center gap-1.5 mr-2">
              {isEditing ? (
                <>
                  <select 
                    value={npc.type} 
                    onChange={(e) => handleChange('type', e.target.value)}
                    className={`px-2 py-0.5 rounded-sm text-[9px] font-black border border-${themeColor}-500/30 bg-black text-${themeColor}-400 uppercase outline-none`}
                  >
                    <option value="harem">Hậu Cung</option>
                    <option value="social">Xã Hội</option>
                  </select>
                  <input 
                    value={npc.status || ''} 
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="px-2 py-0.5 rounded-sm text-[9px] font-black border border-cyan-500/30 bg-black text-cyan-400 uppercase outline-none w-32"
                    placeholder="Hoạt động"
                  />
                  <input 
                    value={npc.lastLocation || ''} 
                    onChange={(e) => handleChange('lastLocation', e.target.value)}
                    className="px-2 py-0.5 rounded-sm text-[9px] font-black border border-indigo-500/30 bg-black text-indigo-400 uppercase outline-none w-32"
                    placeholder="Vị trí"
                  />
                  <input 
                    value={npc.familyRole || ''} 
                    onChange={(e) => handleChange('familyRole', e.target.value)}
                    className="px-2 py-0.5 rounded-sm text-[9px] font-black border border-amber-500/30 bg-black text-amber-400 uppercase outline-none w-24"
                    placeholder="Vai trò"
                  />
                  <input 
                    value={npc.powerLevel || ''} 
                    onChange={(e) => handleChange('powerLevel', e.target.value)}
                    className="px-2 py-0.5 rounded-sm text-[9px] font-black border border-white/10 bg-black text-neutral-300 uppercase outline-none w-20"
                    placeholder="Sức mạnh"
                  />
                </>
              ) : (
                <>
                  <span className={`px-2 py-0.5 rounded-sm text-[9px] font-black border border-${themeColor}-500/30 bg-${themeColor}-500/10 text-${themeColor}-400 uppercase tracking-tighter shadow-sm`}>
                    {isHarem ? 'Hậu Cung' : 'Xã Hội'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-sm text-[9px] font-black border ${npc.isPresent ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'border-neutral-500/30 bg-neutral-500/10 text-neutral-400'} uppercase tracking-tighter`}>
                    {npc.isPresent ? 'Hiện Diện' : 'Vắng Mặt'}
                  </span>
                  {npc.status && (
                    <span className="px-2 py-0.5 rounded-sm text-[9px] font-black border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 uppercase tracking-tighter">
                      {npc.status}
                    </span>
                  )}
                  {npc.lastLocation && (
                    <span className="px-2 py-0.5 rounded-sm text-[9px] font-black border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 uppercase tracking-tighter">
                      📍 {npc.lastLocation}
                    </span>
                  )}
                  {npc.familyRole && (
                    <span className="px-2 py-0.5 rounded-sm text-[9px] font-black border border-amber-500/30 bg-amber-500/10 text-amber-400 uppercase tracking-tighter">
                      {npc.familyRole}
                    </span>
                  )}
                  {npc.powerLevel && npc.powerLevel !== '??' && (
                    <span className="px-2 py-0.5 rounded-sm text-[9px] font-black border border-white/10 bg-white/5 text-neutral-300 uppercase tracking-tighter">
                      {npc.powerLevel}
                    </span>
                  )}
                </>
              )}
           </div>

           <button 
             onClick={() => setIsEditing(!isEditing)} 
             className={`px-4 py-1.5 transition-all rounded-sm border font-black uppercase text-sm shadow-xl active:scale-95 ${
               isEditing 
                 ? `bg-${themeColor}-500 text-black border-${themeColor}-400` 
                 : 'bg-white/5 text-neutral-400 border-white/10 hover:bg-white/10'
             }`}
           >
             {isEditing ? '💾 LƯU' : '✎ SỬA'}
           </button>

           <button onClick={onClose} className="px-4 py-1.5 bg-white/5 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-all rounded-sm border border-white/10 font-black uppercase text-sm shadow-xl active:scale-95">
             [ESC] ĐÓNG
           </button>
        </div>
      </div>

      <div className="flex flex-grow overflow-hidden relative">
        {showGalleryPicker && (
          <div className="absolute inset-0 z-50 bg-black/98 backdrop-blur-3xl p-3 overflow-y-auto custom-scrollbar animate-in zoom-in duration-150">
             <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
                <h3 className="text-xl font-black text-indigo-400 uppercase tracking-widest">KHO ẢNH CLOUDINARY</h3>
                <button onClick={() => setShowGalleryPicker(false)} className="text-sm font-black uppercase bg-white/5 px-3 py-1.5 rounded-sm border border-white/10">QUAY LẠI</button>
             </div>
             
             {isLoadingGallery ? (
               <div className="h-64 flex flex-col items-center justify-center">
                 <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                 <span className="mono text-[10px] text-indigo-400 font-black uppercase animate-pulse">Retrieving_Cloud_Assets...</span>
               </div>
             ) : (
               <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-1.5">
                  {/* Show Cloudinary Images */}
                  {cloudinaryGallery.map((img, idx) => (
                    <div key={`cloud-${idx}`} onClick={() => selectFromGallery(img)} className="aspect-[2/3] rounded-sm overflow-hidden border border-white/10 hover:border-emerald-500 cursor-pointer transition-all group relative">
                      <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  ))}
                  
                  {/* Fallback to local gallery if needed */}
                  {cloudinaryGallery.length === 0 && player.gallery.map((img, idx) => (
                    <div key={`local-${idx}`} onClick={() => selectFromGallery(img.url)} className="aspect-[2/3] rounded-sm overflow-hidden border border-white/10 hover:border-emerald-500 cursor-pointer transition-all">
                      <img src={img.url} alt="Gallery" className="w-full h-full object-cover" />
                    </div>
                  ))}
               </div>
             )}
          </div>
        )}

        {/* SIDEBAR */}
        <div className="w-80 border-r border-white/10 bg-black/40 flex flex-col shrink-0 overflow-y-auto custom-scrollbar p-1.5">
          <div className="relative group mb-1.5 w-full aspect-[2/3] rounded-sm border border-white/10 bg-neutral-900 overflow-hidden shrink-0">
            {npc.avatar ? (
              <img src={npc.avatar} alt={npc.name} className="w-full h-full object-cover" />
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                <span className="text-7xl font-black text-white italic">?</span>
                <span className="text-[10px] mono font-black uppercase tracking-widest mt-4">UNKNOWN_SOURCE</span>
              </div>
            )}
            
            <div onClick={handleAvatarClick} className={`absolute inset-0 bg-${themeColor}-500/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer z-20 transition-opacity backdrop-blur-sm`}>
                <span className="text-white font-black text-sm uppercase bg-black/60 px-4 py-2 rounded-sm">TẢI ẢNH MỚI</span>
            </div>
            <button onClick={handleOpenGallery} className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/80 border border-white/10 rounded-sm text-sm font-black uppercase text-white z-30 whitespace-nowrap shadow-xl">
              THƯ VIỆN ẢNH
            </button>
          </div>

          <NpcSidebarBio 
            npc={npc} 
            themeColor={themeColor} 
            genre={genre} 
            isEditing={isEditing}
            onUpdateNpc={onUpdateNpc}
          />
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-grow p-1.5 overflow-y-auto custom-scrollbar relative">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-1.5 items-start">
              <div className="space-y-1.5">
                  <NpcRelationshipDashboard 
                    npc={npc} 
                    isEditing={isEditing}
                    onUpdateNpc={onUpdateNpc}
                  />
                  <NpcFashionWidget 
                    npc={npc} 
                    isEditing={isEditing}
                    onUpdateNpc={onUpdateNpc}
                  />
                  <NpcPhysiologyWidget 
                    npc={npc} 
                    isEditing={isEditing}
                    onUpdateNpc={onUpdateNpc}
                  />
                  <NpcSocialColumn 
                    npc={npc} 
                    player={player} 
                    onSwitchNpc={onSwitchNpc} 
                    isEditing={isEditing}
                    onUpdateNpc={onUpdateNpc}
                  />
                  <NpcLogsWidget 
                    npc={npc} 
                    isEditing={isEditing}
                    onUpdateNpc={onUpdateNpc}
                  />
              </div>

              <div className="space-y-1.5">
                  <NpcPhysicalColumn 
                    npc={npc} 
                    themeColor={themeColor} 
                    isEditing={isEditing}
                    onUpdateNpc={onUpdateNpc}
                  />
              </div>

              <div className="space-y-1.5">
                  <NpcOpinionWidget 
                    npc={npc} 
                    isEditing={isEditing}
                    onUpdateNpc={onUpdateNpc}
                  />
                  <NpcPsychologyWidget 
                    npc={npc} 
                    isEditing={isEditing}
                    onUpdateNpc={onUpdateNpc}
                  />
                  <NpcImpressionWidget 
                    npc={npc} 
                    themeColor={themeColor} 
                    isEditing={isEditing}
                    onUpdateNpc={onUpdateNpc}
                  />
                  <NpcSecretsWidget 
                    npc={npc} 
                    isEditing={isEditing}
                    onUpdateNpc={onUpdateNpc}
                  />
                  <NpcPrivateWidget 
                    npc={npc} 
                    isEditing={isEditing}
                    onUpdateNpc={onUpdateNpc}
                  />
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};
