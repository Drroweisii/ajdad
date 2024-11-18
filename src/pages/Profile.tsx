import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Coins, Activity, Save, AlertCircle } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useAchievementsStore } from '../store/achievementsStore';
import { AchievementCard } from '../components/achievements/AchievementCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

function Profile() {
  const { coins, miners, totalPower } = useGameStore();
  const { achievements, getProgress } = useAchievementsStore();
  const [playerName, setPlayerName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stats = [
    { icon: Coins, label: 'Total Coins', value: coins.toFixed(2) },
    { icon: Trophy, label: 'Miners Owned', value: miners.length },
    { icon: Activity, label: 'Mining Power', value: totalPower.toFixed(1) },
  ];

  const completedAchievements = achievements.filter(a => a.completed).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setError('Player name cannot be empty');
      return;
    }
    
    try {
      setIsSaving(true);
      setError(null);
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save player name');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter player name"
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-blue-500"
              maxLength={20}
              aria-label="Player name"
              disabled={isSaving}
            />
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg text-sm flex items-center space-x-2 disabled:opacity-50"
              aria-label="Save player name"
            >
              {isSaving ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Save className="w-4 h-4" aria-hidden="true" />
              )}
              <span>Save</span>
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Edit Name
          </button>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <ErrorMessage message={error} />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="grid gap-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 p-4 rounded-lg flex items-center"
          >
            <Icon className="w-8 h-8 text-blue-400 mr-4" aria-hidden="true" />
            <div>
              <p className="text-gray-400 text-sm">{label}</p>
              <p className="text-xl font-bold">{value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Achievements</h2>
          <span className="text-sm text-gray-400" aria-label={`${completedAchievements} out of ${achievements.length} achievements completed`}>
            {completedAchievements} / {achievements.length}
          </span>
        </div>
        <div className="grid gap-4">
          {achievements.map(achievement => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              progress={getProgress(achievement)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;