/**
 * Core type definitions for Underworld: Rise of a Kingpin (Expanded Edition)
 */

export type AlertnessLevel = 'NORMAL' | 'CAUTIOUS' | 'HIGH ALERT' | 'LOCKDOWN';

export type OrganizationStyle = 
  | 'Street Gang'
  | 'Organized Crime Syndicate'
  | 'Smuggling / Black Market Organization'
  | 'Semi-Military Organization'
  | 'Private Security / Contract Organization'
  | 'Political Power Broker'
  | 'Hybrid Organization';

export type AmmoType = 
  | '9mm_parabellum'
  | '7.62x39mm_soviet'
  | '5.56x45mm_nato'
  | '308_winchester'
  | '12_gauge'
  | '50_bmg'
  | '45_acp'
  | '357_magnum'
  | '40mm_grenade';

export type WeaponCategory = 
  | 'Pistols'
  | 'Revolvers'
  | 'SMGs'
  | 'Assault Carbines'
  | 'Assault Rifles'
  | 'Battle Rifles'
  | 'Designated Marksman'
  | 'Sniper Rifles'
  | 'Shotguns'
  | 'Machine Guns'
  | 'Special Weapons'
  | 'Melee Weapons';

export type WeaponRarity = 
  | 'Common'
  | 'Uncommon'
  | 'Rare'
  | 'Very Rare'
  | 'Elite'
  | 'Legendary';

export interface LeaderProfile {
  name: string;
  organizationName: string;
  portrait: string;
  bannerColor: string;
  accentColor: string;
  emblem: string; // e.g. 'crown', 'wolf', 'skull', 'dagger', 'eagle', 'crosshair', 'dragon'
  motto: string;
  charisma: number;      // 1-100 (Recruitment, negotiations, loyalty, interrogation resistance)
  leadership: number;    // 1-100 (Team cohesion, crisis command, morale)
  intelligence: number;  // 1-100 (Recon, planning, escape evasion)
  combat: number;        // 1-100 (Direct firefight expertise)
  negotiation: number;   // 1-100 (Business margins, hostage & police bribes)
  planning: number;      // 1-100 (Operation preparedness, contingency buffer)
  reputation: number;    // Underworld notoriety
  prestige: number;      // High-society / power respect
  traits: {
    mercy: number;        // 0-100
    aggression: number;   // 0-100
    loyalty: number;      // 0-100
    riskTolerance: number;// 0-100
    discipline: number;   // 0-100
  };
}

export type MemberRole =
  | 'Street Enforcer'
  | 'Rifleman'
  | 'Veteran'
  | 'Bodyguard'
  | 'Driver'
  | 'Medic'
  | 'Scout'
  | 'Manager'
  | 'Negotiator'
  | 'Smuggler'
  | 'Mechanic'
  | 'Accountant'
  | 'Fixer'
  | 'Strategist'
  | 'Intelligence Specialist'
  | 'Business Manager';

export type MemberHealthStatus = 'Healthy' | 'Injured' | 'Critical' | 'Dead';

export type PersonalityTrait =
  | 'Loyal'
  | 'Greedy'
  | 'Ambitious'
  | 'Cowardly'
  | 'Brave'
  | 'Professional'
  | 'Unstable'
  | 'Charismatic'
  | 'Aggressive'
  | 'Cautious'
  | 'Opportunistic';

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  tier: number;
  unlocked: boolean;
  statBoosts?: {
    combat?: number;
    stealth?: number;
    intelligence?: number;
    nerves?: number;
    charisma?: number;
    leadership?: number;
  };
  specialEffect?: string;
}

export interface Member {
  id: string;
  name: string;
  age: number;
  role: MemberRole;
  level: number;
  combat: number;          // 1-100
  accuracy: number;        // 1-100
  stealth: number;         // 1-100
  intelligence: number;    // 1-100
  leadership: number;      // 1-100
  charisma: number;        // 1-100
  nerves: number;          // 1-100 (panic resistance)
  loyalty: number;         // 1-100
  morale: number;          // 1-100
  discipline: number;      // 1-100
  ambition: number;        // 1-100
  greed: number;           // 1-100
  personality: PersonalityTrait;
  specialization: string;
  skillTree: SkillNode[];
  skillPointsAvailable: number;
  salary: number;          // Daily salary
  health: number;          // 0-100
  maxHealth: number;
  status: MemberHealthStatus;
  injuryDaysRemaining: number;
  experience: number;
  experienceToNextLevel: number;
  operationsCount: number;
  successesCount: number;
  failuresCount: number;
  assignedWeaponId: string | null;
  assignedMeleeId: string | null;
  relationshipWithLeader: number; // -100 to 100
  hiredDay: number;
  portrait: string;
}

