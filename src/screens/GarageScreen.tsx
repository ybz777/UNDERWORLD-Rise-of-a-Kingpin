import React, { useState } from 'react';
import { GameState, Vehicle } from '../game/types';
import { VEHICLE_CATALOG } from '../data/vehicles';
import { sounds } from '../game/audio';
import { EntityImage } from '../components/EntityImage';
import {
  Car,
  Shield,
  Gauge,
  Package,
  Wrench,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Truck
} from 'lucide-react';

interface GarageScreenProps {
  state: GameState;
  onUpdateState: (updater: (prev: GameState) => GameState) => void;
}

export const GarageScreen: React.FC<GarageScreenProps> = ({
  state,
  onUpdateState
}) => {
  const [activeTab, setActiveTab] = useState<'fleet' | 'dealership'>('fleet');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    state.vehicles[0]?.id || null
  );

  const selectedVehicle =
    state.vehicles.find(v => v.id === selectedVehicleId) || state.vehicles[0];

  const totalOperatingCost = state.vehicles.reduce((acc, v) => acc + v.dailyOperatingCost, 0);
  const totalCargoCapacity = state.vehicles.reduce((acc, v) => acc + v.cargoCapacity, 0);
  const avgFleetSpeed =
    state.vehicles.length > 0
      ? Math.round(state.vehicles.reduce((acc, v) => acc + v.speed, 0) / state.vehicles.length)
      : 0;

  // Repair Vehicle
  const handleRepairVehicle = (vehicle: Vehicle) => {
    if (vehicle.condition >= 98) return;
    const repairCost = Math.round((100 - vehicle.condition) * 45 + 120);
    if (state.cash < repairCost) return;

    sounds.playGunRack();
    onUpdateState(s => ({
      ...s,
      cash: s.cash - repairCost,
      vehicles: s.vehicles.map(v =>
        v.id === vehicle.id ? { ...v, condition: 98 } : v
      ),
      statistics: {
        ...s.statistics,
        totalMoneySpent: s.statistics.totalMoneySpent + repairCost
      }
    }));
  };

  // Buy Vehicle from Dealership
  const handleBuyVehicle = (template: typeof VEHICLE_CATALOG[0]) => {
    if (state.cash < template.purchaseCost) return;

    sounds.playCash();
    const newVehicle: Vehicle = {
      ...template,
      id: `veh_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      isOwned: true,
      assignedOperationId: null
    };

    onUpdateState(s => ({
      ...s,
      cash: s.cash - template.purchaseCost,
      vehicles: [...s.vehicles, newVehicle],
      statistics: {
        ...s.statistics,
        vehiclesAcquired: s.statistics.vehiclesAcquired + 1,
        totalMoneySpent: s.statistics.totalMoneySpent + template.purchaseCost
      }
    }));
  };

  // Sell Vehicle
  const handleSellVehicle = (vehicle: Vehicle) => {
    if (state.vehicles.length <= 1) return; // Keep at least 1 vehicle
    const saleCash = Math.round(vehicle.resaleValue * (vehicle.condition / 100));

    sounds.playCash();
    onUpdateState(s => ({
      ...s,
      cash: s.cash + saleCash,
      vehicles: s.vehicles.filter(v => v.id !== vehicle.id),
      statistics: {
        ...s.statistics,
        totalMoneyEarned: s.statistics.totalMoneyEarned + saleCash
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header and Aggregate Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-neutral-100 flex items-center gap-2">
            <Car className="text-blue-400" size={24} />
            <span>Motor Pool & Tactical Garage</span>
          </h2>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            Vehicles provide high-speed getaway evasion, ballistic shielding, and cargo transit logistics.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded font-mono text-xs">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('fleet');
            }}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'fleet'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Syndicate Fleet ({state.vehicles.length})
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('dealership');
            }}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'dealership'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Motor Dealership
          </button>
        </div>
      </div>

      {/* Fleet KPI Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="bg-neutral-900 border border-neutral-800 p-3 rounded">
          <span className="text-neutral-500 text-[10px] uppercase block">Fleet Mobility Index</span>
          <span className="text-blue-400 font-bold text-base mt-0.5">{avgFleetSpeed} KPH Avg</span>
          <span className="text-neutral-400 text-[10px]">Boosts getaway evasion</span>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 p-3 rounded">
          <span className="text-neutral-500 text-[10px] uppercase block">Total Cargo Capacity</span>
          <span className="text-emerald-400 font-bold text-base mt-0.5">{totalCargoCapacity} KG</span>
          <span className="text-neutral-400 text-[10px]">Freight & contraband</span>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 p-3 rounded">
          <span className="text-neutral-500 text-[10px] uppercase block">Fleet Operating Cost</span>
          <span className="text-rose-400 font-bold text-base mt-0.5">-${totalOperatingCost}/day</span>
          <span className="text-neutral-400 text-[10px]">Fuel & maintenance</span>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 p-3 rounded">
          <span className="text-neutral-500 text-[10px] uppercase block">Active Fleet Size</span>
          <span className="text-neutral-100 font-bold text-base mt-0.5">{state.vehicles.length} Units</span>
          <span className="text-neutral-400 text-[10px]">Ready for deployment</span>
        </div>
      </div>

      {/* View 1: Owned Fleet Roster */}
      {activeTab === 'fleet' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[700px] overflow-y-auto pr-1">
            {state.vehicles.map(veh => {
              const isSelected = selectedVehicle?.id === veh.id;
              return (
                <div
                  key={veh.id}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedVehicleId(veh.id);
                  }}
                  className={`p-3.5 rounded border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-neutral-900 border-blue-500 ring-1 ring-blue-500/40 shadow-lg'
                      : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/60'
                  }`}
                >
                  <div>
                    {/* Vehicle Image */}
                    <div className="w-full h-28 bg-neutral-950 rounded overflow-hidden border border-neutral-800 mb-2 flex items-center justify-center">
                      <EntityImage
                        src={veh.image}
                        alt={veh.name}
                        type="vehicle"
                        category={veh.category}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <span className="font-display font-bold text-sm text-neutral-100 block">
                          {veh.name}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400">
                          {veh.category} · Cap: {veh.passengerCapacity} pax
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-neutral-300">
                        ${veh.resaleValue.toLocaleString()}
                      </span>
                    </div>

                    {/* Condition Bar */}
                    <div className="space-y-1 mb-2">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-neutral-400">Condition</span>
                        <span className={veh.condition > 75 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                          {veh.condition}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden border border-neutral-800">
                        <div
                          className="h-full bg-emerald-500"
                          style={{ width: `${veh.condition}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                    <span>Speed: {veh.speed}</span>
                    <span>Armor: {veh.armorRating}%</span>
                    <span>Cost: ${veh.dailyOperatingCost}/d</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vehicle Inspection Bay */}
          <div className="lg:col-span-5">
            {selectedVehicle ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4 sticky top-16">
                <div>
                  <div className="w-full h-40 bg-neutral-950 rounded-lg overflow-hidden border border-neutral-800 mb-3">
                    <EntityImage
                      src={selectedVehicle.image}
                      alt={selectedVehicle.name}
                      type="vehicle"
                      category={selectedVehicle.category}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xs font-mono text-neutral-500 uppercase">
                    FLEET ASSET · {selectedVehicle.category}
                  </div>
                  <h3 className="text-xl font-display font-bold text-neutral-100">
                    {selectedVehicle.name}
                  </h3>
                </div>

                <div className="bg-neutral-950 p-4 rounded border border-neutral-800 space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Top Speed Evasion:</span>
                    <span className="text-blue-400 font-bold">{selectedVehicle.speed} / 100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Ballistic Armor Plating:</span>
                    <span className="text-amber-400 font-bold">{selectedVehicle.armorRating} / 100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Passenger Capacity:</span>
                    <span className="text-neutral-200">{selectedVehicle.passengerCapacity} Operatives</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Cargo Payload:</span>
                    <span className="text-neutral-200">{selectedVehicle.cargoCapacity} KG</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Daily Maintenance:</span>
                    <span className="text-rose-400 font-bold">${selectedVehicle.dailyOperatingCost}/day</span>
                  </div>
                </div>

                {/* Maintenance & Sale */}
                <div className="space-y-2 pt-2">
                  {selectedVehicle.condition < 98 ? (
                    <button
                      onClick={() => handleRepairVehicle(selectedVehicle)}
                      className="w-full py-2.5 rounded font-mono text-xs bg-neutral-950 border border-neutral-700 hover:border-blue-500 text-blue-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Wrench size={14} />
                      <span>
                        Service & Repair Vehicle (${Math.round((100 - selectedVehicle.condition) * 45 + 120)})
                      </span>
                    </button>
                  ) : (
                    <div className="text-xs font-mono text-emerald-400 text-center flex items-center justify-center gap-1 py-1">
                      <CheckCircle2 size={14} /> Vehicle Mechanically Pristine
                    </div>
                  )}

                  <button
                    disabled={state.vehicles.length <= 1}
                    onClick={() => handleSellVehicle(selectedVehicle)}
                    className="w-full py-2 rounded font-mono text-xs bg-neutral-950 hover:bg-rose-950 text-rose-400 border border-neutral-800 hover:border-rose-800 transition-colors cursor-pointer"
                  >
                    Sell to Chop Shop (+${Math.round(selectedVehicle.resaleValue * (selectedVehicle.condition / 100)).toLocaleString()})
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* View 2: Motor Dealership */}
      {activeTab === 'dealership' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {VEHICLE_CATALOG.map(veh => {
            const canAfford = state.cash >= veh.purchaseCost;
            return (
              <div
                key={veh.id}
                className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-32 bg-neutral-950 rounded overflow-hidden border border-neutral-800 mb-2">
                    <EntityImage
                      src={veh.image}
                      alt={veh.name}
                      type="vehicle"
                      category={veh.category}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <h3 className="font-display font-bold text-sm text-neutral-100">
                        {veh.name}
                      </h3>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {veh.category} · Cap: {veh.passengerCapacity} pax
                      </span>
                    </div>

                    <span className="font-mono text-xs font-bold text-emerald-400">
                      ${veh.purchaseCost.toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 bg-neutral-950 p-2 rounded border border-neutral-800 text-[10px] font-mono text-neutral-300 mb-3">
                    <div>Speed: <strong className="text-blue-400">{veh.speed}</strong></div>
                    <div>Armor: <strong className="text-amber-400">{veh.armorRating}</strong></div>
                    <div>Cargo: <strong className="text-neutral-100">{veh.cargoCapacity}kg</strong></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-500">
                    Upkeep: ${veh.dailyOperatingCost}/d
                  </span>
                  <button
                    disabled={!canAfford}
                    onClick={() => handleBuyVehicle(veh)}
                    className={`px-4 py-1.5 rounded font-display font-bold text-xs uppercase tracking-wider transition-colors ${
                      canAfford
                        ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shadow-md'
                        : 'bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-60'
                    }`}
                  >
                    Acquire Vehicle
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
