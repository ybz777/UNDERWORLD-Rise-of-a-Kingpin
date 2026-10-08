import { GameEvent, GameState } from '../game/types';
import { PHOTO_ASSETS } from '../game/visuals';

export interface EventTemplate {
  id: string;
  title: string;
  category: 'Police' | 'Business' | 'Gang' | 'Political' | 'Financial' | 'Personnel' | 'Market' | 'Territory' | 'Story';
  description: string;
  image?: string;
  triggerCondition?: (state: GameState) => boolean;
  choices: {
    text: string;
    cost?: number;
    description: string;
    execute: (state: GameState) => Partial<GameState>;
  }[];
}

export const EVENT_TEMPLATES: EventTemplate[] = [
  {
    id: 'evt_police_sweep',
    title: 'Surprise Municipal Police Inspection',
    category: 'Police',
    description: 'Squad cars and tactical patrol officers have established surprise vehicle roadblocks surrounding your primary safehouse district.',
    triggerCondition: (s) => s.policePressure > 40 || s.wantedLevel > 30,
    choices: [
      {
        text: 'Lay Low & Quarantine Activities',
        description: 'Order your operatives to stash all firearms in secret flooring and halt movement.',
        execute: (s) => ({
          policePressure: Math.max(0, s.policePressure - 12),
          wantedLevel: Math.max(0, s.wantedLevel - 5),
          reputation: Math.max(0, s.reputation - 2)
        })
      },
      {
        text: 'Distribute Police Union Bribes ($3,500)',
        cost: 3500,
        description: 'Discreetly route cash envelopes to the district precinct captain to divert the checkpoint.',
        execute: (s) => ({
          cash: Math.max(0, s.cash - 3500),
          policePressure: Math.max(0, s.policePressure - 25),
          wantedLevel: Math.max(0, s.wantedLevel - 15)
        })
      },
      {
        text: 'Defiant Posture (Stand Ground)',
        description: 'Keep armed guards visibly patrolling your entrances to signal dominance.',
        execute: (s) => ({
          policePressure: Math.min(100, s.policePressure + 15),
          reputation: Math.min(100, s.reputation + 4),
          prestige: Math.min(100, s.prestige + 2)
        })
      }
    ]
  },
  {
    id: 'evt_member_detained',
    title: 'Operative Detained by Municipal Detectives',
    category: 'Personnel',
    description: 'One of your field operators was intercepted by plainclothes detectives near a pawn exchange. They are currently in the holding cell undergoing preliminary questioning.',
    triggerCondition: (s) => s.members.length > 2,
    choices: [
      {
        text: 'Deploy Retainer Defense Attorney ($4,000)',
        cost: 4000,
        description: 'Dispatch a high-priced criminal defense lawyer to invoke constitutional silence and post bail.',
        execute: (s) => ({
          cash: Math.max(0, s.cash - 4000),
          policePressure: Math.max(0, s.policePressure - 5),
          reputation: Math.min(100, s.reputation + 3)
        })
      },
      {
        text: 'Leverage Leader Charisma & Political Favors',
        description: 'Call in personal favors from corrupt aldermen and magistrates.',
        execute: (s) => {
          const success = s.leader.charisma + s.leader.negotiation > 110;
          return {
            policePressure: success ? Math.max(0, s.policePressure - 10) : s.policePressure + 5,
            prestige: success ? s.prestige + 4 : Math.max(0, s.prestige - 3)
          };
        }
      },
      {
        text: 'Abandon Them to the System',
        description: 'Sever all ties and purge their locker. Demonstrates cold ruthlessness.',
        execute: (s) => ({
          reputation: Math.max(0, s.reputation - 6),
          policePressure: Math.max(0, s.policePressure - 8)
        })
      }
    ]
  },
  {
    id: 'evt_surplus_market_flood',
    title: 'Military Surplus Depot Liquidation',
    category: 'Market',
    description: 'A decommissioned frontier military base has dumped thousands of crates of assault rifles and ammunition onto the underground market.',
    choices: [
      {
        text: 'Acknowledge Market Trend',
        description: 'Firearm prices on the open market are slashed by 20% for the next several days.',
        execute: (s) => ({
          newsFeed: [
            {
              id: `news_${Date.now()}`,
              day: s.day,
              headline: 'Frontier Garrison Depots Dump Unregistered Surplus Firearms onto Regional Wharves',
              category: 'Regional'
            },
            ...s.newsFeed
          ]
        })
      }
    ]
  },
  {
    id: 'evt_rival_provocation',
    title: 'Rival Gang Encroachment',
    category: 'Gang',
    description: 'Scouts report that the Eastern Brotherhood has begun tagging storefronts and demanding protection levies on the edges of your territory.',
    choices: [
      {
        text: 'Mobilize Armed Counter-Patrols',
        description: 'Send heavily armed squads in unmarked vans to confront their scouts.',
        execute: (s) => ({
          reputation: Math.min(100, s.reputation + 6),
          policePressure: Math.min(100, s.policePressure + 8)
        })
      },
      {
        text: 'Propose a Demarcation Treaty',
        description: 'Send a senior negotiator with gift crates to define mutual boundaries.',
        execute: (s) => ({
          reputation: Math.max(0, s.reputation - 2),
          prestige: Math.min(100, s.prestige + 3)
        })
      },
      {
        text: 'Conduct Covert Hit on Their Scout Captain',
        description: 'Eliminate their point man in an untraceable hit-and-run.',
        execute: (s) => ({
          reputation: Math.min(100, s.reputation + 8),
          wantedLevel: Math.min(100, s.wantedLevel + 10)
        })
      }
    ]
  },
  {
    id: 'evt_business_shakedown',
    title: 'Corrupt Health & Fire Inspectors',
    category: 'Business',
    description: 'Municipal safety inspectors arrive at your premier nightlife venue threatening an immediate shutdown order unless citations are settled.',
    triggerCondition: (s) => s.businesses.some(b => b.isOwned),
    choices: [
      {
        text: 'Pay Off the Inspectors ($2,200)',
        cost: 2200,
        description: 'Hand over an envelope of clean bills and a bottle of vintage cognac.',
        execute: (s) => ({
          cash: Math.max(0, s.cash - 2200),
          policePressure: Math.max(0, s.policePressure - 4)
        })
      },
      {
        text: 'Subtle Physical Intimidation',
        description: 'Have two towering veterans stand behind them as they review the clipboard.',
        execute: (s) => ({
          reputation: Math.min(100, s.reputation + 4),
          policePressure: Math.min(100, s.policePressure + 6)
        })
      },
      {
        text: 'Comply and Close for 2 Days',
        description: 'Temporarily shutter the venue to perform cosmetic fixes.',
        execute: (s) => ({
          policePressure: Math.max(0, s.policePressure - 10)
        })
      }
    ]
  },
  {
    id: 'evt_special_operative_offer',
    title: 'Special Recruits: Former Military Sniper',
    category: 'Personnel',
    description: 'A decorated ex-special forces marksman who recently deserted from the northern conflict is looking for steady syndicate employment.',
    choices: [
      {
        text: 'Examine in Recruitment Hall',
        description: 'Acknowledge the opportunity; review new candidates in the Crew tab.',
        execute: (s) => ({
          prestige: Math.min(100, s.prestige + 1)
        })
      }
    ]
  },
  {
    id: 'evt_black_market_broker',
    title: 'Rare Weapon Shipment Offered',
    category: 'Market',
    description: 'An international cargo captain has docked with a private crate containing pristine suppressed assault carbines and heavy sniper rifles.',
    choices: [
      {
        text: 'Visit Black Market',
        description: 'Examine new weapon acquisitions and ammunition in the Market.',
        execute: (s) => ({
          reputation: Math.min(100, s.reputation + 2)
        })
      }
    ]
  },
  {
    id: 'evt_internal_friction',
    title: 'Internal Crew Squabble Over Salary',
    category: 'Personnel',
    description: 'Two of your senior crew members got into a heated altercation over the division of contract spoils.',
    triggerCondition: (s) => s.members.length >= 3,
    choices: [
      {
        text: 'Award Organizational Bonus Pool ($3,000)',
        cost: 3000,
        description: 'Distribute a cash bonus to all active crew members to soothe tempers.',
        execute: (s) => {
          const updated = s.members.map(m => ({ ...m, morale: Math.min(100, m.morale + 15), loyalty: Math.min(100, m.loyalty + 8) }));
          return {
            cash: Math.max(0, s.cash - 3000),
            members: updated
          };
        }
      },
      {
        text: 'Exercise Stern Leader Discipline',
        description: 'Deliver an uncompromising warning that mutinous behavior results in exile.',
        execute: (s) => {
          const success = s.leader.leadership > 60;
          const updated = s.members.map(m => ({
            ...m,
            discipline: Math.min(100, m.discipline + 6),
            morale: success ? m.morale : Math.max(20, m.morale - 8)
          }));
          return {
            leader: { ...s.leader, prestige: Math.min(100, s.leader.prestige + 3) },
            members: updated
          };
        }
      }
    ]
  },
  {
    id: 'evt_federal_investigation',
    title: 'Federal Task Force Surveillance',
    category: 'Police',
    description: 'Unmarked antennas and black sedans have been spotted surveying your front transport companies. A federal anti-racketeering file is being compiled.',
    triggerCondition: (s) => s.wantedLevel > 60,
    choices: [
      {
        text: 'Initiate Full Lockdown Protocol',
        description: 'Switch organization alertness to LOCKDOWN and freeze all non-essential shipments.',
        execute: () => ({
          alertness: 'LOCKDOWN',
          policePressure: 45
        })
      },
      {
        text: 'Deploy Fixer to Misdirect Investigation ($6,000)',
        cost: 6000,
        description: 'Plant fraudulent financial ledgers on a rival syndicate.',
        execute: (s) => ({
          cash: Math.max(0, s.cash - 6000),
          wantedLevel: Math.max(0, s.wantedLevel - 25),
          policePressure: Math.max(0, s.policePressure - 15)
        })
      }
    ]
  },
  {
    id: 'evt_public_charity',
    title: 'Community Relief Opportunity',
    category: 'Political',
    description: 'A fire in the dockworkers district left several families homeless. A charitable donation could buy immense public goodwill.',
    choices: [
      {
        text: 'Donate Generously ($5,000)',
        cost: 5000,
        description: 'Provide food, medical care, and reconstruction lumber under your organization name.',
        execute: (s) => ({
          cash: Math.max(0, s.cash - 5000),
          publicReputation: Math.min(100, s.publicReputation + 22),
          prestige: Math.min(100, s.prestige + 8)
        })
      },
      {
        text: 'Ignore the Plight',
        description: 'We are an underworld organization, not a charity foundation.',
        execute: (s) => ({
          publicReputation: Math.max(0, s.publicReputation - 5)
        })
      }
    ]
  }
];

export function getRandomEvent(state: GameState): GameEvent | null {
  const eligible = EVENT_TEMPLATES.filter(tpl => !tpl.triggerCondition || tpl.triggerCondition(state));
  if (eligible.length === 0) return null;
  const picked = eligible[Math.floor(Math.random() * eligible.length)];

  let img = PHOTO_ASSETS.cityBanner;
  if (picked.category === 'Police') img = PHOTO_ASSETS.crisisStandoff;
  else if (picked.category === 'Market') img = PHOTO_ASSETS.tacticalArmory;
  else if (picked.category === 'Personnel') img = PHOTO_ASSETS.veteranSoldier;
  else if (picked.category === 'Business' || picked.category === 'Financial') img = PHOTO_ASSETS.bankVault;
  else if (picked.category === 'Gang' || picked.category === 'Territory') img = PHOTO_ASSETS.docksNight;

  return {
    id: `evt_inst_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: picked.title,
    category: picked.category,
    description: picked.description,
    urgent: true,
    image: picked.image || img,
    choices: picked.choices
  };
}
