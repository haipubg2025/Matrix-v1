
import React from 'react';
import { Quest } from '../../types';
import { InspectType } from './McInspector';

interface McQuestPanelProps {
  quests: Quest[];
  hasSystem: boolean;
  systemName: string;
  onInspect: (data: { name: string; type: InspectType; description?: string; reward?: string; status?: string; questGroup?: string; questKind?: string; progress?: string }) => void;
  playerLevel: number;
  isEditing?: boolean;
  onUpdatePlayer?: (player: any) => void;
}

export const McQuestPanel: React.FC<McQuestPanelProps> = ({ quests, hasSystem, systemName, onInspect, playerLevel, isEditing, onUpdatePlayer }) => {
  // Fail-safe: Đảm bảo quests luôn là mảng
  const safeQuests = Array.isArray(quests) ? quests : [];
  
  const handleQuestsChange = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed) && onUpdatePlayer) {
        onUpdatePlayer({ quests: parsed });
      }
    } catch (e) {
      // Invalid JSON, ignore or show error
    }
  };

  const mainActive = safeQuests.filter(q => q && q.group === 'main' && q.status === 'active');
  const sideActive = safeQuests.filter(q => q && q.group === 'side' && q.status === 'active');
  const finished = safeQuests.filter(q => q && q.status !== 'active');

  const renderQuestCard = (q: Quest) => (
    <button 
      key={q.id} 
      onClick={() => onInspect({ 
        name: q.title, 
        type: 'quest', 
        description: q.description, 
        reward: q.reward, 
        status: q.status,
        questGroup: q.group,
        questKind: q.kind,
        progress: q.kind === 'chain' ? `${q.currentStep}/${q.totalSteps}` : undefined
      })}
      className={`w-full text-left p-2.5 border rounded-sm group transition-all relative overflow-hidden ${q.group === 'main' ? 'bg-yellow-500/5 border-yellow-500/30 hover:border-yellow-500' : 'bg-blue-500/5 border-blue-500/30 hover:border-blue-500'}`}
    >
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center gap-1.5">
          <span className={`text-[8px] font-black uppercase tracking-tighter ${q.group === 'main' ? 'text-yellow-500' : 'text-blue-400'}`}>
            [{q.kind === 'chain' ? 'CHUỖI' : 'ĐƠN'}]
          </span>
          {q.kind === 'chain' && (
            <span className="text-[7px] mono text-white/40 font-bold bg-white/5 px-1 rounded-sm">
              {q.currentStep}/{q.totalSteps}
            </span>
          )}
        </div>
        <span className="text-[7px] text-neutral-600 font-black uppercase group-hover:text-white transition-colors">SCAN ❯</span>
      </div>
      <h4 className="text-xs font-black text-white uppercase tracking-tight mb-1 truncate">{q.title}</h4>
      <p className="text-[10px] text-neutral-400 leading-tight italic line-clamp-2">{q.description}</p>
      
      {q.kind === 'chain' && (
        <div className="mt-2 h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${q.group === 'main' ? 'bg-yellow-500' : 'bg-blue-500'}`}
            style={{ width: `${((q.currentStep || 1) / (q.totalSteps || 1)) * 100}%` }}
          ></div>
        </div>
      )}
    </button>
  );

  return (
    <section className="p-3 bg-[#0a0a0a] border border-white/10 rounded-sm space-y-3 h-full shadow-xl flex flex-col min-h-[600px] mono">
      <div className="flex-grow overflow-y-auto custom-scrollbar space-y-6 pr-1">
         {isEditing ? (
           <div className="space-y-2">
             <span className="text-[10px] text-emerald-500 font-black uppercase">Chỉnh sửa Nhiệm vụ (JSON):</span>
             <textarea 
               defaultValue={JSON.stringify(safeQuests, null, 2)}
               onBlur={(e) => handleQuestsChange(e.target.value)}
               className="w-full bg-black/60 text-[10px] p-2.5 border border-white/10 rounded-sm text-neutral-300 outline-none resize-none font-mono"
               rows={30}
             />
             <p className="text-[8px] text-neutral-600 italic">* Nhấn ra ngoài để lưu thay đổi JSON.</p>
           </div>
         ) : (
           <>
             {hasSystem && (
              <button 
                onClick={() => onInspect({
                  name: systemName,
                  type: 'system',
                  description: `Giao diện trung gian giữa não bộ chủ thể và Ma Trận Lượng Tử. ${systemName} cho phép truy cập các chức năng 'Cheat' thực tại, giao nhiệm vụ định mệnh và cung cấp phần thưởng vượt xa quy luật vật lý thông thường.`
                })}
                className="w-full text-left flex flex-col bg-yellow-500/10 p-2.5 rounded-sm border border-yellow-500/40 group hover:border-yellow-500 transition-all relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-1 relative z-10">
                  <span className="text-[8px] text-yellow-500 font-black uppercase tracking-[0.2em] italic">💎 SYSTEM_CORE_LINK:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[7px] text-yellow-500 font-bold uppercase animate-pulse">Connected</span>
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full shadow-[0_0_5px_currentColor]"></div>
                  </div>
                </div>
                <span className="text-[13px] font-black text-white uppercase tracking-tight italic truncate relative z-10">{systemName}</span>
                <div className="absolute inset-0 bg-yellow-500/[0.03] -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
              </button>
            )}

             <div className="space-y-2.5">
               <div className="flex items-center gap-2 border-l-2 border-yellow-500 pl-2 py-0.5 bg-yellow-500/5">
                  <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest">Mục tiêu Vận mệnh (Chính)</span>
               </div>
               <div className="space-y-2">
                 {mainActive.length > 0 ? mainActive.map(renderQuestCard) : (
                   <div className="py-6 text-center border border-dashed border-white/5 rounded-sm opacity-20">
                      <p className="text-[7px] font-black uppercase italic tracking-widest">No_Destiny_Task</p>
                   </div>
                 )}
               </div>
             </div>

             <div className="space-y-2.5">
               <div className="flex items-center gap-2 border-l-2 border-blue-400 pl-2 py-0.5 bg-blue-500/5">
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Duyên kiếp bên lề (Phụ)</span>
               </div>
               <div className="space-y-2">
                 {sideActive.length > 0 ? sideActive.map(renderQuestCard) : (
                   <div className="py-6 text-center border border-dashed border-white/5 rounded-sm opacity-20">
                      <p className="text-[7px] font-black uppercase italic tracking-widest">No_Side_Task</p>
                   </div>
                 )}
               </div>
             </div>

             {finished.length > 0 && (
               <div className="pt-4 border-t border-white/5 space-y-2">
                 <span className="text-[7px] font-black text-neutral-700 uppercase tracking-widest block px-1 italic">Vùng nhớ Lịch sử (Finished)</span>
                 <div className="space-y-1.5 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                   {finished.map(q => (
                     <button 
                       key={q.id} 
                       onClick={() => onInspect({ 
                         name: q.title, 
                         type: 'quest', 
                         description: q.description, 
                         reward: q.reward, 
                         status: q.status,
                         questGroup: q.group,
                         questKind: q.kind
                       })}
                       className="w-full text-left p-2 bg-white/[0.02] border border-white/5 rounded-sm flex justify-between items-center"
                     >
                       <span className="text-[9px] font-bold text-neutral-500 line-through truncate flex-grow mr-2">{q.title}</span>
                       <span className={`text-[7px] font-black uppercase shrink-0 ${q.status === 'completed' ? 'text-emerald-500' : 'text-red-500'}`}>{q.status}</span>
                     </button>
                   ))}
                 </div>
               </div>
             )}
           </>
         )}
      </div>
    </section>
  );
};
