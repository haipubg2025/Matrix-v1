
export enum GameGenre {
  URBAN_NORMAL = 'Đô Thị Bình Bình Thường',
  URBAN_SUPERNATURAL = 'Đô Thị Dị Biến',
  FANTASY_HUMAN = 'Fantasy Nhân Loại',
  FANTASY_MULTIRACE = 'Fantasy Đa Chủng Tộc',
  CULTIVATION = 'Tu Tiên / Tiên Hiệp',
  WUXIA = 'Kiếm Hiệp / Võ Lâm'
}

export enum AiModel {
  FLASH = 'gemini-3-flash-preview',
  PRO = 'gemini-3-pro-preview'
}

export interface AppSettings {
  aiModel: AiModel;
  thinkingBudget: number;
  contextWindowSize: number;
  isFullscreen: boolean;
  primaryColor: string;
  adultContent: boolean;
  userApiKeys?: string[];
}

export type NpcType = 'harem' | 'social';

export interface GameTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'failed';
  reward?: string;
  group: 'main' | 'side'; 
  kind: 'single' | 'chain'; 
  currentStep?: number; 
  totalSteps?: number;   
}

export interface BodyDescription {
  height?: string;
  weight?: string;
  measurements?: string; 
  hair?: string;        
  face?: string;        
  torso?: string;       
  limbs?: string;       
  genitals?: string;    
  neck?: string;        
  breasts?: string;     
  nipples?: string;     
  areola?: string;      
  cleavage?: string;    
  waist?: string;       
  abdomen?: string;     
  navel?: string;       
  back?: string;        
  pubicHair?: string;   
  monsPubis?: string;   
  labia?: string;       
  clitoris?: string;    
  hymen?: string;       
  anus?: string;        
  buttocks?: string;    
  thighs?: string;      
  legs?: string;        
  feet?: string;        
  hands?: string;       
  internal?: string;    
  fluids?: string;      
  eyes?: string;        
  ears?: string;        
  shoulders?: string;   
  hips?: string;        
  skin?: string;        
  scent?: string;       
  mouth?: string;       
  lips?: string;        
}

export interface NpcCondition {
  name: string;
  type: 'temporary' | 'permanent';
  description: string;
}

export interface SuggestedAction {
  action: string;
  time: number; 
}

export interface FamilyLink {
  npcId: string;
  npcName: string;
  relation: string; 
}

export interface Relationship {
  id: string; 
  name: string;
  type: NpcType;
  affinity?: number; // Optional for crowd NPCs
  affinityChangeReason?: string; 
  status: string;
  avatar?: string;
  mood?: string;
  impression?: string;
  currentOpinion?: string; 
  witnessedEvents?: string[]; 
  knowledgeBase?: string[];    
  secrets?: string[];
  lastLocation?: string;
  age?: number;         
  birthday?: string;    
  gender?: string;
  race?: string;
  alignment?: string;
  powerLevel?: string;
  faction?: string;
  personality?: string; 
  likes?: string[];
  dislikes?: string[];
  background?: string;
  lust?: number; // 0-1000 scale, optional for crowd NPCs
  physicalLust?: string; // Detailed description
  soulAmbition?: string;
  shortTermGoal?: string;
  longTermDream?: string;
  fetish?: string;
  libido?: string; 
  loyalty?: number; // 0-1000 scale, optional for crowd NPCs
  isPresent?: boolean;
  isSensitive?: boolean; 
  bodyDescription?: BodyDescription;
  conditions?: NpcCondition[]; 
  familyRole?: string; 
  relatives?: FamilyLink[]; 
  lineage?: string;
  currentOutfit?: string;
  fashionStyle?: string;
  lastChanges?: Record<string, { old: any, new: any }>;
}

export interface GenreStatDef {
  key: keyof Player['stats'];
  label: string;
  icon: string;
  color: string;
  bg: string;
}

export interface InventoryItem {
  name: string;
  description: string;
}

export interface Skill {
  name: string;
  description: string;
}

export interface Asset {
  name: string;
  description: string;
}

export interface GalleryImage {
  url: string;
  tags: string[];
  genre?: GameGenre | 'All';
}

