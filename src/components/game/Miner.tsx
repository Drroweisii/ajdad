import React from 'react';
import { motion } from 'framer-motion';
import { Coins, DollarSign, Gem } from 'lucide-react';
import { Miner as MinerType, CurrencyType } from '../../store/minerStore';

const MINER_ICONS = {
  EMSX: Coins,
  USDT: DollarSign,
  TON: Gem,
};

const MINER_COLORS = {
  EMSX: 'text-blue-400',
  USDT: 'text-green-400',
  TON: 'text-purple-400',
};

interface MinerProps {
  miner: MinerType;
  isSelected?: boolean;
  isMergeable?: boolean;
}

export function Miner({ miner, isSelected = false, isMergeable = false }: MinerProps) {
  const Icon = MINER_ICONS[miner.type];
  const colorClass = MINER_COLORS[miner.type];

  return (
    <motion.div
      className={`w-full h-full flex flex-col items-center justify-center cursor-pointer
        ${isSelected ? 'bg-blue-500 bg-opacity-20' : ''}
        ${isMergeable ? 'bg-green-500 bg-opacity-20' : ''}
        hover:bg-gray-800 rounded-lg transition-all duration-200`}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${colorClass}`} />
      <div className="mt-1 sm:mt-2 text-xs text-center">
        <div className={`font-bold ${colorClass}`}>
          Lv.{miner.level}
        </div>
        <div className="text-gray-400 text-[10px] sm:text-xs">{miner.miningRate.toFixed(3)}/s</div>
      </div>
    </motion.div>
  );
}