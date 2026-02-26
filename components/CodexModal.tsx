import React, { useState, useMemo } from 'react';
import { Player, CodexEntry, Relationship } from '../types';
import { 
  Globe, 
  ScrollText, 
  History as HistoryIcon, 
  Users, 
  Search, 
  X, 
  ChevronRight, 
  BookOpen,
  Lock,
  User,
  Heart,
  Shield,
  Zap
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Props {
  player: Player;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'world' | 'rules' | 'history' | 'entities' | 'npcs';

export const CodexModal: React.FC<Props> = ({ player, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('world');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  const categories = [
    { id: 'world' as TabType, label: 'Thế giới', icon: Globe },
    { id: 'rules' as TabType, label: 'Luật lệ', icon: ScrollText },
    { id: 'history' as TabType, label: 'Lịch sử', icon: HistoryIcon },
    { id: 'entities' as TabType, label: 'Thực thể', icon: Zap },
    { id: 'npcs' as TabType, label: 'Nhân vật', icon: Users },
  ];

  const safeCodex = player.codex || [];
  const safeRelationships = player.relationships || [];

  // Filtered items based on active tab and search query
  const filteredItems = useMemo(() => {
    const query = (searchQuery || '').toLowerCase().trim();
    
    if (activeTab === 'npcs') {
      return safeRelationships
        .filter(npc => (npc.name || '').toLowerCase().includes(query))
        .map(npc => ({
          id: npc.id,
          title: npc.name || 'Vô danh',
          subtitle: (npc.affinity || 0) >= 600 ? 'Hậu cung' : 'Xã hội',
          type: 'npc' as const,
          data: npc
        }));
    } else {
      return safeCodex
        .filter(entry => entry.category === activeTab)
        .filter(entry => (entry.title || '').toLowerCase().includes(query) || (entry.content || '').toLowerCase().includes(query))
        .map(entry => ({
          id: entry.title || 'Không tiêu đề', // Using title as ID if no ID exists
          title: entry.title || 'Không tiêu đề',
          subtitle: entry.unlocked ? 'Đã giải mã' : 'Bị khóa',
          type: 'codex' as const,
          data: entry
        }));
    }
  }, [activeTab, searchQuery, safeCodex, safeRelationships]);

  const selectedItem = useMemo(() => {
    if (!selectedEntryId) return null;
    return filteredItems.find(item => item.id === selectedEntryId);
  }, [selectedEntryId, filteredItems]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] bg-neutral-950 flex animate-in fade-in duration-300 overflow-hidden">
      {/* Left Rail: Main Categories */}
      <div className="w-20 border-r border-white/5 bg-neutral-900/50 flex flex-col items-center py-8 gap-6 shrink-0">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
          <BookOpen className="w-6 h-6 text-amber-500" />
        </div>
        
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveTab(cat.id);
              setSelectedEntryId(null);
            }}
            className={cn(
              "group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
              activeTab === cat.id 
                ? "bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]" 
                : "text-neutral-500 hover:text-white hover:bg-white/5"
            )}
            title={cat.label}
          >
            <cat.icon className="w-5 h-5" />
            {activeTab === cat.id && (
              <div className="absolute left-full ml-4 px-3 py-1 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest rounded-md whitespace-nowrap z-10 pointer-events-none">
                {cat.label}
              </div>
            )}
          </button>
        ))}

        <div className="mt-auto">
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-neutral-500 hover:text-white hover:bg-red-500/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Middle Pane: List of Items */}
      <div className="w-80 md:w-96 border-r border-white/5 bg-neutral-900/20 flex flex-col shrink-0">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">
              {categories.find(c => c.id === activeTab)?.label}
            </h2>
            <span className="text-[10px] mono font-black text-neutral-600 bg-white/5 px-2 py-0.5 rounded">
              {filteredItems.length} MỤC
            </span>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
            <input 
              type="text"
              placeholder="Tìm kiếm dữ liệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder:text-neutral-700 focus:outline-none focus:border-amber-500/50 transition-all"
            />
          </div>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar p-4 space-y-2">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, idx) => (
              <button
                key={`${item.type}-${item.id}-${idx}`}
                onClick={() => setSelectedEntryId(item.id)}
                className={cn(
                  "w-full text-left p-4 rounded-2xl transition-all group flex items-center gap-4 border",
                  selectedEntryId === item.id
                    ? "bg-amber-500/10 border-amber-500/30 shadow-lg"
                    : "bg-transparent border-transparent hover:bg-white/5"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all",
                  selectedEntryId === item.id ? "bg-amber-500 text-black" : "bg-neutral-800 text-neutral-500 group-hover:text-white"
                )}>
                  {item.type === 'npc' ? <User className="w-5 h-5" /> : <ScrollText className="w-5 h-5" />}
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className={cn(
                    "text-xs font-black uppercase tracking-tight truncate",
                    selectedEntryId === item.id ? "text-amber-500" : "text-neutral-300 group-hover:text-white"
                  )}>
                    {item.title}
                  </h4>
                  <p className="text-[9px] mono font-bold text-neutral-600 uppercase tracking-widest mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
                <ChevronRight className={cn(
                  "w-4 h-4 shrink-0 transition-all",
                  selectedEntryId === item.id ? "text-amber-500 translate-x-0" : "text-neutral-800 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                )} />
              </button>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20 text-center p-8">
              <Lock className="w-12 h-12 mb-4" />
              <p className="mono text-[10px] font-black uppercase tracking-[0.2em]">Dữ liệu chưa được giải mã</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Pane: Content Detail */}
      <div className="flex-grow bg-black relative overflow-hidden flex flex-col">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        {selectedItem ? (
          <div className="flex-grow overflow-y-auto custom-scrollbar relative z-10">
            {selectedItem.type === 'codex' ? (
              <div className="max-w-4xl mx-auto px-8 py-16 md:px-16 md:py-24">
                <div className="flex items-center gap-4 mb-12">
                  <div className="h-px flex-grow bg-gradient-to-r from-transparent to-amber-500/20"></div>
                  <span className="px-4 py-1.5 bg-amber-500/5 border border-amber-500/20 rounded-full text-[10px] text-amber-500 font-black uppercase tracking-[0.4em]">
                    ARCHIVE_{activeTab.toUpperCase()}
                  </span>
                  <div className="h-px flex-grow bg-gradient-to-l from-transparent to-amber-500/20"></div>
                </div>

                <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter mb-12 leading-[0.85] italic">
                  {selectedItem.title}
                </h1>

                <div className="markdown-body prose prose-invert max-w-none">
                  <div className="text-xl md:text-2xl text-neutral-300 leading-relaxed font-serif italic first-letter:text-7xl first-letter:font-black first-letter:mr-4 first-letter:float-left first-letter:text-amber-500 first-letter:leading-none">
                    <ReactMarkdown>{(selectedItem.data as CodexEntry).content}</ReactMarkdown>
                  </div>
                </div>

                {/* Footer Decoration */}
                <div className="mt-24 pt-12 border-t border-white/5 flex justify-between items-center">
                  <div className="mono text-[8px] text-neutral-700 font-black uppercase tracking-[0.5em]">
                    MATRIX Engine // Codex Archive
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1 h-1 rounded-full bg-amber-500/20"></div>
                    <div className="w-1 h-1 rounded-full bg-amber-500/40"></div>
                    <div className="w-1 h-1 rounded-full bg-amber-500/60"></div>
                  </div>
                </div>
              </div>
            ) : (
              /* NPC Profile View */
              <div className="max-w-5xl mx-auto px-8 py-16 md:px-16 md:py-24">
                <div className="flex flex-col lg:flex-row gap-16 items-start">
                  <div className="relative shrink-0 mx-auto lg:mx-0">
                    <div className={cn(
                      "w-64 aspect-[3/4] rounded-[3rem] border-8 flex items-center justify-center shadow-2xl bg-neutral-900 overflow-hidden relative group",
                      ((selectedItem.data as Relationship).affinity || 0) >= 600 ? 'border-pink-500/20 shadow-pink-500/5' : 'border-cyan-500/20 shadow-cyan-500/5'
                    )}>
                      {(selectedItem.data as Relationship).avatar ? (
                        <img 
                          src={(selectedItem.data as Relationship).avatar} 
                          alt={selectedItem.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center opacity-10">
                          <User className="w-24 h-24" />
                        </div>
                      )}
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    </div>

                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full px-4">
                      <div className="bg-neutral-900 border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                          <span className="mono text-[10px] font-black text-white uppercase tracking-widest">
                            {(selectedItem.data as Relationship).affinity}%
                          </span>
                        </div>
                        <div className="h-4 w-px bg-white/10"></div>
                        <div className="flex items-center gap-3">
                          <Shield className="w-4 h-4 text-cyan-500" />
                          <span className="mono text-[10px] font-black text-white uppercase tracking-widest">
                            {(selectedItem.data as Relationship).loyalty || 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-grow space-y-10">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border",
                          ((selectedItem.data as Relationship).affinity || 0) >= 600 
                            ? "bg-pink-500/10 border-pink-500/20 text-pink-500" 
                            : "bg-cyan-500/10 border-cyan-500/20 text-cyan-500"
                        )}>
                          {((selectedItem.data as Relationship).affinity || 0) >= 600 ? 'Hậu cung' : 'Xã hội'}
                        </span>
                        <span className="text-neutral-700 mono text-[9px] font-black uppercase tracking-widest">
                          ID: {(selectedItem.data as Relationship).id}
                        </span>
                      </div>
                      <h1 className="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter leading-[0.8] mb-6 italic">
                        {selectedItem.title}
                      </h1>
                      <div className="flex flex-wrap gap-3">
                        <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                          {(selectedItem.data as Relationship).status}
                        </span>
                        <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">
                          Tâm trạng: {(selectedItem.data as Relationship).mood || 'Bình thản'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="mono text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Ấn tượng chủ quan
                      </h4>
                      <div className="p-8 bg-neutral-900/50 border border-white/5 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 transition-all duration-500 group-hover:w-2"></div>
                        <p className="text-2xl text-neutral-300 font-medium leading-relaxed italic">
                          "{(selectedItem.data as Relationship).impression || 'Dữ liệu sơ cấp, cần tiếp xúc nhiều hơn để hoàn thiện hồ sơ.'}"
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="mono text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] flex items-center gap-2">
                          <Lock className="w-3 h-3" /> Bí mật giải mã
                        </h4>
                        <div className="space-y-2">
                          {Array.isArray((selectedItem.data as Relationship).secrets) && (selectedItem.data as Relationship).secrets!.length > 0 ? (
                            (selectedItem.data as Relationship).secrets!.map((s, i) => (
                              <div key={i} className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-center gap-4 group hover:bg-amber-500/10 transition-all">
                                <span className="text-lg">🗝️</span>
                                <span className="text-xs font-bold text-amber-400 uppercase tracking-tight leading-tight">{s}</span>
                              </div>
                            ))
                          ) : (
                            <div className="py-12 border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center opacity-20">
                              <Lock className="w-8 h-8 mb-3" />
                              <p className="mono text-[8px] font-black uppercase tracking-widest">Chưa có bí mật nào</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="mono text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] flex items-center gap-2">
                          <Zap className="w-3 h-3" /> Đặc điểm nhận dạng
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                            <span className="block text-[8px] text-neutral-600 font-black uppercase mb-1">Tuổi</span>
                            <span className="text-xs font-bold text-white">{(selectedItem.data as Relationship).age || '??'}</span>
                          </div>
                          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                            <span className="block text-[8px] text-neutral-600 font-black uppercase mb-1">Chủng tộc</span>
                            <span className="text-xs font-bold text-white">{(selectedItem.data as Relationship).race || 'Nhân loại'}</span>
                          </div>
                          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                            <span className="block text-[8px] text-neutral-600 font-black uppercase mb-1">Cảnh giới</span>
                            <span className="text-xs font-bold text-white">{(selectedItem.data as Relationship).powerLevel || 'Phàm nhân'}</span>
                          </div>
                          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                            <span className="block text-[8px] text-neutral-600 font-black uppercase mb-1">Phe phái</span>
                            <span className="text-xs font-bold text-white">{(selectedItem.data as Relationship).faction || 'Tự do'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="h-full flex flex-col items-center justify-center text-center p-12">
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-amber-500/20 blur-[100px] rounded-full"></div>
              <BookOpen className="w-32 h-32 text-amber-500/20 relative z-10 animate-pulse" />
            </div>
            <h3 className="text-5xl font-black text-white mono uppercase tracking-[0.4em] mb-4 opacity-10">
              CODEX_ARCHIVE
            </h3>
            <p className="max-w-md text-neutral-700 mono text-xs font-bold uppercase tracking-widest leading-relaxed">
              Chọn một mục từ danh sách bên trái để truy xuất dữ liệu từ ma trận lượng tử.
            </p>
          </div>
        )}

        {/* Top Header Bar for Content Area */}
        <div className="absolute top-0 left-0 right-0 h-16 border-b border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
            <span className="mono text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">
              System_Status: Online // Data_Sync: 100%
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3 bg-amber-500/20"></div>
              <div className="w-1 h-3 bg-amber-500/40"></div>
              <div className="w-1 h-3 bg-amber-500/60"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
