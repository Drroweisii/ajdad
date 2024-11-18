import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Miner as MinerComponent } from './Miner';
import { useMinerStore } from '../../store/minerStore';
import { useSound } from '../../hooks/useSound';

export function GameBoard() {
  const { miners, mergeMiner, canMerge, getMergeableMiners } = useMinerStore();
  const [selectedMinerId, setSelectedMinerId] = useState<string | null>(null);
  const [mergeableMiners, setMergeableMiners] = useState<string[]>([]);
  const { play } = useSound();

  const handleMinerClick = useCallback((minerId: string) => {
    if (!selectedMinerId) {
      // First miner selection
      const mergeables = getMergeableMiners(minerId);
      setSelectedMinerId(minerId);
      setMergeableMiners(mergeables);
    } else if (selectedMinerId === minerId) {
      // Deselect if clicking the same miner
      setSelectedMinerId(null);
      setMergeableMiners([]);
    } else {
      // Attempt to merge with second miner
      if (canMerge(selectedMinerId, minerId)) {
        const success = mergeMiner(selectedMinerId, minerId);
        if (success) {
          play('upgrade');
        }
      }
      setSelectedMinerId(null);
      setMergeableMiners([]);
    }
  }, [selectedMinerId, canMerge, mergeMiner, getMergeableMiners, play]);

  const getCellStyles = useCallback((index: number) => {
    const miner = miners.find(m => m.position === index);
    const isSelected = miner?.id === selectedMinerId;
    const isMergeable = miner && mergeableMiners.includes(miner.id);
    
    let borderColor = 'border-gray-700';
    if (isSelected) borderColor = 'border-blue-500';
    else if (isMergeable) borderColor = 'border-green-500';
    
    return `w-full h-full rounded-lg border-2 ${borderColor} bg-gray-900 p-2 transition-colors duration-200`;
  }, [miners, selectedMinerId, mergeableMiners]);

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 sm:gap-4">
        {Array.from({ length: 20 }, (_, index) => {
          const miner = miners.find((m) => m.position === index);
          const isMergeable = miner && mergeableMiners.includes(miner.id);
          const isSelected = miner?.id === selectedMinerId;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="aspect-square"
            >
              <div 
                className={getCellStyles(index)}
                onClick={() => miner && handleMinerClick(miner.id)}
              >
                {miner && (
                  <MinerComponent 
                    miner={miner}
                    isSelected={isSelected}
                    isMergeable={isMergeable}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedMinerId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-4 text-center text-sm text-blue-400"
          >
            Select another miner of the same type and level to merge
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}