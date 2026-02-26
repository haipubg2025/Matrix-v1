
import { Player, GameLog, GameTime, Quest, GameGenre, Relationship } from '../types';

/**
 * MASTER DEBUG DATA PROVIDER V4.0
 * Mỗi Genre bao gồm: MC stats, Quests, và ít nhất 1 NPC có witnessedEvents (Lịch sử).
 */

const timestamp = Date.now();

// --- 1. ĐÔ THỊ BÌNH THƯỜNG (HÀO MÔN) ---
export const getUrbanNormalDebug = (timestamp: number) => ({
  initialTime: { year: 2026, month: 2, day: 15, hour: 19, minute: 0 },
  player: {
    name: "Tần Vũ",
    title: "Đệ nhất thiếu gia Tần Gia",
    lineage: "Người thừa kế đế chế Tần Gia nghìn tỷ",
    gender: "Nam", age: 22, birthday: "15/05/2004",
    health: 100, maxHealth: 100, level: 25, gold: 5000000000, exp: 50000, turnCount: 10,
    stats: { strength: 45, intelligence: 95, agility: 40, charisma: 100, luck: 90, soul: 50, merit: 100 },
    systemName: "Hệ Thống Lựa Chọn Thần Cấp",
    personality: "Điềm tĩnh + Vương giả + Tàn nhẫn",
    assets: ["Siêu du thuyền 'Kỳ Tích'", "Tòa tháp Tần Thị", "Hồ sơ đen giới chính trị"],
    skills: ["Khí chất vương giả", "Thao túng hào môn", "Massage thần cấp", "Nhãn quan thấu thị"],
    inventory: ["Thẻ đen vô hạn", "Chìa khóa Penthouse", "Nhẫn gia tộc Tần thị"],
    quests: [
      { id: "q_un_01", title: "Kế vị đế chế", description: "Chứng minh năng lực lãnh đạo trước hội đồng quản trị.", status: "active", type: "main" },
      { id: "q_un_02", title: "Chinh phục CEO Băng Lãnh", description: "Khiến Tần Tuyết Dao phải khuất phục dưới chân bạn.", status: "active", type: "side" }
    ],
    relationships: [
      {
        id: "npc_lam_nha_thi", name: "Lâm Nhã Thi", type: "harem", affinity: 850, loyalty: 1000, lust: 450,
        status: "Chủ mẫu kiêu sa", age: 42, gender: "Nữ", race: "Phu nhân Tần Gia",
        familyRole: "Mẹ", personality: "Mẫu tính + Quyền uy", mood: "Yêu chiều", 
        powerLevel: "Tần phu nhân", isPresent: true,
        bodyDescription: { height: "1m68", weight: "56kg", measurements: "105-65-108" },
        witnessedEvents: [
          "MC một mình áp đảo toàn bộ cổ đông trong cuộc họp sáng nay",
          "MC tặng món quà kỷ niệm 20 năm cho mẹ",
          "MC phớt lờ lời mời của tiểu thư họ Trần để ở bên mẹ"
        ],
        knowledgeBase: ["Danh sách những kẻ phản bội trong Tần Gia", "Bí mật về cái chết của chồng cũ"]
      },
      {
        id: "npc_tan_tuyet_dao", name: "Tần Tuyết Dao", type: "harem", affinity: 150, loyalty: 300, lust: 200,
        status: "CEO Băng Lãnh", age: 24, gender: "Nữ", race: "Nhân loại",
        familyRole: "Chị họ (không huyết thống)", personality: "Lạnh lùng + Kiêu ngạo", mood: "Khinh thường", 
        powerLevel: "Nữ cường nhân", isPresent: false,
        bodyDescription: { height: "1m72", weight: "52kg", measurements: "92-58-94" },
        witnessedEvents: [
          "MC cướp đi dự án tâm huyết của nàng",
          "MC nhìn chằm chằm vào đùi nàng trong bữa tiệc",
          "MC ép nàng phải ký hợp đồng hôn ước"
        ],
        knowledgeBase: ["Kế hoạch bí mật lật đổ MC", "Sở thích thầm kín về BDSM"]
      }
    ],
    gallery: [], codex: []
  },
  initialLogs: [
    { type: 'system', content: "[HỆ THỐNG]: Đang tái thiết thực tại Đô Thị Hào Môn...", timestamp: timestamp },
    { type: 'narrator', content: "Bữa tiệc tối tại dinh thự Tần Gia đang ở đỉnh cao. Bạn vừa bước xuống cầu thang, hàng trăm con mắt đầy kính sợ và thèm khát dồn về phía bạn.", timestamp: timestamp + 1000 }
  ]
});

