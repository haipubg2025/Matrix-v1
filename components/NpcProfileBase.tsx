
import React from 'react';
import { Relationship, getGenreMeta, GameGenre, Player } from '../types';

export const renderSafeText = (data: any, fallback: string = '---'): string => {
  if (data === undefined || data === null || data === '' || data === '??' || data === 'N/A') return fallback;
  if (typeof data === 'string') return data;
  if (typeof data === 'number') return String(data);
  if (Array.isArray(data)) return data.length > 0 ? data.map(i => renderSafeText(i)).join(', ') : fallback;
  if (typeof data === 'object') return data.text || data.description || data.value || data.name || JSON.stringify(data);
  return String(data);
};

export const toSentenceCase = (text: any, fallback: string = ''): string => {
  const str = renderSafeText(text, fallback);
  if (!str || str === fallback) return fallback;
  let sentence = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  return sentence.replace(/\bmc\b/gi, 'MC');
};

/**
 * Component hiển thị dữ liệu có sự thay đổi (Diff)
 */
export const DiffValue: React.FC<{ 
  fieldKey: string, 
  current: any, 
  lastChanges?: Record<string, {old: any, new: any}>,
  color?: string,
  className?: string
}> = ({ fieldKey, current, lastChanges, color = "text-white", className = "" }) => {
  const change = lastChanges?.[fieldKey];
  const safeCurrent = renderSafeText(current);

  if (change && renderSafeText(change.old) !== renderSafeText(change.new)) {
    return (
      <span className={`flex flex-col items-end animate-in fade-in duration-500 ${className}`}>
        <span className="text-[9px] text-rose-500/50 line-through leading-none decoration-rose-500/40">{renderSafeText(change.old)}</span>
        <span className={`text-xs font-black ${color} leading-tight`}>❯ {renderSafeText(change.new)}</span>
      </span>
    );
  }

  return <span className={`text-xs font-bold ${color} ${className}`}>{safeCurrent}</span>;
};

const BioItem = ({ label, field, color = "text-white", isEditing, npc, lastChanges, handleChange }: any) => (
  <div className="group flex justify-between items-start p-2 bg-white/[0.02] border border-white/5 rounded-sm hover:bg-white/[0.05] transition-all">
    <span className="text-[10px] text-neutral-500 font-black uppercase tracking-tighter shrink-0 mt-0.5">{label}</span>
    {isEditing ? (
      <input 
        value={(npc as any)[field] || ''} 
        onChange={(e) => handleChange(field, e.target.value)}
        className={`bg-transparent text-xs font-black ${color} text-right ml-4 outline-none border-b border-white/10 focus:border-white/30 w-full`}
      />
    ) : (
      <DiffValue fieldKey={field} current={(npc as any)[field]} lastChanges={lastChanges} color={color} className="text-right ml-4" />
    )}
  </div>
);

