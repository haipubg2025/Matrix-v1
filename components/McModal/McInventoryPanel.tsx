
import { InventoryItem } from '../../types';
import { InspectType } from './McInspector';

interface McInventoryPanelProps {
  inventory: InventoryItem[];
  onInspect: (data: { name: string; type: InspectType; description?: string }) => void;
  isEditing?: boolean;
  onUpdatePlayer?: (player: any) => void;
}

export const McInventoryPanel: React.FC<McInventoryPanelProps> = ({ inventory, onInspect, isEditing, onUpdatePlayer }) => {
  const handleInventoryChange = (text: string) => {
    if (onUpdatePlayer) {
      const lines = text.split('\n').filter(s => s.trim());
      const newInventory = lines.map(line => {
        const [name, ...descParts] = line.split('|');
        return {
          name: name.trim(),
          description: descParts.join('|').trim() || "Vật thể mang năng lượng tích hợp. Có thể sử dụng để thay đổi trạng thái bản thân hoặc tương tác với các thực thể khác trong Matrix."
        };
      });
      onUpdatePlayer({ inventory: newInventory });
    }
  };

  return (
    <section className="p-3 bg-[#0a0a0a] border border-white/10 rounded-sm space-y-3 h-full shadow-xl mono">
      <div className="flex items-center gap-3 border-b border-white/10 pb-2">
        <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">❯ TÚI ĐỒ / VẬT PHẨM</span>
      </div>
      <div className="grid grid-cols-1 gap-1.5 overflow-y-auto max-h-[450px] custom-scrollbar pr-1">
        {isEditing ? (
          <textarea 
            value={inventory && inventory.length > 0 ? inventory.map(i => `${i.name} | ${i.description}`).join('\n') : ''}
            onChange={(e) => handleInventoryChange(e.target.value)}
            className="w-full bg-black/40 text-[10px] p-2.5 border border-white/10 rounded-sm text-neutral-400 outline-none resize-none"
            rows={15}
            placeholder="Tên | Mô tả (Mỗi vật phẩm một dòng)"
          />
        ) : (
          inventory && inventory.length > 0 ? inventory.map((item, i) => (
            <button 
              key={i} 
              onClick={() => onInspect({ name: item.name, type: 'item', description: item.description })}
              className="text-left text-[10px] p-2.5 bg-white/[0.03] border border-white/10 rounded-sm text-neutral-400 flex items-center gap-3 group hover:text-white hover:border-emerald-500/30 hover:bg-white/5 transition-all"
            >
              <span className="text-emerald-500 opacity-40 shrink-0 group-hover:opacity-100 group-hover:rotate-12 transition-all">📦</span>
              <span className="font-bold uppercase tracking-tight truncate flex-grow leading-tight">{item.name}</span>
              <span className="text-[7px] font-black opacity-0 group-hover:opacity-100 transition-opacity">SCAN</span>
            </button>
          )) : <div className="py-10 text-center border border-dashed border-white/10 rounded-sm opacity-10 italic text-[9px] font-black uppercase">Buffer_Empty</div>
        )}
      </div>
    </section>
  );
};
