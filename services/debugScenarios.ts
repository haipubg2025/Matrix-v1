
import { GameGenre } from '../types';
import { 
  getUrbanNormalDebug, 
  getUrbanSuperDebug, 
  getCultivationDebug, 
  getWuxiaDebug, 
  getFantasyDebug 
} from './debugUrbanNormal';

export interface DebugScenarioResult {
  player: any;
  initialLogs: any[];
  initialTime: any;
}

/**
 * Hàm khởi tạo kịch bản Debug dựa trên Genre.
 */
export const getDebugScenario = (genre: GameGenre): DebugScenarioResult => {
  const timestamp = Date.now();

  switch (genre) {
    case GameGenre.URBAN_NORMAL:
      return getUrbanNormalDebug(timestamp) as DebugScenarioResult;
    case GameGenre.URBAN_SUPERNATURAL:
      return getUrbanSuperDebug(timestamp) as DebugScenarioResult;
    case GameGenre.CULTIVATION:
      return getCultivationDebug(timestamp) as DebugScenarioResult;
    case GameGenre.WUXIA:
      return getWuxiaDebug(timestamp) as DebugScenarioResult;
    case GameGenre.FANTASY_HUMAN:
    case GameGenre.FANTASY_MULTIRACE:
      return getFantasyDebug(timestamp) as DebugScenarioResult;
    default:
      // Dự phòng mặc định
      return getUrbanNormalDebug(timestamp) as DebugScenarioResult;
  }
};