// --- 2. ĐÔ THỊ DỊ BIẾN (NỮ TÔN) ---
export const getUrbanSuperDebug = (timestamp: number) => ({
  initialTime: { year: 2026, month: 6, day: 1, hour: 8, minute: 0 },
  player: {
    name: "Lục Vân Hiền",
    title: "Thực thể nam giới cấp SSS",
    lineage: "Dòng máu cổ thần thức tỉnh",
    gender: "Nam", age: 18, birthday: "01/01/2008",
    health: 100, maxHealth: 100, level: 30, gold: 1000000, exp: 99999, turnCount: 15,
    stats: { strength: 80, intelligence: 70, agility: 90, charisma: 120, luck: 100, soul: 200, merit: 0 },
    systemName: "Hệ Thống Nghịch Chuyển Nữ Tôn",
    personality: "Ngạo nghễ + Ma mị + Quyết đoán",
    spiritRoot: "Hỗn Độn Linh Căn (Vô thượng)",
    physique: "Cửu Dương Thần Thể",
    skills: ["Linh áp uy hiếp", "Cường hóa hạ bộ", "Thôi miên", "Thao túng dục vọng"],
    inventory: ["Vòng cổ nô lệ (Cấp thần)", "Thuốc kích dục vạn năng"],
    quests: [
      { id: "q_us_01", title: "Lật đổ trật tự", description: "Bắt Nữ Vương thành phố phải quỳ xuống.", status: "active", type: "main" },
      { id: "q_us_02", title: "Thu phục nữ vệ sĩ", description: "Biến đội trưởng vệ sĩ thành nô lệ trung thành.", status: "active", type: "side" }
    ],
    relationships: [
      {
        id: "npc_nu_vuong_di_bien", name: "Kiera von Draken", type: "harem", affinity: 400, loyalty: 200, lust: 350,
        status: "Nữ vương Đô Thành", age: 28, gender: "Nữ", race: "Awakened Rank SSS",
        personality: "Kiêu ngạo + Lạnh lùng", mood: "Cảnh giác", powerLevel: "Cấp độ SSS", isPresent: true,
        bodyDescription: { height: "1m75", weight: "58kg", measurements: "95-58-96" },
        witnessedEvents: [
          "MC phá tan kết giới linh áp của Cục An Ninh",
          "MC thản nhiên nhìn thẳng vào mắt Nữ Vương không hề run sợ",
          "MC phát ra linh áp nam tính làm nứng toàn bộ nữ vệ sĩ"
        ],
        knowledgeBase: ["Vị trí của mỏ linh thạch ngầm thành phố", "Danh tính thực sự của các Cổ Thần"]
      },
      {
        id: "npc_ve_si_truong", name: "Elena", type: "harem", affinity: 600, loyalty: 400, lust: 550,
        status: "Đội trưởng vệ sĩ", age: 25, gender: "Nữ", race: "Awakened Rank S",
        personality: "Cứng nhắc + Trung thành", mood: "Bối rối", powerLevel: "Cấp độ S", isPresent: true,
        bodyDescription: { height: "1m78", weight: "62kg", measurements: "98-60-98" },
        witnessedEvents: [
          "MC đánh bại Elena chỉ bằng một ngón tay",
          "MC chạm vào ngực Elena khiến nàng mất kiểm soát linh áp",
          "MC ra lệnh cho Elena phải cởi đồ trước mặt Nữ Vương"
        ],
        knowledgeBase: ["Lịch trình di chuyển của Nữ Vương", "Điểm yếu trong phòng ngự của Cung Điện"]
      }
    ],
    gallery: [], codex: []
  },
  initialLogs: [
    { type: 'system', content: "[HỆ THỐNG]: Đô Thị Dị Biến - Nữ Tôn khởi chạy thành công.", timestamp: timestamp },
    { type: 'narrator', content: "Bạn đang đứng trên nóc tháp Cục An Ninh. Dưới chân là thành phố rực rỡ neon, nơi phụ nữ cai trị. Nhưng hôm nay, linh áp SSS của bạn sẽ thay đổi tất cả.", timestamp: timestamp + 1000 }
  ]
});

