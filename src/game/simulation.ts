/**
 * Core Daily Simulation Engine for Underworld: Rise of a Kingpin
 * Calculates daily income/expenses, police heat, faction AI, markets, and events
 */

import { GameState, NewsItem, WeaponMarketItem } from './types';
import { getRandomEvent } from '../data/events';
import { WEAPON_BLUEPRINTS, AMMO_BASE_PRICES } from '../data/weapons';
import { generateActiveContracts } from '../data/contracts';

export function simulateOneDay(prevState: GameState): GameState {
  const currentDay = prevState.day + 1;
  const newNews: NewsItem[] = [...prevState.newsFeed];

  // 1. Calculate Daily Financials
  // Business revenue
  const businessIncome = prevState.businesses
    .filter(b => b.isOwned)
    .reduce((acc, b) => acc + b.dailyIncome, 0);
  const businessExpenses = prevState.businesses
    .filter(b => b.isOwned)
    .reduce((acc, b) => acc + b.dailyExpense, 0);

  // Territory income
  const territoryIncome = prevState.territories
    .filter(t => t.controllingFactionId === null)
    .reduce((acc, t) => acc + t.dailyRevenue, 0);

  // Salaries of members
  const memberSalaries = prevState.members.reduce((acc, m) => acc + m.salary, 0);

  // Alertness cost modifier
  let alertnessExpense = 0;
  if (prevState.alertness === 'CAUTIOUS') alertnessExpense = 150;
  if (prevState.alertness === 'HIGH ALERT') alertnessExpense = 450;
  if (prevState.alertness === 'LOCKDOWN') alertnessExpense = 900;

  const totalDailyIncome = businessIncome + territoryIncome;
  const totalDailyExpense = businessExpenses + memberSalaries + alertnessExpense;
  const netDaily = totalDailyIncome - totalDailyExpense;
  const newCash = Math.max(0, prevState.cash + netDaily);

  // 2. Police Pressure & Wanted Level Dynamics
  let newWanted = prevState.wantedLevel;
  let newPolicePressure = prevState.policePressure;

  // Alertness affects heat
  if (prevState.alertness === 'LOCKDOWN') {
    newWanted = Math.max(0, newWanted - 2);
    newPolicePressure = Math.max(0, newPolicePressure - 4);
  } else if (prevState.alertness === 'HIGH ALERT') {
    newWanted = Math.max(0, newWanted - 1);
    newPolicePressure = Math.max(0, newPolicePressure - 2);
  } else if (prevState.alertness === 'CAUTIOUS') {
    newWanted = Math.max(0, newWanted - 0.5);
    newPolicePressure = Math.max(0, newPolicePressure - 1);
  } else {
    // Normal: natural decay if under 40, drift upwards if high
    if (newWanted > 50) {
      newPolicePressure = Math.min(100, newPolicePressure + 1);
    } else {
      newPolicePressure = Math.max(0, newPolicePressure - 1);
      newWanted = Math.max(0, newWanted - 1);
    }
  }

  // Business legal cover reduces police pressure
  const totalHeatReduction = prevState.businesses
    .filter(b => b.isOwned)
    .reduce((acc, b) => acc + b.heatReduction, 0);
  newPolicePressure = Math.max(0, newPolicePressure - Math.floor(totalHeatReduction * 0.1));

  // 3. Member Recovery & Morale Progression
  const updatedMembers = prevState.members.map(m => {
    let health = m.health;
    let status = m.status;
    let injuryDays = m.injuryDaysRemaining;
    let morale = m.morale;

    // Healing injured members
    if (status === 'Injured' || status === 'Critical') {
      injuryDays = Math.max(0, injuryDays - 1);
      health = Math.min(100, health + 6);
      if (injuryDays === 0 && health >= 75) {
        status = 'Healthy';
      }
    }

    // Unpaid salaries hurt morale
    if (prevState.cash < totalDailyExpense) {
      morale = Math.max(10, morale - 10);
    }

    return {
      ...m,
      health,
      status,
      injuryDaysRemaining: injuryDays,
      morale
    };
  });

  // 4. Dynamic Weapon Market Fluctuations
  let updatedMarket: WeaponMarketItem[] = [...prevState.market];
  if (currentDay % 3 === 0 || updatedMarket.length < 4) {
    const randomBp = WEAPON_BLUEPRINTS[Math.floor(Math.random() * WEAPON_BLUEPRINTS.length)];
    const sources: WeaponMarketItem['source'][] = [
      'Military Surplus',
      'Commercial Dealer',
      'Collector Market',
      'Underground Syndicate',
      'Recovered Shipment'
    ];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const discount = Math.floor(Math.random() * 35) - 15; // -15% to +20%
    const finalPrice = Math.round(randomBp.baseValue * (1 + discount / 100));

    const newItem: WeaponMarketItem = {
      id: `mkt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      model: randomBp.model,
      category: randomBp.category,
      rarity: randomBp.rarity,
      ammoType: randomBp.ammoType,
      damage: randomBp.damage,
      accuracy: randomBp.accuracy,
      reliability: randomBp.reliability,
      condition: 85 + Math.floor(Math.random() * 15),
      price: finalPrice,
      source,
      supply: 1 + Math.floor(Math.random() * 3),
      discountPercent: discount,
      description: randomBp.description,
      image: randomBp.image
    };

    updatedMarket = [newItem, ...updatedMarket.slice(0, 7)];
  }

  // 5. Contract Expiration & Generation
  let updatedContracts = prevState.contracts
    .map(c => ({ ...c, daysRemaining: c.daysRemaining - 1 }))
    .filter(c => c.daysRemaining > 0);

  if (updatedContracts.length < 5) {
    const newBatch = generateActiveContracts(2);
    updatedContracts = [...updatedContracts, ...newBatch];
  }

  // 6. Dynamic Faction AI Shift
  const updatedFactions = prevState.factions.map(f => {
    let relation = f.relationWithPlayer;
    // Gradual drift back to neutral if extreme, or sudden shifts
    if (Math.random() < 0.15) {
      if (f.personality === 'Aggressive' && relation < 0) {
        relation = Math.max(-100, relation - 2);
      } else if (f.personality === 'Diplomatic') {
        relation = Math.min(100, relation + 1);
      }
    }
    return {
      ...f,
      cash: Math.round(f.cash * (1 + (Math.random() * 0.04 - 0.02))),
      relationWithPlayer: relation
    };
  });

  // 7. World News Generation
  if (Math.random() < 0.25) {
    const headlines = [
      'Municipal Port Authority Implements New Electronic Freight Inspections',
      'Stock Market Jitters Trigger Increased Demand for Black-Market Bullion',
      'Central Police Commissioner Announces Crackdown on Unlicensed Security Firms',
      'Rival Underground Cartels Reportedly Settle Freight Dispute in Harbor District',
      'Foreign Cargo Ship Docks with Large Commercial Consignment at Pier 14'
    ];
    newNews.unshift({
      id: `news_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      day: currentDay,
      headline: headlines[Math.floor(Math.random() * headlines.length)],
      category: 'Regional'
    });
  }

  // 8. Event Trigger Check (5% daily chance or higher if high wanted)
  let pendingEvents = [...prevState.pendingEvents];
  let isPaused = prevState.isPaused;
  const eventChance = 0.08 + (newWanted > 50 ? 0.12 : 0) + (newPolicePressure > 60 ? 0.15 : 0);
  if (pendingEvents.length === 0 && Math.random() < eventChance) {
    const event = getRandomEvent({
      ...prevState,
      day: currentDay,
      cash: newCash,
      wantedLevel: Math.round(newWanted),
      policePressure: Math.round(newPolicePressure)
    });
    if (event) {
      pendingEvents = [event];
      isPaused = true; // Auto-pause on urgent decisions
    }
  }

  // 9. Update Statistics
  const updatedStats = {
    ...prevState.statistics,
    daysSurvived: currentDay,
    totalMoneyEarned: prevState.statistics.totalMoneyEarned + Math.max(0, netDaily),
    highestReputation: Math.max(prevState.statistics.highestReputation, prevState.reputation),
    highestPrestige: Math.max(prevState.statistics.highestPrestige, prevState.prestige),
    highestWantedLevel: Math.max(prevState.statistics.highestWantedLevel, Math.round(newWanted))
  };

  return {
    ...prevState,
    day: currentDay,
    cash: newCash,
    dailyIncome: totalDailyIncome,
    dailyExpense: totalDailyExpense,
    wantedLevel: Math.round(newWanted),
    policePressure: Math.round(newPolicePressure),
    members: updatedMembers,
    market: updatedMarket,
    contracts: updatedContracts,
    factions: updatedFactions,
    newsFeed: newNews.slice(0, 20),
    pendingEvents,
    isPaused,
    statistics: updatedStats
  };
}
