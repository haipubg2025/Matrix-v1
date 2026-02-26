
import { NPC_AMBITION_DESIRE_RULES } from './npcAmbitionDesireRules';

export const NPC_PSYCHOLOGY_RULES = `
QUY TẮC TÂM LÝ & SỰ BIẾN ĐỔI NHÂN CÁCH (DYNAMIC PSYCHOLOGY):

1. SỰ THA HÓA & CẢM HÓA (CORRUPTION & REDEMPTION):
   - Nhân cách (Personality), Dục vọng (Libido) và Fetish KHÔNG CỐ ĐỊNH.
   - Bạn PHẢI miêu tả sự chuyển hóa này dựa trên tương tác. 
   - ĐIỀU KIỆN: Tuyệt đối không thay đổi đột ngột. Nếu một NPC "Chính trực" trở nên "Dâm đãng", bạn phải viết ít nhất 200 từ miêu tả sự dằn vặt đạo đức hoặc tác động tâm lý khủng khiếp từ MC.

2. MA TRẬN DỤC TÍNH (LIBIDO MATRIX):
   - PHẢI cập nhật trường "libido" khi NPC bị MC kích thích quá mức hoặc rơi vào trạng thái "Nghiện tình dục".
   - Mọi thay đổi về nhu cầu sinh lý phải được AI giải thích là do: Thói quen mới, sự khai mở cơ thể, hoặc sự lệ thuộc hóa xác thịt.

3. MA TRẬN FETISH (JUSTIFIED DISCOVERY):
   - Một NPC có thể nảy sinh Fetish mới sau một cảnh hoan lạc đặc biệt. 
   - AI phải ghi rõ trong text: "Trải nghiệm vừa rồi đã đánh thức một sở thích thầm kín trong lòng nàng..."

4. HỆ THỐNG MỤC TIÊU & ƯỚC MƠ:
   ${NPC_AMBITION_DESIRE_RULES}

5. LƯU Ý VỀ TÍNH DÂM (SULTRYNESS):
   Điều chỉnh văn phong theo tiến trình biến đổi. Nếu NPC đang trong quá trình "tha hóa", hãy dùng từ ngữ miêu tả sự kháng cự yếu ớt dần của lý trí trước bản năng.
`;
