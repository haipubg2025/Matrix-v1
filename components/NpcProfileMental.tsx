
import React from 'react';
import { Relationship, getAffinityLabel, getLoyaltyLabel, getLustLabel } from '../types';
import { renderSafeText, toSentenceCase, DiffValue } from './NpcProfileBase';

const StatBar = ({ label, field, value, subLabel, color, barColor, icon, isEditing, lastChanges, handleChange, max = 100 }: any) => {
  const displayValue = value === undefined || value === null ? 0 : value;
  const isPlaceholder = value === undefined || value === null;

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-end px-0.5">
        <span className="text-[9px] text-neutral-600 font-black uppercase tracking-widest">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-black uppercase ${color}`}>{icon} {subLabel}</span>
          {isEditing ? (
            <input 
              type="number"
              value={value || 0}
              onChange={(e) => handleChange(field, parseInt(e.target.value) || 0)}
              className="text-[9px] mono bg-white/10 px-1 rounded-sm w-12 outline-none border border-white/20"
            />
          ) : (
            <DiffValue fieldKey={field} current={value} lastChanges={lastChanges} color={color} className="text-[9px] mono bg-white/5 px-1 rounded-sm" />
          )}
        </div>
      </div>
      <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-white/5 p-[1px]">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${isPlaceholder ? 'bg-neutral-800' : barColor}`} 
          style={{ width: `${Math.min(100, Math.max(0, (displayValue / max) * 100))}%` }}
        ></div>
      </div>
    </div>
  );
};

