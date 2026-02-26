
import React, { useState, useMemo } from 'react';
import { GameLog } from '../types';
import { AlertCircle, ChevronRight, Info, Wrench, Zap } from 'lucide-react';

interface DiagnosticPanelProps {
  logs: GameLog[];
}

interface DiagnosticResult {
  type: string;
  cause: string;
  solution: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: number;
}

export const DiagnosticPanel: React.FC<DiagnosticPanelProps> = ({ logs }) => {
  const [isOpen, setIsOpen] = useState(false);

  const diagnostics = useMemo(() => {
    return logs.filter(log => log.type === 'error').map(log => {
      const content = (log.content || '').toLowerCase();
      let result: {
        type: string;
        cause: string;
        solution: string;
        severity: 'low' | 'medium' | 'high';
      } = {
        type: 'Lỗi Hệ Thống Không Xác Định',
        cause: 'Mất đồng bộ trong dòng thời gian hoặc lỗi kết nối máy chủ.',
        solution: 'Thử lại hành động hoặc tải lại trang.',
        severity: 'medium'
      };

      if (content.includes('api key') || content.includes('invalid')) {
        result = {
          type: 'Lỗi Xác Thực API',
          cause: 'API Key không hợp lệ hoặc sai định dạng.',
          solution: 'Kiểm tra lại API Key trong Cài đặt.',
          severity: 'high'
        };
      } else if (content.includes('quota') || content.includes('rate limit')) {
        result = {
          type: 'Hết Hạn Mức Truy Cập',
          cause: 'Vượt quá giới hạn yêu cầu của Gemini.',
          solution: 'Đợi 1 phút hoặc thêm API Key mới.',
          severity: 'medium'
        };
      } else if (content.includes('safety') || content.includes('blocked')) {
        result = {
          type: 'Bộ Lọc An Toàn',
          cause: 'Nội dung vi phạm chính sách an toàn.',
          solution: 'Điều chỉnh lại hành động tránh từ nhạy cảm.',
          severity: 'medium'
        };
      } else if (content.includes('phân tích dữ liệu') || content.includes('json')) {
        result = {
          type: 'Lỗi Cấu Trúc Dữ Liệu',
          cause: 'AI trả về dữ liệu không đúng định dạng.',
          solution: 'Nhấn "Tải Lại" trên Header.',
          severity: 'low'
        };
      }

      return { ...result, timestamp: log.timestamp };
    });
  }, [logs]);

  if (diagnostics.length === 0 && !isOpen) return null;

  return (
    <div 
      className={`fixed bottom-24 right-4 z-50 flex flex-col items-end transition-all duration-300 ${isOpen ? 'w-64 h-[40vh]' : 'w-6 h-6'}`}
    >
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-6 h-6 bg-rose-500/20 border border-rose-500/30 rounded-full flex items-center justify-center shadow-lg hover:bg-rose-500/40 transition-all animate-pulse"
        >
          <AlertCircle size={10} className="text-rose-500" />
        </button>
      ) : (
        <div className="w-full h-full bg-neutral-950/98 border border-white/10 rounded-lg backdrop-blur-3xl flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 border-b border-white/10 flex items-center justify-between bg-neutral-900/50">
            <div className="flex items-center gap-1.5">
              <Zap size={10} className="text-emerald-500" />
              <span className="text-[8px] font-black uppercase tracking-widest text-white">Diagnostics</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <ChevronRight size={12} className="text-neutral-600" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar p-2 space-y-2">
            {diagnostics.slice().reverse().map((diag, idx) => (
              <div key={idx} className="p-2 rounded border border-white/5 bg-white/5 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <AlertCircle size={8} className={diag.severity === 'high' ? 'text-rose-500' : 'text-orange-500'} />
                  <span className="text-[8px] font-black uppercase text-white truncate">{diag.type}</span>
                </div>
                <p className="text-[7px] text-neutral-500 italic leading-tight">"{diag.cause}"</p>
                <div className="text-[7px] text-emerald-400 font-bold bg-emerald-500/10 p-1.5 rounded border border-emerald-500/10">
                  <Wrench size={8} className="inline mr-1" /> {diag.solution}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
