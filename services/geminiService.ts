
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { GameUpdate, GameGenre, getGenreMeta, Relationship, Player, AppSettings, AiModel } from "../types";
import { ragService } from "./ragService";
import { memoryService } from "./memoryService";
import { embeddingService } from "./embeddingService";

export const TIME_LOGIC_RULES = `
QUY TẮC THỜI GIAN VÀ NGÀY THÁNG (STRICT CHRONOLOGY PROTOCOL):
1. ĐỊNH DẠNG BẮT BUỘC: Sử dụng định dạng số thuần túy duy nhất: "Ngày DD/MM/YYYY | HH:mm".
2. NGHIÊM CẤM TỪ NGỮ VĂN HỌC/ƯỚC LỆ:
   - CẤM dùng Niên hiệu (Vd: Năm Long Đức thứ nhất).
   - CẤM dùng số thứ tự cho năm (Vd: Năm thứ 200). Chỉ dùng con số trần (Vd: Năm 200).
   - CẤM dùng giờ can chi (Vd: Giờ Thìn, Giờ Tỵ).
   - CẤM dùng lịch âm hoặc cách gọi tiết khí (Vd: Tiết lập xuân).
3. LOGIC NGÀY SINH (BIRTHDAY SYNC):
   - Mọi thực thể mới PHẢI có ngày sinh (birthday) khớp logic với tuổi (age) và NĂM HIỆN TẠI.
   - CÔNG THỨC: Năm_sinh = [Năm hiện tại trong Game] - [Tuổi nhân vật].
   - VÍ DỤ: Nếu game đang ở Ngày 15/05/1400 và NPC 20 tuổi, birthday PHẢI có năm là 1380.
   - Hạn chế sử dụng ngày 01/01 cho sinh nhật ngẫu nhiên để tránh trùng lặp máy móc.
4. ĐỐI VỚI HÀNH ĐỘNG NHẬP TAY: Tự động tính toán timeSkip dựa trên nỗ lực vật lý (phút).
`;

export const QUEST_LOGIC_RULES = `
QUY TẮC NHIỆM VỤ (QUEST LOGIC PROTOCOL):
1. CẬP NHẬT TRẠNG THÁI: Chỉ gửi "questUpdates" khi có nhiệm vụ mới, thay đổi tiến độ hoặc hoàn thành/thất bại.
2. ĐỊNH DẠNG: Mỗi nhiệm vụ phải có id duy nhất, title, description và status.
3. PHÂN NHÓM (group): 'main' hoặc 'side'.
4. PHÂN LOẠI (kind): 'single' hoặc 'chain'.
5. PHONG CÁCH NỘI DUNG: Nếu MC sở hữu 'systemName', lời ban hành phải đậm chất cơ khí/lượng tử.
`;

export class GeminiGameService {
  private failedKeys: Set<string> = new Set();

  private extractValidJson(text: string): string {
    let cleaned = text.trim();
    if (cleaned.includes('```json')) {
      cleaned = cleaned.split('```json')[1].split('```')[0].trim();
    } else if (cleaned.includes('```')) {
      cleaned = cleaned.split('```')[1].split('```')[0].trim();
    }
    const startIndex = cleaned.indexOf('{');
    if (startIndex === -1) return cleaned;
    let stack = 0;
    let inString = false;
    let escape = false;
    for (let i = startIndex; i < cleaned.length; i++) {
      const char = cleaned[i];
      if (char === '"' && !escape) inString = !inString;
      if (!inString) {
        if (char === '{') stack++;
        if (char === '}') stack--;
        if (stack === 0) return cleaned.substring(startIndex, i + 1);
      }
      escape = (char === '\\' && !escape);
    }
    return cleaned;
  }

  public reportKeyFailure(key: string) {
    if (key) this.failedKeys.add(key);
    console.warn(`[MATRIX_API]: Key blacklisted. Total failed: ${this.failedKeys.size}`);
  }

