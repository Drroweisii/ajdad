import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Miner {
  id: string;
  level: number;
  power: number;
  efficiency: number;
}

interface GameState {
  coins: number;
  miners: Miner[];
  totalPower: number;
  lastUpdate: number;
  addCoins: (amount: number) => void;
  purchaseMiner: () => boolean;
  upgradeMiner: (minerId: string) => boolean;
  calculateEarnings: (powerMult: number, coinMult: number, efficiencyMult: number) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      coins: 0,
      miners: [],
      totalPower: 0,
      lastUpdate: Date.now(),

      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),

      purchaseMiner: () => {
        const state = get();
        const minerCost = 10 * (state.miners.length + 1);

        if (state.coins >= minerCost) {
          const newMiner: Miner = {
            id: crypto.randomUUID(),
            level: 1,
            power: 1,
            efficiency: 1,
          };

          set((state) => ({
            coins: state.coins - minerCost,
            miners: [...state.miners, newMiner],
            totalPower: state.totalPower + newMiner.power,
          }));
          return true;
        }
        return false;
      },

      upgradeMiner: (minerId) => {
        const state = get();
        const minerIndex = state.miners.findIndex((m) => m.id === minerId);
        
        if (minerIndex === -1) return false;

        const miner = state.miners[minerIndex];
        const upgradeCost = 20 * miner.level;

        if (state.coins >= upgradeCost) {
          const updatedMiner = {
            ...miner,
            level: miner.level + 1,
            power: miner.power * 1.5,
            efficiency: miner.efficiency * 1.2,
          };

          const newMiners = [...state.miners];
          newMiners[minerIndex] = updatedMiner;

          set((state) => ({
            coins: state.coins - upgradeCost,
            miners: newMiners,
            totalPower: newMiners.reduce((total, m) => total + m.power, 0),
          }));
          return true;
        }
        return false;
      },

      calculateEarnings: (powerMult = 1, coinMult = 1, efficiencyMult = 1) => {
        const state = get();
        const now = Date.now();
        const timeDiff = (now - state.lastUpdate) / 1000; // Convert to seconds

        const earnings = state.miners.reduce((total, miner) => {
          const power = miner.power * powerMult;
          const efficiency = miner.efficiency * efficiencyMult;
          return total + (power * efficiency * timeDiff);
        }, 0) * coinMult;

        if (earnings > 0) {
          set((state) => ({
            coins: state.coins + earnings,
            lastUpdate: now,
          }));
        }
      },
    }),
    {
      name: 'emsx-miner-storage',
      version: 1,
    }
  )
);