import React, { useState, useEffect, useRef } from 'react';
import {
  GameState,
  CrisisResolutionResult,
  TacticalBattleState
} from './game/types';
import { createInitialGameState } from './game/initialState';
import { simulateOneDay } from './game/simulation';
import { saveGame, loadGame } from './game/storage';
import { sounds } from './game/audio';

// UI Components
import { TopBar } from './components/TopBar';
import { CrisisModal } from './components/CrisisModal';
import { TacticalBattleModal } from './components/TacticalBattleModal';
import { EventModal } from './components/EventModal';

// Screens
import { DashboardScreen } from './screens/DashboardScreen';
import { OperationsScreen } from './screens/OperationsScreen';
import { ArsenalScreen } from './screens/ArsenalScreen';
import { MarketScreen } from './screens/MarketScreen';
import { MembersScreen } from './screens/MembersScreen';
import { TerritoryScreen } from './screens/TerritoryScreen';
import { BusinessesScreen } from './screens/BusinessesScreen';
import { FactionsScreen } from './screens/FactionsScreen';
import { NewsScreen } from './screens/NewsScreen';
import { StatisticsScreen } from './screens/StatisticsScreen';
import { AchievementsScreen } from './screens/AchievementsScreen';
import { NewGameModal } from './screens/NewGameModal';

