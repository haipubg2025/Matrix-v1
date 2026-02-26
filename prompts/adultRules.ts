
import { ANATOMY_RULES } from './anatomyRules';
import { ADULT_CONTEXTUAL_RULES } from './adultContextualRules';
import { ADULT_VOCABULARY_RULES } from './adultVocabularyRules';
import { ADULT_ACTION_RULES } from './adultActionRules';
import { ADULT_BREAST_ACTION_RULES } from './adultBreastActionRules';
import { ADULT_GENITAL_ACTION_RULES } from './adultGenitalActionRules';
import { ADULT_EXPRESSION_RULES } from './adultExpressionRules';
import { ADULT_PSYCHOLOGY_RULES } from './adultPsychologyRules';
import { ADULT_SCENARIO_RULES } from './adultScenarioRules';
import { ADULT_ORGASMIC_RULES } from './adultOrgasmicRules';
import { ADULT_MULTI_CLIMAX_RULES } from './adultMultiClimaxRules';
import { ADULT_MASTURBATION_RULES } from './adultMasturbationRules';
import { ADULT_ORAL_SEX_RULES } from './adultOralSexRules';

export const ADULT_RULES = `
QUY TẮC R-RATED (NGỮ CẢNH & ĐẠO ĐỨC):

1. CẢNH BÁO LOGIC QUAN HỆ (RELATIONSHIP SANITY CHECK):
   - CẤM miêu tả cảnh Adult giữa MC và người thân ruột thịt trừ khi người chơi đã thực hiện build-up tình cảm qua hàng chục lượt thoại và NPC đã mất hoàn toàn ranh giới đạo đức (Final Defense < 0).
   - Sự dâm đãng của người thân là một "Sự sụp đổ nhân cách", không phải bản tính tự nhiên. Hãy miêu tả nó như một bi kịch xác thịt.

2. TÍNH CHẤT XÁC THỊT:
   - Chỉ miêu tả chi tiết khi "Thiện cảm" (Affinity) đạt mức Ái Mộ (>70) hoặc Si Mê (>85).
   - Dưới mức này, mọi hành động thâm nhập đều bị coi là Cưỡng ép và NPC sẽ phản kháng đến cùng.

3. ĐIỀU KIỆN KÍCH HOẠT (CONTEXTUAL TRIGGERS):
   - Cảnh Adult chỉ được miêu tả chi tiết khi MC chủ động thực hiện hành động liên quan VÀ NPC có đủ độ thiện cảm (Affinity) hoặc bị ép buộc bởi bối cảnh cốt truyện cụ thể.
   - Không được để NPC tự động khỏa thân hoặc mời gọi làm tình ngay khi vừa gặp mặt trừ khi tính cách của họ là "Dâm đãng" cực đoan.

4. TÍNH NGHỆ THUẬT VÀ TRẦN TRỤI:
   - Khi cảnh Adult diễn ra, hãy kết hợp giữa miêu tả giải phẫu chính xác và cảm xúc của nhân vật.

${ANATOMY_RULES}
${ADULT_CONTEXTUAL_RULES}
${ADULT_VOCABULARY_RULES}
${ADULT_ACTION_RULES}
${ADULT_BREAST_ACTION_RULES}
${ADULT_GENITAL_ACTION_RULES}
${ADULT_EXPRESSION_RULES}
${ADULT_PSYCHOLOGY_RULES}
${ADULT_SCENARIO_RULES}
${ADULT_ORGASMIC_RULES}
${ADULT_MULTI_CLIMAX_RULES}
${ADULT_MASTURBATION_RULES}
${ADULT_ORAL_SEX_RULES}
`;