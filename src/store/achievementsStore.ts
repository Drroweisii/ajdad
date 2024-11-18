import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useGameStore } from './gameStore';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'coins' | 'miners' | 'power';
  completed: boolean;
}

interface AchievementsState {
  achievements: Achievement[];
  checkAchievements: () => void;
  getProgress: (achievement: Achievement) => number;
}

export const useAchievementsStore = create<AchievementsState>()(
  persist(
    (set, get) => ({
      achievements: [
        {
          id: 'first-miner',
          title: 'First Steps',
          description: 'Purchase your first miner',
          icon: '👷',
          requirement: 1,
          type: 'miners',
          completed: false,
        },
        {
          id: 'coin-collector',
          title: 'Coin Collector',
          description: 'Earn 1,000 coins',
          icon: '💰',
          requirement: 1000,
          type: 'coins',
          completed: false,
        },
        {
          id: 'power-player',
          title: 'Power Player',
          description: 'Reach 10 total mining power',
          icon: '⚡',
          requirement: 10,
          type: 'power',
          completed: false,
        },
      ],

      checkAchievements: () => {
        const { coins, miners, totalPower } = useGameStore.getState();
        const currentAchievements = get().achievements;
        let updated = false;

        const newAchievements = currentAchievements.map(achievement => {
          if (achievement.completed) return achievement;

          let completed = false;
          switch (achievement.type) {
            case 'coins':
              completed = coins >= achievement.requirement;
              break;
            case 'miners':
              completed = miners.length >= achievement.requirement;
              break;
            case 'power':
              completed = totalPower >= achievement.requirement;
              break;
          }

          if (completed && !achievement.completed) {
            updated = true;
            return { ...achievement, completed };
          }
          return achievement;
        });

        if (updated) {
          set({ achievements: newAchievements });
        }
      },

      getProgress: (achievement: Achievement) => {
        const { coins, miners, totalPower } = useGameStore.getState();
        switch (achievement.type) {
          case 'coins':
            return Math.min(100, (coins / achievement.requirement) * 100);
          case 'miners':
            return Math.min(100, (miners.length / achievement.requirement) * 100);
          case 'power':
            return Math.min(100, (totalPower / achievement.requirement) * 100);
          default:
            return 0;
        }
      },
    }),
    {
      name: 'emsx-miner-achievements',
      version: 1,
    }
  )
);