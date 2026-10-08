import { Faction } from '../game/types';
import { PHOTO_ASSETS } from '../game/visuals';

export const INITIAL_FACTIONS: Faction[] = [
  {
    id: 'black_harbor',
    name: 'Black Harbor Syndicate',
    leader: 'Commodore Chen',
    ideology: 'Maritime smuggling & international container tariff rackets',
    cash: 240000,
    reputation: 84,
    prestige: 72,
    territoryIds: ['t_harbor_docks', 't_drydocks'],
    militaryPower: 78,
    economicPower: 86,
    politicalInfluence: 65,
    relationWithPlayer: -15,
    color: '#0284c7', // Sky blue
    personality: 'Commercial',
    image: PHOTO_ASSETS.docksNight
  },
  {
    id: 'eastern_brotherhood',
    name: 'Eastern Brotherhood',
    leader: 'Viktor "The Iron" Volkov',
    ideology: 'Heavy muscle, warehouse protection, and military surplus trafficking',
    cash: 180000,
    reputation: 88,
    prestige: 60,
    territoryIds: ['t_industrial_zone', 't_rail_depot'],
    militaryPower: 88,
    economicPower: 64,
    politicalInfluence: 42,
    relationWithPlayer: -30,
    color: '#dc2626', // Red
    personality: 'Aggressive',
    image: PHOTO_ASSETS.tacticalArmory
  },
  {
    id: 'north_star_security',
    name: 'North Star Security PMC',
    leader: 'Colonel Eric Vance',
    ideology: 'Licensed private military contractor with dark underground contracts',
    cash: 420000,
    reputation: 76,
    prestige: 90,
    territoryIds: ['t_highrise_financial', 't_tech_quarter'],
    militaryPower: 92,
    economicPower: 88,
    politicalInfluence: 82,
    relationWithPlayer: 5,
    color: '#475569', // Slate
    personality: 'Mercenary',
    image: PHOTO_ASSETS.veteranSoldier
  },
  {
    id: 'red_crane_society',
    name: 'Red Crane Society',
    leader: 'Madame Lin',
    ideology: 'Traditional gambling dens, tea house intelligence brokers, and gold loans',
    cash: 310000,
    reputation: 82,
    prestige: 78,
    territoryIds: ['t_chinatown_market', 't_nightclub_strip'],
    militaryPower: 70,
    economicPower: 84,
    politicalInfluence: 75,
    relationWithPlayer: 0,
    color: '#e11d48', // Rose
    personality: 'Diplomatic',
    image: PHOTO_ASSETS.cityBanner
  },
  {
    id: 'golden_coast_union',
    name: 'Golden Coast Union',
    leader: 'Senator Marcus Reed',
    ideology: 'Port labor union facade fronting offshore money laundering',
    cash: 520000,
    reputation: 68,
    prestige: 92,
    territoryIds: ['t_customs_terminal'],
    militaryPower: 60,
    economicPower: 94,
    politicalInfluence: 90,
    relationWithPlayer: -10,
    color: '#d97706', // Amber
    personality: 'Diplomatic',
    image: PHOTO_ASSETS.bankVault
  },
  {
    id: 'iron_wolves',
    name: 'Iron Wolves Outlaws',
    leader: 'Boran "Grizzly" Kaya',
    ideology: 'Highway truck hijacking, weapon fabrication, and border skirmishes',
    cash: 120000,
    reputation: 75,
    prestige: 40,
    territoryIds: ['t_salvage_yards'],
    militaryPower: 82,
    economicPower: 45,
    politicalInfluence: 20,
    relationWithPlayer: -45,
    color: '#78716c', // Stone
    personality: 'Aggressive',
    image: PHOTO_ASSETS.armoredVan
  },
  {
    id: 'harbor_kings',
    name: 'Harbor Kings Cartel',
    leader: 'Alonzo Morales',
    ideology: 'Nightlife distribution, luxury marina rackets, speedboats',
    cash: 290000,
    reputation: 79,
    prestige: 66,
    territoryIds: ['t_luxury_marina'],
    militaryPower: 74,
    economicPower: 80,
    politicalInfluence: 50,
    relationWithPlayer: -5,
    color: '#059669', // Emerald
    personality: 'Commercial',
    image: PHOTO_ASSETS.cityBanner
  },
  {
    id: 'free_district_alliance',
    name: 'Free District Alliance',
    leader: 'Tariq "The Voice" Mansoor',
    ideology: 'Underground tenant protection, neighborhood vigilantes, and rebel armories',
    cash: 95000,
    reputation: 70,
    prestige: 48,
    territoryIds: ['t_old_quarter_slums'],
    militaryPower: 68,
    economicPower: 38,
    politicalInfluence: 35,
    relationWithPlayer: 15,
    color: '#16a34a', // Green
    personality: 'Fanatical',
    image: PHOTO_ASSETS.crisisStandoff
  },
  {
    id: 'delta_syndicate',
    name: 'Delta Corporate Consortium',
    leader: 'CEO Arthur Sterling',
    ideology: 'Hostile acquisitions, industrial espionage, and automated security',
    cash: 650000,
    reputation: 72,
    prestige: 95,
    territoryIds: ['t_corporate_park'],
    militaryPower: 85,
    economicPower: 96,
    politicalInfluence: 88,
    relationWithPlayer: -20,
    color: '#6366f1', // Indigo
    personality: 'Cautious',
    image: PHOTO_ASSETS.bankVault
  },
  {
    id: 'tri_border_clique',
    name: 'Tri-Border Smugglers Clique',
    leader: 'Yuri Danilov',
    ideology: 'Contraband mountain trucks, false manifests, and bribery networks',
    cash: 160000,
    reputation: 74,
    prestige: 52,
    territoryIds: ['t_border_checkpoint'],
    militaryPower: 72,
    economicPower: 68,
    politicalInfluence: 30,
    relationWithPlayer: 0,
    color: '#ca8a04', // Yellow-amber
    personality: 'Commercial',
    image: PHOTO_ASSETS.armoredVan
  }
];
