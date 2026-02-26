
import React, { useState, useRef } from 'react';
import { AppSettings, AiModel } from '../types';
import { Trash2, Plus, Upload, ShieldCheck, Cpu, Zap, RefreshCw } from 'lucide-react';
import { gameAI } from '../services/geminiService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
}

type Tab = 'general' | 'api';

const PRESET_COLORS = [
  { name: 'Lục bảo (Default)', hex: '#10b981' },
  { name: 'Thiên thanh', hex: '#0ea5e9' },
  { name: 'Hoa hồng', hex: '#f43f5e' },
  { name: 'Hổ phách', hex: '#f59e0b' },
  { name: 'Tím thạch anh', hex: '#8b5cf6' },
  { name: 'Ngọc bích', hex: '#06b6d4' },
];

export const SettingsModal: React.FC<Props> = ({ isOpen, onClose, settings, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [newKey, setNewKey] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const maxBudget = settings.aiModel === AiModel.PRO ? 32768 : 24576;

  const handleAddKey = () => {
    if (!newKey.trim()) return;
    
    // Split by newlines, commas, or spaces to support bulk pasting
    const extractedKeys = newKey
      .split(/[\n,\r\s]+/)
      .map(k => k.trim())
      .filter(k => k.length > 20); // Basic validation for Gemini keys (usually ~39-40 chars)

    if (extractedKeys.length === 0) {
      setNewKey('');
      return;
    }

    const currentKeys = settings.userApiKeys || [];
    const uniqueNewKeys = extractedKeys.filter(k => !currentKeys.includes(k));
    
    if (uniqueNewKeys.length > 0) {
      onUpdateSettings({ userApiKeys: [...currentKeys, ...uniqueNewKeys] });
      gameAI.resetBlacklist(); // Reset blacklist on manual change
    }
    
    setNewKey('');
  };

  const handleRemoveKey = (keyToRemove: string) => {
    const currentKeys = settings.userApiKeys || [];
    onUpdateSettings({ userApiKeys: currentKeys.filter(k => k !== keyToRemove) });
    gameAI.resetBlacklist(); // Reset blacklist on manual change
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      // Extract keys (assuming one per line or comma separated)
      const extractedKeys = content
        .split(/[\n,\r]+/)
        .map(k => k.trim())
        .filter(k => k.length > 20); // Basic validation for Gemini keys

      const currentKeys = settings.userApiKeys || [];
      const uniqueNewKeys = extractedKeys.filter(k => !currentKeys.includes(k));
      
      if (uniqueNewKeys.length > 0) {
        onUpdateSettings({ userApiKeys: [...currentKeys, ...uniqueNewKeys] });
        gameAI.resetBlacklist(); // Reset blacklist on manual change
      }
      
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const handleResetBlacklist = () => {
    gameAI.resetBlacklist();
    alert("Đã làm mới danh sách lỗi. Tất cả các Key sẽ được thử lại.");
  };

  return (
    <div className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-1 md:p-2 animate-in zoom-in duration-300">
      <div className="w-[99%] h-[99%] bg-[#080808] border border-white/10 rounded-2xl shadow-[0_0_120px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col">
        
        <div className="flex shrink-0 border-b border-white/5 bg-black/40 px-8 items-center justify-between">
          <div className="flex gap-1">
            <button 
              onClick={() => setActiveTab('general')}
              className={`py-5 px-8 mono text-xs font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === 'general' ? 'text-emerald-400' : 'text-neutral-600 hover:text-neutral-300'}`}
            >
              Cấu hình Chung
              {activeTab === 'general' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 shadow-[0_0_10px_currentColor]"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('api')}
              className={`py-5 px-8 mono text-xs font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === 'api' ? 'text-emerald-400' : 'text-neutral-600 hover:text-neutral-300'}`}
            >
              Ma Trận API
              {activeTab === 'api' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 shadow-[0_0_10px_currentColor]"></div>}
            </button>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
             <span className="mono text-[10px] text-neutral-700 font-black uppercase tracking-widest">Reality_Sync_v20.5_MultiCore</span>
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar p-6 md:px-12 md:py-8 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.03),transparent)]">
          <div className="max-w-full mx-auto w-full">
            {activeTab === 'general' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-8">
                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-lg">
                        🖥️
                      </div>
                      <h4 className="text-lg font-black text-white uppercase tracking-tighter italic">Thiết lập hiển thị</h4>
                    </div>
                    
                    <div 
                      onClick={() => onUpdateSettings({ isFullscreen: !settings.isFullscreen })}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer group flex items-center justify-between ${settings.isFullscreen ? 'bg-blue-500/5 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.05)]' : 'bg-white/[0.02] border-white/5 hover:border-white/20'}`}
                    >
                      <div className="space-y-0.5">
                        <span className={`text-xs font-black uppercase tracking-widest transition-colors ${settings.isFullscreen ? 'text-blue-400' : 'text-neutral-400'}`}>Chế độ Toàn màn hình</span>
                        <p className="text-[9px] text-neutral-600 font-bold uppercase leading-relaxed max-w-sm">Loại bỏ các yếu tố gây xao nhãng của hệ thống.</p>
                      </div>
                      <div className={`w-12 h-6 rounded-full relative transition-all duration-500 ${settings.isFullscreen ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-neutral-800'}`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg transition-all duration-500 ${settings.isFullscreen ? 'left-7' : 'left-1'}`}></div>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-lg">
                        🔞
                      </div>
                      <h4 className="text-lg font-black text-white uppercase tracking-tighter italic">Nội dung Trưởng thành</h4>
                    </div>
                    
                    <div 
                      onClick={() => onUpdateSettings({ adultContent: !settings.adultContent })}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer group flex items-center justify-between ${settings.adultContent ? 'bg-rose-500/5 border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.05)]' : 'bg-white/[0.02] border-white/5 hover:border-white/20'}`}
                    >
                      <div className="space-y-0.5">
                        <span className={`text-xs font-black uppercase tracking-widest transition-colors ${settings.adultContent ? 'text-rose-400' : 'text-neutral-400'}`}>Kích hoạt Nội dung 18+</span>
                        <p className="text-[9px] text-neutral-600 font-bold uppercase leading-relaxed max-w-sm">Cho phép AI tạo ra các tình huống và miêu tả chi tiết, nhạy cảm.</p>
                      </div>
                      <div className={`w-12 h-6 rounded-full relative transition-all duration-500 ${settings.adultContent ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-neutral-800'}`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg transition-all duration-500 ${settings.adultContent ? 'left-7' : 'left-1'}`}></div>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-lg text-emerald-400">
                        🎨
                      </div>
                      <h4 className="text-lg font-black text-white uppercase tracking-tighter italic">Giao diện Ma Trận</h4>
                    </div>

                    <div className="bg-black/60 p-6 rounded-2xl border border-white/5 space-y-5 shadow-xl">
                       <div className="grid grid-cols-6 gap-3">
                          {PRESET_COLORS.map(color => (
                            <button 
                              key={color.hex}
                              onClick={() => onUpdateSettings({ primaryColor: color.hex })}
                              title={color.name}
                              className={`aspect-square rounded-lg border-2 transition-all hover:scale-105 flex items-center justify-center ${settings.primaryColor === color.hex ? 'border-white scale-105 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'border-transparent'}`}
                              style={{ backgroundColor: color.hex }}
                            >
                               {settings.primaryColor === color.hex && <span className="text-white text-xs drop-shadow-md font-bold">✓</span>}
                            </button>
                          ))}
                       </div>

                       <div className="flex flex-col gap-2">
                          <label className="mono text-[9px] font-black text-neutral-600 uppercase tracking-[0.2em]">Tùy chỉnh mã HEX Lượng tử</label>
                          <div className="flex gap-3">
                             <div className="w-10 h-10 rounded-lg border border-white/10 shrink-0 shadow-lg" style={{ backgroundColor: settings.primaryColor }}></div>
                             <input 
                                type="text"
                                value={settings.primaryColor}
                                onChange={(e) => onUpdateSettings({ primaryColor: e.target.value })}
                                className="flex-grow bg-white/5 border border-white/10 rounded-lg px-4 mono text-xs font-black text-white outline-none focus:border-emerald-500/50 shadow-inner"
                                placeholder="#000000"
                             />
                          </div>
                       </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-lg text-emerald-400">
                        🧠
                      </div>
                      <h4 className="text-lg font-black text-white uppercase tracking-tighter italic">Lõi xử lý Tư duy</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button 
                        onClick={() => onUpdateSettings({ aiModel: AiModel.FLASH })}
                        className={`p-5 rounded-2xl border transition-all text-left group relative overflow-hidden ${settings.aiModel === AiModel.FLASH ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]' : 'bg-white/[0.02] border-white/5 hover:border-white/20'}`}
                      >
                        <span className={`block mono text-[8px] font-black uppercase mb-1 tracking-widest ${settings.aiModel === AiModel.FLASH ? 'text-emerald-400' : 'text-neutral-600'}`}>III-FLASH_CORE</span>
                        <span className="text-base font-black text-white uppercase tracking-tighter">Xung Nhịp Thần Tốc</span>
                        <p className="text-[9px] text-neutral-500 font-bold mt-1.5 leading-relaxed">Phản hồi siêu tốc, mượt mà. Tối ưu cho hành động nhanh.</p>
                        {settings.aiModel === AiModel.FLASH && <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-500/20 rounded-bl-2xl flex items-center justify-center text-[8px]">✓</div>}
                      </button>

                      <button 
                        onClick={() => onUpdateSettings({ aiModel: AiModel.PRO })}
                        className={`p-5 rounded-2xl border transition-all text-left group relative overflow-hidden ${settings.aiModel === AiModel.PRO ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]' : 'bg-white/[0.02] border-white/5 hover:border-white/20'}`}
                      >
                        <span className={`block mono text-[8px] font-black uppercase mb-1 tracking-widest ${settings.aiModel === AiModel.PRO ? 'text-emerald-400' : 'text-neutral-600'}`}>III-PRO_CORE</span>
                        <span className="text-base font-black text-white uppercase tracking-tighter">Xung Nhịp Thông Thái</span>
                        <p className="text-[9px] text-neutral-500 font-bold mt-1.5 leading-relaxed">Logic ổn định, miêu tả giàu hình ảnh và chiều sâu nhất.</p>
                        {settings.aiModel === AiModel.PRO && <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-500/20 rounded-bl-2xl flex items-center justify-center text-[8px]">✓</div>}
                      </button>
                    </div>
                  </section>
                </div>

                <div className="space-y-8">
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-lg text-amber-400">
                          💾
                        </div>
                        <h4 className="text-lg font-black text-white uppercase tracking-tighter italic">Cửa sổ Ngữ cảnh</h4>
                      </div>
                      <span className="mono text-emerald-400 text-xl font-black">{settings.contextWindowSize} <span className="text-[9px] text-neutral-700">TURNS</span></span>
                    </div>

                    <div className="bg-black/60 p-6 rounded-2xl border border-white/5 shadow-inner">
                      <input 
                        type="range" min="5" max="15" step="1"
                        value={settings.contextWindowSize}
                        onChange={(e) => onUpdateSettings({ contextWindowSize: parseInt(e.target.value) })}
                        className="w-full h-1 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-emerald-500"
                      />
                      <div className="flex justify-between mt-4">
                        <span className="text-[9px] mono text-neutral-600 font-black uppercase tracking-widest">Tiết kiệm [5]</span>
                        <span className="text-[9px] mono text-neutral-600 font-black uppercase tracking-widest">Nhớ dai [15]</span>
                      </div>
                    </div>
                    <p className="text-[9px] text-neutral-600 font-bold italic text-center px-6 leading-relaxed">
                      * Số lượt hội thoại AI ghi nhớ để duy trì thực tại.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-lg text-purple-400">
                          ⚡
                        </div>
                        <h4 className="text-lg font-black text-white uppercase tracking-tighter italic">Ngân sách Suy luận</h4>
                      </div>
                      <span className="mono text-emerald-400 text-xl font-black">{settings.thinkingBudget.toLocaleString()} <span className="text-[9px] text-neutral-700">TOKENS</span></span>
                    </div>

                    <div className="bg-black/60 p-6 rounded-2xl border border-white/5 shadow-inner">
                      <input 
                        type="range" min="0" max={maxBudget} step="512"
                        value={settings.thinkingBudget}
                        onChange={(e) => onUpdateSettings({ thinkingBudget: parseInt(e.target.value) })}
                        className="w-full h-1 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-emerald-500"
                      />
                      <div className="flex justify-between mt-4">
                        <span className="text-[9px] mono text-neutral-600 font-black uppercase tracking-widest">Tốc độ [0]</span>
                        <span className="text-[9px] mono text-neutral-600 font-black uppercase tracking-widest">Cực hạn [{Math.floor(maxBudget/1000)}k]</span>
                      </div>
                    </div>
                    <p className="text-[9px] text-neutral-600 font-bold italic text-center px-6 leading-relaxed">
                      * Tăng khả năng suy luận logic và miêu tả chi tiết.
                    </p>
                  </section>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in duration-500 min-h-[40rem]">
                {/* CỘT TRÁI: API KEY CÁ NHÂN */}
                <div className="space-y-8 flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl text-emerald-400">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-white uppercase tracking-tighter italic">Khóa Cá Nhân</h4>
                        <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">User API Key Matrix</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <input 
                          type="file" 
                          accept=".txt" 
                          className="hidden" 
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                       />
                       <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg mono text-[10px] font-black text-neutral-400 hover:text-white transition-all"
                       >
                          <Upload size={14} />
                          TẢI TỆP .TXT
                       </button>
                    </div>
                  </div>

                  <div className="flex-grow flex flex-col gap-4">
                    {/* Input Area */}
                    <div className="flex gap-2 items-start">
                      <textarea 
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAddKey();
                          }
                        }}
                        placeholder="Dán một hoặc nhiều API Key (cách nhau bởi dấu phẩy, khoảng trắng hoặc xuống dòng)..."
                        className="flex-grow bg-black/40 border border-white/10 rounded-xl px-4 py-3 mono text-xs font-black text-emerald-400 outline-none focus:border-emerald-500/50 transition-all min-h-[46px] max-h-[120px] resize-none"
                        rows={1}
                      />
                      <button 
                        onClick={handleAddKey}
                        className="p-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl transition-all shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] active:scale-95 shrink-0"
                      >
                        <Plus size={20} />
                      </button>
                    </div>

                    {/* Keys List */}
                    <div className="flex-grow bg-black/20 border border-white/5 rounded-2xl overflow-hidden flex flex-col min-h-[200px]">
                       <div className="p-3 bg-white/5 border-b border-white/5 flex justify-between items-center">
                          <span className="mono text-[9px] font-black text-neutral-500 uppercase tracking-widest">Danh sách Khóa ({settings.userApiKeys?.length || 0})</span>
                          <div className="flex gap-2">
                             {settings.userApiKeys && settings.userApiKeys.length > 0 && (
                               <button 
                                 onClick={handleResetBlacklist}
                                 title="Làm mới danh sách lỗi"
                                 className="p-1.5 text-neutral-500 hover:text-emerald-400 transition-colors"
                               >
                                 <RefreshCw size={12} />
                               </button>
                             )}
                             {settings.userApiKeys && settings.userApiKeys.length > 0 && (
                               <span className="text-[8px] mono font-black text-emerald-500 animate-pulse">LOAD_BALANCING_ACTIVE</span>
                             )}
                          </div>
                       </div>
                       <div className="flex-grow overflow-y-auto custom-scrollbar p-2 space-y-2">
                          {(!settings.userApiKeys || settings.userApiKeys.length === 0) ? (
                            <div className="h-full flex flex-col items-center justify-center text-neutral-700 space-y-2 opacity-50 py-12">
                               <Zap size={32} strokeWidth={1} />
                               <p className="mono text-[9px] font-black uppercase tracking-widest">Chưa có khóa cá nhân</p>
                            </div>
                          ) : (
                            settings.userApiKeys.map((key, idx) => (
                              <div key={idx} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl group hover:border-emerald-500/30 transition-all">
                                 <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-[10px] font-black text-emerald-500 mono">
                                    {idx + 1}
                                 </div>
                                 <div className="flex-grow mono text-[10px] text-neutral-400 truncate">
                                    {key.substring(0, 8)}••••••••••••••••{key.substring(key.length - 4)}
                                 </div>
                                 <button 
                                    onClick={() => handleRemoveKey(key)}
                                    className="p-2 text-neutral-600 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                 >
                                    <Trash2 size={14} />
                                 </button>
                              </div>
                            ))
                          )}
                       </div>
                    </div>
                  </div>

                  <p className="text-[9px] text-neutral-600 font-bold italic leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                    * Hệ thống sẽ tự động luân chuyển (Load Balancing) giữa các API Key bạn cung cấp để tối ưu hóa hạn mức và tốc độ phản hồi.
                  </p>
                </div>

                {/* CỘT PHẢI: API KEY HỆ THỐNG */}
                <div className="space-y-8 flex flex-col">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl text-blue-400">
                      <Cpu size={20} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white uppercase tracking-tighter italic">Lõi Hệ Thống</h4>
                      <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">System Default Matrix</p>
                    </div>
                  </div>

                  <div className="flex-grow flex flex-col justify-center space-y-10">
                     <div className="flex flex-col items-center space-y-6">
                        <div className="w-24 h-24 bg-blue-500/5 border border-blue-500/10 rounded-full flex items-center justify-center text-4xl shadow-[0_0_70px_rgba(59,130,246,0.1)] relative">
                          <div className="absolute inset-0 bg-blue-500/5 rounded-full animate-ping"></div>
                          ⚙️
                        </div>
                        <div className="text-center space-y-3">
                           <h5 className="text-lg font-black text-white uppercase tracking-widest italic">Trạng thái Mặc định</h5>
                           <p className="text-[10px] text-neutral-500 font-bold leading-relaxed px-12 italic uppercase tracking-widest">
                             Hệ thống vận hành bằng mã khóa nặc danh được bảo mật đa lớp.
                           </p>
                        </div>
                     </div>

                     <div className="w-full p-8 bg-black/40 border border-white/5 rounded-[2.5rem] mono text-[9px] text-neutral-600 space-y-4 shadow-2xl">
                        <div className="flex justify-between border-b border-white/5 pb-3 items-center">
                           <span className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                              &gt; [STATUS] API_LINK_INTEGRITY:
                           </span> 
                           <span className="text-emerald-500 font-black text-xs">VERIFIED_SECURE</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-3 items-center">
                           <span className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                              &gt; [STATUS] ENCRYPTION_LAYER:
                           </span> 
                           <span className="text-amber-500 font-black text-xs">QUANTUM_STABLE</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                              &gt; [STATUS] AI_CORE_SPEC:
                           </span> 
                           <span className="text-white font-black text-xs italic decoration-blue-500/40 underline">GOOGLE_GEMINI_V3_PREVIEW</span>
                        </div>
                     </div>
                  </div>

                  <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                     <p className="text-[9px] text-blue-400/60 font-black uppercase tracking-widest mb-2">Thông báo bảo mật:</p>
                     <p className="text-[9px] text-neutral-600 font-bold leading-relaxed italic">
                       Dữ liệu được mã hóa bằng thuật toán Quantum AES-256 trước khi truyền tải qua các nút mạng lượng tử.
                     </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-black/80 border-t border-white/5 flex justify-center shrink-0">
          <button 
            onClick={onClose} 
            className="w-full max-w-lg py-5 bg-white/5 hover:bg-emerald-500/10 text-neutral-500 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/40 rounded-xl mono text-xs font-black uppercase transition-all tracking-[0.4em] shadow-2xl active:scale-[0.99] group"
          >
            <span className="group-hover:translate-x-1 inline-block transition-transform">Lưu & Quay lại thực tại [ESC]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
