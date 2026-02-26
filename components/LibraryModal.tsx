
import React, { useRef, useState, useEffect } from 'react';
import { Player, GameGenre, GalleryImage } from '../types';
import { uploadImage, fetchCloudinaryImages, deleteImageFromCloudinary, checkSystemHealth } from '../services/uploadService';

interface Props {
  player: Player;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePlayer: (player: Player) => void;
}

export const LibraryModal: React.FC<Props> = ({ player, isOpen, onClose, onUpdatePlayer }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cloudinaryGallery, setCloudinaryGallery] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<GameGenre | 'All'>('All');
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');
  const [systemMode, setSystemMode] = useState<'full' | 'basic'>('basic');

  useEffect(() => {
    if (isOpen) {
      initLibrary();
    }
  }, [isOpen]);

  const initLibrary = async () => {
    setIsLoading(true);
    const health = await checkSystemHealth();
    setSystemMode(health.mode);
    
    if (health.mode === 'full') {
      const images = await fetchCloudinaryImages();
      setCloudinaryGallery(images);
    }
    setIsLoading(false);
  };

  const loadGallery = async () => {
    if (systemMode !== 'full') return;
    setIsLoading(true);
    const images = await fetchCloudinaryImages();
    setCloudinaryGallery(images);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (systemMode !== 'full') {
      alert("Chế độ Cơ bản không hỗ trợ tải ảnh lên Cloudinary.");
      return;
    }
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      try {
        const uploadPromises = Array.from(files).map(file => uploadImage(file));
        const uploadedUrls = await Promise.all(uploadPromises);
        
        // Refresh gallery after upload
        await loadGallery();
        
        // Also update player gallery for local state consistency
        const newGallery = [...player.gallery];
        uploadedUrls.forEach(url => {
          if (!newGallery.find(g => g.url === url)) {
            newGallery.unshift({
              url,
              tags: [],
              genre: activeTab === 'All' ? undefined : activeTab as GameGenre
            });
          }
        });
        
        onUpdatePlayer({
          ...player,
          gallery: newGallery
        });
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Tải ảnh lên thất bại. Vui lòng kiểm tra kết nối.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeImageLocally = (url: string) => {
    const newGallery = player.gallery.filter(img => img.url !== url);
    onUpdatePlayer({ ...player, gallery: newGallery });
    // Also update local state to reflect change immediately
    setCloudinaryGallery(prev => prev.filter(img => img !== url));
  };

  const permanentDelete = async (url: string) => {
    if (systemMode !== 'full') {
      alert("Chế độ Cơ bản không hỗ trợ xóa vĩnh viễn trên Cloudinary.");
      return;
    }
    if (!confirm("BẠN CÓ CHẮC CHẮN MUỐN XÓA VĨNH VIỄN TỆP NÀY TRÊN CLOUDINARY? Thao tác này không thể hoàn tác.")) return;
    
    setIsLoading(true);
    const success = await deleteImageFromCloudinary(url);
    if (success) {
      removeImageLocally(url);
      alert("Đã xóa vĩnh viễn tệp trên Cloudinary.");
    } else {
      alert("Xóa tệp thất bại. Vui lòng thử lại sau.");
    }
    setIsLoading(false);
  };

  const setAsPcAvatar = (image: string) => {
    onUpdatePlayer({ ...player, avatar: image });
    alert("Đã cập nhật ảnh đại diện MC!");
  };

  const addTag = (url: string) => {
    if (!newTag.trim()) return;
    const newGallery = player.gallery.map(img => {
      if (img.url === url) {
        const tags = img.tags.includes(newTag.trim()) ? img.tags : [...img.tags, newTag.trim()];
        return { ...img, tags };
      }
      return img;
    });
    onUpdatePlayer({ ...player, gallery: newGallery });
    setNewTag('');
  };

  const removeTag = (url: string, tag: string) => {
    const newGallery = player.gallery.map(img => {
      if (img.url === url) {
        return { ...img, tags: img.tags.filter(t => t !== tag) };
      }
      return img;
    });
    onUpdatePlayer({ ...player, gallery: newGallery });
  };

  const setGenre = (url: string, genre: GameGenre | 'All') => {
    const newGallery = player.gallery.map(img => {
      if (img.url === url) {
        return { ...img, genre: genre === 'All' ? undefined : genre };
      }
      return img;
    });
    onUpdatePlayer({ ...player, gallery: newGallery });
  };

  // Merge Cloudinary images with player gallery metadata
  const displayGallery: GalleryImage[] = (systemMode === 'full' ? Array.from(new Set([...cloudinaryGallery, ...player.gallery.map(g => g.url)])) : player.gallery.map(g => g.url)).map(url => {
    const existing = player.gallery.find(g => g.url === url);
    return existing || { url, tags: [], genre: undefined };
  });

  // Filter by tab
  const filteredGallery = activeTab === 'All' 
    ? displayGallery 
    : displayGallery.filter(img => img.genre === activeTab);

  const tabs = ['All', ...Object.values(GameGenre)];

  return (
    <div className="fixed inset-0 z-[150] bg-neutral-950 flex flex-col animate-in fade-in duration-300 overflow-hidden">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleUpload} 
        className="hidden" 
        accept="image/*" 
        multiple
      />

      {isUploading && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
          <span className="text-indigo-500 font-black uppercase tracking-[0.4em] text-xs animate-pulse">Synchronizing_Cloud_Data...</span>
        </div>
      )}

      <div className="flex justify-between items-center p-6 border-b border-white/5 bg-indigo-500/5 shrink-0">
        <div className="flex items-center gap-6">
          <div className={`w-2 h-2 rounded-full ${systemMode === 'full' ? 'bg-indigo-500 animate-ping' : 'bg-neutral-600'}`}></div>
          <h2 className="text-sm font-black text-indigo-400 mono tracking-[0.4em] uppercase">
            [ MEDIA_GALLERY_{systemMode.toUpperCase()}_MODE ]
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-6">
            <span className="text-[8px] mono text-neutral-600 font-black uppercase tracking-widest">
              {systemMode === 'full' ? 'Gemini_Auth_Active' : 'Basic_Local_Mode'}
            </span>
            <span className="text-[10px] mono text-indigo-400/60 font-black">{displayGallery.length} Assets Detected</span>
          </div>
          
          {systemMode === 'full' && (
            <>
              <button 
                onClick={loadGallery}
                disabled={isLoading}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-indigo-400 transition-all rounded-xl border border-indigo-500/20 font-black uppercase text-[10px]"
              >
                {isLoading ? "..." : "Làm mới 🔄"}
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-6 py-2 bg-indigo-500 text-black font-black uppercase text-[10px] rounded-xl hover:bg-indigo-400 transition-all shadow-lg disabled:opacity-50"
              >
                {isUploading ? "Đang tải..." : "Nạp ảnh mới [+]"}
              </button>
            </>
          )}
          
          <button onClick={onClose} className="px-6 py-2 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all rounded-xl border border-white/10 font-black uppercase text-[10px]">
            Đóng [ESC]
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-4 bg-black/20 border-b border-white/5 overflow-x-auto custom-scrollbar shrink-0">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all whitespace-nowrap border ${
              activeTab === tab 
                ? 'bg-indigo-500 text-black border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                : 'bg-white/5 text-neutral-500 border-white/10 hover:bg-white/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar p-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center">
             <div className="w-16 h-16 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
             <span className="text-indigo-400 font-black uppercase tracking-[0.5em] animate-pulse">Accessing_Cloud_Vault...</span>
          </div>
        ) : filteredGallery.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 max-w-[140rem] mx-auto">
            {filteredGallery.map((img, idx) => (
              <div key={idx} className="group flex flex-col bg-black/40 border border-white/5 rounded-[2rem] overflow-hidden hover:border-indigo-500/50 transition-all shadow-xl">
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img src={img.url} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-sm pointer-events-none group-hover:pointer-events-auto">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setAsPcAvatar(img.url); }}
                      className="px-4 py-1.5 bg-emerald-500 text-black text-[8px] font-black uppercase rounded-lg hover:bg-emerald-400 transition-all w-28 pointer-events-auto"
                    >
                      Dùng cho MC
                    </button>
                    
                    {systemMode === 'full' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); permanentDelete(img.url); }}
                        className="px-4 py-1.5 bg-red-600 text-white text-[8px] font-black uppercase rounded-lg hover:bg-red-500 transition-all w-28 pointer-events-auto shadow-lg"
                      >
                        Xóa vĩnh viễn
                      </button>
                    )}
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeImageLocally(img.url); }}
                      className="px-4 py-1.5 bg-white/10 text-white text-[8px] font-black uppercase rounded-lg hover:bg-white/20 transition-all w-28 pointer-events-auto"
                    >
                      Ẩn khỏi máy
                    </button>
                  </div>

                  <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                    {img.genre && (
                      <span className="px-2 py-0.5 bg-indigo-500 text-black text-[7px] font-black uppercase rounded shadow-lg">
                        {img.genre}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-3 bg-black/20">
                  {/* Genre Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] mono text-neutral-600 font-black uppercase">Genre:</span>
                    <select 
                      value={img.genre || 'All'} 
                      onChange={(e) => setGenre(img.url, e.target.value as any)}
                      className="bg-white/5 border border-white/10 text-[8px] font-black text-indigo-400 uppercase rounded px-1 outline-none"
                    >
                      {tabs.map(t => <option key={t} value={t} className="bg-neutral-900">{t}</option>)}
                    </select>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 min-h-[20px]">
                    {img.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[7px] font-bold text-neutral-400 group/tag">
                        {tag}
                        <button onClick={() => removeTag(img.url, tag)} className="hover:text-red-500">×</button>
                      </span>
                    ))}
                    <button 
                      onClick={() => setEditingImage(editingImage === img.url ? null : img.url)}
                      className="text-[7px] font-black text-indigo-500 hover:text-indigo-400 uppercase"
                    >
                      {editingImage === img.url ? '[Đóng]' : '[+ Tag]'}
                    </button>
                  </div>

                  {editingImage === img.url && (
                    <div className="flex gap-1 animate-in slide-in-from-top-1">
                      <input 
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTag(img.url)}
                        placeholder="Nhập tag..."
                        className="flex-grow bg-white/5 border border-indigo-500/30 rounded px-2 py-1 text-[9px] text-white outline-none"
                      />
                      <button 
                        onClick={() => addTag(img.url)}
                        className="px-2 py-1 bg-indigo-500 text-black text-[9px] font-black rounded uppercase"
                      >
                        OK
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
            <div className="text-[12rem] mb-8 select-none font-black italic text-indigo-500">EMPTY</div>
            <h3 className="text-3xl font-black text-white mono uppercase tracking-[0.5em]">Kho ảnh trống</h3>
          </div>
        )}
      </div>
    </div>
  );
};
