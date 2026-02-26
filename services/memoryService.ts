
import { GoogleGenAI } from "@google/genai";
import { GameLog } from "../types";
import { embeddingService } from "./embeddingService";

export interface MemoryEntry {
  id: string;
  content: string;
  embedding: number[];
  metadata: {
    type: "fact" | "preference" | "event" | "relationship";
    importance: number;
    timestamp: number;
    lastUpdated: number;
  };
}

export interface MemoryState {
  worldSummary: string;
  memories: MemoryEntry[];
  lastSummarizedTurn: number;
}

export class MemoryService {
  private state: MemoryState = {
    worldSummary: "Câu chuyện vừa bắt đầu.",
    memories: [],
    lastSummarizedTurn: 0
  };

  /**
   * Cập nhật bộ nhớ dựa trên logs mới
   * Sử dụng AI để trích xuất các "atomic memories" (sự kiện/sự thật nguyên tử)
   */
  public async updateMemory(logs: GameLog[], turnCount: number): Promise<void> {
    // Chỉ cập nhật sau mỗi 5 lượt để đảm bảo tính liên tục và tiết kiệm tài nguyên
    if (turnCount > 0 && turnCount - this.state.lastSummarizedTurn < 5) return;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
    const recentLogs = logs.slice(-15).map(l => `[${l.type.toUpperCase()}] ${l.content}`).join("\n");

    const extractionPrompt = `
      Bạn là một "Quantum Memory Manager". Nhiệm vụ của bạn là trích xuất các ký ức quan trọng từ nhật ký game RPG dưới đây.
      
      NHẬT KÝ GẦN ĐÂY:
      ${recentLogs}

      KÝ ỨC HIỆN TẠI (TÓM TẮT):
      ${this.state.worldSummary}

      HÃY TRÍCH XUẤT:
      1. Các sự thật mới (Facts): Về thế giới, địa điểm, quy luật.
      2. Sự kiện quan trọng (Events): Những gì MC đã làm hoặc chứng kiến.
      3. Mối quan hệ (Relationships): Thay đổi trong tình cảm hoặc thông tin về NPC.
      4. Sở thích/Thói quen (Preferences): Của MC hoặc NPC quan trọng.

      YÊU CẦU:
      - Mỗi ký ức phải là một câu khẳng định ngắn gọn, độc lập.
      - Loại bỏ các chi tiết thừa thãi.
      - Nếu một ký ức mới cập nhật hoặc mâu thuẫn với ký ức cũ, hãy ghi chú rõ.

      TRẢ VỀ JSON:
      {
        "newWorldSummary": "Bản tóm tắt thế giới mới (ngắn gọn < 150 từ)",
        "extractedMemories": [
          { "content": "Nội dung ký ức", "type": "fact/event/relationship/preference", "importance": 1-10 }
        ]
      }
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: extractionPrompt,
        config: { responseMimeType: "application/json" }
      });

      if (response.text) {
        const result = JSON.parse(response.text);
        this.state.worldSummary = result.newWorldSummary;
        this.state.lastSummarizedTurn = turnCount;

        if (result.extractedMemories && Array.isArray(result.extractedMemories)) {
          for (const mem of result.extractedMemories) {
            await this.upsertMemory(mem.content, mem.type, mem.importance);
          }
        }

        // Giới hạn số lượng ký ức để tránh quá tải (giữ lại các ký ức quan trọng nhất hoặc mới nhất)
        if (this.state.memories.length > 100) {
          this.state.memories.sort((a, b) => (b.metadata.importance * 2 + b.metadata.lastUpdated / 1000000) - (a.metadata.importance * 2 + a.metadata.lastUpdated / 1000000));
          this.state.memories = this.state.memories.slice(0, 100);
        }

        console.log(`[SEMANTIC_MEMORY]: Updated. Total memories: ${this.state.memories.length}`);
      }
    } catch (e) {
      console.error("[SEMANTIC_MEMORY]: Update failed:", e);
    }
  }

  /**
   * Thêm hoặc cập nhật một ký ức dựa trên độ tương đồng ngữ nghĩa
   */
  private async upsertMemory(content: string, type: any, importance: number): Promise<void> {
    const embedding = await embeddingService.getEmbedding(content);
    
    // Tìm xem có ký ức nào tương tự không (để cập nhật thay vì thêm mới)
    let existingIdx = -1;
    let maxSim = 0;

    for (let i = 0; i < this.state.memories.length; i++) {
      const sim = embeddingService.cosineSimilarity(embedding, this.state.memories[i].embedding);
      if (sim > 0.92) { // Độ tương đồng rất cao, coi như cùng một chủ đề
        if (sim > maxSim) {
          maxSim = sim;
          existingIdx = i;
        }
      }
    }

    const now = Date.now();
    if (existingIdx > -1) {
      // Cập nhật ký ức cũ
      this.state.memories[existingIdx].content = content;
      this.state.memories[existingIdx].embedding = embedding;
      this.state.memories[existingIdx].metadata.lastUpdated = now;
      this.state.memories[existingIdx].metadata.importance = Math.max(this.state.memories[existingIdx].metadata.importance, importance);
    } else {
      // Thêm ký ức mới
      this.state.memories.push({
        id: Math.random().toString(36).substring(2, 11),
        content,
        embedding,
        metadata: {
          type,
          importance,
          timestamp: now,
          lastUpdated: now
        }
      });
    }
  }

  /**
   * Lấy ngữ cảnh bộ nhớ dựa trên hành động hiện tại
   */
  public getMemoryContext(actionEmbedding?: number[]): string {
    let relevantMemories: string[] = [];
    
    if (actionEmbedding && actionEmbedding.length > 0 && this.state.memories.length > 0) {
      const scored = this.state.memories.map(m => ({
        content: m.content,
        score: embeddingService.cosineSimilarity(actionEmbedding, m.embedding)
      }));

      relevantMemories = scored
        .sort((a, b) => b.score - a.score)
        .slice(0, 8) // Lấy top 8 ký ức liên quan nhất
        .filter(m => m.score > 0.7) // Chỉ lấy những cái có liên quan thực sự
        .map(m => `- ${m.content}`);
    }

    return `
      [ WORLD SUMMARY ]:
      ${this.state.worldSummary}

      [ RELEVANT SEMANTIC MEMORIES ]:
      ${relevantMemories.length > 0 ? relevantMemories.join("\n") : "Không có ký ức liên quan trực tiếp."}
    `;
  }

  public setState(state: MemoryState) {
    // Đảm bảo cấu trúc dữ liệu cũ vẫn tương thích nếu có
    this.state = {
      worldSummary: state.worldSummary || "Câu chuyện vừa bắt đầu.",
      memories: state.memories || [],
      lastSummarizedTurn: state.lastSummarizedTurn || 0
    };
  }

  public getState(): MemoryState {
    return this.state;
  }
}

export const memoryService = new MemoryService();