export const NpcSidebarBio: React.FC<{ 
  npc: Relationship, 
  themeColor: string, 
  genre?: GameGenre,
  isEditing?: boolean,
  onUpdateNpc?: (npc: Relationship) => void
}> = ({ npc, themeColor, genre, isEditing, onUpdateNpc }) => {
  const meta = getGenreMeta(genre);
  const labels = meta.npcLabels;

  const handleChange = (field: keyof Relationship, value: any) => {
    if (onUpdateNpc) onUpdateNpc({ ...npc, [field]: value });
  };

  return (
    <div className="space-y-1.5 mono">
      <div className="grid grid-cols-1 gap-1">
        <BioItem label={labels.race} field="race" isEditing={isEditing} npc={npc} lastChanges={npc.lastChanges} handleChange={handleChange} />
      </div>

      <div className="pt-2 border-t border-white/10 grid grid-cols-1 gap-1">
        <BioItem label="Hoạt động" field="status" color="text-cyan-400" isEditing={isEditing} npc={npc} lastChanges={npc.lastChanges} handleChange={handleChange} />
        <BioItem label={labels.power} field="powerLevel" color={`text-${themeColor}-400`} isEditing={isEditing} npc={npc} lastChanges={npc.lastChanges} handleChange={handleChange} />
        <BioItem label="Vai trò MC" field="familyRole" color="text-amber-400" isEditing={isEditing} npc={npc} lastChanges={npc.lastChanges} handleChange={handleChange} />
        <BioItem label={labels.faction} field="faction" isEditing={isEditing} npc={npc} lastChanges={npc.lastChanges} handleChange={handleChange} />
        <BioItem label={labels.alignment} field="alignment" color="text-cyan-400" isEditing={isEditing} npc={npc} lastChanges={npc.lastChanges} handleChange={handleChange} />
        <BioItem label="Vị trí cuối" field="lastLocation" isEditing={isEditing} npc={npc} lastChanges={npc.lastChanges} handleChange={handleChange} />
      </div>

      <div className="p-2.5 bg-black/40 border border-white/10 rounded-sm space-y-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
        <div className="space-y-1.5">
          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span> Sở thích
          </span>
          {isEditing ? (
            <input 
              value={Array.isArray(npc.likes) ? npc.likes.join(', ') : ''} 
              onChange={(e) => handleChange('likes', e.target.value.split(',').map(s => s.trim()))}
              className="w-full bg-transparent text-[9px] text-emerald-400 font-black italic outline-none border-b border-emerald-500/20"
              placeholder="Sở thích (cách nhau bằng dấu phẩy)"
            />
          ) : (
            <div className="flex flex-wrap gap-1">
              {Array.isArray(npc.likes) && npc.likes.length ? npc.likes.map((l, i) => (
                <span key={i} className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-sm text-[9px] text-emerald-400 font-black italic shrink-0">{toSentenceCase(l)}</span>
              )) : <span className="text-[9px] text-neutral-700 italic">Dữ liệu trống</span>}
            </div>
          )}
        </div>
        <div className="space-y-1.5">
          <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1 h-1 bg-rose-500 rounded-full animate-pulse"></span> Chán ghét
          </span>
          {isEditing ? (
            <input 
              value={Array.isArray(npc.dislikes) ? npc.dislikes.join(', ') : ''} 
              onChange={(e) => handleChange('dislikes', e.target.value.split(',').map(s => s.trim()))}
              className="w-full bg-transparent text-[9px] text-rose-400 font-black italic outline-none border-b border-rose-500/20"
              placeholder="Chán ghét (cách nhau bằng dấu phẩy)"
            />
          ) : (
            <div className="flex flex-wrap gap-1">
              {Array.isArray(npc.dislikes) && npc.dislikes.length ? npc.dislikes.map((d, i) => (
                <span key={i} className="px-1.5 py-0.5 bg-rose-500/10 border border-rose-500/20 rounded-sm text-[9px] text-rose-400 font-black italic shrink-0">{toSentenceCase(d)}</span>
              )) : <span className="text-[9px] text-neutral-700 italic">Dữ liệu trống</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const NpcSocialColumn: React.FC<{ 
  npc: Relationship, 
  player: Player, 
  onSwitchNpc: (npc: Relationship) => void,
  isEditing?: boolean,
  onUpdateNpc?: (npc: Relationship) => void
}> = ({ npc, player, onSwitchNpc, isEditing, onUpdateNpc }) => {
  const ownerShortName = renderSafeText(npc.name).split(' ').pop() || 'NPC';

  const handleRelativesChange = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed) && onUpdateNpc) {
        onUpdateNpc({ ...npc, relatives: parsed });
      }
    } catch (e) {}
  };

  return (
    <div className="p-2 bg-[#0a0a0a] border border-white/5 rounded-sm mono relative overflow-hidden">
      <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-1.5">
        <h3 className="text-[10px] font-black text-yellow-500 uppercase tracking-widest flex items-center gap-2">
           <span className="w-1.5 h-1.5 bg-yellow-500 rotate-45"></span> Mạng Lưới Matrix
        </h3>
        <span className="text-[8px] text-neutral-600 font-bold uppercase">{npc.relatives?.length || 0} Thực Thể</span>
      </div>

      <div className="space-y-1">
        {isEditing ? (
          <div className="space-y-2">
            <span className="text-[9px] text-yellow-500 font-black uppercase">Liên kết (JSON):</span>
            <textarea 
              defaultValue={JSON.stringify(npc.relatives || [], null, 2)}
              onBlur={(e) => handleRelativesChange(e.target.value)}
              className="w-full bg-black/60 text-[10px] p-2 border border-white/10 rounded-sm text-neutral-300 outline-none resize-none font-mono"
              rows={10}
            />
          </div>
        ) : (
          npc.relatives?.length ? npc.relatives.map((rel, i) => {
            if (!rel) return null;
            const rawName = renderSafeText(rel.npcName, "");
            const playerName = renderSafeText(player.name, "MC");
            const isPlayer = rel.npcId === 'mc_player' || (rawName && rawName.toLowerCase() === playerName.toLowerCase());
            
            const knownNpc = player.relationships.find(r => 
              (rel.npcId && r.id === rel.npcId) || 
              (rawName && r.name && r.name.toLowerCase() === rawName.toLowerCase())
            );

            const displayRelName = isPlayer 
              ? `[ BẠN: ${playerName} ]` 
              : (knownNpc ? knownNpc.name : (rawName || rel.npcId || "Vô danh"));

            return (
              <div 
                key={i} 
                onClick={() => !isPlayer && knownNpc && onSwitchNpc(knownNpc)}
                className={`group p-2 border transition-all ${
                  isPlayer ? 'bg-emerald-500/[0.04] border-emerald-500/30' : 
                  knownNpc ? 'bg-white/[0.02] border-white/10 cursor-pointer hover:border-yellow-500/40 hover:bg-white/[0.05]' : 
                  'bg-black/40 border-white/5 opacity-40 grayscale'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-col min-w-0">
                    <span className={`text-[11px] font-black truncate uppercase ${isPlayer ? 'text-emerald-400' : 'text-neutral-200'}`}>
                      {displayRelName}
                    </span>
                    <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-tighter">
                      {ownerShortName} ❯ {renderSafeText(rel.relation)}
                    </span>
                  </div>
                  {knownNpc && !isPlayer && (
                    <div className="text-right shrink-0">
                       <span className="text-[10px] text-pink-500 font-black">{knownNpc.affinity}%</span>
                    </div>
                  )}
                </div>
              </div>
            );
          }) : <div className="text-[10px] text-neutral-700 font-bold text-center py-4 italic uppercase">Không_Tìm_Thấy_Liên_Kết</div>
        )}
      </div>
    </div>
  );
};
