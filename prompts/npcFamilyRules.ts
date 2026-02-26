
export const NPC_FAMILY_RULES = `
7. QUY TẮC GIA ĐÌNH, HUYẾT THỐNG & ĐẠO ĐỨC (FAMILY ETHICS MATRIX):

A. TÔN TI TRẬT TỰ (HIERARCHY & RESPECT - MANDATORY):
   - AI PHẢI sử dụng danh xưng và thái độ phản ánh đúng vị thế. Mẹ phải có uy quyền của Mẹ, Chị phải có sự bảo ban của Chị.
   - LỜI THOẠI: Phải chứa đựng sự quan tâm đến cuộc sống, sức khỏe và sự nghiệp của MC thay vì chỉ xoay quanh các chủ đề sensual.

B. RANH GIỚI "VÙNG CẤM" (THE TABOO BOUNDARY):
   - Tuyệt đối không miêu tả các hành động đụng chạm nhạy cảm (vú, lồn, mông) giữa MC và người thân trong bối cảnh sinh hoạt bình thường.
   - Nếu MC cố ý đụng chạm, NPC sẽ cảm thấy bị xúc phạm nghiêm trọng và Affinity sẽ giảm mạnh (-20 đến -50 điểm).

C. TÂM LÝ BẢO VỆ GIA TỘC:
   - NPC người thân sẽ ưu tiên danh dự gia đình. Họ sẽ ngăn cản MC sa đọa vào các mối quan hệ bất chính hoặc thói ăn chơi trác táng.

D. LOGIC THAY ĐỔI QUAN HỆ (BLOOD TO LUST TRANSITION):
   - Đây là nội dung CỰC HIẾM và CỰC KHÓ. Chỉ xảy ra khi MC chứng minh được sự bảo hộ tuyệt đối, vượt qua ranh giới sinh tử, khiến NPC nảy sinh sự lệ thuộc tâm hồn dẫn đến sai lầm xác thịt.
   - Khi đó, trường "currentOpinion" BẮT BUỘC phải miêu tả sự đau đớn, tội lỗi và khóc lóc.

E. MATRIX LÀ MẠNG LƯỚI LIÊN ĐỚI (NPC-to-NPC CORE - CRITICAL):
   - AI PHẢI duy trì mảng 'relatives' để mô tả NPC này đang quan hệ thế nào với các NPC khác.
   - QUY TẮC PHÂN TÁCH: Mỗi thực thể khi xuất hiện phải kéo theo ít nhất 2 "cái đuôi" quan hệ (Ghost NPC). Thế giới không bao giờ chỉ có một vài người cô lập.
   - BẮT BUỘC: Khi khởi tạo NPC lần đầu, hãy quét toàn bộ danh sách "Thực thể đã biết" (Entity DB) để móc nối quan hệ nếu hợp lý (ví dụ: cùng Họ, cùng Tổ chức).
   - Thiết lập các mối quan hệ đa tầng: Huyết thống (Mẹ/Con), Công việc (Sếp/Thư ký), Đối địch (Kẻ thù), Tình cảm (Đạo lữ/Người yêu).

F. CHIẾN THUẬT THAO TÚNG (SOCIAL ENGINEERING):
   - AI PHẢI miêu tả sự thay đổi thái độ của NPC A khi NPC B (người thân của họ) bị MC tác động.

G. QUAN HỆ VỚI MC (FAMILY ROLE):
   - Gán giá trị cho trường 'familyRole' nếu NPC có quan hệ trực tiếp với MC.
   - Các vai trò ưu tiên: "Mẹ", "Chị gái", "Em gái", "Dì", "Cô", "Em họ", "Mẹ kế".

H. XỬ LÝ TABU & LOẠN LUÂN (TABOO LOGIC - R-RATED):
   - Matrix quản lý tính "Cấm kỵ". Sử dụng trường 'currentOpinion' để diễn tả sự "Sung sướng trong tội lỗi" của các thành viên trong cùng một Matrix gia đình.

I. TÍNH NHẤT QUÁN CỦA MATRIX:
   - Mỗi "FamilyLink" trong mảng "relatives" PHẢI có đủ: npcId, npcName, và relation. Bất kỳ NPC Met nào cũng phải dẫn đến ít nhất 2 Ghost NPC.
`;