export const NpcRelationshipDashboard: React.FC<{ 
  npc: Relationship,
  isEditing?: boolean,
  onUpdateNpc?: (npc: Relationship) => void
}> = ({ npc, isEditing, onUpdateNpc }) => {
  const aff = getAffinityLabel(npc.affinity);
  const loy = getLoyaltyLabel(npc.loyalty);
  const lust = getLustLabel(npc.lust);

  const handleChange = (field: keyof Relationship, value: any) => {
    if (onUpdateNpc) onUpdateNpc({ ...npc, [field]: value });
  };

  return (
    <div className="p-3 bg-[#0a0a0a] border border-white/10 rounded-sm space-y-4 shadow-2xl mono relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500/20 via-white/5 to-rose-500/20"></div>
      
      <StatBar 
        label="Nhu Cầu Dục Vọng" 
        field="lust" 
        value={npc.lust} 
        subLabel={lust.label} 
        color={lust.color} 
        barColor="bg-rose-600 shadow-[0_0_10px_#e11d48]" 
        icon="🌋" 
        isEditing={isEditing} 
        lastChanges={npc.lastChanges} 
        handleChange={handleChange} 
        max={1000}
      />
      
      <StatBar 
        label="Độ Thiện Cảm" 
        field="affinity"
        value={npc.affinity} 
        subLabel={aff.label} 
        color={aff.color} 
        barColor={npc.affinity > 550 ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-rose-500 shadow-[0_0_10px_#f43f5e]'} 
        icon="♥" 
        isEditing={isEditing}
        lastChanges={npc.lastChanges}
        handleChange={handleChange}
        max={1000}
      />

      <StatBar 
        label="Độ Trung Thành" 
        field="loyalty"
        value={npc.loyalty} 
        subLabel={loy.label} 
        color={loy.color} 
        barColor="bg-cyan-500 shadow-[0_0_10px_#06b6d4]" 
        icon="🛡️" 
        isEditing={isEditing}
        lastChanges={npc.lastChanges}
        handleChange={handleChange}
        max={1000}
      />

      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
         <span className="text-[9px] text-neutral-600 font-black uppercase tracking-widest italic">Cảm xúc:</span>
         <DiffValue fieldKey="mood" current={npc.mood} lastChanges={npc.lastChanges} color="text-white" className="text-sm font-black italic tracking-tight" />
      </div>
    </div>
  );
};

const GoalCard = ({ title, field, value, icon, color, isEditing, lastChanges, handleChange }: any) => (
  <div className={`p-2 bg-${color}-500/[0.03] border border-${color}-500/20 rounded-sm group/goal transition-all hover:bg-${color}-500/[0.06]`}>
    <div className="flex items-center gap-2 mb-1">
      <span className={`text-xs text-${color}-400`}>{icon}</span>
      <span className={`text-[9px] font-black uppercase tracking-widest text-${color}-500/80`}>{title}</span>
    </div>
    {isEditing ? (
      <textarea 
        value={value || ''} 
        onChange={(e) => handleChange(field, e.target.value)}
        className="w-full bg-transparent text-[11.5px] text-neutral-200 italic outline-none resize-none border-b border-white/10"
        rows={2}
      />
    ) : (
      <DiffValue fieldKey={field} current={value} lastChanges={lastChanges} color="text-neutral-200" className="text-[11.5px] px-1 italic" />
    )}
  </div>
);

export const NpcPsychologyWidget: React.FC<{ 
  npc: Relationship,
  isEditing?: boolean,
  onUpdateNpc?: (npc: Relationship) => void
}> = ({ npc, isEditing, onUpdateNpc }) => {
  const handleChange = (field: keyof Relationship, value: any) => {
    if (onUpdateNpc) onUpdateNpc({ ...npc, [field]: value });
  };

  return (
    <div className="p-2.5 bg-black/40 border border-white/10 rounded-sm mono shadow-lg space-y-3">
      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
        <span className="w-1.5 h-1.5 bg-emerald-500 shadow-[0_0_5px_#10b981]"></span>
        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Ma Trận Tâm Lý</h3>
      </div>

      <div className="flex flex-wrap gap-1">
        {isEditing ? (
          <input 
            value={npc.personality || ''} 
            onChange={(e) => handleChange('personality', e.target.value)}
            className="w-full bg-transparent text-[9px] text-neutral-400 uppercase outline-none border-b border-white/10"
            placeholder="Tính cách"
          />
        ) : (
          <DiffValue fieldKey="personality" current={npc.personality} lastChanges={npc.lastChanges} color="text-neutral-400" className="text-[9px] uppercase" />
        )}
      </div>

      <div className="grid grid-cols-1 gap-1.5">
        <GoalCard title="Dục vọng (Lust)" field="physicalLust" value={npc.physicalLust} icon="🔥" color="rose" isEditing={isEditing} lastChanges={npc.lastChanges} handleChange={handleChange} />
        <GoalCard title="Tham vọng (Ambition)" field="soulAmbition" value={npc.soulAmbition} icon="👑" color="amber" isEditing={isEditing} lastChanges={npc.lastChanges} handleChange={handleChange} />
        <GoalCard title="Ngắn hạn (Immediate)" field="shortTermGoal" value={npc.shortTermGoal} icon="⚡" color="cyan" isEditing={isEditing} lastChanges={npc.lastChanges} handleChange={handleChange} />
        <GoalCard title="Ước mơ (Destiny)" field="longTermDream" value={npc.longTermDream} icon="💠" color="indigo" isEditing={isEditing} lastChanges={npc.lastChanges} handleChange={handleChange} />
      </div>

      {(npc.background || isEditing) && (
        <div className="p-2 bg-black/60 border border-white/5 rounded-sm relative mt-2">
          <div className="absolute top-0 left-0 w-[1px] h-full bg-neutral-700"></div>
          <span className="text-[8px] text-neutral-600 font-black uppercase mb-1 block">Hồ Sơ Tiểu Sử:</span>
          {isEditing ? (
            <textarea 
              value={npc.background || ''} 
              onChange={(e) => handleChange('background', e.target.value)}
              className="w-full bg-transparent text-[11px] text-neutral-400 font-medium italic outline-none resize-none"
              rows={3}
            />
          ) : (
            <DiffValue fieldKey="background" current={npc.background} lastChanges={npc.lastChanges} color="text-neutral-400" className="text-[11px] font-medium italic" />
          )}
        </div>
      )}
    </div>
  );
};

export const NpcOpinionWidget: React.FC<{ 
  npc: Relationship,
  isEditing?: boolean,
  onUpdateNpc?: (npc: Relationship) => void
}> = ({ npc, isEditing, onUpdateNpc }) => {
  const handleChange = (field: keyof Relationship, value: any) => {
    if (onUpdateNpc) onUpdateNpc({ ...npc, [field]: value });
  };

  return (
    <div className="p-2 bg-cyan-500/[0.04] border border-cyan-500/20 rounded-sm mono shadow-inner relative">
      <div className="absolute top-0 right-0 p-1 opacity-20 text-[8px] font-black text-cyan-600 uppercase">Luồng Tức Thời</div>
      <span className="block text-[9px] font-black text-cyan-600 uppercase mb-1 tracking-widest">Phản hồi vừa qua:</span>
      {isEditing ? (
        <textarea 
          value={npc.currentOpinion || ''} 
          onChange={(e) => handleChange('currentOpinion', e.target.value)}
          className="w-full bg-transparent text-xs text-cyan-50/80 outline-none resize-none border-b border-cyan-500/20"
          rows={2}
        />
      ) : (
        <DiffValue fieldKey="currentOpinion" current={npc.currentOpinion} lastChanges={npc.lastChanges} color="text-cyan-50/80" className="text-xs" />
      )}
    </div>
  );
};

export const NpcImpressionWidget: React.FC<{ 
  npc: Relationship, 
  themeColor: string,
  isEditing?: boolean,
  onUpdateNpc?: (npc: Relationship) => void
}> = ({ npc, themeColor, isEditing, onUpdateNpc }) => {
  const handleChange = (field: keyof Relationship, value: any) => {
    if (onUpdateNpc) onUpdateNpc({ ...npc, [field]: value });
  };

  return (
    <div className="p-3 bg-black/80 border border-white/10 rounded-sm mono relative group">
      <div className={`absolute top-0 left-0 w-1 h-full bg-${themeColor}-500/40 group-hover:bg-${themeColor}-500 transition-all`}></div>
      <span className="block text-[9px] text-neutral-600 font-black uppercase mb-1.5 tracking-widest italic">Ấn Tượng Với MC:</span>
      {isEditing ? (
        <textarea 
          value={npc.impression || ''} 
          onChange={(e) => handleChange('impression', e.target.value)}
          className="w-full bg-transparent text-[13px] text-neutral-200 outline-none resize-none border-b border-white/10"
          rows={2}
        />
      ) : (
        <DiffValue fieldKey="impression" current={npc.impression} lastChanges={npc.lastChanges} color="text-neutral-200" className="text-[13px]" />
      )}
    </div>
  );
};

export const NpcSecretsWidget: React.FC<{ 
  npc: Relationship,
  isEditing?: boolean,
  onUpdateNpc?: (npc: Relationship) => void
}> = ({ npc, isEditing, onUpdateNpc }) => {
  const handleChange = (field: keyof Relationship, value: any) => {
    if (onUpdateNpc) onUpdateNpc({ ...npc, [field]: value });
  };

  return (
    <div className="p-2 bg-black/40 border border-white/10 rounded-sm mono shadow-2xl space-y-3">
      <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest flex items-center gap-2">
        <span className="w-1.5 h-[1px] bg-neutral-700"></span> Bí Mật Đã Giải Mã
      </h3>
      <div className="space-y-1.5">
        {isEditing ? (
          <textarea 
            value={Array.isArray(npc.secrets) ? npc.secrets.join('\n') : ''} 
            onChange={(e) => handleChange('secrets', e.target.value.split('\n').filter(s => s.trim()))}
            className="w-full bg-transparent text-[11px] font-black text-neutral-400 uppercase outline-none resize-none border border-white/10 p-1"
            rows={4}
            placeholder="Mỗi bí mật một dòng"
          />
        ) : (
          Array.isArray(npc.secrets) && npc.secrets.length ? npc.secrets.map((s, i) => (
            <div key={i} className="group p-2.5 bg-neutral-900 border border-white/5 rounded-sm flex items-start gap-3 hover:border-red-500/30 transition-all cursor-default">
              <span className="text-lg opacity-40 group-hover:opacity-100 transition-opacity">🔒</span>
              <span className="text-[11px] font-black text-neutral-400 uppercase leading-tight tracking-tight group-hover:text-red-400 transition-colors">{renderSafeText(s)}</span>
            </div>
          )) : <div className="py-6 text-center opacity-5 grayscale select-none"><span className="text-3xl">🔏</span></div>
        )}
      </div>
    </div>
  );
};

export const NpcLogsWidget: React.FC<{ 
  npc: Relationship,
  isEditing?: boolean,
  onUpdateNpc?: (npc: Relationship) => void
}> = ({ npc, isEditing, onUpdateNpc }) => {
  const handleChange = (field: keyof Relationship, value: any) => {
    if (onUpdateNpc) onUpdateNpc({ ...npc, [field]: value });
  };

  return (
    <div className="p-2.5 bg-amber-500/[0.03] border border-amber-500/10 rounded-sm mono space-y-4 shadow-xl">
      <div className="space-y-2">
        <h3 className="text-[9px] font-black text-amber-600 uppercase tracking-widest border-b border-amber-600/20 pb-1">Sự Kiện Đã Chứng Kiến</h3>
        <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar pr-1">
          {isEditing ? (
            <textarea 
              value={Array.isArray(npc.witnessedEvents) ? npc.witnessedEvents.join('\n') : ''} 
              onChange={(e) => handleChange('witnessedEvents', e.target.value.split('\n').filter(s => s.trim()))}
              className="w-full bg-transparent text-[11px] text-amber-200/60 font-bold outline-none resize-none border border-amber-500/20 p-1"
              rows={3}
              placeholder="Mỗi sự kiện một dòng"
            />
          ) : (
            Array.isArray(npc.witnessedEvents) && npc.witnessedEvents.length ? npc.witnessedEvents.map((ev, i) => (
              <div key={i} className="text-[11px] text-amber-200/60 font-bold leading-tight border-l-2 border-amber-500/30 pl-2 py-1.5 bg-white/[0.02] rounded-r-sm hover:bg-white/[0.04]">
                {toSentenceCase(ev)}
              </div>
            )) : <div className="text-[9px] text-neutral-800 font-black italic p-2">TRỐNG</div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-[9px] font-black text-cyan-600 uppercase tracking-widest border-b border-cyan-600/20 pb-1">Kiến Thức Đã Biết</h3>
        <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar pr-1">
          {isEditing ? (
            <textarea 
              value={Array.isArray(npc.knowledgeBase) ? npc.knowledgeBase.join('\n') : ''} 
              onChange={(e) => handleChange('knowledgeBase', e.target.value.split('\n').filter(s => s.trim()))}
              className="w-full bg-transparent text-[11px] text-cyan-200/60 font-bold outline-none resize-none border border-cyan-500/20 p-1"
              rows={3}
              placeholder="Mỗi kiến thức một dòng"
            />
          ) : (
            Array.isArray(npc.knowledgeBase) && npc.knowledgeBase.length ? npc.knowledgeBase.map((kn, i) => (
              <div key={i} className="text-[11px] text-cyan-200/60 font-bold leading-tight border-l-2 border-cyan-500/30 pl-2 py-1.5 bg-white/[0.02] rounded-r-sm hover:bg-white/[0.04]">
                 {toSentenceCase(kn)}
              </div>
            )) : <div className="text-[9px] text-neutral-800 font-black italic p-2">TRỐNG</div>
          )}
        </div>
      </div>

      {(npc.fetish || isEditing) && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-8 h-8 bg-red-500/10 rotate-45 translate-x-4 -translate-y-4"></div>
          <h3 className="text-[10px] text-red-500 font-black mb-1 uppercase">Sở Thích Fetish:</h3>
          {isEditing ? (
            <input 
              value={npc.fetish || ''} 
              onChange={(e) => handleChange('fetish', e.target.value)}
              className="w-full bg-transparent text-[12px] text-red-100 italic outline-none border-b border-red-500/20"
            />
          ) : (
            <DiffValue fieldKey="fetish" current={npc.fetish} lastChanges={npc.lastChanges} color="text-red-100" className="text-[12px] italic" />
          )}
        </div>
      )}
    </div>
  );
};
