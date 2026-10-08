import { RegionData } from '../game/types';
import { PHOTO_ASSETS } from '../game/visuals';

export const REGIONS: RegionData[] = [
  {
    id: 'hua_dong',
    name: 'Hua Dong Republic',
    title: 'The Steel Metropolis',
    description: 'A heavily urbanized powerhouse dominated by commercial banking syndicates, deep water shipping, and disciplined municipal gendarmerie.',
    characteristics: [
      'Strict civilian weapon statutes',
      'Heavily fortified police stations and automated checkpoints',
      'Vast corporate banking networks and front opportunities',
      'Massive civilian populace with high commercial velocity'
    ],
    advantages: [
      '+40% Legitimate business revenue yields',
      'Access to sophisticated offshore laundering channels',
      'Lower street crime instability'
    ],
    disadvantages: [
      'Military-grade firearms are rare and carry 2.5x black market premiums',
      'Wanted level consequences escalate swiftly into tactical SWAT response',
      'High political inspection frequency'
    ],
    weaponAvailability: 'Scant',
    policeIntensity: 'Severe',
    financialRegulation: 'Strict',
    startingCashBonus: 7500,
    startingWeaponsBonus: 2,
    image: PHOTO_ASSETS.bankVault
  },
  {
    id: 'northern_territories',
    name: 'Northern Free Territories',
    title: 'The Frozen Frontier',
    description: 'Postwar border provinces where the central government collapsed years ago. Ruled by veteran warlords, railway militias, and black market armories.',
    characteristics: [
      'Virtually non-existent firearms regulation',
      'Abundance of cheap military surplus from decommissioned garrisons',
      'Disillusioned military veterans seeking syndicate contracts',
      'Unforgiving winters and volatile territorial skirmishes'
    ],
    advantages: [
      'Military-grade weapons and rifles are dirt cheap and widely available',
      'Easier recruitment of battle-hardened veterans and marksmen',
      'Low municipal police interference (local sheriffs easily bribed)'
    ],
    disadvantages: [
      'Low legal commercial revenue; fragile banking system',
      'Rival factions are aggressive and prone to violent raids',
      'High operational casualty rate in frozen territory'
    ],
    weaponAvailability: 'Unregulated Surplus',
    policeIntensity: 'Low',
    financialRegulation: 'Unmonitored',
    startingCashBonus: 3500,
    startingWeaponsBonus: 5,
    image: PHOTO_ASSETS.tacticalArmory
  },
  {
    id: 'eastern_port',
    name: 'Eastern Port Consortium',
    title: 'The Gateway of Smugglers',
    description: 'A sprawling neon-lit maritime hub handling international container ships, luxury casinos, dockworkers unions, and global contraband pipelines.',
    characteristics: [
      'Enormous maritime trade volume and cargo terminals',
      'Dense network of foreign brokers, corrupt customs inspectors, and fixers',
      'Intense competition among waterfront cartels and tri-district gangs',
      'Moderate yet pliable port authority'
    ],
    advantages: [
      '+25% Revenue on contraband, recovery, and transport contracts',
      'Broad diversity of foreign weapon models and ammunition supplies',
      'Frequent high-value contract postings from maritime oligarchs'
    ],
    disadvantages: [
      'Territory acquisition costs are doubled due to premium real estate',
      'Multiple rival syndicates constantly vie for the dry docks and piers',
      'Port customs crackdowns can temporarily freeze sea corridors'
    ],
    weaponAvailability: 'Abundant',
    policeIntensity: 'Moderate',
    financialRegulation: 'Moderate',
    startingCashBonus: 5500,
    startingWeaponsBonus: 3,
    image: PHOTO_ASSETS.docksNight
  },
  {
    id: 'southern_republic',
    name: 'Southern Republic Basin',
    title: 'The Sunshine Haven',
    description: 'A tropical commercial zone fueled by offshore banking secrecy, tourist entertainment districts, and volatile local governors.',
    characteristics: [
      'Unchecked cash economy with minimal financial transparency',
      'Corrupt judicial system where arrests are negotiable',
      'High circulation of private security contractors and bodyguards',
      'Frequent political scandals and sudden cabinet shuffles'
    ],
    advantages: [
      'Fast and cheap front business establishment',
      'Police pressure decays 30% faster through political bribes',
      'Higher base profits on nightlife venues and casinos'
    ],
    disadvantages: [
      'Frequent sudden political shifts alter faction alliances',
      'Bribery costs scale heavily with organization reputation',
      'Extortion from corrupt state governors'
    ],
    weaponAvailability: 'Moderate',
    policeIntensity: 'Moderate',
    financialRegulation: 'Lax',
    startingCashBonus: 6000,
    startingWeaponsBonus: 3,
    image: PHOTO_ASSETS.cityBanner
  },
  {
    id: 'iron_ridge',
    name: 'Iron Ridge Basin',
    title: 'The Industrial Citadel',
    description: 'A rugged mountain basin dominated by coal refineries, blast furnaces, rail junctions, and illicit underground workshops.',
    characteristics: [
      'Heavy metal fabrication and custom gunsmithing workshops',
      'Tight-knit worker brotherhoods and union muscle',
      'Rugged terrain with defensible compound positions',
      'Moderate law enforcement limited to main rail arteries'
    ],
    advantages: [
      'Weapon repair costs reduced by 50%; modified durability',
      'Enforcers and heavy gunners have enhanced physical resilience',
      'Territories have +20% base defensive fortification'
    ],
    disadvantages: [
      'Limited luxury trade and high-society prestige opportunities',
      'Difficult urban stealth operations due to tight industrial chokepoints',
      'High wear and tear on vehicular equipment'
    ],
    weaponAvailability: 'Abundant',
    policeIntensity: 'Moderate',
    financialRegulation: 'Lax',
    startingCashBonus: 4500,
    startingWeaponsBonus: 4,
    image: PHOTO_ASSETS.tacticalArmory
  },
  {
    id: 'silver_delta',
    name: 'Silver Delta Metropolis',
    title: 'The Technocrat Citadel',
    description: 'A glittering high-tech skyline built above shadowy dock warehouses. Governed by corporate megacorporations and private intelligence networks.',
    characteristics: [
      'Corporate warfare disguised as street security clashes',
      'Advanced surveillance networks and private security detachments',
      'Lucrative electronic theft, intelligence, and extortion contracts',
      'Elite mercenary recruitment pool'
    ],
    advantages: [
      'Intelligence and reconnaissance contracts yield 2x normal payouts',
      'High-tier specialist operatives appear more frequently in recruitment',
      'Prestige advances faster from high-profile operations'
    ],
    disadvantages: [
      'High surveillance makes failed operations spike police pressure rapidly',
      'Private security guards are heavily armed and body-armored',
      'Operating expenses for businesses are 25% higher'
    ],
    weaponAvailability: 'Moderate',
    policeIntensity: 'Severe',
    financialRegulation: 'Strict',
    startingCashBonus: 8000,
    startingWeaponsBonus: 2,
    image: PHOTO_ASSETS.cityBanner
  }
];