// Icons
import {
  LayoutDashboard,
  Crosshair,
  Shield,
  Package,
  Users,
  MapPin,
  Briefcase,
  HeartHandshake,
  Radio,
  BarChart3,
  Award,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const loaded = loadGame();
    if (loaded) return loaded;
    return createInitialGameState({
      leaderName: 'Vance Kovac',
      orgName: 'The Iron Sovereign',
      regionId: 'eastern_port',
      orgStyle: 'Organized Crime Syndicate'
    });
  });

  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(() => sounds.isMuted());
  const [showNewGameModal, setShowNewGameModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reference to latest state for interval
  const stateRef = useRef(gameState);
  stateRef.current = gameState;

  // Auto-save whenever day advances or key milestone occurs
  useEffect(() => {
    saveGame(gameState);
  }, [gameState.day, gameState.reputation, gameState.cash]);

  // Main Simulation Interval Timer
  useEffect(() => {
    if (
      gameState.isPaused ||
      gameState.activeCrisis ||
      gameState.activeTacticalBattle ||
      gameState.pendingEvents.length > 0 ||
      gameState.timeSpeed === 0
    ) {
      return;
    }

    const speedIntervals = {
      1: 3200,
      3: 1500,
      5: 850,
      10: 450
    };
    const delay = speedIntervals[gameState.timeSpeed] || 3200;

    const interval = setInterval(() => {
      setGameState(prev => {
        if (
          prev.isPaused ||
          prev.activeCrisis ||
          prev.activeTacticalBattle ||
          prev.pendingEvents.length > 0
        ) {
          return prev;
        }
        return simulateOneDay(prev);
      });
    }, delay);

    return () => clearInterval(interval);
  }, [
    gameState.isPaused,
    gameState.timeSpeed,
    gameState.activeCrisis,
    gameState.activeTacticalBattle,
    gameState.pendingEvents.length
  ]);

  // Show toast notification
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handle Manual Save
  const handleManualSave = () => {
    sounds.playCash();
    const success = saveGame(gameState);
    if (success) {
      triggerToast('Game state successfully saved to browser storage.');
    }
  };

  // Toggle Audio
  const handleToggleAudio = () => {
    const muted = sounds.toggleMute();
    setIsAudioMuted(muted);
  };

  // Navigation Tab Change
  const handleTabChange = (tab: GameState['activeTab']) => {
    sounds.playClick();
    setGameState(prev => ({ ...prev, activeTab: tab }));
  };

  // Crisis Resolution Callback
  const handleResolveCrisis = (result: CrisisResolutionResult) => {
    setGameState(prev => {
      const c = result.consequences;

      // Update Members
      const updatedMembers = prev.members.map(m => {
        const update = c.memberUpdates.find(u => u.memberId === m.id);
        if (update) {
          const newHp = Math.max(0, m.health - update.healthDamage);
          return {
            ...m,
            health: newHp,
            status: update.newStatus,
            morale: Math.max(10, Math.min(100, m.morale + update.moraleDelta)),
            loyalty: Math.max(10, Math.min(100, m.loyalty + update.loyaltyDelta)),
            experience: m.experience + 40,
            operationsCount: m.operationsCount + 1,
            successesCount:
              result.tier.includes('Success') ? m.successesCount + 1 : m.successesCount,
            failuresCount:
              result.tier.includes('Failure') ? m.failuresCount + 1 : m.failuresCount
          };
        }
        return m;
      });

      // Update Weapons
      let updatedWeapons = prev.weapons.map(w => {
        const wUpdate = c.weaponUpdates.find(u => u.weaponId === w.id);
        if (wUpdate) {
          const newCond = Math.max(15, w.condition - wUpdate.wear);
          const isVeteran = w.deployments >= 10 && w.kills >= 5;
          return {
            ...w,
            condition: newCond,
            roundsFired: w.roundsFired + 60,
            deployments: w.deployments + 1,
            kills: w.kills + (result.tier.includes('Success') ? 2 : 0),
            isVeteranWeapon: isVeteran
          };
        }
        return w;
      });

      // Remove lost weapons
      const lostIds = c.weaponUpdates.filter(u => u.lost).map(u => u.weaponId);
      if (lostIds.length > 0) {
        updatedWeapons = updatedWeapons.filter(w => !lostIds.includes(w.id));
      }

      // Check Achievements
      const updatedAchievements = prev.achievements.map(ach => {
        if (ach.id === 'ach_crisis_master' && !ach.unlocked && prev.statistics.crisesOvercome + 1 >= 3) {
          return { ...ach, unlocked: true, unlockedDay: prev.day };
        }
        if (ach.id === 'ach_critical_success' && !ach.unlocked && result.tier === 'Critical Success') {
          return { ...ach, unlocked: true, unlockedDay: prev.day };
        }
        return ach;
      });

      triggerToast(`Crisis Resolved: ${result.tier}! Check after-action log.`);

      return {
        ...prev,
        cash: prev.cash + c.cashGained,
        reputation: Math.max(0, Math.min(100, prev.reputation + c.repDelta)),
        prestige: Math.max(0, Math.min(100, prev.prestige + c.prestigeDelta)),
        wantedLevel: Math.max(0, Math.min(100, prev.wantedLevel + c.wantedDelta)),
        policePressure: Math.max(0, Math.min(100, prev.policePressure + c.policePressureDelta)),
        members: updatedMembers,
        weapons: updatedWeapons,
        activeCrisis: null,
        crisisHistory: [result, ...prev.crisisHistory],
        eventHistory: [
          {
            id: `crisis_log_${Date.now()}`,
            day: prev.day,
            title: `Crisis Standoff: ${result.optionChosen.name} (${result.tier})`,
            description: result.narrativeSummary,
            type: result.tier.includes('Success') ? 'positive' : 'negative'
          },
          ...prev.eventHistory
        ],
        achievements: updatedAchievements,
        statistics: {
          ...prev.statistics,
          totalMoneyEarned: prev.statistics.totalMoneyEarned + c.cashGained,
          crisesOvercome: prev.statistics.crisesOvercome + 1,
          contractsCompleted:
            result.tier.includes('Success')
              ? prev.statistics.contractsCompleted + 1
              : prev.statistics.contractsCompleted
        }
      };
    });
  };

  // Tactical Battle Completion Callback
  const handleFinishBattle = (battle: TacticalBattleState) => {
    setGameState(prev => {
      const isWin = battle.result?.includes('Victory');
      const isUnderdog = battle.result === 'Underdog Victory';

      if (isWin) {
        sounds.playVictory();
        triggerToast(
          isUnderdog
            ? 'AGAINST ALL ODDS VICTORY! Massive prestige bonus gained!'
            : 'Tactical Victory secured!'
        );
      }

      // Check achievements
      const updatedAchievements = prev.achievements.map(ach => {
        if (ach.id === 'ach_against_all_odds' && isUnderdog) {
          return { ...ach, unlocked: true, unlockedDay: prev.day };
        }
        return ach;
      });

      return {
        ...prev,
        cash: isWin ? prev.cash + battle.rewardCash : prev.cash,
        reputation: isWin
          ? Math.min(100, prev.reputation + battle.rewardRep)
          : Math.max(0, prev.reputation - 6),
        prestige: isUnderdog ? Math.min(100, prev.prestige + 15) : prev.prestige,
        activeTacticalBattle: null,
        eventHistory: [
          {
            id: `battle_hist_${Date.now()}`,
            day: prev.day,
            title: `Battle Engagement: ${battle.battleName}`,
            description: `Engagement finished: ${battle.result}. Casualties - Friendly: ${battle.playerCasualties}, Hostile: ${battle.enemyCasualties}.`,
            type: isWin ? 'positive' : 'negative'
          },
          ...prev.eventHistory
        ],
        achievements: updatedAchievements,
        statistics: {
          ...prev.statistics,
          victories: isWin ? prev.statistics.victories + 1 : prev.statistics.victories,
          defeats: !isWin ? prev.statistics.defeats + 1 : prev.statistics.defeats,
          underdogVictories: isUnderdog
            ? prev.statistics.underdogVictories + 1
            : prev.statistics.underdogVictories,
          totalMoneyEarned: isWin
            ? prev.statistics.totalMoneyEarned + battle.rewardCash
            : prev.statistics.totalMoneyEarned
        }
      };
    });
  };

  // Event Choice Callback
  const handleEventChoice = (choiceIndex: number) => {
    setGameState(prev => {
      const currentEvent = prev.pendingEvents[0];
      if (!currentEvent) return prev;

      const choice = currentEvent.choices[choiceIndex];
      const partial = choice.execute(prev);

      return {
        ...prev,
        ...partial,
        pendingEvents: prev.pendingEvents.slice(1),
        isPaused: prev.pendingEvents.length > 1, // Keep paused if more events
        eventHistory: [
          {
            id: `evt_choice_${Date.now()}`,
            day: prev.day,
            title: `Directive Chosen: ${choice.text}`,
            description: choice.description,
            type: 'info'
          },
          ...prev.eventHistory
        ]
      };
    });
  };

  // New Game Start
  const handleStartNewGame = (params: any) => {
    const newState = createInitialGameState(params);
    setGameState(newState);
    saveGame(newState);
    setShowNewGameModal(false);
    triggerToast(`Welcome, Commander. Headquarters established in ${params.regionId.toUpperCase()}.`);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col antialiased">
      {/* Top Bar with HUD */}
      <TopBar
        state={gameState}
        onUpdateState={setGameState}
        onManualSave={handleManualSave}
        isAudioMuted={isAudioMuted}
        onToggleAudio={handleToggleAudio}
        onNewGameClick={() => setShowNewGameModal(true)}
      />

      {/* Main Navigation Bar */}
      <nav className="border-b border-neutral-800 bg-neutral-900/60 sticky top-12 z-30 backdrop-blur-md px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center overflow-x-auto no-scrollbar gap-1 py-1 font-mono text-xs">
          {[
            { id: 'dashboard', label: 'Command', icon: LayoutDashboard },
            { id: 'operations', label: 'Operations & Heists', icon: Crosshair },
            { id: 'arsenal', label: 'Armory Arsenal', icon: Shield },
            { id: 'market', label: 'Black Market & Ammo', icon: Package },
            { id: 'members', label: 'Crew & Personnel', icon: Users },
            { id: 'territory', label: 'Turf Map', icon: MapPin },
            { id: 'businesses', label: 'Front Businesses', icon: Briefcase },
            { id: 'factions', label: 'Syndicates', icon: HeartHandshake },
            { id: 'news', label: 'Press & Logs', icon: Radio },
            { id: 'statistics', label: 'Analytics', icon: BarChart3 },
            { id: 'achievements', label: 'Milestones', icon: Award }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = gameState.activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-neutral-950 text-amber-400 font-bold border-b-2 border-amber-500 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-neutral-900 border border-amber-500/80 text-neutral-100 px-4 py-2.5 rounded-lg shadow-2xl font-mono text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary Screen Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 pb-16">
        {gameState.activeTab === 'dashboard' && (
          <DashboardScreen state={gameState} onNavigate={handleTabChange} />
        )}
        {gameState.activeTab === 'operations' && (
          <OperationsScreen state={gameState} onUpdateState={setGameState} />
        )}
        {gameState.activeTab === 'arsenal' && (
          <ArsenalScreen state={gameState} onUpdateState={setGameState} />
        )}
        {gameState.activeTab === 'market' && (
          <MarketScreen state={gameState} onUpdateState={setGameState} />
        )}
        {gameState.activeTab === 'members' && (
          <MembersScreen state={gameState} onUpdateState={setGameState} />
        )}
        {gameState.activeTab === 'territory' && (
          <TerritoryScreen state={gameState} onUpdateState={setGameState} />
        )}
        {gameState.activeTab === 'businesses' && (
          <BusinessesScreen state={gameState} onUpdateState={setGameState} />
        )}
        {gameState.activeTab === 'factions' && (
          <FactionsScreen state={gameState} onUpdateState={setGameState} />
        )}
        {gameState.activeTab === 'news' && <NewsScreen state={gameState} />}
        {gameState.activeTab === 'statistics' && <StatisticsScreen state={gameState} />}
        {gameState.activeTab === 'achievements' && <AchievementsScreen state={gameState} />}
      </main>

      {/* Priority Modals */}
      {/* 1. Tactical Crisis Modal (Major Operations Complications) */}
      {gameState.activeCrisis && (
        <CrisisModal
          crisis={gameState.activeCrisis}
          state={gameState}
          onResolve={handleResolveCrisis}
        />
      )}

      {/* 2. Tactical Battle Simulator Modal */}
      {gameState.activeTacticalBattle && (
        <TacticalBattleModal
          battle={gameState.activeTacticalBattle}
          state={gameState}
          onFinishBattle={handleFinishBattle}
        />
      )}

      {/* 3. Dynamic Narrative Event Modal */}
      {gameState.pendingEvents.length > 0 && (
        <EventModal
          event={gameState.pendingEvents[0]}
          state={gameState}
          onChoiceSelect={handleEventChoice}
        />
      )}

      {/* 4. New Game Setup Modal */}
      {showNewGameModal && (
        <NewGameModal
          onStartGame={handleStartNewGame}
          onCancel={() => setShowNewGameModal(false)}
        />
      )}
    </div>
  );
}