export interface WeaponItem {
  id: string;              // Unique serial like #AK-1842
  model: string;           // E.g. "Vityaz-9", "Sturmgewehr 58", "AS Val Special"
  category: WeaponCategory;
  rarity: WeaponRarity;
  condition: number;       // 0-100%
  reliability: number;     // 1-100
  accuracy: number;        // 1-100
  damage: number;          // 1-100
  range: number;           // meters
  handling: number;        // 1-100
  weight: number;          // kg
  magCapacity: number;     // rounds (0 for melee)
  ammoType: AmmoType | 'none';
  value: number;           // Dollar value
  roundsFired: number;
  deployments: number;
  kills: number;
  repairs: number;
  assignedMemberId: string | null;
  origin: string;
  acquisitionDateDay: number;
  isVeteranWeapon: boolean;
  image: string;
}

export interface WeaponMarketItem {
  id: string;
  model: string;
  category: WeaponCategory;
  rarity: WeaponRarity;
  ammoType: AmmoType | 'none';
  damage: number;
  accuracy: number;
  reliability: number;
  condition: number;
  price: number;
  source: 'Military Surplus' | 'Commercial Dealer' | 'Collector Market' | 'Underground Syndicate' | 'Recovered Shipment';
  supply: number;
  discountPercent: number; // e.g. -15 or +20
  description: string;
  image: string;
}

export type VehicleCategory = 
  | 'Sedan'
  | 'SUV'
  | 'Pickup Truck'
  | 'Van'
  | 'Armored Vehicle'
  | 'Motorcycle'
  | 'Heavy Commercial';

export interface Vehicle {
  id: string;
  name: string;
  category: VehicleCategory;
  image: string;
  condition: number;        // 0-100%
  passengerCapacity: number;
  cargoCapacity: number;    // kg
  speed: number;            // 1-100
  reliability: number;      // 1-100
  armorRating: number;      // 1-100
  dailyOperatingCost: number;
  purchaseCost: number;
  resaleValue: number;
  assignedOperationId: string | null;
  isOwned: boolean;
}

export interface Business {
  id: string;
  name: string;
  type: string;
  tier: number;
  purchaseCost: number;
  dailyIncome: number;
  dailyExpense: number;
  employeeCount: number;
  managerMemberId: string | null;
  risk: number;            // 0-100
  heatReduction: number;  // Legal cover
  isOwned: boolean;
  reputationRequired: number;
  regionId: string;
  image: string;
}

export interface Territory {
  id: string;
  name: string;
  regionId: string;
  type: 'City Center' | 'Port District' | 'Industrial Zone' | 'Warehouse Row' | 'Market Quarter' | 'Border Checkpoint' | 'Underground Slums';
  population: number;
  dailyRevenue: number;
  policePresence: number;  // 0-100
  controllingFactionId: string | null; // null if player
  playerInfluence: number; // 0-100
  strategicValue: number;  // 1-100
  economicValue: number;   // 1-100
  fortificationLevel: number;
  isContested: boolean;
  image: string;
}

export interface Faction {
  id: string;
  name: string;
  leader: string;
  ideology: string;
  cash: number;
  reputation: number;
  prestige: number;
  territoryIds: string[];
  militaryPower: number;
  economicPower: number;
  politicalInfluence: number;
  relationWithPlayer: number; // -100 to 100
  color: string;
  personality: 'Aggressive' | 'Diplomatic' | 'Mercenary' | 'Cautious' | 'Fanatical' | 'Commercial';
  image: string;
}