  public resetBlacklist() {
    this.failedKeys.clear();
    console.log(`[MATRIX_API]: Blacklist reset.`);
  }

  async getResponse(
    systemInstruction: string, 
    history: any[], 
    action: string, 
    currentTime: string, 
    genre?: GameGenre,
    playerObj?: any,
    settings?: AppSettings,
    lastTurnNewNpcCount: number = 0
  ): Promise<GameUpdate> {
    let apiKeyToUse = process.env.GEMINI_API_KEY;
    let usedKeyIndex = 0; // 0 means system key
    
    if (settings?.userApiKeys && settings.userApiKeys.length > 0) {
      const allKeys = settings.userApiKeys;
      // Filter out failed keys
      const availableKeys = allKeys.filter(k => !this.failedKeys.has(k));
      
      // If all keys failed, reset the blacklist to try again
      const keysToUse = availableKeys.length > 0 ? availableKeys : allKeys;
      if (availableKeys.length === 0 && this.failedKeys.size > 0) {
        console.log("[MATRIX_API]: All keys failed. Resetting blacklist.");
        this.failedKeys.clear();
      }

      const turnBase = playerObj?.turnCount || 0;
      const retrySeed = Math.floor(Date.now() / 10000);
      const index = (turnBase + retrySeed) % keysToUse.length;
      
      apiKeyToUse = keysToUse[index];
      // Find the original index in the full list for UI reporting
      usedKeyIndex = allKeys.indexOf(apiKeyToUse) + 1;
      
      console.log(`[MATRIX_API]: Using Key Index ${usedKeyIndex}/${allKeys.length} (${availableKeys.length} available)`);
    }

    try {
      const ai = new GoogleGenAI({ apiKey: apiKeyToUse || '' });
      const existingNpcs = playerObj?.relationships || [];
      const activeQuests = playerObj?.quests?.filter((q: any) => q.status === 'active') || [];
      const mcName = playerObj?.name || "Nhân vật chính";
      const currentSystem = playerObj?.systemName || "";
      const currentLocation = playerObj?.currentLocation || "Chưa xác định";

      // Fetch action embedding for semantic search in RAG
      let actionEmbedding: number[] | undefined = undefined;
      try {
        actionEmbedding = await embeddingService.getEmbedding(action);
      } catch (err) {
        console.warn("[MATRIX_API]: Failed to get action embedding, falling back to keyword search.");
      }

      const entityDb = [
        `ID: mc_player | Tên: ${mcName} | Danh hiệu: ${playerObj?.title || "Vô danh"} | Gia thế: ${playerObj?.lineage || "Chưa xác định"} | Hệ Thống: ${currentSystem}`,
        `THÔNG TIN ĐÁM ĐÔNG: Lượt trước đã tạo ${lastTurnNewNpcCount} NPC mới. Tổng số NPC hiện có: ${existingNpcs.length}.`,
        ...existingNpcs.map((n: Relationship) => {
          return `ID: ${n.id} | Tên: ${n.name} | Tuổi: ${n.age} | Thiện cảm: ${n.affinity}/1000 | Trung thành: ${n.loyalty}/1000 | Dục vọng: ${n.lust}/1000 | Mood: ${n.mood}`;
        })
      ].join('\n');

      const optimizedRules = ragService.assembleOptimizedPrompt({
        action,
        genre: genre || GameGenre.URBAN_NORMAL,
        isAdultEnabled: settings?.adultContent !== false,
        hasNpcs: existingNpcs.length > 0,
        unlockedCodex: playerObj?.codex?.filter((c: any) => c.unlocked),
        actionEmbedding // Pass the embedding here
      });

      const combinedRules = `
        ${optimizedRules}
        
        ${memoryService.getMemoryContext(actionEmbedding)}

        MỆNH LỆNH GENESIS TỐI THƯỢNG (GENESIS COMMAND):
        1. KHỞI CHẠY VẬN MỆNH (TURN 1): Tại lượt đầu tiên, bạn BẮT BUỘC tạo ra ít nhất 06 NPC trở lên dựa trên bối cảnh khởi đầu. BẮT BUỘC gán trường "familyRole" (Vai trò MC) cụ thể cho từng người. Toàn bộ các trường thông tin chi tiết khác (Personality, Anatomy, Background...) PHẢI để giá trị placeholder duy nhất là "??".
        2. GIAO THỨC ĐÁM ĐÔNG (CROWD PROTOCOL): Khi MC ở môi trường đông người (Lớp học, Công sở, Tiệc tùng, Phố xá...), bạn PHẢI chủ động tạo thêm 5-10 NPC phụ để lấp đầy bối cảnh. Hãy dựa vào "THÔNG TIN ĐÁM ĐÔNG" được cung cấp để biết lượt trước bạn đã tạo bao nhiêu người và hiện có bao nhiêu người tại đây để quyết định có cần tạo thêm không.
        3. CHỈ SỐ QUAN HỆ (CRITICAL): Mọi NPC Tiềm năng (Key NPCs) BẮT BUỘC phải có 3 chỉ số sau trong JSON. Đối với NPC Quần chúng (Crowd NPCs), KHÔNG CẦN tạo ra ngay các chỉ số này (hãy để trống hoặc không gửi trong JSON) cho đến khi MC tương tác trực tiếp với họ:
           - "affinity" (Thiện cảm): 0-1000.
           - "loyalty" (Trung thành): 0-1000.
           - "lust" (Dục vọng): 0-1000.
        4. HOÀN THIỆN LŨY TIẾN (PLACEHOLDER REPLACEMENT): Bạn BẮT BUỘC phải cập nhật các trường từ "??" sang thông tin chi tiết ngay khi thông tin đó được tiết lộ, mô tả hoặc suy luận được từ lời dẫn (narrative). Khi cập nhật, các đoạn mô tả (Personality, Background, Impression...) PHẢI dài và cực kỳ chi tiết (ít nhất 3-5 câu văn giàu hình ảnh).
        5. ĐỊNH DANH THỰC THỂ: Mọi nhân vật có lời thoại hoặc hành động cụ thể trong trường "text" ĐỀU PHẢI được liệt kê vào danh sách "newRelationships" trong JSON với hồ sơ đầy đủ chỉ số. Tuyệt đối không để sót nhân vật nào đã xuất hiện trong lời dẫn.
        3. VAI TRÒ MC (MANDATORY): Mọi NPC được tạo ra BẮT BUỘC phải có trường "familyRole" cụ thể, không được để placeholder.
        4. CHỈ CẬP NHẬT TỪNG PHẦN CHO NPC CŨ: Đối với NPC đã có dữ liệu, bạn chỉ gửi các trường thay đổi.

        MỆNH LỆNH GIẢI TRÌNH (CRITICAL):

        MỆNH LỆNH ƯU TIÊN TUYỆT ĐỐI (ZERO TOLERANCE POLICY):
        0. ĐỊA ĐIỂM (LOCATION): Bạn BẮT BUỘC phải xác định và trả về "currentLocation" trong JSON. Nếu MC di chuyển, hãy cập nhật nó. Nếu không di chuyển, hãy giữ nguyên giá trị hiện tại.
        1. KHỞI TẠO NPC: Bắt buộc tuân thủ GIAO THỨC GENESIS. Chỉ khởi tạo các trường MANDATORY (id, name, gender, age, familyRole). Tất cả các trường khác PHẢI để "??".
        2. NPC STATUS & LOCATION: Bạn PHẢI cập nhật trường "status" (đang làm gì) và "lastLocation" (đang ở đâu) cho mọi NPC xuất hiện hoặc được nhắc tới trong lượt này.
        3. Trường "text" PHẢI trên 150 từ, giàu miêu tả nét đẹp phụ nữ, cử chỉ vi mô, TƯ THẾ HOAN LẠC và không khí.
        4. BẮT BUỘC: Mọi nhân vật xuất hiện trong trường "text" ĐỀU PHẢI được liệt kê vào danh sách "newRelationships" trong JSON với hồ sơ đầy đủ.
        5. MC MATRIX LINK: Mọi NPC mới bắt buộc phải có liên kết tới "mc_player" trong mảng "relatives".
        6. THỜI GIAN: Dùng định dạng số thuần túy "Ngày DD/MM/YYYY | HH:mm". Đồng bộ sinh nhật = [Năm Hiện Tại] - age.
        4. MC IDENTITY & ASSETS (CRITICAL): Nếu đây là lượt BẮT ĐẦU, bạn BẮT BUỘC phải xác định và trả về "name", "title", "lineage" (Gia thế), "inventory" (Túi đồ), "skills" (Kỹ năng) và "assets" (Tài sản) phù hợp tuyệt đối với bối cảnh thông qua JSON "statsUpdates". 
        5. QUẢN LÝ TÚI ĐỒ (INVENTORY MANAGEMENT): Bạn PHẢI chủ động cập nhật "inventory", "skills" và "assets" trong "statsUpdates" khi MC nhận được vật phẩm mới, học kỹ năng mới hoặc mất đi thứ gì đó. Mỗi thực thể trong các danh sách này PHẢI là một object có cấu trúc: {"name": "Tên", "description": "Mô tả chi tiết và đầy đủ"}. Đừng để MC trống rỗng nếu bối cảnh cho thấy họ nên có vật phẩm.
        6. MATRIX INTEGRATION: Khi tạo NPC mới, PHẢI liên kết họ với các thực thể trong Entity DB hoặc các NPC mới khác cùng xuất hiện.
        6. BẮT BUỘC: Mọi nhân vật xuất hiện trong trường "text" ĐỀU PHẢI được liệt kê vào danh sách "newRelationships" trong JSON.
        7. MC MATRIX LINK: Mọi NPC mới có quan hệ với MC bắt buộc phải có liên kết tới "mc_player" trong mảng "relatives".
        8. NPC TYPE CLASSIFICATION: BẮT BUỘC gán trường "type" cho mọi NPC mới (harem/social). Đối với NPC "social" là thuộc hạ, cấp dưới hoặc người làm thuê cho MC, bạn PHẢI cập nhật thêm chỉ số "loyalty" (0-100) để phản ánh mức độ trung thành (nếu thông tin này đã được tiết lộ).
        9. SYSTEM QUESTS: ${currentSystem ? `Bạn đang đóng vai ${currentSystem}. Mọi "questUpdates" phải do Hệ Thống này ban hành với phân loại 'main/side' và 'single/chain' nghiêm ngặt.` : `Bạn là người dẫn truyện khách quan. Chỉ ban hành nhiệm vụ nếu bối cảnh yêu cầu.`}
        11. THỜI GIAN: Dùng định dạng số thuần túy "Ngày DD/MM/YYYY | HH:mm". Hạn chế dùng ngày 01/01. Cấm dùng từ văn học.
        12. ĐỒNG BỘ TUỔI/SINH NHẬT: Mọi nhân vật mới phải có birthday_year = [Năm Hiện Tại trong Game] - age. 
        13. THANG ĐO 1000: Luôn sử dụng thang điểm 0-1000 cho affinity, loyalty và lust.
        14. ĐẠO ĐỨC VS DỤC VỌNG: NPC có fetish bị sỉ nhục sẽ cảm thấy NHỤC NHÃ (Đạo đức) nhưng đồng thời CỰC SƯỚNG (Fetish). Bạn phải miêu tả cả hai.
        14. BIẾT SỢ: NPC không được trơ trẽn 100%. Họ phải lo sợ bị người khác nhìn thấy, sợ mất danh dự. Sự sỡ hãi này làm khoái cảm của họ tăng lên nhưng khiến họ lệ thuộc vào MC để được "giữ bí mật".
        15. TOÁN HỌC: Nỗi sợ + Dục vọng = Tăng điểm thiện cảm. Tuyệt đối không trừ điểm nếu NPC "xấu hổ" do fetish.
        15. SYMMETRIC RELATIONS: Đảm bảo quan hệ trong Matrix luôn đối xứng và logic.
        16. GỢI Ý HÀNH ĐỘNG (SUGGESTED ACTIONS): Bạn BẮT BUỘC phải cung cấp 3-4 gợi ý hành động sáng tạo, đa dạng (không chỉ là "Tiếp tục") trong trường "suggestedActions". Mỗi gợi ý phải phản ánh đúng tình huống hiện tại và tính cách MC.
        17. SYSTEM NAME PROTOCOL: Tuyệt đối KHÔNG tự ý cập nhật hoặc thay đổi trường "systemName" trong "statsUpdates" trừ khi người chơi yêu cầu kích hoạt hệ thống hoặc có sự kiện thức tỉnh hệ thống rõ ràng trong cốt truyện.

        ${TIME_LOGIC_RULES}
        ${QUEST_LOGIC_RULES}

        THÔNG TIN THỰC TẠI HIỆN TẠI (ENTITY DB):
        ${entityDb}
        
        NHIỆM VỤ ĐANG KÍCH HOẠT:
        ${activeQuests.length > 0 ? activeQuests.map((q: any) => `- ${q.title} (${q.group})`).join('\n') : "Không có."}

        ĐỊA ĐIỂM HIỆN TẠI: ${currentLocation}
        THỜI GIAN: ${currentTime}
        THỂ LOẠI: ${genre || 'General'}
      `;

      const modelToUse = settings?.aiModel || AiModel.FLASH;
      const budgetToUse = settings?.thinkingBudget !== undefined ? settings.thinkingBudget : 4000;

      const response = await ai.models.generateContent({
        model: modelToUse,
        contents: [...history, { role: 'user', parts: [{ text: action }] }],
        config: {
          systemInstruction: `${combinedRules} \n\n CHỈ THỊ THẾ GIỚI: ${systemInstruction}`,
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: budgetToUse }, 
          safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE }
          ]
        },
      });

      // Check for safety blocks or empty responses
      if (!response.candidates || response.candidates.length === 0) {
        throw new Error("SAFETY_BLOCK: Hệ thống không nhận được phản hồi từ AI. Có thể nội dung đã bị bộ lọc an toàn chặn.");
      }

      const candidate = response.candidates[0];
      if (candidate.finishReason === 'SAFETY') {
        throw new Error("SAFETY_BLOCK: Phản hồi bị chặn do vi phạm chính sách an toàn (Safety Filter). Hãy thử điều chỉnh hành động bớt nhạy cảm hơn.");
      }

      let responseText = "";
      try {
        responseText = response.text || "";
      } catch (textErr) {
        throw new Error("SAFETY_BLOCK: Không thể truy xuất nội dung do bộ lọc an toàn. Hãy thử lại với hành động khác.");
      }

      const cleanedText = this.extractValidJson(responseText);
      if (!cleanedText || !cleanedText.includes('{')) {
        throw new Error("PARSE_ERROR: AI không tạo ra dữ liệu JSON hợp lệ. Có thể do nội dung quá dài hoặc bị ngắt quãng.");
      }

      let parsed: GameUpdate;
      try {
        parsed = JSON.parse(cleanedText) as GameUpdate;
      } catch (jsonErr) {
        console.error("[MATRIX_API]: JSON Parse Error", jsonErr, "Raw Text:", cleanedText);
        throw new Error("PARSE_ERROR: Lỗi phân tích lượng tử. Dữ liệu AI trả về bị lỗi cấu trúc.");
      }

      parsed.usedKeyIndex = usedKeyIndex;
      
      return parsed;
    } catch (e: any) {
      // Report failure if it's a user key
      if (usedKeyIndex > 0 && apiKeyToUse) {
        this.reportKeyFailure(apiKeyToUse);
      }
      e.usedKeyIndex = usedKeyIndex;
      throw e;
    }
  }
}

export const gameAI = new GeminiGameService();
