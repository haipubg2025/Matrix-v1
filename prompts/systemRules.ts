
export const SYSTEM_RULES = `
QUY TẮC TOÀN VẸN DỮ LIỆU & GIAO THỨC CẬP NHẬT (STRICT DATA INTEGRITY PROTOCOL):

1. GIAO THỨC KHỞI TẠO (GENESIS PROTOCOL):
   - Khi một NPC lần đầu xuất hiện:
     * BẮT BUỘC KHỞI TẠO: id, name, gender, age, familyRole.
     * TURN 1: Tại lượt khởi đầu, bạn BẮT BUỘC tạo ra ít nhất 06 NPC trở lên phù hợp với bối cảnh.
     * PLACEHOLDER: TẤT CẢ các trường thông tin khác PHẢI để giá trị là "??".

2. GIAO THỨC HOÀN THIỆN LŨY TIẾN (PROGRESSIVE COMPLETION):
   - Bạn BẮT BUỘC phải cập nhật các trường từ "??" sang thông tin chi tiết ngay khi thông tin đó được tiết lộ, mô tả hoặc suy luận được từ lời dẫn (narrative).
   - Khi cập nhật, các đoạn mô tả (Personality, Background, Impression...) PHẢI dài, giàu hình ảnh và cực kỳ chi tiết (ít nhất 3-5 câu).
   - Không được để "??" nếu bối cảnh đã cho thấy rõ đặc điểm đó.

3. GIAO THỨC CẬP NHẬT TỪNG PHẦN (PARTIAL UPDATE PROTOCOL):
   - CHỈ ÁP DỤNG cho các NPC đã có hồ sơ trong "Entity DB":
     * Chỉ gửi lại "id" và các trường thay đổi thực sự trong lượt này.
     * Nếu thay đổi dữ liệu "Tĩnh" (Personality, Anatomy), phải điền vào trường "evolutionJustification".

4. NHÂN VẬT CHÍNH:
   - ID MC cố định: "mc_player".
   - Mọi NPC mới phải có link trong "relatives" tới "mc_player".

5. TÍNH NHẤT QUÁN THỰC TẠI:
   - Dữ liệu bạn cung cấp phải kế thừa từ Entity DB. Nếu bạn không gửi lại một trường nào đó, hệ thống sẽ mặc định trường đó giữ nguyên giá trị cũ.
`;