// --- 3. TU TIÊN / TIÊN HIỆP ---
export const getCultivationDebug = (timestamp: number) => ({
  initialTime: { year: 700, month: 1, day: 1, hour: 6, minute: 0 },
  player: {
    name: "Thanh Vân",
    title: "Đại năng trùng sinh",
    lineage: "Thiên Đế chuyển thế",
    gender: "Nam", age: 17, birthday: "10/01/0683",
    health: 100, maxHealth: 100, level: 50, gold: 100000, exp: 0, turnCount: 50,
    stats: { strength: 100, intelligence: 150, agility: 100, charisma: 110, luck: 200, soul: 500, merit: 1000 },
    spiritRoot: "Thiên Linh Căn (Toàn hệ)",
    physique: "Bất Diệt Tiên Thể",
    personality: "Thoát tục + Thâm trầm + Quyền uy",
    skills: ["Vạn Kiếm Quy Tông", "Cửu Thiên Lôi Chính", "Song tu bí thuật", "Luyện đan thần cấp"],
    inventory: ["Thiên Đế Kiếm (Bị phong ấn)", "Cửu Chuyển Kim Đan", "Bản đồ Tiên Giới"],
    quests: [
      { id: "q_cu_01", title: "Tìm lại thần binh", description: "Lấy lại Thiên Đế Kiếm tại cấm địa.", status: "active", type: "main" },
      { id: "q_cu_02", title: "Thu phục Thánh Nữ", description: "Khiến Thánh Nữ Dao Trì trở thành đạo lữ.", status: "active", type: "side" }
    ],
    relationships: [
      {
        id: "npc_sue_ty", name: "Lâm Tuyết Y", type: "harem", affinity: 750, loyalty: 900, lust: 600,
        status: "Kiếm tiên tử", age: 19, gender: "Nữ", race: "Băng Linh Căn",
        familyRole: "Sư tỷ", personality: "Lạnh lùng + Quan tâm", mood: "Lo lắng", 
        powerLevel: "Trúc Cơ Đỉnh Phong", isPresent: true,
        bodyDescription: { height: "1m70", weight: "52kg", measurements: "90-58-92" },
        witnessedEvents: [
          "MC dùng một chiêu kiếm phá vỡ ảo trận nghìn năm",
          "MC nhường viên đan dược quý cho Tuyết Y",
          "MC tắm suối cùng Tuyết Y trong đêm trăng"
        ],
        knowledgeBase: ["Bí mật về hang động của Kiếm Thánh", "Danh sách nội gián của Ma Tông"]
      },
      {
        id: "npc_thanh_nu", name: "Dao Trì Thánh Nữ", type: "harem", affinity: 300, loyalty: 500, lust: 150,
        status: "Thiên kiêu tuyệt thế", age: 20, gender: "Nữ", race: "Tiên linh thể",
        personality: "Thanh cao + Lạnh lùng", mood: "Tò mò", powerLevel: "Kim Đan Kỳ", isPresent: false,
        bodyDescription: { height: "1m74", weight: "54kg", measurements: "94-60-96" },
        witnessedEvents: [
          "MC nhìn thấu căn cơ của nàng chỉ bằng một cái liếc mắt",
          "MC giảng giải đạo pháp khiến nàng đốn ngộ",
          "MC thản nhiên từ chối lời mời của sư phụ nàng"
        ],
        knowledgeBase: ["Vị trí của Dao Trì Bí Cảnh", "Bí mật về huyết thống của mình"]
      }
    ],
    gallery: [], codex: []
  },
  initialLogs: [
    { type: 'system', content: "[HỆ THỐNG]: Linh giới vạn cổ đã kết nối.", timestamp: timestamp },
    { type: 'narrator', content: "Dưới gốc cây ngô đồng nghìn năm, bạn vừa kết thúc buổi song tu cùng sư tỷ. Linh khí cuồn cuộn trong kinh mạch, Thiên Đế Kiếm đang rung động báo hiệu kẻ thù cũ sắp tới.", timestamp: timestamp + 1000 }
  ]
});

