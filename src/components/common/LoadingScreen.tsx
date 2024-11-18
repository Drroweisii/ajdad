import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center"
      >
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
        <p className="mt-4 text-white text-lg font-medium">Loading...</p>
      </motion.div>
    </div>
  );
}