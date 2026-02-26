
import { useState, useCallback, useEffect } from 'react';
import { GameLog, GameArchetype, Player, SubScenario, Relationship, GameTime, GameGenre, AppSettings, AiModel } from '../types';
import { gameAI } from '../services/geminiService';
import { dbService } from '../services/dbService';
import { memoryService } from '../services/memoryService';
import { compensateNpcData, mergeNpcData } from '../services/npcService';
import { getDebugScenario } from '../services/debugScenarios';
import { GAME_ARCHETYPES } from '../constants';

import { CUSTOM_CULTIVATION } from '../dataCustomCultivation';
import { CUSTOM_URBAN_NORMAL } from '../dataCustomUrbanNormal';
import { CUSTOM_WUXIA } from '../dataCustomWuxia';
import { CUSTOM_FANTASY_HUMAN } from '../dataCustomFantasyHuman';
import { CUSTOM_FANTASY_MULTI } from '../dataCustomFantasyMulti';
import { CUSTOM_URBAN_SUPER } from '../dataCustomUrbanSuper';

export type ViewState = 'landing' | 'world-select' | 'context-select' | 'scenario-select' | 'playing';

export const useGameLogic = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [selectedWorld, setSelectedWorld] = useState<GameArchetype | null>(null);
  const [selectedContext, setSelectedContext] = useState<SubScenario | null>(null);
  const [logs, setLogs] = useState<GameLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingStatus, setIsSaving] = useState(false);
  const [isDebugActive, setIsDebugActive] = useState(false);
  
  const [lastAction, setLastAction] = useState<{ type: 'start' | 'command', data: any } | null>(null);

  const [settings, setSettings] = useState<AppSettings>({
    aiModel: AiModel.FLASH,
    thinkingBudget: 4000,
    contextWindowSize: 10,
    isFullscreen: false,
    primaryColor: '#10b981',
    adultContent: true,
    userApiKeys: []
  });

  const [gameTime, setGameTime] = useState<GameTime>({
    year: 2026, month: 5, day: 15, hour: 8, minute: 0
  });
  
  const [modals, setModals] = useState({
    identity: false, harem: false, family: false, social: false, codex: false, 
    library: false, npcProfile: false, save: false, history: false, settings: false,
    debug: false, customIdentity: false, saveManager: false
  });
  
  const [activeNpcProfile, setActiveNpcProfile] = useState<Relationship | null>(null);
  
  const [player, setPlayer] = useState<Player>({
    name: 'Vô Danh',
    avatar: '',
    gender: 'Nam',
    age: 22,
    birthday: '15/05/2004',
    health: 100,
    maxHealth: 100,
    level: 1,
    gold: 500,
    exp: 0,
    turnCount: 0,
    stats: { strength: 10, intelligence: 10, agility: 10, charisma: 10, luck: 10, soul: 10, merit: 10 },
    lineage: '?? (Đang kiến tạo)',
    spiritRoot: 'Phàm Căn (Ngũ Hành Hỗn Tạp)',
    physique: 'Phàm Thai',
    systemName: '',
    personality: '',
    currentLocation: 'Khởi đầu thực tại',
    assets: [],
    relationships: [],
    codex: [],
    quests: [],
    skills: [],
    inventory: [],
    gallery: []
  });

  // Apply primary color to CSS variables
  useEffect(() => {
    if (!settings.primaryColor) return;
    
    // Convert hex to RGB for the --primary-rgb variable
    const hex = settings.primaryColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
      document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
      document.documentElement.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
    }
  }, [settings.primaryColor]);

  useEffect(() => {
    const handleFsChange = () => {
      const isActualFs = !!document.fullscreenElement;
      setSettings(prev => (prev.isFullscreen !== isActualFs ? { ...prev, isFullscreen: isActualFs } : prev));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const loadSaveData = useCallback((data: any) => {
    if (!data) return;
    const loadedPlayer = { 
      ...data.player, 
      quests: Array.isArray(data.player.quests) ? data.player.quests : [],
      currentLocation: data.player.currentLocation || 'Khởi đầu thực tại'
    };
    if (loadedPlayer.personality === 'Chưa thức tỉnh nhân cách') {
      loadedPlayer.personality = '';
    }
    setPlayer(loadedPlayer);
    setLogs(data.logs || []);
    setGameTime(data.gameTime);
    setSelectedWorld(data.selectedWorld);
    setSelectedContext(data.selectedContext || null);
    setView(data.view || 'playing');
    if (data.isDebugActive) setIsDebugActive(true);
    if (data.settings) setSettings(prev => ({ ...data.settings, isFullscreen: prev.isFullscreen }));
    if (data.memory) memoryService.setState(data.memory);
  }, []);

  useEffect(() => {
    const initLoad = async () => {
      try {
        const latest = await dbService.getLatestSave();
        if (latest?.data) {
          loadSaveData(latest.data);
          if (latest.data.view === 'playing') setView('playing');
          else setView(latest.data.view || 'landing');
        }
      } catch (err) { console.error("DB Load Error", err); }
    };
    initLoad();
  }, [loadSaveData]);

  const triggerAutoSave = useCallback(async (overrides?: any) => {
    console.log("Triggering AutoSave...", { turnCount: (overrides?.player || player).turnCount });
    setIsSaving(true);
    const currentPlayer = overrides?.player || player;
    const slotIndex = currentPlayer.turnCount % 10;
    const slotId = `auto_slot_${slotIndex}`;
    const dataToSave = {
      player: currentPlayer,
      logs: overrides?.logs || logs,
      gameTime: overrides?.gameTime || gameTime,
      selectedWorld: overrides?.selectedWorld || selectedWorld,
      selectedContext: overrides?.selectedContext || selectedContext,
      view: overrides?.view || view,
      isDebugActive: overrides?.isDebugActive !== undefined ? overrides.isDebugActive : isDebugActive,
      settings: overrides?.settings || settings,
      memory: memoryService.getState()
    };
    try { 
      console.log("AutoSave data prepared, saving to:", slotId);
      await dbService.save(dataToSave, slotId); 
      await dbService.save(dataToSave, 'current_session');
      console.log("AutoSave successful:", slotId);
    } catch (err) {
      console.error("AutoSave failed:", err);
    } finally { 
      setTimeout(() => setIsSaving(false), 800); 
    }
  }, [player, logs, gameTime, selectedWorld, selectedContext, view, isDebugActive, settings]);

  const advanceTime = useCallback((minutesToAdd: number) => {
    setGameTime(prev => {
      let { year, month, day, hour, minute } = prev;
      minute += minutesToAdd;
      while (minute >= 60) { minute -= 60; hour += 1; }
      while (hour >= 24) { hour -= 24; day += 1; }
      while (day > 30) { day -= 30; month += 1; }
      while (month > 12) { month -= 12; year += 1; }
      return { year, month, day, hour, minute };
    });
  }, []);

  const formatGameTime = useCallback((t: GameTime) => {
    return `Ngày ${t.day.toString().padStart(2, '0')}/${t.month.toString().padStart(2, '0')}/${t.year} | ${t.hour.toString().padStart(2, '0')}:${t.minute.toString().padStart(2, '0')}`;
  }, []);

  const handleCommand = useCallback(async (command: string, timeCost?: number, isRetry: boolean = false) => {
    if (!command.trim() || isLoading || !selectedWorld) return;
    if (!isRetry) setLastAction({ type: 'command', data: { command, timeCost } });
    const playerLog: GameLog = { content: command, type: 'player', timestamp: Date.now() };
    const updatedLogsWithPlayer = isRetry ? [...logs] : [...logs, playerLog];
    if (!isRetry) setLogs(updatedLogsWithPlayer);
    setIsLoading(true);
    const startTime = performance.now();
    try {
      const fullHistory = (isRetry ? logs.slice(0, -1) : updatedLogsWithPlayer)
        .filter(l => l.type === 'player' || l.type === 'narrator')
        .map(l => ({ role: l.type === 'player' ? 'user' : 'model', parts: [{ text: l.content }] }));
      
      // Trim history based on contextWindowSize (each turn is 2 messages: user + model)
      const lastLog = logs.length > 0 ? logs[logs.length - 1] : null;
      const lastTurnNewNpcCount = lastLog?.metadata?.newNpcCount || 0;
      const history = fullHistory.slice(-(settings.contextWindowSize * 2));
      
      const update = await gameAI.getResponse(selectedWorld.systemInstruction, history, command, formatGameTime(gameTime), selectedWorld.genre, player, settings, lastTurnNewNpcCount);
      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      let updatedPlayer = { ...player, turnCount: player.turnCount + (isRetry ? 0 : 1) };
      const narratorText = update.text || "";
      const usedKeyIndex = update.usedKeyIndex;
      const coreLabel = usedKeyIndex ? `CORE_${usedKeyIndex}` : "SYSTEM_CORE";
      
      const justification = update.evolutionJustification;
      const newRelsRaw = Array.isArray(update.newRelationships) ? update.newRelationships : [];
      let currentRels: Relationship[] = [...updatedPlayer.relationships].map(r => ({ ...r, isPresent: false }));
      let newNpcCount = 0;
      newRelsRaw.forEach(rawNpc => {
        if (!rawNpc || (!rawNpc.id && !rawNpc.name)) return;
        
        const existingIdx = currentRels.findIndex(r => 
          (rawNpc.id && r.id === rawNpc.id) || 
          (r.name && rawNpc.name && r.name.toLowerCase() === rawNpc.name.toLowerCase())
        );

        if (existingIdx > -1) {
          currentRels[existingIdx] = mergeNpcData(currentRels[existingIdx], rawNpc, narratorText, gameTime.year, justification);
          currentRels[existingIdx].isPresent = true;
        } else {
          currentRels.push(compensateNpcData({ ...rawNpc, isPresent: true }, gameTime.year));
          newNpcCount++;
        }
      });
      updatedPlayer.relationships = currentRels;
      let finalNarratorText = narratorText + `\n\n[ THỜI GIAN KIẾN TẠO THỰC TẠI: ${duration} GIÂY | ${coreLabel} ]`;
      const narratorLog: GameLog = { 
        content: finalNarratorText, 
        type: 'narrator', 
        timestamp: Date.now(), 
        suggestedActions: update.suggestedActions,
        metadata: { duration, usedKeyIndex, newNpcCount }
      };
      const finalLogs = isRetry ? [...logs.slice(0, -1), narratorLog] : [...updatedLogsWithPlayer, narratorLog];
      setLogs(finalLogs);
      if (!isRetry) advanceTime(update.timeSkip || timeCost || 15);
      if (update.statsUpdates) {
        const s = update.statsUpdates;
        if (s.health !== undefined) updatedPlayer.health = Math.min(updatedPlayer.maxHealth, Math.max(0, updatedPlayer.health + s.health));
        if (s.maxHealth !== undefined) updatedPlayer.maxHealth = s.maxHealth;
        if (s.gold !== undefined) updatedPlayer.gold = Math.max(0, updatedPlayer.gold + s.gold);
        if (s.exp !== undefined) updatedPlayer.exp += s.exp;
        if (s.level !== undefined) updatedPlayer.level = s.level;
        
        if (s.name) updatedPlayer.name = s.name;
        if (s.title) updatedPlayer.title = s.title;
        if (s.lineage) updatedPlayer.lineage = s.lineage;
        if (s.currentLocation) updatedPlayer.currentLocation = s.currentLocation;
        if (s.systemName) updatedPlayer.systemName = s.systemName;
        if (s.personality) updatedPlayer.personality = s.personality;
        
        if (Array.isArray(s.inventory)) updatedPlayer.inventory = s.inventory;
        if (Array.isArray(s.skills)) updatedPlayer.skills = s.skills;
        if (Array.isArray(s.assets)) updatedPlayer.assets = s.assets;

        if (s.stats) {
          updatedPlayer.stats = { ...updatedPlayer.stats, ...s.stats };
        }
      }
      if (update.currentLocation) updatedPlayer.currentLocation = update.currentLocation;

      setPlayer(updatedPlayer);
      memoryService.updateMemory(finalLogs, updatedPlayer.turnCount);
      triggerAutoSave({ player: updatedPlayer, logs: finalLogs });
    } catch (error: any) {
      console.error("Game AI Error:", error);
      const coreIndex = error?.usedKeyIndex;
      const coreInfo = coreIndex ? ` (Core #${coreIndex})` : " (System Core)";
      
      const errorMessage = error?.message?.includes("API_KEY_INVALID") 
        ? `API Key${coreInfo} không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại Ma Trận API.`
        : error?.message?.includes("quota")
        ? `Hết hạn mức API${coreInfo} (Rate Limit). Vui lòng thử lại sau hoặc thêm API Key mới.`
        : error?.message?.includes("SAFETY_BLOCK")
        ? `[BỘ LỌC AN TOÀN]: ${error.message.split(": ")[1] || "Nội dung bị chặn do quá nhạy cảm."}`
        : error?.message?.includes("PARSE_ERROR")
        ? `[LỖI DỮ LIỆU]: ${error.message.split(": ")[1] || "Lỗi phân tích lượng tử."}`
        : `Mất kết nối thực tại tại${coreInfo} hoặc lỗi hệ thống: ${error?.message || "Không rõ nguyên nhân"}`;
        
      setLogs(prev => [...prev, { 
        content: `[ CẢNH BÁO HỆ THỐNG ]: ${errorMessage}`, 
        type: 'error', 
        timestamp: Date.now(),
        metadata: { usedKeyIndex: coreIndex }
      }]);
    } finally { setIsLoading(false); }
  }, [logs, isLoading, selectedWorld, player, gameTime, formatGameTime, advanceTime, triggerAutoSave, settings]);

  // Fix: wrapped handleStartGame in useCallback to ensure stable reference for handleRetry
  const handleStartGame = useCallback(async (scenarioText: string, isRetry: boolean = false) => {
    if (!selectedWorld) return;
    if (!isRetry) setLastAction({ type: 'start', data: scenarioText });
    
    // Bắt buộc làm sạch gameplay trước khi AI chạy
    setIsLoading(true);
    setLogs([]); 
    setView('playing');
    
    const isUrban = selectedWorld.genre === GameGenre.URBAN_NORMAL || selectedWorld.genre === GameGenre.URBAN_SUPERNATURAL;
    const initialYear = isUrban ? 2026 : Math.floor(Math.random() * 3000) + 500;
    const startTime: GameTime = { year: initialYear, month: 5, day: 15, hour: 8, minute: 0 };
    setGameTime(startTime);
    
    // Ngẫu nhiên hóa một số thông tin cơ bản
    const randomName = selectedWorld.defaultMcNames[Math.floor(Math.random() * selectedWorld.defaultMcNames.length)] || 'Vô Danh';
    const randomAge = Math.floor(Math.random() * 10) + 16; // 16-25 tuổi
    
    // Khởi tạo chỉ số dựa trên Genre
    let randomStats = {
      strength: 8 + Math.floor(Math.random() * 7),
      intelligence: 8 + Math.floor(Math.random() * 7),
      agility: 8 + Math.floor(Math.random() * 7),
      charisma: 8 + Math.floor(Math.random() * 7),
      luck: 5 + Math.floor(Math.random() * 11),
      soul: 0,
      merit: 0
    };

    let lineage = '?? (Đang kiến tạo theo bối cảnh)';
    let spiritRoot = '';
    let physique = '';

    const genre = selectedWorld.genre;
    if (genre === GameGenre.CULTIVATION) {
      const roots = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ', 'Lôi', 'Phong', 'Băng', 'Không Gian', 'Thời Gian'];
      const rootCount = Math.random() > 0.8 ? 1 : Math.random() > 0.5 ? 2 : 3;
      const selectedRoots = [...roots].sort(() => 0.5 - Math.random()).slice(0, rootCount);
      spiritRoot = `${selectedRoots.join(' - ')} (${rootCount === 1 ? 'Thiên Linh Căn' : rootCount === 2 ? 'Địa Linh Căn' : 'Tạp Linh Căn'})`;
      physique = Math.random() > 0.9 ? 'Tiên Linh Thể' : Math.random() > 0.8 ? 'Ma Thần Thể' : 'Phàm Thai';
      randomStats.soul = 10 + Math.floor(Math.random() * 10);
    } else if (genre === GameGenre.WUXIA) {
      physique = 'Nội công thâm hậu';
    } else if (genre === GameGenre.URBAN_NORMAL) {
      randomStats.charisma += 5;
    } else if (genre === GameGenre.URBAN_SUPERNATURAL) {
      const bg = CUSTOM_URBAN_SUPER[Math.floor(Math.random() * CUSTOM_URBAN_SUPER.length)];
      spiritRoot = 'Dị Năng: ' + bg.tag;
    } else if (genre === GameGenre.FANTASY_HUMAN) {
      // AI will handle lineage
    } else if (genre === GameGenre.FANTASY_MULTIRACE) {
      // AI will handle lineage
    }

    const initialPlayer: Player = {
      name: randomName,
      avatar: '',
      gender: 'Nam',
      age: randomAge,
      birthday: `${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 12) + 1}/${initialYear - randomAge}`,
      health: 100,
      maxHealth: 100,
      level: 1,
      gold: 500 + Math.floor(Math.random() * 500),
      exp: 0,
      turnCount: 0,
      stats: randomStats,
      lineage: lineage,
      spiritRoot: spiritRoot || undefined,
      physique: physique || undefined,
      systemName: '',
      personality: '',
      currentLocation: 'Khởi đầu thực tại',
      assets: [],
      relationships: [],
      codex: [],
      quests: [],
      skills: [],
      inventory: [],
      gallery: []
    };
    
    setPlayer(initialPlayer);
    setActiveNpcProfile(null);
    memoryService.setState({ 
      worldSummary: "Câu chuyện vừa bắt đầu.", 
      memories: [], 
      lastSummarizedTurn: 0 
    }); // Reset memory state
    
    try {
      const perfStart = performance.now();
      const update = await gameAI.getResponse(selectedWorld.systemInstruction, [], `BẮT ĐẦU. ${scenarioText}`, formatGameTime(startTime), selectedWorld.genre, initialPlayer, settings);
      const perfEnd = performance.now();
      const duration = ((perfEnd - perfStart) / 1000).toFixed(2);
      const usedKeyIndex = update.usedKeyIndex;
      const coreLabel = usedKeyIndex ? `CORE_${usedKeyIndex}` : "SYSTEM_CORE";
      const newNpcCount = Array.isArray(update.newRelationships) ? update.newRelationships.length : 0;
      
      const narratorLog: GameLog = { 
        content: update.text + `\n\n[ KHỞI TẠO THÀNH CÔNG | ${duration}s | ${coreLabel} ]`, 
        type: 'narrator', 
        timestamp: Date.now(), 
        suggestedActions: update.suggestedActions,
        metadata: { duration, usedKeyIndex, newNpcCount }
      };
      setLogs([narratorLog]);
      let updatedPlayer = { ...initialPlayer };
      if (update.statsUpdates) {
        const s = update.statsUpdates;
        if (s.name) updatedPlayer.name = s.name;
        if (s.title) updatedPlayer.title = s.title;
        if (s.lineage) updatedPlayer.lineage = s.lineage;
        if (s.currentLocation) updatedPlayer.currentLocation = s.currentLocation;
        if (s.systemName) updatedPlayer.systemName = s.systemName;
        if (s.personality) updatedPlayer.personality = s.personality;
        if (s.health !== undefined) updatedPlayer.health = s.health;
        if (s.maxHealth !== undefined) updatedPlayer.maxHealth = s.maxHealth;
        if (s.gold !== undefined) updatedPlayer.gold = s.gold;
        if (s.level !== undefined) updatedPlayer.level = s.level;
        if (s.exp !== undefined) updatedPlayer.exp = s.exp;
        
        if (Array.isArray(s.inventory)) updatedPlayer.inventory = s.inventory;
        if (Array.isArray(s.skills)) updatedPlayer.skills = s.skills;
        if (Array.isArray(s.assets)) updatedPlayer.assets = s.assets;

        if (s.stats) {
          updatedPlayer.stats = { ...updatedPlayer.stats, ...s.stats };
        }
      }
      if (update.currentLocation) updatedPlayer.currentLocation = update.currentLocation;
      
      if (Array.isArray(update.newRelationships)) {
        updatedPlayer.relationships = update.newRelationships.map(r => compensateNpcData({ ...r, isPresent: true }, initialYear));
      }
      setPlayer(updatedPlayer);
      memoryService.updateMemory([narratorLog], 0);
      triggerAutoSave({ view: 'playing', logs: [narratorLog], player: updatedPlayer, gameTime: startTime });
    } catch (error: any) {
      console.error("Game Start Error:", error);
      const coreIndex = error?.usedKeyIndex;
      const coreInfo = coreIndex ? ` (Core #${coreIndex})` : " (System Core)";
      
      const errorMessage = error?.message?.includes("API_KEY_INVALID") 
        ? `API Key${coreInfo} không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại Ma Trận API.`
        : error?.message?.includes("quota")
        ? `Hết hạn mức API${coreInfo} (Rate Limit). Vui lòng thử lại sau hoặc thêm API Key mới.`
        : error?.message?.includes("SAFETY_BLOCK")
        ? `[BỘ LỌC AN TOÀN]: ${error.message.split(": ")[1] || "Nội dung bị chặn do quá nhạy cảm."}`
        : error?.message?.includes("PARSE_ERROR")
        ? `[LỖI DỮ LIỆU]: ${error.message.split(": ")[1] || "Lỗi phân tích lượng tử."}`
        : `Lỗi khởi tạo thực tại tại${coreInfo}: ${error?.message || "Không rõ nguyên nhân"}`;
        
      setLogs([{ 
        content: `[ CẢNH BÁO HỆ THỐNG ]: ${errorMessage}`, 
        type: 'error', 
        timestamp: Date.now(),
        metadata: { usedKeyIndex: coreIndex }
      }]);
    } finally { setIsLoading(false); }
  }, [selectedWorld, player, formatGameTime, settings, triggerAutoSave]);

  const handleBack = () => {
    if (view === 'playing') { setView('landing'); return; }
    const flow: ViewState[] = ['landing', 'world-select', 'context-select', 'scenario-select', 'playing'];
    const currentIdx = flow.indexOf(view);
    if (currentIdx > 0) setView(flow[currentIdx - 1]);
  };

  // Fix: implemented handleRetry to re-execute the last recorded action
  const handleRetry = useCallback(() => {
    if (!lastAction || isLoading) return;
    if (lastAction.type === 'start') {
      handleStartGame(lastAction.data, true);
    } else if (lastAction.type === 'command') {
      handleCommand(lastAction.data.command, lastAction.data.timeCost, true);
    }
  }, [lastAction, isLoading, handleStartGame, handleCommand]);

  const handleManualSave = useCallback(async () => {
    console.log("Manual Save Triggered");
    if (!selectedWorld) {
      alert("Hệ thống chưa xác định được thế giới hiện tại. Không thể phong ấn!");
      return;
    }
    
    setIsSaving(true);
    try {
      const dataToSave = { 
        player, 
        logs, 
        gameTime, 
        selectedWorld, 
        selectedContext, 
        settings, 
        isDebugActive, 
        view,
        memory: memoryService.getState()
      };
      
      const slotId = `manual_${selectedWorld.id}`;
      console.log("Saving to slot:", slotId);
      
      await dbService.save(dataToSave, slotId);
      
      // Download to machine
      const metadata = {
        playerName: player.name,
        level: player.level,
        timestamp: Date.now(),
        genre: selectedWorld.genre,
        worldId: selectedWorld.id,
        turnCount: player.turnCount,
        avatar: player.avatar
      };
      const blob = new Blob([JSON.stringify({ ...dataToSave, metadata }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ThiênCơ_${player.name}_${selectedWorld.title}_Turn${player.turnCount}.json`;
      a.click();
      URL.revokeObjectURL(url);

      // setModals(prev => ({ ...prev, saveManager: true })); // Removed for immediate feel
    } catch (err) {
      console.error("Manual Save Error:", err);
      alert("Lỗi phong ấn thực tại: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSaving(false);
    }
  }, [player, logs, gameTime, selectedWorld, selectedContext, settings, isDebugActive, view]);

  return {
    view, setView, selectedWorld, setSelectedWorld, selectedContext, setSelectedContext,
    logs, setLogs, isLoading, isSavingStatus, isDebugActive, setIsDebugActive,
    gameTime, setGameTime, formatGameTime, modals, setModals, player, setPlayer,
    activeNpcProfile, setActiveNpcProfile, handleCommand, handleStartGame, handleBack,
    handleRetry, triggerAutoSave, settings, setSettings, loadSaveData,
    updateSettings: (s: Partial<AppSettings>) => {
      if (s.isFullscreen !== undefined && s.isFullscreen !== settings.isFullscreen) {
        if (s.isFullscreen) {
          document.documentElement.requestFullscreen().catch((err) => {
            console.error("Fullscreen request failed:", err);
            setSettings(prev => ({ ...prev, isFullscreen: false }));
          });
        } else if (document.fullscreenElement) {
          document.exitFullscreen().catch((err) => {
            console.error("Exit fullscreen failed:", err);
            setSettings(prev => ({ ...prev, isFullscreen: true }));
          });
        }
      }
      setSettings(prev => ({ ...prev, ...s }));
    },
    handleManualSave
  };
};
