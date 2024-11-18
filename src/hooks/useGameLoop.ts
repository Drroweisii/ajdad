import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { useAchievementsStore } from '../store/achievementsStore';
import { useEventsStore } from '../store/eventsStore';
import { useLeaderboardStore } from '../store/leaderboardStore';

export function useGameLoop() {
  const calculateEarnings = useGameStore((state) => state.calculateEarnings);
  const checkAchievements = useAchievementsStore((state) => state.checkAchievements);
  const triggerRandomEvent = useEventsStore((state) => state.triggerRandomEvent);
  const getEventMultiplier = useEventsStore((state) => state.getEventMultiplier);
  const submitScore = useLeaderboardStore((state) => state.submitScore);
  
  const frameRef = useRef<number>();
  const lastEventCheck = useRef(Date.now());
  const lastScoreSubmit = useRef(Date.now());

  useEffect(() => {
    function gameLoop() {
      // Get current multipliers from active events
      const powerMult = getEventMultiplier('powerBoost');
      const coinMult = getEventMultiplier('coinRush');
      const efficiencyMult = getEventMultiplier('efficiency');

      // Calculate earnings with current multipliers
      calculateEarnings(powerMult, coinMult, efficiencyMult);
      checkAchievements();

      // Check for random events every 30 seconds
      const now = Date.now();
      if (now - lastEventCheck.current >= 30000) {
        triggerRandomEvent();
        lastEventCheck.current = now;
      }

      // Submit score every minute
      if (now - lastScoreSubmit.current >= 60000) {
        submitScore();
        lastScoreSubmit.current = now;
      }

      frameRef.current = requestAnimationFrame(gameLoop);
    }

    frameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [calculateEarnings, checkAchievements, triggerRandomEvent, getEventMultiplier, submitScore]);
}