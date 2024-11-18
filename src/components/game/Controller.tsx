import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, DollarSign, Gem, Plus } from 'lucide-react';
import { useMinerStore, CurrencyType } from '../../store/minerStore';
import { useSound } from '../../hooks/useSound';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';

const MINER_CONFIGS = {
  EMSX: {
    icon: Coins,
    color: 'bg-blue-600 hover:bg-blue-700',
    iconColor: 'text-blue-300',
    label: 'EMSX Miner',
  },
  USDT: {
    icon: DollarSign,
    color: 'bg-green-600 hover:bg-green-700',
    iconColor: 'text-green-300',
    label: 'USDT Miner',
  },
  TON: {
    icon: Gem,
    color: 'bg-purple-600 hover:bg-purple-700',
    iconColor: 'text-purple-300',
    label: 'TON Miner',
  },
};

export function Controller() {
  const { addMiner, getMinerCost, balances } = useMinerStore();
  const { play } = useSound();
  const [loading, setLoading] = useState<CurrencyType | null>(null);
  const [error, setError] = useState<{ type: CurrencyType; message: string } | null>(null);

  const handlePurchase = async (type: CurrencyType) => {
    try {
      setLoading(type);
      setError(null);
      
      const success = addMiner(type);
      
      if (success) {
        play('purchase');
      } else {
        throw new Error('Failed to purchase miner');
      }
    } catch (err) {
      setError({ type, message: 'Failed to purchase miner' });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {(Object.keys(MINER_CONFIGS) as CurrencyType[]).map((type) => {
          const config = MINER_CONFIGS[type];
          const Icon = config.icon;
          const cost = getMinerCost(type);
          const canAfford = balances[type] >= cost;
          const isLoading = loading === type;
          const hasError = error?.type === type;

          return (
            <motion.button
              key={type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePurchase(type)}
              disabled={!canAfford || isLoading}
              className={`${config.color} ${
                !canAfford || isLoading ? 'opacity-50 cursor-not-allowed' : ''
              } rounded-lg p-2 sm:p-4 text-white shadow-lg transition-colors`}
              aria-label={`Purchase ${config.label}`}
              aria-disabled={!canAfford || isLoading}
            >
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <span className="font-bold text-xs sm:text-base">{type}</span>
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Icon className={`w-4 h-4 sm:w-6 sm:h-6 ${config.iconColor}`} aria-hidden="true" />
                )}
              </div>
              <div className="flex items-center justify-between text-[10px] sm:text-sm">
                <span>{cost.toFixed(2)}</span>
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
              </div>
            </motion.button>
          );
        })}
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <ErrorMessage message={error.message} className="mt-2" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}