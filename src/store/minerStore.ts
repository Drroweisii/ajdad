import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSound } from '../hooks/useSound';

export type CurrencyType = 'EMSX' | 'USDT' | 'TON';

export interface Miner {
  id: string;
  type: CurrencyType;
  level: number;
  miningRate: number;
  position: number;
}

interface MinerState {
  miners: Miner[];
  balances: Record<CurrencyType, number>;
  miningRates: Record<CurrencyType, number>;
  lastUpdate: number;
  addMiner: (type: CurrencyType) => boolean;
  updateBalances: () => void;
  getMinerCost: (type: CurrencyType) => number;
  moveMiner: (minerId: string, newPosition: number) => void;
  mergeMiner: (sourceId: string, targetId: string) => boolean;
  calculateMiningRate: (type: CurrencyType, level: number) => number;
  canMerge: (sourceId: string, targetId: string) => boolean;
  getMergeableMiners: (minerId: string) => string[];
}

const MINER_BASE_COSTS: Record<CurrencyType, number> = {
  EMSX: 100,
  USDT: 150,
  TON: 200,
};

const MINER_BASE_RATES: Record<CurrencyType, number> = {
  EMSX: 0.05,
  USDT: 0.03,
  TON: 0.02,
};

const MAX_LEVEL = 20;

export const useMinerStore = create<MinerState>()(
  persist(
    (set, get) => ({
      miners: [],
      balances: {
        EMSX: 1000,
        USDT: 500,
        TON: 250,
      },
      miningRates: {
        EMSX: 0,
        USDT: 0,
        TON: 0,
      },
      lastUpdate: Date.now(),

      calculateMiningRate: (type: CurrencyType, level: number) => {
        return MINER_BASE_RATES[type] * Math.pow(2, level - 1);
      },

      canMerge: (sourceId: string, targetId: string) => {
        const { miners } = get();
        const sourceMiner = miners.find(m => m.id === sourceId);
        const targetMiner = miners.find(m => m.id === targetId);

        if (!sourceMiner || !targetMiner) return false;
        if (sourceMiner.id === targetId) return false;
        if (sourceMiner.type !== targetMiner.type) return false;
        if (sourceMiner.level !== targetMiner.level) return false;
        if (sourceMiner.level >= MAX_LEVEL) return false;

        return true;
      },

      getMergeableMiners: (minerId: string) => {
        const { miners } = get();
        const sourceMiner = miners.find(m => m.id === minerId);
        if (!sourceMiner) return [];

        return miners
          .filter(m => 
            m.id !== minerId && 
            m.type === sourceMiner.type && 
            m.level === sourceMiner.level &&
            sourceMiner.level < MAX_LEVEL
          )
          .map(m => m.id);
      },

      addMiner: (type) => {
        const { miners, balances } = get();
        const cost = get().getMinerCost(type);

        if (balances[type] < cost || miners.length >= 20) {
          return false;
        }

        const availablePositions = Array.from({ length: 20 }, (_, i) => i)
          .filter(pos => !miners.some(m => m.position === pos));

        if (availablePositions.length === 0) return false;

        const position = availablePositions[Math.floor(Math.random() * availablePositions.length)];
        const miningRate = get().calculateMiningRate(type, 1);

        const newMiner: Miner = {
          id: crypto.randomUUID(),
          type,
          level: 1,
          miningRate,
          position,
        };

        set(state => ({
          miners: [...state.miners, newMiner],
          balances: {
            ...state.balances,
            [type]: state.balances[type] - cost,
          },
          miningRates: {
            ...state.miningRates,
            [type]: state.miningRates[type] + miningRate,
          },
        }));

        return true;
      },

      moveMiner: (minerId, newPosition) => {
        const { miners } = get();
        const miner = miners.find(m => m.id === minerId);
        if (!miner) return;

        const isOccupied = miners.some(m => m.id !== minerId && m.position === newPosition);
        if (isOccupied) return;

        set(state => ({
          miners: state.miners.map(m => 
            m.id === minerId ? { ...m, position: newPosition } : m
          ),
        }));
      },

      mergeMiner: (sourceId, targetId) => {
        const { miners } = get();
        if (!get().canMerge(sourceId, targetId)) return false;

        const sourceMiner = miners.find(m => m.id === sourceId)!;
        const targetMiner = miners.find(m => m.id === targetId)!;

        const newLevel = sourceMiner.level + 1;
        const newMiningRate = get().calculateMiningRate(sourceMiner.type, newLevel);

        const newMiner: Miner = {
          id: crypto.randomUUID(),
          type: sourceMiner.type,
          level: newLevel,
          miningRate: newMiningRate,
          position: targetMiner.position,
        };

        // Calculate new mining rates
        const remainingMiners = miners.filter(m => m.id !== sourceId && m.id !== targetId);
        const newTotalRate = remainingMiners
          .filter(m => m.type === sourceMiner.type)
          .reduce((total, m) => total + m.miningRate, 0) + newMiningRate;

        set(state => ({
          miners: [...remainingMiners, newMiner],
          miningRates: {
            ...state.miningRates,
            [sourceMiner.type]: newTotalRate,
          },
        }));

        return true;
      },

      updateBalances: () => {
        const now = Date.now();
        const { lastUpdate, miners } = get();
        const timeDiff = (now - lastUpdate) / 1000;

        const newRates: Record<CurrencyType, number> = {
          EMSX: 0,
          USDT: 0,
          TON: 0,
        };

        miners.forEach(miner => {
          newRates[miner.type] += miner.miningRate;
        });

        set(state => ({
          balances: {
            EMSX: state.balances.EMSX + newRates.EMSX * timeDiff,
            USDT: state.balances.USDT + newRates.USDT * timeDiff,
            TON: state.balances.TON + newRates.TON * timeDiff,
          },
          miningRates: newRates,
          lastUpdate: now,
        }));
      },

      getMinerCost: (type) => {
        const { miners } = get();
        const typeCount = miners.filter(m => m.type === type).length;
        return MINER_BASE_COSTS[type] * Math.pow(1.5, typeCount);
      },
    }),
    {
      name: 'emsx-miner-storage',
      version: 1,
    }
  )
);