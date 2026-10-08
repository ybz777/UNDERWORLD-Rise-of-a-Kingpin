/**
 * Major Operations & Crisis Engine
 * Implements Atom RPG-inspired character checks:
 * CHARACTER STATS + TEAM COMPOSITION + EQUIPMENT + SITUATION + CONTROLLED RANDOMNESS = OUTCOME
 */

import {
  Contract,
  CrisisResolutionResult,
  CrisisState,
  GameState,
  Member,
  OutcomeTier,
  StrategicCrisisOption,
  WeaponItem
} from './types';
import { sounds } from './audio';
import { PHOTO_ASSETS, getOperationScene } from './visuals';

export interface OperationTeamEvaluation {
  avgCombat: number;
  avgAccuracy: number;
  avgStealth: number;
  avgIntelligence: number;
  maxLeadership: number;
  maxCharisma: number;
  avgNerves: number;
  avgMorale: number;
  teamCohesion: number;
  equipmentRating: number;
  injuredCount: number;
  totalTeamPower: number;
}

/**
 * Evaluates the chosen team's collective stats and equipment capabilities
 */
export function evaluateTeam(members: Member[], weapons: WeaponItem[]): OperationTeamEvaluation {
  if (members.length === 0) {
    return {
      avgCombat: 10,
      avgAccuracy: 10,
      avgStealth: 10,
      avgIntelligence: 10,
      maxLeadership: 10,
      maxCharisma: 10,
      avgNerves: 10,
      avgMorale: 10,
      teamCohesion: 10,
      equipmentRating: 10,
      injuredCount: 0,
      totalTeamPower: 10
    };
  }

  const count = members.length;
  const avgCombat = Math.round(members.reduce((acc, m) => acc + m.combat, 0) / count);
  const avgAccuracy = Math.round(members.reduce((acc, m) => acc + m.accuracy, 0) / count);
  const avgStealth = Math.round(members.reduce((acc, m) => acc + m.stealth, 0) / count);
  const avgIntelligence = Math.round(members.reduce((acc, m) => acc + m.intelligence, 0) / count);
  const maxLeadership = Math.max(...members.map(m => m.leadership));
  const maxCharisma = Math.max(...members.map(m => m.charisma));
  const avgNerves = Math.round(members.reduce((acc, m) => acc + m.nerves, 0) / count);
  const avgMorale = Math.round(members.reduce((acc, m) => acc + m.morale, 0) / count);
  const injuredCount = members.filter(m => m.status === 'Injured' || m.status === 'Critical').length;

  // Team cohesion increases with average loyalty, discipline, and count synergy
  const avgLoyalty = members.reduce((acc, m) => acc + m.loyalty, 0) / count;
  const avgDiscipline = members.reduce((acc, m) => acc + m.discipline, 0) / count;
  const teamCohesion = Math.round((avgLoyalty * 0.5 + avgDiscipline * 0.5) * (injuredCount > 0 ? 0.75 : 1.0));

  // Equipment scoring based on assigned weapons' condition, damage, and reliability
  let gearSum = 0;
  members.forEach(m => {
    const w = weapons.find(w => w.id === m.assignedWeaponId);
    if (w) {
      const wScore = (w.damage * 0.4 + w.accuracy * 0.3 + w.reliability * 0.3) * (w.condition / 100);
      gearSum += wScore;
    } else {
      gearSum += 20; // Unarmed or makeshift piece
    }
  });
  const equipmentRating = Math.round(gearSum / count);

  const totalTeamPower = Math.round(
    avgCombat * 0.25 +
    avgStealth * 0.15 +
    avgIntelligence * 0.15 +
    maxLeadership * 0.15 +
    avgNerves * 0.15 +
    equipmentRating * 0.15
  );

  return {
    avgCombat,
    avgAccuracy,
    avgStealth,
    avgIntelligence,
    maxLeadership,
    maxCharisma,
    avgNerves,
    avgMorale,
    teamCohesion,
    equipmentRating,
    injuredCount,
    totalTeamPower
  };
}

