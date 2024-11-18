import React from 'react';
import { motion } from 'framer-motion';
import { Achievement } from '../../store/achievementsStore';

interface AchievementCardProps {
  achievement: Achievement;
  progress: number;
}

export function AchievementCard({ achievement, progress }: AchievementCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      role="article"
      aria-label={`${achievement.title} achievement - ${achievement.completed ? 'Completed' : `${progress.toFixed(0)}% complete`}`}
      className={`bg-gray-800 rounded-lg p-4 ${
        achievement.completed ? 'border border-green-500' : ''
      }`}
    >
      <div className="flex items-center mb-2">
        <span className="text-2xl mr-3" aria-hidden="true">{achievement.icon}</span>
        <div>
          <h3 className="font-bold">{achievement.title}</h3>
          <p className="text-sm text-gray-400">{achievement.description}</p>
        </div>
      </div>
      <div className="mt-3">
        <div 
          className="h-2 bg-gray-700 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full ${
              achievement.completed ? 'bg-green-500' : 'bg-blue-500'
            }`}
          />
        </div>
        <p className="text-right text-xs text-gray-400 mt-1">
          {progress.toFixed(0)}%
        </p>
      </div>
    </motion.div>
  );
}