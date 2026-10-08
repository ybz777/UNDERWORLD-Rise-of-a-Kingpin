/**
 * Tactical Battle Simulator with Animated Combat Momentum
 * Handles skirmishes, turf conflicts, and underdog victories
 */

import { GameState, Member, TacticalBattleState, WeaponItem } from './types';
import { sounds } from './audio';
import { PHOTO_ASSETS } from './visuals';

export function createTacticalBattle(
  battleName: string,
  enemyName: string,
  enemyStrength: number,
  crewIds: string[],
  state: GameState,
  rewardCash: number = 25000,
  rewardRep: number = 18
): TacticalBattleState {
  const crew = state.members.filter(m => crewIds.includes(m.id));
  const crewWeapons = state.weapons.filter(w => crew.some(c => c.assignedWeaponId === w.id));

  // Compute player strength
  const avgCombat = crew.reduce((acc, c) => acc + c.combat, 0) / Math.max(1, crew.length);
  const avgNerves = crew.reduce((acc, c) => acc + c.nerves, 0) / Math.max(1, crew.length);
  const gearBonus = crewWeapons.reduce((acc, w) => acc + (w.damage + w.accuracy) * 0.25, 0) / Math.max(1, crew.length);
  const playerStrength = Math.round(avgCombat * 0.5 + avgNerves * 0.25 + gearBonus * 0.25);

  const ratio = playerStrength / (playerStrength + enemyStrength);
  const estimatedWinRate = Math.min(95, Math.max(5, Math.round(ratio * 100)));

  return {
    id: `battle_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    battleName,
    turn: 1,
    maxTurns: 6,
    playerStrength,
    enemyStrength,
    enemyName,
    momentum: 0,
    playerCasualties: 0,
    enemyCasualties: 0,
    currentTactic: 'Aggressive Assault',
    log: [
      `00:00 - Contact established. ${crew.length} syndicate operators deploy across perimeter against ${enemyName}.`,
      `00:15 - Initial recon confirms enemy combat power index: ${enemyStrength}. Estimated odds: ${estimatedWinRate}%.`
    ],
    isFinished: false,
    estimatedWinRate,
    crewIds,
    rewardCash,
    rewardRep,
    sceneImage: PHOTO_ASSETS.crisisStandoff
  };
}

export function advanceTacticalBattle(
  battle: TacticalBattleState,
  tactic: TacticalBattleState['currentTactic']
): TacticalBattleState {
  if (battle.isFinished) return battle;

  sounds.playShot();
  const nextTurn = battle.turn + 1;
  const newLog = [...battle.log];

  // Tactic modifiers
  let tacticMod = 0;
  if (tactic === 'Aggressive Assault') tacticMod = 12;
  else if (tactic === 'Defensive Fortification') tacticMod = 5;
  else if (tactic === 'Flank Maneuver') tacticMod = Math.random() > 0.4 ? 18 : -10;
  else if (tactic === 'Suppressing Fire') tacticMod = 8;
  else if (tactic === 'Tactical Withdrawal') tacticMod = -15;

  const roll = Math.floor(Math.random() * 40) - 20; // -20 to +20
  const turnScore = (battle.playerStrength - battle.enemyStrength) * 0.3 + tacticMod + roll;

  const newMomentum = Math.min(100, Math.max(-100, battle.momentum + Math.round(turnScore)));

  // Generate tactical log snippet
  const timeStamp = `0${nextTurn - 1}:${Math.floor(Math.random() * 40 + 10)}`;
  if (turnScore > 10) {
    battle.enemyCasualties += Math.floor(Math.random() * 2) + 1;
    newLog.push(`${timeStamp} - [${tactic}] Line breakthrough! Concentrated fire collapses hostile vanguard flank.`);
  } else if (turnScore < -10) {
    battle.playerCasualties += Math.floor(Math.random() * 2);
    newLog.push(`${timeStamp} - [${tactic}] Heavy incoming counter-suppression forces your team to take hard cover.`);
  } else {
    newLog.push(`${timeStamp} - [${tactic}] Intense rifle exchange across barricades; neither line yields ground.`);
  }

  // Check end conditions
  let isFinished = false;
  let result: TacticalBattleState['result'] = undefined;

  if (newMomentum >= 65 || (nextTurn > battle.maxTurns && newMomentum > 15)) {
    isFinished = true;
    if (battle.estimatedWinRate <= 30) {
      result = 'Underdog Victory';
      sounds.playVictory();
      newLog.push(`0${battle.maxTurns}:00 - AGAINST ALL ODDS! Hostile forces break into full retreat before your superior determination!`);
    } else {
      result = 'Victory';
      sounds.playVictory();
      newLog.push(`0${battle.maxTurns}:00 - Hostile command signals general retreat. Victory secured!`);
    }
  } else if (newMomentum <= -65 || (nextTurn > battle.maxTurns && newMomentum < -15)) {
    isFinished = true;
    result = 'Defeat';
    sounds.playFailure();
    newLog.push(`0${battle.maxTurns}:00 - Defensive perimeter compromised. Team forced into emergency tactical retreat.`);
  } else if (nextTurn > battle.maxTurns) {
    isFinished = true;
    result = 'Stalemate';
    newLog.push(`0${battle.maxTurns}:00 - Ammunition running dry on both fronts. Standoff concluded with mutual withdrawal.`);
  }

  return {
    ...battle,
    turn: nextTurn,
    momentum: newMomentum,
    currentTactic: tactic,
    log: newLog,
    isFinished,
    result
  };
}
