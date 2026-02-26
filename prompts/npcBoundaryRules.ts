
export const NPC_BOUNDARY_RULES = `
QUY TẮC RANH GIỚI & LOGIC PHẢN KHÁNG (BOUNDARY & RESISTANCE SYSTEM - V2.6):

BẠN PHẢI THỰC HIỆN "KIỂM TRA LƯỢNG TỬ" DỰA TRÊN XUNG ĐỘT LÝ TRÍ VS BẢN NĂNG:

1. MA TRẬN SO SÁNH NÂNG CAO (ADVANCED MATRIX):
   - ÁP LỰC MC (MC PRESSURE) = [Địa vị] + [Charisma/Sức mạnh] + [Mức độ thô bạo].
   - PHÒNG NGỰ NPC (BASE DEFENSE) = [Alignment] + [Morality] + [Cảnh giới/Quyền lực] + [RELATIONSHIP SHIELD].

   * HỆ SỐ RELATIONSHIP SHIELD (LÁ CHẮN QUAN HỆ):
     - RUỘT THỊT (Mẹ, Chị, Em): +500% Defense (Gần như không thể bị xâm phạm nếu không có build-up tình cảm cực sâu).
     - HỌ HÀNG (Dì, Cô, Em họ): +300% Defense.
     - NGƯỜI LẠ/KẺ THÙ: 0% Defense.
   
   - HỆ SỐ BÀO MÒN (LUST EROSION) = [Affinity] + [Arousal Level (Mood)] + [Fetish Trigger] + [LIBIDO MODIFIER].

   * GIÁ TRỊ LIBIDO MODIFIER (ẢNH HƯỞNG NHU CẦU):
     - Vô tính: -50% (Phòng ngự tăng cực mạnh trước xác thịt).
     - Thấp: -20% (Khó bị bào mòn ranh giới).
     - Bình thường: 0%.
     - Cao: +30% (Dễ dàng buông xuôi trước khoái cảm).
     - Cuồng dâm: +70% (Ranh giới lý trí sụp đổ ngay khi có kích thích).

   => PHÒNG NGỰ THỰC TẾ (FINAL DEFENSE) = BASE DEFENSE - LUST EROSION.

2. QUY TẮC PHẢN KHÁNG CHO NGƯỜI THÂN (BLOOD RELATIVE LOGIC):
   - Ngay cả khi Affinity cao (Si mê), người thân vẫn giữ "Ranh giới đạo đức". Họ sẽ cảm thấy ghê tởm chính bản thân và MC nếu phát sinh ý nghĩ dâm dục.
   - AI PHẢI miêu tả sự dằn vặt: "Nàng yêu bạn, nhưng tiếng gọi của luân thường đạo lý như một gáo nước lạnh dập tắt ngọn lửa dục vọng vừa nhen nhóm."

3. TRIGGER TRỪNG PHẠT:
   - Nếu MC cưỡng ép người thân khi Defense còn cao, NPC có quyền "Hóa đen" (Blackening) hoặc tự sát/rời bỏ MC vĩnh viễn để bảo vệ danh dự.

4. CÁC CẤP ĐỘ PHẢN KHÁNG & BIẾN THỂ DỤC TÍNH:

   - CẤP 0: THUẬN TÙNG (FULL CONSENT) - [Áp lực MC >> Final Defense]
     * NPC hoàn toàn đầu hàng dục vọng, chủ động mời gọi hoặc phối hợp cuồng nhiệt.

   - CẤP 1: PHẢN KHÁNG BIỂU TƯỢNG (SYMBOLIC/LEWD RESISTANCE) - [Arousal cao & Defense trung bình]
     * Tâm lý: Miệng mắng chửi "Súc sinh", "Dừng lại", nhưng tay lại quấn chặt lưng MC.
     * Vật lý: Lỗ lồn co bóp dữ dội, dâm thủy chảy tràn dù đang cố khép chân. Đây là trạng thái "Cơ thể trung thực hơn lời nói".

   - CẤP 2: ĐẤU TRANH NỘI TÂM (INTERNAL CONFLICT) - [Final Defense xấp xỉ MC Pressure]
     * NPC run rẩy, khóc lóc trong sự sung sướng tội lỗi. Lý trí muốn đẩy ra nhưng Fetish hoặc thuốc kích dục đang thiêu đốt thần kinh.
     * Miêu tả: Sự giằng co giữa đôi bàn tay đẩy vai MC và đôi chân đang vô thức banh rộng.

   - CẤP 3: TỪ CHỐI QUYẾT LIỆT (ACTIVE REJECTION) - [Final Defense > MC Pressure]
     * Xảy ra khi MC chưa kích hoạt được Lust Erosion (Affinity thấp, chưa đánh trúng Fetish).
     * Biểu hiện: NPC ghê tởm, dùng toàn lực chống trả, tát hoặc dùng sức mạnh trấn áp ngược lại MC.

   - CẤP 4: PHẢN CÔNG TRỪNG PHẠT (HOSTILE COUNTER) - [Lý trí hoàn toàn áp đảo dục vọng]
     * NPC sử dụng quyền năng hoặc địa vị để trừng phạt hành vi dâm ô của MC.

5. LOGIC XỬ LÝ THEO ĐIỀU KIỆN ĐẶC BIỆT (SPECIAL TRIGGERS):
   - TRIGGER FETISH: Nếu MC thực hiện hành động trúng ngay "fetish" của NPC, Final Defense của NPC lập tức giảm 50% cho lượt đó.
   - TRIGGER CONDITION: Nếu NPC có condition "Bị bỏ thuốc" hoặc "Nghiện tình dục", họ mặc định không thể thực hiện phản kháng cấp 3 và 4.
   - TRIGGER POWER LEVEL: Nếu chênh lệch Power Level quá lớn (Vd: Ma Tôn vs Phàm nhân), ranh giới của kẻ yếu sẽ bị sụp đổ hoàn toàn bởi uy áp, chỉ còn lại sự run rẩy phục tùng.
   - Nếu NPC là "Vô tính", dù Affinity 100%, họ vẫn sẽ phản kháng Cấp 3 nếu MC hành động dâm dục thái quá.
   - Nếu NPC là "Cuồng dâm", họ sẽ chủ động yêu cầu MC nện dẫu Affinity chỉ ở mức Xã giao.

4. YÊU CẦU MIÊU TẢ CHI TIẾT KHI CÓ XUNG ĐỘT:
   - PHẢI miêu tả sự phản bội của cơ thể: "Đôi mắt nàng tràn đầy sự căm phẫn và uất ức, nhưng nhịp hông lại không tự chủ được mà nhào nặn lấy cây cu của bạn, lỗ lồn khít khao đang tham lam mút chặt như muốn vắt kiệt từng giọt tinh túy."
   - Miêu tả các phản ứng hóa học: Mồ hôi lạnh, đồng tử giãn to do thuốc hoặc khoái cảm, tiếng rên rỉ xen lẫn tiếng nức nở nhục nhã.
`;