export interface Player {
  name: string;
  title?: string;
  lineage?: string;    
  avatar?: string;
  gender?: string;
  age?: number;
  birthday?: string;
  health: number;
  maxHealth: number;
  level: number;
  gold: number;
  exp: number;
  turnCount: number;
  stats: {
    strength: number;
    intelligence: number;
    agility: number;
    charisma: number;
    luck: number;
    soul?: number;   
    merit?: number;  
  };
  spiritRoot?: string; 
  physique?: string;   
  systemName?: string; 
  personality?: string;
  currentLocation?: string;
  assets?: Asset[]; 
  skills?: Skill[];
  inventory?: InventoryItem[];
  relationships: Relationship[];
  codex: CodexEntry[];
  quests: Quest[];
  gallery: GalleryImage[];
}

export interface CodexEntry {
  category: 'world' | 'rules' | 'entities' | 'history';
  title: string;
  content: string;
  unlocked: boolean;
}

export interface GameLog {
  type: 'system' | 'player' | 'narrator' | 'error';
  content: string;
  timestamp: number;
  suggestedActions?: SuggestedAction[];
  metadata?: {
    duration?: string;
    usedKeyIndex?: number;
    newNpcCount?: number;
  };
}

export interface InitialChoice {
  id: string;
  label: string;
  description: string;
  effect: string;
}

export interface SubScenario {
  id: string;
  title: string;
  description: string;
  scenarios: string[];
}

export interface GameArchetype {
  id: string;
  title: string;
  genre: GameGenre;
  description: string;
  features: string[];
  subScenarios: SubScenario[];
  systemInstruction: string;
  defaultMcNames: string[];
}

export interface GameUpdate {
  text: string;
  evolutionJustification?: string;
  statsUpdates?: Partial<Player>;
  newRelationships?: Relationship[];
  newCodexEntry?: CodexEntry;
  questUpdates?: Quest[];
  suggestedActions?: SuggestedAction[];
  currentLocation?: string;
  timeSkip?: number; 
  usedKeyIndex?: number;
}

export const getAffinityLabel = (value?: number) => {
  if (value === undefined || value === null) return { label: '??', color: 'text-neutral-600' };
  if (value <= 100) return { label: 'Tử ĐỊch', color: 'text-red-700 font-black' };
  if (value <= 250) return { label: 'Thù Ghét', color: 'text-red-500' };
  if (value <= 400) return { label: 'Lạnh Nhạt', color: 'text-neutral-500' };
  if (value <= 550) return { label: 'Xã Giao', color: 'text-neutral-300' };
  if (value <= 700) return { label: 'Thân Thiết', color: 'text-emerald-400' };
  if (value <= 850) return { label: 'Ái Mộ', color: 'text-pink-400' };
  if (value <= 950) return { label: 'Si Mê', color: 'text-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]' };
  return { label: 'Tuyệt Đối Lệ Thuộc', color: 'text-rose-600 animate-pulse font-black' };
};

export const getLoyaltyLabel = (value?: number) => {
  if (value === undefined || value === null) return { label: '??', color: 'text-neutral-600' };
  if (value <= 150) return { label: 'Phản Trắc', color: 'text-red-700 font-black' };
  if (value <= 350) return { label: 'Bất Phục', color: 'text-orange-600' };
  if (value <= 550) return { label: 'Tạm Thời', color: 'text-neutral-400' };
  if (value <= 750) return { label: 'Tin Cậy', color: 'text-cyan-400' };
  if (value <= 900) return { label: 'Tận Hiến', color: 'text-indigo-400' };
  if (value <= 980) return { label: 'Tuyệt Đối', color: 'text-amber-400 shadow-[0_0_8px_currentColor]' };
  return { label: 'Tử Sĩ / Nô Lệ Linh Hồn', color: 'text-amber-500 animate-pulse font-black' };
};

export const getLustLabel = (value?: number) => {
  if (value === undefined || value === null) return { label: '??', color: 'text-neutral-600' };
  if (value <= 100) return { label: 'Lãnh Cảm', color: 'text-neutral-600' };
  if (value <= 300) return { label: 'Bình Thường', color: 'text-neutral-400' };
  if (value <= 500) return { label: 'Rạo Rực', color: 'text-orange-400' };
  if (value <= 700) return { label: 'Khao Khát', color: 'text-pink-500' };
  if (value <= 850) return { label: 'Đê Mê', color: 'text-rose-500' };
  if (value <= 950) return { label: 'Phát Cuồng', color: 'text-rose-600 animate-bounce' };
  return { label: 'Dâm Tính Triệt Để', color: 'text-fuchsia-600 animate-pulse font-black' };
};

