import React, { useEffect } from 'react';
import { GameStats } from '../components/game/GameStats';
import { GameBoard } from '../components/game/GameBoard';
import { Controller } from '../components/game/Controller';
import { useMinerStore } from '../store/minerStore';

function Game() {
  const updateBalances = useMinerStore((state) => state.updateBalances);

  useEffect(() => {
    const interval = setInterval(() => {
      updateBalances();
    }, 100); // Update every 100ms for smooth updates

    return () => clearInterval(interval);
  }, [updateBalances]);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <GameStats />
      <GameBoard />
      <Controller />
    </div>
  );
}

export default Game;