/**
 * Generates strategic crisis options with calculated success odds
 */
export function buildStrategicOptions(
  teamEval: OperationTeamEvaluation,
  leaderCharisma: number,
  leaderLeadership: number,
  enemyStrength: number,
  policePressure: number,
  terrain: string
): StrategicCrisisOption[] {
  // ESCAPE: heavily relies on Stealth, Intelligence, Driver/Scout presence, Nerves
  const terrainEscapeMod = terrain.includes('Industrial') || terrain.includes('Alley') ? 10 : terrain.includes('Open') ? -12 : 0;
  const rawEscapeChance = Math.round(
    (teamEval.avgStealth * 0.35 +
     teamEval.avgIntelligence * 0.25 +
     teamEval.avgNerves * 0.2 +
     teamEval.equipmentRating * 0.1 +
     terrainEscapeMod) -
    (enemyStrength * 0.35 + policePressure * 0.25)
  );
  const escapeRate = Math.min(92, Math.max(12, rawEscapeChance + 30));

  // HOLD POSITION & FORTIFY: relies on Combat, Heavy weapons, Nerves, Leadership
  const rawHoldChance = Math.round(
    (teamEval.avgCombat * 0.35 +
     teamEval.equipmentRating * 0.3 +
     teamEval.maxLeadership * 0.15 +
     teamEval.avgNerves * 0.2) -
    (enemyStrength * 0.45 + policePressure * 0.15)
  );
  const holdRate = Math.min(88, Math.max(15, rawHoldChance + 25));

  // NEGOTIATE / HOSTAGE BARGAIN: relies heavily on Charisma, Leader, Intelligence
  const effectiveCharisma = Math.max(teamEval.maxCharisma, leaderCharisma);
  const effectiveLeadership = Math.max(teamEval.maxLeadership, leaderLeadership);
  const rawNegChance = Math.round(
    (effectiveCharisma * 0.5 +
     effectiveLeadership * 0.25 +
     teamEval.avgIntelligence * 0.25) -
    (enemyStrength * 0.2 + policePressure * 0.35)
  );
  const negRate = Math.min(90, Math.max(10, rawNegChance + 25));

  // TACTICAL COUNTER-AMBUSH / FLANK: High risk, high reward. Relies on Combat & Accuracy & Leadership
  const rawCounterChance = Math.round(
    (teamEval.avgCombat * 0.4 +
     teamEval.avgAccuracy * 0.25 +
     teamEval.equipmentRating * 0.2 +
     teamEval.teamCohesion * 0.15) -
    (enemyStrength * 0.55 + policePressure * 0.2)
  );
  const counterRate = Math.min(85, Math.max(8, rawCounterChance + 20));

  // ABORT & SCATTER: Drops loot to ensure survival.
  const rawAbortChance = Math.round(
    (teamEval.avgStealth * 0.3 + teamEval.avgNerves * 0.3 + teamEval.teamCohesion * 0.3) -
    (policePressure * 0.25)
  );
  const abortRate = Math.min(95, Math.max(30, rawAbortChance + 35));

  return [
    {
      id: 'opt_escape',
      name: 'ATTEMPT TO ESCAPE',
      actionType: 'ESCAPE',
      description: 'Break contact through smoke, blind spots, and coordinated extraction maneuvers. Keeps retrieved loot but risks crossfire.',
      estimatedSuccessRate: escapeRate,
      potentialReward: 'Very High',
      potentialLoss: 'Severe',
      primaryStatTested: 'Stealth'
    },
    {
      id: 'opt_counter',
      name: 'TACTICAL COUNTER-AMBUSH',
      actionType: 'COUNTER_ATTACK',
      description: 'Mount an aggressive suppressing counter-strike to shatter the encirclement. Maximum casualties on both sides; unlocks legendary prestige.',
      estimatedSuccessRate: counterRate,
      potentialReward: 'Exceptional',
      potentialLoss: 'Catastrophic',
      primaryStatTested: 'Combat'
    },
    {
      id: 'opt_hold',
      name: 'HOLD POSITION & FORTIFY',
      actionType: 'HOLD',
      description: 'Barricade entrances and establish interlocking fields of fire until backup arrives or the cordon falters under ammunition exhaustion.',
      estimatedSuccessRate: holdRate,
      potentialReward: 'High',
      potentialLoss: 'Severe',
      primaryStatTested: 'Combat'
    },
    {
      id: 'opt_negotiate',
      name: 'NEGOTIATE / HOSTAGE BARGAIN',
      actionType: 'NEGOTIATE',
      description: 'Use diplomatic leverage, extortion dossiers, or hostage bargaining to broker a tense ceasefire and safe corridor.',
      estimatedSuccessRate: negRate,
      potentialReward: 'Moderate',
      potentialLoss: 'Moderate',
      primaryStatTested: 'Charisma'
    },
    {
      id: 'opt_abort',
      name: 'ABORT & SCATTER CREW',
      actionType: 'ABORT',
      description: 'Dump heavy crates and contraband, split up across secondary escape routes. Minimizes physical injury at the cost of morale and operation payout.',
      estimatedSuccessRate: abortRate,
      potentialReward: 'None',
      potentialLoss: 'Minimal',
      primaryStatTested: 'Nerves'
    },
    {
      id: 'opt_surrender',
      name: 'SURRENDER & LAWYER UP',
      actionType: 'SURRENDER',
      description: 'Instruct the crew to lay down arms peacefully. Zero fatalities; however, members will be incarcerated, bail costs will mount, and weapons will be seized.',
      estimatedSuccessRate: 99,
      potentialReward: 'None',
      potentialLoss: 'Moderate',
      primaryStatTested: 'Leadership'
    }
  ];
}