export const getGenreMeta = (genre?: GameGenre) => {
  switch (genre) {
    case GameGenre.CULTIVATION:
      return {
        currency: "Linh Thạch",
        skillLabel: "CÔNG PHÁP & THẦN THÔNG",
        ranks: ["Phàm Nhân", "Luyện Khí", "Trúc Cơ", "Kim Đan", "Nguyên Anh", "Hóa Thần", "Luyện Hư", "Hợp Thể", "Đại Thừa", "Độ Kiếp", "Chân Tiên", "Tiên Vương", "Tiên Đế", "Đại Đế"],
        statsDef: [
          { key: 'strength', label: 'Căn Cốt', icon: '🏔️', color: 'text-red-500', bg: 'bg-red-500/5' },
          { key: 'intelligence', label: 'Ngộ Tính', icon: '🧠', color: 'text-blue-400', bg: 'bg-blue-400/5' },
          { key: 'soul', label: 'Thần Thức', icon: '🔮', color: 'text-purple-400', bg: 'bg-purple-500/5' },
          { key: 'agility', label: 'Thân Pháp', icon: '⚡', color: 'text-emerald-400', bg: 'bg-emerald-500/5' },
          { key: 'luck', label: 'Khí Vận', icon: '🍀', color: 'text-yellow-500', bg: 'bg-yellow-500/5' },
        ] as GenreStatDef[],
        npcLabels: {
          power: "Cảnh Giới", faction: "Tông Môn / Gia Tộc", race: "Linh Căn / Chủng Tộc", alignment: "Đạo Tâm / Lập Trường",
          desire: "Đạo Quả / Tâm Nguyện", background: "Tiền Kiếp / Tu Hành", stat1Icon: "🏔️", stat2Icon: "⚡", stat3Icon: "🧬"
        }
      };
    case GameGenre.WUXIA:
      return {
        currency: "Lạng Bạc",
        skillLabel: "TÂM PHÁP & VÕ HỌC",
        ranks: ["Bất Nhập Lưu", "Tam Lưu", "Nhị Lưu", "Nhất Lưu", "Đỉnh Phong", "Tuyệt Thế", "Tông Sư", "Đại Tông Sư", "Thiên Hạ Đệ Nhất"],
        statsDef: [
          { key: 'strength', label: 'Ngoại Công', icon: '⚔️', color: 'text-red-500', bg: 'bg-red-500/5' },
          { key: 'intelligence', label: 'Nội Công', icon: '☯️', color: 'text-blue-400', bg: 'bg-blue-400/5' },
          { key: 'agility', label: 'Khinh Công', icon: '⚡', color: 'text-emerald-400', bg: 'bg-emerald-500/5' },
          { key: 'charisma', label: 'Danh Vọng', icon: '✨', color: 'text-pink-400', bg: 'bg-pink-500/5' },
          { key: 'luck', label: 'Cơ Duyên', icon: '🍀', color: 'text-yellow-500', bg: 'bg-yellow-500/5' },
        ] as GenreStatDef[],
        npcLabels: {
          power: "Võ Công / Nội Lực", faction: "Môn Phái / Bang Hội", race: "Gia Thế", alignment: "Chính / Tà / Quái",
          desire: "Cừu Hận / Ước Nguyện", background: "Giang Hồ Ký Sự", stat1Icon: "⚔️", stat2Icon: "🥋", stat3Icon: "🏮"
        }
      };
    case GameGenre.URBAN_NORMAL:
      return {
        currency: "USD",
        skillLabel: "KỸ NĂNG & NĂNG LỰC",
        ranks: ["Vô Danh", "Tân Binh", "Chuyên Gia", "Thành Đạt", "Hào Môn", "Cấp Cao", "Trùm Cuối", "Huyền Thoại Đô Thị"],
        statsDef: [
          { key: 'strength', label: 'Thể Lực', icon: '🏃', color: 'text-red-500', bg: 'bg-red-500/5' },
          { key: 'intelligence', label: 'Trí Tuệ', icon: '🧠', color: 'text-blue-400', bg: 'bg-blue-400/5' },
          { key: 'charisma', label: 'Quyến Rũ', icon: '✨', color: 'text-pink-400', bg: 'bg-pink-500/5' },
        ] as GenreStatDef[],
        npcLabels: {
          power: "Địa Vị / Quyền LỰC", faction: "Tập Đoàn / Thế Lực", race: "Nghề Nghiệp / Thân Phận", alignment: "Lối Sống / Tư Tưởng",
          desire: "Tham Vọng / Mục Tiêu", background: "Hồ sơ Cá nhân", stat1Icon: "🏢", stat2Icon: "💵", stat3Icon: "📱"
        }
      };
    case GameGenre.URBAN_SUPERNATURAL:
      return {
        currency: "Linh Thạch Đô Thị",
        skillLabel: "DỊ N NĂNG & THỨC TỈNH",
        ranks: ["Hạng F", "Hạng E", "Hạng D", "Hạng C", "Hạng B", "Hạng A", "Hạng S", "Hạng SS", "Hạng SSS", "Bán Thần", "Chân Thần"],
        statsDef: [
          { key: 'strength', label: 'Lực Thức Tỉnh', icon: '⚡', color: 'text-red-500', bg: 'bg-red-500/5' },
          { key: 'intelligence', label: 'Tinh Thần Lực', icon: '🧿', color: 'text-blue-400', bg: 'bg-blue-400/5' },
          { key: 'agility', label: 'Tốc Độ TK', icon: '🏎️', color: 'text-emerald-400', bg: 'bg-emerald-500/5' },
          { key: 'charisma', label: 'Mị Lực DN', icon: '✨', color: 'text-pink-400', bg: 'bg-pink-500/5' },
        ] as GenreStatDef[],
        npcLabels: {
          power: "Cảnh Giới", faction: "Hội Kín / Tập Đoàn Thần Linh", race: "Chủng Tộc / Dị Năng", alignment: "Quy Luật Bản Thể",
          desire: "Chấp Niệm / Thần Vị", background: "Lịch Sử Thức Tỉnh", stat1Icon: "⚡", stat2Icon: "🧿", stat3Icon: "🧬"
        }
      };
    case GameGenre.FANTASY_HUMAN:
    case GameGenre.FANTASY_MULTIRACE:
      return {
        currency: "Vàng",
        skillLabel: "MA PHÁP & CHIẾN KỸ",
        ranks: ["Dân Thường", "Tập Sự", "Chiến Binh", "Kỵ sĩ", "Đại Hiệp Sĩ", "Lãnh Chúa", "Đại Công Tước", "Anh Hùng", "Bá Chủ", "Bất Tử"],
        statsDef: [
          { key: 'strength', label: 'Sức Mạnh', icon: '🛡️', color: 'text-red-500', bg: 'bg-red-500/5' },
          { key: 'intelligence', label: 'Ma Pháp', icon: '🔮', color: 'text-blue-400', bg: 'bg-blue-400/5' },
          { key: 'agility', label: 'Nhanh Nhẹn', icon: '👟', color: 'text-emerald-400', bg: 'bg-emerald-500/5' },
          { key: 'charisma', label: 'Uy Nghi', icon: '👑', color: 'text-pink-400', bg: 'bg-pink-500/5' },
          { key: 'luck', label: 'Phúc Lợi', icon: '🍀', color: 'text-yellow-500', bg: 'bg-yellow-500/5' },
        ] as GenreStatDef[],
        npcLabels: {
          power: "Ma Pháp / Chiến Lực", faction: "Vương Quốc / Liên Minh", race: "Chủng Tộc / Hệ", alignment: "Tín Ngưỡng / Lập Trường",
          desire: "Sứ Mệnh / Khát Vọng", background: "Sử Thi Ghi Chép", stat1Icon: "🔮", stat2Icon: "🛡️", stat3Icon: "📜"
        }
      };
    default:
      return {
        currency: "Tiền",
        skillLabel: "KỸ NĂNG",
        ranks: ["Cấp 1", "Cấp 2", "Cấp 3", "Cấp 4", "Cấp 5"],
        statsDef: [
          { key: 'strength', label: 'Sức Mạnh', icon: '⚔️', color: 'text-red-500', bg: 'bg-red-500/5' },
          { key: 'intelligence', label: 'Trí Tuệ', icon: '🧠', color: 'text-blue-400', bg: 'bg-blue-400/5' },
          { key: 'agility', label: 'Nhanh Nhẹn', icon: '⚡', color: 'text-emerald-400', bg: 'bg-emerald-500/5' },
        ] as GenreStatDef[],
        npcLabels: {
          power: "Cảnh Giới", faction: "Thế Lực", race: "Chủng Tộc", alignment: "Lập Trường", desire: "Ước Nguyện", background: "Tiểu sử",
          stat1Icon: "💠", stat2Icon: "💠", stat3Icon: "💠"
        }
      };
  }
};
