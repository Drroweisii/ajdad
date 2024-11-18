import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { TutorialStep } from '../../store/tutorialStore';

interface TutorialTooltipProps {
  step: TutorialStep;
  onComplete: () => void;
  onSkip: () => void;
}

export function TutorialTooltip({ step, onComplete, onSkip }: TutorialTooltipProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed bg-gray-800 rounded-lg p-4 shadow-xl max-w-xs z-50"
        style={{
          [step.position]: '100%',
        }}
      >
        <button
          onClick={onSkip}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
        <h3 className="font-bold mb-2">{step.title}</h3>
        <p className="text-sm text-gray-300 mb-4">{step.content}</p>
        <div className="flex justify-between">
          <button
            onClick={onSkip}
            className="text-sm text-gray-400 hover:text-white"
          >
            Skip Tutorial
          </button>
          <button
            onClick={onComplete}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-md text-sm"
          >
            Next
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}