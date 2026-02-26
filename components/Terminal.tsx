
import React, { useState, useEffect, useRef } from 'react';
import { GameLog, SuggestedAction, Player, GameGenre, getGenreMeta } from '../types';

interface TerminalProps {
  logs: GameLog[];
  onCommand: (cmd: string, timeCost?: number) => void;
  isLoading: boolean;
  placeholder?: string;
  player: Player; // Thêm player prop
  genre?: GameGenre; // Thêm genre prop
}

export const Terminal: React.FC<TerminalProps> = ({ 
  logs, onCommand, isLoading, placeholder = "Gõ hành động hoặc lời nói của bạn...", 
  player, genre 
}) => {
  const [input, setInput] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const meta = getGenreMeta(genre);
  const getRankLabel = (level: number, ranks: string[]) => {
    if (!ranks || ranks.length === 0) return 'Vô Danh';
    const rankIndex = Math.min(Math.floor(level / 10), ranks.length - 1);
    return ranks[rankIndex];
  };

  const lastLogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastLogRef.current) {
      lastLogRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 150);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    let interval: number;
    if (isLoading) {
      setElapsedTime(0);
      interval = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e?: React.FormEvent, customCmd?: string, timeCost?: number) => {
    if (e) e.preventDefault();
    const finalCmd = customCmd || input;
    if (finalCmd.trim() && !isLoading) {
      onCommand(finalCmd.trim(), timeCost);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const formatActionTime = (mins: any) => {
    const m = parseInt(mins) || 15;
    if (m >= 60) {
      const h = Math.floor(m / 60);
      const rem = m % 60;
      return rem > 0 ? `${h}h${rem}p` : `${h}h`;
    }
    return `${m}p`;
  };

  const renderContent = (content: any) => {
    if (!content) return null;
    let safeContent = typeof content === 'string' ? content : (content.text || JSON.stringify(content));
    
    const parts = safeContent.split(/(\[[^\]]+\])/g);
    
    return (
      <div className="flex flex-col gap-1">
        {parts.map((part, idx) => {
          if (!part || !part.trim()) return null;
          
          const trimmedPart = part.trim();
          const isSystemBlock = trimmedPart.startsWith('[') && trimmedPart.endsWith(']');
          
          if (isSystemBlock) {
            return (
              <div key={idx} className="my-1.5 animate-in zoom-in slide-in-from-left-2 duration-300">
                <div className="relative bg-emerald-500/10 border border-emerald-500/30 rounded-sm p-3 shadow-[0_0_15px_rgba(16,185,129,0.1)] overflow-hidden inline-block min-w-[300px] max-w-full">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                  <div className="flex items-center gap-3">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shrink-0"></div>
                     <div className="text-emerald-300 mono text-[12px] font-black tracking-tight leading-tight italic uppercase">
                       {part.replace(/[\[\]]/g, '').trim()}
                     </div>
                  </div>
                </div>
              </div>
            );
          }
          
          return <span key={idx} className="whitespace-pre-wrap">{part}</span>;
        })}
      </div>
    );
  };

  let playerCommandCounter = 0;

  return (
    <div className="flex flex-col h-full bg-[#080808]/90 border border-white/5 rounded-sm overflow-hidden backdrop-blur-3xl shadow-2xl relative">
      {/* NEW HUD HEADER: MC INFO INTEGRATED */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900/90 border-b border-white/10 shrink-0 mono relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(16,185,129,0.02),transparent)] animate-[shimmer_4s_infinite]"></div>
        
        {/* LEFT: ASSETS */}
        <div className="flex items-center gap-3 relative z-10">
          <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Tài sản:</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-yellow-500 tabular-nums drop-shadow-[0_0_5px_rgba(234,179,8,0.3)]">{player.gold.toLocaleString()}</span>
            <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-tighter">{meta.currency}</span>
          </div>
        </div>

        {/* RIGHT: SYSTEM */}
        <div className="flex items-center gap-3 relative z-10">
          <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Hệ Thống:</span>
          <div className="flex items-center gap-3">
            <span className={`text-[11px] font-black uppercase tracking-wider ${player.systemName ? 'text-emerald-400' : 'text-neutral-600 italic'}`}>
              {player.systemName || 'Chưa thức tỉnh'}
            </span>
            <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-emerald-500 animate-ping' : 'bg-neutral-800'}`}></div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-grow overflow-y-auto p-5 space-y-4 custom-scrollbar scroll-smooth">
        {logs.map((log, i) => {
          const isLast = i === logs.length - 1;

          if (log.type === 'system') {
            return (
              <div key={i} ref={isLast ? lastLogRef : null} className="my-2 animate-in fade-in zoom-in duration-500">
                <div className="bg-cyan-500/5 border-y border-cyan-500/10 p-2 relative overflow-hidden">
                  <div className="absolute left-0 top-0 w-1 h-full bg-cyan-500/50"></div>
                  <div className="text-cyan-400/80 mono text-[11px] font-black uppercase tracking-tight italic pl-2">
                    {renderContent(log.content)}
                  </div>
                </div>
              </div>
            );
          }

          if (log.type === 'player') playerCommandCounter++;

          return (
            <div key={i} ref={isLast ? lastLogRef : null} className={`animate-in fade-in slide-in-from-bottom-2 duration-500 ${log.type === 'player' ? 'text-emerald-400' : log.type === 'error' ? 'text-rose-400' : 'text-neutral-300'}`}>
              <div className="flex gap-3">
                <div className="flex flex-col items-center min-w-[12px] mt-1">
                  <span className={`text-xs select-none font-black mono ${log.type === 'player' ? 'text-emerald-500 animate-pulse' : 'opacity-20'}`}>
                    {log.type === 'player' ? '❯' : '•'}
                  </span>
                </div>
                <div className="flex-grow flex flex-col min-w-0">
                  {log.type === 'player' && (
                    <div className="mb-1 flex items-center gap-2">
                       <span className="text-[9px] mono font-black text-emerald-500/20 uppercase tracking-widest">HÀNH_ĐỘNG_{playerCommandCounter.toString().padStart(3, '0')}</span>
                    </div>
                  )}
                  <div className="mono text-[15px] leading-relaxed selection:bg-emerald-500 selection:text-black">
                    {renderContent(log.content)}
                  </div>
                  
                  {log.type === 'narrator' && log.suggestedActions && log.suggestedActions.length > 0 && i === logs.length - 1 && (
                    <div className="flex flex-wrap gap-2 mt-5 animate-in fade-in slide-in-from-left-4 duration-700">
                      {log.suggestedActions.map((sObj: any, idx) => {
                        const actionText = typeof sObj === 'string' ? sObj : (sObj.action || "Tiếp tục");
                        const actionTime = typeof sObj === 'string' ? 15 : (sObj.time || 15);
                        return (
                          <button
                            key={idx}
                            onClick={() => handleSubmit(undefined, actionText, actionTime)}
                            disabled={isLoading}
                            className="px-4 py-2 rounded-sm border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 mono text-[10px] uppercase font-black hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/60 transition-all active:scale-95 disabled:opacity-20 flex items-center gap-2 shadow-lg"
                          >
                            <span className="opacity-40">❯</span>
                            {actionText}
                            <span className="ml-2 px-1.5 py-0.5 bg-black/40 rounded-sm text-[8px] text-emerald-500/60 border border-white/5">
                              {formatActionTime(actionTime)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {isLoading && (
          <div className="flex items-center gap-3 text-emerald-500/60 p-3 bg-emerald-500/5 rounded-sm animate-pulse w-fit border border-emerald-500/10">
            <span className="mono text-[10px] font-black tracking-[0.3em] uppercase italic">Tính toán ma trận thực tại...</span>
            <div className="bg-emerald-500/20 px-2 py-0.5 rounded-sm mono text-[10px] font-black text-emerald-400">{formatTime(elapsedTime)}</div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-neutral-950/90 border-t border-white/10 backdrop-blur-3xl shrink-0 relative">
        <div className={`flex items-end gap-3 bg-[#0a0a0a] border p-3 rounded-sm transition-all ${isLoading ? 'border-neutral-800 opacity-50' : 'border-neutral-800 focus-within:border-emerald-500/40 shadow-inner'}`}>
          <div className="mb-2">
             <span className={`font-black mono text-lg ${isLoading ? 'text-neutral-700' : 'text-emerald-500'}`}>❯</span>
          </div>
          
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            autoFocus
            rows={1}
            placeholder={isLoading ? "Vạn giới đang xoay chuyển..." : placeholder}
            className="flex-grow bg-transparent border-none outline-none text-white text-[15px] font-medium placeholder:text-neutral-800 tracking-tight mono resize-none custom-scrollbar py-1 max-h-[150px] selection:bg-emerald-500 selection:text-black"
          />
          
          <div className="flex flex-col items-end gap-1">
             <button 
               type="submit" 
               disabled={!input.trim() || isLoading} 
               className="px-6 py-2 bg-emerald-500 text-black font-black uppercase text-[11px] rounded-sm disabled:opacity-0 transition-all hover:bg-emerald-400 active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
             >
               Gửi lệnh
             </button>
             <span className="text-[8px] mono text-neutral-700 font-black uppercase tracking-tighter">Shift+Enter cho dòng mới</span>
          </div>
        </div>
      </form>
    </div>
  );
};