export interface Contract {
  id: string;
  title: string;
  client: string;
  category: 'Security' | 'Recovery' | 'Armed Conflict' | 'High-Risk Robbery' | 'Transportation' | 'Negotiation' | 'Territory Defense' | 'Intelligence';
  description: string;
  rewardCash: number;
  difficulty: 'Low' | 'Medium' | 'High' | 'Extreme' | 'Legendary';
  riskLevel: 'Low' | 'Medium' | 'High' | 'Severe' | 'Lethal';
  isMajorOperation: boolean; // Triggers multi-stage and potential crisis!
  repReward: number;
  repPenalty: number;
  relationImpact: { factionId: string; change: number }[];
  wantedGain: number;
  ammoRequired: { type: AmmoType; amount: number };
  minCrew: number;
  maxCrew: number;
  timeLimitDays: number;
  daysRemaining: number;
  locationType: 'Bank' | 'Warehouse' | 'Port' | 'Nightclub' | 'Highrise' | 'Convoy' | 'Border';
  image: string;
  sceneImage?: string;
}

export type OutcomeTier =
  | 'Critical Success'
  | 'Major Success'
  | 'Success'
  | 'Partial Success'
  | 'Failure'
  | 'Major Failure'
  | 'Critical Failure';

export interface StrategicCrisisOption {
  id: string;
  name: string;              // SURRENDER, ATTEMPT TO ESCAPE, HOLD POSITION, NEGOTIATE, ABORT, TACTICAL GAMBIT
  actionType: 'SURRENDER' | 'ESCAPE' | 'HOLD' | 'NEGOTIATE' | 'ABORT' | 'COUNTER_ATTACK';
  description: string;
  estimatedSuccessRate: number; // 0-100%
  potentialReward: 'None' | 'Moderate' | 'High' | 'Very High' | 'Exceptional';
  potentialLoss: 'Minimal' | 'Moderate' | 'Severe' | 'Catastrophic';
  primaryStatTested: 'Combat' | 'Stealth' | 'Intelligence' | 'Charisma' | 'Leadership' | 'Nerves';
}

export interface CrisisState {
  id: string;
  operationId: string;
  operationTitle: string;
  situationTitle: string;    // e.g. "POLICE HAVE SURROUNDED YOUR TEAM"
  situationDescription: string;
  severity: 'Moderate' | 'Severe' | 'Critical' | 'Extreme';
  crewMemberIds: string[];
  vehicleId?: string | null;
  enemyStrength: number;
  policePressure: number;
  terrain: string;
  preparationLevel: number;
  availableOptions: StrategicCrisisOption[];
  stageNumber: number;
  maxStages: number;
  initialReward: number;
  sceneImage: string;
}

export interface CrisisResolutionResult {
  tier: OutcomeTier;
  optionChosen: StrategicCrisisOption;
  rollScore: number;
  successRate: number;
  narrativeSummary: string;
  outcomeImage: string;
  calculationsBreakdown: {
    teamCombat: number;
    teamStealth: number;
    teamIntelligence: number;
    teamCharisma: number;
    teamLeadership: number;
    equipmentScore: number;
    vehicleBonus: number;
    policePressurePenalty: number;
    terrainModifier: number;
    controlledRandomness: number;
    finalRating: number;
  };
  consequences: {
    cashGained: number;
    repDelta: number;
    prestigeDelta: number;
    wantedDelta: number;
    policePressureDelta: number;
    memberUpdates: {
      memberId: string;
      healthDamage: number;
      newStatus: MemberHealthStatus;
      moraleDelta: number;
      loyaltyDelta: number;
      narrativeEvent?: string;
    }[];
    weaponUpdates: {
      weaponId: string;
      wear: number;
      lost: boolean;
    }[];
    vehicleWear?: number;
    lootRecovered?: {
      cash: number;
      weaponFoundModel?: string;
    };
  };
}

export interface TacticalBattleState {
  id: string;
  battleName: string;
  turn: number;
  maxTurns: number;
  playerStrength: number;
  enemyStrength: number;
  enemyName: string;
  momentum: number; // -100 to +100
  playerCasualties: number;
  enemyCasualties: number;
  currentTactic: 'Aggressive Assault' | 'Defensive Fortification' | 'Flank Maneuver' | 'Tactical Withdrawal' | 'Suppressing Fire';
  log: string[];
  isFinished: boolean;
  result?: 'Victory' | 'Defeat' | 'Underdog Victory' | 'Stalemate';
  estimatedWinRate: number;
  crewIds: string[];
  rewardCash: number;
  rewardRep: number;
  sceneImage: string;
}

