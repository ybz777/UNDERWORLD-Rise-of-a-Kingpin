import { MemberRole, SkillNode } from '../game/types';

export function getRoleSkillTree(role: MemberRole): SkillNode[] {
  switch (role) {
    case 'Veteran':
    case 'Rifleman':
      return [
        {
          id: 'sk_combat_1',
          name: 'Combat Conditioning',
          description: '+8 Combat and +5 Accuracy under live incoming fire.',
          tier: 1,
          unlocked: false,
          statBoosts: { combat: 8 }
        },
        {
          id: 'sk_combat_2',
          name: 'Fire Discipline',
          description: '+10 Accuracy and -20% weapon wear on operations.',
          tier: 2,
          unlocked: false,
          statBoosts: { combat: 6, nerves: 5 }
        },
        {
          id: 'sk_combat_3',
          name: 'Squad Pointman',
          description: '+10 Leadership and enhances overall team survivability.',
          tier: 3,
          unlocked: false,
          statBoosts: { leadership: 10, combat: 8 }
        },
        {
          id: 'sk_combat_4',
          name: 'Elite Commander',
          description: 'Turns this operative into a legendary battlefield tactician.',
          tier: 4,
          unlocked: false,
          statBoosts: { combat: 12, nerves: 10, leadership: 8 }
        }
      ];

    case 'Scout':
      return [
        {
          id: 'sk_scout_1',
          name: 'Shadow Footing',
          description: '+10 Stealth and silent perimeter bypass.',
          tier: 1,
          unlocked: false,
          statBoosts: { stealth: 10 }
        },
        {
          id: 'sk_scout_2',
          name: 'Electronic Decryption',
          description: '+8 Intelligence and disables automated alarms.',
          tier: 2,
          unlocked: false,
          statBoosts: { intelligence: 8, stealth: 5 }
        },
        {
          id: 'sk_scout_3',
          name: 'Escape Artist',
          description: '+15% Escape success probability during police encirclements.',
          tier: 3,
          unlocked: false,
          statBoosts: { nerves: 8, stealth: 10 }
        },
        {
          id: 'sk_scout_4',
          name: 'Master Phantom',
          description: 'Never gets captured; guarantees extraction corridor for the squad.',
          tier: 4,
          unlocked: false,
          statBoosts: { stealth: 15, intelligence: 10 }
        }
      ];

    case 'Driver':
      return [
        {
          id: 'sk_driver_1',
          name: 'Tactical Drift',
          description: '+12% Speed when escaping police vehicular pursuit.',
          tier: 1,
          unlocked: false,
          statBoosts: { nerves: 6 }
        },
        {
          id: 'sk_driver_2',
          name: 'Ramming Reinforced',
          description: 'Allows smashing roadblocks with minimal vehicle condition loss.',
          tier: 2,
          unlocked: false,
          statBoosts: { combat: 6, nerves: 8 }
        },
        {
          id: 'sk_driver_3',
          name: 'Fleet Mechanic',
          description: 'Reduces all fleet daily operating costs by 25%.',
          tier: 3,
          unlocked: false,
          statBoosts: { intelligence: 8 }
        },
        {
          id: 'sk_driver_4',
          name: 'Ghost Wheelman',
          description: 'Zero wanted level gained on high-speed getaway extractions.',
          tier: 4,
          unlocked: false,
          statBoosts: { nerves: 12, stealth: 10 }
        }
      ];

    case 'Negotiator':
    case 'Fixer':
      return [
        {
          id: 'sk_neg_1',
          name: 'Silver Tongue',
          description: '+10 Charisma and reduces municipal bribe costs by 15%.',
          tier: 1,
          unlocked: false,
          statBoosts: { charisma: 10 }
        },
        {
          id: 'sk_neg_2',
          name: 'Hostage Mediation',
          description: '+20% Success on standoff negotiation crisis options.',
          tier: 2,
          unlocked: false,
          statBoosts: { charisma: 8, nerves: 6 }
        },
        {
          id: 'sk_neg_3',
          name: 'Faction Broker',
          description: 'Prevents negative relationship decay with rival cartels.',
          tier: 3,
          unlocked: false,
          statBoosts: { charisma: 10, leadership: 6 }
        },
        {
          id: 'sk_neg_4',
          name: 'Shadow Arbitrator',
          description: 'Can broker emergency ceasefires directly with police chiefs.',
          tier: 4,
          unlocked: false,
          statBoosts: { charisma: 15, leadership: 10 }
        }
      ];

    default: // Street Enforcer, Manager, Medic, etc.
      return [
        {
          id: 'sk_gen_1',
          name: 'Iron Resilience',
          description: '+10 Nerves and +10 Maximum Health resilience.',
          tier: 1,
          unlocked: false,
          statBoosts: { nerves: 10 }
        },
        {
          id: 'sk_gen_2',
          name: 'Hardened Specialist',
          description: '+8 to primary combat and operational skill.',
          tier: 2,
          unlocked: false,
          statBoosts: { combat: 8 }
        },
        {
          id: 'sk_gen_3',
          name: 'Unshakable Loyalty',
          description: 'Permanently locks loyalty above 80%; immune to rival bribes.',
          tier: 3,
          unlocked: false,
          statBoosts: { nerves: 8, leadership: 6 }
        },
        {
          id: 'sk_gen_4',
          name: 'Underworld Legend',
          description: 'Greatly boosts organization prestige whenever on mission.',
          tier: 4,
          unlocked: false,
          statBoosts: { combat: 10, nerves: 10, leadership: 10 }
        }
      ];
  }
}
