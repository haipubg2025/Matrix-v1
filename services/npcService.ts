
import { Relationship, BodyDescription } from '../types';

export const isValidValue = (val: any): boolean => {
  if (val === undefined || val === null || val === '') return false;
  if (typeof val === 'string') {
    const v = val.trim().toLowerCase();
    return !['??', 'n/a', 'chưa rõ', 'đang cập nhật', 'unknown', 'none', 'đang cập nhật...', 'không rõ', 'ẩn số'].includes(v);
  }
  return true;
};

export const compensateNpcData = (npc: Relationship, _currentYear: number): Relationship => {
  // Giao 100% công việc cho AI, engine không tự ý bổ sung dữ liệu ngẫu nhiên nữa.
  return { ...npc };
};

export const mergeNpcData = (oldNpc: Relationship, newNpc: Relationship, narratorText: string, _currentYear: number, _justification?: string): Relationship => {
  const result = { ...oldNpc };
  const changes: Record<string, { old: any, new: any }> = {};

  // Trộn tất cả các trường từ AI gửi về
  Object.entries(newNpc).forEach(([key, value]) => {
    if (key === 'id' || key === 'lastChanges') return;
    
    const k = key as keyof Relationship;
    const oldVal = oldNpc[k];
    
    if (value !== undefined && value !== null && value !== oldVal) {
      // Ghi nhận thay đổi để hiển thị Diff trong UI
      if (typeof value !== 'object' || Array.isArray(value)) {
        changes[k] = { old: oldVal, new: value };
      }
      (result as any)[k] = value;
    }
  });

  // Trộn BodyDescription riêng biệt
  if (newNpc.bodyDescription) {
    const mergedBody = { ...(result.bodyDescription || {}) };
    Object.entries(newNpc.bodyDescription).forEach(([key, value]) => {
      const k = key as keyof BodyDescription;
      const oldVal = mergedBody[k];
      if (value !== undefined && value !== null && value !== oldVal) {
        changes[`body_${k}`] = { old: oldVal, new: value };
        (mergedBody as any)[k] = value;
      }
    });
    result.bodyDescription = mergedBody;
  }

  // Xác định sự hiện diện dựa trên văn bản dẫn truyện
  const narratorMentions = oldNpc.name ? narratorText.includes(oldNpc.name) : false;
  result.isPresent = newNpc.isPresent !== undefined ? newNpc.isPresent : narratorMentions;
  result.lastChanges = changes;

  return result;
};

function renderSafeText(data: any): string {
  if (!data) return "";
  if (typeof data === 'string') return data;
  return String(data);
}