export interface GameEvent {
  id: string;
  title: string;
  category: 'Police' | 'Business' | 'Gang' | 'Political' | 'Financial' | 'Personnel' | 'Market' | 'Territory' | 'Story';
  description: string;
  urgent: boolean;
  image: string;
  choices: {
    text: string;
    cost?: number;
    description: string;
    execute: (state: GameState) => Partial<GameState>;
  }[];
}

export interface GameEventLog {
  id: string;
  day: number;
  title: string;
  description: string;
  type: 'info' | 'positive' | 'negative' | 'critical';
}

export interface NewsItem {
  id: string;
  day: number;
  headline: string;
  category: 'Underworld' | 'Police Blotter' | 'Financial' | 'Politics' | 'Regional';
}

export interface GameStats {
  totalMoneyEarned: number;
  totalMoneySpent: number;
  contractsCompleted: number;
  contractsFailed: number;
  operationsRun: number;
  victories: number;
  defeats: number;
  underdogVictories: number;
  membersRecruited: number;
  membersLost: number;
  weaponsPurchased: number;
  weaponsRecovered: number;
  weaponsSold: number;
  weaponsRepaired: number;
  vehiclesAcquired: number;
  highestReputation: number;
  highestPrestige: number;
  highestWantedLevel: number;
  daysSurvived: number;
  biggestPayout: number;
  crisesOvercome: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedDay?: number;
  category: 'Combat' | 'Wealth' | 'Influence' | 'Survival' | 'Arsenal' | 'Fleet';
}

export interface RegionData {
  id: string;
  name: string;
  title: string;
  description: string;
  characteristics: string[];
  advantages: string[];
  disadvantages: string[];
  weaponAvailability: 'Scant' | 'Moderate' | 'Abundant' | 'Unregulated Surplus';
  policeIntensity: 'Low' | 'Moderate' | 'High' | 'Severe';
  financialRegulation: 'Strict' | 'Moderate' | 'Lax' | 'Unmonitored';
  startingCashBonus: number;
  startingWeaponsBonus: number;
  image: string;
}

export interface GameState {
  day: number;
  timeSpeed: 0 | 1 | 3 | 5 | 10;
  isPaused: boolean;
  regionId: string;
  organizationStyle: OrganizationStyle;
  leader: LeaderProfile;
  cash: number;
  dailyIncome: number;
  dailyExpense: number;
  reputation: number;        // Underworld reputation (0-100)
  publicReputation: number;  // Citizen view (0-100)
  politicalReputation: number;// Political view (0-100)
  prestige: number;          // Elite prestige (0-100)
  wantedLevel: number;       // 0-100
  policePressure: number;    // 0-100
  alertness: AlertnessLevel;
  financialPressure: number; // 0-100
  debt: number;

  members: Member[];
  weapons: WeaponItem[];
  vehicles: Vehicle[];
  ammunition: Record<AmmoType, { count: number; buyPrice: number; image: string }>;
  market: WeaponMarketItem[];
  businesses: Business[];
  territories: Territory[];
  factions: Faction[];
  contracts: Contract[];

  activeCrisis: CrisisState | null;
  crisisHistory: CrisisResolutionResult[];
  activeTacticalBattle: TacticalBattleState | null;

  pendingEvents: GameEvent[];
  eventHistory: GameEventLog[];
  newsFeed: NewsItem[];
  statistics: GameStats;
  achievements: Achievement[];

  // View state navigation
  activeTab: 
    | 'dashboard'
    | 'operations'
    | 'arsenal'
    | 'market'
    | 'members'
    | 'garage'
    | 'territory'
    | 'businesses'
    | 'factions'
    | 'news'
    | 'statistics'
    | 'achievements';
  selectedWeaponId: string | null;
  selectedMemberId: string | null;
  selectedTerritoryId: string | null;
  selectedContractId: string | null;
  selectedVehicleId: string | null;
}
