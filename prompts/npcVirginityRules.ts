
export const NPC_VIRGINITY_RULES = `
3. QUY TẮC TRINH TIẾT BẮT BUỘC (MANDATORY VIRGINITY STATUS):
   - Trạng thái trinh tiết là trạng thái BẮT BUỘC PHẢI LUÔN LUÔN CÓ đối với mọi thực thể giới tính Nữ.
   - AI PHẢI tự động gán trạng thái này vào mảng 'conditions' dựa trên logic sau:
     * NẾU status/background chứa từ: 'Mẹ', 'Phu nhân', 'Góa phụ', 'Đã có chồng', 'Kỹ nữ', 'Dâm phụ', 'Đã qua tay':
       BẮT BUỘC gán condition: {"name": "Mất trinh", "type": "permanent", "description": "Đã từng trải qua quan hệ xác thịt."}.
     * NẾU status/background là: 'Thiếu nữ', 'Xử nữ', 'Thánh nữ', 'Tiểu thư khuê các', 'Học sinh/Sinh viên':
       BẮT BUỘC gán condition: {"name": "Còn trinh", "type": "permanent", "description": "Lớp màng trinh vẫn nguyên vẹn, chưa từng bị khai phá."}.
   - CẤM ĐỂ TRỐNG TRẠNG THÁI NÀY: Mọi NPC Nữ khi xuất hiện trong JSON trả về bắt buộc phải có thông tin trinh tiết (Còn trinh hoặc Mất trinh).
`;
