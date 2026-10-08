import {
  AmmoType,
  GameState,
  LeaderProfile,
  Member,
  OrganizationStyle,
  Vehicle,
  WeaponItem,
  WeaponMarketItem
} from './types';
import { REGIONS } from '../data/regions';
import { WEAPON_BLUEPRINTS, AMMO_BASE_PRICES } from '../data/weapons';
import { INITIAL_FACTIONS } from '../data/factions';
import { INITIAL_TERRITORIES } from '../data/territories';
import { BUSINESS_CATALOG } from '../data/businesses';
import { VEHICLE_CATALOG } from '../data/vehicles';
import { generateActiveContracts } from '../data/contracts';
import { RECRUIT_TEMPLATES, createInitialMember } from '../data/recruits';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import { PHOTO_ASSETS } from './visuals';

export function createInitialGameState(params: {
  leaderName: string;
  orgName: string;
  regionId: string;
  orgStyle: OrganizationStyle;
  bannerColor?: string;
  accentColor?: string;
  emblem?: string;
  motto?: string;
  charisma?: number;
  leadership?: number;
  combat?: number;
  intelligence?: number;
  negotiation?: number;
  planning?: number;
}): GameState {
  const region = REGIONS.find(r => r.id === params.regionId) || REGIONS[2]; // Default Eastern Port

  const leader: LeaderProfile = {
    name: params.leaderName || 'Vance Kovac',
    organizationName: params.orgName || 'The Iron Sovereign',
    portrait: PHOTO_ASSETS.syndicateLeader,
    bannerColor: params.bannerColor || '#b45309', // Amber-700
    accentColor: params.accentColor || '#fbbf24', // Amber-400
    emblem: params.emblem || 'crown',
    motto: params.motto || 'Strength Through Brotherhood & Steel',
    charisma: params.charisma ?? 75,
    leadership: params.leadership ?? 70,
    combat: params.combat ?? 65,
    intelligence: params.intelligence ?? 70,
    negotiation: params.negotiation ?? 68,
    planning: params.planning ?? 65,
    reputation: 15,
    prestige: 10,
    traits: {
      mercy: 45,
      aggression: 65,
      loyalty: 80,
      riskTolerance: 70,
      discipline: 75
    }
  };

  // 1. Initial Weapons
  const bpTT33 = WEAPON_BLUEPRINTS.find(b => b.model.includes('Tokarev')) || WEAPON_BLUEPRINTS[0];
  const bpVityaz = WEAPON_BLUEPRINTS.find(b => b.model.includes('Vityaz')) || WEAPON_BLUEPRINTS[1];
  const bpAKM = WEAPON_BLUEPRINTS.find(b => b.model.includes('AKM')) || WEAPON_BLUEPRINTS[2];
  const bpKabar = WEAPON_BLUEPRINTS.find(b => b.model.includes('Ka-Bar')) || WEAPON_BLUEPRINTS[3];

  const startingWeapons: WeaponItem[] = [
    {
      id: '#W-TT33-0182',
      model: bpTT33.model,
      category: bpTT33.category,
      rarity: bpTT33.rarity,
      condition: 92,
      reliability: bpTT33.reliability,
      accuracy: bpTT33.accuracy,
      damage: bpTT33.damage,
      range: bpTT33.range,
      handling: bpTT33.handling,
      weight: bpTT33.weight,
      magCapacity: bpTT33.magCapacity,
      ammoType: bpTT33.ammoType,
      value: bpTT33.baseValue,
      roundsFired: 120,
      deployments: 3,
      kills: 1,
      repairs: 0,
      assignedMemberId: null,
      origin: region.name,
      acquisitionDateDay: 1,
      isVeteranWeapon: false,
      image: bpTT33.image
    },
    {
      id: '#W-VIT-4409',
      model: bpVityaz.model,
      category: bpVityaz.category,
      rarity: bpVityaz.rarity,
      condition: 88,
      reliability: bpVityaz.reliability,
      accuracy: bpVityaz.accuracy,
      damage: bpVityaz.damage,
      range: bpVityaz.range,
      handling: bpVityaz.handling,
      weight: bpVityaz.weight,
      magCapacity: bpVityaz.magCapacity,
      ammoType: bpVityaz.ammoType,
      value: bpVityaz.baseValue,
      roundsFired: 340,
      deployments: 5,
      kills: 2,
      repairs: 1,
      assignedMemberId: null,
      origin: 'Northern Surplus Depot',
      acquisitionDateDay: 1,
      isVeteranWeapon: false,
      image: bpVityaz.image
    },
    {
      id: '#W-AKM-8190',
      model: bpAKM.model,
      category: bpAKM.category,
      rarity: bpAKM.rarity,
      condition: 84,
      reliability: bpAKM.reliability,
      accuracy: bpAKM.accuracy,
      damage: bpAKM.damage,
      range: bpAKM.range,
      handling: bpAKM.handling,
      weight: bpAKM.weight,
      magCapacity: bpAKM.magCapacity,
      ammoType: bpAKM.ammoType,
      value: bpAKM.baseValue,
      roundsFired: 890,
      deployments: 8,
      kills: 4,
      repairs: 2,
      assignedMemberId: null,
      origin: 'Frontier Veteran Cache',
      acquisitionDateDay: 1,
      isVeteranWeapon: false,
      image: bpAKM.image
    },
    {
      id: '#W-KABAR-0091',
      model: bpKabar.model,
      category: 'Melee Weapons',
      rarity: 'Common',
      condition: 96,
      reliability: 99,
      accuracy: 90,
      damage: 32,
      range: 2,
      handling: 95,
      weight: 0.35,
      magCapacity: 0,
      ammoType: 'none',
      value: 120,
      roundsFired: 0,
      deployments: 4,
      kills: 1,
      repairs: 0,
      assignedMemberId: null,
      origin: 'Surplus Field Kit',
      acquisitionDateDay: 1,
      isVeteranWeapon: false,
      image: bpKabar.image
    }
  ];

  // 2. Initial 4 Members
  const m1 = createInitialMember(RECRUIT_TEMPLATES[0], startingWeapons[2].id); // Mikhail
  const m2 = createInitialMember(RECRUIT_TEMPLATES[1], startingWeapons[1].id); // Sergei
  const m3 = createInitialMember(RECRUIT_TEMPLATES[3], startingWeapons[0].id); // Dmitri
  const m4 = createInitialMember(RECRUIT_TEMPLATES[8], null); // Yana (Driver)
  const startingMembers: Member[] = [m1, m2, m3, m4];

  // Link weapons back to owners
  startingWeapons[2].assignedMemberId = m1.id;
  startingWeapons[1].assignedMemberId = m2.id;
  startingWeapons[0].assignedMemberId = m3.id;
  startingWeapons[3].assignedMemberId = m2.id; // Melee for Sergei

  // 3. Initial Vehicles
  const startingVehicles: Vehicle[] = [
    {
      ...VEHICLE_CATALOG[3], // Titan Brinks Armored Van
      isOwned: true,
      assignedOperationId: null
    },
    {
      ...VEHICLE_CATALOG[0], // Bavaria 740i Shadow Sedan
      isOwned: true,
      assignedOperationId: null
    }
  ];

  // 4. Initial Ammunition Stocks
  const ammunition: Record<AmmoType, { count: number; buyPrice: number; image: string }> = {
    '9mm_parabellum': {
      count: 250,
      buyPrice: AMMO_BASE_PRICES['9mm_parabellum'].pricePerUnit,
      image: AMMO_BASE_PRICES['9mm_parabellum'].image
    },
    '7.62x39mm_soviet': {
      count: 180,
      buyPrice: AMMO_BASE_PRICES['7.62x39mm_soviet'].pricePerUnit,
      image: AMMO_BASE_PRICES['7.62x39mm_soviet'].image
    },
    '5.56x45mm_nato': {
      count: 90,
      buyPrice: AMMO_BASE_PRICES['5.56x45mm_nato'].pricePerUnit,
      image: AMMO_BASE_PRICES['5.56x45mm_nato'].image
    },
    '308_winchester': {
      count: 40,
      buyPrice: AMMO_BASE_PRICES['308_winchester'].pricePerUnit,
      image: AMMO_BASE_PRICES['308_winchester'].image
    },
    '12_gauge': {
      count: 60,
      buyPrice: AMMO_BASE_PRICES['12_gauge'].pricePerUnit,
      image: AMMO_BASE_PRICES['12_gauge'].image
    },
    '50_bmg': {
      count: 10,
      buyPrice: AMMO_BASE_PRICES['50_bmg'].pricePerUnit,
      image: AMMO_BASE_PRICES['50_bmg'].image
    },
    '45_acp': {
      count: 100,
      buyPrice: AMMO_BASE_PRICES['45_acp'].pricePerUnit,
      image: AMMO_BASE_PRICES['45_acp'].image
    },
    '357_magnum': {
      count: 50,
      buyPrice: AMMO_BASE_PRICES['357_magnum'].pricePerUnit,
      image: AMMO_BASE_PRICES['357_magnum'].image
    },
    '40mm_grenade': {
      count: 4,
      buyPrice: AMMO_BASE_PRICES['40mm_grenade'].pricePerUnit,
      image: AMMO_BASE_PRICES['40mm_grenade'].image
    }
  };

  // 5. Initial Market Stock (Rotating selection of 6-8 items)
  const initialMarket: WeaponMarketItem[] = [
    {
      id: 'mkt_init_1',
      model: WEAPON_BLUEPRINTS[1].model, // M1911A1
      category: 'Pistols',
      rarity: 'Common',
      ammoType: '45_acp',
      damage: 48,
      accuracy: 70,
      reliability: 90,
      condition: 95,
      price: 650,
      source: 'Commercial Dealer',
      supply: 3,
      discountPercent: -5,
      description: 'Classic .45 sidearm in factory grease paper.',
      image: WEAPON_BLUEPRINTS[1].image
    },
    {
      id: 'mkt_init_2',
      model: WEAPON_BLUEPRINTS[8].model, // MP5A3
      category: 'SMGs',
      rarity: 'Rare',
      ammoType: '9mm_parabellum',
      damage: 46,
      accuracy: 84,
      reliability: 92,
      condition: 88,
      price: 1950,
      source: 'Underground Syndicate',
      supply: 2,
      discountPercent: -10,
      description: 'Law enforcement surplus with retractable stock.',
      image: WEAPON_BLUEPRINTS[8].image
    },
    {
      id: 'mkt_init_3',
      model: WEAPON_BLUEPRINTS[13].model, // AK-74M
      category: 'Assault Rifles',
      rarity: 'Common',
      ammoType: '5.56x45mm_nato',
      damage: 62,
      accuracy: 76,
      reliability: 95,
      condition: 90,
      price: 1750,
      source: 'Military Surplus',
      supply: 4,
      discountPercent: -15,
      description: 'Factory crates from regional military surplus depots.',
      image: WEAPON_BLUEPRINTS[13].image
    },
    {
      id: 'mkt_init_4',
      model: WEAPON_BLUEPRINTS[23].model, // Remington 870
      category: 'Shotguns',
      rarity: 'Common',
      ammoType: '12_gauge',
      damage: 82,
      accuracy: 45,
      reliability: 96,
      condition: 96,
      price: 640,
      source: 'Commercial Dealer',
      supply: 2,
      discountPercent: 0,
      description: 'Police trade-in 12-gauge with heat shield.',
      image: WEAPON_BLUEPRINTS[23].image
    },
    {
      id: 'mkt_init_5',
      model: WEAPON_BLUEPRINTS[32].model, // Kukri Machete
      category: 'Melee Weapons',
      rarity: 'Uncommon',
      ammoType: 'none',
      damage: 48,
      accuracy: 85,
      reliability: 98,
      condition: 98,
      price: 280,
      source: 'Collector Market',
      supply: 1,
      discountPercent: 0,
      description: 'Curved inward heavy chopping machete.',
      image: WEAPON_BLUEPRINTS[32].image
    }
  ];

  // 6. Initial Businesses
  const businesses = BUSINESS_CATALOG.map(b => ({
    ...b,
    isOwned: false,
    managerMemberId: null
  }));

  // Initial Territories
  const territories = [...INITIAL_TERRITORIES];

  // Initial Contracts
  const contracts = generateActiveContracts(6);

  // Initial News Feed
  const initialNews = [
    {
      id: 'news_init_1',
      day: 1,
      headline: `${params.orgName || 'The Iron Sovereign'} Establishes Operations in the ${region.name}`,
      category: 'Underworld' as const
    },
    {
      id: 'news_init_2',
      day: 1,
      headline: 'Municipal Police Announce Heightened Surveillance of Waterfront Warehouses',
      category: 'Police Blotter' as const
    },
    {
      id: 'news_init_3',
      day: 1,
      headline: 'Harbor Shipping Volumes Hit Record Highs as Foreign Trade Expands',
      category: 'Financial' as const
    }
  ];

  return {
    day: 1,
    timeSpeed: 1,
    isPaused: true,
    regionId: region.id,
    organizationStyle: params.orgStyle || 'Organized Crime Syndicate',
    leader,
    cash: region.startingCashBonus,
    dailyIncome: 950,
    dailyExpense: startingMembers.reduce((acc, m) => acc + m.salary, 0) + startingVehicles.reduce((acc, v) => acc + v.dailyOperatingCost, 0),
    reputation: 15,
    publicReputation: 40,
    politicalReputation: 25,
    prestige: 12,
    wantedLevel: 2,
    policePressure: 8,
    alertness: 'NORMAL',
    financialPressure: 15,
    debt: 0,
    members: startingMembers,
    weapons: startingWeapons,
    vehicles: startingVehicles,
    ammunition,
    market: initialMarket,
    businesses,
    territories,
    factions: INITIAL_FACTIONS,
    contracts,
    activeCrisis: null,
    crisisHistory: [],
    activeTacticalBattle: null,
    pendingEvents: [],
    eventHistory: [
      {
        id: 'hist_start',
        day: 1,
        title: 'Organization Founded',
        description: `${leader.organizationName} formally established headquarters in ${region.name}. Initial cadre of 4 operatives and 2 tactical vehicles assembled.`,
        type: 'positive'
      }
    ],
    newsFeed: initialNews,
    statistics: {
      totalMoneyEarned: region.startingCashBonus,
      totalMoneySpent: 0,
      contractsCompleted: 0,
      contractsFailed: 0,
      operationsRun: 0,
      victories: 0,
      defeats: 0,
      underdogVictories: 0,
      membersRecruited: 4,
      membersLost: 0,
      weaponsPurchased: 0,
      weaponsRecovered: 0,
      weaponsSold: 0,
      weaponsRepaired: 0,
      vehiclesAcquired: 2,
      highestReputation: 15,
      highestPrestige: 12,
      highestWantedLevel: 2,
      daysSurvived: 1,
      biggestPayout: 0,
      crisesOvercome: 0
    },
    achievements: INITIAL_ACHIEVEMENTS,
    activeTab: 'dashboard',
    selectedWeaponId: null,
    selectedMemberId: null,
    selectedTerritoryId: null,
    selectedContractId: null,
    selectedVehicleId: null
  };
}
