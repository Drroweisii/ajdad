import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Timer } from 'lucide-react';
import { useEventsStore, GameEvent } from '../../store/eventsStore';

export function EventOverlay() {
  const activeEvent = useEventsStore((state) => state.activeEvent);
  const [timeLeft, setTimeLeft] = React.useState(0);

  React.useEffect(() => {
    if (!activeEvent?.startTime) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - activeEvent.startTime!;
      const remaining = Math.max(0, activeEvent.duration - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        useEventsStore.getState().completeEvent();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [activeEvent]);

  return (
    <AnimatePresence>
      {activeEvent && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-blue-600 rounded-lg p-4 shadow-lg flex items-center space-x-4">
            <Zap className="w-6 h-6 text-yellow-300" />
            <div>
              <h3 className="font-bold">{activeEvent.title}</h3>
              <p className="text-sm text-blue-200">{activeEvent.description}</p>
            </div>
            <div className="flex items-center text-sm text-blue-200">
              <Timer className="w-4 h-4 mr-1" />
              {Math.ceil(timeLeft / 1000)}s
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}