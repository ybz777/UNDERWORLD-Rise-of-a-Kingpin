import React, { useState } from 'react';
import { AmmoType, GameState, WeaponItem, WeaponMarketItem } from '../game/types';
import { sounds } from '../game/audio';
import { AMMO_BASE_PRICES } from '../data/weapons';
import { PHOTO_ASSETS } from '../game/visuals';
import { EntityImage } from '../components/EntityImage';
import {
  DollarSign,
  Package,
  Shield,
  ShoppingCart,
  Crosshair,
  TrendingDown,
  TrendingUp,
  Tag
} from 'lucide-react';

interface MarketScreenProps {
  state: GameState;
  onUpdateState: (updater: (prev: GameState) => GameState) => void;
}

export const MarketScreen: React.FC<MarketScreenProps> = ({
  state,
  onUpdateState
}) => {
  const [activeTab, setActiveTab] = useState<'weapons' | 'ammo' | 'sell'>('weapons');

  // Purchase Weapon
  const handleBuyWeapon = (item: WeaponMarketItem) => {
    if (state.cash < item.price || item.supply <= 0) return;

    sounds.playCash();
    const newWeapon: WeaponItem = {
      id: `#W-${item.model.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 9000 + 1000)}`,
      model: item.model,
      category: item.category,
      rarity: item.rarity,
      condition: item.condition,
      reliability: item.reliability,
      accuracy: item.accuracy,
      damage: item.damage,
      range: 150,
      handling: 75,
      weight: 3.5,
      magCapacity: item.category === 'Melee Weapons' ? 0 : 30,
      ammoType: item.ammoType,
      value: item.price,
      roundsFired: 0,
      deployments: 0,
      kills: 0,
      repairs: 0,
      assignedMemberId: null,
      origin: item.source,
      acquisitionDateDay: state.day,
      isVeteranWeapon: false,
      image: item.image
    };

    onUpdateState(s => ({
      ...s,
      cash: s.cash - item.price,
      weapons: [...s.weapons, newWeapon],
      market: s.market.map(m =>
        m.id === item.id ? { ...m, supply: m.supply - 1 } : m
      ).filter(m => m.supply > 0),
      statistics: {
        ...s.statistics,
        weaponsPurchased: s.statistics.weaponsPurchased + 1,
        totalMoneySpent: s.statistics.totalMoneySpent + item.price
      }
    }));
  };

  // Buy Ammunition
  const handleBuyAmmo = (type: AmmoType, boxCount: number = 1) => {
    const info = AMMO_BASE_PRICES[type];
    const totalRounds = info.boxSize * boxCount;
    const cost = Math.round(totalRounds * info.pricePerUnit);

    if (state.cash < cost) return;

    sounds.playCash();
    onUpdateState(s => ({
      ...s,
      cash: s.cash - cost,
      ammunition: {
        ...s.ammunition,
        [type]: {
          ...s.ammunition[type],
          count: s.ammunition[type].count + totalRounds
        }
      },
      statistics: {
        ...s.statistics,
        totalMoneySpent: s.statistics.totalMoneySpent + cost
      }
    }));
  };

  // Sell Surplus Weapon
  const handleSellWeapon = (weapon: WeaponItem) => {
    const resaleValue = Math.round(weapon.value * (weapon.condition / 100) * 0.65);
    sounds.playCash();

    onUpdateState(s => ({
      ...s,
      cash: s.cash + resaleValue,
      weapons: s.weapons.filter(w => w.id !== weapon.id),
      members: s.members.map(m =>
        m.assignedWeaponId === weapon.id ? { ...m, assignedWeaponId: null } : m
      ),
      statistics: {
        ...s.statistics,
        weaponsSold: s.statistics.weaponsSold + 1,
        totalMoneyEarned: s.statistics.totalMoneyEarned + resaleValue
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header and Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-neutral-100 flex items-center gap-2">
            <Package className="text-emerald-500" size={24} />
            <span>Black Market & Munitions Exchange</span>
          </h2>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            Regional black markets, surplus depots, and clandestine ammunition pipelines.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded font-mono text-xs">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('weapons');
            }}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'weapons'
                ? 'bg-emerald-600 text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Arms Catalog
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('ammo');
            }}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'ammo'
                ? 'bg-emerald-600 text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Ammunition Depot
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('sell');
            }}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'sell'
                ? 'bg-emerald-600 text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Liquidate Surplus
          </button>
        </div>
      </div>

      {/* View 1: Weapon Catalog */}
      {activeTab === 'weapons' && (
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900">
            <img
              src={PHOTO_ASSETS.tacticalArmory}
              alt="Underground Arms Bazaar"
              referrerPolicy="no-referrer"
              className="w-full h-28 sm:h-36 object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent p-4 flex flex-col justify-end">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                CLANDESTINE ARMS BAZAAR // ROTATING INVENTORY
              </span>
              <p className="text-xs text-neutral-300 font-sans">
                Authentic military surplus, covert imports, and match-grade custom weapons.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.market.map(item => {
              const canAfford = state.cash >= item.price;
              return (
                <div
                  key={item.id}
                  className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg flex flex-col justify-between"
                >
                  <div>
                    {/* Weapon Graphic */}
                    <div className="w-full h-28 bg-neutral-950 rounded overflow-hidden border border-neutral-800 mb-2.5 flex items-center justify-center p-1">
                      <EntityImage
                        src={item.image}
                        alt={item.model}
                        type="weapon"
                        category={item.category}
                        model={item.model}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <span className="font-display font-bold text-sm text-neutral-100 block">
                          {item.model}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-500 uppercase">
                          {item.source} · {item.category}
                        </span>
                      </div>

                      <div className="text-right font-mono text-xs">
                        <span className="text-emerald-400 font-bold block text-sm">
                          ${item.price.toLocaleString()}
                        </span>
                        {item.discountPercent !== 0 && (
                          <span
                            className={`text-[10px] font-semibold ${
                              item.discountPercent < 0 ? 'text-emerald-500' : 'text-rose-400'
                            }`}
                          >
                            {item.discountPercent < 0
                              ? `${item.discountPercent}% Deal`
                              : `+${item.discountPercent}% Premium`}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-neutral-400 font-sans leading-relaxed mb-3">
                      {item.description}
                    </p>

                    <div className="grid grid-cols-3 gap-2 bg-neutral-950 p-2.5 rounded border border-neutral-800 text-[11px] font-mono text-neutral-300 mb-3">
                      <div>Dmg: <strong className="text-rose-400">{item.damage}</strong></div>
                      <div>Acc: <strong className="text-blue-400">{item.accuracy}</strong></div>
                      <div>Cond: <strong className="text-emerald-400">{item.condition}%</strong></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-neutral-500">
                      In Stock: {item.supply} units
                    </span>
                    <button
                      disabled={!canAfford}
                      onClick={() => handleBuyWeapon(item)}
                      className={`px-4 py-1.5 rounded font-display font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                        canAfford
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-neutral-950 cursor-pointer shadow-md'
                          : 'bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <ShoppingCart size={13} />
                      <span>Purchase</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View 2: Ammunition Depot */}
      {activeTab === 'ammo' && (
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900">
            <img
              src={PHOTO_ASSETS.ammoDepot}
              alt="Munitions Depot"
              referrerPolicy="no-referrer"
              className="w-full h-28 sm:h-36 object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent p-4 flex flex-col justify-end">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
                MUNITIONS EXCHANGE // BULK SUPPLY CONTRACTS
              </span>
              <p className="text-xs text-neutral-300 font-sans">
                Mil-spec boxed ammunition, sealed spam cans, and armor-piercing ordnance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(AMMO_BASE_PRICES) as AmmoType[]).map(type => {
              const info = AMMO_BASE_PRICES[type];
              const currentStock = state.ammunition[type]?.count || 0;
              const singleCost = Math.round(info.boxSize * info.pricePerUnit);
              const bulkCost = Math.round(info.boxSize * 5 * info.pricePerUnit);

              return (
                <div
                  key={type}
                  className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg flex flex-col justify-between"
                >
                  <div>
                    {/* Ammo Packaging Image */}
                    <div className="w-full h-28 bg-neutral-950 rounded overflow-hidden border border-neutral-800 mb-2.5 flex items-center justify-center p-1">
                      <EntityImage
                        src={info.image}
                        alt={info.name}
                        type="ammo"
                        caliber={type}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-display font-bold text-sm text-neutral-100">
                          {info.name}
                        </h3>
                        <span className="text-[10px] font-mono text-neutral-500 uppercase">
                          ${info.pricePerUnit}/round
                        </span>
                      </div>

                      <div className="text-right font-mono text-xs">
                        <span className="text-neutral-500 text-[10px] block">CURRENT ARMORY</span>
                        <span className="text-amber-400 font-bold text-sm">
                          {currentStock.toLocaleString()} rds
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-neutral-400">1 Box ({info.boxSize} rds):</span>
                      <button
                        disabled={state.cash < singleCost}
                        onClick={() => handleBuyAmmo(type, 1)}
                        className="px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-emerald-400 border border-neutral-700 cursor-pointer"
                      >
                        Buy (${singleCost})
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-neutral-400">5 Boxes ({info.boxSize * 5} rds):</span>
                      <button
                        disabled={state.cash < bulkCost}
                        onClick={() => handleBuyAmmo(type, 5)}
                        className="px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-emerald-400 border border-neutral-700 cursor-pointer"
                      >
                        Bulk (${bulkCost})
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View 3: Sell Surplus Weapons */}
      {activeTab === 'sell' && (
        <div className="space-y-3">
          <div className="text-xs font-mono text-neutral-400 bg-neutral-950 p-3 rounded border border-neutral-800">
            Liquidate surplus weaponry from your armory to shady fence brokers. Yields ~65% of current market value.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {state.weapons.map(weapon => {
              const resaleValue = Math.round(weapon.value * (weapon.condition / 100) * 0.65);
              return (
                <div
                  key={weapon.id}
                  className="bg-neutral-900 border border-neutral-800 p-3.5 rounded flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-12 bg-neutral-950 rounded border border-neutral-800 p-1 flex items-center justify-center">
                      <EntityImage
                        src={weapon.image}
                        alt={weapon.model}
                        type="weapon"
                        category={weapon.category}
                        model={weapon.model}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <span className="font-display font-semibold text-xs text-neutral-100 block">
                        {weapon.model}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {weapon.id} · {weapon.condition}% Cond
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSellWeapon(weapon)}
                    className="px-3 py-1.5 rounded font-mono text-xs bg-neutral-800 hover:bg-rose-950 text-rose-300 border border-neutral-700 hover:border-rose-700 transition-colors cursor-pointer"
                  >
                    Sell (+${resaleValue.toLocaleString()})
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
