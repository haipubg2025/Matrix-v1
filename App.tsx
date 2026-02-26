
import React, { useCallback, useEffect, useState } from 'react';
import { GAME_ARCHETYPES } from './constants';
import { Header } from './components/Layout/Header';
import { LandingView } from './views/LandingView';
import { GameCard } from './components/GameCard';
import { PlayingView } from './views/PlayingView';
import { McModal } from './components/McModal';
import { CustomIdentityModal } from './components/CustomIdentityModal';
import { HaremModal } from './components/HaremModal';
import { FamilyModal } from './components/FamilyModal';
import { SocialModal } from './components/SocialModal';
import { CodexModal } from './components/CodexModal';
import { NpcProfileModal } from './components/NpcProfileModal';
import { SaveManagerModal } from './components/SaveManagerModal';
import { HistoryModal } from './components/HistoryModal';
import { SettingsModal } from './components/SettingsModal';
import { LibraryModal } from './components/LibraryModal';
import { DebugModal } from './components/DebugModal';
import { useGameLogic } from './hooks/useGameLogic';
import { Relationship, GameGenre } from './types';
import { dbService } from './services/dbService';
import { getDebugScenario } from './services/debugScenarios';

const App: React.FC = () => {
  const {
    view, setView,
    selectedWorld, setSelectedWorld,
    selectedContext, setSelectedContext,
    logs, setLogs,
    isLoading,
    isSavingStatus,
    isDebugActive, setIsDebugActive,
    gameTime, setGameTime, formatGameTime,
    modals, setModals,
    player, setPlayer,
    activeNpcProfile, setActiveNpcProfile,
    handleCommand, handleStartGame, handleBack,
    handleRetry,
    handleManualSave,
    settings, updateSettings, loadSaveData
  } = useGameLogic();

  const openNpcProfile = useCallback((npc: Relationship) => { 
    setActiveNpcProfile(npc); 
    setModals(prev => ({ ...prev, npcProfile: true })); 
  }, [setActiveNpcProfile, setModals]);

  const handleLoadSpecificSave = async (slotId: string) => {
    const data = await dbService.load(slotId);
    if (data) {
      loadSaveData(data);
      setModals(prev => ({ ...prev, saveManager: false, history: false }));
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#050505] overflow-hidden text-neutral-200">
      {view !== 'landing' && (
        <Header 
          player={player}
          gameTime={formatGameTime(gameTime)} 
          currentLocation={player.currentLocation}
          isSaving={isSavingStatus} 
          modals={modals} 
          setModals={setModals} 
          handleBack={handleBack} 
          view={view} 
          isDebugActive={isDebugActive}
          onManualSave={handleManualSave}
          onDebug={() => setIsDebugActive(true)}
          onRetry={handleRetry}
          isLoading={isLoading}
        />
      )}
      
      <main className="flex-grow flex flex-col overflow-hidden relative">
        {view === 'landing' && (
          <LandingView 
            player={player}
            onStart={() => setView('world-select')} 
            onContinue={async () => {
              const latest = await dbService.getLatestSave();
              if (latest) handleLoadSpecificSave(latest.slot);
            }}
            onOpenSaveManager={() => setModals({...modals, saveManager: true})}
            onOpenSettings={() => setModals({...modals, settings: true})} 
            onDebug={() => { setIsDebugActive(true); setView('playing'); }} 
          />
        )}
        
        {view === 'world-select' && (
          <div className="flex-grow flex flex-col items-center overflow-y-auto custom-scrollbar p-12 pb-24">
            <h2 className="text-7xl font-black text-white uppercase tracking-tighter italic mb-16">
              Vạn Giới <span className="text-emerald-500">Hồng Trần</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-8 w-full max-w-[120rem]">
              {GAME_ARCHETYPES.map(a => <GameCard key={a.id} archetype={a} onSelect={() => { setSelectedWorld(a); setView('context-select'); }} />)}
            </div>
          </div>
        )}

        {view === 'context-select' && selectedWorld && (
          <div className="flex-grow flex flex-col p-12 overflow-hidden">
            <div className="flex justify-between items-center mb-12">
              <div className="w-48"></div> {/* Spacer for symmetry */}
              <h2 className="text-6xl font-black text-white uppercase tracking-tighter text-center">
                Chọn <span className="text-emerald-500">Bối Cảnh</span>
              </h2>
              <div className="w-48 flex justify-end">
                <button 
                  onClick={() => setModals({ ...modals, customIdentity: true })}
                  className="px-6 py-3 bg-emerald-500/10 border border-dashed border-emerald-500/40 rounded-2xl text-emerald-500 font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 hover:text-black transition-all shadow-[0_0_20px_rgba(16,185,129,0.1)] active:scale-95 flex items-center gap-3"
                >
                  <span className="text-lg">✨</span>
                  <span>Tùy Chọn</span>
                </button>
              </div>
            </div>
            <div className="flex-grow overflow-y-auto custom-scrollbar grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {selectedWorld.subScenarios.map(sub => (
                <div key={sub.id} onClick={() => { setSelectedContext(sub); setView('scenario-select'); }} className="p-8 rounded-[2.5rem] border border-white/5 bg-neutral-900/40 hover:border-emerald-500 hover:bg-emerald-500/5 transition-all cursor-pointer group shadow-xl flex flex-col min-h-[160px]">
                  <h3 className="text-sm font-black text-white group-hover:text-emerald-400 uppercase mb-4">{sub.title.replace("Bối cảnh: ", "")}</h3>
                  <p className="text-neutral-500 text-[10px] font-bold leading-relaxed">{sub.description}</p>
                  <div className="mt-auto pt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="text-[10px] mono font-black text-emerald-500">TIẾP TỤC ❯</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'scenario-select' && selectedContext && (
          <div className="flex-grow flex flex-col p-12 overflow-hidden">
            <h2 className="text-6xl font-black text-white uppercase tracking-tighter mb-4 text-center">
              Chọn <span className="text-emerald-500">Kịch Bản</span>
            </h2>
            <p className="text-neutral-500 text-center mb-12 uppercase mono text-xs tracking-widest font-black italic">{selectedContext.title}</p>
            <div className="flex-grow overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-[120rem] mx-auto px-4">
              {selectedContext.scenarios.map((sc, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleStartGame(`${selectedContext.title}: ${sc}`)} 
                  className="p-6 rounded-2xl border border-white/5 bg-neutral-900/40 hover:border-emerald-500 hover:bg-emerald-500/5 transition-all cursor-pointer group shadow-lg flex items-center gap-6 h-fit"
                >
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500 font-black mono text-xl group-hover:bg-emerald-500 group-hover:text-black transition-all">
                    {idx + 1}
                  </div>
                  <div className="flex-grow">
                    <p className="text-neutral-200 text-sm font-bold leading-relaxed group-hover:text-white transition-colors">{sc}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                     <span className="text-[10px] mono font-black text-emerald-500">BẮT ĐẦU ❯</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {view === 'playing' && selectedWorld && (
          <PlayingView 
            player={player} 
            genre={selectedWorld.genre} 
            logs={logs} 
            isLoading={isLoading} 
            handleCommand={handleCommand} 
            openNpcProfile={openNpcProfile} 
          />
        )}
      </main>

      <McModal player={player} genre={selectedWorld?.genre} isOpen={modals.identity} onClose={() => setModals({...modals, identity: false})} onUpdatePlayer={setPlayer} />
      <CustomIdentityModal 
        isOpen={modals.customIdentity} 
        onClose={() => setModals({...modals, customIdentity: false})} 
        selectedWorld={selectedWorld} 
        onSelectIdentity={(identity) => {
          setModals({...modals, customIdentity: false});
          handleStartGame(typeof identity === 'string' ? identity : identity.label);
        }}
        onSwitchWorld={setSelectedWorld}
      />
      <HaremModal player={player} genre={selectedWorld?.genre} isOpen={modals.harem} onClose={() => setModals({...modals, harem: false})} onOpenProfile={openNpcProfile} />
      <FamilyModal player={player} genre={selectedWorld?.genre} isOpen={modals.family} onClose={() => setModals({...modals, family: false})} onOpenProfile={openNpcProfile} />
      <SocialModal player={player} genre={selectedWorld?.genre} isOpen={modals.social} onClose={() => setModals({...modals, social: false})} onOpenProfile={openNpcProfile} />
      <CodexModal player={player} isOpen={modals.codex} onClose={() => setModals({...modals, codex: false})} />
      <LibraryModal player={player} isOpen={modals.library} onClose={() => setModals({...modals, library: false})} onUpdatePlayer={setPlayer} />
      <NpcProfileModal npc={activeNpcProfile} player={player} isOpen={modals.npcProfile} genre={selectedWorld?.genre} onClose={() => setModals({...modals, npcProfile: false})} onUpdateNpc={(n) => { setPlayer(prev => ({...prev, relationships: prev.relationships.map(r => r.id === n.id ? n : r)})); setActiveNpcProfile(n); }} onSwitchNpc={setActiveNpcProfile} />
      <SaveManagerModal isOpen={modals.saveManager} onClose={() => setModals({...modals, saveManager: false})} onLoadSave={handleLoadSpecificSave} />
      <HistoryModal isOpen={modals.history} onClose={() => setModals({...modals, history: false})} logs={logs} onLoadSave={handleLoadSpecificSave} />
      <SettingsModal isOpen={modals.settings} onClose={() => setModals({...modals, settings: false})} settings={settings} onUpdateSettings={updateSettings} />
      <DebugModal player={player} selectedWorld={selectedWorld} isOpen={modals.debug} onClose={() => setModals({...modals, debug: false})} onUpdatePlayer={setPlayer} onUpdateWorld={setSelectedWorld} onSwitchGenre={(g) => { const s = getDebugScenario(g); setPlayer(s.player); setLogs(s.initialLogs); setGameTime(s.initialTime); setSelectedWorld(GAME_ARCHETYPES.find(a => a.genre === g) || GAME_ARCHETYPES[0]); setModals(m => ({...m, debug: false})); }} />
    </div>
  );
};

export default App;
