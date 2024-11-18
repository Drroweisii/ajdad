import React from 'react';
import { motion } from 'framer-motion';
import { Coins, DollarSign, Gem } from 'lucide-react';
import { useMinerStore, CurrencyType } from '../../store/minerStore';

const CURRENCY_ICONS = {
  EMSX: Coins,
  USDT: DollarSign,
  TON: Gem,
};

const CURRENCY_COLORS = {
  EMSX: 'from-blue-500 to-blue-600',
  USDT: 'from-green-500 to-green-600',
  TON: 'from-purple-500 to-purple-600',
};

export function GameStats() {
  const { balances, miningRates } = useMinerStore();

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
      {(Object.keys(balances) as CurrencyType[]).map((currency) => {
        const Icon = CURRENCY_ICONS[currency];
        const gradientColor = CURRENCY_COLORS[currency];

        return (
          <motion.div
            key={currency}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br ${gradientColor} rounded-lg p-2 sm:p-4 shadow-lg`}
          >
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <span className="text-sm sm:text-lg font-bold">{currency}</span>
              <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <div className="text-lg sm:text-2xl font-bold">
                {balances[currency].toFixed(2)}
              </div>
              <div className="text-xs sm:text-sm opacity-80">
                {miningRates[currency].toFixed(3)}/s
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}