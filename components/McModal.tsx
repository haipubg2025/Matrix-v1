
import React, { useRef, useState } from 'react';
import { Player, GameGenre, getGenreMeta } from '../types';
import { McHeader } from './McModal/McHeader';
import { McStatsGrid } from './McModal/McStatsGrid';
import { McInspector, InspectType } from './McModal/McInspector';
import { McSidebar } from './McModal/McSidebar';
import { McQuestPanel } from './McModal/McQuestPanel';
import { McAssetPanel } from './McModal/McAssetPanel';
import { McSkillPanel } from './McModal/McSkillPanel';
import { McInventoryPanel } from './McModal/McInventoryPanel';
import { uploadImage, fetchCloudinaryImages } from '../services/uploadService';

interface Props {
  player: Player;
  genre?: GameGenre;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePlayer: (player: Player) => void;
}

export const McModal: React.FC<Props> = ({ player, genre, isOpen, onClose, onUpdatePlayer }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);
  const [cloudinaryGallery, setCloudinaryGallery] = useState<string[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [inspectingItem, setInspectingItem] = useState<{ 
    name: string; 
    type: InspectType; 
    description?: string;
    reward?: string;
    status?: string;
    questGroup?: string;
    questKind?: string;
    progress?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleOpenGallery = async () => {
    setShowGalleryPicker(true);
    setIsLoadingGallery(true);
    const images = await fetchCloudinaryImages();
    setCloudinaryGallery(images);
    setIsLoadingGallery(false);
  };

  const selectFromGallery = (img: string) => {
    onUpdatePlayer({ ...player, avatar: img });
    setShowGalleryPicker(false);
  };

  const meta = getGenreMeta(genre);
  const hasSystem = !!player.systemName;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        const imageUrl = await uploadImage(file);
        
        const existing = player.gallery.find(g => g.url === imageUrl);
        const newGallery = existing 
          ? player.gallery 
          : [{ url: imageUrl, tags: [], genre: genre }, ...player.gallery];
          
        onUpdatePlayer({
          ...player,
          avatar: imageUrl,
          gallery: newGallery
        });
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Upload thất bại. Vui lòng kiểm tra cấu hình Cloudinary.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-[#020202] flex flex-col animate-in fade-in duration-300 overflow-hidden mono selection:bg-emerald-500 selection:text-black">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
      
      {isUploading && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
          <span className="text-emerald-500 font-black uppercase tracking-[0.4em] text-xs animate-pulse">Uploading_To_Cloudinary...</span>
        </div>
      )}

      {showGalleryPicker && (
        <div className="fixed inset-0 z-[1000] bg-black/98 backdrop-blur-3xl p-6 overflow-y-auto custom-scrollbar animate-in zoom-in duration-150 flex flex-col">
           <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <h3 className="text-2xl font-black text-emerald-400 uppercase tracking-widest italic">KHO ẢNH CLOUDINARY // MC_ASSETS</h3>
              <button onClick={() => setShowGalleryPicker(false)} className="text-xs font-black uppercase bg-white/5 px-4 py-2 rounded-sm border border-white/10 hover:bg-rose-500/20 hover:text-rose-400 transition-all">QUAY LẠI [ESC]</button>
           </div>
           
           {isLoadingGallery ? (
             <div className="flex-grow flex flex-col items-center justify-center">
               <div className="w-12 h-12 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
               <span className="mono text-[10px] text-emerald-400 font-black uppercase animate-pulse tracking-[0.5em]">Retrieving_Cloud_Assets...</span>
             </div>
           ) : (
             <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                {cloudinaryGallery.map((img, idx) => (
                  <div key={`cloud-${idx}`} onClick={() => selectFromGallery(img)} className="aspect-[2/3] rounded-sm overflow-hidden border border-white/10 hover:border-emerald-500 cursor-pointer transition-all group relative shadow-2xl">
                    <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <span className="bg-black/80 text-white text-[8px] font-black px-2 py-1 uppercase">Chọn Ảnh</span>
                    </div>
                  </div>
                ))}
                
                {cloudinaryGallery.length === 0 && player.gallery.map((img, idx) => (
                  <div key={`local-${idx}`} onClick={() => selectFromGallery(img.url)} className="aspect-[2/3] rounded-sm overflow-hidden border border-white/10 hover:border-emerald-500 cursor-pointer transition-all group relative">
                    <img src={img.url} alt="Gallery" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <span className="bg-black/80 text-white text-[8px] font-black px-2 py-1 uppercase">Chọn Ảnh</span>
                    </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      )}
      
      <div className="absolute inset-0 pointer-events-none opacity-10 z-0">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05),transparent_70%)]"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <McHeader 
          player={player} 
          genre={genre} 
          onClose={onClose} 
          isEditing={isEditing}
          onToggleEdit={() => setIsEditing(!isEditing)}
          onUpdatePlayer={onUpdatePlayer}
        />

        <div className="flex flex-col md:flex-row flex-grow overflow-hidden relative">
          
          {inspectingItem && (
            <McInspector 
              item={inspectingItem} 
              player={player} 
              onClose={() => setInspectingItem(null)} 
            />
          )}

          <McSidebar 
            player={player} 
            onAvatarClick={() => fileInputRef.current?.click()} 
            onGalleryClick={handleOpenGallery}
            isEditing={isEditing}
            onUpdatePlayer={onUpdatePlayer}
          />

          <div className="flex-grow p-2 overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.02),transparent)] relative z-20">
            <div className="w-full space-y-2.5">
              
              <section className="space-y-2">
                <div className="flex items-center gap-3 px-1">
                  <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">❯ THUỘC TÍNH BẢN THỂ TỐI THƯỢNG</span>
                  <div className="h-px flex-grow bg-white/10"></div>
                </div>
                <McStatsGrid 
                  player={player} 
                  genre={genre} 
                  isEditing={isEditing}
                  onUpdatePlayer={onUpdatePlayer}
                />
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
                <McQuestPanel 
                  quests={player.quests} 
                  hasSystem={hasSystem} 
                  systemName={player.systemName || "Thế giới"} 
                  onInspect={setInspectingItem} 
                  playerLevel={player.level}
                  isEditing={isEditing}
                  onUpdatePlayer={(updates) => onUpdatePlayer({ ...player, ...updates })}
                />

                <McAssetPanel 
                  gold={player.gold} 
                  assets={player.assets || []} 
                  currency={meta.currency} 
                  onInspect={setInspectingItem} 
                  isEditing={isEditing}
                  onUpdatePlayer={(updates) => onUpdatePlayer({ ...player, ...updates })}
                />

                <McSkillPanel 
                  skills={player.skills || []} 
                  skillLabel={meta.skillLabel} 
                  onInspect={setInspectingItem} 
                  isEditing={isEditing}
                  onUpdatePlayer={(updates) => onUpdatePlayer({ ...player, ...updates })}
                />

                <McInventoryPanel 
                  inventory={player.inventory || []} 
                  onInspect={setInspectingItem} 
                  isEditing={isEditing}
                  onUpdatePlayer={(updates) => onUpdatePlayer({ ...player, ...updates })}
                />
              </div>
              
              <section className="pt-3 border-t border-white/5 text-center opacity-30">
                 <span className="text-[8px] mono text-neutral-700 font-black uppercase tracking-[0.5em] italic">Neural_Encryption_Active // Identity_Verified_By_Quantum_Core</span>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
