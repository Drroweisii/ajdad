import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useGameStore } from './gameStore';

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  coins: number;
  miners: number;
  totalPower: number;
  timestamp: number;
}

interface LeaderboardState {
  entries: LeaderboardEntry[];
  playerName: string;
  setPlayerName: (name: string) => void;
  submitScore: () => void;
  getTopScores: (limit?: number) => LeaderboardEntry[];
}

export const useLeaderboardStore = create<LeaderboardState>()(
  persist(
    (set, get) => ({
      entries: [],
      playerName: 'Player',

      setPlayerName: (name: string) => {
        if (!name.trim()) return;
        set({ playerName: name.trim() });
      },

      submitScore: () => {
        const gameState = useGameStore.getState();
        const { playerName, entries } = get();

        const newEntry: LeaderboardEntry = {
          id: crypto.randomUUID(),
          playerName,
          coins: gameState.coins,
          miners: gameState.miners.length,
          totalPower: gameState.totalPower,
          timestamp: Date.now(),
        };

        // Keep only the latest 100 entries, sorted by coins
        set({
          entries: [...entries, newEntry]
            .sort((a, b) => b.coins - a.coins)
            .slice(0, 100),
        });
      },

      getTopScores: (limit = 10) => {
        return get().entries
          .sort((a, b) => b.coins - a.coins)
          .slice(0, limit);
      },
    }),
    {
      name: 'emsx-miner-leaderboard',
      version: 1,
    }
  )
);