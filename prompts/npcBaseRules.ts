
import { NPC_NAMING_RULES } from './npcNamingRules';
import { NPC_IDENTITY_RULES } from './npcIdentityRules';
import { NPC_VIRGINITY_RULES } from './npcVirginityRules';
import { NPC_GENDER_DESCRIPTION_RULES } from './npcGenderDescriptionRules';
import { NPC_META_RULES } from './npcMetaRules';
import { NPC_FAMILY_RULES } from './npcFamilyRules';

export const NPC_BASE_RULES = `
QUY TẮC KHỞI TẠO VÀ QUẢN LÝ THỰC THỂ (NPC CORE RULES):

${NPC_NAMING_RULES}
${NPC_IDENTITY_RULES}
${NPC_VIRGINITY_RULES}
${NPC_GENDER_DESCRIPTION_RULES}
${NPC_META_RULES}
${NPC_FAMILY_RULES}
`;
