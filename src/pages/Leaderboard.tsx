import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Coins, Users, Zap } from 'lucide-react';
import { useLeaderboardStore } from '../store/leaderboardStore';

function Leaderboard() {
  const { getTopScores, playerName, setPlayerName } = useLeaderboardStore();
  const topScores = getTopScores();

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm"
            maxLength={20}
          />
        </div>
      </div>

      <div className="space-y-4">
        {topScores.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-gray-400' :
                  index === 2 ? 'bg-amber-700' : 'bg-gray-700'
                }`}>
                  {index < 3 ? <Trophy className="w-4 h-4 text-gray-900" /> : (index + 1)}
                </div>
                <span className="font-semibold">{entry.playerName}</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <Coins className="w-4 h-4 mr-1" />
                  {entry.coins.toFixed(0)}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {entry.miners}
                </div>
                <div className="flex items-center">
                  <Zap className="w-4 h-4 mr-1" />
                  {entry.totalPower.toFixed(1)}
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {new Date(entry.timestamp).toLocaleDateString()}
            </div>
          </motion.div>
        ))}

        {topScores.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No scores yet. Start mining to compete!
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;