/**
 * Triggers a crisis scenario if an operation goes wrong
 */
export function createCrisisScenario(
  operation: Contract,
  crewIds: string[],
  state: GameState,
  stage: number = 2,
  vehicleId?: string | null
): CrisisState {
  const teamMembers = state.members.filter(m => crewIds.includes(m.id));
  const teamEval = evaluateTeam(teamMembers, state.weapons);

  const scenarios = [
    {
      title: 'POLICE HAVE SURROUNDED YOUR TEAM',
      description: 'Siren wails cut through the night. Tactical SWAT cruisers and municipal interceptors have sealed all road intersections around the target facility. Spotlights illuminate the building exits.',
      severity: 'Critical' as const,
      terrain: 'Urban Banking District & Narrow Alleys',
      enemyBase: 65 + Math.floor(state.policePressure * 0.25)
    },
    {
      title: 'RIVAL SYNDICATE HEAVY AMBUSH',
      description: 'A rival cartel tipped off by local informants has deployed twin armored vans at your extraction chokepoint. Armed enforcers with automatic weapons have established elevated rooftop crossfire.',
      severity: 'Severe' as const,
      terrain: 'Industrial Freight Yards & Shipping Containers',
      enemyBase: 60 + Math.floor(state.reputation * 0.2)
    },
    {
      title: 'INTERNAL LOCKDOWN & INSIDER BETRAYAL',
      description: 'The inside contact has tripped the automated security magnetic blast doors and radioed private corporate security contractors. The crew is trapped inside the inner security vault.',
      severity: 'Extreme' as const,
      terrain: 'Reinforced Subterranean Concrete Vault Complex',
      enemyBase: 70 + Math.floor(operation.repReward * 0.5)
    },
    {
      title: 'FEDERAL TACTICAL TASK FORCE INTERCEPT',
      description: 'A heavily armored federal task force was conducting surveillance and launched a coordinated tactical breach just as your team breached the primary objective.',
      severity: 'Extreme' as const,
      terrain: 'Corporate High-Rise Penthouse Corridor',
      enemyBase: 75 + Math.floor(state.wantedLevel * 0.3)
    }
  ];

  const chosenScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  const enemyStrength = chosenScenario.enemyBase;

  const options = buildStrategicOptions(
    teamEval,
    state.leader.charisma,
    state.leader.leadership,
    enemyStrength,
    state.policePressure,
    chosenScenario.terrain
  );

  const sceneImage = getOperationScene(operation.locationType || 'Warehouse', true, false);

  return {
    id: `crisis_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    operationId: operation.id,
    operationTitle: operation.title,
    situationTitle: chosenScenario.title,
    situationDescription: chosenScenario.description,
    severity: chosenScenario.severity,
    crewMemberIds: crewIds,
    vehicleId,
    enemyStrength,
    policePressure: state.policePressure,
    terrain: chosenScenario.terrain,
    preparationLevel: state.leader.planning,
    availableOptions: options,
    stageNumber: stage,
    maxStages: 3,
    initialReward: operation.rewardCash,
    sceneImage
  };
}

/**
 * Resolves the chosen crisis decision using the Atom RPG-inspired formula
 */
export function resolveCrisisDecision(
  crisis: CrisisState,
  option: StrategicCrisisOption,
  state: GameState
): CrisisResolutionResult {
  const teamMembers = state.members.filter(m => crisis.crewMemberIds.includes(m.id));
  const teamEval = evaluateTeam(teamMembers, state.weapons);

  // Atom RPG check components:
  // Base stat relevant to option
  let primaryScore = 50;
  if (option.primaryStatTested === 'Stealth') {
    primaryScore = teamEval.avgStealth * 0.6 + teamEval.avgIntelligence * 0.4;
  } else if (option.primaryStatTested === 'Combat') {
    primaryScore = teamEval.avgCombat * 0.6 + teamEval.avgAccuracy * 0.4;
  } else if (option.primaryStatTested === 'Charisma') {
    primaryScore = Math.max(teamEval.maxCharisma, state.leader.charisma) * 0.7 + state.leader.negotiation * 0.3;
  } else if (option.primaryStatTested === 'Leadership') {
    primaryScore = Math.max(teamEval.maxLeadership, state.leader.leadership) * 0.7 + teamEval.teamCohesion * 0.3;
  } else if (option.primaryStatTested === 'Nerves') {
    primaryScore = teamEval.avgNerves * 0.7 + teamEval.avgMorale * 0.3;
  }

  // Equipment impact
  const equipmentMod = (teamEval.equipmentRating - 50) * 0.3;

  // Situation penalties
  const policePenalty = crisis.policePressure * 0.2;
  const enemyPenalty = (crisis.enemyStrength - 50) * 0.25;
  const terrainMod = crisis.terrain.includes('Alley') || crisis.terrain.includes('Container') ? 5 : -5;
  const prepMod = (crisis.preparationLevel - 50) * 0.2;

  // Controlled randomness: roll d100 with slight Gaussian center
  const roll1 = Math.floor(Math.random() * 50) + 1;
  const roll2 = Math.floor(Math.random() * 50) + 1;
  const controlledRoll = roll1 + roll2; // 2 to 100 bell curve

  const effectiveRating = Math.round(
    primaryScore +
    equipmentMod +
    prepMod +
    terrainMod -
    policePenalty -
    enemyPenalty
  );

  // Target DC based on estimated success rate:
  // e.g. if estimated success rate is 64%, target DC is ~36 on a 1-100 scale.
  const targetDC = 100 - option.estimatedSuccessRate;
  const delta = controlledRoll - targetDC;

  // Determine Tier:
  let tier: OutcomeTier = 'Success';
  if (option.actionType === 'SURRENDER') {
    tier = 'Partial Success';
  } else if (controlledRoll >= 96 || delta >= 32) {
    tier = 'Critical Success';
  } else if (delta >= 18) {
    tier = 'Major Success';
  } else if (delta >= 4) {
    tier = 'Success';
  } else if (delta >= -8) {
    tier = 'Partial Success';
  } else if (delta >= -24) {
    tier = 'Failure';
  } else if (delta >= -36) {
    tier = 'Major Failure';
  } else {
    tier = 'Critical Failure';
  }

  // Narrative summary based on action and tier
  let narrative = '';
  let cashGained = 0;
  let repDelta = 0;
  let prestigeDelta = 0;
  let wantedDelta = 0;
  let policePressureDelta = 0;

  if (option.actionType === 'SURRENDER') {
    narrative = `The team signaled an orderly surrender. Municipal authorities seized their active weapons and booked the operators into the central precinct. Nobody was killed, but your organization suffers an immediate reputation hit while bail proceedings initiate.`;
    cashGained = 0;
    repDelta = -12;
    prestigeDelta = -8;
    wantedDelta = -10;
    policePressureDelta = -20;
  } else if (option.actionType === 'ESCAPE') {
    if (tier === 'Critical Success') {
      narrative = `FLAWLESS BREAKOUT: Leveraging silent reconnaissance and tactical smoke, the team completely outmaneuvered the cordon. They slipped through underground rail conduits with 100% of the target plunder without firing a single tracked shot.`;
      cashGained = crisis.initialReward * 1.25;
      repDelta = 24;
      prestigeDelta = 16;
      wantedDelta = 8;
      policePressureDelta = 5;
    } else if (tier === 'Major Success' || tier === 'Success') {
      narrative = `CLEAN EXTRACTION: Under cover of diversionary charges and expert driving, the crew broke the outer perimeter. Minor shrapnel wounds sustained, but the full haul was brought back to base.`;
      cashGained = crisis.initialReward;
      repDelta = 18;
      prestigeDelta = 10;
      wantedDelta = 14;
      policePressureDelta = 12;
    } else if (tier === 'Partial Success') {
      narrative = `NARROW ESCAPE WITH LOSSES: The team rammed through a police roadblock. Several tires were shredded and part of the cash crate had to be abandoned to lighten weight, but all members escaped alive with moderate wounds.`;
      cashGained = Math.round(crisis.initialReward * 0.5);
      repDelta = 6;
      prestigeDelta = 2;
      wantedDelta = 18;
      policePressureDelta = 16;
    } else {
      narrative = `FAILED ESCAPE AMBUSH: The getaway vehicle was pinned in a crossfire alleyway. Operatives sustained severe gunshot trauma before barely dragging themselves into the storm drains. The plunder was lost to authorities.`;
      cashGained = 0;
      repDelta = -14;
      prestigeDelta = -10;
      wantedDelta = 25;
      policePressureDelta = 25;
    }
  } else if (option.actionType === 'COUNTER_ATTACK') {
    if (tier === 'Critical Success' || tier === 'Major Success') {
      narrative = `LEGENDARY BREAKTHROUGH: Your operators launched a ferocious counter-ambush! Concentrated automatic rifle fire shattered the enemy cordon, forcing the opposing commanders to route in disarray. Loot secured plus battlefield weaponry recovered!`;
      cashGained = crisis.initialReward * 1.4;
      repDelta = 35;
      prestigeDelta = 28;
      wantedDelta = 22;
      policePressureDelta = 20;
    } else if (tier === 'Success') {
      narrative = `TACTICAL VICTORY: High-intensity firefight resulting in enemy suppression. The perimeter was ruptured and the extraction succeeded under heavy smoke.`;
      cashGained = crisis.initialReward;
      repDelta = 20;
      prestigeDelta = 15;
      wantedDelta = 24;
      policePressureDelta = 22;
    } else if (tier === 'Partial Success') {
      narrative = `PYRRHIC BREAKOUT: Heavy close-quarters combat enabled extraction, but multiple crew members sustained critical bullet wounds and weapon receivers overheated.`;
      cashGained = Math.round(crisis.initialReward * 0.6);
      repDelta = 8;
      prestigeDelta = 5;
      wantedDelta = 30;
      policePressureDelta = 28;
    } else {
      narrative = `OVERWHELMED BY SUPERIOR FIREPOWER: The counter-strike was met with heavy machine gun and sniper fire. Several operators collapsed in critical condition and had to be pulled into the sewers empty-handed.`;
      cashGained = 0;
      repDelta = -20;
      prestigeDelta = -15;
      wantedDelta = 32;
      policePressureDelta = 32;
    }
  } else if (option.actionType === 'HOLD') {
    if (tier === 'Critical Success' || tier === 'Major Success') {
      narrative = `UNBREAKABLE FORTIFICATION: The crew maintained ironclad defensive sectors. Enemy assault waves were repelled repeatedly until SWAT exhausted tactical patience and withdrew to regroup.`;
      cashGained = crisis.initialReward;
      repDelta = 22;
      prestigeDelta = 18;
      wantedDelta = 16;
      policePressureDelta = 10;
    } else if (tier === 'Success') {
      narrative = `SIEGE WEATHERED: The defensive perimeter held long enough for dusk fog to conceal an orderly exfiltration route.`;
      cashGained = crisis.initialReward * 0.85;
      repDelta = 14;
      prestigeDelta = 10;
      wantedDelta = 18;
      policePressureDelta = 14;
    } else {
      narrative = `BARRICADES BREACHED: Flashbangs and tear gas breached the fortified perimeter. Team was forced to scatter in panic through sewers, sustaining severe injuries and ditching weapons.`;
      cashGained = 0;
      repDelta = -15;
      prestigeDelta = -10;
      wantedDelta = 28;
      policePressureDelta = 25;
    }
  } else if (option.actionType === 'NEGOTIATE') {
    if (tier === 'Critical Success' || tier === 'Major Success') {
      narrative = `MASTERFUL STANDOFF RESOLUTION: Utilizing high-level political blackmail and composed negotiation, a peaceful corridor was guaranteed. Not a single shot was fired, and a secret portion of the prize was retained.`;
      cashGained = crisis.initialReward * 0.8;
      repDelta = 16;
      prestigeDelta = 25;
      wantedDelta = -5;
      policePressureDelta = -15;
    } else if (tier === 'Success' || tier === 'Partial Success') {
      narrative = `TENSE CEASEFIRE BROKERED: After tense radio discussions and a cash guarantee, authorities allowed an unmolested extraction in exchange for handing over minor evidence.`;
      cashGained = crisis.initialReward * 0.45;
      repDelta = 8;
      prestigeDelta = 14;
      wantedDelta = 5;
      policePressureDelta = -5;
    } else {
      narrative = `NEGOTIATIONS COLLAPSED: Tactical commanders refused terms and launched an immediate tear gas breach during dialogue, catching the crew with their guards down.`;
      cashGained = 0;
      repDelta = -12;
      prestigeDelta = -8;
      wantedDelta = 22;
      policePressureDelta = 20;
    }
  } else { // ABORT
    narrative = `DISCIPLINED RETREAT: Operatives abandoned the heavy cargo crates and dispersed individually into civilian crowds. Zero casualties sustained, though the operation yields zero cash.`;
    cashGained = 0;
    repDelta = -4;
    prestigeDelta = -2;
    wantedDelta = 4;
    policePressureDelta = 2;
  }

  // Calculate member status updates based on tier and option
  const memberUpdates = teamMembers.map(m => {
    let healthDamage = 0;
    let moraleDelta = 0;
    let loyaltyDelta = 0;
    let newStatus = m.status;

    if (tier === 'Critical Success') {
      healthDamage = Math.floor(Math.random() * 8);
      moraleDelta = 18;
      loyaltyDelta = 10;
    } else if (tier === 'Major Success') {
      healthDamage = Math.floor(Math.random() * 15);
      moraleDelta = 12;
      loyaltyDelta = 6;
    } else if (tier === 'Success') {
      healthDamage = 10 + Math.floor(Math.random() * 18);
      moraleDelta = 8;
      loyaltyDelta = 4;
    } else if (tier === 'Partial Success') {
      healthDamage = 22 + Math.floor(Math.random() * 25);
      moraleDelta = -2;
      loyaltyDelta = 0;
      if (m.health - healthDamage < 50) newStatus = 'Injured';
    } else if (tier === 'Failure') {
      healthDamage = 35 + Math.floor(Math.random() * 30);
      moraleDelta = -14;
      loyaltyDelta = -6;
      newStatus = 'Injured';
    } else if (tier === 'Major Failure') {
      healthDamage = 50 + Math.floor(Math.random() * 35);
      moraleDelta = -22;
      loyaltyDelta = -12;
      newStatus = 'Critical';
    } else { // Critical Failure
      healthDamage = 70 + Math.floor(Math.random() * 30);
      moraleDelta = -30;
      loyaltyDelta = -18;
      newStatus = Math.random() < 0.25 ? 'Dead' : 'Critical';
    }

    return {
      memberId: m.id,
      healthDamage,
      newStatus,
      moraleDelta,
      loyaltyDelta
    };
  });

  // Calculate weapon wear and possible losses
  const weaponUpdates = teamMembers
    .filter(m => m.assignedWeaponId !== null)
    .map(m => {
      const wear = tier === 'Critical Success' ? 4 : tier === 'Success' ? 8 : 16;
      const lost = tier === 'Critical Failure' && Math.random() < 0.4;
      return {
        weaponId: m.assignedWeaponId!,
        wear,
        lost
      };
    });

  // Vehicle modifier if vehicle was deployed
  const vehicle = crisis.vehicleId ? state.vehicles.find(v => v.id === crisis.vehicleId) : null;
  const vehicleBonus = vehicle ? Math.round((vehicle.speed * 0.1) + (vehicle.armorRating * 0.1)) : 0;

  // Sound triggering
  if (tier === 'Critical Success' || tier === 'Major Success' || tier === 'Success') {
    sounds.playVictory();
  } else if (tier === 'Critical Failure' || tier === 'Major Failure') {
    sounds.playFailure();
  } else {
    sounds.playShot();
  }

  const isSuccessTier = tier === 'Critical Success' || tier === 'Major Success' || tier === 'Success';
  const outcomeImage = isSuccessTier ? PHOTO_ASSETS.cityBanner : PHOTO_ASSETS.crisisStandoff;

  return {
    tier,
    optionChosen: option,
    rollScore: controlledRoll,
    successRate: option.estimatedSuccessRate,
    narrativeSummary: narrative,
    outcomeImage,
    calculationsBreakdown: {
      teamCombat: teamEval.avgCombat,
      teamStealth: teamEval.avgStealth,
      teamIntelligence: teamEval.avgIntelligence,
      teamCharisma: teamEval.maxCharisma,
      teamLeadership: teamEval.maxLeadership,
      equipmentScore: teamEval.equipmentRating,
      vehicleBonus,
      policePressurePenalty: Math.round(policePenalty),
      terrainModifier: terrainMod,
      controlledRandomness: controlledRoll,
      finalRating: effectiveRating
    },
    consequences: {
      cashGained,
      repDelta,
      prestigeDelta,
      wantedDelta,
      policePressureDelta,
      memberUpdates,
      weaponUpdates,
      vehicleWear: vehicle ? (isSuccessTier ? 4 : 12) : 0
    }
  };
}
