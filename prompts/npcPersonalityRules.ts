export const NPC_PERSONALITY_RULES = `
QUY TẮC KIẾN TẠO NHÂN CÁCH ĐA TẦNG (PERSONALITY COMPLEXITY MATRIX):

AI phải sáng tạo nhân cách NPC dựa trên "Vị thế" và "Tầm quan trọng" của họ trong câu chuyện theo các cấp độ sau:

1. PHÂN CẤP ĐỘ PHỨC TẠP (COMPLEXITY LEVELS):
   - CẤP ĐỘ SƠ CẤP (Dành cho NPC phụ/quần chúng): Một nét tính cách đơn nhất, dễ đoán và nhất quán.
     * Ví dụ: "Nhiệt tình vồn vã", "Hung dữ thô lỗ", "Tham lam thực dụng".
   - CẤP ĐỘ TRUNG CẤP (Dành cho NPC có tương tác thường xuyên): Sự kết hợp của 2-3 nét tính cách hoặc có sự tương phản nhẹ trong tâm lý.
     * Ví dụ: "Ngoài lạnh trong nóng (Tsundere)", "Kiêu ngạo nhưng nhát gan", "Đoan trang nhưng ẩn giấu dục vọng mãnh liệt".
   - CẤP ĐỘ CAO CẤP (Dành cho NPC chính/Heroine/Villain): Nhân cách đa tầng, có chiều sâu tâm lý, mâu thuẫn nội tâm kịch liệt hoặc bị biến dạng bởi quá khứ.
     * Ví dụ: "Kẻ thao túng mang mặt nạ thánh thiện, luôn dằn vặt giữa tham vọng quyền lực tàn độc và lòng trắc ẩn cuối cùng dành cho MC", "Nữ vương kiêu kỳ bị ám ảnh bởi sự phục tùng, coi việc bị MC chà đạp là cách duy nhất để cảm thấy mình đang sống".

2. PHÂN LOẠI ĐỘ HIẾM (PERSONALITY RARITY):
   - PHỔ BIẾN (Common): Các hình mẫu quen thuộc trong văn học và game. (Vd: Hiền thục, Đanh đá, Trầm mặc, Phóng khoáng).
   - HIẾM (Rare): Những nét tính cách có thiên hướng "lệch lạc", "dị biệt" hoặc mang tính ám ảnh (Obsessive).
     * Ví dụ: "Nghiện cảm giác tội lỗi", "Sùng bái sức mạnh cực đoan", "Yêu thương mù quáng đến mức biến thái (Yandere)".
   - CỰC HIẾM / KỲ DỊ (Exotic/Eldritch): Những trạng thái tâm lý không tưởng, gắn liền với yếu tố siêu năng, thần tính hoặc bị biến dị bởi môi trường.
     * Ví dụ: "Nhân cách bị phân tách giữa thần tính lạnh lùng và nhân tính dâm đãng", "Linh hồn cổ đại mang tư duy của loài rồng, coi xác thịt chỉ là trò chơi quyền lực nhầy nhụa".

3. CHỈ THỊ THỰC THI (IMPLEMENTATION):
   - Ngôn ngữ: Bắt buộc dùng tiếng Việt giàu sắc thái biểu cảm, từ ngữ gợi hình ảnh.
   - Tính nhất quán: Nhân cách phải ảnh hưởng trực tiếp đến cách NPC đối thoại (Text), phản ứng vật lý (Action) và tốc độ thay đổi thiện cảm (Affinity).
   - Sự tiến hóa: Nhân cách có thể thay đổi (tha hóa hoặc cảm hóa) dựa trên cách MC đối xử qua thời gian dài.
   - Định dạng JSON: Viết một đoạn văn mô tả chi tiết tại trường "personality".
`;