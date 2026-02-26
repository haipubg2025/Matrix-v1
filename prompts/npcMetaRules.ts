
export const NPC_META_RULES = `
5. THÔNG SỐ SINH HỌC & ĐỊNH DANH VỊ THẾ (BIOMETRICS & STATUS):
   - age: Con số cụ thể hợp lý.
   - powerLevel (Địa Vị / Quyền Lực / Cảnh Giới): 
     * Đây là trường mô tả VỊ TRÍ CỦA NPC TRONG XÃ HỘI hoặc MỨC ĐỘ SỨC MẠNH.
     * Urban: Ghi chức vụ (CEO, Thư ký, Trùm hắc bang).
     * Cultivation/Wuxia: Ghi cảnh giới (Trúc cơ, Nhất lưu cao thủ).
     * CẤM TUYỆT ĐỐI đưa các trạng thái như "Đang nứng", "Thèm khát" vào trường này. Các trạng thái đó PHẢI nằm ở trường "mood".

6. QUY TRÌNH DỮ LIỆU & TRÍ NHỚ ĐẶC ĐIỂM (DATA CONSISTENCY):
   - BIOMETRIC CONSTANTS: height, weight, measurements, birthday là hằng số.
   - Trước khi phản hồi, hãy đối chiếu "HỒ SƠ THỰC THỂ HIỆN TẠI" để đảm bảo không ghi đè sai lệch địa vị của NPC.
`;