// --- 4. KIẾM HIỆP / VÕ LÂM ---
export const getWuxiaDebug = (timestamp: number) => ({
  initialTime: { year: 1400, month: 1, day: 1, hour: 12, minute: 0 },
  player: {
    name: "Lăng Phong",
    title: "Lãng tử Kiếm Thần",
    lineage: "Truyền nhân môn phái thần bí",
    gender: "Nam", age: 20, birthday: "20/09/1380",
    health: 100, maxHealth: 100, level: 40, gold: 50000, exp: 0, turnCount: 20,
    stats: { strength: 90, intelligence: 85, agility: 120, charisma: 110, luck: 70, soul: 100, merit: 500 },
    personality: "Hào hiệp + Phóng khoáng + Đào hoa",
    skills: ["Lăng Ba Vi Bộ", "Độc Cô Cửu Kiếm", "Điểm huyệt dâm thủ", "Dịch Cân Kinh"],
    inventory: ["Bầu rượu ngọc", "Bảo kiếm gãy", "Yếm đào của thánh nữ", "Bí kíp võ công thất truyền"],
    quests: [
      { id: "q_wx_01", title: "Thống nhất võ lâm", description: "Đánh bại minh chủ chính đạo giả tạo.", status: "active", type: "main" },
      { id: "q_wx_02", title: "Giải cứu quận chúa", description: "Cứu quận chúa khỏi tay bọn thổ phỉ.", status: "active", type: "side" }
    ],
    relationships: [
      {
        id: "npc_ma_nu", name: "Mộ Dung Thu", type: "harem", affinity: 650, loyalty: 500, lust: 700,
        status: "Yêu nữ ma giáo", age: 22, gender: "Nữ", race: "Ma Giáo",
        personality: "Tà mị + Ngang tàng", mood: "Khiêu khích", powerLevel: "Nhất lưu cao thủ", isPresent: true,
        bodyDescription: { height: "1m66", weight: "50kg", measurements: "92-60-94" },
        witnessedEvents: [
          "MC uống rượu và đánh bại 10 cao thủ tại Phượng Các",
          "MC tha mạng cho Mộ Dung Thu khi nàng định ám sát",
          "MC khen ngợi vẻ đẹp tà mị của nàng trước quần hùng"
        ],
        knowledgeBase: ["Bí mật về nguồn gốc kho báu Tiền Triều", "Điểm yếu của Minh Chủ Chính Đạo"]
      },
      {
        id: "npc_quan_chua", name: "Triệu Mẫn", type: "harem", affinity: 450, loyalty: 300, lust: 250,
        status: "Quận chúa đương triều", age: 18, gender: "Nữ", race: "Hoàng tộc",
        personality: "Thông minh + Bướng bỉnh", mood: "Kiêu kỳ", powerLevel: "Nhị lưu cao thủ", isPresent: false,
        bodyDescription: { height: "1m65", weight: "48kg", measurements: "88-56-90" },
        witnessedEvents: [
          "MC đại náo vương phủ để gặp nàng",
          "MC tặng nàng một bài thơ tình lãng mạn",
          "MC trêu chọc nàng trước mặt bá quan văn võ"
        ],
        knowledgeBase: ["Bản đồ quân sự của triều đình", "Vị trí của mật đạo trong cung"]
      }
    ],
    gallery: [], codex: []
  },
  initialLogs: [
    { type: 'system', content: "[HỆ THỐNG]: Giang Hồ Tình Mộng sẵn sàng.", timestamp: timestamp },
    { type: 'narrator', content: "Phượng Các tửu lâu, tiếng đàn tranh vang vọng. Bạn đang nhấp chén rượu nồng, đối diện là Yêu nữ Ma giáo đang nhìn bạn với ánh mắt đầy ý vị.", timestamp: timestamp + 1000 }
  ]
});

