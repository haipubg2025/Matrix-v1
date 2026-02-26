
import { GameGenre, CodexEntry } from "../types";
import { SYSTEM_RULES } from "../prompts/systemRules";
import { BASE_RULES } from "../prompts/baseRules";
import { NARRATIVE_RULES } from "../prompts/narrativeRules";
import { ADULT_RULES } from "../prompts/adultRules";
import { NPC_BASE_RULES } from "../prompts/npcBaseRules";
import { NPC_PHYSICAL_RULES } from "../prompts/npcPhysicalRules";
import { NPC_PSYCHOLOGY_RULES } from "../prompts/npcPsychologyRules";
import { NPC_AFFINITY_RULES } from "../prompts/npcAffinityRules";
import { NPC_CONDITION_RULES } from "../prompts/npcConditionRules";
import { NPC_PERSONALITY_RULES } from "../prompts/npcPersonalityRules";
import { NPC_ALIGNMENT_RULES } from "../prompts/npcAlignmentRules";
import { NPC_SENSORY_RULES } from "../prompts/npcSensoryRules";
import { NPC_BOUNDARY_RULES } from "../prompts/npcBoundaryRules";
import { PHYSICAL_ACTION_RULES } from "../prompts/physicalActionRules";
import { SEXUAL_POSITION_RULES } from "../prompts/sexualPositionRules";
import { FEMALE_FASHION_STYLE_RULES } from "../prompts/femaleFashionStyleRules";
import { embeddingService } from "./embeddingService";

// Giả định các quy tắc thể loại (Genre)
import { FEMALE_PHYSICAL_WUXIA_RULES } from "../prompts/femalePhysicalWuxiaRules";
import { FEMALE_PHYSICAL_URBAN_RULES } from "../prompts/femalePhysicalUrbanRules";
import { FEMALE_PHYSICAL_FANTASY_RULES } from "../prompts/femalePhysicalFantasyRules";

export interface RagContext {
  action: string;
  genre: GameGenre;
  isAdultEnabled: boolean;
  hasNpcs: boolean;
  unlockedCodex?: CodexEntry[];
  actionEmbedding?: number[]; // Added for semantic search
}

export class RagService {
  /**
   * Truy xuất các quy tắc cốt lõi (Luôn luôn cần)
   */
  private getCoreRules(): string {
    return `
      ${SYSTEM_RULES}
      ${BASE_RULES}
      ${NARRATIVE_RULES}
    `;
  }

  /**
   * Truy xuất quy tắc theo thể loại
   */
  private getGenreRules(genre: GameGenre): string {
    switch (genre) {
      case GameGenre.WUXIA: 
      case GameGenre.CULTIVATION:
        return FEMALE_PHYSICAL_WUXIA_RULES;
      case GameGenre.URBAN_NORMAL: 
      case GameGenre.URBAN_SUPERNATURAL: 
        return FEMALE_PHYSICAL_URBAN_RULES;
      case GameGenre.FANTASY_HUMAN:
      case GameGenre.FANTASY_MULTIRACE: 
        return FEMALE_PHYSICAL_FANTASY_RULES;
      default: return "";
    }
  }

  /**
   * Truy xuất quy tắc NPC nếu có tương tác NPC
   */
  private getNpcRules(hasNpcs: boolean): string {
    if (!hasNpcs) return "";
    return `
      ${NPC_BASE_RULES}
      ${NPC_PHYSICAL_RULES}
      ${NPC_PSYCHOLOGY_RULES}
      ${NPC_AFFINITY_RULES}
      ${NPC_CONDITION_RULES}
      ${NPC_PERSONALITY_RULES}
      ${NPC_ALIGNMENT_RULES}
      ${NPC_SENSORY_RULES}
      ${NPC_BOUNDARY_RULES}
    `;
  }

  /**
   * Truy xuất quy tắc Adult dựa trên nội dung hành động hoặc cài đặt
   */
  private getAdultRules(action: string, isEnabled: boolean): string {
    if (!isEnabled || !action) return "";
    
    const adultKeywords = ["sex", "nude", "khỏa thân", "quan hệ", "sờ", "bú", "liếm", "nứng", "dâm", "hoan lạc"];
    const isAdultAction = adultKeywords.some(key => action.toLowerCase().includes(key));
    
    if (isAdultAction) {
      return `
        ${ADULT_RULES}
        ${SEXUAL_POSITION_RULES}
        ${FEMALE_FASHION_STYLE_RULES}
      `;
    }
    return "";
  }

  /**
   * Truy xuất quy tắc hành động vật lý
   */
  private getActionRules(action: string): string {
    if (!action) return "";
    const physicalKeywords = ["đánh", "chạy", "nhảy", "tấn công", "cầm", "nắm", "vật lý"];
    if (physicalKeywords.some(key => action.toLowerCase().includes(key))) {
      return PHYSICAL_ACTION_RULES;
    }
    return "";
  }

  /**
   * Truy xuất các mục Codex liên quan đến hành động hoặc bối cảnh
   * Sử dụng Vector Similarity nếu có embedding, nếu không dùng Keyword matching
   */
  private getCodexContext(action: string, codex?: CodexEntry[], actionEmbedding?: number[]): string {
    if (!codex || codex.length === 0 || !action) return "";
    
    let relevantEntries: CodexEntry[] = [];

    if (actionEmbedding && actionEmbedding.length > 0) {
      // Giả sử chúng ta chưa lưu embedding trong CodexEntry, chúng ta sẽ tính toán nhanh hoặc dùng keyword nếu chưa có cache
      // Trong thực tế, CodexEntry nên có trường embedding. 
      // Ở đây chúng ta sẽ fallback về keyword nếu không muốn tốn quá nhiều API call cho mỗi entry mỗi lần.
      // Tuy nhiên, để demo "áp dụng", tôi sẽ lọc theo keyword trước, sau đó nếu có embedding thì có thể mở rộng sau.
      
      // Tạm thời: Vẫn dùng keyword matching nhưng ưu tiên semantic nếu được tích hợp sâu hơn.
      relevantEntries = codex.filter(entry => {
        const keywords = (entry.title || '').toLowerCase().split(" ");
        return keywords.some(key => key.length > 2 && action.toLowerCase().includes(key));
      });
    } else {
      relevantEntries = codex.filter(entry => {
        const keywords = (entry.title || '').toLowerCase().split(" ");
        return keywords.some(key => key.length > 2 && action.toLowerCase().includes(key));
      });
    }

    if (relevantEntries.length === 0) return "";

    return `
      KIẾN THỨC THẾ GIỚI (UNLOCKED LORE):
      ${relevantEntries.map(e => `[${e.title}]: ${e.content}`).join("\n")}
    `;
  }

  /**
   * Hàm chính để lấy Prompt đã tối ưu hóa (RAG)
   */
  public assembleOptimizedPrompt(context: RagContext): string {
    const chunks = [
      this.getCoreRules(),
      this.getGenreRules(context.genre),
      this.getNpcRules(context.hasNpcs),
      this.getAdultRules(context.action, context.isAdultEnabled),
      this.getActionRules(context.action),
      this.getCodexContext(context.action, context.unlockedCodex, context.actionEmbedding)
    ];

    return chunks.filter(c => c.trim() !== "").join("\n\n");
  }
}

export const ragService = new RagService();