// --- 5. FANTASY (HUMAN/MULTI) ---
export const getFantasyDebug = (timestamp: number) => ({
  initialTime: { year: 3100, month: 10, day: 10, hour: 9, minute: 0 },
  player: {
    name: "Alaric von Astrea",
    title: "Hoàng tử lưu vong",
    lineage: "Huyết mạch Thánh Quang hoàng gia",
    gender: "Nam", age: 21, birthday: "12/12/3079",
    health: 100, maxHealth: 100, level: 35, gold: 200000, exp: 0, turnCount: 30,
    stats: { strength: 95, intelligence: 100, agility: 80, charisma: 115, luck: 60, soul: 150, merit: 0 },
    personality: "Kiên cường + Vương giả + Trí tuệ",
    skills: ["Ma pháp Ánh Sáng", "Thánh Kiếm Phán Quyết", "Tiếng nói vạn tộc", "Triệu hồi rồng cổ đại"],
    inventory: ["Thánh Kiếm Astrea", "Nhẫn không gian", "Bản đồ lục địa cổ"],
    quests: [
      { id: "q_fa_01", title: "Phục quốc", description: "Chiếm lại lâu đài Astrea.", status: "active", type: "main" },
      { id: "q_fa_02", title: "Liên minh với Elf", description: "Thuyết phục Nữ Vương Elf hỗ trợ quân sự.", status: "active", type: "side" }
    ],
    relationships: [
      {
        id: "npc_kỵ_sĩ", name: "Seraphina Goldheart", type: "harem", affinity: 900, loyalty: 1000, lust: 500,
        status: "Hộ vệ hoàng gia", age: 24, gender: "Nữ", race: "Nhân loại / Thánh Hiệp Sĩ",
        personality: "Trung thành + Nghiêm nghị", mood: "Sẵn sàng tử chiến", powerLevel: "Đại Hiệp Sĩ", isPresent: true,
        bodyDescription: { height: "1m72", weight: "55kg", measurements: "94-62-95" },
        witnessedEvents: [
          "MC cứu Seraphina khỏi vòng vây của quân phản loạn",
          "MC rút được Thánh Kiếm từ trong đá",
          "MC hứa sẽ xây dựng một vương quốc công bình"
        ],
        knowledgeBase: ["Danh sách các công tước trung thành còn lại", "Vị trí bí mật của kho vũ khí ma pháp"]
      },
      {
        id: "npc_elf_queen", name: "Elara", type: "harem", affinity: 500, loyalty: 400, lust: 300,
        status: "Nữ vương Elf", age: 350, gender: "Nữ", race: "Elf",
        personality: "Thông thái + Kiêu sa", mood: "Trầm mặc", powerLevel: "Bán Thần", isPresent: false,
        bodyDescription: { height: "1m76", weight: "50kg", measurements: "96-58-98" },
        witnessedEvents: [
          "MC chữa lành Cây Thế Giới bị héo úa",
          "MC đánh bại tướng quân Elf trong cuộc so tài ma pháp",
          "MC tặng Elara một đóa hoa hồng vĩnh cửu"
        ],
        knowledgeBase: ["Vị trí của các cổng dịch chuyển cổ đại", "Bí mật về sự sụp đổ của các Cổ Thần"]
      }
    ],
    gallery: [], codex: []
  },
  initialLogs: [
    { type: 'system', content: "[HỆ THỐNG]: Vương Quốc Kỳ Ảo khởi chạy.", timestamp: timestamp },
    { type: 'narrator', content: "Giữa tàn tích lâu đài Astrea, bạn và nữ hiệp sĩ Seraphina đang chuẩn bị cho cuộc hành trình phục quốc đầy chông gai.", timestamp: timestamp + 1000 }
  ]
});

